import React, { useEffect, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { Plus, RefreshCw, Sparkles, X } from 'lucide-react';
import { adicionarNumeroDaSorte, sortearNumeroDaSorte } from '../../utils/numerosDaSorte';

const CORES_BOLINHAS = ['bg-brand-red', 'bg-gold', 'bg-white', 'bg-green-500', 'bg-brand-red', 'bg-gold', 'bg-white', 'bg-green-500'];

function Globo({ girando }) {
  return (
    <div className="relative w-32 h-32 rounded-full border-4 border-gold/60 bg-gradient-to-br from-white/10 to-black/60 shadow-[inset_0_0_30px_rgba(0,0,0,0.6)]" aria-hidden="true">
      <motion.div
        className="absolute inset-0"
        animate={girando ? { rotate: 360 } : undefined}
        transition={{ repeat: Infinity, duration: 3, ease: 'linear' }}
      >
        {CORES_BOLINHAS.map((cor, indice) => {
          const angulo = (indice / CORES_BOLINHAS.length) * 2 * Math.PI;
          const raio = 30 + (indice % 2) * 14;
          return (
            <span
              key={indice}
              className={`absolute w-5 h-5 rounded-full ${cor} shadow`}
              style={{
                left: `calc(50% + ${Math.cos(angulo) * raio}px - 10px)`,
                top: `calc(50% + ${Math.sin(angulo) * raio}px - 10px)`,
              }}
            />
          );
        })}
      </motion.div>
    </div>
  );
}

export default function EsperaCarregamento({ numerosDaSorte, onAlterarNumeros, falhou, onTentarNovamente }) {
  const reduzirMovimento = useReducedMotion();
  const [demorando, setDemorando] = useState(false);
  const [sorteado, setSorteado] = useState(null);
  const [rodada, setRodada] = useState(0);
  const [digitado, setDigitado] = useState('');
  const [erro, setErro] = useState('');

  useEffect(() => {
    const timer = setTimeout(() => setDemorando(true), 4000);
    return () => clearTimeout(timer);
  }, []);

  const adicionar = (valor) => {
    const resultado = adicionarNumeroDaSorte(numerosDaSorte, valor);
    setErro(resultado.erro);
    if (!resultado.erro) onAlterarNumeros(resultado.lista);
    return !resultado.erro;
  };

  const sortear = () => {
    setSorteado(sortearNumeroDaSorte());
    setRodada((atual) => atual + 1);
    setErro('');
  };

  const guardarSorteado = () => {
    if (adicionar(sorteado)) setSorteado(null);
  };

  const adicionarDigitado = (e) => {
    e.preventDefault();
    if (adicionar(digitado)) setDigitado('');
  };

  return (
    <section className="bg-black/40 border border-white/10 rounded-3xl p-5 flex flex-col items-center text-center gap-4">
      <div className="w-full" aria-live="polite">
        {falhou ? (
          <>
            <p className="font-bold text-white text-lg">Não conseguimos carregar os números</p>
            <p className="text-sm text-gray-400 mt-1">Verifique sua internet e tente de novo. Seus números da sorte continuam guardados.</p>
            <button
              onClick={onTentarNovamente}
              className="mt-3 min-h-12 px-6 bg-brand-red hover:bg-red-700 text-white font-bold rounded-xl inline-flex items-center gap-2"
            >
              <RefreshCw className="w-5 h-5" /> Tentar de novo
            </button>
          </>
        ) : (
          <>
            <p className="font-bold text-white text-lg">
              {demorando ? 'Estamos ligando o servidor da rifa 🔌' : 'Carregando os números…'}
            </p>
            {demorando && (
              <p className="text-sm text-gray-400 mt-1">
                Na primeira visita pode levar até 1 minuto. Enquanto isso, que tal sortear seu número da sorte?
              </p>
            )}
            <div className="h-1.5 bg-white/10 rounded-full overflow-hidden mt-3">
              <motion.div
                className="h-full w-1/3 bg-gold rounded-full"
                animate={reduzirMovimento ? undefined : { x: ['-100%', '300%'] }}
                transition={{ repeat: Infinity, duration: 1.6, ease: 'easeInOut' }}
              />
            </div>
          </>
        )}
      </div>

      <Globo girando={!reduzirMovimento} />

      <AnimatePresence mode="wait">
        {sorteado !== null && (
          <motion.div
            key={rodada}
            initial={reduzirMovimento ? false : { scale: 0, y: -40 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ type: 'spring', damping: 12, stiffness: 200 }}
            className="flex flex-col items-center gap-2"
          >
            <span className="w-20 h-20 rounded-full bg-gold text-surface-dark text-3xl font-bold flex items-center justify-center shadow-lg">
              {sorteado}
            </span>
            <button onClick={guardarSorteado} className="min-h-11 px-5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold inline-flex items-center gap-2">
              <Plus className="w-4 h-4" /> Guardar o {sorteado}
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <button
        onClick={sortear}
        className="w-full min-h-12 bg-gold hover:bg-yellow-500 text-surface-dark font-bold rounded-xl inline-flex items-center justify-center gap-2"
      >
        <Sparkles className="w-5 h-5" /> Sortear meu número da sorte
      </button>

      <form onSubmit={adicionarDigitado} className="w-full flex gap-2">
        <label className="sr-only" htmlFor="numero-da-sorte">Já tem um número da sorte?</label>
        <input
          id="numero-da-sorte"
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          value={digitado}
          onChange={(e) => setDigitado(e.target.value.replace(/\D/g, '').slice(0, 3))}
          placeholder="Já tem um número? Digite"
          className="flex-1 min-w-0 min-h-12 bg-black/50 border border-white/10 rounded-xl px-4 text-base text-white focus:border-gold outline-none"
        />
        <button type="submit" disabled={!digitado} className="min-h-12 px-4 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold disabled:opacity-50">
          Adicionar
        </button>
      </form>

      {erro && <p className="text-sm text-red-300" role="alert">{erro}</p>}

      {numerosDaSorte.length > 0 && (
        <div className="w-full text-left">
          <p className="text-xs uppercase tracking-wider text-gold mb-2">
            Meus números da sorte · serão selecionados quando a grade carregar
          </p>
          <div className="flex flex-wrap gap-2">
            {numerosDaSorte.map((numero) => (
              <button
                key={numero}
                onClick={() => onAlterarNumeros(numerosDaSorte.filter((n) => n !== numero))}
                aria-label={`Remover ${numero}`}
                className="min-h-10 pl-3 pr-2 rounded-full bg-gold/15 border border-gold/40 text-gold font-bold inline-flex items-center gap-1"
              >
                {numero} <X className="w-4 h-4" />
              </button>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
