import { test } from 'node:test';
import assert from 'node:assert/strict';
import { formatarPrazo, tempoRestante } from './contagem.js';

test('tempoRestante calcula dias, horas e minutos', () => {
  const agora = new Date('2026-10-07T12:00:00Z');
  assert.deepEqual(tempoRestante('2026-10-09T15:30:00Z', agora), { dias: 2, horas: 3, minutos: 30, encerrado: false });
  assert.deepEqual(tempoRestante('2026-10-07T11:00:00Z', agora), { dias: 0, horas: 0, minutos: 0, encerrado: true });
  assert.equal(tempoRestante(null, agora), null);
  assert.equal(tempoRestante('nada', agora), null);
});

test('formatarPrazo mostra dia da semana, data e hora', () => {
  assert.match(formatarPrazo('2026-10-08T23:15:00Z'), /^[a-zà-ú]{3}, \d{2}\/\d{2} às \d{2}:\d{2}$/);
});
