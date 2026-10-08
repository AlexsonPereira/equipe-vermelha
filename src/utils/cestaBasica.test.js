import { test } from 'node:test';
import assert from 'node:assert/strict';
import { ALIMENTOS, alterarQuantidade, linkCesta, mensagemCesta, totalItens } from './cestaBasica.js';

test('ALIMENTOS só tem alimentos, com id único', () => {
  const ids = ALIMENTOS.map((a) => a.id);
  assert.equal(new Set(ids).size, ids.length);
  assert.ok(ids.includes('arroz') && ids.includes('feijao'));
});

test('alterarQuantidade soma, subtrai e fica entre 0 e 99', () => {
  let cesta = alterarQuantidade({}, 'arroz', 1);
  cesta = alterarQuantidade(cesta, 'arroz', 1);
  assert.deepEqual(cesta, { arroz: 2 });
  assert.deepEqual(alterarQuantidade(cesta, 'arroz', -5), {});
  assert.deepEqual(alterarQuantidade({ cafe: 99 }, 'cafe', 1), { cafe: 99 });
  assert.deepEqual(alterarQuantidade({}, 'inexistente', 1), {});
});

test('totalItens soma as quantidades', () => {
  assert.equal(totalItens({}), 0);
  assert.equal(totalItens({ arroz: 2, oleo: 3 }), 5);
});

test('mensagemCesta lista os alimentos com unidade no singular e no plural', () => {
  assert.equal(
    mensagemCesta({ arroz: 2, macarrao: 1, oleo: 3 }),
    'Olá! Quero doar alimentos para a Equipe Vermelha: 2 kg de arroz, 1 pacote de macarrão e 3 garrafas de óleo. Como posso entregar?',
  );
  assert.equal(
    mensagemCesta({ feijao: 1 }),
    'Olá! Quero doar alimentos para a Equipe Vermelha: 1 kg de feijão. Como posso entregar?',
  );
  assert.equal(mensagemCesta({}), 'Olá! Quero doar alimentos para a Equipe Vermelha. Como posso entregar?');
});

test('linkCesta monta o wa.me com a mensagem', () => {
  const url = new URL(linkCesta({ arroz: 1 }, '5577998233676'));
  assert.equal(url.origin + url.pathname, 'https://wa.me/5577998233676');
  assert.equal(url.searchParams.get('text'), mensagemCesta({ arroz: 1 }));
});
