import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Gift } from 'lucide-react';
import { formatCurrency } from '../../utils/formatters';
import { contarVendas } from '../../utils/selecaoNumeros';

// Chamada da rifa logo no topo da Home, com os dados reais quando a API responde.
export default function FaixaRifa({ rifa }) {
  const { total, vendidos } = contarVendas(rifa.tickets);
  const melhorPacote = rifa.pacotes.at(-1);

  return (
    <Link to="/tickets" className="group block w-full max-w-md mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 1 }}
        className="relative overflow-hidden rounded-2xl border border-gold/50 bg-black/60 backdrop-blur px-4 py-3 flex items-center gap-3 text-left shadow-[0_0_25px_rgba(212,175,55,0.25)]"
      >
        {/* Brilho que atravessa a faixa */}
        <motion.span
          aria-hidden="true"
          className="absolute inset-y-0 -left-1/3 w-1/3 bg-gradient-to-r from-transparent via-white/15 to-transparent skew-x-12"
          animate={{ x: ['0%', '450%'] }}
          transition={{ repeat: Infinity, duration: 3.5, ease: 'easeInOut', repeatDelay: 1.5 }}
        />
        <span className="w-11 h-11 rounded-xl bg-gold text-surface-dark flex items-center justify-center flex-shrink-0">
          <Gift className="w-6 h-6" />
        </span>
        <span className="flex-1 min-w-0">
          <span className="block text-white font-bold leading-tight">
            Concorra a {rifa.premio} por {formatCurrency(rifa.valorCentavos)}
          </span>
          <span className="block text-xs text-gray-300 truncate">
            {total > 0 ? `${vendidos} de ${total} números vendidos` : 'Rifa solidária da Equipe Vermelha'}
            {melhorPacote && ` · ${melhorPacote.quantidade} por ${formatCurrency(melhorPacote.valorCentavos)}`}
          </span>
        </span>
        <ArrowRight className="w-5 h-5 text-gold flex-shrink-0 group-hover:translate-x-1 transition-transform" />
      </motion.div>
    </Link>
  );
}
