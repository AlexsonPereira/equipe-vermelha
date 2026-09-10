import React, { useState, useEffect } from 'react';
import { fetchComprovante } from '../services/api';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle, Printer, AlertTriangle, ArrowLeft, Ticket } from 'lucide-react';

export default function Comprovante() {
  const { codigo } = useParams();
  const [comprovante, setComprovante] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    loadComprovante();
  }, [codigo]);

  const loadComprovante = async () => {
    try {
      const data = await fetchComprovante(codigo);
      setComprovante(data);
    } catch (err) {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = () => {
    window.print();
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

  if (loading) {
    return (
      <div className="min-h-screen bg-surface-dark flex items-center justify-center">
        <div className="text-gold font-bold text-xl">Verificando comprovante...</div>
      </div>
    );
  }

  if (error || !comprovante) {
    return (
      <div className="min-h-screen bg-surface-dark flex items-center justify-center p-4">
        <div className="bg-black/50 border border-red-500/30 p-8 rounded-2xl w-full max-w-md text-center">
          <AlertTriangle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">Comprovante Inválido</h2>
          <p className="text-gray-400 mb-6">Este comprovante não foi encontrado ou foi invalidado.</p>
          <Link to="/" className="text-brand-red hover:text-red-400 font-bold underline">Voltar para a página inicial</Link>
        </div>
      </div>
    );
  }

  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(window.location.href)}`;

  return (
    <div className="min-h-screen bg-surface-dark text-text-light font-sans p-4 sm:p-8 flex flex-col items-center">
      {/* Non-printable actions header */}
      <div className="w-full max-w-2xl flex justify-between items-center mb-6 print:hidden">
        <Link to="/" className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors">
          <ArrowLeft className="w-5 h-5" /> Voltar
        </Link>
        <button
          onClick={handlePrint}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg font-bold transition-colors"
        >
          <Printer className="w-5 h-5" /> Imprimir / Salvar PDF
        </button>
      </div>

      {/* Comprovante Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white text-black w-full max-w-2xl rounded-2xl overflow-hidden shadow-2xl relative print:shadow-none print:border print:border-gray-300"
      >
        <div className="bg-green-600 p-6 flex flex-col items-center text-white text-center">
          <CheckCircle className="w-16 h-16 mb-2" />
          <h1 className="text-2xl font-bold uppercase tracking-widest">Comprovante de Compra</h1>
          <p className="opacity-80 text-sm mt-1">Válido e Confirmado</p>
        </div>

        <div className="p-8">
          <div className="flex justify-between items-start mb-8 border-b border-gray-200 pb-6">
            <div>
              <div className="text-sm text-gray-500 uppercase tracking-wider mb-1">Código de Autenticidade</div>
              <div className="font-mono font-bold text-lg text-gray-800 break-all">{comprovante.codigo}</div>
            </div>
            <div className="text-right">
              <div className="text-sm text-gray-500 uppercase tracking-wider mb-1">Número</div>
              <div className="font-bold text-4xl text-brand-red">#{comprovante.numero}</div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div>
              <div className="text-sm text-gray-500 uppercase tracking-wider mb-1">Comprador</div>
              <div className="font-bold text-xl text-gray-800">{comprovante.comprador_nome}</div>
            </div>
            <div>
              <div className="text-sm text-gray-500 uppercase tracking-wider mb-1">Data do Pagamento</div>
              <div className="font-bold text-lg text-gray-800">{formatDate(comprovante.pago_em)}</div>
            </div>
            <div>
              <div className="text-sm text-gray-500 uppercase tracking-wider mb-1">Organizador</div>
              <div className="font-bold text-lg text-gray-800">MAC - Equipe Vermelha</div>
            </div>
            <div>
              <div className="text-sm text-gray-500 uppercase tracking-wider mb-1">Valor Pago</div>
              <div className="font-bold text-lg text-green-600">{formatCurrency(comprovante.valor_pago_centavos)}</div>
            </div>
            <div className="md:col-span-2">
              <div className="text-sm text-gray-500 uppercase tracking-wider mb-1">Prêmio Concorrendo</div>
              <div className="font-bold text-lg text-gray-800">{comprovante.premio || 'Air Fryer'}</div>
            </div>
          </div>

          <div className="bg-gray-100 rounded-xl p-6 flex flex-col md:flex-row items-center gap-6 mt-8">
            <img src={qrCodeUrl} alt="QR Code" className="w-32 h-32 rounded-lg bg-white p-2 border border-gray-300" />
            <div className="text-center md:text-left">
              <h3 className="font-bold text-gray-800 mb-2">Verificação Digital</h3>
              <p className="text-sm text-gray-600">
                Aponte a câmera do seu celular para o QR Code ao lado para verificar a autenticidade deste comprovante online a qualquer momento.
              </p>
            </div>
          </div>
        </div>

        <div className="bg-gray-50 p-4 text-center text-xs text-gray-400 border-t border-gray-200 flex justify-center items-center gap-2">
          <Ticket className="w-4 h-4" /> Rifa Solidária - Gerado Eletronicamente
        </div>
      </motion.div>
    </div>
  );
}
