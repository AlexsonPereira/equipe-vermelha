import { apenasDigitos } from './formatters.js';

export const FILTROS = [
  { id: 'pendentes', label: 'Pendentes', aceita: (p) => p.status === 'pendente' },
  { id: 'vencidos', label: 'Vencidos', aceita: (p) => p.status === 'pendente' && p.vencido },
  { id: 'pagos', label: 'Pagos', aceita: (p) => p.status === 'pago' },
  { id: 'cancelados', label: 'Cancelados', aceita: (p) => p.status === 'cancelado' || p.status === 'expirado' },
  { id: 'todos', label: 'Todos', aceita: () => true },
];

const BADGES = {
  pendente: { label: 'Aguardando PIX', classe: 'bg-yellow-500/15 text-yellow-400 border-yellow-500/30' },
  vencido: { label: 'Vencido', classe: 'bg-orange-500/15 text-orange-400 border-orange-500/30' },
  pago: { label: 'Pago', classe: 'bg-green-500/15 text-green-400 border-green-500/30' },
  cancelado: { label: 'Cancelado', classe: 'bg-white/5 text-gray-400 border-white/10' },
  expirado: { label: 'Expirado', classe: 'bg-white/5 text-gray-400 border-white/10' },
};

export const badgeDoPedido = (pedido) =>
  BADGES[pedido.status === 'pendente' && pedido.vencido ? 'vencido' : pedido.status] ?? BADGES.cancelado;

export const correspondeBusca = (pedido, termo) => {
  const texto = termo.trim().toLowerCase();
  if (!texto) return true;
  const digitos = apenasDigitos(texto);
  return (
    pedido.usuarioNome.toLowerCase().includes(texto) ||
    pedido.codigo.toLowerCase().includes(texto.replace('#', '')) ||
    (digitos.length >= 4 && pedido.usuarioTelefone.includes(digitos)) ||
    (digitos.length > 0 && pedido.tickets.some((t) => String(t.numero) === digitos))
  );
};

// `tickets` vem da grade pública (GET /api/rifa) e pode faltar se ela não carregar.
export const resumoRifa = (pedidos, tickets) => {
  const grade = tickets ?? [];
  const contar = (status) => grade.filter((t) => t.status === status).length;
  const somar = (lista) => lista.reduce((total, p) => total + p.valorTotalCentavos, 0);
  const pendentes = pedidos.filter((p) => p.status === 'pendente');

  return {
    total: grade.length,
    pagos: contar('PAGO'),
    reservados: contar('RESERVADO'),
    livres: contar('LIVRE'),
    arrecadado: somar(pedidos.filter((p) => p.status === 'pago')),
    aReceber: somar(pendentes),
    pendentes: pendentes.length,
    vencidos: pendentes.filter((p) => p.vencido).length,
  };
};

export const mensagemComprovante = (pedido, origem) => {
  const numeros = pedido.tickets.map((t) => t.numero).join(', ');
  const links = pedido.tickets
    .map((t) => `#${t.numero}: ${origem}/comprovante/${t.comprovante_codigo}`)
    .join('\n');
  return `Olá ${pedido.usuarioNome}! Seu pagamento do pedido #${pedido.codigo} foi confirmado. Números: ${numeros}.\nComprovantes:\n${links}`;
};

export const tempoDesde = (data, agora = new Date()) => {
  const minutos = Math.floor((agora.getTime() - new Date(data).getTime()) / 60000);
  if (minutos < 1) return 'agora';
  if (minutos < 60) return `há ${minutos} min`;
  const horas = Math.floor(minutos / 60);
  if (horas < 24) return `há ${horas} h`;
  const dias = Math.floor(horas / 24);
  return `há ${dias} ${dias === 1 ? 'dia' : 'dias'}`;
};
