export const criarFaixas = (totalNumeros, tamanho = 50) =>
  Array.from({ length: Math.ceil(totalNumeros / tamanho) }, (_, indice) => {
    const inicio = indice * tamanho + 1;
    const fim = Math.min((indice + 1) * tamanho, totalNumeros);
    return { inicio, fim, label: `${inicio}–${fim}` };
  });

export const faixaDoNumero = (faixas, numero) => faixas.findIndex((f) => numero >= f.inicio && numero <= f.fim);

// Abre na primeira faixa que ainda tem número livre.
export const faixaInicial = (faixas, tickets) => {
  const livres = tickets.filter((t) => t.status === 'LIVRE').map((t) => t.numero);
  if (!livres.length) return 0;
  return Math.max(0, faixaDoNumero(faixas, Math.min(...livres)));
};

export const filtrarGrade = (tickets, faixa, soLivres) =>
  tickets.filter((t) =>
    (!faixa || (t.numero >= faixa.inicio && t.numero <= faixa.fim)) && (!soLivres || t.status === 'LIVRE'));

export const sortearLivres = (tickets, selecionados, n, aleatorio = Math.random) => {
  const jaEscolhidos = new Set(selecionados);
  const disponiveis = tickets.filter((t) => t.status === 'LIVRE' && !jaEscolhidos.has(t.numero)).map((t) => t.numero);
  const sorteados = [];
  while (sorteados.length < n && disponiveis.length > 0) {
    const [numero] = disponiveis.splice(Math.floor(aleatorio() * disponiveis.length), 1);
    sorteados.push(numero);
  }
  return sorteados;
};

// Os três grupos somam o total: evita "X vendidos · restam Y" que não fecha quando há reservas.
export const contarVendas = (tickets) => ({
  total: tickets.length,
  vendidos: tickets.filter((t) => t.status === 'PAGO').length,
  reservados: tickets.filter((t) => t.status === 'RESERVADO').length,
  livres: tickets.filter((t) => t.status === 'LIVRE').length,
});
