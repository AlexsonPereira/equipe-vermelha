import React from 'react';
import { formatCurrency } from '../../utils/formatters';

// Celular: folha de compartilhamento do sistema. Sem suporte: WhatsApp com texto pronto.
export default function BotaoCompartilhar({ premio, valorCentavos, className = '', children, ...props }) {
  const compartilhar = async () => {
    const url = `${window.location.origin}/tickets`;
    const texto = premio
      ? `Estou participando da Rifa Solidária da Equipe Vermelha! Concorra a ${premio} por ${formatCurrency(valorCentavos)} e ajude famílias da nossa comunidade:`
      : 'Estou participando da Rifa Solidária da Equipe Vermelha! Participe também e ajude famílias da nossa comunidade:';

    if (navigator.share) {
      try {
        await navigator.share({ title: 'Rifa Solidária', text: texto, url });
        return;
      } catch (error) {
        if (error.name === 'AbortError') return;
      }
    }
    window.open(`https://wa.me/?text=${encodeURIComponent(`${texto} ${url}`)}`, '_blank');
  };

  return (
    <button type="button" onClick={compartilhar} className={className} {...props}>
      {children}
    </button>
  );
}
