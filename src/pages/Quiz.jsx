import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, CheckCircle2, XCircle, Trophy, RotateCcw } from 'lucide-react';
import { Link } from 'react-router-dom';

const QUESTIONS = [
  {
    question: 'Onde Carlo Acutis nasceu?',
    options: ['Milão, Itália', 'Londres, Inglaterra', 'Roma, Itália', 'Paris, França'],
    answer: 1,
  },
  {
    question: 'Como ele carinhosamente chamava a Eucaristia?',
    options: ['Meu encontro com Jesus', 'A luz do meu caminho', 'Minha rodovia para o Céu', 'O pão da vida eterna'],
    answer: 2,
  },
  {
    question: 'Qual ferramenta ele usou brilhantemente para catalogar milagres eucarísticos?',
    options: ['Livros impressos', 'Internet / Computador', 'Pinturas', 'Programas de rádio'],
    answer: 1,
  },
  {
    question: 'Onde ocorreu o milagre que levou à beatificação de Carlo Acutis?',
    options: ['Campo Grande - MS, Brasil', 'São Paulo - SP, Brasil', 'Assis, Itália', 'Lisboa, Portugal'],
    answer: 0,
  },
  {
    question: 'Em que ano Carlo Acutis faleceu?',
    options: ['2000', '2010', '2006', '2020'],
    answer: 2,
  },
  {
    question: 'Qual era um de seus passatempos favoritos além da programação?',
    options: ['Jogar videogame', 'Tocar violino', 'Pintura clássica', 'Fotografia profissional'],
    answer: 0,
  }
];

export default function Quiz() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [isAnswered, setIsAnswered] = useState(false);

  const handleAnswerClick = (index) => {
    if (isAnswered) return;
    
    setSelectedAnswer(index);
    setIsAnswered(true);

    if (index === QUESTIONS[currentQuestion].answer) {
      setScore(score + 100);
    }

    setTimeout(() => {
      const nextQuestion = currentQuestion + 1;
      if (nextQuestion < QUESTIONS.length) {
        setCurrentQuestion(nextQuestion);
        setIsAnswered(false);
        setSelectedAnswer(null);
      } else {
        setShowResult(true);
      }
    }, 1500);
  };

  const resetQuiz = () => {
    setCurrentQuestion(0);
    setScore(0);
    setShowResult(false);
    setSelectedAnswer(null);
    setIsAnswered(false);
  };

  const maxScore = QUESTIONS.length * 100;

  return (
    <div className="min-h-screen bg-surface-dark text-text-light font-sans selection:bg-brand-red selection:text-white pb-32 pt-8 px-4">
      <div className="max-w-3xl mx-auto">
        <Link to="/" className="inline-flex items-center gap-2 text-gold hover:text-white font-bold mb-8 transition-colors">
          <ArrowLeft className="w-5 h-5" /> Voltar ao site
        </Link>

        {!showResult ? (
          <AnimatePresence mode="wait">
            <motion.div
              key={currentQuestion}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.3 }}
              className="bg-black/40 border border-white/10 rounded-3xl p-6 md:p-10 shadow-2xl relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-full h-1 bg-white/10">
                <div 
                  className="h-full bg-gold transition-all duration-500"
                  style={{ width: `${((currentQuestion + 1) / QUESTIONS.length) * 100}%` }}
                ></div>
              </div>

              <div className="flex justify-between items-center mb-8">
                <span className="text-gray-400 font-bold uppercase tracking-widest text-sm">Pergunta {currentQuestion + 1} de {QUESTIONS.length}</span>
                <span className="bg-brand-red/20 text-brand-red border border-brand-red/30 px-4 py-1 rounded-full font-bold">
                  {score} pts
                </span>
              </div>

              <h2 className="text-2xl md:text-3xl font-bold text-white mb-8 leading-tight">
                {QUESTIONS[currentQuestion].question}
              </h2>

              <div className="flex flex-col gap-4">
                {QUESTIONS[currentQuestion].options.map((option, index) => {
                  let buttonStyle = "bg-white/5 border-white/10 hover:border-gold hover:bg-gold/10 text-gray-300";
                  
                  if (isAnswered) {
                    if (index === QUESTIONS[currentQuestion].answer) {
                      buttonStyle = "bg-green-500/20 border-green-500 text-green-400";
                    } else if (index === selectedAnswer) {
                      buttonStyle = "bg-red-500/20 border-red-500 text-red-400";
                    } else {
                      buttonStyle = "bg-white/5 border-white/10 text-gray-500 opacity-50";
                    }
                  }

                  return (
                    <button
                      key={index}
                      onClick={() => handleAnswerClick(index)}
                      disabled={isAnswered}
                      className={`w-full text-left p-4 rounded-2xl border-2 transition-all duration-300 flex justify-between items-center ${buttonStyle}`}
                    >
                      <span className="font-medium text-lg">{option}</span>
                      {isAnswered && index === QUESTIONS[currentQuestion].answer && <CheckCircle2 className="w-6 h-6 text-green-400" />}
                      {isAnswered && index === selectedAnswer && index !== QUESTIONS[currentQuestion].answer && <XCircle className="w-6 h-6 text-red-400" />}
                    </button>
                  );
                })}
              </div>
            </motion.div>
          </AnimatePresence>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-black/40 border border-gold/30 rounded-3xl p-8 md:p-12 text-center shadow-[0_0_40px_rgba(212,175,55,0.15)] relative overflow-hidden"
          >
            <div className="absolute -top-20 -left-20 w-64 h-64 bg-gold/10 rounded-full blur-3xl"></div>
            <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-brand-red/10 rounded-full blur-3xl"></div>

            <div className="relative z-10 flex flex-col items-center">
              <div className="w-24 h-24 bg-gold/20 text-gold rounded-full flex items-center justify-center mb-6 border-4 border-gold/30">
                <Trophy className="w-12 h-12" />
              </div>
              
              <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">Quiz Concluído!</h2>
              <p className="text-gray-300 text-lg mb-8">
                Você respondeu a todas as perguntas.
              </p>

              <div className="bg-surface-dark border border-white/10 p-6 rounded-2xl mb-8 w-full max-w-sm">
                <p className="text-gray-400 uppercase tracking-widest text-sm font-bold mb-2">Sua Pontuação</p>
                <p className="text-5xl font-black text-brand-red drop-shadow-[0_0_10px_rgba(179,0,0,0.5)]">
                  {score} <span className="text-xl text-gold">/ {maxScore}</span>
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 w-full max-w-sm">
                <button
                  onClick={resetQuiz}
                  className="flex-1 bg-white/10 hover:bg-white/20 text-white font-bold py-4 px-6 rounded-full transition-all flex items-center justify-center gap-2"
                >
                  <RotateCcw className="w-5 h-5" /> Tentar de novo
                </button>
                <Link
                  to="/"
                  className="flex-1 bg-gold hover:bg-yellow-500 text-surface-dark font-bold py-4 px-6 rounded-full transition-all flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(212,175,55,0.4)]"
                >
                  Ir para Home
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
