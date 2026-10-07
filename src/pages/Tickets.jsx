import React, { useState, useEffect, useCallback } from 'react';
import { fetchRifa, criarPedido } from '../services/api';
import { motion, AnimatePresence } from 'framer-motion';
import { Ticket, X, QrCode, ArrowRight, Clock, MessageCircle, Search, ChevronDown, ChevronUp, HeartHandshake } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import InstrucoesPagamento from '../components/InstrucoesPagamento';
import { formatCpf, formatCurrency, formatPhone, telefoneValido } from '../utils/formatters';

const STORAGE_KEY = 'pedidoPendente';
const CHAVE_ANTIGA = 'pendingPix'; // gravada pelo checkout do Mercado Pago

const lerPedidoPendente = () => {
  try {
    localStorage.removeItem(CHAVE_ANTIGA);
    const salvo = JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null');
    return Array.isArray(salvo?.numeros) ? salvo : null;
  } catch {
    return null;
  }
};

const salvarPedidoPendente = (pedido) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(pedido));
  } catch {
    // Sem armazenamento local o aviso apenas não sobrevive ao recarregamento.
  }
};

const limparPedidoPendente = () => {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // Idem.
  }
};

// O aviso deixa de valer quando a equipe confirmou (PAGO) ou cancelou (LIVRE) todos os números.
const pedidoResolvido = (pedido, tickets) =>
  pedido.numeros.every((numero) => {
    const ticket = tickets.find((t) => t.numero === numero);
    return !ticket || ticket.status === 'PAGO' || ticket.status === 'LIVRE';
  });

const MENSAGENS_CARREGANDO = [
  'Acordando o servidor (pode levar até 50s na primeira vez)...',
  'Organizando os bilhetes da sorte...',
  'Quase lá, não desista...',
  'Ajeitando os últimos detalhes...',
  'Já está vindo, prometo!'
];

const LoadingAnimation = () => {
  const [indice, setIndice] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndice((atual) => (atual + 1) % MENSAGENS_CARREGANDO.length);
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  const loadingText = MENSAGENS_CARREGANDO[indice];

  return (
    <div className="flex flex-col items-center justify-center py-20 w-full">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 1.2, ease: "linear" }}
        className="w-16 h-16 border-4 border-white/10 border-t-gold rounded-full mb-6"
      />
      <AnimatePresence mode="wait">
        <motion.p
          key={loadingText}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="text-gold font-bold text-lg text-center max-w-md"
        >
          {loadingText}
        </motion.p>
      </AnimatePresence>
    </div>
  );
};

export default function Tickets() {
  const navigate = useNavigate();
  const [rifaData, setRifaData] = useState(null);
  const [loading, setLoading] = useState(true);

  const [selectedTickets, setSelectedTickets] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [formData, setFormData] = useState({ nome: '', telefone: '', endereco: '', email: '', cpf: '' });
  const [showComplementaryFields, setShowComplementaryFields] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const [pedido, setPedido] = useState(null);
  const [pedidoPendente, setPedidoPendente] = useState(lerPedidoPendente);

  const loadRifaData = useCallback(async () => {
    try {
      const data = await fetchRifa();
      setRifaData(data);
      const salvo = lerPedidoPendente();
      if (salvo && pedidoResolvido(salvo, data.tickets)) {
        limparPedidoPendente();
        setPedidoPendente(null);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadRifaData();
  }, [loadRifaData]);

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

  const fecharModal = () => {
    setIsModalOpen(false);
    setPedido(null);
    setErrorMessage('');
  };

  const handleReserva = async (e) => {
    e.preventDefault();
    if (!telefoneValido(formData.telefone)) {
      setErrorMessage('Informe um telefone com DDD.');
      return;
    }
    if (formData.endereco.trim().length < 5) {
      setErrorMessage('Informe o endereço completo.');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage('');
    try {
      const comprador = Object.fromEntries(
        Object.entries(formData).filter(([, valor]) => valor.trim() !== '')
      );
      const resultado = await criarPedido({
        numeros: selectedTickets.map(t => t.numero),
        comprador,
      });

      const resumo = {
        codigo: resultado.codigo,
        numeros: resultado.numeros,
        valorTotalCentavos: resultado.valorTotalCentavos,
        pix: resultado.pix,
        linkWhatsapp: resultado.linkWhatsapp,
        telefone: formData.telefone,
      };
      salvarPedidoPendente(resumo);
      setPedidoPendente(resumo);
      setPedido(resumo);
      setSelectedTickets([]);
      await loadRifaData();
    } catch (error) {
      if (error.status === 409) {
        setErrorMessage(error.message);
        setTimeout(() => {
          setSelectedTickets([]);
          fecharModal();
        }, 2500);
        await loadRifaData();
      } else if (error.status === 400) {
        setErrorMessage('Confira os dados informados e tente novamente.');
      } else {
        setErrorMessage('Não foi possível reservar. Tente novamente.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const abrirPedidoPendente = () => {
    setPedido(pedidoPendente);
    setIsModalOpen(true);
  };

  const dispensarPedidoPendente = () => {
    limparPedidoPendente();
    setPedidoPendente(null);
  };

  const acompanharPedido = (telefone) => {
    navigate('/meus-bilhetes', { state: { telefone } });
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

      {/* Aviso de pedido aguardando pagamento */}
      <AnimatePresence>
        {pedidoPendente && !isModalOpen && (
          <motion.div
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -100, opacity: 0 }}
            className="fixed top-0 left-0 right-0 bg-yellow-500 text-black p-4 shadow-lg z-[60] flex flex-col sm:flex-row items-center justify-between gap-4"
          >
            <div>
              <p className="font-bold flex items-center gap-2">
                <Clock className="w-5 h-5" />
                Pedido #{pedidoPendente.codigo} aguardando pagamento
              </p>
              <p className="text-sm">
                Números reservados: {pedidoPendente.numeros.join(', ')} · {formatCurrency(pedidoPendente.valorTotalCentavos)}
              </p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={abrirPedidoPendente}
                className="bg-black text-white px-4 py-2 rounded-lg font-bold hover:bg-gray-800 transition-colors flex items-center gap-2"
              >
                <QrCode className="w-4 h-4" /> Ver instruções
              </button>
              <button
                onClick={dispensarPedidoPendente}
                className="bg-transparent border border-black px-4 py-2 rounded-lg font-bold hover:bg-black/10 transition-colors"
              >
                Dispensar
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <main className="max-w-6xl mx-auto px-4 mt-8 sm:mt-12 max-lg:mb-14">
        <div className="flex flex-col items-center">
          <h1 className="font-marker text-5xl md:text-7xl text-brand-red mb-4 text-center mt-4">Rifa Solidária</h1>
          {rifaData && (
            <div className="mb-6 text-center">
              <p className="text-2xl font-bold text-white mb-2">Prêmio: <span className="text-gold text-3xl">Air Fryer</span></p>
              <p className="text-lg text-gray-300">Valor do Bilhete: <span className="text-green-500 font-bold text-xl">{formatCurrency(rifaData.valorCentavos || 500)}</span></p>
            </div>
          )}

          <div className="bg-brand-red/10 border border-brand-red/30 rounded-2xl p-6 text-center max-w-3xl mb-8 mx-auto shadow-[0_0_20px_rgba(179,0,0,0.15)]">
            <h2 className="text-xl md:text-2xl font-bold text-white mb-3 flex items-center justify-center gap-2">
              <HeartHandshake className="w-6 h-6 text-brand-red" />
              Seu bilhete alimenta esperança!
            </h2>
            <p className="text-gray-300 text-sm md:text-base leading-relaxed">
              Toda a arrecadação desta rifa será revertida para <strong>ajudar famílias e pessoas em situação de vulnerabilidade</strong> em nossa comunidade. Selecione seus números abaixo, preencha seus dados para reservá-los e pague via PIX.
            </p>
          </div>

          <div className="flex gap-4 mb-8 text-sm max-lg:flex-wrap max-lg:justify-center">
            <div className="flex items-center gap-2"><div className="w-4 h-4 bg-green-600 rounded"></div> Livre</div>
            <div className="flex items-center gap-2"><div className="w-4 h-4 bg-white rounded border border-gray-300"></div> Selecionado</div>
            <div className="flex items-center gap-2"><div className="w-4 h-4 bg-yellow-600 rounded"></div> Reservado</div>
            <div className="flex items-center gap-2"><div className="w-4 h-4 bg-brand-red rounded"></div> Pago</div>
          </div>

          {loading ? (
            <LoadingAnimation />
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

      {/* Barra flutuante de finalização */}
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

      {/* Modal de reserva */}
      <AnimatePresence>
        {isModalOpen && (
          <Modal onClose={fecharModal}>
            {pedido ? (
              <InstrucoesPagamento pedido={pedido} onAcompanhar={() => acompanharPedido(pedido.telefone)} />
            ) : (
              <>
                <h2 className="text-2xl font-bold text-white mb-2">
                  Finalizar Compra
                </h2>
                <p className="text-sm text-gray-400 mb-4">Você está reservando {selectedTickets.length} {selectedTickets.length === 1 ? 'número' : 'números'}: <strong className="text-gold">{selectedTickets.map(t => t.numero).join(', ')}</strong></p>

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
                    <label className="text-xs text-gold uppercase tracking-wider mb-1 block">Telefone (WhatsApp) *</label>
                    <input
                      type="tel" name="telefone" value={formData.telefone} onChange={handleFormChange} required
                      inputMode="tel" placeholder="(00) 00000-0000"
                      className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-white focus:border-gold outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-xs text-gold uppercase tracking-wider mb-1 block">Endereço *</label>
                    <input
                      type="text" name="endereco" value={formData.endereco} onChange={handleFormChange} required
                      placeholder="Rua, Número, Bairro, Cidade"
                      className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-white focus:border-gold outline-none"
                    />
                  </div>

                  <button
                    type="button"
                    onClick={() => setShowComplementaryFields(!showComplementaryFields)}
                    className="text-gold text-sm flex items-center gap-1 hover:underline self-start font-medium"
                  >
                    {showComplementaryFields ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    {showComplementaryFields ? 'Ocultar e-mail e CPF' : 'Adicionar e-mail e CPF (opcional)'}
                  </button>

                  <AnimatePresence>
                    {showComplementaryFields && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="flex flex-col gap-4 overflow-hidden"
                      >
                        <div>
                          <label className="text-xs text-gold uppercase tracking-wider mb-1 block">E-mail</label>
                          <input
                            type="email" name="email" value={formData.email} onChange={handleFormChange}
                            className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-white focus:border-gold outline-none"
                          />
                        </div>
                        <div>
                          <label className="text-xs text-gold uppercase tracking-wider mb-1 block">CPF</label>
                          <input
                            type="text" name="cpf" value={formData.cpf} onChange={handleFormChange} maxLength="14"
                            placeholder="000.000.000-00"
                            className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-white focus:border-gold outline-none"
                          />
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="mt-2 bg-brand-red text-white font-bold rounded-lg py-4 shadow-[0_0_15px_rgba(179,0,0,0.4)] hover:bg-red-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {isSubmitting ? 'Reservando...' : (
                      <>
                        <Ticket className="w-5 h-5" /> Reservar números
                      </>
                    )}
                  </button>
                </form>
              </>
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
