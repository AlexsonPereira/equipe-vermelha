import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  apenasDigitos,
  formatCpf,
  formatCurrency,
  formatPhone,
  linkWhatsappContato,
  telefoneValido,
} from './formatters.js';

const normalizarEspacos = (texto) => texto.replace(/\s/g, ' ');

test('apenasDigitos remove máscara', () => {
  assert.equal(apenasDigitos('(77) 99999-0000'), '77999990000');
  assert.equal(apenasDigitos(undefined), '');
});

test('formatPhone aplica máscara de celular e de fixo', () => {
  assert.equal(formatPhone('77999990000'), '(77) 99999-0000');
  assert.equal(formatPhone('7733334444'), '(77) 3333-4444');
  assert.equal(formatPhone('(7'), '(7');
  assert.equal(formatPhone(''), '');
});

test('formatPhone descarta o DDI 55 de um número colado do WhatsApp', () => {
  assert.equal(formatPhone('+55 (77) 99999-0000'), '(77) 99999-0000');
  assert.equal(formatPhone('5577999990000'), '(77) 99999-0000');
  assert.equal(formatPhone('(55) 99999-0000'), '(55) 99999-0000');
  assert.equal(telefoneValido('+55 77 99999-0000'), true);
});

test('formatCpf aplica máscara completa', () => {
  assert.equal(formatCpf('12345678909'), '123.456.789-09');
});

test('telefoneValido aceita 10 ou 11 dígitos', () => {
  assert.equal(telefoneValido('(77) 99999-0000'), true);
  assert.equal(telefoneValido('(77) 3333-4444'), true);
  assert.equal(telefoneValido('(77) 9999'), false);
  assert.equal(telefoneValido(''), false);
});

test('formatCurrency converte centavos e trata ausência', () => {
  assert.equal(normalizarEspacos(formatCurrency(1500)), 'R$ 15,00');
  assert.equal(normalizarEspacos(formatCurrency(0)), 'R$ 0,00');
  assert.equal(formatCurrency(null), '-');
});

test('linkWhatsappContato adiciona o DDI do Brasil quando falta', () => {
  assert.equal(linkWhatsappContato('(77) 99999-0000'), 'https://wa.me/5577999990000');
  assert.equal(linkWhatsappContato('5577999990000'), 'https://wa.me/5577999990000');
  assert.equal(linkWhatsappContato('(55) 99999-0000'), 'https://wa.me/5555999990000');
  assert.equal(linkWhatsappContato(''), 'https://wa.me/');
});
