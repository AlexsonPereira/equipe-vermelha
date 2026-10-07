import React from 'react';
import { HeartHandshake, MessageCircle, QrCode, Ticket } from 'lucide-react';

const PASSOS = [
  { Icone: Ticket, titulo: 'Escolha seus números', texto: 'Toque nos livres ou deixe a gente escolher para você.' },
  { Icone: QrCode, titulo: 'Pague o PIX', texto: 'QR Code ou copia e cola, com o valor exato do pedido.' },
  { Icone: MessageCircle, titulo: 'Envie o comprovante', texto: 'Mande no WhatsApp e receba seus bilhetes confirmados.' },
];

export default function ComoFunciona() {
  return (
    <section className="flex flex-col gap-3">
      <h2 className="text-lg font-bold text-white">Como funciona</h2>
      <ol className="grid gap-2 sm:grid-cols-3">
        {PASSOS.map(({ Icone, titulo, texto }, indice) => (
          <li key={titulo} className="bg-black/40 border border-white/10 rounded-2xl p-4 flex sm:flex-col gap-3">
            <span className="relative w-11 h-11 flex-shrink-0 rounded-full bg-brand-red/20 text-brand-red flex items-center justify-center">
              <Icone className="w-5 h-5" aria-hidden="true" />
              <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-gold text-surface-dark text-xs font-bold flex items-center justify-center">
                {indice + 1}
              </span>
            </span>
            <div>
              <p className="font-bold text-white">{titulo}</p>
              <p className="text-sm text-gray-400">{texto}</p>
            </div>
          </li>
        ))}
      </ol>
      <p className="text-sm text-gray-300 bg-brand-red/10 border border-brand-red/30 rounded-2xl p-4 flex gap-3">
        <HeartHandshake className="w-5 h-5 text-brand-red flex-shrink-0 mt-0.5" aria-hidden="true" />
        <span>
          Toda a arrecadação vai para <strong className="text-white">famílias e pessoas em situação de vulnerabilidade</strong> da nossa comunidade.
        </span>
      </p>
    </section>
  );
}
