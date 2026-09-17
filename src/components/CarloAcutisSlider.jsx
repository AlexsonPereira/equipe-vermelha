import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Church, Smartphone, Flame, ChevronLeft, ChevronRight, Search, ExternalLink, Sparkles, HeartHandshake } from 'lucide-react';

import img1 from '../assets/images.jpg';
import img2 from '../assets/images (1).jpg';
import img3 from '../assets/images (2).jpg';

const SLIDE_COUNT = 4;

export default function CarloAcutisSlider() {
  const [activeSlide, setActiveSlide] = useState(0);
  const [direction, setDirection] = useState(1); // 1 = right, -1 = left
  const sectionRef = useRef(null);

  const scrollToTopIfMobile = () => {
    if (window.innerWidth < 1024 && sectionRef.current) {
      const rect = sectionRef.current.getBoundingClientRect();
      if (rect.top < -50 || rect.bottom > window.innerHeight + 50) {
        const offsetTop = sectionRef.current.offsetTop;
        window.scrollTo({ top: Math.max(0, offsetTop - 40), behavior: 'smooth' });
      }
    }
  };

  const nextSlide = () => {
    setDirection(1);
    setActiveSlide((prev) => (prev + 1) % SLIDE_COUNT);
    scrollToTopIfMobile();
  };

  const prevSlide = () => {
    setDirection(-1);
    setActiveSlide((prev) => (prev - 1 + SLIDE_COUNT) % SLIDE_COUNT);
    scrollToTopIfMobile();
  };

  const goToSlide = (index) => {
    setDirection(index > activeSlide ? 1 : -1);
    setActiveSlide(index);
    scrollToTopIfMobile();
  };

  const handleDragEnd = (e, { offset, velocity }) => {
    const swipe = Math.abs(offset.x) * velocity.x;
    if (swipe < -5000) {
      nextSlide();
    } else if (swipe > 5000) {
      prevSlide();
    }
  };

  const variants = {
    enter: (dir) => ({
      x: dir > 0 ? 800 : -800,
      opacity: 0,
      scale: 0.95
    }),
    center: {
      x: 0,
      opacity: 1,
      scale: 1,
      transition: { duration: 0.6, ease: [0.32, 0.72, 0, 1] }
    },
    exit: (dir) => ({
      x: dir > 0 ? -800 : 800,
      opacity: 0,
      scale: 0.95,
      transition: { duration: 0.5, ease: [0.32, 0.72, 0, 1] }
    })
  };

  return (
    <section ref={sectionRef} className="relative min-h-[90vh] md:min-h-screen w-full bg-gradient-to-b from-primary/10 via-surface-dark to-surface-dark overflow-hidden py-16 md:py-24 flex items-center justify-center">
      
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-30">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-primary/20 blur-[150px] rounded-full"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-gold/10 blur-[120px] rounded-full"></div>
      </div>

      <div className="w-full h-full max-w-7xl mx-auto relative z-10 px-4 md:px-12 lg:px-20 flex flex-col justify-between">
        
        {/* Slides Content */}
        <div className="relative flex-1 w-full flex items-center justify-center min-h-[600px]">
          <AnimatePresence initial={false} custom={direction} mode="wait">
            <motion.div
              key={activeSlide}
              custom={direction}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              className="w-full flex items-center justify-center py-4 cursor-grab active:cursor-grabbing"
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={1}
              onDragEnd={handleDragEnd}
            >
              {/* SLIDE 0: PILARES */}
              {activeSlide === 0 && (
                <div className="flex flex-col items-center justify-center text-center h-full w-full">
                  <h3 className="text-gold font-bold tracking-widest uppercase mb-3 text-sm md:text-base">Nosso Padroeiro</h3>
                  <h2 className="text-4xl md:text-6xl font-bold text-white mb-6 drop-shadow-md">São Carlo Acutis</h2>
                  <p className="text-gray-300 max-w-3xl mx-auto text-lg md:text-xl mb-12 leading-relaxed">
                    O "Padroeiro da Internet" nos ensina que a santidade é para todos, vestindo jeans e tênis, e usando a tecnologia para evangelizar o mundo.
                  </p>
                  
                  <div className="grid md:grid-cols-3 gap-6 max-w-5xl w-full">
                    <div className="bg-surface-dark/60 backdrop-blur-xl border border-white/5 hover:border-gold/50 p-8 md:p-10 rounded-3xl hover:-translate-y-2 transition-all duration-300 shadow-xl group">
                      <div className="text-gold mb-6 bg-gold/10 group-hover:bg-gold group-hover:text-surface-dark transition-colors w-16 h-16 rounded-full flex items-center justify-center mx-auto">
                        <Church className="w-8 h-8" />
                      </div>
                      <h4 className="text-xl md:text-2xl font-bold text-white mb-4 text-center">A Eucaristia</h4>
                      <p className="text-gray-400 text-center leading-relaxed">Sua 'rodovia para o céu'. Participava da missa diariamente, encontrando em Cristo a força.</p>
                    </div>
                    <div className="bg-surface-dark/60 backdrop-blur-xl border border-white/5 hover:border-gold/50 p-8 md:p-10 rounded-3xl hover:-translate-y-2 transition-all duration-300 shadow-xl group">
                      <div className="text-gold mb-6 bg-gold/10 group-hover:bg-gold group-hover:text-surface-dark transition-colors w-16 h-16 rounded-full flex items-center justify-center mx-auto">
                        <Smartphone className="w-8 h-8" />
                      </div>
                      <h4 className="text-xl md:text-2xl font-bold text-white mb-4 text-center">Evangelização Digital</h4>
                      <p className="text-gray-400 text-center leading-relaxed">Usou seu talento com computadores para criar um site catalogando milagres eucarísticos.</p>
                    </div>
                    <div className="bg-surface-dark/60 backdrop-blur-xl border border-white/5 hover:border-gold/50 p-8 md:p-10 rounded-3xl hover:-translate-y-2 transition-all duration-300 shadow-xl group">
                      <div className="text-gold mb-6 bg-gold/10 group-hover:bg-gold group-hover:text-surface-dark transition-colors w-16 h-16 rounded-full flex items-center justify-center mx-auto">
                        <Flame className="w-8 h-8" />
                      </div>
                      <h4 className="text-xl md:text-2xl font-bold text-white mb-4 text-center">Santidade Cotidiana</h4>
                      <p className="text-gray-400 text-center leading-relaxed">Um jovem comum que amava videogame, brincar com os amigos e ajudar os necessitados.</p>
                    </div>
                  </div>
                </div>
              )}

              {/* SLIDE 1: HISTÓRIA E MILAGRE */}
              {activeSlide === 1 && (
                <div className="flex flex-col lg:flex-row h-full items-center justify-center gap-10 md:gap-16 w-full">
                  <div className="w-full lg:w-[45%] flex justify-center lg:justify-end relative order-2 lg:order-1">
                     <div className="absolute inset-0 bg-gold/10 blur-[80px] rounded-full"></div>
                     <img src={img1} alt="Carlo Acutis" className="w-full max-w-[320px] md:max-w-md rounded-3xl object-cover shadow-[0_20px_50px_rgba(0,0,0,0.5)] border border-white/10 relative z-10 rotate-[-3deg] hover:rotate-0 transition-transform duration-700" />
                  </div>
                  <div className="w-full lg:w-[55%] text-center lg:text-left relative z-10 order-1 lg:order-2">
                    <h3 className="text-gold font-bold tracking-widest uppercase mb-3 text-sm md:text-base flex items-center justify-center lg:justify-start gap-2">
                      <Flame className="w-5 h-5" /> História e Milagre
                    </h3>
                    <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">O Jovem de Calça Jeans</h2>
                    <div className="space-y-4 text-gray-300 text-base md:text-lg leading-relaxed mb-8">
                      <p>Nascido em Londres e criado em Milão, Carlo era um adolescente que gostava de videogame e sair com os amigos. Mas seu amor inabalável pela Eucaristia era sua verdadeira "rodovia para o Céu".</p>
                      <p>Ele utilizou a internet como poderosa ferramenta de evangelização e ofereceu todos os seus sofrimentos por Cristo, pelo Papa e pela Igreja, ao falecer de leucemia aos 15 anos.</p>
                    </div>
                    <div className="bg-gradient-to-r from-primary/30 to-surface-dark/50 backdrop-blur-md border-l-4 border-brand-red p-6 md:p-8 rounded-r-2xl shadow-inner text-left">
                      <h4 className="text-xl md:text-2xl font-bold text-white mb-3 flex items-center gap-2">
                        <HeartHandshake className="w-6 h-6 text-brand-red" /> O Milagre no Brasil
                      </h4>
                      <p className="text-sm md:text-base text-gray-300 leading-relaxed">Em 2013, em Campo Grande (MS), o menino Mattheus, que sofria de uma grave anomalia congênita no pâncreas, tocou numa relíquia de Carlo e pediu com fé: "Parar de vomitar". Ele foi completamente curado, num fato atestado pelo Vaticano como inexplicável.</p>
                    </div>
                  </div>
                </div>
              )}

              {/* SLIDE 2: SITE DOS MILAGRES */}
              {activeSlide === 2 && (
                <div className="flex flex-col lg:flex-row h-full items-center justify-center gap-10 md:gap-16 w-full">
                  <div className="w-full lg:w-[55%] text-center lg:text-left relative z-10">
                    <h3 className="text-gold font-bold tracking-widest uppercase mb-3 text-sm md:text-base flex items-center justify-center lg:justify-start gap-2">
                      <Search className="w-5 h-5" /> Fé, pesquisa e tecnologia
                    </h3>
                    <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">O site criado para evangelizar</h2>
                    <div className="space-y-4 text-gray-300 text-base md:text-lg leading-relaxed mb-8">
                      <p>Carlo se perguntava por que tantas pessoas faziam filas imensas para shows, mas não demonstravam o mesmo entusiasmo para encontrar Jesus na Eucaristia.</p>
                      <p>Para despertar a fé, ele pesquisou e reuniu fotografias, documentos e relatos históricos. Transformou todo esse rico conteúdo em uma grande exposição acessível mundialmente pela internet.</p>
                    </div>
                    
                    <div className="flex flex-row justify-center lg:justify-start gap-8 border-t border-white/10 pt-6 mb-10">
                      <div className="text-center lg:text-left">
                        <strong className="block text-4xl md:text-5xl font-bold text-gold mb-1">136</strong>
                        <span className="text-xs md:text-sm text-gray-400 uppercase tracking-wider font-bold">Milagres Catalogados</span>
                      </div>
                      <div className="w-px bg-white/10 h-16"></div>
                      <div className="text-center lg:text-left">
                        <strong className="block text-4xl md:text-5xl font-bold text-gold mb-1">5</strong>
                        <span className="text-xs md:text-sm text-gray-400 uppercase tracking-wider font-bold">Continentes Alcançados</span>
                      </div>
                    </div>

                    <a href="https://www.miracolieucaristici.org/pr/Liste/list.html" target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-3 bg-white text-surface-dark hover:bg-gold hover:text-black font-bold text-lg py-4 px-8 rounded-full transition-all hover:scale-105 shadow-[0_10px_30px_rgba(255,255,255,0.15)]">
                      Visitar Exposição Virtual <ExternalLink className="w-5 h-5" />
                    </a>
                  </div>
                  <div className="w-full lg:w-[45%] flex justify-center lg:justify-start relative">
                     <div className="absolute inset-0 bg-primary/20 blur-[80px] rounded-full"></div>
                     <img src={img2} alt="Site Milagres Eucarísticos" className="w-full max-w-[320px] md:max-w-md rounded-3xl object-cover shadow-[0_20px_50px_rgba(0,0,0,0.5)] border border-white/10 relative z-10 rotate-[3deg] hover:rotate-0 transition-transform duration-700" />
                  </div>
                </div>
              )}

              {/* SLIDE 3: QUIZ */}
              {activeSlide === 3 && (
                <div className="flex flex-col h-full items-center justify-center w-full relative">
                  {/* Fundo de Imagem Espalhada (img3) */}
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-20">
                    <img src={img3} alt="Background Quiz" className="w-full h-full object-cover rounded-3xl mask-image-linear" style={{ maskImage: 'radial-gradient(ellipse at center, black 10%, transparent 70%)', WebkitMaskImage: 'radial-gradient(ellipse at center, black 10%, transparent 70%)' }} />
                  </div>

                  <motion.div 
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.2, duration: 0.6 }}
                    className="bg-gradient-to-br from-[#3b0505]/95 via-brand-red/90 to-black/95 backdrop-blur-2xl border border-brand-red/40 rounded-[2.5rem] md:rounded-[3.5rem] p-8 md:p-16 text-center shadow-[0_30px_70px_rgba(179,0,0,0.5)] relative z-20 max-w-4xl w-full"
                  >
                    <div className="w-20 h-20 bg-gold text-surface-dark rounded-full flex items-center justify-center mx-auto mb-8 shadow-[0_0_40px_rgba(212,175,55,0.6)]">
                      <Sparkles className="w-10 h-10" />
                    </div>
                    <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">Você conhece bem o nosso padroeiro?</h2>
                    <p className="text-gray-200 text-lg md:text-xl mb-12 max-w-2xl mx-auto leading-relaxed">
                      Preparamos um mini game divertido de perguntas e respostas sobre a vida de São Carlo Acutis. Mostre o que sabe e alcance a pontuação máxima!
                    </p>
                    <Link to="/quiz" className="inline-flex items-center justify-center gap-3 bg-gold hover:bg-yellow-500 text-black font-bold text-xl py-5 px-12 rounded-full shadow-[0_15px_40px_rgba(212,175,55,0.4)] transition-all hover:scale-105 hover:-translate-y-1">
                      Jogar Agora <ExternalLink className="w-6 h-6" />
                    </Link>
                  </motion.div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Controls - Navigation */}
        <div className="mt-8 flex items-center justify-between z-20 relative">
          <button 
            onClick={prevSlide}
            className="w-12 h-12 md:w-14 md:h-14 flex items-center justify-center rounded-full bg-white/5 border border-white/10 text-white hover:bg-gold hover:text-black hover:border-gold transition-all backdrop-blur-md"
            aria-label="Slide anterior"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          <div className="flex gap-3 items-center">
            {Array.from({ length: SLIDE_COUNT }).map((_, idx) => (
              <button
                key={idx}
                onClick={() => goToSlide(idx)}
                className={`transition-all duration-500 rounded-full ${
                  activeSlide === idx 
                    ? 'w-10 h-3 bg-gold shadow-[0_0_10px_rgba(212,175,55,0.8)]' 
                    : 'w-3 h-3 bg-white/30 hover:bg-white/60'
                }`}
                aria-label={`Ir para slide ${idx + 1}`}
              />
            ))}
          </div>

          <button 
            onClick={nextSlide}
            className="w-12 h-12 md:w-14 md:h-14 flex items-center justify-center rounded-full bg-white/5 border border-white/10 text-white hover:bg-gold hover:text-black hover:border-gold transition-all backdrop-blur-md"
            aria-label="Próximo slide"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>
      </div>
    </section>
  );
}
