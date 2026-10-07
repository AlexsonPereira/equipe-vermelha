export const tempoRestante = (dataISO, agora = new Date()) => {
  if (!dataISO) return null;
  const alvo = new Date(dataISO).getTime();
  if (Number.isNaN(alvo)) return null;
  const diferenca = alvo - agora.getTime();
  if (diferenca <= 0) return { dias: 0, horas: 0, minutos: 0, encerrado: true };
  const minutos = Math.floor(diferenca / 60000);
  return { dias: Math.floor(minutos / 1440), horas: Math.floor((minutos % 1440) / 60), minutos: minutos % 60, encerrado: false };
};

// Ex.: "qua, 08/10 às 20:15"
export const formatarPrazo = (dataISO) => {
  const data = new Date(dataISO);
  const dia = data.toLocaleDateString('pt-BR', { weekday: 'short' }).replace('.', '');
  const ddmm = data.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
  const hora = data.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
  return `${dia}, ${ddmm} às ${hora}`;
};
