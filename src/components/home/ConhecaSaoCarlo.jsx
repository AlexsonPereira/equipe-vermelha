import React, { useEffect, useRef, useState } from 'react';
import { animate, motion, useInView, useReducedMotion } from 'framer-motion';
import { Church, ExternalLink, Flame, HeartHandshake, Smartphone } from 'lucide-react';
import fotoCarlo from '../../assets/images.jpg';
import fotoSite from '../../assets/images (1).jpg';

const PILARES = [
  { Icone: Church, titulo: 'A Eucaristia', texto: 'Sua "rodovia para o Céu". Participava da missa diariamente, encontrando em Cristo a força.' },
  { Icone: Smartphone, titulo: 'Evangelização digital', texto: 'Usou seu talento com computadores para criar um site catalogando milagres eucarísticos.' },
  { Icone: Flame, titulo: 'Santidade cotidiana', texto: 'Um jovem comum que amava videogame, os amigos e ajudar os necessitados.' },
];

function NumeroQueSobe({ valor }) {
  const caixa = useRef(null);
  const visivel = useInView(caixa, { once: true, margin: '-40px' });
  const reduzir = useReducedMotion();
  const [atual, setAtual] = useState(0);

  useEffect(() => {
    if (!visivel || reduzir) return undefined;
    const controle = animate(0, valor, { duration: 1.6, ease: 'easeOut', onUpdate: (v) => setAtual(Math.round(v)) });
    return () => controle.stop();
  }, [visivel, reduzir, valor]);

  return <strong ref={caixa} className="block text-5xl font-bold text-gold tabular-nums">{reduzir ? valor : atual}</strong>;
}

const aoRolar = (atraso = 0) => ({
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-60px' },
  transition: { duration: 0.6, delay: atraso },
});

// Substitui o antigo slider: o mesmo conteúdo, visível só rolando a página.
export default function ConhecaSaoCarlo() {
  return (
    <section id="sao-carlo" className="py-20 px-4 sm:px-6 bg-gradient-to-b from-primary/10 via-surface-dark to-surface-dark overflow-hidden">
      <div className="max-w-5xl mx-auto flex flex-col gap-8">
        <motion.div {...aoRolar()} className="text-center">
          <p className="text-gold font-bold tracking-widest uppercase text-sm mb-2">Nosso padroeiro</p>
          <h2 className="text-4xl md:text-6xl font-bold text-white">São Carlo Acutis</h2>
          <p className="text-gray-300 max-w-2xl mx-auto mt-3 text-lg">
            O "padroeiro da internet" nos ensina que a santidade é para todos, de calça jeans e tênis, usando a tecnologia para evangelizar.
          </p>
        </motion.div>

        <motion.article {...aoRolar(0.1)} className="grid md:grid-cols-2 gap-6 items-center bg-black/40 border border-white/10 rounded-3xl overflow-hidden">
          <div className="relative h-72 md:h-full min-h-[18rem]">
            {/* Foto vertical com o rosto no terço de cima: o recorte parte do alto para não cortar a cabeça. */}
            <img src={fotoCarlo} alt="São Carlo Acutis" loading="lazy" className="absolute inset-0 w-full h-full object-cover object-[50%_20%]" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent md:bg-gradient-to-r" />
          </div>
          <div className="p-6 md:pr-8 flex flex-col gap-3">
            <p className="text-gold font-bold uppercase tracking-widest text-xs flex items-center gap-2"><Flame className="w-4 h-4" /> História</p>
            <h3 className="text-3xl font-bold text-white">O jovem de calça jeans</h3>
            <p className="text-gray-300">
              Nascido em Londres e criado em Milão, Carlo era um adolescente que gostava de videogame e de sair com os amigos.
              Mas seu amor pela Eucaristia era sua verdadeira "rodovia para o Céu".
            </p>
            <p className="text-gray-300">
              Usou a internet para evangelizar e ofereceu seus sofrimentos por Cristo, pelo Papa e pela Igreja, ao falecer de leucemia aos 15 anos.
            </p>
          </div>
        </motion.article>

        <div className="grid gap-4 md:grid-cols-3">
          {PILARES.map(({ Icone, titulo, texto }, indice) => (
            <motion.div
              key={titulo}
              {...aoRolar(indice * 0.12)}
              whileHover={{ y: -6 }}
              className="bg-black/40 border border-white/10 hover:border-gold/50 rounded-3xl p-6 text-center transition-colors"
            >
              <motion.span
                whileInView={{ rotate: [0, -12, 12, 0] }}
                viewport={{ once: true }}
                transition={{ delay: 0.4 + indice * 0.12, duration: 0.6 }}
                className="w-14 h-14 mx-auto mb-4 rounded-full bg-gold/10 text-gold flex items-center justify-center"
              >
                <Icone className="w-7 h-7" />
              </motion.span>
              <h4 className="text-xl font-bold text-white mb-2">{titulo}</h4>
              <p className="text-gray-400">{texto}</p>
            </motion.div>
          ))}
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <motion.div {...aoRolar()} className="bg-brand-red/10 border border-brand-red/30 rounded-3xl p-6">
            <h4 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
              <HeartHandshake className="w-5 h-5 text-brand-red" /> O milagre no Brasil
            </h4>
            <p className="text-gray-300">
              Em 2013, em Campo Grande (MS), o menino Mattheus, que tinha uma grave anomalia no pâncreas, tocou uma relíquia de Carlo
              e pediu com fé: "parar de vomitar". Foi completamente curado, num fato reconhecido pelo Vaticano como inexplicável.
            </p>
          </motion.div>

          <motion.a
            {...aoRolar(0.1)}
            href="https://www.miracolieucaristici.org/pr/Liste/list.html"
            target="_blank"
            rel="noopener noreferrer"
            className="group relative overflow-hidden bg-black/40 border border-white/10 hover:border-gold/50 rounded-3xl p-6 flex flex-col gap-4"
          >
            <img src={fotoSite} alt="" aria-hidden="true" loading="lazy" className="absolute inset-0 w-full h-full object-cover opacity-15 group-hover:opacity-25 transition-opacity" />
            <div className="relative grid grid-cols-2 gap-4 text-center">
              <div>
                <NumeroQueSobe valor={136} />
                <span className="text-xs uppercase tracking-wider text-gray-300">milagres catalogados</span>
              </div>
              <div>
                <NumeroQueSobe valor={5} />
                <span className="text-xs uppercase tracking-wider text-gray-300">continentes</span>
              </div>
            </div>
            <p className="relative text-gray-200 text-sm">
              Carlo reuniu fotos, documentos e relatos dos milagres eucarísticos numa exposição que hoje está no mundo todo.
            </p>
            <span className="relative inline-flex items-center gap-2 text-gold font-bold text-sm">
              Ver a exposição <ExternalLink className="w-4 h-4" />
            </span>
          </motion.a>
        </div>
      </div>
    </section>
  );
}
