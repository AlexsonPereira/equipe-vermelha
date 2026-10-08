import React, { useRef, useState } from 'react';
import { motion, useScroll, useSpring } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { MARCOS } from '../../utils/saoCarlo';

export default function LinhaDoTempo() {
  const [aberto, setAberto] = useState(0);
  const lista = useRef(null);
  const { scrollYProgress } = useScroll({ target: lista, offset: ['start 80%', 'end 60%'] });
  const preenchimento = useSpring(scrollYProgress, { stiffness: 100, damping: 30 });

  return (
    <section className="py-20 px-4 sm:px-6 bg-surface-dark overflow-hidden">
      <div className="max-w-2xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-10"
        >
          <p className="text-gold font-bold tracking-widest uppercase text-sm mb-2">Linha do tempo</p>
          <h2 className="text-3xl md:text-5xl font-bold text-white">De Londres ao altar</h2>
          <p className="text-gray-400 mt-3">Toque em cada ano para conhecer a caminhada de São Carlo.</p>
        </motion.div>

        <ol ref={lista} className="relative pl-10">
          {/* Trilho e preenchimento que cresce com a rolagem */}
          <span aria-hidden="true" className="absolute left-[15px] top-2 bottom-2 w-1 rounded-full bg-white/10" />
          <motion.span
            aria-hidden="true"
            style={{ scaleY: preenchimento }}
            className="absolute left-[15px] top-2 bottom-2 w-1 rounded-full origin-top bg-gradient-to-b from-gold to-brand-red"
          />

          {MARCOS.map((marco, indice) => {
            const estaAberto = aberto === indice;
            const ultimo = indice === MARCOS.length - 1;
            return (
              <motion.li
                key={marco.ano}
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.5 }}
                className="relative mb-4 last:mb-0"
              >
                <span
                  aria-hidden="true"
                  className={`absolute -left-10 top-3 w-8 h-8 rounded-full border-4 border-surface-dark flex items-center justify-center text-xs ${ultimo ? 'bg-gold' : estaAberto ? 'bg-brand-red' : 'bg-white/20'}`}
                >
                  {ultimo ? '✨' : ''}
                </span>
                <button
                  onClick={() => setAberto(estaAberto ? -1 : indice)}
                  aria-expanded={estaAberto}
                  className={`w-full text-left rounded-2xl border p-4 transition-colors ${estaAberto ? 'bg-brand-red/15 border-brand-red/50' : 'bg-black/40 border-white/10'}`}
                >
                  <span className="flex items-center justify-between gap-3">
                    <span>
                      <span className="block text-gold font-bold text-sm">{marco.ano}</span>
                      <span className="block text-white font-bold text-lg">{marco.titulo}</span>
                    </span>
                    <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform ${estaAberto ? 'rotate-180' : ''}`} />
                  </span>
                  <motion.span
                    initial={false}
                    animate={{ height: estaAberto ? 'auto' : 0, opacity: estaAberto ? 1 : 0 }}
                    className="block overflow-hidden"
                  >
                    <span className="block text-gray-300 pt-2">{marco.texto}</span>
                  </motion.span>
                </button>
              </motion.li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
