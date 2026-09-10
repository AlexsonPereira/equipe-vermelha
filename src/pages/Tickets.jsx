import React, { useState, useEffect } from 'react';
import { fetchRifa, reservarTicket } from '../services/api';
import { motion, AnimatePresence } from 'framer-motion';
import { Ticket, X, CheckCircle, Copy, Check, ExternalLink, MessageCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Tickets() {
  const [rifaData, setRifaData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Modals and Forms
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [formData, setFormData] = useState({ nome: '', telefone: '', endereco: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [reservationSuccess, setReservationSuccess] = useState(null);
  const [copiedPix, setCopiedPix] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    loadRifaData();
  }, []);

  const loadRifaData = async () => {
    try {
      const data = await fetchRifa();
      console.log(data, "RIFA DATA");

      setRifaData(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleTicketClick = (ticket) => {
    if (ticket.status === 'LIVRE') {
      setSelectedTicket(ticket);
      setErrorMessage('');
    }
  };

  const handleFormChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleReserva = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage('');
    try {
      const result = await reservarTicket({
        numero: selectedTicket.numero,
        nome: formData.nome,
        telefone: formData.telefone,
        endereco: formData.endereco,
      });
      setReservationSuccess({ linkWhatsapp: result.linkWhatsapp, numero: selectedTicket.numero });
      setFormData({ nome: '', telefone: '', endereco: '' });
      await loadRifaData();
    } catch (error) {
      if (error.status === 409) {
        setErrorMessage(error.message);
        setTimeout(() => {
          setSelectedTicket(null);
        }, 2500);
        await loadRifaData(); // Refresh the grid
      } else {
        setErrorMessage('Erro ao reservar o número. Tente novamente.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCopyPix = () => {
    navigator.clipboard.writeText('00020126360014br.gov.bcb.pix0114+55779982336765204000053039865802BR5901N6001C62180514Equipevermelha6304C736');
    setCopiedPix(true);
    setTimeout(() => setCopiedPix(false), 3000);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'LIVRE': return 'bg-green-600 hover:bg-green-500 border-green-400';
      case 'RESERVADO': return 'bg-yellow-600 border-yellow-400 cursor-not-allowed opacity-80';
      case 'PAGO': return 'bg-brand-red border-red-400 cursor-not-allowed opacity-80';
      default: return 'bg-gray-600 border-gray-400';
    }
  };

  const formatCurrency = (cents) => {
    return (cents / 100).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  };

  return (
    <div className="min-h-screen bg-surface-dark text-text-light font-sans selection:bg-brand-red selection:text-white pb-20">
      {/* Header */}
      <header className="p-4 sm:p-6 flex justify-between items-center bg-black/50 border-b border-white/5">
        <Link to="/" className="text-gold font-bold tracking-widest uppercase flex items-center gap-2 hover:text-white transition-colors">
          <Ticket className="w-5 h-5" />
          Rifa Solidária
        </Link>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 mt-8 sm:mt-12">
        <div className="flex flex-col items-center">
          <h1 className="font-marker text-5xl md:text-7xl text-brand-red mb-4 text-center">Escolha seu Número</h1>
          {rifaData && (
            <div className="mb-6 text-center">
              <p className="text-xl font-bold text-white mb-1">Prêmio: <span className="text-gold">{rifaData.premio || 'Air Fryer Mondial'}</span></p>
              <p className="text-lg text-gray-300">Valor do Bilhete: <span className="text-green-500 font-bold">{formatCurrency(rifaData.valorCentavos || 500)}</span></p>
            </div>
          )}
          <p className="text-gray-300 text-center max-w-2xl mb-12">
            Selecione um número <strong className="text-green-500">verde</strong> para reservar. Após preencher seus dados, você será redirecionado ao WhatsApp para enviar o comprovante PIX.
          </p>

          <div className="flex gap-4 mb-8 text-sm">
            <div className="flex items-center gap-2"><div className="w-4 h-4 bg-green-600 rounded"></div> Livre</div>
            <div className="flex items-center gap-2"><div className="w-4 h-4 bg-yellow-600 rounded"></div> Reservado</div>
            <div className="flex items-center gap-2"><div className="w-4 h-4 bg-brand-red rounded"></div> Pago</div>
          </div>

          {loading ? (
            <div className="text-gold mt-10">Carregando números...</div>
          ) : (
            <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-10 gap-3 w-full">
              {rifaData?.tickets?.map((t) => (
                <motion.button
                  key={t.numero}
                  whileHover={t.status === 'LIVRE' ? { scale: 1.05 } : {}}
                  whileTap={t.status === 'LIVRE' ? { scale: 0.95 } : {}}
                  onClick={() => handleTicketClick(t)}
                  disabled={t.status !== 'LIVRE'}
                  className={`aspect-square flex items-center justify-center rounded-lg border-2 font-bold text-white shadow-lg transition-colors ${getStatusColor(t.status)}`}
                >
                  {t.numero}
                </motion.button>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Reserva Modal */}
      <AnimatePresence>
        {selectedTicket && (
          <Modal onClose={() => { setSelectedTicket(null); setReservationSuccess(null); setErrorMessage(''); }}>
            {!reservationSuccess ? (
              <>
                <h2 className="text-2xl font-bold text-white mb-2">
                  Reservar Número <span className="text-brand-red">#{selectedTicket.numero}</span>
                </h2>
                <p className="text-sm text-gray-400 mb-6">Preencha seus dados para garantir a reserva.</p>

                {errorMessage && (
                  <div className="bg-red-500/20 text-red-400 border border-red-500/50 p-3 rounded-lg mb-4 text-sm font-bold">
                    {errorMessage}
                  </div>
                )}

                <form onSubmit={handleReserva} className="flex flex-col gap-4">
                  <div>
                    <label className="text-xs text-gold uppercase tracking-wider mb-1 block">Nome Completo *</label>
                    <input
                      type="text" name="nome" value={formData.nome} onChange={handleFormChange} required
                      className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-white focus:border-gold outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-gold uppercase tracking-wider mb-1 block">Telefone (WhatsApp) *</label>
                    <input
                      type="tel" name="telefone" value={formData.telefone} onChange={handleFormChange} required
                      className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-white focus:border-gold outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-gold uppercase tracking-wider mb-1 block">Endereço</label>
                    <input
                      type="text" name="endereco" value={formData.endereco} onChange={handleFormChange}
                      className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-white focus:border-gold outline-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="mt-4 bg-brand-red text-white font-bold rounded-lg py-4 shadow-[0_0_15px_rgba(179,0,0,0.4)] hover:bg-red-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {isSubmitting ? 'Processando...' : (
                      <>
                        <CheckCircle className="w-5 h-5" /> Confirmar Reserva
                      </>
                    )}
                  </button>
                </form>
              </>
            ) : (
              <div className="flex flex-col items-center text-center">
                <CheckCircle className="w-12 h-12 text-green-500 mb-4" />
                <h2 className="text-2xl font-bold text-white mb-2">Reserva Confirmada!</h2>
                <p className="text-sm text-gray-400 mb-6">
                  Seu número <span className="text-brand-red font-bold">#{reservationSuccess.numero}</span> foi reservado. Realize o pagamento via PIX e envie o comprovante.
                </p>

                <div className="bg-white p-2 rounded-xl mb-4 w-48 h-48 mx-auto flex items-center justify-center overflow-hidden">
                  <img src="/qrcode.PNG" alt="QR Code PIX" className="w-full h-full object-contain" />
                </div>

                <div className="w-full mb-6 relative">
                  <button
                    onClick={handleCopyPix}
                    className="w-full bg-black/50 border border-gold/50 text-white font-mono py-3 px-4 rounded-xl flex items-center justify-between hover:bg-gold/10 hover:border-gold transition-all group"
                  >
                    <span className="truncate mr-4 text-xs text-gray-300">00020126360014br.gov...</span>
                    {copiedPix ? <Check className="text-green-500 w-5 h-5 flex-shrink-0" /> : <Copy className="text-gold w-5 h-5 flex-shrink-0" />}
                  </button>
                  <AnimatePresence>
                    {copiedPix && (
                      <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.8 }}
                        animate={{ opacity: 1, y: -40, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        className="absolute top-0 right-0 bg-green-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg flex items-center gap-1"
                      >
                        <Check className="w-3 h-3" /> Copiado!
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                <a
                  href={reservationSuccess.linkWhatsapp}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => { setSelectedTicket(null); setReservationSuccess(null); }}
                  className="w-full bg-green-600 hover:bg-green-500 text-white font-bold py-4 rounded-lg flex items-center justify-center gap-2 transition-colors shadow-lg shadow-green-900/20"
                >
                  Enviar Comprovante <ExternalLink className="w-5 h-5" />
                </a>
              </div>
            )}
          </Modal>
        )}
      </AnimatePresence>

      {/* WhatsApp Floating Button */}
      <a
        href="https://wa.me/5577998233676?text=Ol%C3%A1%2C%20preciso%20de%20ajuda%20com%20a%20rifa!"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-50 flex items-center gap-3 bg-green-500 hover:bg-green-400 text-white px-4 py-3 rounded-full shadow-lg shadow-green-900/30 transition-all hover:scale-105"
      >
        <span className="font-bold text-sm hidden sm:block">Precisa de ajuda?</span>
        <MessageCircle className="w-6 h-6" />
      </a>
    </div>
  );
}

// Subcomponents

export function Modal({ children, onClose }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        className="relative bg-surface-dark border border-white/10 p-6 sm:p-8 rounded-2xl w-full max-w-md shadow-2xl z-10"
      >
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-white">
          <X className="w-6 h-6" />
        </button>
        {children}
      </motion.div>
    </div>
  );
}
