import React, { useCallback, useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowLeft, Trophy } from 'lucide-react';
import { Link } from 'react-router-dom';
import { criarPartidaQuiz, fetchRankingQuiz, finalizarPartidaQuiz } from '../services/api';
import { pontuarRespostas } from '../utils/quiz';
import Contagem from '../components/quiz/Contagem';
import RankingQuiz from '../components/quiz/RankingQuiz';
import TelaInicio from '../components/quiz/TelaInicio';
import TelaPartida from '../components/quiz/TelaPartida';
import TelaResultado from '../components/quiz/TelaResultado';

const CHAVE_APELIDO = 'apelidoQuiz';

const lerApelido = () => {
  try {
    return localStorage.getItem(CHAVE_APELIDO) || '';
  } catch {
    return '';
  }
};

// Telas: 'inicio' → 'contagem' (vira a partida quando a contagem acaba e o servidor respondeu) → 'resultado'; 'ranking' a qualquer momento.
export default function Quiz() {
  const [tela, setTela] = useState('inicio');
  const [apelido, setApelido] = useState(lerApelido);
  const [erro, setErro] = useState('');
  const [ranking, setRanking] = useState(null);
  const [partida, setPartida] = useState(null);
  const [contagemAcabou, setContagemAcabou] = useState(false);
  const [resultado, setResultado] = useState(null);
  const [enviando, setEnviando] = useState(false);

  const carregarRanking = useCallback(async () => {
    try {
      setRanking(await fetchRankingQuiz());
    } catch {
      setRanking((atual) => atual ?? []);
    }
  }, []);

  useEffect(() => {
    carregarRanking();
  }, [carregarRanking]);

  // Toque duplo em "Começar"/"Jogar de novo" não cria duas partidas; respostas de tentativas antigas são descartadas.
  const iniciando = useRef(false);
  const tentativaAtual = useRef(0);
  const [tentativa, setTentativa] = useState(0);

  const comecar = async ({ forcar = false } = {}) => {
    if (iniciando.current && !forcar) return;
    const nome = apelido.trim().replace(/\s+/g, ' ');
    if (nome.length < 2) {
      setErro('Escolha um apelido de 2 a 20 caracteres.');
      return;
    }
    try {
      localStorage.setItem(CHAVE_APELIDO, nome);
    } catch {
      // Sem armazenamento local o apelido só não fica lembrado.
    }
    iniciando.current = true;
    tentativaAtual.current += 1;
    const minha = tentativaAtual.current;
    setTentativa(minha);
    setApelido(nome);
    setErro('');
    setPartida(null);
    setResultado(null);
    setContagemAcabou(false);
    setTela('contagem');
    try {
      const nova = await criarPartidaQuiz(nome);
      if (minha === tentativaAtual.current) setPartida(nova);
    } catch (error) {
      if (minha !== tentativaAtual.current) return;
      setTela('inicio');
      setErro(error.status === 400 ? error.message : 'Não conseguimos falar com o servidor. Tente de novo em instantes.');
    } finally {
      if (minha === tentativaAtual.current) iniciando.current = false;
    }
  };

  const desistirDaEspera = () => {
    tentativaAtual.current += 1;
    iniciando.current = false;
    setTela('inicio');
  };

  const enviar = async (dados) => {
    setEnviando(true);
    try {
      const servidor = await finalizarPartidaQuiz(dados.partidaId, dados.respostas);
      setResultado({ ...dados, servidor, erroEnvio: '', podeTentar: false });
      carregarRanking();
    } catch (error) {
      const definitivo = error.status === 409 || error.status === 410;
      setResultado({
        ...dados,
        servidor: null,
        erroEnvio: definitivo ? error.message : 'Sua pontuação não foi enviada. Verifique a internet e tente de novo.',
        podeTentar: !definitivo,
      });
    } finally {
      setEnviando(false);
    }
  };

  const terminar = useCallback((respostas, acertos) => {
    const acertosLocais = acertos.filter(Boolean).length;
    const dados = {
      partidaId: partida.partidaId,
      respostas: [...respostas],
      pontosLocais: pontuarRespostas(acertos),
      acertosLocais,
      errosLocais: acertos.length - acertosLocais,
    };
    // O resultado aparece na hora com os pontos locais; o oficial chega quando o servidor responder.
    setResultado({ ...dados, servidor: null, erroEnvio: '', podeTentar: false });
    setTela('resultado');
    enviar(dados);
    // `enviar` só usa setters e a API; recriá-lo não muda o comportamento.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [partida]);

  const fimDaContagem = useCallback(() => setContagemAcabou(true), []);
  const jogando = tela === 'contagem' && contagemAcabou && partida;

  const verRanking = () => {
    carregarRanking();
    setTela('ranking');
  };

  return (
    <div className="min-h-screen bg-surface-dark text-text-light font-sans selection:bg-brand-red selection:text-white pb-16 pt-4 px-4">
      <div className="max-w-xl mx-auto">
        {!jogando && tela !== 'contagem' && (
          <Link to="/" className="inline-flex min-h-11 items-center gap-2 text-gold hover:text-white font-bold mb-4">
            <ArrowLeft className="w-5 h-5" /> Voltar ao site
          </Link>
        )}

        <AnimatePresence mode="wait">
          <motion.div
            key={jogando ? 'partida' : tela}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.25 }}
          >
            {tela === 'inicio' && (
              <TelaInicio
                apelido={apelido}
                onAlterarApelido={setApelido}
                ranking={ranking}
                erro={erro}
                onComecar={comecar}
                onVerRanking={verRanking}
              />
            )}

            {tela === 'contagem' && !jogando && (
              <Contagem
                key={tentativa}
                onFim={fimDaContagem}
                aguardandoServidor={!partida}
                onTentarNovamente={() => comecar({ forcar: true })}
                onVoltar={desistirDaEspera}
              />
            )}

            {jogando && <TelaPartida key={partida.partidaId} partida={partida} onFim={terminar} />}

            {tela === 'resultado' && resultado && (
              <TelaResultado
                apelido={apelido}
                resultado={resultado}
                enviando={enviando}
                onTentarEnviar={() => enviar(resultado)}
                onJogarDeNovo={() => comecar()}
                onVerRanking={verRanking}
              />
            )}

            {tela === 'ranking' && (
              <div className="flex flex-col gap-6">
                <div className="text-center">
                  <Trophy className="w-12 h-12 text-gold mx-auto mb-2" />
                  <h1 className="text-3xl font-bold text-white">Ranking do Desafio</h1>
                  <p className="text-gray-400">Melhor pontuação de cada apelido</p>
                </div>
                <RankingQuiz ranking={ranking} apelidoDestaque={apelido} />
                <button onClick={() => setTela('inicio')} className="w-full min-h-14 rounded-2xl bg-gradient-to-r from-brand-red to-red-600 text-white text-lg font-bold">
                  Jogar ⚡
                </button>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
