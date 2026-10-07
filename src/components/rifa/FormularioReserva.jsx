import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronDown, ChevronUp, Ticket } from 'lucide-react';
import { criarPedido } from '../../services/api';
import { calcularTotal } from '../../utils/precos';
import { formatCpf, formatCurrency, formatPhone, telefoneValido } from '../../utils/formatters';

const CHAVE_DADOS = 'dadosComprador';
const DADOS_VAZIOS = { nome: '', telefone: '', endereco: '', email: '', cpf: '' };

// Dados da última compra, só neste navegador; qualquer valor estranho vira campo vazio.
const lerDadosSalvos = () => {
  try {
    const salvo = JSON.parse(localStorage.getItem(CHAVE_DADOS) || 'null');
    if (!salvo || typeof salvo !== 'object') return DADOS_VAZIOS;
    return Object.fromEntries(
      Object.keys(DADOS_VAZIOS).map((campo) => [campo, typeof salvo[campo] === 'string' ? salvo[campo] : ''])
    );
  } catch {
    return DADOS_VAZIOS;
  }
};

const classeCampo = 'w-full min-h-12 bg-black/50 border border-white/10 rounded-xl px-4 text-base text-white focus:border-gold outline-none';

function Campo({ rotulo, ...props }) {
  return (
    <label className="block">
      <span className="text-xs text-gold uppercase tracking-wider mb-1 block">{rotulo}</span>
      <input {...props} className={classeCampo} />
    </label>
  );
}

export default function FormularioReserva({ numeros, valorUnitario, pacotes, onReservado, onConflito }) {
  const [dados, setDados] = useState(lerDadosSalvos);
  const [lembrado, setLembrado] = useState(() => Boolean(dados.nome));
  const [mostrarOpcionais, setMostrarOpcionais] = useState(() => Boolean(dados.email || dados.cpf));
  const [enviando, setEnviando] = useState(false);
  const [erro, setErro] = useState('');

  const total = calcularTotal(numeros.length, valorUnitario, pacotes);
  const precoCheio = numeros.length * valorUnitario;

  const alterar = (e) => {
    const { name, value } = e.target;
    const formatado = name === 'telefone' ? formatPhone(value) : name === 'cpf' ? formatCpf(value) : value;
    setDados((atual) => ({ ...atual, [name]: formatado }));
  };

  const limparDados = () => {
    try {
      localStorage.removeItem(CHAVE_DADOS);
    } catch {
      // Sem armazenamento local: basta limpar o formulário.
    }
    setDados(DADOS_VAZIOS);
    setLembrado(false);
  };

  const enviar = async (e) => {
    e.preventDefault();
    if (!telefoneValido(dados.telefone)) {
      setErro('Informe um telefone com DDD.');
      return;
    }
    if (dados.endereco.trim().length < 5) {
      setErro('Informe o endereço completo.');
      return;
    }

    setEnviando(true);
    setErro('');
    try {
      const comprador = Object.fromEntries(Object.entries(dados).filter(([, valor]) => valor.trim() !== ''));
      const resultado = await criarPedido({ numeros, comprador });
      try {
        localStorage.setItem(CHAVE_DADOS, JSON.stringify(dados));
      } catch {
        // Sem armazenamento local a próxima compra só não vem preenchida.
      }
      onReservado(resultado, dados.telefone);
    } catch (error) {
      if (error.status === 409) {
        setErro(error.message);
        onConflito();
      } else if (error.status === 400) {
        setErro('Confira os dados informados e tente novamente.');
      } else {
        setErro('Não foi possível reservar. Tente novamente.');
      }
    } finally {
      setEnviando(false);
    }
  };

  return (
    <>
      <h2 className="text-2xl font-bold text-white mb-1">Finalizar compra</h2>
      <p className="text-sm text-gray-400 mb-4">
        {numeros.length} {numeros.length === 1 ? 'número' : 'números'}:{' '}
        <strong className="text-gold">{[...numeros].sort((a, b) => a - b).join(', ')}</strong>
      </p>

      <div className="bg-black/30 p-4 rounded-xl mb-5 border border-white/5 flex justify-between items-center">
        <span className="text-gray-300">Total a pagar</span>
        <span className="text-right">
          <span className="block text-2xl font-bold text-green-500">{formatCurrency(total)}</span>
          {total < precoCheio && (
            <span className="block text-xs text-green-300">economia de {formatCurrency(precoCheio - total)}</span>
          )}
        </span>
      </div>

      {lembrado && (
        <p className="text-xs text-gray-400 mb-4">
          Usando seus dados da última compra ·{' '}
          <button type="button" onClick={limparDados} className="text-gold underline min-h-8">Não é você? Limpar dados</button>
        </p>
      )}

      {erro && (
        <div className="bg-red-500/20 text-red-300 border border-red-500/50 p-3 rounded-xl mb-4 text-sm font-bold" role="alert">
          {erro}
        </div>
      )}

      <form onSubmit={enviar} className="flex flex-col gap-4">
        <Campo rotulo="Nome completo *" type="text" name="nome" autoComplete="name" value={dados.nome} onChange={alterar} required />
        <Campo
          rotulo="Telefone (WhatsApp) *"
          type="tel"
          name="telefone"
          inputMode="tel"
          autoComplete="tel-national"
          placeholder="(00) 00000-0000"
          value={dados.telefone}
          onChange={alterar}
          required
        />
        <Campo
          rotulo="Endereço *"
          type="text"
          name="endereco"
          autoComplete="street-address"
          placeholder="Rua, Número, Bairro, Cidade"
          value={dados.endereco}
          onChange={alterar}
          required
        />

        <button
          type="button"
          onClick={() => setMostrarOpcionais(!mostrarOpcionais)}
          aria-expanded={mostrarOpcionais}
          className="text-gold text-sm flex items-center gap-1 self-start font-medium min-h-10"
        >
          {mostrarOpcionais ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          {mostrarOpcionais ? 'Ocultar e-mail e CPF' : 'Adicionar e-mail e CPF (opcional)'}
        </button>

        <AnimatePresence>
          {mostrarOpcionais && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="flex flex-col gap-4 overflow-hidden"
            >
              <Campo rotulo="E-mail" type="email" name="email" autoComplete="email" value={dados.email} onChange={alterar} />
              <Campo
                rotulo="CPF"
                type="text"
                name="cpf"
                inputMode="numeric"
                maxLength="14"
                placeholder="000.000.000-00"
                value={dados.cpf}
                onChange={alterar}
              />
            </motion.div>
          )}
        </AnimatePresence>

        <button
          type="submit"
          disabled={enviando}
          className="mt-1 min-h-14 bg-brand-red text-white font-bold rounded-xl shadow-[0_0_15px_rgba(179,0,0,0.4)] hover:bg-red-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
        >
          {enviando ? 'Reservando...' : (<><Ticket className="w-5 h-5" /> Reservar números</>)}
        </button>
      </form>
    </>
  );
}
