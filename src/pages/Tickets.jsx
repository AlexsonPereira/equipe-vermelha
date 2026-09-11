import React, { useState, useEffect } from 'react';
import { fetchRifa, reservarTicket } from '../services/api';
import { motion, AnimatePresence } from 'framer-motion';
import { Ticket, X, CheckCircle, Copy, Check, ExternalLink, MessageCircle, QrCode, Send, DollarSign, ArrowRight, Clock, PartyPopper } from 'lucide-react';
import { Link } from 'react-router-dom';

const formatPhone = (value) => {
  const digits = value.replace(/\D/g, '').slice(0, 11);

  if (digits.length <= 2) {
    return digits ? `(${digits}` : '';
  }

  const areaCode = digits.slice(0, 2);
  const number = digits.slice(2);

  if (number.length <= 4) {
    return `(${areaCode}) ${number}`;
  }

  const prefixLength = number.length <= 8 ? 4 : 5;
  return `(${areaCode}) ${number.slice(0, prefixLength)}-${number.slice(prefixLength)}`;
};

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
  const [whatsappClicked, setWhatsappClicked] = useState(false);
  const [finalStep, setFinalStep] = useState(false);

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
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === 'telefone' ? formatPhone(value) : value,
    });
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

  const totalTickets = rifaData?.tickets?.length ?? 0;
  const ticketsVendidos = rifaData?.tickets?.filter(({ status }) => status === 'PAGO').length ?? 0;
  const percentualVendido = totalTickets > 0 ? (ticketsVendidos / totalTickets) * 100 : 0;

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
              <p className="text-xl font-bold text-white mb-1">Prêmio: <span className="text-gold">{'Air Fryer'}</span></p>
              <p className="text-lg text-gray-300">Valor do Bilhete: <span className="text-green-500 font-bold">{formatCurrency(rifaData.valorCentavos || 500)}</span></p>
            </div>
          )}
          <p className="text-gray-300 text-center max-w-2xl mb-12">
            Selecione um número <strong className="text-green-500">verde</strong> para reservar. Após preencher seus dados, você será redirecionado ao WhatsApp para enviar o comprovante PIX.
          </p>

          {rifaData && (
            <section className="w-full max-w-2xl mb-8 hidden" aria-labelledby="progresso-rifa">
              <div className="flex items-end justify-between gap-4 mb-2">
                <div>
                  <h2 id="progresso-rifa" className="text-sm font-bold uppercase tracking-wider text-gold">
                    Progresso da rifa
                  </h2>
                  <p className="text-sm text-gray-400">
                    <span className="font-bold text-white">{ticketsVendidos}</span> de {totalTickets} bilhetes vendidos
                  </p>
                </div>
                <span className="text-xl font-bold text-white">{Math.round(percentualVendido)}%</span>
              </div>

              <div
                className="h-4 w-full overflow-hidden rounded-full border border-white/10 bg-black/50"
                role="progressbar"
                aria-label={`${ticketsVendidos} de ${totalTickets} bilhetes vendidos`}
                aria-valuemin={0}
                aria-valuemax={totalTickets}
                aria-valuenow={ticketsVendidos}
              >
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${percentualVendido}%` }}
                  transition={{ duration: 0.8, ease: 'easeOut' }}
                  className="h-full rounded-full bg-gradient-to-r from-brand-red to-gold"
                />
              </div>
            </section>
          )}

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
          <Modal onClose={() => { setSelectedTicket(null); setReservationSuccess(null); setErrorMessage(''); setWhatsappClicked(false); setFinalStep(false); }}>
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
                {/* Animated Check Icon */}
                <motion.div
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ type: 'spring', stiffness: 200, damping: 15, delay: 0.1 }}
                  className="relative mb-5"
                >
                  <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center">
                    <CheckCircle className="w-10 h-10 text-green-500" />
                  </div>
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: [0, 1.5, 0] }}
                    transition={{ duration: 0.8, delay: 0.3 }}
                    className="absolute inset-0 rounded-full border-2 border-green-500/40"
                  />
                </motion.div>

                <motion.h2
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="text-2xl font-bold text-white mb-1"
                >
                  Reserva Confirmada!
                </motion.h2>
                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="text-sm text-gray-400 mb-5"
                >
                  Número <span className="text-brand-red font-bold">#{reservationSuccess.numero}</span> reservado com sucesso.
                </motion.p>

                {/* Stepper Progress */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="flex items-center justify-center gap-2 mb-6 w-full"
                >
                  <div className="flex flex-col items-center">
                    <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center text-white text-xs font-bold">
                      <Check className="w-4 h-4" />
                    </div>
                    <span className="text-[10px] text-green-500 mt-1 font-medium">Reserva</span>
                  </div>
                  <div className="h-[2px] w-8 bg-gradient-to-r from-green-500 to-gold rounded-full" />
                  <div className="flex flex-col items-center">
                    <motion.div
                      animate={{ boxShadow: ['0 0 0px rgba(212,175,55,0)', '0 0 12px rgba(212,175,55,0.6)', '0 0 0px rgba(212,175,55,0)'] }}
                      transition={{ repeat: Infinity, duration: 2 }}
                      className="w-8 h-8 rounded-full bg-gold flex items-center justify-center text-black text-xs font-bold"
                    >
                      2
                    </motion.div>
                    <span className="text-[10px] text-gold mt-1 font-medium">PIX</span>
                  </div>
                  <div className="h-[2px] w-8 bg-white/10 rounded-full" />
                  <div className="flex flex-col items-center">
                    <div className="w-8 h-8 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-gray-500 text-xs font-bold">
                      3
                    </div>
                    <span className="text-[10px] text-gray-500 mt-1 font-medium">Enviar</span>
                  </div>
                </motion.div>

                {/* Payment Value Badge */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.5, type: 'spring', stiffness: 300 }}
                  className="w-full bg-gradient-to-r from-gold/10 via-gold/5 to-gold/10 border border-gold/30 rounded-xl p-3 mb-5 flex items-center justify-between"
                >
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-gold/20 flex items-center justify-center">
                      <DollarSign className="w-4 h-4 text-gold" />
                    </div>
                    <span className="text-sm text-gray-300">Valor do pagamento</span>
                  </div>
                  <span className="text-xl font-bold text-gold">R$ 5,00</span>
                </motion.div>

                {/* QR Code */}
                {!finalStep && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.6 }}
                    className="relative mb-4"
                  >
                    <div className="bg-white p-2 rounded-xl w-44 h-44 mx-auto flex items-center justify-center overflow-hidden shadow-lg shadow-black/30">
                      <img src="/qrcode.PNG" alt="QR Code PIX" className="w-full h-full object-contain" />
                    </div>
                    <motion.div
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.8 }}
                      className="flex items-center justify-center gap-1 mt-2"
                    >
                      <QrCode className="w-3 h-3 text-gray-500" />
                      <span className="text-[10px] text-gray-500 uppercase tracking-wider">Escaneie ou copie a chave abaixo</span>
                    </motion.div>
                  </motion.div>
                )}

                {/* Copy PIX Button */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7 }}
                  className="w-full mb-5 relative"
                >
                  <span className="text-[10px] text-gold uppercase tracking-wider font-medium mb-1.5 block text-left">Chave PIX Copia e Cola</span>
                  <button
                    onClick={handleCopyPix}
                    className={`w-full border py-3 px-4 rounded-xl flex items-center justify-between transition-all duration-300 group ${copiedPix
                      ? 'bg-green-500/10 border-green-500/50 shadow-[0_0_15px_rgba(34,197,94,0.15)]'
                      : 'bg-black/50 border-gold/30 hover:bg-gold/10 hover:border-gold'
                      }`}
                  >
                    <span className="truncate mr-4 text-xs text-gray-300 font-mono">00020126360014br.gov...</span>
                    <div className={`flex items-center gap-1.5 text-xs font-medium flex-shrink-0 ${copiedPix ? 'text-green-500' : 'text-gold'}`}>
                      {copiedPix ? (
                        <>
                          <Check className="w-4 h-4" /> Copiado!
                        </>
                      ) : (
                        <>
                          <Copy className="w-4 h-4" /> Copiar
                        </>
                      )}
                    </div>
                  </button>
                  <AnimatePresence>
                    {copiedPix && (
                      <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.8 }}
                        animate={{ opacity: 1, y: -40, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        className="absolute top-0 right-0 bg-green-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg flex items-center gap-1"
                      >
                        <Check className="w-3 h-3" /> Chave Copiada!
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>

                {/* WhatsApp Send Button */}
                {!finalStep && (
                  <>
                    <motion.a
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.8 }}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      href={reservationSuccess.linkWhatsapp}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => setWhatsappClicked(true)}
                      className="w-full bg-gradient-to-r from-green-600 to-green-500 hover:from-green-500 hover:to-green-400 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-3 transition-all shadow-lg shadow-green-900/30 relative overflow-hidden group"
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
                      <MessageCircle className="w-5 h-5" />
                      <span>Enviar Comprovante via WhatsApp</span>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </motion.a>

                    <AnimatePresence>
                      {whatsappClicked && (
                        <motion.button
                          initial={{ opacity: 0, y: 10, height: 0 }}
                          animate={{ opacity: 1, y: 0, height: 'auto' }}
                          exit={{ opacity: 0, y: -10 }}
                          transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                          onClick={() => setFinalStep(true)}
                          className="w-full mt-3 border-2 border-dashed border-gold/40 hover:border-gold hover:bg-gold/5 text-gold font-semibold py-3 rounded-xl flex items-center justify-center gap-2 transition-all"
                        >
                          <Check className="w-4 h-4" />
                          Já enviei o comprovante
                          <ArrowRight className="w-4 h-4" />
                        </motion.button>
                      )}
                    </AnimatePresence>

                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 1 }}
                      className="text-[10px] text-gray-600 mt-3"
                    >
                      Após o pagamento, envie o comprovante para confirmação.
                    </motion.p>
                  </>
                )}

                {/* Final Step - Confirmation */}
                <AnimatePresence>
                  {finalStep && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ type: 'spring', stiffness: 200, damping: 20 }}
                      className="w-full flex flex-col items-center"
                    >
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: 'spring', stiffness: 300, damping: 15, delay: 0.2 }}
                        className="w-16 h-16 rounded-full bg-gold/20 flex items-center justify-center mb-4"
                      >
                        <Clock className="w-8 h-8 text-gold" />
                      </motion.div>

                      <motion.p
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="text-lg font-bold text-white mb-2"
                      >
                        Comprovante enviado!
                      </motion.p>

                      <motion.p
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="text-sm text-gray-400 mb-6 leading-relaxed"
                      >
                        Em instantes sua reserva será confirmada. ✨
                        <br />
                        <span className="text-gold font-medium">Fique tranquilo, você será notificado!</span>
                      </motion.p>

                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                        className="w-full bg-green-500/10 border border-green-500/30 rounded-xl p-4 mb-5 flex items-center gap-3"
                      >
                        <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center flex-shrink-0">
                          <CheckCircle className="w-5 h-5 text-green-500" />
                        </div>
                        <div className="text-left">
                          <p className="text-sm font-bold text-green-500">Número #{reservationSuccess.numero}</p>
                          <p className="text-xs text-gray-400">Pagamento de <span className="text-gold font-semibold">R$ 5,00</span> em análise</p>
                        </div>
                      </motion.div>

                      <motion.button
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6 }}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => { setSelectedTicket(null); setReservationSuccess(null); setWhatsappClicked(false); setFinalStep(false); }}
                        className="w-full bg-white/10 hover:bg-white/15 border border-white/10 text-white font-semibold py-3 rounded-xl flex items-center justify-center gap-2 transition-all"
                      >
                        Voltar para os números
                      </motion.button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}
          </Modal>
        )}
      </AnimatePresence>

      {/* WhatsApp Floating Button */}
      <a
        href="https://wa.me/5577991175001?text=Ol%C3%A1%2C%20preciso%20de%20ajuda%20com%20a%20rifa!"
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
        className="relative bg-surface-dark border border-white/10 p-6 sm:p-8 rounded-2xl w-full max-w-md shadow-2xl z-10 max-h-[85vh] overflow-y-auto"
      >
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-white">
          <X className="w-6 h-6" />
        </button>
        {children}
      </motion.div>
    </div>
  );
}
