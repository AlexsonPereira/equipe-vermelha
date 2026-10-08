import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  SELOS,
  pontosDoAcerto,
  pontuarRespostas,
  proximoSelo,
  seloPorPontos,
  tempoRestanteMs,
  textoCompartilhamento,
} from './quiz.js';

test('pontuarRespostas usa os mesmos casos do backend', () => {
  assert.equal(pontuarRespostas([]), 0);
  assert.equal(pontuarRespostas([false, false]), 0);
  assert.equal(pontuarRespostas([true, true, true]), 360);
  assert.equal(pontuarRespostas([true, false, true]), 200);
  assert.equal(pontuarRespostas(Array(7).fill(true)), 1100);
});

test('pontosDoAcerto cresce 20 por combo até 200', () => {
  assert.equal(pontosDoAcerto(1), 100);
  assert.equal(pontosDoAcerto(3), 140);
  assert.equal(pontosDoAcerto(6), 200);
  assert.equal(pontosDoAcerto(20), 200);
});

test('tempoRestanteMs desconta o tempo passado e 5s por erro, sem ficar negativo', () => {
  assert.equal(tempoRestanteMs(1000, 0, 1000), 60000);
  assert.equal(tempoRestanteMs(1000, 0, 11000), 50000);
  assert.equal(tempoRestanteMs(1000, 2, 11000), 40000);
  assert.equal(tempoRestanteMs(1000, 20, 11000), 0);
  assert.equal(tempoRestanteMs(0, 0, 999999), 0);
});

test('seloPorPontos segue as faixas', () => {
  assert.equal(seloPorPontos(0).nome, 'Peregrino');
  assert.equal(seloPorPontos(299).nome, 'Peregrino');
  assert.equal(seloPorPontos(300).nome, 'Aprendiz de Carlo');
  assert.equal(seloPorPontos(1499).nome, 'Amigo de Carlo');
  assert.equal(seloPorPontos(2500).nome, 'Santo de Calça Jeans');
  assert.equal(SELOS.length, 5);
});

test('proximoSelo diz quanto falta e some no último', () => {
  assert.deepEqual(proximoSelo(250), { selo: SELOS[1], faltam: 50 });
  assert.deepEqual(proximoSelo(800), { selo: SELOS[3], faltam: 700 });
  assert.equal(proximoSelo(3000), null);
});

test('textoCompartilhamento cita apelido, pontos e selo', () => {
  const texto = textoCompartilhamento('Maria', 860, seloPorPontos(860));
  assert.match(texto, /860 pontos/);
  assert.match(texto, /Amigo de Carlo/);
  assert.match(texto, /Maria/);
});
