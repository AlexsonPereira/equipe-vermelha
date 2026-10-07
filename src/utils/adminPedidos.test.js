import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  FILTROS,
  badgeDoPedido,
  correspondeBusca,
  mensagemComprovante,
  resumoRifa,
  tempoDesde,
} from './adminPedidos.js';

const pedido = (dados) => ({
  id: 'id-1',
  codigo: 'AB12CD',
  status: 'pendente',
  vencido: false,
  usuarioNome: 'Maria Silva',
  usuarioTelefone: '77999990000',
  valorTotalCentavos: 1500,
  tickets: [{ numero: 12, comprovante_codigo: null }, { numero: 45, comprovante_codigo: null }],
  ...dados,
});

test('FILTROS separam pendentes, pagos, cancelados (inclui expirados) e todos', () => {
  const porId = Object.fromEntries(FILTROS.map((f) => [f.id, f.aceita]));
  assert.equal(porId.pendentes(pedido({ status: 'pendente' })), true);
  assert.equal(porId.pendentes(pedido({ status: 'pago' })), false);
  assert.equal(porId.pagos(pedido({ status: 'pago' })), true);
  assert.equal(porId.cancelados(pedido({ status: 'expirado' })), true);
  assert.equal(porId.vencidos(pedido({ status: 'pendente', vencido: true })), true);
  assert.equal(porId.vencidos(pedido({ status: 'pendente', vencido: false })), false);
  assert.equal(porId.todos(pedido({ status: 'cancelado' })), true);
});

test('badgeDoPedido destaca pendente vencido', () => {
  assert.equal(badgeDoPedido(pedido({ status: 'pendente', vencido: true })).label, 'Vencido');
  assert.equal(badgeDoPedido(pedido({ status: 'pendente' })).label, 'Aguardando PIX');
  assert.equal(badgeDoPedido(pedido({ status: 'pago' })).label, 'Pago');
  assert.equal(badgeDoPedido(pedido({ status: 'desconhecido' })).label, 'Cancelado');
});

test('correspondeBusca encontra por nome, código, telefone e número', () => {
  const p = pedido();
  assert.equal(correspondeBusca(p, ''), true);
  assert.equal(correspondeBusca(p, 'maria'), true);
  assert.equal(correspondeBusca(p, '#ab12'), true);
  assert.equal(correspondeBusca(p, '(77) 99999'), true);
  assert.equal(correspondeBusca(p, '45'), true);
  assert.equal(correspondeBusca(p, '46'), false);
  assert.equal(correspondeBusca(p, 'joão'), false);
});

test('resumoRifa combina a grade pública com os pedidos', () => {
  const tickets = [
    { numero: 1, status: 'PAGO' }, { numero: 2, status: 'PAGO' },
    { numero: 3, status: 'RESERVADO' }, { numero: 4, status: 'LIVRE' },
  ];
  const pedidos = [
    pedido({ id: 'a', status: 'pago', valorTotalCentavos: 1000 }),
    pedido({ id: 'b', status: 'pendente', valorTotalCentavos: 500 }),
    pedido({ id: 'c', status: 'pendente', vencido: true, valorTotalCentavos: 500 }),
    pedido({ id: 'd', status: 'cancelado', valorTotalCentavos: 9999 }),
  ];

  assert.deepEqual(resumoRifa(pedidos, tickets), {
    total: 4,
    pagos: 2,
    reservados: 1,
    livres: 1,
    arrecadado: 1000,
    aReceber: 1000,
    pendentes: 2,
    vencidos: 1,
  });
});

test('resumoRifa funciona sem a grade pública', () => {
  const resumo = resumoRifa([], null);
  assert.equal(resumo.total, 0);
  assert.equal(resumo.livres, 0);
});

test('mensagemComprovante lista números e links públicos', () => {
  const p = pedido({
    status: 'pago',
    tickets: [{ numero: 12, comprovante_codigo: 'u1' }, { numero: 45, comprovante_codigo: 'u2' }],
  });
  assert.equal(
    mensagemComprovante(p, 'https://site.com'),
    'Olá Maria Silva! Seu pagamento do pedido #AB12CD foi confirmado. Números: 12, 45.\n'
      + 'Comprovantes:\n#12: https://site.com/comprovante/u1\n#45: https://site.com/comprovante/u2',
  );
});

test('tempoDesde descreve há quanto tempo o pedido foi feito', () => {
  const agora = new Date('2026-10-07T12:00:00Z');
  assert.equal(tempoDesde('2026-10-07T11:59:30Z', agora), 'agora');
  assert.equal(tempoDesde('2026-10-07T11:45:00Z', agora), 'há 15 min');
  assert.equal(tempoDesde('2026-10-07T10:00:00Z', agora), 'há 2 h');
  assert.equal(tempoDesde('2026-10-05T12:00:00Z', agora), 'há 2 dias');
  assert.equal(tempoDesde('2026-10-06T11:00:00Z', agora), 'há 1 dia');
});
