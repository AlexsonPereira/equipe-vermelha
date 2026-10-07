import React from 'react';
import { Link } from 'react-router-dom';
import { Check, ExternalLink, MapPin, MessageCircle, Send } from 'lucide-react';
import { badgeDoPedido, tempoDesde } from '../../utils/adminPedidos';
import { formatCurrency, formatDateTime, formatPhone, linkWhatsappContato } from '../../utils/formatters';

export default function CartaoPedido({ pedido, onConfirmar, onCancelar, onReenviar }) {
  const badge = badgeDoPedido(pedido);
  const telefone = formatPhone(pedido.usuarioTelefone);
  const pendente = pedido.status === 'pendente';
  const pago = pedido.status === 'pago';

  return (
    <article className={`bg-black/40 border border-white/5 rounded-2xl p-4 flex flex-col gap-3 ${!pendente && !pago ? 'opacity-60' : ''}`}>
      <header className="flex items-start justify-between gap-3">
        <div>
          <p className="text-lg font-bold text-white leading-tight">#{pedido.codigo}</p>
          <p className="text-xs text-gray-500">{tempoDesde(pedido.criadoEm)}</p>
        </div>
        <span className={`px-3 py-1 rounded-full text-xs font-bold border whitespace-nowrap ${badge.classe}`}>{badge.label}</span>
      </header>

      <div className="flex flex-col gap-1">
        <p className="font-bold text-white">{pedido.usuarioNome}</p>
        {telefone ? (
          <a
            href={linkWhatsappContato(pedido.usuarioTelefone)}
            target="_blank"
            rel="noopener noreferrer"
            className="self-start min-h-10 -my-1 flex items-center gap-2 text-sm text-green-400"
          >
            <MessageCircle className="w-4 h-4" /> {telefone}
          </a>
        ) : (
          <p className="text-sm text-gray-500">Sem telefone</p>
        )}
        {pedido.endereco && (
          <p className="text-sm text-gray-400 flex items-start gap-2">
            <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" /> <span className="break-words">{pedido.endereco}</span>
          </p>
        )}
        {pedido.usuarioEmail && <p className="text-sm text-gray-400 break-all">{pedido.usuarioEmail}</p>}
      </div>

      <div className="flex items-end justify-between gap-3">
        <div className="flex flex-wrap gap-1.5">
          {pedido.tickets.length === 0 ? (
            <span className="text-xs text-gray-500 italic">Números liberados</span>
          ) : pago ? (
            pedido.tickets.map((t) => (
              <Link
                key={t.numero}
                to={`/comprovante/${t.comprovante_codigo}`}
                target="_blank"
                className="min-h-9 px-3 rounded-lg bg-blue-600/20 border border-blue-600/30 text-blue-300 text-sm font-bold flex items-center gap-1"
              >
                {t.numero} <ExternalLink className="w-3 h-3" />
              </Link>
            ))
          ) : (
            pedido.tickets.map((t) => (
              <span key={t.numero} className="min-h-9 px-3 rounded-lg bg-white/10 text-white text-sm font-bold flex items-center">
                {t.numero}
              </span>
            ))
          )}
        </div>
        <p className="text-lg font-bold text-green-400 whitespace-nowrap">{formatCurrency(pedido.valorTotalCentavos)}</p>
      </div>

      {pendente && (
        <p className={`text-xs ${pedido.vencido ? 'text-orange-400' : 'text-gray-500'}`}>
          {pedido.vencido ? 'Venceu' : 'Vence'} em {formatDateTime(pedido.expiraEm)}
        </p>
      )}

      {pendente && (
        <div className="flex flex-col gap-2 pt-1">
          <button
            onClick={() => onConfirmar(pedido)}
            className="w-full min-h-12 bg-green-600 hover:bg-green-500 active:bg-green-700 text-white font-bold rounded-xl flex items-center justify-center gap-2 transition-colors"
          >
            <Check className="w-5 h-5" /> Confirmar pagamento
          </button>
          <button
            onClick={() => onCancelar(pedido)}
            className="w-full min-h-11 text-red-400 hover:bg-red-500/10 rounded-xl text-sm font-bold transition-colors"
          >
            Cancelar pedido
          </button>
        </div>
      )}

      {pago && (
        <button
          onClick={() => onReenviar(pedido)}
          className="w-full min-h-12 border border-green-500/40 text-green-400 hover:bg-green-500/10 font-bold rounded-xl flex items-center justify-center gap-2 transition-colors"
        >
          <Send className="w-4 h-4" /> Reenviar comprovante
        </button>
      )}
    </article>
  );
}
