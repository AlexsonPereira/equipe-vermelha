// Itens da cesta que a Equipe Vermelha arrecada; `unidade` = [singular, plural].
export const ALIMENTOS = [
  { id: 'arroz', nome: 'arroz', rotulo: 'Arroz', emoji: '🍚', unidade: ['kg', 'kg'] },
  { id: 'feijao', nome: 'feijão', rotulo: 'Feijão', emoji: '🫘', unidade: ['kg', 'kg'] },
  { id: 'macarrao', nome: 'macarrão', rotulo: 'Macarrão', emoji: '🍝', unidade: ['pacote', 'pacotes'] },
  { id: 'farinha', nome: 'farinha', rotulo: 'Farinha', emoji: '🌾', unidade: ['kg', 'kg'] },
  { id: 'oleo', nome: 'óleo', rotulo: 'Óleo', emoji: '🫗', unidade: ['garrafa', 'garrafas'] },
  { id: 'acucar', nome: 'açúcar', rotulo: 'Açúcar', emoji: '🍬', unidade: ['kg', 'kg'] },
  { id: 'sal', nome: 'sal', rotulo: 'Sal', emoji: '🧂', unidade: ['kg', 'kg'] },
  { id: 'cafe', nome: 'café', rotulo: 'Café', emoji: '☕', unidade: ['pacote', 'pacotes'] },
];

const MAXIMO = 99;
const porId = Object.fromEntries(ALIMENTOS.map((a) => [a.id, a]));

export const alterarQuantidade = (cesta, id, delta) => {
  if (!porId[id]) return cesta;
  const quantidade = Math.min(MAXIMO, Math.max(0, (cesta[id] ?? 0) + delta));
  const { [id]: _removido, ...resto } = cesta;
  return quantidade > 0 ? { ...resto, [id]: quantidade } : resto;
};

export const totalItens = (cesta) => Object.values(cesta).reduce((total, q) => total + q, 0);

const juntar = (partes) =>
  partes.length <= 1 ? partes.join('') : `${partes.slice(0, -1).join(', ')} e ${partes.at(-1)}`;

export const mensagemCesta = (cesta) => {
  const itens = ALIMENTOS.filter((a) => cesta[a.id] > 0).map((a) => {
    const quantidade = cesta[a.id];
    return `${quantidade} ${a.unidade[quantidade === 1 ? 0 : 1]} de ${a.nome}`;
  });
  const lista = itens.length ? `: ${juntar(itens)}` : '';
  return `Olá! Quero doar alimentos para a Equipe Vermelha${lista}. Como posso entregar?`;
};

export const linkCesta = (cesta, numero) =>
  `https://wa.me/${numero}?text=${encodeURIComponent(mensagemCesta(cesta))}`;
