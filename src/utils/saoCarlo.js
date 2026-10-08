// Frases atribuídas a São Carlo Acutis, citadas com frequência pela Igreja e por biografias.
export const FRASES = [
  'A Eucaristia é a minha autoestrada para o Céu.',
  'Todos nascem originais, mas muitos morrem como fotocópias.',
  'A tristeza é olhar para si mesmo; a felicidade é olhar para Deus.',
  'Não eu, mas Deus.',
  'Estar sempre unido a Jesus: esse é o meu projeto de vida.',
  'A conversão é simplesmente levantar o olhar de baixo para o alto.',
  'Quanto mais recebermos a Eucaristia, mais nos tornaremos semelhantes a Jesus.',
  'Encontrar Deus é o objetivo; o caminho é a Eucaristia e o amor ao próximo.',
];

export const MARCOS = [
  { ano: '1991', titulo: 'Nasce em Londres', texto: 'Carlo nasce em 3 de maio, filho de pais italianos. Pouco depois, a família se muda para Milão.' },
  { ano: '1998', titulo: 'Primeira Comunhão', texto: 'Aos 7 anos recebe Jesus pela primeira vez e passa a participar da missa todos os dias.' },
  { ano: '2002', titulo: 'Milagres eucarísticos', texto: 'Aos 11 anos começa a catalogar os milagres eucarísticos do mundo, projeto que vira site e exposição.' },
  { ano: '2006', titulo: 'Parte para o Céu', texto: 'Aos 15 anos, morre de leucemia em Monza, oferecendo seu sofrimento pelo Papa e pela Igreja.' },
  { ano: '2020', titulo: 'Beatificação', texto: 'É declarado beato em Assis, em 10 de outubro, após um milagre reconhecido no Brasil.' },
  { ano: '2025', titulo: 'Santo!', texto: 'Canonizado em 7 de setembro, em Roma: o primeiro santo millennial da Igreja.' },
];

// Sorteia outra frase, nunca a atual (quando há mais de uma).
export const sortearOutraFrase = (atual, total, aleatorio = Math.random) => {
  if (total <= 1) return 0;
  if (atual === null || atual === undefined) return Math.floor(aleatorio() * total);
  const indice = Math.floor(aleatorio() * (total - 1));
  return indice >= atual ? indice + 1 : indice;
};
