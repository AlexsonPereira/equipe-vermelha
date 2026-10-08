import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Crown, HeartHandshake, Church, Flame, Quote, Ticket } from 'lucide-react';
import { Link } from 'react-router-dom';
import { fetchRifa } from '../services/api';
import CarloAcutisSlider from '../components/CarloAcutisSlider';
import BarraAcoesMobile from '../components/home/BarraAcoesMobile';
import BarraProgressoLeitura from '../components/home/BarraProgressoLeitura';
import DoacaoAlimentos from '../components/home/DoacaoAlimentos';
import FaixaRifa from '../components/home/FaixaRifa';
import InstagramSobDemanda from '../components/home/InstagramSobDemanda';
import LinhaDoTempo from '../components/home/LinhaDoTempo';
import MomentoComCarlo from '../components/home/MomentoComCarlo';
import RifaHome from '../components/home/RifaHome';
import Rodape from '../components/home/Rodape';

const InstagramIcon = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5"></rect>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"></line>
  </svg>
);

// Mesmos padrões da página de rifa, até a API (que pode estar acordando) responder.
const RIFA_PADRAO = {
  premio: 'Air Fryer',
  valorCentavos: 500,
  pacotes: [],
  sorteio: { data: null, local: null },
  ultimosVendidos: [],
  tickets: [],
};

const POSTS_INSTAGRAM = [
  'https://www.instagram.com/p/DcuB1OFukRJ/',
  'https://www.instagram.com/p/Dc7clakNTSJ/',
  'https://www.instagram.com/p/DdEqAJrOYv-/',
];

// Partículas do topo com posições fixas (nada aleatório durante a renderização).
const PARTICULAS = [
  { x: 8, tamanho: 6, atraso: 0, duracao: 9, simbolo: '✦' },
  { x: 22, tamanho: 10, atraso: 2.5, duracao: 11, simbolo: '♥' },
  { x: 37, tamanho: 7, atraso: 5, duracao: 10, simbolo: '✝' },
  { x: 55, tamanho: 9, atraso: 1.2, duracao: 12, simbolo: '✦' },
  { x: 68, tamanho: 6, atraso: 3.8, duracao: 9, simbolo: '♥' },
  { x: 82, tamanho: 11, atraso: 6, duracao: 13, simbolo: '✦' },
  { x: 93, tamanho: 7, atraso: 0.6, duracao: 10, simbolo: '✝' },
];

function Particulas() {
  return (
    <div aria-hidden="true" className="absolute inset-0 overflow-hidden pointer-events-none">
      {PARTICULAS.map((p, indice) => (
        <motion.span
          key={indice}
          className="absolute bottom-0 text-gold/60"
          style={{ left: `${p.x}%`, fontSize: `${p.tamanho * 2}px` }}
          initial={{ y: 0, opacity: 0 }}
          animate={{ y: '-100vh', opacity: [0, 1, 1, 0] }}
          transition={{ duration: p.duracao, delay: p.atraso, repeat: Infinity, ease: 'linear' }}
        >
          {p.simbolo}
        </motion.span>
      ))}
    </div>
  );
}

export default function Home() {
  const [rifa, setRifa] = useState(null);

  // Também acorda a API, que dorme no plano gratuito do Render.
  useEffect(() => {
    fetchRifa().then(setRifa).catch(() => { });
  }, []);

  const infoRifa = { ...RIFA_PADRAO, ...(rifa ?? {}) };

  return (
    <div className="min-h-screen bg-surface-dark text-text-light font-sans selection:bg-brand-red selection:text-white">
      <BarraProgressoLeitura />

      {/* Aba lateral de doação (computador) */}
      <motion.div
        initial={{ opacity: 0, x: 40 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, delay: 1 }}
        className="hidden md:block fixed right-0 top-1/2 -translate-y-1/2 z-50"
      >
        <a
          href="#doacoes"
          aria-label="Doar alimentos"
          className="group flex items-center gap-3 bg-brand-red hover:bg-red-700 text-white font-bold py-5 px-3 rounded-l-2xl shadow-[0_8px_30px_rgba(179,0,0,0.55)] border border-white/15 border-r-0 transition-all"
        >
          <span className="relative flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/15">
            <span className="absolute inset-0 rounded-full bg-white/20 motion-safe:animate-ping"></span>
            <HeartHandshake className="relative w-5 h-5" />
          </span>
          <span className="leading-tight [writing-mode:vertical-rl] rotate-180">Doe alimentos</span>
        </a>
      </motion.div>

      {/* 1. Hero */}
      <section className="relative min-h-[100svh] flex flex-col items-center justify-center overflow-hidden pt-16 pb-28 md:pb-16 px-4">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 100, repeat: Infinity, ease: 'linear' }}
          className="absolute inset-0 flex items-center justify-center opacity-30 pointer-events-none"
        >
          <div className="w-[80vw] h-[80vw] sm:w-[60vw] sm:h-[60vw] max-w-[800px] max-h-[800px] rounded-full border-[1px] border-brand-red border-dashed"></div>
          <div className="absolute w-[60vw] h-[60vw] sm:w-[45vw] sm:h-[45vw] max-w-[600px] max-h-[600px] rounded-full border-[2px] border-primary"></div>
          <div className="absolute w-[40vw] h-[40vw] sm:w-[30vw] sm:h-[30vw] max-w-[400px] max-h-[400px] rounded-full border-[1px] border-gold border-opacity-50"></div>
        </motion.div>
        <Particulas />

        <div className="relative z-10 flex flex-col items-center text-center w-full max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-gold tracking-[0.3em] text-xs sm:text-sm md:text-base font-bold uppercase mb-6"
          >
            FÉ • CORAGEM • MISSÃO
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="flex flex-col items-center"
          >
            <motion.span animate={{ y: [0, -6, 0] }} transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}>
              <Crown className="text-gold w-10 h-10 md:w-12 md:h-12 mb-2" />
            </motion.span>
            <h2 className="text-2xl sm:text-3xl md:text-5xl font-bold tracking-[0.2em] uppercase text-white -mb-3 z-10">Equipe</h2>
            <h1 className="font-marker text-6xl sm:text-7xl md:text-9xl text-brand-red drop-shadow-[0_0_15px_rgba(179,0,0,0.8)] -rotate-3 z-20 leading-none">
              VERMELHA
            </h1>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="absolute left-0 md:left-10 top-1/2 -translate-y-1/2 rotate-[-15deg] hidden lg:block"
          >
            <p className="font-cursive text-3xl text-gold max-w-[200px] leading-snug">"Jovens que amam, servem e anunciam"</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.4 }}
            className="mt-6 relative w-56 h-56 sm:w-72 sm:h-72 md:w-96 md:h-96 mx-auto"
          >
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-12 md:h-16 bg-white opacity-90 blur-[2px] rotate-[-5deg] rounded-full z-0"></div>
            <motion.div
              aria-hidden="true"
              animate={{ scale: [1, 1.12, 1], opacity: [0.5, 0.9, 0.5] }}
              transition={{ repeat: Infinity, duration: 4, ease: 'easeInOut' }}
              className="absolute inset-0 bg-primary/40 rounded-full blur-2xl -z-10"
            />
            <div className="relative z-10 w-full h-full rounded-full border-4 border-gold shadow-[0_0_30px_rgba(212,175,55,0.4)] overflow-hidden bg-surface-dark flex items-center justify-center">
              <img
                src="/logo-equipe.jpg"
                alt="Equipe Vermelha - São Carlo Acutis"
                className="w-full h-full object-cover"
                onError={(e) => { e.currentTarget.style.display = 'none'; }}
              />
            </div>
          </motion.div>

          <div className="mt-8 w-full px-2">
            <FaixaRifa rifa={infoRifa} />
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="mt-5 flex flex-col sm:flex-row gap-3 w-full justify-center px-2"
          >
            <Link to="/tickets" className="min-h-12 bg-gold hover:bg-yellow-500 text-surface-dark font-bold py-3 px-8 rounded-full shadow-[0_0_20px_rgba(212,175,55,0.4)] transition-all flex items-center justify-center gap-2">
              <Ticket className="w-5 h-5" /> Concorrer na rifa
            </Link>
            <a href="#doacoes" className="min-h-12 bg-brand-red hover:bg-red-700 text-white font-bold py-3 px-8 rounded-full shadow-[0_0_20px_rgba(179,0,0,0.4)] transition-all flex items-center justify-center gap-2">
              <HeartHandshake className="w-5 h-5" /> Doar alimentos
            </a>
          </motion.div>
          <a href="#sobre" className="mt-4 min-h-11 inline-flex items-center gap-2 text-gold font-bold hover:underline">
            <Flame className="w-4 h-4" /> Conheça nossa causa
          </a>
        </div>
      </section>

      {/* 2. Sobre o MAC */}
      <section id="sobre" className="py-20 md:py-24 px-6 bg-gradient-to-b from-surface-dark to-primary/20">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.8 }}
            className="flex flex-col md:flex-row gap-12 items-center"
          >
            <div className="flex-1">
              <h3 className="text-gold font-bold tracking-widest uppercase mb-2 flex items-center gap-2 text-sm">
                <Church className="w-5 h-5" />
                Nossa História
              </h3>
              <h2 className="text-3xl md:text-5xl font-bold mb-6 text-white">Movimento de Amizade Cristã</h2>
              <p className="text-gray-300 leading-relaxed mb-4 text-base md:text-lg">
                O MAC da Paróquia Santo Antônio em Guanambi-BA é mais do que um grupo de jovens; somos uma família unida pelo desejo de viver a alegria do Evangelho. Nossa gincana não é apenas uma competição, mas um grande mutirão de solidariedade, fé e testemunho.
              </p>
              <p className="text-gray-300 leading-relaxed text-base md:text-lg">
                Neste ano, a <strong>Equipe Vermelha</strong> abraça o carisma da juventude conectada, inspirados pela vida de nosso padroeiro, mostrando que é possível ser jovem, moderno e profundamente apaixonado por Cristo.
              </p>
            </div>
            <motion.div
              whileHover={{ rotate: -1.5, scale: 1.02 }}
              className="flex-1 w-full max-w-sm relative"
            >
              <div className="aspect-square rounded-2xl border border-gold/30 p-8 flex items-center justify-center bg-primary/10 backdrop-blur-sm">
                <Quote className="w-20 h-20 text-brand-red opacity-30 absolute top-4 left-4" />
                <p className="font-cursive text-2xl md:text-3xl text-center text-white relative z-10 leading-relaxed">
                  "A tristeza é olhar para si mesmo, a alegria é olhar para Deus."
                </p>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* 3. Rifa */}
      <RifaHome rifa={infoRifa} />

      {/* 4. Doação de alimentos */}
      <DoacaoAlimentos />

      {/* 5. São Carlo Acutis */}
      <CarloAcutisSlider />
      <LinhaDoTempo />
      <MomentoComCarlo />

      {/* 6. Instagram */}
      <section className="py-20 md:py-24 px-6 bg-gradient-to-b from-surface-dark to-black relative overflow-hidden">
        <div className="max-w-7xl mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <div className="w-16 h-16 bg-gradient-to-tr from-[#f09433] via-[#dc2743] to-[#bc1888] rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-red-900/20">
              <InstagramIcon className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">Siga a Equipe Vermelha</h2>
            <p className="text-gray-400 text-lg mb-8 max-w-2xl mx-auto leading-relaxed">
              Acompanhe de perto as provas da gincana, os bastidores, nossas ações solidárias e muito mais!
            </p>
            <a
              href="https://www.instagram.com/equipevermelha.mac/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 min-h-12 bg-white/5 border border-white/10 hover:border-white/30 hover:bg-white/10 text-white font-bold px-8 rounded-full transition-all hover:scale-105"
            >
              <InstagramIcon className="w-5 h-5" />
              @equipevermelha.mac
            </a>
          </motion.div>
          <div className="flex flex-wrap justify-center gap-8">
            {POSTS_INSTAGRAM.map((url) => <InstagramSobDemanda key={url} url={url} />)}
          </div>
        </div>
      </section>

      <Rodape />
      <BarraAcoesMobile valorCentavos={infoRifa.valorCentavos} />
    </div>
  );
}
