import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, CheckCircle, LogOut, RefreshCw, Search, Send, Shield } from 'lucide-react';
import { Link } from 'react-router-dom';
import { adminLogin, cancelarPedido, confirmarPedido, fetchAdminPedidos, fetchRifa, liberarTicketLegado } from '../services/api';
import { compartilharComprovante } from '../services/compartilharComprovante';
import { FILTROS, correspondeBusca, resumoRifa } from '../utils/adminPedidos';
import { formatCurrency, formatPhone } from '../utils/formatters';
import CartaoPedido from '../components/admin/CartaoPedido';
import FolhaAcao from '../components/admin/FolhaAcao';
import ListaLegados from '../components/admin/ListaLegados';
import RankingQuizAdmin from '../components/admin/RankingQuizAdmin';
import ResumoRifa from '../components/admin/ResumoRifa';

const AVISOS_COMPARTILHAMENTO = {
  baixado: 'PDF baixado e WhatsApp aberto em outra aba.',
  bloqueado: 'O navegador bloqueou o WhatsApp. O PDF foi baixado; permita pop-ups e tente "Reenviar comprovante".',
};

function ResumoDoPedido({ pedido }) {
  return (
    <div className="bg-black/40 border border-white/5 rounded-xl p-4 mb-4 text-sm">
      <p className="font-bold text-white">#{pedido.codigo} · {pedido.usuarioNome}</p>
      <p className="text-gray-400">{formatPhone(pedido.usuarioTelefone) || 'Sem telefone'}</p>
      <p className="text-gray-300 mt-2">
        Números: <strong className="text-white">{pedido.tickets.map((t) => t.numero).join(', ')}</strong>
      </p>
      <p className="text-2xl font-bold text-green-400 mt-1">{formatCurrency(pedido.valorTotalCentavos)}</p>
    </div>
  );
}

function ErroAcao({ mensagem }) {
  if (!mensagem) return null;
  return (
    <p className="bg-red-500/15 border border-red-500/40 text-red-300 rounded-xl p-3 mb-4 text-sm flex items-start gap-2">
      <AlertTriangle className="w-4 h-4 mt-0.5 flex-shrink-0" /> {mensagem}
    </p>
  );
}

export default function Admin() {
  const [adminSenha, setAdminSenha] = useState('');
  const [adminToken, setAdminToken] = useState(() => localStorage.getItem('adminToken'));
  const [dados, setDados] = useState(null); // { pedidos, ticketsLegados }
  const [grade, setGrade] = useState(null); // tickets da grade pública, para o progresso
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [filtro, setFiltro] = useState('pendentes');
  const [busca, setBusca] = useState('');
  // { tipo: 'confirmar' | 'cancelar' | 'enviar' | 'legado', pedido?, ticket?, erro?, processando? }
  const [acao, setAcao] = useState(null);
  const [aviso, setAviso] = useState('');

  const handleLogout = useCallback(() => {
    setAdminToken(null);
    setDados(null);
    localStorage.removeItem('adminToken');
  }, []);

  const loadDados = useCallback(async () => {
    if (!adminToken) return;
    setLoading(true);
    setErrorMessage('');
    try {
      const [pedidos, rifa] = await Promise.all([
        fetchAdminPedidos(adminToken),
        fetchRifa().catch(() => null), // sem a grade, só o progresso fica de fora
      ]);
      setDados(pedidos);
      setGrade(rifa?.tickets ?? null);
    } catch (error) {
      if (error.status === 401 || error.status === 403) {
        handleLogout();
      } else {
        setErrorMessage(error.message);
      }
    } finally {
      setLoading(false);
    }
  }, [adminToken, handleLogout]);

  useEffect(() => {
    loadDados();
  }, [loadDados]);

  useEffect(() => {
    if (!aviso) return undefined;
    const timer = setTimeout(() => setAviso(''), 5000);
    return () => clearTimeout(timer);
  }, [aviso]);

  const handleAdminLogin = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    try {
      const token = await adminLogin(adminSenha);
      setAdminToken(token);
      localStorage.setItem('adminToken', token);
      setAdminSenha('');
    } catch {
      setErrorMessage('Senha incorreta.');
    }
  };

  // Precisa partir direto de um toque: o compartilhamento é bloqueado depois de esperas.
  const enviarComprovante = async (pedido) => {
    setAcao(null);
    const resultado = await compartilharComprovante(pedido);
    if (AVISOS_COMPARTILHAMENTO[resultado]) setAviso(AVISOS_COMPARTILHAMENTO[resultado]);
  };

  const executarAcao = async (operacao, aposSucesso) => {
    setAcao((atual) => ({ ...atual, processando: true, erro: '' }));
    try {
      const resposta = await operacao();
      await loadDados();
      aposSucesso(resposta);
    } catch (error) {
      if (error.status === 401 || error.status === 403) {
        setAcao(null);
        handleLogout();
      } else {
        setAcao((atual) => ({ ...atual, processando: false, erro: error.message || 'Não foi possível concluir.' }));
      }
    }
  };

  const confirmar = () =>
    executarAcao(
      () => confirmarPedido(acao.pedido.id, adminToken),
      ({ pedido }) => setAcao({ tipo: 'enviar', pedido })
    );

  const cancelar = () =>
    executarAcao(
      () => cancelarPedido(acao.pedido.id, adminToken),
      () => {
        setAcao(null);
        setAviso(`Pedido #${acao.pedido.codigo} cancelado e números liberados.`);
      }
    );

  const liberarLegado = () =>
    executarAcao(
      () => liberarTicketLegado(acao.ticket.numero, adminToken),
      () => {
        setAcao(null);
        setAviso(`Número ${acao.ticket.numero} liberado.`);
      }
    );

  const pedidos = useMemo(() => dados?.pedidos ?? [], [dados]);
  const filtroAtual = FILTROS.find((f) => f.id === filtro) ?? FILTROS[0];
  const pedidosVisiveis = useMemo(
    () => pedidos.filter((p) => filtroAtual.aceita(p) && correspondeBusca(p, busca)),
    [pedidos, filtroAtual, busca]
  );
  const resumo = useMemo(() => resumoRifa(pedidos, grade), [pedidos, grade]);

  if (!adminToken) {
    return (
      <div className="min-h-screen bg-surface-dark flex items-center justify-center p-4 selection:bg-brand-red selection:text-white">
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          className="bg-black/50 border border-white/10 p-6 sm:p-8 rounded-2xl w-full max-w-md shadow-2xl"
        >
          <div className="text-center mb-6">
            <Shield className="w-12 h-12 text-gold mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-white">Acesso Administrativo</h2>
          </div>
          {errorMessage && (
            <div className="bg-red-500/20 text-red-400 p-3 rounded-xl mb-4 text-center text-sm">{errorMessage}</div>
          )}
          <form onSubmit={handleAdminLogin} className="flex flex-col gap-4">
            <input
              type="password"
              placeholder="Senha de Acesso"
              autoComplete="current-password"
              value={adminSenha}
              onChange={(e) => setAdminSenha(e.target.value)}
              className="min-h-12 bg-black/50 border border-white/10 rounded-xl px-4 text-base text-white focus:border-gold outline-none"
              required
            />
            <button
              type="submit"
              className="min-h-12 bg-gold text-surface-dark font-bold rounded-xl hover:bg-yellow-500 transition-colors"
            >
              Entrar
            </button>
          </form>
          <div className="mt-6 text-center">
            <Link to="/" className="text-gray-400 hover:text-white text-sm">Voltar para o site</Link>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface-dark text-text-light font-sans selection:bg-brand-red selection:text-white pb-10">
      <header className="sticky top-0 z-30 h-14 bg-surface-dark/95 backdrop-blur border-b border-white/5 px-4">
        <div className="max-w-6xl mx-auto h-full flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Shield className="w-6 h-6 text-gold" />
            <h1 className="text-lg font-bold text-white">Painel</h1>
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={loadDados}
              disabled={loading}
              aria-label="Atualizar"
              className="w-11 h-11 flex items-center justify-center rounded-full text-gray-300 hover:bg-white/10 disabled:opacity-60"
            >
              <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
            </button>
            <button
              onClick={handleLogout}
              aria-label="Sair"
              className="h-11 px-3 flex items-center gap-2 rounded-full text-brand-red hover:bg-white/10 font-bold text-sm uppercase"
            >
              <LogOut className="w-4 h-4" /> Sair
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 pt-4 flex flex-col gap-4">
        {errorMessage && (
          <div className="bg-red-500/20 border border-red-500/50 text-red-300 p-4 rounded-2xl text-sm">{errorMessage}</div>
        )}

        {dados === null ? (
          <p className="py-16 text-center text-gold">{loading ? 'Carregando...' : 'Não foi possível carregar os pedidos.'}</p>
        ) : (
          <>
            <ResumoRifa resumo={resumo} onVerVencidos={() => setFiltro('vencidos')} />

            <div className="sticky top-14 z-20 -mx-4 px-4 py-3 bg-surface-dark/95 backdrop-blur flex flex-col gap-3">
              <label className="relative block">
                <Search className="w-5 h-5 text-gray-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="search"
                  value={busca}
                  onChange={(e) => setBusca(e.target.value)}
                  placeholder="Nome, telefone, nº ou código"
                  className="w-full min-h-12 bg-black/50 border border-white/10 rounded-xl pl-10 pr-3 text-base text-white focus:border-gold outline-none"
                />
              </label>
              <div className="flex gap-2 overflow-x-auto -mx-4 px-4 pb-1">
                {FILTROS.map((f) => (
                  <button
                    key={f.id}
                    onClick={() => setFiltro(f.id)}
                    aria-pressed={filtro === f.id}
                    className={`min-h-10 px-4 rounded-full text-sm font-bold whitespace-nowrap transition-colors ${filtro === f.id ? 'bg-gold text-surface-dark' : 'bg-white/5 text-gray-300'}`}
                  >
                    {f.label} ({pedidos.filter(f.aceita).length})
                  </button>
                ))}
              </div>
            </div>

            {pedidosVisiveis.length === 0 ? (
              <p className="py-12 text-center text-gray-500">Nenhum pedido encontrado.</p>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {pedidosVisiveis.map((pedido) => (
                  <CartaoPedido
                    key={pedido.id}
                    pedido={pedido}
                    onConfirmar={(p) => setAcao({ tipo: 'confirmar', pedido: p })}
                    onCancelar={(p) => setAcao({ tipo: 'cancelar', pedido: p })}
                    onReenviar={enviarComprovante}
                  />
                ))}
              </div>
            )}

            <ListaLegados tickets={dados.ticketsLegados} onLiberar={(ticket) => setAcao({ tipo: 'legado', ticket })} />

            <RankingQuizAdmin token={adminToken} onSessaoExpirada={handleLogout} onAviso={setAviso} />
          </>
        )}
      </main>

      <FolhaAcao
        aberta={acao?.tipo === 'confirmar'}
        titulo="Confirmar pagamento"
        onFechar={() => !acao?.processando && setAcao(null)}
      >
        {acao?.pedido && <ResumoDoPedido pedido={acao.pedido} />}
        <p className="text-sm text-gray-400 mb-4">Confira no extrato se o PIX desse valor entrou antes de confirmar.</p>
        <ErroAcao mensagem={acao?.erro} />
        <button
          onClick={confirmar}
          disabled={acao?.processando}
          className="w-full min-h-12 bg-green-600 hover:bg-green-500 text-white font-bold rounded-xl disabled:opacity-60"
        >
          {acao?.processando ? 'Confirmando...' : `Confirmar ${formatCurrency(acao?.pedido?.valorTotalCentavos)}`}
        </button>
      </FolhaAcao>

      <FolhaAcao aberta={acao?.tipo === 'enviar'} titulo="Pagamento confirmado" onFechar={() => setAcao(null)}>
        <div className="flex flex-col items-center text-center gap-3 mb-5">
          <CheckCircle className="w-14 h-14 text-green-500" />
          <p className="text-gray-300">
            Pedido <strong className="text-white">#{acao?.pedido?.codigo}</strong> pago. Envie os comprovantes para{' '}
            <strong className="text-white">{acao?.pedido?.usuarioNome}</strong>.
          </p>
        </div>
        <div className="flex flex-col gap-2">
          <button
            onClick={() => enviarComprovante(acao.pedido)}
            className="w-full min-h-12 bg-green-600 hover:bg-green-500 text-white font-bold rounded-xl flex items-center justify-center gap-2"
          >
            <Send className="w-5 h-5" /> Enviar comprovante
          </button>
          <button onClick={() => setAcao(null)} className="w-full min-h-11 text-gray-400 text-sm font-bold">
            Agora não
          </button>
        </div>
      </FolhaAcao>

      <FolhaAcao
        aberta={acao?.tipo === 'cancelar'}
        titulo="Cancelar pedido"
        onFechar={() => !acao?.processando && setAcao(null)}
      >
        {acao?.pedido && <ResumoDoPedido pedido={acao.pedido} />}
        <p className="text-sm text-gray-400 mb-4">Os números voltam a ficar livres e os dados do comprador são apagados deles.</p>
        <ErroAcao mensagem={acao?.erro} />
        <button
          onClick={cancelar}
          disabled={acao?.processando}
          className="w-full min-h-12 bg-red-600 hover:bg-red-500 text-white font-bold rounded-xl disabled:opacity-60"
        >
          {acao?.processando ? 'Cancelando...' : 'Cancelar e liberar números'}
        </button>
      </FolhaAcao>

      <FolhaAcao
        aberta={acao?.tipo === 'legado'}
        titulo={`Liberar número ${acao?.ticket?.numero ?? ''}`}
        onFechar={() => !acao?.processando && setAcao(null)}
      >
        <p className="text-gray-300 mb-2">
          {acao?.ticket?.comprador_nome || 'Sem nome'} · {formatPhone(acao?.ticket?.comprador_telefone || '') || 'sem telefone'}
        </p>
        {acao?.ticket?.status === 'PAGO' ? (
          <p className="bg-orange-500/10 border border-orange-500/30 text-orange-300 rounded-xl p-3 mb-4 text-sm">
            Este número está <strong>pago</strong>. Liberar invalida o comprovante e permite vendê-lo de novo.
          </p>
        ) : (
          <p className="text-sm text-gray-400 mb-4">O número volta a ficar livre e os dados do comprador são apagados.</p>
        )}
        <ErroAcao mensagem={acao?.erro} />
        <button
          onClick={liberarLegado}
          disabled={acao?.processando}
          className="w-full min-h-12 bg-red-600 hover:bg-red-500 text-white font-bold rounded-xl disabled:opacity-60"
        >
          {acao?.processando ? 'Liberando...' : 'Liberar número'}
        </button>
      </FolhaAcao>

      {aviso && (
        <div role="status" className="fixed top-16 left-4 right-4 sm:left-auto sm:max-w-sm z-[60] bg-black/90 border border-white/10 text-white text-sm rounded-xl p-3 shadow-2xl">
          {aviso}
        </div>
      )}
    </div>
  );
}
