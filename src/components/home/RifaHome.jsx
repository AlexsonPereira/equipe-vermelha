import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Ticket } from 'lucide-react';
import DestaquePremio from '../rifa/DestaquePremio';
import ProgressoVendas from '../rifa/ProgressoVendas';

export default function RifaHome({ rifa }) {
  return (
    <section id="rifa" className="py-20 px-4 sm:px-6 bg-gradient-to-b from-primary/10 to-surface-dark">
      <div className="max-w-5xl mx-auto grid gap-8 md:grid-cols-2 md:items-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="min-w-0 flex flex-col gap-5 text-center md:text-left"
        >
          <p className="text-gold font-bold tracking-widest uppercase text-sm">Rifa Solidária</p>
          <h2 className="text-4xl md:text-5xl font-bold text-white leading-tight">
            Ajude nossa causa e{' '}
            <span className="text-brand-red drop-shadow-[0_0_10px_rgba(179,0,0,0.8)]">concorra a {rifa.premio === 'Air Fryer' ? 'uma Air Fryer' : rifa.premio}!</span>
          </h2>
          <p className="bg-brand-red/10 border-l-4 border-brand-red p-4 rounded-r-xl text-gray-200 text-left">
            Mais do que um prêmio, seu bilhete é um <strong>ato de amor</strong>. Todo o valor arrecadado vira alimentos e itens
            de primeira necessidade para pessoas em situação de vulnerabilidade em nossa comunidade.
          </p>
          {rifa.tickets.length > 0 && <ProgressoVendas tickets={rifa.tickets} ultimosVendidos={rifa.ultimosVendidos} />}
          <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
            <Link
              to="/tickets"
              className="w-full inline-flex items-center justify-center gap-3 min-h-14 bg-brand-red hover:bg-red-700 text-white font-bold text-lg rounded-full shadow-[0_15px_40px_rgba(179,0,0,0.4)]"
            >
              <Ticket className="w-6 h-6" /> Quero ajudar e concorrer
            </Link>
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="min-w-0"
        >
          <DestaquePremio rifa={rifa} />
        </motion.div>
      </div>
    </section>
  );
}
