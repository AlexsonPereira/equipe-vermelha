import React from 'react';
import { motion } from 'framer-motion';
import { normalizarParaComparar } from './normalizar';

const PODIO = [
  { lugar: 2, medalha: '🥈', altura: 'h-24', cor: 'from-gray-300/30 to-gray-500/10' },
  { lugar: 1, medalha: '🥇', altura: 'h-32', cor: 'from-gold/40 to-gold/10' },
  { lugar: 3, medalha: '🥉', altura: 'h-20', cor: 'from-orange-400/30 to-orange-700/10' },
];

export default function RankingQuiz({ ranking, apelidoDestaque = '', compacto = false }) {
  if (ranking === null) return <p className="text-center text-gray-400 py-6">Carregando ranking…</p>;
  if (ranking.length === 0) {
    return <p className="text-center text-gray-400 py-6">Ninguém pontuou ainda. Seja o primeiro! 🏆</p>;
  }

  const destaque = normalizarParaComparar(apelidoDestaque);
  const ehVoce = (linha) => destaque && normalizarParaComparar(linha.apelido) === destaque;
  const porLugar = Object.fromEntries(ranking.map((linha) => [linha.posicao, linha]));
  const resto = compacto ? [] : ranking.filter((linha) => linha.posicao > 3);

  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-3 gap-2 items-end">
        {PODIO.map(({ lugar, medalha, altura, cor }, indice) => {
          const linha = porLugar[lugar];
          return (
            <motion.div
              key={lugar}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 * indice, type: 'spring', damping: 14 }}
              className="flex flex-col items-center gap-1 min-w-0"
            >
              <span className="text-3xl" aria-hidden="true">{medalha}</span>
              <span className={`text-sm font-bold truncate max-w-full ${linha && ehVoce(linha) ? 'text-gold' : 'text-white'}`}>
                {linha ? linha.apelido : '—'}
              </span>
              <span className="text-xs text-gray-400">{linha ? `${linha.pontos} pts` : ''}</span>
              <div className={`w-full ${altura} rounded-t-xl bg-gradient-to-b ${cor} border border-white/10 flex items-start justify-center pt-2 text-2xl font-bold text-white/80`}>
                {lugar}
              </div>
            </motion.div>
          );
        })}
      </div>

      {resto.length > 0 && (
        <ol className="flex flex-col gap-2">
          {resto.map((linha, indice) => (
            <motion.li
              key={linha.posicao}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 + indice * 0.05 }}
              className={`flex items-center gap-3 rounded-xl px-4 min-h-12 border ${ehVoce(linha) ? 'bg-gold/15 border-gold/50' : 'bg-white/5 border-white/10'}`}
            >
              <span className="w-6 text-gray-400 font-bold">{linha.posicao}º</span>
              <span className="flex-1 font-bold text-white truncate">{linha.apelido}{ehVoce(linha) && ' (você)'}</span>
              <span className="text-gold font-bold tabular-nums">{linha.pontos}</span>
            </motion.li>
          ))}
        </ol>
      )}
    </div>
  );
}
