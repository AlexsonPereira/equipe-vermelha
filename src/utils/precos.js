// Espelho de backend-rifa/src/services/precos.ts: os casos de teste são os mesmos nos dois projetos.
export const calcularTotal = (quantidade, valorUnitario, pacotes) => {
  if (quantidade <= 0) return 0;
  const custo = [0];
  for (let q = 1; q <= quantidade; q += 1) {
    custo[q] = custo[q - 1] + valorUnitario;
    for (const pacote of pacotes) {
      if (pacote.quantidade <= q) custo[q] = Math.min(custo[q], custo[q - pacote.quantidade] + pacote.valorCentavos);
    }
  }
  return custo[quantidade];
};

// Sugere completar um pacote quando faltam até 3 números para ele.
export const sugestaoPacote = (quantidade, valorUnitario, pacotes) => {
  if (quantidade <= 0) return null;
  const alvo = pacotes
    .filter((p) => p.quantidade > quantidade && p.quantidade <= quantidade + 3)
    .sort((a, b) => a.quantidade - b.quantidade)[0];
  if (!alvo) return null;
  return { faltam: alvo.quantidade - quantidade, quantidade: alvo.quantidade, total: calcularTotal(alvo.quantidade, valorUnitario, pacotes) };
};
