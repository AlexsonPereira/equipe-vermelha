import React, { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

const PASSOS = ['3', '2', '1', 'Já!'];
const ESPERA_PARA_OFERECER_SAIDA_MS = 8000;

// Contagem 3-2-1; avisa o fim pelo `onFim`. Se a partida ainda não chegou, mostra que o servidor está
// acordando e, depois de alguns segundos, oferece tentar de novo ou voltar.
export default function Contagem({ onFim, aguardandoServidor, onTentarNovamente, onVoltar }) {
  const [passo, setPasso] = useState(0);
  const [demorando, setDemorando] = useState(false);
  const acabou = passo >= PASSOS.length - 1;

  useEffect(() => {
    if (acabou) {
      const timer = setTimeout(onFim, 600);
      return () => clearTimeout(timer);
    }
    const timer = setTimeout(() => setPasso((atual) => atual + 1), 800);
    return () => clearTimeout(timer);
  }, [passo, acabou, onFim]);

  useEffect(() => {
    if (!acabou || !aguardandoServidor) return undefined;
    const timer = setTimeout(() => setDemorando(true), ESPERA_PARA_OFERECER_SAIDA_MS);
    return () => clearTimeout(timer);
  }, [acabou, aguardandoServidor]);

  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center gap-6" aria-live="assertive">
      <AnimatePresence mode="wait">
        <motion.span
          key={passo}
          initial={{ scale: 2.2, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.3, opacity: 0 }}
          transition={{ duration: 0.35 }}
          className={`font-marker text-9xl ${acabou ? 'text-gold' : 'text-brand-red'} drop-shadow-[0_0_25px_rgba(179,0,0,0.7)]`}
        >
          {PASSOS[passo]}
        </motion.span>
      </AnimatePresence>
      {aguardandoServidor && acabou && (
        <p className="text-gray-300 text-center">Ligando o servidor do desafio… pode levar alguns segundos 🔌</p>
      )}
      {aguardandoServidor && demorando && (
        <div className="w-full grid grid-cols-2 gap-2">
          <button onClick={onTentarNovamente} className="min-h-12 rounded-2xl bg-brand-red text-white font-bold">Tentar de novo</button>
          <button onClick={onVoltar} className="min-h-12 rounded-2xl bg-white/10 text-white font-bold">Voltar</button>
        </div>
      )}
    </div>
  );
}
