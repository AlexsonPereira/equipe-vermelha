import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Ticket, X, QrCode, Clock, MessageCircle, Search, Share2 } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { fetchRifa } from '../services/api';
import InstrucoesPagamento from '../components/InstrucoesPagamento';
import BarraCompra from '../components/rifa/BarraCompra';
import BotaoCompartilhar from '../components/rifa/BotaoCompartilhar';
import ComoFunciona from '../components/rifa/ComoFunciona';
import DestaquePremio from '../components/rifa/DestaquePremio';
import EsperaCarregamento from '../components/rifa/EsperaCarregamento';
import FormularioReserva from '../components/rifa/FormularioReserva';
import ProgressoVendas from '../components/rifa/ProgressoVendas';
import SeletorNumeros from '../components/rifa/SeletorNumeros';
import { formatCurrency } from '../utils/formatters';
import { separarPorDisponibilidade } from '../utils/numerosDaSorte';
import { sortearLivres } from '../utils/selecaoNumeros';

// Usado até a API responder e para campos que um backend antigo ainda não envia.
const RIFA_PADRAO = {
  premio: 'Air Fryer',
  valorCentavos: 500,
  pacotes: [],
  sorteio: { data: null, local: null },
  ultimosVendidos: [],
  tickets: [],
};
const LIMITE_CARGA_MS = 90000;

const STORAGE_KEY = 'pedidoPendente';
const CHAVE_ANTIGA = 'pendingPix'; // gravada pelo checkout do Mercado Pago

const lerPedidoPendente = () => {
  try {
    localStorage.removeItem(CHAVE_ANTIGA);
    const salvo = JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null');
    return Array.isArray(salvo?.numeros) && typeof salvo?.pix?.copiaECola === 'string' ? salvo : null;
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

const descreverOcupados = (ocupados) =>
  ocupados.length === 1
    ? `O ${ocupados[0]} já foi vendido ou reservado 😕`
    : `Os números ${ocupados.join(', ')} já foram vendidos ou reservados 😕`;

export default function Tickets() {
  const navigate = useNavigate();
  const [rifa, setRifa] = useState(null);
  const [statusCarga, setStatusCarga] = useState('carregando'); // 'carregando' | 'pronto' | 'falhou'
  const [selecionados, setSelecionados] = useState([]);
  const [numerosDaSorte, setNumerosDaSorte] = useState([]);
  const numerosDaSorteRef = useRef([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [pedido, setPedido] = useState(null);
  const [pedidoPendente, setPedidoPendente] = useState(lerPedidoPendente);
  const [aviso, setAviso] = useState('');

  const infoRifa = { ...RIFA_PADRAO, ...(rifa ?? {}) };

  const alterarNumerosDaSorte = (lista) => {
    numerosDaSorteRef.current = lista;
    setNumerosDaSorte(lista);
  };

  const carregar = useCallback(async ({ silencioso = false } = {}) => {
    if (!silencioso) setStatusCarga('carregando');
    let timer;
    const limite = new Promise((_, rejeitar) => {
      timer = setTimeout(() => rejeitar(new Error('Tempo esgotado')), LIMITE_CARGA_MS);
    });

    try {
      const data = await Promise.race([fetchRifa(), limite]);
      setRifa(data);
      setStatusCarga('pronto');

      const salvo = lerPedidoPendente();
      if (salvo && pedidoResolvido(salvo, data.tickets)) {
        limparPedidoPendente();
        setPedidoPendente(null);
      }

      // Números da sorte guardados durante a espera viram seleção quando a grade chega.
      const sorte = numerosDaSorteRef.current;
      if (sorte.length) {
        const { livres, ocupados } = separarPorDisponibilidade(sorte, data.tickets);
        setSelecionados((atual) => [...new Set([...atual, ...livres])]);
        if (ocupados.length) setAviso(descreverOcupados(ocupados));
        numerosDaSorteRef.current = [];
        setNumerosDaSorte([]);
      }
      return data;
    } catch (error) {
      console.error(error);
      if (!silencioso) setStatusCarga('falhou');
      return null;
    } finally {
      clearTimeout(timer);
    }
  }, []);

  useEffect(() => {
    carregar();
  }, [carregar]);

  useEffect(() => {
    if (!aviso) return undefined;
    const timer = setTimeout(() => setAviso(''), 4000);
    return () => clearTimeout(timer);
  }, [aviso]);

  const alternarNumero = (numero) => {
    setSelecionados((atual) => (atual.includes(numero) ? atual.filter((n) => n !== numero) : [...atual, numero]));
  };

  const adicionarNumeros = (numeros) => {
    setSelecionados((atual) => [...new Set([...atual, ...numeros])]);
  };

  const adicionarSugestao = (faltam) => {
    const novos = sortearLivres(infoRifa.tickets, selecionados, faltam);
    if (novos.length < faltam) setAviso('Não há números livres suficientes para completar o pacote.');
    adicionarNumeros(novos);
  };

  const fecharModal = () => {
    setIsModalOpen(false);
    setPedido(null);
  };

  const handleReservado = (resultado, telefone) => {
    const resumo = {
      codigo: resultado.codigo,
      numeros: resultado.numeros,
      valorTotalCentavos: resultado.valorTotalCentavos,
      economiaCentavos: resultado.economiaCentavos ?? 0,
      expiraEm: resultado.expiraEm,
      pix: resultado.pix,
      linkWhatsapp: resultado.linkWhatsapp,
      telefone,
    };
    salvarPedidoPendente(resumo);
    setPedidoPendente(resumo);
    setPedido(resumo);
    setSelecionados([]);
    carregar({ silencioso: true });
  };

  // Alguém reservou antes: mantém só o que continua livre e devolve a pessoa à grade.
  const handleConflito = async () => {
    const data = await carregar({ silencioso: true });
    setTimeout(() => {
      if (data) {
        const livres = new Set(data.tickets.filter((t) => t.status === 'LIVRE').map((t) => t.numero));
        setSelecionados((atual) => atual.filter((n) => livres.has(n)));
      }
      fecharModal();
    }, 2500);
  };

  const abrirPedidoPendente = () => {
    setPedido(pedidoPendente);
    setIsModalOpen(true);
  };

  const dispensarPedidoPendente = () => {
    limparPedidoPendente();
    setPedidoPendente(null);
  };

  const barraVisivel = selecionados.length > 0 && !isModalOpen;

  return (
    <div className="min-h-screen bg-surface-dark text-text-light font-sans selection:bg-brand-red selection:text-white pb-48">
      <header className="sticky top-0 z-30 bg-surface-dark/95 backdrop-blur border-b border-white/5 px-4 h-14">
        <div className="max-w-4xl mx-auto h-full flex justify-between items-center gap-2">
          <Link to="/" className="text-gold font-bold tracking-wider uppercase flex items-center gap-2 text-xs sm:text-sm whitespace-nowrap min-h-11">
            <Ticket className="w-5 h-5 flex-shrink-0" />
            Rifa Solidária
          </Link>
          <div className="flex items-center gap-1">
            <BotaoCompartilhar
              premio={infoRifa.premio}
              valorCentavos={infoRifa.valorCentavos}
              aria-label="Compartilhar a rifa"
              className="w-11 h-11 flex items-center justify-center rounded-full text-gray-200 hover:bg-white/10"
            >
              <Share2 className="w-5 h-5" />
            </BotaoCompartilhar>
            <Link to="/meus-bilhetes" className="min-h-11 bg-white/10 hover:bg-white/20 text-white px-3 rounded-full font-bold flex items-center gap-2 text-sm whitespace-nowrap">
              <Search className="w-4 h-4 flex-shrink-0" /> Meus Bilhetes
            </Link>
          </div>
        </div>
      </header>

      {/* Aviso de pedido aguardando pagamento */}
      <AnimatePresence>
        {pedidoPendente && !isModalOpen && (
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -20, opacity: 0 }}
            className="bg-yellow-500 text-black px-4 py-3 shadow-lg"
          >
            <div className="max-w-4xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <p className="font-bold flex items-center gap-2">
                  <Clock className="w-5 h-5" />
                  Pedido #{pedidoPendente.codigo} aguardando pagamento
                </p>
                <p className="text-sm">
                  Números {pedidoPendente.numeros.join(', ')} · {formatCurrency(pedidoPendente.valorTotalCentavos)}
                </p>
              </div>
              <div className="flex gap-2">
                <button onClick={abrirPedidoPendente} className="flex-1 sm:flex-none min-h-11 bg-black text-white px-4 rounded-xl font-bold flex items-center justify-center gap-2">
                  <QrCode className="w-4 h-4" /> Ver instruções
                </button>
                <button onClick={dispensarPedidoPendente} className="min-h-11 border border-black px-4 rounded-xl font-bold">
                  Dispensar
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <main className="max-w-4xl mx-auto px-4 pt-5 flex flex-col gap-6">
        <h1 className="font-marker text-4xl md:text-6xl text-brand-red text-center">Rifa Solidária</h1>

        <DestaquePremio rifa={infoRifa} />

        {statusCarga === 'pronto' && (
          <ProgressoVendas tickets={infoRifa.tickets} ultimosVendidos={infoRifa.ultimosVendidos} />
        )}

        {statusCarga === 'pronto' ? (
          <SeletorNumeros
            tickets={infoRifa.tickets}
            selecionados={selecionados}
            onAlternar={alternarNumero}
            onAdicionar={adicionarNumeros}
          />
        ) : (
          <EsperaCarregamento
            numerosDaSorte={numerosDaSorte}
            onAlterarNumeros={alterarNumerosDaSorte}
            falhou={statusCarga === 'falhou'}
            onTentarNovamente={() => carregar()}
          />
        )}

        {/* Depois da grade: no celular, o que vende (escolher números) fica a menos rolagens do topo. */}
        <ComoFunciona />
      </main>

      <AnimatePresence>
        {barraVisivel && (
          <BarraCompra
            selecionados={selecionados}
            valorUnitario={infoRifa.valorCentavos}
            pacotes={infoRifa.pacotes}
            onAbrir={() => setIsModalOpen(true)}
            onAdicionarSugestao={adicionarSugestao}
            onLimpar={() => setSelecionados([])}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isModalOpen && (
          <Modal onClose={fecharModal}>
            {pedido ? (
              <InstrucoesPagamento pedido={pedido} onAcompanhar={() => navigate('/meus-bilhetes', { state: { telefone: pedido.telefone } })} />
            ) : (
              <FormularioReserva
                numeros={selecionados}
                valorUnitario={infoRifa.valorCentavos}
                pacotes={infoRifa.pacotes}
                onReservado={handleReservado}
                onConflito={handleConflito}
              />
            )}
          </Modal>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {aviso && (
          <motion.div
            role="status"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="fixed top-16 left-4 right-4 sm:left-auto sm:max-w-sm z-[60] bg-black/90 border border-white/10 text-white text-sm rounded-xl p-3 shadow-2xl"
          >
            {aviso}
          </motion.div>
        )}
      </AnimatePresence>

      {!barraVisivel && !isModalOpen && (
        <a
          href="https://wa.me/5577991175001?text=Ol%C3%A1%2C%20preciso%20de%20ajuda%20com%20a%20rifa!"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Precisa de ajuda? Fale no WhatsApp"
          className="fixed bottom-[max(1.5rem,env(safe-area-inset-bottom))] right-4 z-40 flex items-center gap-3 bg-green-500 hover:bg-green-400 text-white px-4 py-3 rounded-full shadow-lg shadow-green-900/30"
        >
          <span className="font-bold text-sm hidden sm:block">Precisa de ajuda?</span>
          <MessageCircle className="w-6 h-6" />
        </a>
      )}
    </div>
  );
}

export function Modal({ children, onClose }) {
  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center sm:p-4">
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      />
      <motion.div
        role="dialog"
        aria-modal="true"
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        exit={{ y: '100%' }}
        transition={{ type: 'spring', damping: 30, stiffness: 300 }}
        className="relative bg-surface-dark border-t sm:border border-white/10 px-5 pt-6 pb-[max(1.5rem,env(safe-area-inset-bottom))] sm:p-8 rounded-t-3xl sm:rounded-2xl w-full sm:max-w-md shadow-2xl z-10 max-h-[92dvh] overflow-y-auto"
      >
        <button onClick={onClose} aria-label="Fechar" className="absolute top-3 right-3 w-11 h-11 flex items-center justify-center text-gray-400 hover:text-white z-20 rounded-full">
          <X className="w-5 h-5" />
        </button>
        {children}
      </motion.div>
    </div>
  );
}
