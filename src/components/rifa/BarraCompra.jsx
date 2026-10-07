import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Gift } from 'lucide-react';
import { calcularTotal, sugestaoPacote } from '../../utils/precos';
import { formatCurrency } from '../../utils/formatters';

export default function BarraCompra({ selecionados, valorUnitario, pacotes, onAbrir, onAdicionarSugestao, onLimpar }) {
  const quantidade = selecionados.length;
  const total = calcularTotal(quantidade, valorUnitario, pacotes);
  const precoCheio = quantidade * valorUnitario;
  const sugestao = sugestaoPacote(quantidade, valorUnitario, pacotes);
  const numeros = [...selecionados].sort((a, b) => a - b).join(', ');

  return (
    <motion.div
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: 100, opacity: 0 }}
      className="fixed bottom-0 left-0 right-0 z-40 bg-surface-dark/95 backdrop-blur border-t border-white/10 shadow-[0_-10px_40px_rgba(0,0,0,0.5)] px-4 pt-3 pb-[max(1rem,env(safe-area-inset-bottom))]"
    >
      <div className="max-w-4xl mx-auto flex flex-col gap-3">
        {sugestao && (
          <button
            onClick={() => onAdicionarSugestao(sugestao.faltam)}
            className="w-full min-h-11 rounded-xl bg-gold/15 border border-gold/40 text-gold text-sm font-bold flex items-center justify-center gap-2 px-3"
          >
            <Gift className="w-4 h-4 flex-shrink-0" />
            +{sugestao.faltam} e leve {sugestao.quantidade} por {formatCurrency(sugestao.total)}
            {sugestao.total < total && ' (sai mais barato!)'}
            {sugestao.total === total && ' (pelo mesmo preço!)'}
          </button>
        )}

        <div className="flex items-center justify-between gap-3">
          <div className="min-w-0">
            <p className="text-white font-bold">
              {quantidade} {quantidade === 1 ? 'número' : 'números'}
              <button onClick={onLimpar} className="ml-3 text-xs text-gray-400 underline font-normal min-h-8">limpar</button>
            </p>
            <p className="text-xs text-gray-400 truncate" title={numeros}>{numeros}</p>
            <p className="flex items-baseline gap-2">
              <span className="text-gold font-bold text-xl">{formatCurrency(total)}</span>
              {total < precoCheio && <span className="text-sm text-gray-500 line-through">{formatCurrency(precoCheio)}</span>}
            </p>
          </div>
          <button
            onClick={onAbrir}
            className="min-h-12 px-5 rounded-full bg-brand-red hover:bg-red-700 text-white font-bold shadow-lg flex items-center gap-2 flex-shrink-0"
          >
            Reservar <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </motion.div>
  );
}
