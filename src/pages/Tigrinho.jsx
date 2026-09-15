import React, { useCallback, useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { ArrowLeft, Cat, Coins, RotateCcw, Sparkles, Trophy } from 'lucide-react';
import { Link } from 'react-router-dom';
import './Tigrinho.css';

const INITIAL_BALANCE = 500;
const BET_OPTIONS = [10, 25, 50];

const SYMBOLS = [
  { id: 'tigre', glyph: '🐯', label: 'Tigre', multiplier: 12 },
  { id: 'coroa', glyph: '👑', label: 'Coroa', multiplier: 8 },
  { id: 'laranja', glyph: '🍊', label: 'Laranja', multiplier: 5 },
  { id: 'fogo', glyph: '🔥', label: 'Fogo', multiplier: 4 },
  { id: 'estrela', glyph: '⭐', label: 'Estrela', multiplier: 3 },
];

const SYMBOL_BY_ID = Object.fromEntries(SYMBOLS.map((symbol) => [symbol.id, symbol]));
const SYMBOL_POOL = [
  'estrela', 'estrela', 'estrela', 'estrela',
  'fogo', 'fogo', 'fogo',
  'laranja', 'laranja', 'laranja',
  'coroa', 'coroa',
  'tigre',
];

const WIN_LINES = [
  { id: 'superior', label: 'Linha superior', cells: [[0, 0], [1, 0], [2, 0]] },
  { id: 'central', label: 'Linha central', cells: [[0, 1], [1, 1], [2, 1]] },
  { id: 'inferior', label: 'Linha inferior', cells: [[0, 2], [1, 2], [2, 2]] },
  { id: 'diagonal-descendo', label: 'Diagonal descendo', cells: [[0, 0], [1, 1], [2, 2]] },
  { id: 'diagonal-subindo', label: 'Diagonal subindo', cells: [[0, 2], [1, 1], [2, 0]] },
];

const INITIAL_REELS = [
  ['coroa', 'laranja', 'estrela'],
  ['fogo', 'tigre', 'coroa'],
  ['estrela', 'fogo', 'laranja'],
];

const randomItem = (items) => items[Math.floor(Math.random() * items.length)];

const createRandomReel = () => Array.from({ length: 3 }, () => randomItem(SYMBOL_POOL));

const createSpinResult = () => {
  const nextReels = Array.from({ length: 3 }, createRandomReel);

  // O easter egg favorece algumas vitórias para manter a brincadeira divertida.
  if (Math.random() < 0.3) {
    const luckyLine = randomItem(WIN_LINES);
    const luckySymbol = randomItem(SYMBOL_POOL);
    luckyLine.cells.forEach(([columnIndex, rowIndex]) => {
      nextReels[columnIndex][rowIndex] = luckySymbol;
    });
  }

  return nextReels;
};

const evaluateSpin = (reels, bet) => {
  const wins = WIN_LINES.flatMap((line) => {
    const symbolIds = line.cells.map(([columnIndex, rowIndex]) => reels[columnIndex][rowIndex]);
    const isMatch = symbolIds.every((symbolId) => symbolId === symbolIds[0]);

    if (!isMatch) return [];

    const symbol = SYMBOL_BY_ID[symbolIds[0]];
    return [{ ...line, symbol, prize: bet * symbol.multiplier }];
  });

  return {
    wins,
    prize: wins.reduce((total, win) => total + win.prize, 0),
  };
};

export default function Tigrinho() {
  const reduceMotion = useReducedMotion();
  const timersRef = useRef([]);
  const [reels, setReels] = useState(INITIAL_REELS);
  const [balance, setBalance] = useState(INITIAL_BALANCE);
  const [bet, setBet] = useState(10);
  const [lastPrize, setLastPrize] = useState(0);
  const [isSpinning, setIsSpinning] = useState(false);
  const [activeReels, setActiveReels] = useState([false, false, false]);
  const [winningCells, setWinningCells] = useState([]);
  const [winningLines, setWinningLines] = useState([]);
  const [message, setMessage] = useState('Escolha a quantidade de fichas e faça seu primeiro giro.');

  const clearTimers = useCallback(() => {
    timersRef.current.forEach((timerId) => {
      window.clearInterval(timerId);
      window.clearTimeout(timerId);
    });
    timersRef.current = [];
  }, []);

  useEffect(() => clearTimers, [clearTimers]);

  const finishSpin = (finalReels, spinBet) => {
    const result = evaluateSpin(finalReels, spinBet);
    const cellKeys = result.wins.flatMap((win) => (
      win.cells.map(([columnIndex, rowIndex]) => `${columnIndex}-${rowIndex}`)
    ));

    setReels(finalReels);
    setActiveReels([false, false, false]);
    setWinningCells([...new Set(cellKeys)]);
    setWinningLines(result.wins.map((win) => win.id));
    setLastPrize(result.prize);
    setBalance((currentBalance) => currentBalance + result.prize);
    setIsSpinning(false);

    if (result.prize === 0) {
      setMessage('Quase! As fichas são de brincadeira — tente outra combinação.');
      return;
    }

    const hasTigerWin = result.wins.some((win) => win.symbol.id === 'tigre');
    const lineText = result.wins.length === 1 ? 'uma linha' : `${result.wins.length} linhas`;
    setMessage(
      hasTigerWin
        ? `Rugido da sorte! Tigres em ${lineText}: +${result.prize} fichas virtuais.`
        : `Boa! Você completou ${lineText} e ganhou ${result.prize} fichas virtuais.`,
    );
  };

  const handleSpin = () => {
    if (isSpinning || balance < bet) return;

    clearTimers();
    const finalReels = createSpinResult();
    const spinBet = bet;

    setIsSpinning(true);
    setActiveReels([true, true, true]);
    setWinningCells([]);
    setWinningLines([]);
    setLastPrize(0);
    setMessage('Os rolos estão girando…');
    setBalance((currentBalance) => currentBalance - spinBet);

    if (reduceMotion) {
      finishSpin(finalReels, spinBet);
      return;
    }

    finalReels.forEach((finalReel, columnIndex) => {
      const intervalId = window.setInterval(() => {
        setReels((currentReels) => currentReels.map((reel, reelIndex) => (
          reelIndex === columnIndex ? createRandomReel() : reel
        )));
      }, 85 + (columnIndex * 10));

      const timeoutId = window.setTimeout(() => {
        window.clearInterval(intervalId);
        setReels((currentReels) => currentReels.map((reel, reelIndex) => (
          reelIndex === columnIndex ? finalReel : reel
        )));
        setActiveReels((currentReels) => currentReels.map((active, reelIndex) => (
          reelIndex === columnIndex ? false : active
        )));

        if (columnIndex === finalReels.length - 1) {
          finishSpin(finalReels, spinBet);
        }
      }, 650 + (columnIndex * 280));

      timersRef.current.push(intervalId, timeoutId);
    });
  };

  const handleReset = () => {
    if (isSpinning) return;

    setBalance(INITIAL_BALANCE);
    setBet(10);
    setLastPrize(0);
    setReels(INITIAL_REELS);
    setWinningCells([]);
    setWinningLines([]);
    setMessage('Fichas recarregadas. A selva está pronta para outra rodada!');
  };

  const canSpin = !isSpinning && balance >= bet;

  return (
    <div className="tiger-game-page min-h-screen overflow-hidden text-white selection:bg-amber-300 selection:text-red-950">
      <div className="tiger-ambient tiger-ambient--one" aria-hidden="true" />
      <div className="tiger-ambient tiger-ambient--two" aria-hidden="true" />

      <main className="relative z-10 mx-auto w-full max-w-6xl px-4 py-5 sm:px-6 sm:py-8">
        <header className="mb-5 flex flex-wrap items-center justify-between gap-3">
          <Link
            to="/"
            className="inline-flex min-h-11 items-center gap-2 rounded-full border border-white/15 bg-black/25 px-4 py-2 text-sm font-bold text-white/80 backdrop-blur transition hover:border-amber-300/60 hover:text-amber-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-300"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            Voltar ao site
          </Link>

          <div className="flex items-center gap-2 rounded-full border border-amber-300/30 bg-amber-300/10 px-4 py-2 text-sm font-bold text-amber-200">
            <Sparkles className="h-4 w-4" aria-hidden="true" />
            Easter egg secreto
          </div>
        </header>

        <div className="grid items-start gap-5 lg:grid-cols-[minmax(0,1fr)_18rem]">
          <section className="tiger-machine" aria-labelledby="game-title">
            <div className="tiger-machine__marquee">
              <div className="tiger-logo" aria-hidden="true">
                <Cat className="h-8 w-8 sm:h-10 sm:w-10" strokeWidth={2.4} />
              </div>
              <div className="min-w-0 text-center">
                <p className="text-xs font-black uppercase tracking-[0.28em] text-amber-200/80">Sala secreta</p>
                <h1 id="game-title" className="font-marker text-3xl leading-none text-amber-200 drop-shadow-[0_3px_0_#7f1d1d] sm:text-5xl">
                  Tigre da Gincana
                </h1>
              </div>
              <span className="tiger-demo-badge">Demo</span>
            </div>

            <div className="grid grid-cols-3 gap-2 px-3 pt-4 sm:gap-3 sm:px-6">
              <div className="tiger-stat-card">
                <Coins className="h-4 w-4 text-amber-300" aria-hidden="true" />
                <span>Fichas</span>
                <strong>{balance}</strong>
              </div>
              <div className="tiger-stat-card">
                <span className="text-amber-300" aria-hidden="true">◆</span>
                <span>Por giro</span>
                <strong>{bet}</strong>
              </div>
              <div className="tiger-stat-card">
                <Trophy className="h-4 w-4 text-amber-300" aria-hidden="true" />
                <span>Último</span>
                <strong>+{lastPrize}</strong>
              </div>
            </div>

            <div className="px-3 py-4 sm:px-6 sm:py-5">
              <div className="tiger-reel-board" role="group" aria-label="Três rolos com três símbolos cada">
                {reels.map((reel, columnIndex) => (
                  <motion.div
                    key={`reel-${columnIndex}`}
                    className={`tiger-reel ${activeReels[columnIndex] ? 'tiger-reel--spinning' : ''}`}
                    animate={!reduceMotion && activeReels[columnIndex] ? { y: [0, -7, 7, 0] } : { y: 0 }}
                    transition={{ duration: 0.18, repeat: activeReels[columnIndex] ? Infinity : 0 }}
                  >
                    {reel.map((symbolId, rowIndex) => {
                      const symbol = SYMBOL_BY_ID[symbolId];
                      const cellKey = `${columnIndex}-${rowIndex}`;
                      const isWinner = winningCells.includes(cellKey);

                      return (
                        <div
                          key={cellKey}
                          className={`tiger-symbol-cell ${isWinner ? 'tiger-symbol-cell--winning' : ''}`}
                          role="img"
                          aria-label={symbol.label}
                        >
                          <span aria-hidden="true">{symbol.glyph}</span>
                        </div>
                      );
                    })}
                  </motion.div>
                ))}
                <div className="tiger-payline tiger-payline--top" aria-hidden="true" />
                <div className="tiger-payline tiger-payline--middle" aria-hidden="true" />
                <div className="tiger-payline tiger-payline--bottom" aria-hidden="true" />
              </div>

              <div className="mt-4 flex items-center justify-center gap-2" aria-label="Cinco linhas possíveis">
                {WIN_LINES.map((line, index) => (
                  <span
                    key={line.id}
                    className={`tiger-line-indicator ${winningLines.includes(line.id) ? 'tiger-line-indicator--active' : ''}`}
                    aria-label={line.label}
                    title={line.label}
                  >
                    {index + 1}
                  </span>
                ))}
              </div>

              <div className="mt-5 rounded-2xl border border-white/10 bg-black/25 p-3 sm:p-4">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                  <fieldset disabled={isSpinning}>
                    <legend className="mb-2 text-sm font-bold text-amber-100">Fichas por giro</legend>
                    <div className="flex gap-2">
                      {BET_OPTIONS.map((option) => (
                        <button
                          key={option}
                          type="button"
                          aria-pressed={bet === option}
                          onClick={() => setBet(option)}
                          className={`tiger-bet-button ${bet === option ? 'tiger-bet-button--active' : ''}`}
                        >
                          {option}
                        </button>
                      ))}
                    </div>
                  </fieldset>

                  <div className="flex flex-col gap-2 sm:items-end">
                    <button
                      type="button"
                      onClick={handleSpin}
                      disabled={!canSpin}
                      className="tiger-spin-button min-h-14 min-w-48"
                    >
                      <Sparkles className="h-5 w-5" aria-hidden="true" />
                      {isSpinning ? 'Girando…' : balance < bet ? 'Fichas insuficientes' : `Girar por ${bet}`}
                    </button>
                    <button
                      type="button"
                      onClick={handleReset}
                      disabled={isSpinning}
                      className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full px-4 text-sm font-bold text-white/60 transition hover:text-amber-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-300 disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      <RotateCcw className="h-4 w-4" aria-hidden="true" />
                      Recarregar fichas
                    </button>
                  </div>
                </div>
              </div>

              <div className="mt-4 min-h-16 rounded-2xl border border-amber-300/20 bg-amber-300/5 px-4 py-3 text-center">
                <AnimatePresence mode="wait">
                  <motion.p
                    key={message}
                    initial={reduceMotion ? false : { opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: -6 }}
                    className="text-sm font-semibold leading-relaxed text-amber-50 sm:text-base"
                    role="status"
                    aria-live="polite"
                  >
                    {message}
                  </motion.p>
                </AnimatePresence>
              </div>
            </div>
          </section>

          <aside className="space-y-4">
            <section className="tiger-side-card">
              <div className="mb-4 flex items-center gap-2">
                <Trophy className="h-5 w-5 text-amber-300" aria-hidden="true" />
                <h2 className="text-lg font-black text-white">Combinações</h2>
              </div>
              <p className="mb-4 text-sm leading-relaxed text-white/65">
                Três símbolos iguais em qualquer uma das 5 linhas rendem fichas virtuais.
              </p>
              <ul className="space-y-2.5">
                {SYMBOLS.map((symbol) => (
                  <li key={symbol.id} className="flex items-center justify-between rounded-xl border border-white/8 bg-black/20 px-3 py-2">
                    <span className="flex items-center gap-2 text-sm font-semibold text-white/80">
                      <span className="text-2xl" aria-hidden="true">{symbol.glyph}</span>
                      {symbol.label}
                    </span>
                    <strong className="text-sm text-amber-300">×{symbol.multiplier}</strong>
                  </li>
                ))}
              </ul>
            </section>

            <section className="rounded-2xl border border-amber-300/25 bg-amber-300/10 p-4 text-sm leading-relaxed text-amber-50/80">
              <strong className="mb-1 block text-amber-200">Só uma brincadeira</strong>
              Esta é uma simulação recreativa. As fichas não têm valor, não existe depósito, saque ou prêmio real.
            </section>
          </aside>
        </div>
      </main>
    </div>
  );
}
