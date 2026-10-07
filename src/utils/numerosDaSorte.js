export const TOTAL_NUMEROS_PADRAO = 300;
export const LIMITE_NUMEROS_DA_SORTE = 10;

export const sortearNumeroDaSorte = (total = TOTAL_NUMEROS_PADRAO, aleatorio = Math.random) =>
  Math.floor(aleatorio() * total) + 1;

export const adicionarNumeroDaSorte = (lista, valor, total = TOTAL_NUMEROS_PADRAO, limite = LIMITE_NUMEROS_DA_SORTE) => {
  const numero = valor === '' ? NaN : Number(valor);
  if (!Number.isInteger(numero) || numero < 1 || numero > total) return { lista, erro: `Escolha um número de 1 a ${total}.` };
  if (lista.includes(numero)) return { lista, erro: `O ${numero} já está na sua lista.` };
  if (lista.length >= limite) return { lista, erro: `Você pode guardar até ${limite} números.` };
  return { lista: [...lista, numero], erro: '' };
};

export const separarPorDisponibilidade = (numeros, tickets) => {
  const livres = new Set(tickets.filter((t) => t.status === 'LIVRE').map((t) => t.numero));
  return { livres: numeros.filter((n) => livres.has(n)), ocupados: numeros.filter((n) => !livres.has(n)) };
};
