import React, { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { pontosDoAcerto, tempoRestanteMs } from '../../utils/quiz';

const LIMITE_RESPOSTAS = 100;
const ESPERA_FEEDBACK_MS = 600;
const RAIO = 26;
const CIRCUNFERENCIA = 2 * Math.PI * RAIO;

const embaralhar = (lista) => {
  const copia = [...lista];
  for (let i = copia.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copia[i], copia[j]] = [copia[j], copia[i]];
  }
  return copia;
};

function Relogio({ restanteMs, duracaoMs }) {
  const segundos = Math.ceil(restanteMs / 1000);
  const urgente = restanteMs <= 10000;
  return (
    <motion.div
      animate={urgente ? { scale: [1, 1.08, 1] } : { scale: 1 }}
      transition={urgente ? { repeat: Infinity, duration: 0.8 } : undefined}
      className="relative w-16 h-16"
      role="timer"
      aria-label={`${segundos} segundos restantes`}
    >
      <svg viewBox="0 0 64 64" className="w-16 h-16 -rotate-90">
        <circle cx="32" cy="32" r={RAIO} className="fill-none stroke-white/10" strokeWidth="6" />
        <circle
          cx="32"
          cy="32"
          r={RAIO}
          className={`fill-none ${urgente ? 'stroke-red-500' : 'stroke-gold'}`}
          strokeWidth="6"
          strokeLinecap="round"
          strokeDasharray={CIRCUNFERENCIA}
          strokeDashoffset={CIRCUNFERENCIA * (1 - restanteMs / duracaoMs)}
        />
      </svg>
      <span className={`absolute inset-0 flex items-center justify-center text-xl font-bold tabular-nums ${urgente ? 'text-red-400' : 'text-white'}`}>
        {segundos}
      </span>
    </motion.div>
  );
}

export default function TelaPartida({ partida, onFim }) {
  const [inicio] = useState(() => Date.now());
  const [agora, setAgora] = useState(() => Date.now());
  const [fila, setFila] = useState(partida.perguntas);
  const [indice, setIndice] = useState(0);
  const [erros, setErros] = useState(0);
  const [combo, setCombo] = useState(0);
  const [pontos, setPontos] = useState(0);
  const [feedback, setFeedback] = useState(null); // { opcaoId, acertou, ganho }
  const [efeitos, setEfeitos] = useState([]); // textos flutuantes "+120" / "−5s"
  const respostas = useRef([]);
  const acertos = useRef([]);
  const terminou = useRef(false);
  const timerFeedback = useRef(null);
  const proximoEfeito = useRef(0);

  const restante = tempoRestanteMs(inicio, erros, agora, partida.duracaoMs, partida.penalidadeMs);
  const pergunta = fila[indice];

  const finalizar = () => {
    if (terminou.current) return;
    terminou.current = true;
    onFim(respostas.current, acertos.current);
  };

  useEffect(() => {
    const relogio = setInterval(() => setAgora(Date.now()), 100);
    return () => {
      clearInterval(relogio);
      clearTimeout(timerFeedback.current);
    };
  }, []);

  useEffect(() => {
    if (restante <= 0 && !terminou.current) {
      terminou.current = true;
      onFim(respostas.current, acertos.current);
    }
  }, [restante, onFim]);

  const avancar = () => {
    setFeedback(null);
    if (indice + 1 < fila.length) {
      setIndice(indice + 1);
    } else {
      // Banco acabou antes do tempo: reembaralha e continua.
      setFila(embaralhar(partida.perguntas));
      setIndice(0);
    }
  };

  const mostrarEfeito = (texto, tipo) => {
    proximoEfeito.current += 1;
    const id = proximoEfeito.current;
    setEfeitos((atuais) => [...atuais, { id, texto, tipo }]);
    setTimeout(() => setEfeitos((atuais) => atuais.filter((e) => e.id !== id)), 900);
  };

  const responder = (opcao) => {
    if (feedback || terminou.current || restante <= 0) return;
    const acertou = opcao.id === pergunta.correta;
    respostas.current.push({ perguntaId: pergunta.id, opcaoId: opcao.id });
    acertos.current.push(acertou);

    if (acertou) {
      const novoCombo = combo + 1;
      const ganho = pontosDoAcerto(novoCombo);
      setCombo(novoCombo);
      setPontos((atual) => atual + ganho);
      setFeedback({ opcaoId: opcao.id, acertou: true });
      mostrarEfeito(`+${ganho}`, 'ganho');
      navigator.vibrate?.(30);
    } else {
      setCombo(0);
      setErros((atual) => atual + 1);
      setFeedback({ opcaoId: opcao.id, acertou: false });
      mostrarEfeito(`−${partida.penalidadeMs / 1000}s`, 'penalidade');
      navigator.vibrate?.([60, 40, 60]);
    }

    if (respostas.current.length >= LIMITE_RESPOSTAS) {
      finalizar();
      return;
    }
    timerFeedback.current = setTimeout(avancar, ESPERA_FEEDBACK_MS);
  };

  const corDaOpcao = (opcao) => {
    if (!feedback) return 'bg-white/10 border-white/15 active:bg-white/20';
    if (opcao.id === pergunta.correta) return 'bg-green-600 border-green-400';
    if (opcao.id === feedback.opcaoId) return 'bg-red-600 border-red-400';
    return 'bg-white/5 border-white/10 opacity-50';
  };

  return (
    <div className="flex flex-col gap-5">
      <div className="relative flex items-center justify-between gap-3 bg-black/40 border border-white/10 rounded-2xl p-3">
        <Relogio restanteMs={restante} duracaoMs={partida.duracaoMs} />
        <div className="text-center">
          <p className="text-[10px] uppercase tracking-widest text-gray-400">Pontos</p>
          <motion.p key={pontos} initial={{ scale: 1.4 }} animate={{ scale: 1 }} className="text-3xl font-bold text-gold tabular-nums">
            {pontos}
          </motion.p>
        </div>
        <div className="w-16 flex justify-center">
          <AnimatePresence>
            {combo >= 2 && (
              <motion.span
                key={combo}
                initial={{ scale: 0, rotate: -20 }}
                animate={{ scale: 1, rotate: 0 }}
                exit={{ scale: 0 }}
                className="px-2 py-1 rounded-full bg-orange-500/20 border border-orange-400/60 text-orange-300 font-bold text-sm whitespace-nowrap"
              >
                🔥 x{combo}
              </motion.span>
            )}
          </AnimatePresence>
        </div>

        <AnimatePresence>
          {efeitos.map((efeito) => (
            <motion.span
              key={efeito.id}
              initial={{ opacity: 1, y: 0 }}
              animate={{ opacity: 0, y: -50 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.9 }}
              className={`pointer-events-none absolute left-1/2 -translate-x-1/2 top-2 text-2xl font-bold ${efeito.tipo === 'ganho' ? 'text-green-400' : 'text-red-400'}`}
            >
              {efeito.texto}
            </motion.span>
          ))}
        </AnimatePresence>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={`${pergunta.id}-${indice}`}
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -40 }}
          transition={{ duration: 0.2 }}
          className="flex flex-col gap-4"
        >
          <h2 className="text-xl md:text-2xl font-bold text-white leading-snug min-h-[4.5rem]">{pergunta.texto}</h2>
          <div className="grid gap-3">
            {pergunta.opcoes.map((opcao) => {
              const errada = feedback && !feedback.acertou && opcao.id === feedback.opcaoId;
              return (
                <motion.button
                  key={opcao.id}
                  onClick={() => responder(opcao)}
                  disabled={Boolean(feedback)}
                  animate={errada ? { x: [0, -10, 10, -6, 6, 0] } : { x: 0 }}
                  transition={{ duration: 0.4 }}
                  whileTap={feedback ? undefined : { scale: 0.97 }}
                  className={`min-h-14 w-full rounded-2xl border-2 px-4 py-3 text-left text-lg font-bold text-white transition-colors ${corDaOpcao(opcao)}`}
                >
                  {opcao.texto}
                </motion.button>
              );
            })}
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
