import React, { useCallback, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, CheckCircle, Clock, MessageCircle, Search, Ticket } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { fetchMeusBilhetes } from '../services/api';
import { formatCurrency, formatDateTime, formatPhone, telefoneValido } from '../utils/formatters';

function CartaoPedido({ pedido }) {
  const pago = pedido.status === 'pago';

  return (
    <div className="bg-black/40 border border-white/5 rounded-xl p-5">
      <div className="flex flex-wrap items-start justify-between gap-3 mb-4">
        <div className="text-left">
          <p className="text-lg font-bold text-white">Pedido #{pedido.codigo}</p>
          <p className="text-xs text-gray-400">
            {pedido.primeiroNome} · {formatDateTime(pedido.criadoEm)} · {formatCurrency(pedido.valorTotalCentavos)}
          </p>
        </div>
        {pago ? (
          <span className="bg-green-600/20 text-green-500 px-3 py-1 text-xs font-bold rounded-full flex items-center gap-1 border border-green-500/20">
            <CheckCircle className="w-3 h-3" /> PAGO
          </span>
        ) : (
          <span className="bg-yellow-600/20 text-yellow-500 px-3 py-1 text-xs font-bold rounded-full flex items-center gap-1 border border-yellow-600/30">
            <Clock className="w-3 h-3" /> Aguardando confirmação do pagamento
          </span>
        )}
      </div>

      {pago ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {pedido.tickets.map((ticket) => (
            <div key={ticket.numero} className="bg-black/50 border border-white/5 rounded-xl p-4 flex items-center justify-between gap-3">
              <span className="text-2xl font-bold text-white">#{ticket.numero}</span>
              {ticket.comprovanteCodigo && (
                <Link
                  to={`/comprovante/${ticket.comprovanteCodigo}`}
                  className="py-2 px-3 bg-white/5 hover:bg-white/10 text-gold rounded-lg text-sm font-bold transition-colors"
                >
                  Ver comprovante
                </Link>
              )}
            </div>
          ))}
        </div>
      ) : (
        <>
          <p className="text-sm text-gray-300 mb-4 text-left">
            Números reservados: <strong className="text-white">{pedido.tickets.map((t) => t.numero).join(', ')}</strong>
          </p>
          {pedido.linkWhatsapp && (
            <a
              href={pedido.linkWhatsapp}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full bg-green-600 hover:bg-green-500 text-white font-bold rounded-xl py-3 flex items-center justify-center gap-2 transition-colors"
            >
              <MessageCircle className="w-5 h-5" /> Enviar comprovante no WhatsApp
            </a>
          )}
        </>
      )}
    </div>
  );
}

export default function MeusBilhetes() {
  const location = useLocation();
  const [telefone, setTelefone] = useState('');
  const [loading, setLoading] = useState(false);
  const [pedidos, setPedidos] = useState(null);
  const [error, setError] = useState('');

  const performSearch = useCallback(async (valor) => {
    if (!telefoneValido(valor)) {
      setError('Informe o telefone com DDD.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const data = await fetchMeusBilhetes(valor);
      setPedidos(data.pedidos || []);
    } catch {
      setError('Erro ao buscar bilhetes. Verifique o telefone e tente novamente.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const inicial = location.state?.telefone;
    if (inicial) {
      setTelefone(formatPhone(inicial));
      performSearch(inicial);
    }
  }, [location.state, performSearch]);

  const handleSearch = (e) => {
    e.preventDefault();
    performSearch(telefone);
  };

  return (
    <div className="min-h-screen bg-surface-dark text-text-light font-sans p-4 sm:p-8 flex flex-col items-center pb-32">
      <div className="w-full max-w-2xl flex justify-between items-center mb-6">
        <Link to="/" className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors">
          <ArrowLeft className="w-5 h-5" /> Voltar
        </Link>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-surface border border-white/10 p-6 sm:p-10 rounded-2xl w-full max-w-2xl shadow-2xl"
      >
        <div className="flex flex-col items-center text-center mb-8">
          <div className="w-16 h-16 bg-brand-red/20 rounded-full flex items-center justify-center mb-4 text-brand-red">
            <Ticket className="w-8 h-8" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Meus Bilhetes</h1>
          <p className="text-gray-400">Digite o telefone usado na reserva para ver seus pedidos.</p>
        </div>

        <form onSubmit={handleSearch} className="flex flex-col gap-4 mb-8">
          <div>
            <label className="text-xs text-gold uppercase tracking-wider mb-2 block font-medium">Telefone do comprador</label>
            <div className="flex gap-3 max-lg:flex-col">
              <input
                type="tel"
                inputMode="tel"
                value={telefone}
                onChange={(e) => setTelefone(formatPhone(e.target.value))}
                placeholder="(00) 00000-0000"
                maxLength="15"
                className="flex-1 bg-black/50 border border-white/10 rounded-xl p-4 text-white focus:border-gold outline-none transition-colors text-lg tracking-wider"
              />
              <button
                type="submit"
                disabled={loading || !telefone}
                className="bg-brand-red hover:bg-red-700 disabled:opacity-50 text-white px-6 rounded-xl font-bold transition-all shadow-[0_0_15px_rgba(179,0,0,0.3)] flex items-center gap-2 max-lg:h-12 justify-center"
              >
                {loading ? 'Buscando...' : <><Search className="w-5 h-5" /> Buscar</>}
              </button>
            </div>
          </div>
          {error && <p className="text-red-400 text-sm font-medium">{error}</p>}
        </form>

        {pedidos !== null && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-8 flex flex-col gap-6">
            <h2 className="text-xl font-bold text-white border-b border-white/10 pb-4">
              Pedidos encontrados ({pedidos.length})
            </h2>

            {pedidos.length === 0 ? (
              <div className="text-center py-10 text-gray-400 bg-black/30 rounded-xl border border-white/5">
                Nenhum pedido encontrado para este telefone.
              </div>
            ) : (
              pedidos.map((pedido) => <CartaoPedido key={`${pedido.codigo}-${pedido.criadoEm}`} pedido={pedido} />)
            )}
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}
