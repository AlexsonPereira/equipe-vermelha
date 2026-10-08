import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Check, Clock, Copy, HeartHandshake, MapPin, MessageCircle, Minus, Plus, ShieldCheck } from 'lucide-react';
import { ALIMENTOS, alterarQuantidade, linkCesta, totalItens } from '../../utils/cestaBasica';

const WHATSAPP_DOACOES = '5577998233676';
const PIX_COPIA_E_COLA = '00020126360014br.gov.bcb.pix0114+55779982336765204000053039865802BR5901N6001C62180514Equipevermelha6304C736';
const MAPA = 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3867.4365001332685!2d-42.781689!3d-14.2277404!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x75ac59cee209b33%3A0x412da737d2058d2d!2sSecret%C3%A1ria%20Paroquial%20de%20Sto%C2%B0%20Ant%C3%B4nio!5e0!3m2!1spt-BR!2sbr!4v1789148941232!5m2!1spt-BR!2sbr';

function MonteSuaCesta() {
  const [cesta, setCesta] = useState({});
  const total = totalItens(cesta);

  return (
    <div className="bg-gradient-to-br from-[#4a0505] via-[#290303] to-black border border-gold/35 rounded-[2rem] p-5 sm:p-8 shadow-[0_25px_70px_rgba(0,0,0,0.5)] relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-brand-red via-gold to-brand-red" />
      <div className="flex items-start justify-between gap-4 mb-6">
        <div>
          <p className="text-gold font-bold tracking-widest uppercase text-xs mb-1">Interativo</p>
          <h3 className="text-2xl md:text-4xl font-bold text-white">Monte sua cesta</h3>
          <p className="text-gray-300 mt-1">Escolha o que vai doar e combine a entrega pelo WhatsApp. Arroz e feijão são os mais pedidos!</p>
        </div>
        <motion.div
          key={total}
          initial={{ scale: 0.7, rotate: -10 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: 'spring', stiffness: 400, damping: 12 }}
          className="relative w-16 h-16 flex-shrink-0 rounded-2xl bg-gold/15 border border-gold/40 flex items-center justify-center text-3xl"
          aria-label={`${total} itens na cesta`}
        >
          🧺
          {total > 0 && (
            <span className="absolute -top-2 -right-2 min-w-7 h-7 px-1.5 rounded-full bg-brand-red text-white text-sm font-bold flex items-center justify-center">
              {total}
            </span>
          )}
        </motion.div>
      </div>

      <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
        {ALIMENTOS.map((alimento) => {
          const quantidade = cesta[alimento.id] ?? 0;
          return (
            <li
              key={alimento.id}
              className={`flex items-center gap-3 rounded-2xl border p-3 transition-colors ${quantidade ? 'bg-gold/10 border-gold/50' : 'bg-white/5 border-white/10'}`}
            >
              <span className="text-3xl w-10 text-center" aria-hidden="true">{alimento.emoji}</span>
              <span className="flex-1 min-w-0">
                <span className="block font-bold text-white">{alimento.rotulo}</span>
                <span className="block text-xs text-gray-400">
                  {quantidade ? `${quantidade} ${alimento.unidade[quantidade === 1 ? 0 : 1]}` : alimento.unidade[0]}
                </span>
              </span>
              <span className="flex items-center gap-1">
                <button
                  onClick={() => setCesta((atual) => alterarQuantidade(atual, alimento.id, -1))}
                  disabled={!quantidade}
                  aria-label={`Tirar ${alimento.nome}`}
                  className="w-11 h-11 rounded-xl bg-white/10 text-white flex items-center justify-center disabled:opacity-30"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <motion.span key={quantidade} initial={{ y: -6, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="w-7 text-center font-bold text-white tabular-nums">
                  {quantidade}
                </motion.span>
                <button
                  onClick={() => setCesta((atual) => alterarQuantidade(atual, alimento.id, 1))}
                  aria-label={`Adicionar ${alimento.nome}`}
                  className="w-11 h-11 rounded-xl bg-gold text-surface-dark flex items-center justify-center"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </span>
            </li>
          );
        })}
      </ul>

      <a
        href={linkCesta(cesta, WHATSAPP_DOACOES)}
        target="_blank"
        rel="noopener noreferrer"
        className="w-full min-h-14 rounded-2xl bg-green-600 hover:bg-green-500 text-white font-bold text-lg flex items-center justify-center gap-3 shadow-[0_10px_30px_rgba(22,163,74,0.3)]"
      >
        <MessageCircle className="w-6 h-6" />
        {total ? `Combinar entrega de ${total} ${total === 1 ? 'item' : 'itens'}` : 'Combinar doação no WhatsApp'}
      </a>
    </div>
  );
}

function DoacaoPix() {
  const [copiado, setCopiado] = useState(false);

  const copiar = async () => {
    try {
      await navigator.clipboard.writeText(PIX_COPIA_E_COLA);
      setCopiado(true);
      setTimeout(() => setCopiado(false), 3000);
    } catch {
      setCopiado(false);
    }
  };

  return (
    <div className="bg-white/[0.035] border border-white/10 rounded-3xl p-5 sm:p-8 grid gap-6 md:grid-cols-[minmax(0,1fr)_auto] items-center">
      <div className="min-w-0">
        <p className="text-gold font-bold tracking-widest uppercase text-xs mb-1">Prefere doar em dinheiro?</p>
        <h3 className="text-2xl font-bold text-white mb-2">Doe pelo PIX e a gente compra os alimentos</h3>
        <p className="text-gray-400 mb-4">Não existe valor mínimo: cada real vira comida na mesa de uma família.</p>
        <button
          onClick={copiar}
          className="w-full min-w-0 bg-white/5 hover:bg-white/10 border border-gold/40 rounded-2xl p-4 text-left flex items-center justify-between gap-3"
        >
          <span className="min-w-0">
            <span className="block text-xs text-gold uppercase tracking-wider font-bold mb-1">PIX copia e cola</span>
            <span className="block truncate text-gray-200 font-mono text-sm">{PIX_COPIA_E_COLA}</span>
          </span>
          <span className="shrink-0 bg-gold text-surface-dark w-11 h-11 rounded-xl flex items-center justify-center">
            {copiado ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
          </span>
        </button>
        <AnimatePresence>
          {copiado && (
            <motion.p initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="text-green-400 font-bold mt-2 flex items-center gap-2">
              <Check className="w-4 h-4" /> Código PIX copiado!
            </motion.p>
          )}
        </AnimatePresence>
      </div>
      <div className="w-full max-w-[14rem] mx-auto bg-white p-3 rounded-2xl">
        <img src="/qrcode.PNG" alt="QR Code para doação via PIX" loading="lazy" className="w-full aspect-square object-contain" />
      </div>
    </div>
  );
}

export default function DoacaoAlimentos() {
  return (
    <section id="doacoes" className="py-20 md:py-28 px-4 sm:px-6 bg-surface-dark relative overflow-hidden scroll-mt-4">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[500px] bg-brand-red/10 rounded-full blur-3xl pointer-events-none" />
      <div className="max-w-5xl mx-auto relative z-10 flex flex-col gap-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="text-center max-w-3xl mx-auto"
        >
          <span className="inline-flex items-center gap-2 bg-brand-red/15 border border-brand-red/40 text-red-300 font-bold uppercase tracking-[0.2em] text-xs px-5 py-2.5 rounded-full mb-6">
            <HeartHandshake className="w-4 h-4" /> Sua ajuda é urgente
          </span>
          <h2 className="font-marker text-5xl md:text-7xl text-brand-red mb-5">Doe alimentos</h2>
          <p className="text-gray-200 text-lg md:text-2xl leading-relaxed">
            Cada quilo vira <strong className="text-white">comida na mesa de uma família</strong> da nossa comunidade.
            O que parece pouco para você, somado ao de outras pessoas, faz uma diferença enorme.
          </p>
        </motion.div>

        <MonteSuaCesta />

        <div className="flex flex-col sm:flex-row gap-4 bg-gold/10 border border-gold/25 rounded-3xl p-5 sm:p-7">
          <ShieldCheck className="text-gold w-10 h-10 shrink-0" />
          <div>
            <h3 className="text-xl font-bold text-white mb-1">Antes de entregar</h3>
            <p className="text-gray-300">
              Os alimentos devem estar <strong>lacrados e dentro do prazo de validade</strong>. Produtos vencidos, abertos ou danificados não podem ser aceitos.
            </p>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="grid overflow-hidden rounded-3xl border border-white/10 bg-white/[0.035] lg:grid-cols-[minmax(0,1.6fr)_minmax(300px,0.7fr)]"
        >
          <iframe
            src={MAPA}
            loading="lazy"
            referrerPolicy="strict-origin-when-cross-origin"
            title="Mapa da Secretaria Paroquial de Santo Antônio"
            className="block h-[300px] w-full md:h-[420px] lg:h-full lg:min-h-[420px] border-0"
          />
          <div className="flex flex-col justify-center p-6 md:p-8">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-gold/10 text-gold">
              <MapPin className="h-6 w-6" />
            </div>
            <p className="mb-1 text-sm font-bold uppercase tracking-[0.2em] text-gold">Local de entrega</p>
            <h3 className="mb-5 text-2xl font-bold leading-tight text-white">Secretaria Paroquial de Santo Antônio</h3>
            <div className="rounded-2xl border border-gold/25 bg-gold/10 p-4">
              <p className="mb-2 flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-gold">
                <Clock className="h-4 w-4" /> Horário
              </p>
              <p className="font-bold text-white">Segunda a sexta-feira, das 8h às 17h</p>
            </div>
          </div>
        </motion.div>

        <DoacaoPix />
      </div>
    </section>
  );
}
