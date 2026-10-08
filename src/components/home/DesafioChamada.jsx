import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Trophy, Zap } from 'lucide-react';
import { fetchRankingQuiz } from '../../services/api';

const MEDALHAS = ['🥇', '🥈', '🥉'];

export default function DesafioChamada() {
  const [top3, setTop3] = useState(null);

  useEffect(() => {
    fetchRankingQuiz()
      .then((ranking) => setTop3(ranking.slice(0, 3)))
      .catch(() => setTop3([]));
  }, []);

  return (
    <section className="px-4 sm:px-6 py-10 bg-surface-dark">
      <motion.div
        initial={{ opacity: 0, scale: 0.94 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true, margin: '-60px' }}
        transition={{ type: 'spring', damping: 16 }}
        className="max-w-3xl mx-auto relative overflow-hidden rounded-[2rem] border-2 border-gold/50 bg-gradient-to-br from-brand-red/40 via-black to-black p-6 sm:p-8 shadow-[0_0_50px_rgba(212,175,55,0.2)]"
      >
        <motion.span
          aria-hidden="true"
          animate={{ rotate: [0, 15, -10, 0], scale: [1, 1.2, 1] }}
          transition={{ repeat: Infinity, duration: 2.2 }}
          className="absolute -top-4 -right-2 text-8xl opacity-20"
        >
          ⚡
        </motion.span>
        <p className="text-gold font-bold tracking-widest uppercase text-sm flex items-center gap-2"><Zap className="w-4 h-4" /> Desafio Relâmpago</p>
        <h2 className="text-3xl md:text-4xl font-bold text-white mt-1">Quem conhece mais São Carlo?</h2>
        <p className="text-gray-300 mt-2">60 segundos, perguntas rápidas, combo de acertos e selos para compartilhar. Entre no ranking!</p>

        <div className="mt-5 bg-black/40 rounded-2xl p-4">
          <p className="text-xs uppercase tracking-widest text-gray-400 mb-3 flex items-center gap-2"><Trophy className="w-4 h-4 text-gold" /> Top 3 agora</p>
          {top3 === null ? (
            <p className="text-sm text-gray-400">Carregando…</p>
          ) : top3.length === 0 ? (
            <p className="text-sm text-gray-300">Ninguém pontuou ainda. O primeiro lugar é seu! 🏆</p>
          ) : (
            <ol className="flex flex-col gap-2">
              {top3.map((linha, indice) => (
                <motion.li
                  key={linha.posicao}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2 + indice * 0.12 }}
                  className="flex items-center gap-3"
                >
                  <span className="text-2xl" aria-hidden="true">{MEDALHAS[indice]}</span>
                  <span className="flex-1 font-bold text-white truncate">{linha.apelido}</span>
                  <span className="text-gold font-bold tabular-nums">{linha.pontos} pts</span>
                </motion.li>
              ))}
            </ol>
          )}
        </div>

        <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} className="mt-5">
          <Link to="/quiz" className="w-full min-h-14 rounded-2xl bg-gold hover:bg-yellow-500 text-surface-dark text-lg font-bold flex items-center justify-center gap-2">
            <Zap className="w-5 h-5" /> Jogar agora
          </Link>
        </motion.div>
      </motion.div>
    </section>
  );
}
