import { test } from 'node:test';
import assert from 'node:assert/strict';
import { contarVendas, criarFaixas, faixaDoNumero, faixaInicial, filtrarGrade, sortearLivres } from './selecaoNumeros.js';

const grade = (status) => status.map((s, i) => ({ numero: i + 1, status: s }));

test('criarFaixas divide em blocos de 50 e ajusta o último', () => {
  assert.deepEqual(criarFaixas(120).map((f) => f.label), ['1–50', '51–100', '101–120']);
  assert.deepEqual(criarFaixas(0), []);
});

test('faixaDoNumero e faixaInicial apontam a faixa certa', () => {
  const faixas = criarFaixas(150);
  assert.equal(faixaDoNumero(faixas, 51), 1);
  assert.equal(faixaDoNumero(faixas, 999), -1);
  const tickets = Array.from({ length: 150 }, (_, i) => ({ numero: i + 1, status: i < 60 ? 'PAGO' : 'LIVRE' }));
  assert.equal(faixaInicial(faixas, tickets), 1);
  assert.equal(faixaInicial(faixas, tickets.map((t) => ({ ...t, status: 'PAGO' }))), 0);
});

test('filtrarGrade aplica faixa e só livres', () => {
  const tickets = grade(['LIVRE', 'PAGO', 'LIVRE', 'RESERVADO']);
  const faixa = { inicio: 2, fim: 4 };
  assert.deepEqual(filtrarGrade(tickets, faixa, false).map((t) => t.numero), [2, 3, 4]);
  assert.deepEqual(filtrarGrade(tickets, faixa, true).map((t) => t.numero), [3]);
  assert.deepEqual(filtrarGrade(tickets, null, true).map((t) => t.numero), [1, 3]);
});

test('sortearLivres não repete, ignora selecionados e para quando acabam os livres', () => {
  const tickets = grade(['LIVRE', 'PAGO', 'LIVRE', 'LIVRE', 'RESERVADO']);
  assert.deepEqual(sortearLivres(tickets, [3], 5, () => 0), [1, 4]);
  assert.deepEqual(sortearLivres(tickets, [], 2, () => 0.99), [4, 3]);
  assert.deepEqual(sortearLivres(tickets, [1, 3, 4], 1), []);
});

test('contarVendas soma vendidos, reservados e livres', () => {
  const tickets = grade(['PAGO', 'PAGO', 'RESERVADO', 'LIVRE', 'LIVRE']);
  assert.deepEqual(contarVendas(tickets), { total: 5, vendidos: 2, reservados: 1, livres: 2 });
  assert.deepEqual(contarVendas([]), { total: 0, vendidos: 0, reservados: 0, livres: 0 });
});
