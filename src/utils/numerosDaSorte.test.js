import { test } from 'node:test';
import assert from 'node:assert/strict';
import { adicionarNumeroDaSorte, separarPorDisponibilidade, sortearNumeroDaSorte } from './numerosDaSorte.js';

test('sortearNumeroDaSorte fica entre 1 e o total', () => {
  assert.equal(sortearNumeroDaSorte(300, () => 0), 1);
  assert.equal(sortearNumeroDaSorte(300, () => 0.9999), 300);
});

test('adicionarNumeroDaSorte valida faixa, repetição e limite', () => {
  assert.deepEqual(adicionarNumeroDaSorte([], '12'), { lista: [12], erro: '' });
  assert.equal(adicionarNumeroDaSorte([], '0').erro, 'Escolha um número de 1 a 300.');
  assert.equal(adicionarNumeroDaSorte([], '301').erro, 'Escolha um número de 1 a 300.');
  assert.equal(adicionarNumeroDaSorte([], '').erro, 'Escolha um número de 1 a 300.');
  assert.equal(adicionarNumeroDaSorte([12], 12).erro, 'O 12 já está na sua lista.');
  const cheia = Array.from({ length: 10 }, (_, i) => i + 1);
  assert.equal(adicionarNumeroDaSorte(cheia, 50).erro, 'Você pode guardar até 10 números.');
  assert.deepEqual(adicionarNumeroDaSorte(cheia, 50).lista, cheia);
});

test('separarPorDisponibilidade divide livres e ocupados', () => {
  const tickets = [{ numero: 1, status: 'LIVRE' }, { numero: 2, status: 'PAGO' }, { numero: 3, status: 'RESERVADO' }];
  assert.deepEqual(separarPorDisponibilidade([1, 2, 3, 99], tickets), { livres: [1], ocupados: [2, 3, 99] });
});
