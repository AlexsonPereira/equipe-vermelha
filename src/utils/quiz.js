// Regras do Desafio Relâmpago. `pontuarRespostas` espelha backend-rifa/src/services/quizRegras.ts
// (mesmos casos de teste); o servidor recalcula a pontuação oficial no fim da partida.

export const DURACAO_PADRAO_MS = 60000;
export const PENALIDADE_PADRAO_MS = 5000;

export const pontosDoAcerto = (combo) => 100 + Math.min(20 * (combo - 1), 100);

export const pontuarRespostas = (acertos) => {
  let combo = 0;
  let total = 0;
  for (const acertou of acertos) {
    if (!acertou) {
      combo = 0;
      continue;
    }
    combo += 1;
    total += pontosDoAcerto(combo);
  }
  return total;
};

// Calculado pela diferença de horário: continua certo mesmo se o celular pausar a aba.
export const tempoRestanteMs = (inicioMs, erros, agoraMs, duracaoMs = DURACAO_PADRAO_MS, penalidadeMs = PENALIDADE_PADRAO_MS) =>
  Math.max(0, duracaoMs - (agoraMs - inicioMs) - penalidadeMs * erros);

export const SELOS = [
  { minimo: 0, nome: 'Peregrino', emoji: '🕊️', cor: '#9ca3af' },
  { minimo: 300, nome: 'Aprendiz de Carlo', emoji: '📖', cor: '#60a5fa' },
  { minimo: 800, nome: 'Amigo de Carlo', emoji: '💻', cor: '#34d399' },
  { minimo: 1500, nome: 'Missionário Digital', emoji: '🌐', cor: '#f59e0b' },
  { minimo: 2500, nome: 'Santo de Calça Jeans', emoji: '✨', cor: '#D4AF37' },
];

export const seloPorPontos = (pontos) => [...SELOS].reverse().find((selo) => pontos >= selo.minimo) ?? SELOS[0];

export const proximoSelo = (pontos) => {
  const selo = SELOS.find((s) => s.minimo > pontos);
  return selo ? { selo, faltam: selo.minimo - pontos } : null;
};

export const textoCompartilhamento = (apelido, pontos, selo) =>
  `${selo.emoji} ${apelido} fez ${pontos} pontos no Desafio Relâmpago de São Carlo Acutis e conquistou o selo "${selo.nome}"! Consegue me superar?`;
