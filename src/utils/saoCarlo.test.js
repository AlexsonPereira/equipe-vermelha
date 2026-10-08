import { test } from 'node:test';
import assert from 'node:assert/strict';
import { FRASES, MARCOS, sortearOutraFrase } from './saoCarlo.js';

test('FRASES e MARCOS têm conteúdo', () => {
  assert.ok(FRASES.length >= 6);
  assert.ok(FRASES.every((f) => typeof f === 'string' && f.length > 10));
  assert.ok(MARCOS.length >= 5);
  assert.ok(MARCOS.every((m) => m.ano && m.titulo && m.texto));
});

test('sortearOutraFrase nunca repete a frase atual', () => {
  for (let atual = 0; atual < FRASES.length; atual += 1) {
    for (const r of [0, 0.3, 0.6, 0.9999]) {
      const proxima = sortearOutraFrase(atual, FRASES.length, () => r);
      assert.notEqual(proxima, atual);
      assert.ok(proxima >= 0 && proxima < FRASES.length);
    }
  }
  assert.equal(sortearOutraFrase(null, FRASES.length, () => 0), 0);
  assert.equal(sortearOutraFrase(0, 1, () => 0.5), 0);
});
