import React from 'react';
import { contarVendas } from '../../utils/selecaoNumeros';

const porcentagem = (parte, total) => `${(parte / total) * 100}%`;

export default function ProgressoVendas({ tickets, ultimosVendidos }) {
  const { total, vendidos, reservados, livres } = contarVendas(tickets);
  if (!total) return null;

  return (
    <section className="bg-black/40 border border-white/10 rounded-2xl p-4">
      <p className="text-white">
        <strong className="text-2xl">{vendidos}</strong>
        <span className="text-gray-400"> de {total} vendidos · </span>
        <strong className="text-gold">{livres}</strong> livres
      </p>
      <div
        className="h-3 bg-white/10 rounded-full overflow-hidden mt-3 flex"
        role="progressbar"
        aria-label="Números vendidos"
        aria-valuemin={0}
        aria-valuemax={total}
        aria-valuenow={vendidos}
      >
        <div className="h-full bg-gradient-to-r from-brand-red to-gold" style={{ width: porcentagem(vendidos, total) }} />
        <div className="h-full bg-yellow-600/70" style={{ width: porcentagem(reservados, total) }} />
      </div>
      {reservados > 0 && (
        <p className="text-xs text-gray-400 mt-2">
          + {reservados} {reservados === 1 ? 'reservado aguardando' : 'reservados aguardando'} pagamento
        </p>
      )}
      {ultimosVendidos.length > 0 && (
        <div className="flex items-center gap-2 mt-3 overflow-x-auto pb-1">
          <span className="text-xs text-gray-400 whitespace-nowrap">Últimos vendidos:</span>
          {ultimosVendidos.map((numero) => (
            <span key={numero} className="text-xs font-bold text-white bg-white/10 rounded-full px-2.5 py-1">{numero}</span>
          ))}
        </div>
      )}
    </section>
  );
}
