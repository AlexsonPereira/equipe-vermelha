import React, { useEffect, useState } from 'react';
import { animate, motion, useReducedMotion } from 'framer-motion';
import { RefreshCw, RotateCcw, Share2, Trophy } from 'lucide-react';
import { proximoSelo, seloPorPontos, textoCompartilhamento } from '../../utils/quiz';
import { compartilharCardSelo, gerarCardSelo } from './cardSelo';

// Confete com posições fixas (nada aleatório durante a renderização).
const CONFETE = Array.from({ length: 22 }, (_, i) => ({
  x: (i * 37) % 100,
  atraso: (i % 7) * 0.08,
  cor: ['#B30000', '#D4AF37', '#ffffff', '#22c55e'][i % 4],
  giro: (i % 2 ? 1 : -1) * (180 + (i * 23) % 180),
}));

function ContadorAnimado({ valor }) {
  const reduzir = useReducedMotion();
  const [exibido, setExibido] = useState(reduzir ? valor : 0);

  useEffect(() => {
    if (reduzir) return undefined;
    const controle = animate(0, valor, { duration: 1.2, ease: 'easeOut', onUpdate: (v) => setExibido(Math.round(v)) });
    return () => controle.stop();
  }, [valor, reduzir]);

  return <span className="tabular-nums">{reduzir ? valor : exibido}</span>;
}

export default function TelaResultado({ apelido, resultado, enviando, onTentarEnviar, onJogarDeNovo, onVerRanking }) {
  const oficial = resultado.servidor;
  const pontos = oficial?.pontos ?? resultado.pontosLocais;
  const acertos = oficial?.acertos ?? resultado.acertosLocais;
  const erros = oficial?.erros ?? resultado.errosLocais;
  const selo = seloPorPontos(pontos);
  const proximo = proximoSelo(pontos);
  const texto = textoCompartilhamento(apelido, pontos, selo);
  const [card, setCard] = useState(null);

  // Gera o card antes do toque, para o compartilhamento partir direto do clique.
  useEffect(() => {
    let ativo = true;
    gerarCardSelo({ apelido, pontos, selo })
      .then((blob) => ativo && setCard(new File([blob], 'selo-desafio-relampago.png', { type: 'image/png' })))
      .catch(() => ativo && setCard(null));
    return () => { ativo = false; };
  }, [apelido, pontos, selo]);

  return (
    <div className="relative flex flex-col items-center text-center gap-5 overflow-hidden">
      <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 h-80">
        {CONFETE.map((peca, indice) => (
          <motion.span
            key={indice}
            className="absolute top-0 w-2.5 h-4 rounded-sm"
            style={{ left: `${peca.x}%`, backgroundColor: peca.cor }}
            initial={{ y: -20, opacity: 1, rotate: 0 }}
            animate={{ y: 320, opacity: 0, rotate: peca.giro }}
            transition={{ duration: 1.8, delay: 0.6 + peca.atraso, ease: 'easeIn' }}
          />
        ))}
      </div>

      <p className="text-gold font-bold tracking-widest uppercase text-sm">Fim de jogo!</p>
      <p className="text-6xl font-bold text-white"><ContadorAnimado valor={pontos} /> <span className="text-2xl text-gray-400">pts</span></p>
      <p className="text-gray-300">
        ✅ {acertos} {acertos === 1 ? 'acerto' : 'acertos'} · ❌ {erros} {erros === 1 ? 'erro' : 'erros'}
      </p>

      <motion.div
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ delay: 0.5, type: 'spring', damping: 10 }}
        className="w-full rounded-3xl border-2 p-6 bg-black/40"
        style={{ borderColor: selo.cor, boxShadow: `0 0 40px ${selo.cor}55` }}
      >
        <p className="text-xs uppercase tracking-widest text-gray-400 mb-1">Selo conquistado</p>
        <p className="text-6xl mb-2" aria-hidden="true">{selo.emoji}</p>
        <p className="text-2xl font-bold" style={{ color: selo.cor }}>{selo.nome}</p>
        {proximo && (
          <p className="text-sm text-gray-400 mt-2">
            Faltam <strong className="text-white">{proximo.faltam}</strong> pontos para {proximo.selo.emoji} {proximo.selo.nome}
          </p>
        )}
      </motion.div>

      {oficial?.posicao && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1 }} className="text-white">
          <p className="text-lg flex items-center justify-center gap-2">
            <Trophy className="w-5 h-5 text-gold" /> Você está em <strong className="text-gold">{oficial.posicao}º lugar</strong> no ranking!
          </p>
          {oficial.recorde > pontos && (
            <p className="text-sm text-gray-400">Pelo seu recorde de {oficial.recorde} pontos. Bata ele na próxima!</p>
          )}
          {oficial.recorde === pontos && oficial.recorde > 0 && <p className="text-sm text-gold">🎉 Novo recorde pessoal!</p>}
        </motion.div>
      )}
      {enviando && <p className="text-sm text-gray-400">Enviando sua pontuação…</p>}
      {resultado.erroEnvio && (
        <div className="w-full bg-yellow-500/10 border border-yellow-500/40 rounded-2xl p-4 text-sm text-yellow-200 flex flex-col gap-3" role="alert">
          <p>{resultado.erroEnvio}</p>
          {resultado.podeTentar && (
            <button onClick={onTentarEnviar} disabled={enviando} className="min-h-11 rounded-xl bg-yellow-500 text-black font-bold flex items-center justify-center gap-2 disabled:opacity-50">
              <RefreshCw className="w-4 h-4" /> Tentar enviar
            </button>
          )}
        </div>
      )}

      <div className="w-full flex flex-col gap-2">
        <button
          onClick={() => compartilharCardSelo(card, texto)}
          className="w-full min-h-14 rounded-2xl bg-gold hover:bg-yellow-500 text-surface-dark text-lg font-bold flex items-center justify-center gap-2"
        >
          <Share2 className="w-5 h-5" /> Compartilhar meu selo
        </button>
        <div className="grid grid-cols-2 gap-2">
          <button onClick={onJogarDeNovo} className="min-h-12 rounded-2xl bg-brand-red hover:bg-red-700 text-white font-bold flex items-center justify-center gap-2">
            <RotateCcw className="w-4 h-4" /> Jogar de novo
          </button>
          <button onClick={onVerRanking} className="min-h-12 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-bold flex items-center justify-center gap-2">
            <Trophy className="w-4 h-4" /> Ranking
          </button>
        </div>
      </div>
    </div>
  );
}
