import React from 'react';
import { motion } from 'framer-motion';
import { Flame, Timer, Trophy, Zap } from 'lucide-react';
import RankingQuiz from './RankingQuiz';

const REGRAS = [
  { Icone: Timer, texto: '60 segundos' },
  { Icone: Flame, texto: '+100 por acerto e combo' },
  { Icone: Zap, texto: 'Erro tira 5s' },
];

export default function TelaInicio({ apelido, onAlterarApelido, ranking, erro, onComecar, onVerRanking }) {
  const enviar = (e) => {
    e.preventDefault();
    onComecar();
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="text-center">
        <motion.div
          animate={{ rotate: [0, -8, 8, 0], scale: [1, 1.1, 1] }}
          transition={{ repeat: Infinity, duration: 2.5 }}
          className="text-6xl mb-2"
          aria-hidden="true"
        >
          ⚡
        </motion.div>
        <p className="text-gold font-bold tracking-widest uppercase text-sm">Desafio Relâmpago</p>
        <h1 className="text-3xl md:text-5xl font-bold text-white leading-tight mt-1">Quanto você conhece São Carlo?</h1>
      </div>

      <ul className="grid grid-cols-3 gap-2">
        {REGRAS.map(({ Icone, texto }) => (
          <li key={texto} className="bg-black/40 border border-white/10 rounded-2xl p-3 flex flex-col items-center text-center gap-2">
            <Icone className="w-6 h-6 text-gold" aria-hidden="true" />
            <span className="text-xs text-gray-200 font-bold leading-tight">{texto}</span>
          </li>
        ))}
      </ul>

      <form onSubmit={enviar} className="flex flex-col gap-3">
        <label className="text-xs text-gold uppercase tracking-wider font-bold" htmlFor="apelido">Seu apelido no ranking</label>
        <input
          id="apelido"
          value={apelido}
          onChange={(e) => onAlterarApelido(e.target.value.slice(0, 20))}
          placeholder="Ex.: Maria do MAC"
          autoComplete="nickname"
          className="w-full min-h-14 bg-black/50 border border-white/10 rounded-2xl px-4 text-lg text-white focus:border-gold outline-none"
        />
        {erro && <p className="text-sm text-red-300" role="alert">{erro}</p>}
        <motion.button
          type="submit"
          whileTap={{ scale: 0.97 }}
          className="w-full min-h-16 rounded-2xl bg-gradient-to-r from-brand-red to-red-600 text-white text-xl font-bold shadow-[0_10px_40px_rgba(179,0,0,0.5)]"
        >
          Começar ⚡
        </motion.button>
      </form>

      <section className="bg-black/40 border border-white/10 rounded-3xl p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-bold text-white flex items-center gap-2"><Trophy className="w-5 h-5 text-gold" /> Top 3</h2>
          <button onClick={onVerRanking} className="min-h-11 px-3 text-sm text-gold font-bold">Ver ranking completo</button>
        </div>
        <RankingQuiz ranking={ranking} apelidoDestaque={apelido} compacto />
      </section>
    </div>
  );
}
