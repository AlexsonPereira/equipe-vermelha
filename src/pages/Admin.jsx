import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Check, ExternalLink, FileText, Loader2, LogOut, Search, Shield, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { adminLogin, cancelarPedido, confirmarPedido, fetchAdminPedidos, liberarTicketLegado } from '../services/api';
import { generatePedidoPDF } from '../services/pdfGenerator';
import { apenasDigitos, formatCurrency, formatDateTime, formatPhone, linkWhatsappContato } from '../utils/formatters';

const FILTROS = [
  { id: 'pendentes', label: 'Pendentes', aceita: (p) => p.status === 'pendente' },
  { id: 'pagos', label: 'Pagos', aceita: (p) => p.status === 'pago' },
  { id: 'cancelados', label: 'Cancelados', aceita: (p) => p.status === 'cancelado' || p.status === 'expirado' },
  { id: 'todos', label: 'Todos', aceita: () => true },
];

const BADGES = {
  pendente: { label: 'Aguardando PIX', classe: 'bg-yellow-600/20 text-yellow-500 border-yellow-600/30' },
  vencido: { label: 'Vencido', classe: 'bg-orange-500/20 text-orange-400 border-orange-500/30' },
  pago: { label: 'Pago', classe: 'bg-green-600/20 text-green-400 border-green-600/30' },
  cancelado: { label: 'Cancelado', classe: 'bg-white/5 text-gray-400 border-white/10' },
  expirado: { label: 'Expirado', classe: 'bg-white/5 text-gray-400 border-white/10' },
};

const badgeDoPedido = (pedido) =>
  BADGES[pedido.status === 'pendente' && pedido.vencido ? 'vencido' : pedido.status] ?? BADGES.cancelado;

const correspondeBusca = (pedido, termo) => {
  const texto = termo.trim().toLowerCase();
  if (!texto) return true;
  const digitos = apenasDigitos(texto);
  return (
    pedido.usuarioNome.toLowerCase().includes(texto) ||
    pedido.codigo.toLowerCase().includes(texto.replace('#', '')) ||
    (digitos.length >= 4 && pedido.usuarioTelefone.includes(digitos)) ||
    (digitos.length > 0 && pedido.tickets.some((t) => String(t.numero) === digitos))
  );
};

const mensagemComprovante = (pedido) => {
  const numeros = pedido.tickets.map((t) => t.numero).join(', ');
  const links = pedido.tickets
    .map((t) => `#${t.numero}: ${window.location.origin}/comprovante/${t.comprovante_codigo}`)
    .join('\n');
  return `Olá ${pedido.usuarioNome}! Seu pagamento do pedido #${pedido.codigo} foi confirmado. Números: ${numeros}.\nComprovantes:\n${links}`;
};

const baixarArquivo = (arquivo) => {
  const url = URL.createObjectURL(arquivo);
  const a = document.createElement('a');
  a.href = url;
  a.download = arquivo.name;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

function LinhaPedido({ pedido, ocupado, onConfirmar, onCancelar, onEnviar }) {
  const badge = badgeDoPedido(pedido);
  const telefone = formatPhone(pedido.usuarioTelefone);

  return (
    <tr className="hover:bg-white/[0.02] transition-colors align-top">
      <td className="p-4">
        <div className="font-bold text-white text-lg">#{pedido.codigo}</div>
        <div className="text-xs text-gray-500">{formatDateTime(pedido.criadoEm)}</div>
      </td>
      <td className="p-4">
        <div className="font-bold text-white">{pedido.usuarioNome}</div>
        {telefone ? (
          <a href={linkWhatsappContato(pedido.usuarioTelefone)} target="_blank" rel="noopener noreferrer" className="text-xs text-green-400 hover:underline">
            {telefone}
          </a>
        ) : (
          <div className="text-xs text-gray-500">Sem telefone</div>
        )}
        {pedido.endereco && <div className="text-xs text-gray-500">{pedido.endereco}</div>}
        {pedido.usuarioEmail && <div className="text-xs text-gray-500">{pedido.usuarioEmail}</div>}
      </td>
      <td className="p-4">
        {pedido.tickets.length === 0 ? (
          <span className="text-xs text-gray-500 italic">Números liberados</span>
        ) : pedido.status === 'pago' ? (
          <div className="flex flex-wrap gap-1">
            {pedido.tickets.map((t) => (
              <Link
                key={t.numero}
                to={`/comprovante/${t.comprovante_codigo}`}
                target="_blank"
                className="bg-blue-600/20 hover:bg-blue-600/40 text-blue-300 border border-blue-600/30 px-2 py-1 rounded text-xs font-bold flex items-center gap-1 transition-colors"
              >
                #{t.numero} <ExternalLink className="w-3 h-3" />
              </Link>
            ))}
          </div>
        ) : (
          <span className="font-bold text-white">{pedido.tickets.map((t) => t.numero).join(', ')}</span>
        )}
      </td>
      <td className="p-4 font-bold text-green-400">{formatCurrency(pedido.valorTotalCentavos)}</td>
      <td className="p-4">
        <span className={`px-3 py-1 rounded-full text-xs font-bold border ${badge.classe}`}>{badge.label}</span>
        {pedido.status === 'pendente' && (
          <div className="text-[11px] text-gray-500 mt-2">
            {pedido.vencido ? 'Venceu' : 'Vence'} em {formatDateTime(pedido.expiraEm)}
          </div>
        )}
      </td>
      <td className="p-4">
        <div className="flex flex-wrap gap-2 justify-center items-center">
          {ocupado && <Loader2 className="w-4 h-4 animate-spin text-gold" />}
          {pedido.status === 'pendente' && (
            <>
              <button
                disabled={ocupado}
                onClick={() => onConfirmar(pedido)}
                className="bg-green-600 hover:bg-green-500 text-white px-4 py-2 rounded-lg text-xs font-bold shadow-lg transition-all flex items-center gap-1 disabled:opacity-50"
              >
                <Check className="w-4 h-4" /> Confirmar pagamento
              </button>
              <button
                disabled={ocupado}
                onClick={() => onCancelar(pedido)}
                className="bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 px-3 py-2 rounded-lg text-xs transition-colors flex items-center gap-1 disabled:opacity-50"
              >
                <X className="w-3 h-3" /> Cancelar e liberar números
              </button>
            </>
          )}
          {pedido.status === 'pago' && (
            <button
              disabled={ocupado}
              onClick={() => onEnviar(pedido)}
              className="bg-green-500/20 hover:bg-green-500/40 text-green-400 border border-green-500/30 px-3 py-2 rounded-lg text-xs flex items-center gap-1 transition-colors disabled:opacity-50"
            >
              <FileText className="w-3 h-3" /> PDF + WhatsApp
            </button>
          )}
        </div>
      </td>
    </tr>
  );
}

export default function Admin() {
  const [adminSenha, setAdminSenha] = useState('');
  const [adminToken, setAdminToken] = useState(() => localStorage.getItem('adminToken'));
  const [dados, setDados] = useState({ pedidos: [], ticketsLegados: [] });
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [filtro, setFiltro] = useState('pendentes');
  const [busca, setBusca] = useState('');
  const [processando, setProcessando] = useState(null); // id do pedido ou "legado-<numero>"
  // Compartilhar e abrir janelas exigem um clique recente; depois da confirmação na API, pedimos um novo clique.
  const [pedidoParaEnviar, setPedidoParaEnviar] = useState(null);

  const handleLogout = useCallback(() => {
    setAdminToken(null);
    localStorage.removeItem('adminToken');
  }, []);

  const loadDados = useCallback(async () => {
    if (!adminToken) return;
    setLoading(true);
    setErrorMessage('');
    try {
      setDados(await fetchAdminPedidos(adminToken));
    } catch (error) {
      if (error.status === 401 || error.status === 403) {
        handleLogout();
      } else {
        setErrorMessage(error.message);
      }
    } finally {
      setLoading(false);
    }
  }, [adminToken, handleLogout]);

  useEffect(() => {
    loadDados();
  }, [loadDados]);

  const tratarErro = (error, mensagemPadrao) => {
    if (error.status === 401 || error.status === 403) {
      handleLogout();
    } else {
      alert(error.message || mensagemPadrao);
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
    } catch {
      setErrorMessage('Senha incorreta.');
    }
  };

  const handleEnviarComprovante = async (pedido) => {
    setProcessando(pedido.id);
    const pdfFile = generatePedidoPDF(pedido);
    const mensagem = mensagemComprovante(pedido);

    try {
      // Web Share envia o PDF direto no celular.
      if (navigator.canShare && navigator.canShare({ files: [pdfFile] })) {
        await navigator.share({ title: `Comprovante pedido #${pedido.codigo}`, text: mensagem, files: [pdfFile] });
        return;
      }
    } catch (error) {
      if (error.name === 'AbortError') return;
      console.error('Erro ao compartilhar comprovante:', error);
    } finally {
      setProcessando(null);
    }

    // Desktop, ou compartilhamento recusado: baixa o PDF e abre o WhatsApp Web com a mensagem.
    baixarArquivo(pdfFile);
    const janela = window.open(`${linkWhatsappContato(pedido.usuarioTelefone)}?text=${encodeURIComponent(mensagem)}`, '_blank');
    if (!janela) {
      alert('O navegador bloqueou a abertura do WhatsApp. O PDF foi baixado; permita pop-ups ou use o botão "PDF + WhatsApp".');
    }
  };

  const enviarComprovantePendente = () => {
    const pedido = pedidoParaEnviar;
    setPedidoParaEnviar(null);
    handleEnviarComprovante(pedido);
  };

  const handleConfirmar = async (pedido) => {
    const confirmou = window.confirm(
      `Confirmar o pagamento de ${formatCurrency(pedido.valorTotalCentavos)} do pedido #${pedido.codigo} (${pedido.usuarioNome})?`
    );
    if (!confirmou) return;

    setProcessando(pedido.id);
    try {
      const { pedido: confirmado } = await confirmarPedido(pedido.id, adminToken);
      await loadDados();
      setPedidoParaEnviar(confirmado);
    } catch (error) {
      tratarErro(error, 'Erro ao confirmar pagamento.');
    } finally {
      setProcessando(null);
    }
  };

  const handleCancelar = async (pedido) => {
    const numeros = pedido.tickets.map((t) => t.numero).join(', ');
    const confirmou = window.confirm(
      `Cancelar o pedido #${pedido.codigo} de ${pedido.usuarioNome} e liberar os números ${numeros}?`
    );
    if (!confirmou) return;

    setProcessando(pedido.id);
    try {
      await cancelarPedido(pedido.id, adminToken);
      await loadDados();
    } catch (error) {
      tratarErro(error, 'Erro ao cancelar pedido.');
    } finally {
      setProcessando(null);
    }
  };

  const handleLiberarLegado = async (ticket) => {
    const confirmou = window.confirm(
      `Liberar o número ${ticket.numero} (${ticket.comprador_nome || 'sem nome'})? Os dados do comprador serão apagados.`
    );
    if (!confirmou) return;

    setProcessando(`legado-${ticket.numero}`);
    try {
      await liberarTicketLegado(ticket.numero, adminToken);
      await loadDados();
    } catch (error) {
      tratarErro(error, 'Erro ao liberar número.');
    } finally {
      setProcessando(null);
    }
  };

  const filtroAtual = FILTROS.find((f) => f.id === filtro) ?? FILTROS[0];

  const pedidosVisiveis = useMemo(
    () => dados.pedidos.filter((p) => filtroAtual.aceita(p) && correspondeBusca(p, busca)),
    [dados.pedidos, filtroAtual, busca]
  );

  const resumo = useMemo(() => {
    const pagos = dados.pedidos.filter((p) => p.status === 'pago');
    return {
      vendidos: pagos.reduce((total, p) => total + p.tickets.length, 0),
      arrecadado: pagos.reduce((total, p) => total + p.valorTotalCentavos, 0),
    };
  }, [dados.pedidos]);

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

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          <div className="bg-black/40 border border-white/5 rounded-xl p-4">
            <p className="text-xs text-gold uppercase tracking-wider">Números vendidos</p>
            <p className="text-3xl font-bold text-white">{resumo.vendidos}</p>
          </div>
          <div className="bg-black/40 border border-white/5 rounded-xl p-4">
            <p className="text-xs text-gold uppercase tracking-wider">Total arrecadado</p>
            <p className="text-3xl font-bold text-green-400">{formatCurrency(resumo.arrecadado)}</p>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-4 lg:items-center lg:justify-between mb-4">
          <div className="flex flex-wrap gap-2">
            {FILTROS.map((f) => (
              <button
                key={f.id}
                onClick={() => setFiltro(f.id)}
                className={`px-4 py-2 rounded-lg text-sm font-bold transition-colors ${filtro === f.id ? 'bg-gold text-surface-dark' : 'bg-white/5 text-gray-300 hover:bg-white/10'}`}
              >
                {f.label} ({dados.pedidos.filter(f.aceita).length})
              </button>
            ))}
          </div>
          <label className="relative w-full lg:w-80">
            <Search className="w-4 h-4 text-gray-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="search"
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              placeholder="Nome, telefone, código ou número"
              className="w-full bg-black/50 border border-white/10 rounded-lg py-2 pl-9 pr-3 text-white focus:border-gold outline-none"
            />
          </label>
        </div>

        <div className="bg-black/40 border border-white/5 rounded-xl overflow-hidden overflow-x-auto shadow-2xl">
          <table className="w-full text-left text-sm text-gray-300 min-w-[1000px]">
            <thead className="bg-black/60 text-gold uppercase text-xs">
              <tr>
                <th className="p-4">Pedido</th>
                <th className="p-4">Comprador</th>
                <th className="p-4">Números</th>
                <th className="p-4">Total</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-center">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {loading ? (
                <tr><td colSpan="6" className="p-8 text-center text-gold">Carregando...</td></tr>
              ) : pedidosVisiveis.length === 0 ? (
                <tr><td colSpan="6" className="p-8 text-center text-gray-500">Nenhum pedido encontrado.</td></tr>
              ) : (
                pedidosVisiveis.map((pedido) => (
                  <LinhaPedido
                    key={pedido.id}
                    pedido={pedido}
                    ocupado={processando === pedido.id}
                    onConfirmar={handleConfirmar}
                    onCancelar={handleCancelar}
                    onEnviar={handleEnviarComprovante}
                  />
                ))
              )}
            </tbody>
          </table>
        </div>

        {dados.ticketsLegados.length > 0 && (
          <section className="mt-10">
            <h2 className="text-xl font-bold text-white mb-1">Registros legados</h2>
            <p className="text-sm text-gray-400 mb-4">Números reservados ou vendidos antes dos pedidos. Só é possível liberá-los.</p>
            <div className="bg-black/40 border border-white/5 rounded-xl overflow-x-auto">
              <table className="w-full text-left text-sm text-gray-300 min-w-[700px]">
                <thead className="bg-black/60 text-gold uppercase text-xs">
                  <tr>
                    <th className="p-4">Nº</th>
                    <th className="p-4">Status</th>
                    <th className="p-4">Comprador</th>
                    <th className="p-4">Telefone</th>
                    <th className="p-4 text-center">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {dados.ticketsLegados.map((t) => (
                    <tr key={t.numero}>
                      <td className="p-4 font-bold text-white">#{t.numero}</td>
                      <td className="p-4">{t.status}</td>
                      <td className="p-4">{t.comprador_nome || '—'}</td>
                      <td className="p-4">{formatPhone(t.comprador_telefone || '') || '—'}</td>
                      <td className="p-4 text-center">
                        <button
                          disabled={processando === `legado-${t.numero}`}
                          onClick={() => handleLiberarLegado(t)}
                          className="bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 px-3 py-1.5 rounded text-xs transition-colors disabled:opacity-50"
                        >
                          Liberar número
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}
      </div>

      {pedidoParaEnviar && (
        <div className="fixed bottom-4 left-4 right-4 sm:left-auto sm:max-w-md z-50 bg-green-700 text-white rounded-xl shadow-2xl p-4 flex flex-col gap-3">
          <p className="font-bold">Pagamento do pedido #{pedidoParaEnviar.codigo} confirmado.</p>
          <div className="flex gap-2">
            <button
              onClick={enviarComprovantePendente}
              className="flex-1 bg-white text-green-800 font-bold rounded-lg py-2 flex items-center justify-center gap-2 hover:bg-green-50 transition-colors"
            >
              <FileText className="w-4 h-4" /> Enviar comprovante
            </button>
            <button
              onClick={() => setPedidoParaEnviar(null)}
              className="px-4 rounded-lg border border-white/40 hover:bg-white/10 transition-colors"
            >
              Depois
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
