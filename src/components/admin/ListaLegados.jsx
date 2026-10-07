import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { formatPhone } from '../../utils/formatters';

export default function ListaLegados({ tickets, onLiberar }) {
  const [aberta, setAberta] = useState(false);

  if (tickets.length === 0) return null;

  return (
    <section className="bg-black/40 border border-white/5 rounded-2xl">
      <button
        onClick={() => setAberta(!aberta)}
        aria-expanded={aberta}
        className="w-full min-h-14 px-4 flex items-center justify-between gap-3 text-left"
      >
        <span>
          <span className="block font-bold text-white">Registros legados ({tickets.length})</span>
          <span className="block text-xs text-gray-400">Números de antes dos pedidos; só podem ser liberados.</span>
        </span>
        {aberta ? <ChevronUp className="w-5 h-5 text-gray-400" /> : <ChevronDown className="w-5 h-5 text-gray-400" />}
      </button>

      {aberta && (
        <ul className="divide-y divide-white/5 border-t border-white/5">
          {tickets.map((t) => (
            <li key={t.numero} className="px-4 py-3 flex items-center justify-between gap-3">
              <div className="min-w-0">
                <p className="font-bold text-white">
                  #{t.numero} <span className={`text-xs font-normal ${t.status === 'PAGO' ? 'text-green-400' : 'text-yellow-400'}`}>{t.status}</span>
                </p>
                <p className="text-sm text-gray-400 truncate">{t.comprador_nome || 'Sem nome'} · {formatPhone(t.comprador_telefone || '') || 'sem telefone'}</p>
              </div>
              <button
                onClick={() => onLiberar(t)}
                className="min-h-11 px-4 rounded-xl border border-red-500/30 text-red-400 text-sm font-bold flex-shrink-0"
              >
                Liberar
              </button>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
