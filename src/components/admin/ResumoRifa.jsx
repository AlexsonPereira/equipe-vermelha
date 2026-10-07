import React from 'react';
import { AlertTriangle, ChevronRight } from 'lucide-react';
import { formatCurrency } from '../../utils/formatters';

const porcentagem = (parte, total) => (total ? `${(parte / total) * 100}%` : '0%');

export default function ResumoRifa({ resumo, onVerVencidos }) {
  return (
    <section className="flex flex-col gap-3">
      {resumo.total > 0 && (
        <div className="bg-black/40 border border-white/5 rounded-2xl p-4">
          <div className="flex items-baseline justify-between mb-3">
            <p className="text-white font-bold">
              <span className="text-2xl">{resumo.pagos}</span>
              <span className="text-gray-400 font-normal"> de {resumo.total} vendidos</span>
            </p>
            <p className="text-sm text-gray-400">{Math.round((resumo.pagos / resumo.total) * 100)}%</p>
          </div>
          <div className="h-3 rounded-full bg-white/10 overflow-hidden flex" aria-hidden="true">
            <div className="bg-green-500" style={{ width: porcentagem(resumo.pagos, resumo.total) }} />
            <div className="bg-yellow-500" style={{ width: porcentagem(resumo.reservados, resumo.total) }} />
          </div>
          <div className="flex flex-wrap gap-x-4 gap-y-1 mt-3 text-xs text-gray-400">
            <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-green-500" /> {resumo.pagos} pagos</span>
            <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-yellow-500" /> {resumo.reservados} reservados</span>
            <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-white/20" /> {resumo.livres} livres</span>
          </div>
        </div>
      )}

      <div className="grid grid-cols-2 gap-3">
        <div className="bg-black/40 border border-white/5 rounded-2xl p-4">
          <p className="text-xs text-gold uppercase tracking-wider mb-1">Arrecadado</p>
          <p className="text-xl sm:text-2xl font-bold text-green-400 break-words">{formatCurrency(resumo.arrecadado)}</p>
        </div>
        <div className="bg-black/40 border border-white/5 rounded-2xl p-4">
          <p className="text-xs text-gold uppercase tracking-wider mb-1">A receber</p>
          <p className="text-xl sm:text-2xl font-bold text-white break-words">{formatCurrency(resumo.aReceber)}</p>
          <p className="text-xs text-gray-400">{resumo.pendentes} {resumo.pendentes === 1 ? 'pedido' : 'pedidos'}</p>
        </div>
      </div>

      {resumo.vencidos > 0 && (
        <button
          onClick={onVerVencidos}
          className="w-full min-h-12 bg-orange-500/10 border border-orange-500/30 text-orange-300 rounded-2xl px-4 py-3 flex items-center gap-3 text-left"
        >
          <AlertTriangle className="w-5 h-5 flex-shrink-0" />
          <span className="flex-1 text-sm font-bold">
            {resumo.vencidos} {resumo.vencidos === 1 ? 'pedido vencido aguarda' : 'pedidos vencidos aguardam'} decisão
          </span>
          <ChevronRight className="w-5 h-5 flex-shrink-0" />
        </button>
      )}
    </section>
  );
}
