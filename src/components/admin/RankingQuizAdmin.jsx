import React, { useState } from 'react';
import { ChevronDown, ChevronUp, EyeOff, Trophy } from 'lucide-react';
import { fetchRankingQuiz, ocultarApelidoQuiz } from '../../services/api';
import FolhaAcao from './FolhaAcao';

// Moderação do Desafio Relâmpago: ocultar um apelido tira do ranking e impede o reuso.
export default function RankingQuizAdmin({ token, onSessaoExpirada, onAviso }) {
  const [aberta, setAberta] = useState(false);
  const [ranking, setRanking] = useState(null);
  const [alvo, setAlvo] = useState(null);
  const [processando, setProcessando] = useState(false);
  const [erro, setErro] = useState('');

  const carregar = async () => {
    try {
      setRanking(await fetchRankingQuiz());
    } catch {
      setRanking([]);
    }
  };

  const alternar = () => {
    if (!aberta && ranking === null) carregar();
    setAberta(!aberta);
  };

  const ocultar = async () => {
    setProcessando(true);
    setErro('');
    try {
      await ocultarApelidoQuiz(alvo.apelido, token);
      onAviso(`"${alvo.apelido}" saiu do ranking.`);
      setAlvo(null);
      await carregar();
    } catch (error) {
      if (error.status === 401 || error.status === 403) {
        setAlvo(null);
        onSessaoExpirada();
      } else {
        setErro(error.message || 'Não foi possível ocultar.');
      }
    } finally {
      setProcessando(false);
    }
  };

  return (
    <section className="bg-black/40 border border-white/5 rounded-2xl">
      <button onClick={alternar} aria-expanded={aberta} className="w-full min-h-14 px-4 flex items-center justify-between gap-3 text-left">
        <span>
          <span className="flex items-center gap-2 font-bold text-white"><Trophy className="w-4 h-4 text-gold" /> Ranking do quiz</span>
          <span className="block text-xs text-gray-400">Oculte apelidos ofensivos do Desafio Relâmpago.</span>
        </span>
        {aberta ? <ChevronUp className="w-5 h-5 text-gray-400" /> : <ChevronDown className="w-5 h-5 text-gray-400" />}
      </button>

      {aberta && (
        <div className="border-t border-white/5">
          {ranking === null ? (
            <p className="p-4 text-sm text-gray-400">Carregando…</p>
          ) : ranking.length === 0 ? (
            <p className="p-4 text-sm text-gray-400">Ninguém no ranking ainda.</p>
          ) : (
            <ul className="divide-y divide-white/5">
              {ranking.map((linha) => (
                <li key={linha.posicao} className="px-4 py-3 flex items-center gap-3">
                  <span className="w-8 text-gray-400 font-bold">{linha.posicao}º</span>
                  <span className="flex-1 min-w-0 font-bold text-white truncate">{linha.apelido}</span>
                  <span className="text-gold font-bold tabular-nums">{linha.pontos}</span>
                  <button
                    onClick={() => setAlvo(linha)}
                    aria-label={`Ocultar ${linha.apelido}`}
                    className="min-h-11 px-3 rounded-xl border border-red-500/30 text-red-400 text-sm font-bold flex items-center gap-1"
                  >
                    <EyeOff className="w-4 h-4" /> Ocultar
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      <FolhaAcao aberta={Boolean(alvo)} titulo="Ocultar apelido" onFechar={() => !processando && setAlvo(null)}>
        <p className="text-gray-300 mb-4">
          <strong className="text-white">{alvo?.apelido}</strong> sai do ranking e esse apelido não poderá mais ser usado no desafio.
        </p>
        {erro && <p className="text-sm text-red-300 mb-3" role="alert">{erro}</p>}
        <button
          onClick={ocultar}
          disabled={processando}
          className="w-full min-h-12 bg-red-600 hover:bg-red-500 text-white font-bold rounded-xl disabled:opacity-60"
        >
          {processando ? 'Ocultando...' : 'Ocultar do ranking'}
        </button>
      </FolhaAcao>
    </section>
  );
}
