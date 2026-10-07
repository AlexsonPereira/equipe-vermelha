import React, { useEffect, useState } from 'react';
import { Gift } from 'lucide-react';
import { formatCurrency } from '../../utils/formatters';
import { tempoRestante } from '../../utils/contagem';

const formatarDataSorteio = (data) =>
  new Date(data).toLocaleString('pt-BR', {
    weekday: 'long', day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit',
  });

function Contagem({ data }) {
  const [agora, setAgora] = useState(() => new Date());

  useEffect(() => {
    const timer = setInterval(() => setAgora(new Date()), 30000);
    return () => clearInterval(timer);
  }, []);

  const restante = tempoRestante(data, agora);
  if (!restante) return null;
  if (restante.encerrado) return <p className="text-sm font-bold text-white">O sorteio já começou! 🎉</p>;

  const blocos = [
    [restante.dias, restante.dias === 1 ? 'dia' : 'dias'],
    [restante.horas, 'horas'],
    [restante.minutos, 'min'],
  ];

  return (
    <div className="flex gap-2" aria-label={`Faltam ${restante.dias} dias, ${restante.horas} horas e ${restante.minutos} minutos`}>
      {blocos.map(([valor, rotulo]) => (
        <div key={rotulo} className="flex-1 bg-black/40 rounded-xl py-2 text-center">
          <p className="text-2xl font-bold text-white tabular-nums">{String(valor).padStart(2, '0')}</p>
          <p className="text-[10px] uppercase tracking-wider text-gray-400">{rotulo}</p>
        </div>
      ))}
    </div>
  );
}

export default function DestaquePremio({ rifa }) {
  const [fotoFalhou, setFotoFalhou] = useState(false);
  const { premio, valorCentavos, pacotes, sorteio } = rifa;

  return (
    <section className="bg-black/40 border border-white/10 rounded-3xl overflow-hidden shadow-2xl">
      <div className="aspect-[4/3] sm:aspect-[16/9] bg-gradient-to-br from-brand-red/40 via-black to-black flex items-center justify-center">
        {fotoFalhou ? (
          <Gift className="w-24 h-24 text-gold" aria-hidden="true" />
        ) : (
          <img src="/premio.jpg" alt={premio} onError={() => setFotoFalhou(true)} className="w-full h-full object-cover" />
        )}
      </div>

      <div className="p-5 flex flex-col gap-4">
        <div>
          <p className="text-xs uppercase tracking-widest text-gold font-bold">Prêmio</p>
          <h2 className="text-3xl font-bold text-white leading-tight">{premio}</h2>
          <p className="text-gray-300 mt-1">
            <strong className="text-green-400 text-xl">{formatCurrency(valorCentavos)}</strong> por número
          </p>
        </div>

        {pacotes.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {pacotes.map((pacote) => {
              const economia = pacote.quantidade * valorCentavos - pacote.valorCentavos;
              return (
                <span key={pacote.quantidade} className="bg-gold/15 border border-gold/40 text-gold rounded-full px-3 py-1.5 text-sm font-bold">
                  {pacote.quantidade} por {formatCurrency(pacote.valorCentavos)}
                  {economia > 0 && <span className="font-normal opacity-80"> · economize {formatCurrency(economia)}</span>}
                </span>
              );
            })}
          </div>
        )}

        <div className="bg-brand-red/10 border border-brand-red/30 rounded-2xl p-4 flex flex-col gap-3">
          <p className="flex items-center gap-2 font-bold text-white">
            <span className="relative flex h-3 w-3" aria-hidden="true">
              <span className="motion-safe:animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75" />
              <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500" />
            </span>
            Sorteio ao vivo
          </p>
          {sorteio.data ? (
            <>
              <p className="text-sm text-gray-300 first-letter:uppercase">
                {formatarDataSorteio(sorteio.data)}{sorteio.local && ` · ${sorteio.local}`}
              </p>
              <Contagem data={sorteio.data} />
            </>
          ) : (
            <p className="text-sm text-gray-300">Data em breve{sorteio.local && ` · ${sorteio.local}`}</p>
          )}
        </div>
      </div>
    </section>
  );
}
