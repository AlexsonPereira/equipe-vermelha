import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Quote, RefreshCw, Share2, Sparkles } from 'lucide-react';
import { FRASES, sortearOutraFrase } from '../../utils/saoCarlo';

const CHAVE_VELAS = 'velasAcesas';

const lerVelas = () => {
  try {
    const valor = Number(localStorage.getItem(CHAVE_VELAS));
    return Number.isInteger(valor) && valor > 0 ? valor : 0;
  } catch {
    return 0;
  }
};

const compartilhar = async (texto) => {
  const url = window.location.origin;
  if (navigator.share) {
    try {
      await navigator.share({ title: 'São Carlo Acutis', text: texto, url });
      return;
    } catch (error) {
      if (error.name === 'AbortError') return;
    }
  }
  window.open(`https://wa.me/?text=${encodeURIComponent(`${texto}\n${url}`)}`, '_blank');
};

function CartaDaFrase() {
  const [indice, setIndice] = useState(null);

  const sortear = () => setIndice((atual) => sortearOutraFrase(atual, FRASES.length));
  const frase = indice === null ? null : FRASES[indice];

  return (
    <div className="bg-black/40 border border-white/10 rounded-3xl p-6 flex flex-col gap-5 [perspective:1000px]">
      <div>
        <p className="text-gold font-bold tracking-widest uppercase text-xs mb-1">Para o seu dia</p>
        <h3 className="text-2xl font-bold text-white">Uma frase de São Carlo para você</h3>
      </div>

      <div className="min-h-[190px] flex items-center justify-center">
        <AnimatePresence mode="wait">
          {frase ? (
            <motion.figure
              key={indice}
              initial={{ rotateY: 90, opacity: 0 }}
              animate={{ rotateY: 0, opacity: 1 }}
              exit={{ rotateY: -90, opacity: 0 }}
              transition={{ duration: 0.45 }}
              className="w-full bg-gradient-to-br from-gold/20 to-brand-red/20 border border-gold/40 rounded-2xl p-6 text-center"
            >
              <Quote className="w-8 h-8 text-gold mx-auto mb-3 opacity-70" aria-hidden="true" />
              <blockquote className="font-cursive text-2xl text-white leading-snug">“{frase}”</blockquote>
              <figcaption className="text-sm text-gold mt-3">— São Carlo Acutis</figcaption>
            </motion.figure>
          ) : (
            <motion.button
              key="verso"
              onClick={sortear}
              initial={{ rotateY: -90, opacity: 0 }}
              animate={{ rotateY: 0, opacity: 1 }}
              exit={{ rotateY: 90, opacity: 0 }}
              whileTap={{ scale: 0.97 }}
              className="w-full min-h-[190px] rounded-2xl border-2 border-dashed border-gold/50 bg-gold/5 flex flex-col items-center justify-center gap-3 text-gold"
            >
              <motion.span
                animate={{ rotate: [0, 12, -12, 0], scale: [1, 1.15, 1] }}
                transition={{ repeat: Infinity, duration: 2.4 }}
              >
                <Sparkles className="w-10 h-10" />
              </motion.span>
              <span className="font-bold">Toque para receber sua frase</span>
            </motion.button>
          )}
        </AnimatePresence>
      </div>

      {frase && (
        <div className="grid grid-cols-2 gap-2">
          <button onClick={sortear} className="min-h-12 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold flex items-center justify-center gap-2">
            <RefreshCw className="w-4 h-4" /> Outra frase
          </button>
          <button
            onClick={() => compartilhar(`“${frase}” — São Carlo Acutis`)}
            className="min-h-12 rounded-xl bg-gold hover:bg-yellow-500 text-surface-dark font-bold flex items-center justify-center gap-2"
          >
            <Share2 className="w-4 h-4" /> Compartilhar
          </button>
        </div>
      )}
    </div>
  );
}

function Chama() {
  return (
    <motion.span
      aria-hidden="true"
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: [1, 1.08, 0.96, 1.05, 1], opacity: 1, rotate: [-2, 2, -1, 1, -2] }}
      transition={{ scale: { repeat: Infinity, duration: 1.6 }, rotate: { repeat: Infinity, duration: 2.2 }, opacity: { duration: 0.4 } }}
      className="absolute -top-14 left-1/2 -ml-4 w-8 h-14 rounded-[50%_50%_50%_50%/60%_60%_40%_40%] bg-gradient-to-t from-orange-500 via-yellow-300 to-white shadow-[0_0_40px_15px_rgba(251,191,36,0.45)] origin-bottom"
    />
  );
}

function VelaDeIntencao() {
  const [acesa, setAcesa] = useState(false);
  const [intencao, setIntencao] = useState('');
  const [velas, setVelas] = useState(lerVelas);

  const acender = () => {
    const total = velas + 1;
    try {
      localStorage.setItem(CHAVE_VELAS, String(total));
    } catch {
      // Sem armazenamento local a contagem só não é lembrada.
    }
    setVelas(total);
    setAcesa(true);
  };

  return (
    <div className="bg-black/40 border border-white/10 rounded-3xl p-6 flex flex-col gap-5">
      <div>
        <p className="text-gold font-bold tracking-widest uppercase text-xs mb-1">Momento de oração</p>
        <h3 className="text-2xl font-bold text-white">Acenda uma vela</h3>
        <p className="text-sm text-gray-400 mt-1">Coloque sua intenção nas mãos de São Carlo Acutis.</p>
      </div>

      <div className="relative h-48 flex items-end justify-center">
        {acesa && <span aria-hidden="true" className="absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,rgba(251,191,36,0.25),transparent_60%)]" />}
        <div className="relative w-16 h-28 rounded-t-lg rounded-b-md bg-gradient-to-b from-white to-gray-200 shadow-[inset_-6px_0_10px_rgba(0,0,0,0.15)]">
          <span aria-hidden="true" className="absolute -top-3 left-1/2 -ml-0.5 w-1 h-3 bg-gray-800 rounded" />
          <AnimatePresence>{acesa && <Chama />}</AnimatePresence>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {acesa ? (
          <motion.div key="acesa" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="text-center flex flex-col gap-3">
            <p className="text-white">
              Sua intenção {intencao.trim() && <>“<strong>{intencao.trim()}</strong>” </>}foi confiada a São Carlo. 🙏
            </p>
            <p className="font-cursive text-xl text-gold">São Carlo Acutis, rogai por nós!</p>
            {velas > 1 && <p className="text-xs text-gray-400">Você já acendeu {velas} velas aqui.</p>}
            <button
              onClick={() => { setAcesa(false); setIntencao(''); }}
              className="min-h-11 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold"
            >
              Fazer outra intenção
            </button>
          </motion.div>
        ) : (
          <motion.div key="apagada" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col gap-3">
            <label className="sr-only" htmlFor="intencao">Sua intenção (opcional)</label>
            <input
              id="intencao"
              value={intencao}
              onChange={(e) => setIntencao(e.target.value.slice(0, 80))}
              placeholder="Sua intenção (opcional, fica só com você)"
              className="w-full min-h-12 bg-black/50 border border-white/10 rounded-xl px-4 text-base text-white focus:border-gold outline-none"
            />
            <button
              onClick={acender}
              className="min-h-12 rounded-xl bg-gradient-to-r from-orange-500 to-yellow-400 text-surface-dark font-bold shadow-[0_0_25px_rgba(251,191,36,0.35)]"
            >
              🕯️ Acender vela
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function MomentoComCarlo() {
  return (
    <section className="py-20 px-4 sm:px-6 bg-gradient-to-b from-surface-dark to-primary/20">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-10"
        >
          <p className="text-gold font-bold tracking-widest uppercase text-sm mb-2">Momento com São Carlo</p>
          <h2 className="text-3xl md:text-5xl font-bold text-white">Uma pausa para o coração</h2>
        </motion.div>
        <div className="grid gap-6 md:grid-cols-2">
          <CartaDaFrase />
          <VelaDeIntencao />
        </div>
      </div>
    </section>
  );
}
