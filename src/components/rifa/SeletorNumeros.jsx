import React, { useEffect, useMemo, useState } from 'react';
import { Search, Shuffle } from 'lucide-react';
import { criarFaixas, faixaDoNumero, faixaInicial, filtrarGrade, sortearLivres } from '../../utils/selecaoNumeros';

const ESCOLHA_RAPIDA = [1, 3, 5, 10];

const corDoNumero = (ticket, selecionado, destacado) => {
  if (selecionado) return 'bg-white text-black border-white';
  if (destacado) return 'bg-gold/30 text-white border-gold';
  switch (ticket.status) {
    case 'LIVRE': return 'bg-green-600 hover:bg-green-500 active:bg-green-700 text-white border-green-400';
    case 'RESERVADO': return 'bg-yellow-600/70 text-white/80 border-yellow-500/60 cursor-not-allowed';
    default: return 'bg-brand-red/70 text-white/80 border-red-500/60 cursor-not-allowed';
  }
};

const descricaoStatus = { LIVRE: 'livre', RESERVADO: 'reservado', PAGO: 'vendido' };

export default function SeletorNumeros({ tickets, selecionados, onAlternar, onAdicionar }) {
  const faixas = useMemo(
    () => criarFaixas(tickets.reduce((maior, t) => Math.max(maior, t.numero), 0)),
    [tickets]
  );
  const [faixa, setFaixa] = useState(() => faixaInicial(faixas, tickets));
  const [soLivres, setSoLivres] = useState(false);
  const [busca, setBusca] = useState('');
  const [destacado, setDestacado] = useState(null);
  const [aviso, setAviso] = useState('');

  const visiveis = filtrarGrade(tickets, faixas[faixa], soLivres);
  const livresPorFaixa = useMemo(
    () => faixas.map((f) => filtrarGrade(tickets, f, true).length),
    [faixas, tickets]
  );

  useEffect(() => {
    if (destacado === null) return undefined;
    document.getElementById(`numero-${destacado}`)?.scrollIntoView({ block: 'center', behavior: 'smooth' });
    const timer = setTimeout(() => setDestacado(null), 2500);
    return () => clearTimeout(timer);
  }, [destacado]);

  const escolherParaMim = (quantidade) => {
    const novos = sortearLivres(tickets, selecionados, quantidade);
    if (!novos.length) {
      setAviso('Não há mais números livres para sortear.');
      return;
    }
    onAdicionar(novos);
    setAviso(novos.length < quantidade ? `Só havia ${novos.length} ${novos.length === 1 ? 'número livre' : 'números livres'}.` : '');
  };

  const irParaNumero = (e) => {
    e.preventDefault();
    const numero = Number(busca);
    const ticket = tickets.find((t) => t.numero === numero);
    if (!ticket) {
      setAviso(`Escolha um número de 1 a ${faixas.at(-1)?.fim ?? 0}.`);
      return;
    }
    setFaixa(faixaDoNumero(faixas, numero));
    if (ticket.status === 'LIVRE') {
      setAviso('');
      if (!selecionados.includes(numero)) onAlternar(numero);
    } else {
      setSoLivres(false);
      setAviso(`O ${numero} já está ${descricaoStatus[ticket.status]}.`);
    }
    setDestacado(numero);
    setBusca('');
  };

  return (
    <section className="flex flex-col gap-3">
      <h2 className="text-lg font-bold text-white">Escolha seus números</h2>

      <div className="bg-black/40 border border-white/10 rounded-2xl p-3 flex flex-col gap-3">
        <p className="text-sm text-gray-300 flex items-center gap-2">
          <Shuffle className="w-4 h-4 text-gold" aria-hidden="true" /> Escolher para mim
        </p>
        <div className="grid grid-cols-4 gap-2">
          {ESCOLHA_RAPIDA.map((quantidade) => (
            <button
              key={quantidade}
              onClick={() => escolherParaMim(quantidade)}
              className="min-h-11 rounded-xl bg-gold/15 border border-gold/40 text-gold font-bold active:bg-gold/30"
            >
              +{quantidade}
            </button>
          ))}
        </div>

        <form onSubmit={irParaNumero} className="flex gap-2">
          <label className="sr-only" htmlFor="ir-para-numero">Ir para o número</label>
          <input
            id="ir-para-numero"
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            value={busca}
            onChange={(e) => setBusca(e.target.value.replace(/\D/g, '').slice(0, 3))}
            placeholder="Ir para o nº"
            className="flex-1 min-w-0 min-h-11 bg-black/50 border border-white/10 rounded-xl px-4 text-base text-white focus:border-gold outline-none"
          />
          <button type="submit" disabled={!busca} aria-label="Buscar número" className="min-h-11 px-4 rounded-xl bg-white/10 text-white disabled:opacity-50">
            <Search className="w-5 h-5" />
          </button>
        </form>

        <label className="flex items-center justify-between gap-3 min-h-11 cursor-pointer">
          <span className="text-sm text-gray-300">Mostrar só números livres</span>
          <input
            type="checkbox"
            checked={soLivres}
            onChange={(e) => setSoLivres(e.target.checked)}
            className="peer sr-only"
          />
          <span className="relative w-12 h-7 rounded-full bg-white/20 peer-checked:bg-green-600 transition-colors after:absolute after:top-1 after:left-1 after:w-5 after:h-5 after:rounded-full after:bg-white after:transition-transform peer-checked:after:translate-x-5" aria-hidden="true" />
        </label>

        {aviso && <p className="text-sm text-yellow-300" role="status">{aviso}</p>}
      </div>

      <div className="flex gap-2 overflow-x-auto -mx-4 px-4 pb-1" role="tablist" aria-label="Faixas de números">
        {faixas.map((f, indice) => (
          <button
            key={f.label}
            role="tab"
            aria-selected={faixa === indice}
            onClick={() => setFaixa(indice)}
            className={`min-h-11 px-4 rounded-full text-sm font-bold whitespace-nowrap flex flex-col items-center justify-center leading-tight transition-colors ${faixa === indice ? 'bg-gold text-surface-dark' : 'bg-white/5 text-gray-300'}`}
          >
            {f.label}
            <span className={`text-[10px] font-normal ${faixa === indice ? 'text-surface-dark/70' : 'text-gray-500'}`}>
              {livresPorFaixa[indice]} livres
            </span>
          </button>
        ))}
      </div>

      <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-400">
        <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-green-600" /> Livre</span>
        <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-white" /> Selecionado</span>
        <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-yellow-600/70" /> Reservado</span>
        <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-brand-red/70" /> Vendido</span>
      </div>

      {visiveis.length === 0 ? (
        <p className="py-8 text-center text-gray-400 bg-black/30 rounded-2xl">Nenhum número livre nesta faixa. Tente outra.</p>
      ) : (
        <div className="grid grid-cols-6 sm:grid-cols-8 md:grid-cols-10 gap-2">
          {visiveis.map((ticket) => {
            const selecionado = selecionados.includes(ticket.numero);
            return (
              <button
                key={ticket.numero}
                id={`numero-${ticket.numero}`}
                onClick={() => ticket.status === 'LIVRE' && onAlternar(ticket.numero)}
                disabled={ticket.status !== 'LIVRE'}
                aria-pressed={selecionado}
                aria-label={`Número ${ticket.numero}, ${selecionado ? 'selecionado' : descricaoStatus[ticket.status]}`}
                className={`aspect-square min-h-11 rounded-lg border-2 font-bold text-sm transition-colors ${corDoNumero(ticket, selecionado, destacado === ticket.numero)}`}
              >
                {ticket.numero}
              </button>
            );
          })}
        </div>
      )}
    </section>
  );
}
