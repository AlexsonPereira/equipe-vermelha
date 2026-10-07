import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, Copy, MessageCircle, Search } from 'lucide-react';
import { formatCurrency } from '../utils/formatters';

export default function InstrucoesPagamento({ pedido, onAcompanhar }) {
  const [copiado, setCopiado] = useState(false);

  const copiarPix = async () => {
    try {
      await navigator.clipboard.writeText(pedido.pix.copiaECola);
      setCopiado(true);
      setTimeout(() => setCopiado(false), 3000);
    } catch {
      setCopiado(false);
    }
  };

  return (
    <div className="flex flex-col items-center text-center">
      <motion.h2
        initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
        className="text-2xl font-bold text-white mb-1"
      >
        Números reservados!
      </motion.h2>
      <p className="text-sm text-gray-400 mb-5">
        Pedido <strong className="text-gold">#{pedido.codigo}</strong> · números{' '}
        <strong className="text-white">{pedido.numeros.join(', ')}</strong>
      </p>

      <div className="w-full bg-green-500/10 border border-green-500/40 rounded-xl p-4 mb-5">
        <p className="text-xs text-green-400 uppercase tracking-wider font-bold mb-1">Pague exatamente</p>
        <p className="text-3xl font-bold text-white">{formatCurrency(pedido.valorTotalCentavos)}</p>
      </div>

      <div className="bg-white p-3 rounded-xl w-44 h-44 mx-auto mb-4 shadow-lg">
        <img src="/qrcode.PNG" alt="QR Code PIX da Equipe Vermelha" className="w-full h-full object-contain" />
      </div>

      <div className="w-full mb-2">
        <span className="text-[10px] text-gold uppercase tracking-wider font-medium mb-1.5 block text-left">PIX copia e cola</span>
        <button
          onClick={copiarPix}
          className={`w-full border py-3 px-4 rounded-xl flex items-center justify-between transition-all duration-300 ${copiado
            ? 'bg-green-500/10 border-green-500/50'
            : 'bg-black/50 border-gold/30 hover:bg-gold/10 hover:border-gold'
            }`}
        >
          <span className="truncate mr-4 text-xs text-gray-300 font-mono">{pedido.pix.copiaECola.substring(0, 24)}...</span>
          <span className={`flex items-center gap-1.5 text-xs font-medium flex-shrink-0 ${copiado ? 'text-green-500' : 'text-gold'}`}>
            {copiado ? <><CheckCircle className="w-4 h-4" /> Copiado</> : <><Copy className="w-4 h-4" /> Copiar</>}
          </span>
        </button>
      </div>
      <p className="text-xs text-gray-400 mb-6">
        Chave PIX: <span className="text-white font-mono break-all">{pedido.pix.chave}</span>
      </p>

      <a
        href={pedido.linkWhatsapp}
        target="_blank"
        rel="noopener noreferrer"
        className="w-full bg-green-600 hover:bg-green-500 text-white font-bold rounded-xl py-4 flex items-center justify-center gap-2 shadow-lg transition-colors mb-4"
      >
        <MessageCircle className="w-5 h-5" /> Enviar comprovante no WhatsApp
      </a>

      <p className="text-xs text-gray-400 mb-4">
        Seus números ficam reservados até a equipe confirmar o pagamento. Você receberá o comprovante pelo WhatsApp.
      </p>

      {onAcompanhar && (
        <button onClick={onAcompanhar} className="text-gold hover:text-white text-sm font-bold flex items-center gap-2 transition-colors">
          <Search className="w-4 h-4" /> Acompanhar em Meus Bilhetes
        </button>
      )}
    </div>
  );
}
