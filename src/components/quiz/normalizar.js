// Mesma ideia de normalizarApelido do backend: "João" e "joao" são o mesmo jogador.
export const normalizarParaComparar = (texto = '') =>
  String(texto).trim().replace(/\s+/g, ' ').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
