import { test } from 'node:test';
import assert from 'node:assert/strict';
import { montarPedidoPDF } from './pdfGenerator.js';

const pedido = {
  codigo: 'A18A77',
  usuarioNome: 'Laís Fernandes',
  usuarioTelefone: '77991657882',
  tickets: [
    {
      numero: 6,
      comprador_nome: 'Laís Fernandes',
      comprador_telefone: '77991657882',
      comprovante_codigo: 'fe6e672b-b4d5-4301-95be-86035fa095a4',
      valor_pago_centavos: 500,
      pago_em: '2026-09-21T21:55:00Z',
    },
    {
      numero: 50,
      comprador_nome: 'Laís Fernandes',
      comprador_telefone: '77991657882',
      comprovante_codigo: '9299226f-0ec0-42dd-8258-bb8c5e14d773',
      valor_pago_centavos: 500,
      pago_em: '2026-09-21T21:59:00Z',
    },
  ],
};

const conteudo = (doc) => doc.output();

test('montarPedidoPDF gera uma página por número do pedido', () => {
  const doc = montarPedidoPDF(pedido, 'https://site.com');
  assert.equal(doc.getNumberOfPages(), 2);
});

test('montarPedidoPDF segue o padrão da tela de comprovante', () => {
  const texto = conteudo(montarPedidoPDF(pedido, 'https://site.com'));

  for (const esperado of [
    'COMPROVANTE DE COMPRA',
    'Válido e Confirmado',
    'CÓDIGO DE AUTENTICIDADE',
    'fe6e672b-b4d5-4301-95be-86035fa095a4',
    '9299226f-0ec0-42dd-8258-bb8c5e14d773',
    '#6',
    '#50',
    'MAC - Equipe Vermelha',
    'Air Fryer',
    'Verificação Digital',
    'Pedido #A18A77',
  ]) {
    assert.ok(texto.includes(esperado), `faltou "${esperado}" no PDF`);
  }
});

test('montarPedidoPDF não expõe o telefone do comprador', () => {
  const texto = conteudo(montarPedidoPDF(pedido, 'https://site.com'));
  assert.equal(texto.includes('99165-7882'), false);
  assert.equal(texto.includes('77991657882'), false);
});

test('montarPedidoPDF quebra nomes longos sem lançar erro', () => {
  const nomeLongo = 'Maria Aparecida dos Santos Albuquerque de Oliveira Nascimento';
  const doc = montarPedidoPDF(
    { ...pedido, tickets: [{ ...pedido.tickets[0], comprador_nome: nomeLongo }] },
    'https://site.com',
  );
  assert.equal(doc.getNumberOfPages(), 1);
});
