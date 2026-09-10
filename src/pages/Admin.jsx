import React, { useState, useEffect } from 'react';
import { adminLogin, fetchAdminTickets, updateTicketStatus } from '../services/api';
import { generatePDF } from '../services/pdfGenerator';
import { motion } from 'framer-motion';
import { Shield, ExternalLink, Copy, MessageCircle, LogOut, Check, FileText, Download, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Admin() {
  const [adminSenha, setAdminSenha] = useState('');
  const [adminToken, setAdminToken] = useState(localStorage.getItem('adminToken') || null);
  const [adminTickets, setAdminTickets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [sendingWhatsApp, setSendingWhatsApp] = useState(null); // numero do ticket sendo enviado

  useEffect(() => {
    if (adminToken) {
      loadAdminTickets();
    }
  }, [adminToken]);

  const loadAdminTickets = async () => {
    setLoading(true);
    setErrorMessage('');
    try {
      const data = await fetchAdminTickets(adminToken);
      setAdminTickets(data);
    } catch (error) {
      if (error.status === 401 || error.status === 403) {
        handleLogout();
      } else {
        setErrorMessage(error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleAdminLogin = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    try {
      const token = await adminLogin(adminSenha);
      setAdminToken(token);
      localStorage.setItem('adminToken', token);
      setAdminSenha('');
    } catch (error) {
      setErrorMessage('Senha incorreta.');
    }
  };

  const handleLogout = () => {
    setAdminToken(null);
    localStorage.removeItem('adminToken');
  };

  const handleUpdateStatus = async (numero, currentStatus, newStatus) => {
    if (currentStatus === 'PAGO' && (newStatus === 'LIVRE' || newStatus === 'RESERVADO')) {
      const confirm = window.confirm('Atenção: Você está alterando o status de um bilhete já PAGO. O comprovante gerado anteriormente será invalidado. Deseja continuar?');
      if (!confirm) return;
    }

    try {
      const result = await updateTicketStatus(numero, newStatus, adminToken);
      await loadAdminTickets();

      // Se confirmou pagamento, gerar PDF e enviar via WhatsApp
      if (newStatus === 'PAGO' && result?.ticket) {
        await handleEnviarComprovante(result.ticket);
      }
    } catch (error) {
      if (error.status === 401 || error.status === 403) {
        handleLogout();
      } else {
        alert('Erro ao atualizar status.');
      }
    }
  };

  const handleEnviarComprovante = async (ticket) => {
    setSendingWhatsApp(ticket.numero);
    try {
      const pdfFile = generatePDF(ticket);
      const telefone = (ticket.comprador_telefone || '').replace(/\D/g, '');
      const telefoneCompleto = telefone.startsWith('55') ? telefone : `55${telefone}`;
      const nome = ticket.comprador_nome || 'Comprador';
      const mensagem = `Olá ${nome}! Seu pagamento do bilhete #${ticket.numero} foi confirmado. Segue seu comprovante em PDF.`;

      // Tentar usar a Web Share API (funciona em celulares)
      if (navigator.canShare && navigator.canShare({ files: [pdfFile] })) {
        await navigator.share({
          title: `Comprovante Rifa #${ticket.numero}`,
          text: mensagem,
          files: [pdfFile],
        });
      } else {
        // Fallback para PC: baixar PDF + abrir WhatsApp Web
        const url = URL.createObjectURL(pdfFile);
        const a = document.createElement('a');
        a.href = url;
        a.download = pdfFile.name;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        const whatsappUrl = `https://wa.me/${telefoneCompleto}?text=${encodeURIComponent(mensagem)}`;
        window.open(whatsappUrl, '_blank');
      }
    } catch (error) {
      // Se o usuario cancelou o share, nao mostrar erro
      if (error.name !== 'AbortError') {
        console.error('Erro ao enviar comprovante:', error);
        alert('Não foi possível compartilhar. O PDF foi baixado.');
      }
    } finally {
      setSendingWhatsApp(null);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    alert('Link copiado!');
  };

  const formatCurrency = (cents) => {
    if (!cents) return '-';
    return (cents / 100).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit', month: '2-digit', year: 'numeric',
      hour: '2-digit', minute: '2-digit'
    });
  };

  if (!adminToken) {
    return (
      <div className="min-h-screen bg-surface-dark flex items-center justify-center p-4 selection:bg-brand-red selection:text-white">
        <motion.div 
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          className="bg-black/50 border border-white/10 p-8 rounded-2xl w-full max-w-md shadow-2xl"
        >
          <div className="text-center mb-6">
            <Shield className="w-12 h-12 text-gold mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-white">Acesso Administrativo</h2>
          </div>
          {errorMessage && (
            <div className="bg-red-500/20 text-red-400 p-3 rounded mb-4 text-center text-sm">{errorMessage}</div>
          )}
          <form onSubmit={handleAdminLogin} className="flex flex-col gap-4">
            <input 
              type="password" 
              placeholder="Senha de Acesso"
              value={adminSenha}
              onChange={(e) => setAdminSenha(e.target.value)}
              className="bg-black/50 border border-white/10 rounded-lg p-3 text-white focus:border-gold outline-none"
              required
            />
            <button 
              type="submit"
              className="bg-gold text-surface-dark font-bold rounded-lg py-3 hover:bg-yellow-500 transition-colors"
            >
              Entrar
            </button>
          </form>
          <div className="mt-6 text-center">
             <Link to="/" className="text-gray-400 hover:text-white text-sm">Voltar para o site</Link>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface-dark text-text-light font-sans p-4 sm:p-8 selection:bg-brand-red selection:text-white">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <div className="flex items-center gap-3">
            <Shield className="w-8 h-8 text-gold" />
            <h1 className="text-3xl font-bold text-white">Painel Administrativo</h1>
          </div>
          <button onClick={handleLogout} className="flex items-center gap-2 text-brand-red hover:text-red-400 font-bold uppercase transition-colors">
            <LogOut className="w-4 h-4" /> Sair
          </button>
        </div>

        {errorMessage && (
          <div className="bg-red-500/20 border border-red-500/50 text-red-400 p-4 rounded-lg mb-6">
            {errorMessage}
          </div>
        )}

        <div className="bg-black/40 border border-white/5 rounded-xl overflow-hidden overflow-x-auto shadow-2xl">
          <table className="w-full text-left text-sm text-gray-300 min-w-[1000px]">
            <thead className="bg-black/60 text-gold uppercase text-xs">
              <tr>
                <th className="p-4 w-16">Nº</th>
                <th className="p-4">Status</th>
                <th className="p-4">Comprador</th>
                <th className="p-4">Contato</th>
                <th className="p-4">Pagamento</th>
                <th className="p-4 text-center">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {loading ? (
                <tr><td colSpan="6" className="p-8 text-center text-gold">Carregando...</td></tr>
              ) : adminTickets.filter(t => t.status !== 'LIVRE').length === 0 ? (
                <tr><td colSpan="6" className="p-8 text-center text-gray-500">Nenhuma reserva encontrada.</td></tr>
              ) : (
                adminTickets.filter(t => t.status !== 'LIVRE').map((t) => {
                  return (
                  <tr key={t.numero} className="hover:bg-white/[0.02] transition-colors">
                    <td className="p-4 font-bold text-white text-lg">#{t.numero}</td>
                    <td className="p-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${t.status === 'PAGO' ? 'bg-brand-red/20 text-brand-red border border-brand-red/30' : 'bg-yellow-600/20 text-yellow-500 border border-yellow-600/30'}`}>
                        {t.status}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="font-bold text-white">{t.comprador_nome}</div>
                      <div className="text-xs text-gray-500">{t.comprador_endereco || 'Sem endereço'}</div>
                    </td>
                    <td className="p-4">{t.comprador_telefone}</td>
                    <td className="p-4">
                      {t.status === 'PAGO' ? (
                        <div className="flex flex-col gap-1 text-xs">
                          <span className="text-green-400 font-bold">{formatCurrency(t.valor_pago_centavos)}</span>
                          <span className="text-gray-400">{formatDate(t.pago_em)}</span>
                        </div>
                      ) : (
                        <span className="text-gray-500 text-xs italic">Aguardando PIX</span>
                      )}
                    </td>
                    <td className="p-4 flex flex-wrap gap-2 justify-center items-center">
                      {t.status === 'RESERVADO' && (
                        <button onClick={() => handleUpdateStatus(t.numero, t.status, 'PAGO')} className="bg-green-600 hover:bg-green-500 text-white px-4 py-2 rounded-lg text-xs font-bold shadow-lg transition-all flex items-center gap-1">
                          <Check className="w-4 h-4" /> Confirmar Pagamento
                        </button>
                      )}
                      
                      {t.status === 'PAGO' && t.comprovante_codigo && (
                        <>
                          <Link to={`/comprovante/${t.comprovante_codigo}`} target="_blank" className="bg-blue-600/20 hover:bg-blue-600/40 text-blue-400 border border-blue-600/30 px-3 py-1.5 rounded text-xs flex items-center gap-1 transition-colors">
                            <ExternalLink className="w-3 h-3" /> Ver
                          </Link>
                          <button onClick={() => copyToClipboard(`${window.location.origin}/comprovante/${t.comprovante_codigo}`)} className="bg-white/5 hover:bg-white/10 text-gray-300 border border-white/10 px-3 py-1.5 rounded text-xs flex items-center gap-1 transition-colors">
                            <Copy className="w-3 h-3" /> Copiar Link
                          </button>
                          <button
                            onClick={() => handleEnviarComprovante(t)}
                            disabled={sendingWhatsApp === t.numero}
                            className="bg-green-500/20 hover:bg-green-500/40 text-green-400 border border-green-500/30 px-3 py-1.5 rounded text-xs flex items-center gap-1 transition-colors disabled:opacity-50"
                          >
                            {sendingWhatsApp === t.numero ? (
                              <><Loader2 className="w-3 h-3 animate-spin" /> Enviando...</>
                            ) : (
                              <><FileText className="w-3 h-3" /> PDF + WhatsApp</>
                            )}
                          </button>
                        </>
                      )}

                      <button onClick={() => handleUpdateStatus(t.numero, t.status, 'LIVRE')} className="bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 px-3 py-1.5 rounded text-xs transition-colors ml-auto">
                        Liberar (Cancelar)
                      </button>
                    </td>
                  </tr>
                )})
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
