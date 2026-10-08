import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { HeartHandshake, Ticket } from 'lucide-react';
import { formatCurrency } from '../../utils/formatters';

// No celular, as duas ações principais ficam sempre a um toque.
export default function BarraAcoesMobile({ valorCentavos }) {
  return (
    <motion.nav
      aria-label="Ações principais"
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      transition={{ delay: 1.2, type: 'spring', damping: 20 }}
      className="md:hidden fixed bottom-0 inset-x-0 z-50 bg-surface-dark/95 backdrop-blur border-t border-white/10 px-3 pt-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] grid grid-cols-2 gap-2"
    >
      <Link to="/tickets" className="min-h-12 rounded-xl bg-gold text-surface-dark font-bold flex items-center justify-center gap-2">
        <Ticket className="w-5 h-5" /> Rifa {formatCurrency(valorCentavos)}
      </Link>
      <a href="#doacoes" className="min-h-12 rounded-xl bg-brand-red text-white font-bold flex items-center justify-center gap-2">
        <HeartHandshake className="w-5 h-5" /> Doar alimentos
      </a>
    </motion.nav>
  );
}
