import React, { useState, useEffect } from 'react';
import { fetchRifa, checkoutPix } from '../services/api';
import { motion, AnimatePresence } from 'framer-motion';
import { Ticket, X, CheckCircle, Copy, QrCode, DollarSign, ArrowRight, Clock, MessageCircle, Check, Search } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

const formatPhone = (value) => {
  const digits = value.replace(/\D/g, '').slice(0, 11);
  if (digits.length <= 2) return digits ? `(${digits}` : '';
  const areaCode = digits.slice(0, 2);
  const number = digits.slice(2);
  if (number.length <= 4) return `(${areaCode}) ${number}`;
  const prefixLength = number.length <= 8 ? 4 : 5;
  return `(${areaCode}) ${number.slice(0, prefixLength)}-${number.slice(prefixLength)}`;
};

const formatCpf = (value) => {
  const digits = value.replace(/\D/g, '').slice(0, 11);
  return digits.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
};

export default function Tickets() {
  const navigate = useNavigate();
  const [rifaData, setRifaData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Multi-select state
  const [selectedTickets, setSelectedTickets] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [formData, setFormData] = useState({ nome: '', telefone: '', email: '', cpf: '', endereco: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [pixData, setPixData] = useState(null);
  const [copiedPix, setCopiedPix] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [paymentConfirmed, setPaymentConfirmed] = useState(false);
  const [timeLeft, setTimeLeft] = useState(300);

  useEffect(() => {
    loadRifaData();
  }, []);

  useEffect(() => {
    let timer;
    if (isModalOpen && pixData && !paymentConfirmed && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isModalOpen, pixData, paymentConfirmed, timeLeft]);

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  useEffect(() => {
    let interval;
    if (isModalOpen && pixData && !paymentConfirmed) {
      interval = setInterval(async () => {
        try {
          const data = await fetchRifa();
          setRifaData(data);
          
          const allPaid = selectedTickets.length > 0 && selectedTickets.every(st => {
            const ticket = data.tickets.find(t => t.numero === st.numero);
            return ticket?.status === 'PAGO';
          });

          if (allPaid) {
            setPaymentConfirmed(true);
          }
        } catch (error) {
          console.error('Erro no polling:', error);
        }
      }, 3000); // Check every 3 seconds
    }
    return () => clearInterval(interval);
  }, [isModalOpen, pixData, paymentConfirmed, selectedTickets]);

  const loadRifaData = async () => {
    try {
      const data = await fetchRifa();
      setRifaData(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleTicketClick = (ticket) => {
    if (ticket.status === 'LIVRE') {
      setSelectedTickets(prev =>
        prev.some(t => t.numero === ticket.numero)
          ? prev.filter(t => t.numero !== ticket.numero)
          : [...prev, ticket]
      );
      setErrorMessage('');
    }
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    let formattedValue = value;
    if (name === 'telefone') formattedValue = formatPhone(value);
    if (name === 'cpf') formattedValue = formatCpf(value);

    setFormData({
      ...formData,
      [name]: formattedValue,
    });
  };

  const handleReserva = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage('');
    try {
      const result = await checkoutPix({
        numeros: selectedTickets.map(t => t.numero),
        comprador: {
          nome: formData.nome,
          telefone: formData.telefone,
          email: formData.email,
          cpf: formData.cpf,
          endereco: formData.endereco,
        }
      });
      setPixData(result.pix);
      setTimeLeft(300);
      await loadRifaData();
    } catch (error) {
      if (error.status === 409) {
        setErrorMessage(error.message);
        setTimeout(() => {
          setSelectedTickets([]);
          setIsModalOpen(false);
        }, 2500);
        await loadRifaData();
      } else {
        setErrorMessage('Erro ao gerar pagamento Pix. Tente novamente.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCopyPix = () => {
    if (pixData?.copiaECola) {
      navigator.clipboard.writeText(pixData.copiaECola);
      setCopiedPix(true);
      setTimeout(() => setCopiedPix(false), 3000);
    }
  };

  const getStatusColor = (ticket) => {
    const isSelected = selectedTickets.some(t => t.numero === ticket.numero);
    if (isSelected) return 'bg-white text-black border-white';

    switch (ticket.status) {
      case 'LIVRE': return 'bg-green-600 hover:bg-green-500 border-green-400';
      case 'RESERVADO': return 'bg-yellow-600 border-yellow-400 cursor-not-allowed opacity-80';
      case 'PAGO': return 'bg-brand-red border-red-400 cursor-not-allowed opacity-80';
      default: return 'bg-gray-600 border-gray-400';
    }
  };

  const formatCurrency = (cents) => {
    return (cents / 100).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  };

  const totalCentavos = selectedTickets.length * (rifaData?.valorCentavos || 500);

  return (
    <div className="min-h-screen bg-surface-dark text-text-light font-sans selection:bg-brand-red selection:text-white pb-32">
      <header className="p-4 sm:p-6 flex justify-between items-center bg-black/50 border-b border-white/5">
        <Link to="/" className="text-gold font-bold tracking-widest uppercase flex items-center gap-2 hover:text-white transition-colors">
          <Ticket className="w-5 h-5" />
          Rifa Solidária
        </Link>
        <Link to="/meus-bilhetes" className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg font-bold transition-colors flex items-center gap-2 text-sm">
          <Search className="w-4 h-4" /> Meus Bilhetes
        </Link>
      </header>

      <main className="max-w-6xl mx-auto px-4 mt-8 sm:mt-12">
        <div className="flex flex-col items-center">
          <h1 className="font-marker text-5xl md:text-7xl text-brand-red mb-4 text-center">Escolha seus Números</h1>
          {rifaData && (
            <div className="mb-6 text-center">
              <p className="text-xl font-bold text-white mb-1">Prêmio: <span className="text-gold">{'Air Fryer'}</span></p>
              <p className="text-lg text-gray-300">Valor do Bilhete: <span className="text-green-500 font-bold">{formatCurrency(rifaData.valorCentavos || 500)}</span></p>
            </div>
          )}
          <p className="text-gray-300 text-center max-w-2xl mb-8">
            Selecione os números que deseja comprar. Ao finalizar, preencha seus dados para gerar o código PIX.
          </p>

          <div className="flex gap-4 mb-8 text-sm max-lg:flex-wrap max-lg:">
            <div className="flex items-center gap-2"><div className="w-4 h-4 bg-green-600 rounded"></div> Livre</div>
            <div className="flex items-center gap-2"><div className="w-4 h-4 bg-white rounded border border-gray-300"></div> Selecionado</div>
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
                  className={`aspect-square flex items-center justify-center rounded-lg border-2 font-bold shadow-lg transition-colors ${getStatusColor(t)} ${!selectedTickets.some(st => st.numero === t.numero) ? 'text-white' : 'text-black'}`}
                >
                  {t.numero}
                </motion.button>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Floating Checkout Bar */}
      <AnimatePresence>
        {selectedTickets.length > 0 && !isModalOpen && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            className="fixed bottom-0 left-0 right-0 bg-surface border-t border-white/10 p-4 shadow-[0_-10px_40px_rgba(0,0,0,0.5)] z-40 bg-surface-dark"
          >
            <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-center sm:text-left">
                <p className="text-white font-bold text-lg">{selectedTickets.length} {selectedTickets.length === 1 ? 'bilhete selecionado' : 'bilhetes selecionados'}</p>
                <p className="text-xs text-gray-400 mb-1 max-w-[250px] sm:max-w-md truncate" title={selectedTickets.map(t => t.numero).join(', ')}>
                  Números: <strong className="text-white">{selectedTickets.map(t => t.numero).join(', ')}</strong>
                </p>
                <p className="text-gold font-bold text-xl">{formatCurrency(totalCentavos)}</p>
              </div>
              <button
                onClick={() => setIsModalOpen(true)}
                className="bg-brand-red text-white px-8 py-3 rounded-full font-bold shadow-lg hover:bg-red-700 transition-colors flex items-center gap-2 w-full sm:w-auto justify-center"
              >
                Finalizar Compra <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Reserva Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <Modal onClose={() => { setIsModalOpen(false); setPixData(null); setErrorMessage(''); setPaymentConfirmed(false); }}>
            {!pixData ? (
              <>
                <h2 className="text-2xl font-bold text-white mb-2">
                  Finalizar Compra
                </h2>
                <p className="text-sm text-gray-400 mb-4">Você está comprando {selectedTickets.length} números: <strong className="text-gold">{selectedTickets.map(t => t.numero).join(', ')}</strong></p>

                <div className="bg-black/30 p-3 rounded-lg mb-6 border border-white/5 flex justify-between items-center">
                  <span className="text-gray-300">Total a pagar:</span>
                  <span className="text-2xl font-bold text-green-500">{formatCurrency(totalCentavos)}</span>
                </div>

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
                    <label className="text-xs text-gold uppercase tracking-wider mb-1 block">E-mail *</label>
                    <input
                      type="email" name="email" value={formData.email} onChange={handleFormChange} required
                      className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-white focus:border-gold outline-none"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs text-gold uppercase tracking-wider mb-1 block">CPF *</label>
                      <input
                        type="text" name="cpf" value={formData.cpf} onChange={handleFormChange} required maxLength="14"
                        placeholder="000.000.000-00"
                        className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-white focus:border-gold outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-gold uppercase tracking-wider mb-1 block">Telefone</label>
                      <input
                        type="tel" name="telefone" value={formData.telefone} onChange={handleFormChange}
                        placeholder="(00) 00000-0000"
                        className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-white focus:border-gold outline-none"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-xs text-gold uppercase tracking-wider mb-1 block">Endereço</label>
                    <input
                      type="text" name="endereco" value={formData.endereco} onChange={handleFormChange}
                      placeholder="Rua, Número, Bairro, Cidade"
                      className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-white focus:border-gold outline-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="mt-2 bg-brand-red text-white font-bold rounded-lg py-4 shadow-[0_0_15px_rgba(179,0,0,0.4)] hover:bg-red-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {isSubmitting ? 'Gerando PIX...' : (
                      <>
                        <QrCode className="w-5 h-5" /> Pagar via PIX
                      </>
                    )}
                  </button>
                </form>
              </>
            ) : paymentConfirmed ? (
              <div className="flex flex-col items-center text-center py-6">
                <motion.div 
                  initial={{ scale: 0 }} animate={{ scale: 1 }}
                  className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-[0_0_30px_rgba(34,197,94,0.5)]"
                >
                  <Check className="w-10 h-10 text-white" />
                </motion.div>
                <motion.h2
                  initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
                  className="text-3xl font-bold text-white mb-3"
                >
                  Pagamento Confirmado!
                </motion.h2>
                <motion.p
                  initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
                  className="text-gray-300 mb-8"
                >
                  Seus bilhetes foram garantidos com sucesso. Boa sorte!
                </motion.p>
                <motion.button
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}
                  onClick={() => { navigate('/meus-bilhetes', { state: { cpf: formData.cpf } }) }}
                  className="bg-green-600 hover:bg-green-500 text-white px-8 py-3 rounded-xl font-bold shadow-lg transition-colors w-full"
                >
                  Ver meus Comprovantes
                </motion.button>
              </div>
            ) : (
              <div className="flex flex-col items-center text-center">
                <motion.h2
                  initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                  className="text-2xl font-bold text-white mb-2"
                >
                  Pedido Criado!
                </motion.h2>
                <motion.p
                  initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
                  className="text-sm text-gray-400 mb-6"
                >
                  Faça o pagamento via PIX para garantir seus números. A baixa será feita automaticamente.
                  {timeLeft > 0 ? (
                    <span className="block mt-2 text-yellow-500 font-bold">Atenção: Você tem {formatTime(timeLeft)} para efetuar o pagamento.</span>
                  ) : (
                    <span className="block mt-2 text-red-500 font-bold">O tempo expirou. Se já pagou, aguarde a baixa ou fale conosco.</span>
                  )}
                </motion.p>

                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2 }}
                  className="relative mb-6"
                >
                  <div className="bg-white p-3 rounded-xl w-48 h-48 mx-auto flex items-center justify-center overflow-hidden shadow-lg">
                    <img src={`data:image/png;base64,${pixData.qrCodeBase64}`} alt="QR Code PIX" className="w-full h-full object-contain" />
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
                  className="w-full mb-5 relative"
                >
                  <span className="text-[10px] text-gold uppercase tracking-wider font-medium mb-1.5 block text-left">Chave PIX Copia e Cola</span>
                  <button
                    onClick={handleCopyPix}
                    className={`w-full border py-3 px-4 rounded-xl flex items-center justify-between transition-all duration-300 ${copiedPix
                      ? 'bg-green-500/10 border-green-500/50 shadow-[0_0_15px_rgba(34,197,94,0.15)]'
                      : 'bg-black/50 border-gold/30 hover:bg-gold/10 hover:border-gold'
                      }`}
                  >
                    <span className="truncate mr-4 text-xs text-gray-300 font-mono">{pixData.copiaECola.substring(0, 20)}...</span>
                    <div className={`flex items-center gap-1.5 text-xs font-medium flex-shrink-0 ${copiedPix ? 'text-green-500' : 'text-gold'}`}>
                      {copiedPix ? <><CheckCircle className="w-4 h-4" /> Copiado</> : <><Copy className="w-4 h-4" /> Copiar</>}
                    </div>
                  </button>
                </motion.div>

                <motion.button
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
                  onClick={() => { setIsModalOpen(false); setSelectedTickets([]); setPixData(null); setPaymentConfirmed(false); }}
                  className="text-gray-400 hover:text-white text-sm"
                >
                  Fechar e aguardar confirmação
                </motion.button>
              </div>
            )}
          </Modal>
        )}
      </AnimatePresence>

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
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-white z-20 bg-black/50 rounded-full p-1">
          <X className="w-5 h-5" />
        </button>
        {children}
      </motion.div>
    </div>
  );
}
