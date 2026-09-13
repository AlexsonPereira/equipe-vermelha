import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Search, Ticket, CheckCircle } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { fetchMeusBilhetes } from '../services/api';

const formatCpf = (value) => {
  const digits = value.replace(/\D/g, '').slice(0, 11);
  return digits.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
};

export default function MeusBilhetes() {
  const location = useLocation();
  const [cpf, setCpf] = useState('');
  const [loading, setLoading] = useState(false);
  const [tickets, setTickets] = useState(null);
  const [error, setError] = useState('');

  React.useEffect(() => {
    if (location.state?.cpf) {
      const initialCpf = location.state.cpf;
      setCpf(initialCpf);
      performSearch(initialCpf);
    }
  }, [location.state]);

  const handleCpfChange = (e) => {
    setCpf(formatCpf(e.target.value));
  };

  const performSearch = async (searchCpf) => {
    if (searchCpf.replace(/\D/g, '').length !== 11) {
      setError('CPF inválido');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const data = await fetchMeusBilhetes(searchCpf);
      setTickets(data.tickets || []);
    } catch (err) {
      setError('Erro ao buscar bilhetes. Verifique o CPF e tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    performSearch(cpf);
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
          <p className="text-gray-400">Digite seu CPF para buscar os bilhetes comprados nesta rifa.</p>
        </div>

        <form onSubmit={handleSearch} className="flex flex-col gap-4 mb-8">
          <div>
            <label className="text-xs text-gold uppercase tracking-wider mb-2 block font-medium">CPF do Comprador</label>
            <div className="flex gap-3 max-lg:flex-col">
              <input
                type="text"
                value={cpf}
                onChange={handleCpfChange}
                placeholder="000.000.000-00"
                maxLength="14"
                className="flex-1 bg-black/50 border border-white/10 rounded-xl p-4 text-white focus:border-gold outline-none transition-colors text-lg tracking-wider"
              />
              <button
                type="submit"
                disabled={loading || !cpf}
                className="bg-brand-red hover:bg-red-700 disabled:opacity-50 text-white px-6 rounded-xl font-bold transition-all shadow-[0_0_15px_rgba(179,0,0,0.3)] flex items-center gap-2 max-lg:h-12"
              >
                {loading ? 'Buscando...' : <><Search className="w-5 h-5" /> Buscar</>}
              </button>
            </div>
          </div>
          {error && <p className="text-red-400 text-sm font-medium">{error}</p>}
        </form>

        {tickets !== null && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-8">
            <h2 className="text-xl font-bold text-white mb-4 border-b border-white/10 pb-4">
              Resultados Encontrados ({tickets.length})
            </h2>

            {tickets.length === 0 ? (
              <div className="text-center py-10 text-gray-400 bg-black/30 rounded-xl border border-white/5">
                Nenhum bilhete pago encontrado para este CPF.
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {tickets.map((ticket) => (
                  <div key={ticket.numero} className="bg-black/50 border border-white/5 rounded-xl p-5 hover:border-gold/30 transition-colors flex flex-col h-full relative overflow-hidden">
                    <div className="absolute top-0 right-0 bg-green-600/20 text-green-500 px-3 py-1 text-xs font-bold rounded-bl-lg flex items-center gap-1 border-b border-l border-green-500/20">
                      <CheckCircle className="w-3 h-3" /> PAGO
                    </div>

                    <div className="text-3xl font-bold text-white mb-1">#{ticket.numero}</div>
                    <div className="text-sm text-gray-400 mb-4">{ticket.comprador_nome}</div>

                    <div className="mt-auto pt-4 border-t border-white/5">
                      <Link
                        to={`/comprovante/${ticket.comprovante_codigo}`}
                        className="block w-full py-2 text-center bg-white/5 hover:bg-white/10 text-gold rounded-lg text-sm font-bold transition-colors"
                      >
                        Ver Comprovante Completo
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}
