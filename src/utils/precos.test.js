import { test } from 'node:test';
import assert from 'node:assert/strict';
import { calcularTotal, sugestaoPacote } from './precos.js';

const PACOTES = [{ quantidade: 5, valorCentavos: 2000 }, { quantidade: 10, valorCentavos: 3500 }];

test('calcularTotal usa os mesmos casos do backend', () => {
  const casos = [[0, 0], [1, 500], [3, 1500], [5, 2000], [7, 3000], [9, 4000], [10, 3500], [15, 5500], [20, 7000]];
  for (const [quantidade, esperado] of casos) {
    assert.equal(calcularTotal(quantidade, 500, PACOTES), esperado, `quantidade ${quantidade}`);
  }
  assert.equal(calcularTotal(7, 500, []), 3500);
});

test('sugestaoPacote aparece quando faltam até 3 números para um pacote', () => {
  assert.deepEqual(sugestaoPacote(9, 500, PACOTES), { faltam: 1, quantidade: 10, total: 3500 });
  assert.deepEqual(sugestaoPacote(7, 500, PACOTES), { faltam: 3, quantidade: 10, total: 3500 });
  assert.deepEqual(sugestaoPacote(3, 500, PACOTES), { faltam: 2, quantidade: 5, total: 2000 });
  assert.deepEqual(sugestaoPacote(2, 500, PACOTES), { faltam: 3, quantidade: 5, total: 2000 });
  assert.equal(sugestaoPacote(1, 500, PACOTES), null);
  assert.equal(sugestaoPacote(10, 500, PACOTES), null);
  assert.equal(sugestaoPacote(0, 500, PACOTES), null);
  assert.equal(sugestaoPacote(9, 500, []), null);
});
