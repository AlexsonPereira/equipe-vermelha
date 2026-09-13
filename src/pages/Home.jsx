import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Crown, HeartHandshake, Copy, Check, Church, Flame, Smartphone, Quote, Ticket, ChevronLeft, ChevronRight, Globe2, ExternalLink, Search, MessageCircle, Package, ShieldCheck, Utensils, Sparkles, ShoppingBasket, MapPin, Clock } from 'lucide-react';

const InstagramIcon = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5"></rect>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"></line>
  </svg>
);
import { Link } from 'react-router-dom';
import img1 from '../assets/images.jpg';
import img2 from '../assets/images (1).jpg';
import img3 from '../assets/images (2).jpg';

const copyToClipboard = (text) => {
  navigator.clipboard.writeText(text);
};

export default function Home() {
  const [copied, setCopied] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const carloImages = [
    img1,
    img2,
    img3,
  ];

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % carloImages.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + carloImages.length) % carloImages.length);
  };

  const handleCopyPix = () => {
    copyToClipboard('00020126360014br.gov.bcb.pix0114+55779982336765204000053039865802BR5901N6001C62180514Equipevermelha6304C73600020126360014br.gov.bcb.pix0114+55779982336765204000053039865802BR5901N6001C62180514Equipevermelha6304C736'); // Substitua pela chave real
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  return (
    <div className="min-h-screen bg-surface-dark text-text-light font-sans selection:bg-brand-red selection:text-white">


      {/* Botão flutuante de doação */}
      <motion.div
        initial={{ opacity: 0, x: 40 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, delay: 1 }}
        className="fixed right-3 bottom-5 md:right-0 md:bottom-auto md:top-1/2 md:-translate-y-1/2 z-50"
      >
        <a
          href="#doacoes"
          aria-label="Fazer uma doação"
          className="group flex items-center gap-3 bg-brand-red hover:bg-red-700 text-white font-bold py-3 px-5 md:py-5 md:px-3 rounded-full md:rounded-l-2xl md:rounded-r-none shadow-[0_8px_30px_rgba(179,0,0,0.55)] border border-white/20 md:border-r-0 transition-all hover:pr-6 md:hover:pr-4"
        >
          <span className="relative flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/15">
            <span className="absolute inset-0 rounded-full bg-white/20 animate-ping"></span>
            <HeartHandshake className="relative w-5 h-5" />
          </span>
          <span className="leading-tight md:[writing-mode:vertical-rl] md:rotate-180">
            Doe agora
          </span>
        </a>
      </motion.div>

      {/* 1. Hero Section */}
      <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden pt-20 pb-16 px-4">
        {/* Animated Background Circles */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 100, repeat: Infinity, ease: "linear" }}
          className="absolute inset-0 flex items-center justify-center opacity-30 pointer-events-none"
        >
          <div className="w-[80vw] h-[80vw] sm:w-[60vw] sm:h-[60vw] max-w-[800px] max-h-[800px] rounded-full border-[1px] border-brand-red border-dashed"></div>
          <div className="absolute w-[60vw] h-[60vw] sm:w-[45vw] sm:h-[45vw] max-w-[600px] max-h-[600px] rounded-full border-[2px] border-primary"></div>
          <div className="absolute w-[40vw] h-[40vw] sm:w-[30vw] sm:h-[30vw] max-w-[400px] max-h-[400px] rounded-full border-[1px] border-gold border-opacity-50"></div>
        </motion.div>

        <div className="relative z-10 flex flex-col items-center text-center w-full max-w-4xl mx-auto">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-gold tracking-[0.3em] text-xs sm:text-sm md:text-base font-bold uppercase mb-8"
          >
            FÉ • CORAGEM • MISSÃO
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="flex flex-col items-center"
          >
            <Crown className="text-gold w-10 h-10 md:w-12 md:h-12 mb-2" />
            <h2 className="text-2xl sm:text-3xl md:text-5xl font-bold tracking-[0.2em] uppercase text-white -mb-3 z-10">
              Equipe
            </h2>
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
            <p className="font-cursive text-3xl text-gold max-w-[200px] leading-snug">
              "Jovens que amam, servem e anunciam"
            </p>
          </motion.div>

          {/* Carlo Acutis Figure */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.4 }}
            className="mt-8 relative w-64 h-64 sm:w-72 sm:h-72 md:w-96 md:h-96 mx-auto"
          >
            {/* White cross-like stroke behind */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-12 md:h-16 bg-white opacity-90 blur-[2px] rotate-[-5deg] rounded-full z-0"></div>
            <div className="absolute inset-0 bg-primary/40 rounded-full blur-2xl -z-10"></div>

            <div className="relative z-10 w-full h-full rounded-full border-4 border-gold shadow-[0_0_30px_rgba(212,175,55,0.4)] overflow-hidden bg-surface-dark flex items-center justify-center">
              <img
                src="/logo-equipe.jpg"
                alt="Equipe Vermelha - São Carlo Acutis"
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.nextSibling.style.display = 'block';
                }}
              />
              <span className="hidden text-white/50 text-xs sm:text-sm p-4 text-center">
                Salve a imagem como<br /><b>logo-equipe.jpg</b><br />na pasta public/
              </span>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="mt-12 flex flex-col sm:flex-row gap-4 w-full justify-center px-4 flex-wrap"
          >
            <a href="#doacoes" className="bg-brand-red hover:bg-red-700 text-white font-bold py-3 sm:py-4 px-6 sm:px-8 rounded-full shadow-[0_0_20px_rgba(179,0,0,0.4)] transition-all flex items-center justify-center gap-2">
              <HeartHandshake className="w-5 h-5" />
              Doar Agora
            </a>
            <Link to="/tickets" className="bg-gold hover:bg-yellow-500 text-surface-dark font-bold py-3 sm:py-4 px-6 sm:px-8 rounded-full shadow-[0_0_20px_rgba(212,175,55,0.4)] transition-all flex items-center justify-center gap-2">
              <Ticket className="w-5 h-5" />
              Comprar Rifa
            </Link>
            <a href="#sobre" className="bg-transparent border-2 border-gold text-gold hover:bg-gold hover:text-surface-dark font-bold py-3 sm:py-4 px-6 sm:px-8 rounded-full transition-all flex items-center justify-center gap-2">
              <Flame className="w-5 h-5" />
              Conheça Nossa Causa
            </a>
          </motion.div>
        </div>
      </section>

      {/* 2. Sobre o MAC */}
      <section id="sobre" className="py-24 px-6 bg-gradient-to-b from-surface-dark to-primary/20">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
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
            <div className="flex-1 w-full max-w-sm relative">
              <div className="aspect-square rounded-2xl border border-gold/30 p-8 flex items-center justify-center bg-primary/10 backdrop-blur-sm">
                <Quote className="w-20 h-20 text-brand-red opacity-30 absolute top-4 left-4" />
                <p className="font-cursive text-2xl md:text-3xl text-center text-white relative z-10 leading-relaxed">
                  "A tristeza é olhar para si mesmo, a alegria é olhar para Deus."
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* 3. Padroeiro: São Carlo Acutis */}
      <section className="py-24 px-6 bg-primary/10 relative overflow-hidden">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h3 className="text-gold font-bold tracking-widest uppercase mb-2 text-sm">Nosso Padroeiro</h3>
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">São Carlo Acutis</h2>
            <p className="text-gray-400 max-w-2xl mx-auto text-base md:text-lg">
              O "Padroeiro da Internet" nos ensina que a santidade é para todos, vestindo jeans e tênis, e usando a tecnologia para evangelizar.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: "A Eucaristia",
                desc: "Sua 'rodovia para o céu'. Participava da missa diariamente, encontrando em Cristo a força para sua jornada.",
                icon: <Church className="w-8 h-8" />
              },
              {
                title: "Evangelização Digital",
                desc: "Usou seu talento com computadores para criar um site catalogando milagres eucarísticos pelo mundo.",
                icon: <Smartphone className="w-8 h-8" />
              },
              {
                title: "Santidade Cotidiana",
                desc: "Um jovem comum que amava videogame, brincar com os amigos e ajudar os mais necessitados com sua mesada.",
                icon: <Flame className="w-8 h-8" />
              }
            ].map((pilar, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.2 }}
                whileHover={{ scale: 1.03 }}
                className="bg-surface-dark border border-gold/20 p-8 rounded-2xl hover:border-gold hover:shadow-[0_0_15px_rgba(212,175,55,0.3)] transition-colors group relative overflow-hidden flex flex-col"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-brand-red rounded-bl-full opacity-5 group-hover:opacity-10 transition-opacity"></div>
                <div className="text-gold mb-6 bg-gold/10 w-16 h-16 rounded-full flex items-center justify-center shrink-0">
                  {pilar.icon}
                </div>
                <h4 className="text-xl font-bold text-white mb-3 relative z-10">{pilar.title}</h4>
                <p className="text-gray-400 leading-relaxed relative z-10">
                  {pilar.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>


      {/* 3b. História e Milagre no Brasil */}
      <section className="py-24 px-6 bg-gradient-to-t from-surface-dark to-primary/10 relative overflow-hidden">
        <div className="max-w-6xl mx-auto flex flex-col lg:flex-row gap-16 items-center">

          {/* Carousel */}
          <div className="w-full lg:w-1/2">
            <div className="relative aspect-[4/5] md:aspect-video lg:aspect-[4/5] rounded-3xl overflow-hidden shadow-[0_0_40px_rgba(212,175,55,0.2)] border border-gold/30 group">
              <AnimatePresence mode='wait'>
                <motion.img
                  key={currentImageIndex}
                  src={carloImages[currentImageIndex]}
                  alt={`São Carlo Acutis ${currentImageIndex + 1}`}
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -50 }}
                  transition={{ duration: 0.5 }}
                  className="w-full h-full object-cover"
                />
              </AnimatePresence>

              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-center pb-6">
                <div className="flex gap-2">
                  {carloImages.map((_, idx) => (
                    <div key={idx} className={`w-2 h-2 rounded-full transition-all ${idx === currentImageIndex ? 'bg-gold w-6' : 'bg-white/50'}`} />
                  ))}
                </div>
              </div>

              <button
                onClick={prevImage}
                className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-gold text-white hover:text-black p-3 rounded-full backdrop-blur-sm transition-all opacity-0 group-hover:opacity-100"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <button
                onClick={nextImage}
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-gold text-white hover:text-black p-3 rounded-full backdrop-blur-sm transition-all opacity-0 group-hover:opacity-100"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </div>
          </div>

          {/* História e Milagre Text */}
          <div className="w-full lg:w-1/2">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <h3 className="text-gold font-bold tracking-widest uppercase mb-2 text-sm flex items-center gap-2">
                <Flame className="w-5 h-5" />
                História e Milagre
              </h3>
              <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">O Jovem de Calça Jeans</h2>

              <div className="space-y-6 text-gray-300 text-base md:text-lg leading-relaxed">
                <p>
                  Nascido em Londres em 1991 e criado em Milão, Carlo era um adolescente como qualquer outro de sua geração: gostava de jogar videogame, gravar vídeos e sair com os amigos. Porém, o que o tornava especial era o seu profundo e inabalável amor pela Eucaristia, a qual ele carinhosamente chamava de sua "rodovia para o Céu".
                </p>
                <p>
                  Com um talento impressionante para a informática, Carlo utilizou a internet como uma poderosa ferramenta de evangelização, criando exposições virtuais e catalogando milagres eucarísticos pelo mundo. Ele faleceu em 2006, aos 15 anos, vítima de uma grave leucemia, oferecendo todos os seus sofrimentos por Cristo, pelo Papa e pela Igreja.
                </p>

                <div className="bg-primary/20 border-l-4 border-brand-red p-6 rounded-r-2xl mt-8 shadow-inner">
                  <h4 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
                    <HeartHandshake className="w-6 h-6 text-brand-red" />
                    O Milagre no Brasil
                  </h4>
                  <p className="text-sm md:text-base">
                    A beatificação de Carlo Acutis ocorreu graças a um lindo milagre no Brasil, na cidade de <strong>Campo Grande (MS)</strong>, no ano de 2013. Um menino chamado Mattheus sofria de uma grave anomalia congênita no pâncreas e não conseguia reter alimentos no estômago, correndo sério risco de vida.
                    <br /><br />
                    Durante uma bênção com uma relíquia de Carlo (um pedaço de sua camiseta), Mattheus tocou nela e pediu com fé: <em>"Parar de vomitar"</em>. Imediatamente após a oração, a criança foi completamente curada e voltou a se alimentar normalmente, fato comprovado pela junta médica do Vaticano como inexplicável.
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>


      {/* 3c. O site dos Milagres Eucarísticos */}
      <section className="py-24 px-6 bg-gradient-to-b from-surface-dark via-primary/10 to-surface-dark relative overflow-hidden">
        <div className="absolute -top-24 -left-24 w-72 h-72 bg-gold/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute -bottom-32 -right-20 w-80 h-80 bg-brand-red/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="max-w-6xl mx-auto relative z-10">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-80px" }} transition={{ duration: 0.8 }} className="grid lg:grid-cols-[0.9fr_1.1fr] gap-10 lg:gap-16 items-center">
            <div className="bg-surface-dark border border-gold/30 rounded-3xl p-8 md:p-10 shadow-[0_0_35px_rgba(212,175,55,0.12)]">
              <div className="w-16 h-16 rounded-2xl bg-gold/10 text-gold flex items-center justify-center mb-8"><Globe2 className="w-9 h-9" /></div>
              <p className="font-cursive text-2xl md:text-3xl text-white leading-relaxed mb-8">“A internet também pode ser uma estrada que conduz as pessoas ao encontro com Jesus.”</p>
              <div className="grid grid-cols-2 gap-4 border-t border-white/10 pt-8">
                <div><strong className="block text-3xl md:text-4xl text-gold mb-1">136</strong><span className="text-sm text-gray-400">milagres apresentados</span></div>
                <div><strong className="block text-3xl md:text-4xl text-gold mb-1">5</strong><span className="text-sm text-gray-400">continentes alcançados</span></div>
              </div>
            </div>
            <div>
              <h3 className="text-gold font-bold tracking-widest uppercase mb-2 text-sm flex items-center gap-2"><Search className="w-5 h-5" />Fé, pesquisa e tecnologia</h3>
              <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">O site que Carlo criou para evangelizar</h2>
              <div className="space-y-5 text-gray-300 text-base md:text-lg leading-relaxed">
                <p>Carlo Acutis se perguntava por que tantas pessoas faziam longas filas para shows e outros eventos, mas não demonstravam o mesmo entusiasmo para encontrar Jesus na Eucaristia. Para ele, isso acontecia porque muitos ainda não conheciam a grandeza desse sacramento.</p>
                <p>Movido por esse desejo de despertar a fé, Carlo começou a pesquisar os milagres eucarísticos reconhecidos pela Igreja. Durante cerca de dois anos e meio, com a ajuda de sua família, reuniu fotografias, documentos e relatos históricos e transformou esse conteúdo em uma exposição acessível também pela internet.</p>
                <p>O propósito era simples e profundo: usar a tecnologia como instrumento de evangelização, mostrar que a presença de Cristo na Eucaristia é uma realidade viva e ajudar outras pessoas a se aproximarem de Deus. O projeto apresenta aproximadamente 136 milagres em 166 painéis e permite visitar virtualmente lugares de diversos países.</p>
              </div>
              <a href="https://www.miracolieucaristici.org/pr/Liste/list.html" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 mt-8 bg-gold hover:bg-yellow-500 text-surface-dark font-bold py-4 px-7 rounded-full transition-all hover:scale-105 shadow-[0_0_20px_rgba(212,175,55,0.25)]">
                Conhecer os Milagres Eucarísticos <ExternalLink className="w-5 h-5" />
              </a>
            </div>
          </motion.div>
        </div>
      </section>



      {/* 4. Nossa Rifa */}
      <section id="rifa" className="py-24 px-6 bg-gradient-to-b from-primary/10 to-surface-dark relative overflow-hidden">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="bg-surface-dark border border-brand-red/50 p-8 md:p-12 rounded-3xl shadow-[0_0_30px_rgba(179,0,0,0.3)] relative overflow-hidden flex flex-col md:flex-row items-center gap-8 md:gap-12"
          >
            <div className="absolute -top-24 -right-24 w-64 h-64 bg-brand-red/10 rounded-full blur-3xl pointer-events-none"></div>
            <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-gold/10 rounded-full blur-3xl pointer-events-none"></div>

            <div className="w-full md:w-1/2 flex justify-center relative z-10">
              <div className="relative w-64 h-64 md:w-80 md:h-80">
                <div className="absolute inset-0 bg-brand-red/20 rounded-full blur-2xl"></div>
                <img
                  src="https://www.sabornamesa.com.br/images/review-produtos/airfryer/mondial/air-fryer-grand-family-mondial-AF-55i.png"
                  alt="Air Fryer Mondial"
                  className="w-full h-full object-contain relative z-10 drop-shadow-[0_10px_20px_rgba(0,0,0,0.5)]"
                />
              </div>
            </div>

            <div className="w-full md:w-1/2 text-center md:text-left relative z-10">
              <h3 className="text-gold font-bold tracking-widest uppercase mb-2 text-sm">Grande Sorteio</h3>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6">Concorra a uma Air Fryer!</h2>

              <p className="text-gray-300 text-base md:text-lg mb-8 leading-relaxed">
                Participe da nossa rifa e concorra a uma incrível Air Fryer! Além de ter a chance de ganhar esse super prêmio, você ajuda a Equipe Vermelha na gincana e colabora com nossas ações solidárias. Não fique de fora dessa!
              </p>

              <Link to="/tickets" className="inline-flex items-center gap-2 bg-brand-red hover:bg-red-700 text-white font-bold py-4 px-8 rounded-full shadow-[0_0_20px_rgba(179,0,0,0.4)] transition-all hover:scale-105">
                <Ticket className="w-5 h-5" />
                Comprar Meu Bilhete
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* 5. Central de Doações */}
      <section id="doacoes" className="py-28 md:py-36 px-4 sm:px-6 bg-surface-dark relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[500px] bg-brand-red/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="max-w-6xl mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-4xl mx-auto mb-16 md:mb-20"
          >
            <span className="inline-flex items-center gap-2 bg-brand-red/15 border border-brand-red/40 text-red-300 font-bold uppercase tracking-[0.2em] text-xs px-5 py-2.5 rounded-full mb-7">
              <HeartHandshake className="w-4 h-4" />
              Sua ajuda é urgente
            </span>
            <h2 className="font-marker text-4xl sm:text-5xl md:text-7xl text-brand-red mb-7">Faça parte desta missão</h2>
            <p className="text-gray-200 text-lg md:text-2xl leading-relaxed">
              Cada contribuição ajuda a <strong className="text-white">Equipe Vermelha</strong> e se transforma em cuidado concreto. Doe pelo PIX ou contribua com produtos e utensílios.
              O valor pode parecer pequeno para você, mas, somado ao de outras pessoas, faz uma diferença enorme.
            </p>
          </motion.div>

          {/* PIX em destaque */}
          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="bg-gradient-to-br from-[#4a0505] via-[#290303] to-black border border-gold/35 rounded-[2rem] p-7 sm:p-10 md:p-14 shadow-[0_25px_70px_rgba(0,0,0,0.5)] mb-12 md:mb-16 relative overflow-hidden"
          >
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-brand-red via-gold to-brand-red"></div>
            <div className="grid min-w-0 grid-cols-1 lg:grid-cols-[minmax(0,1fr)_auto] gap-10 md:gap-14 items-center">
              <div className="min-w-0">
                <p className="text-gold font-bold tracking-widest uppercase text-sm mb-4">A forma mais rápida de ajudar</p>
                <h3 className="text-3xl md:text-5xl font-bold text-white mb-6">Doe agora pelo PIX</h3>
                <p className="text-gray-300 text-base md:text-lg leading-relaxed mb-8 max-w-2xl">
                  Sua doação financeira nos permite adquirir exatamente aquilo que estiver faltando. Não existe valor mínimo:
                  toda contribuição representa um gesto de solidariedade e nos aproxima da nossa meta.
                </p>

                <button
                  onClick={handleCopyPix}
                  className="w-full min-w-0 max-w-2xl overflow-hidden bg-white/5 hover:bg-white/10 border border-gold/40 hover:border-gold rounded-2xl p-4 sm:p-5 text-left transition-all group"
                >
                  <span className="block text-xs text-gold uppercase tracking-wider font-bold mb-2">PIX copia e cola</span>
                  <span className="flex min-w-0 items-center justify-between gap-4">
                    <span className="block min-w-0 flex-1 truncate text-gray-200 font-mono text-sm select-all">
                      00020126360014br.gov.bcb.pix0114+55779982336765204000053039865802BR5901N6001C62180514Equipevermelha6304C736
                    </span>
                    <span className="shrink-0 bg-gold text-surface-dark w-11 h-11 rounded-xl flex items-center justify-center">
                      {copied ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5 group-hover:scale-110 transition-transform" />}
                    </span>
                  </span>
                </button>

                <AnimatePresence>
                  {copied && (
                    <motion.p
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className="text-green-400 font-bold mt-3 flex items-center gap-2"
                    >
                      <Check className="w-4 h-4" /> Código PIX copiado!
                    </motion.p>
                  )}
                </AnimatePresence>
              </div>

              <div className="w-full max-w-[17rem] mx-auto bg-white p-4 sm:p-5 rounded-3xl shadow-[0_0_35px_rgba(212,175,55,0.25)]">
                <img src="/qrcode.PNG" alt="QR Code para doação via PIX" className="w-full aspect-square object-contain" />
              </div>
            </div>
          </motion.div>

          {/* Formas de contribuir */}
          <div className="mb-12 md:mb-16">
            <div className="text-center mb-10">
              <h3 className="text-2xl md:text-4xl font-bold text-white mb-3">Você também pode doar itens</h3>
              <p className="text-gray-400 text-base md:text-lg">Escolha uma categoria e fale conosco para combinar a entrega.</p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                {
                  icon: <ShoppingBasket className="w-7 h-7" />,
                  title: 'Alimentos não perecíveis',
                  highlight: '3 pontos por unidade',
                  items: ['Arroz e feijão', 'Macarrão e farinha', 'Óleo de cozinha', 'Açúcar, sal e café']
                },
                {
                  icon: <Sparkles className="w-7 h-7" />,
                  title: 'Limpeza',
                  highlight: '4 pontos por unidade',
                  items: ['Água sanitária', 'Sabão em pó', 'Detergente', 'Desinfetante e outros']
                },
                {
                  icon: <Package className="w-7 h-7" />,
                  title: 'Higiene pessoal',
                  highlight: '2 pontos por unidade',
                  items: ['Sabonete', 'Creme dental', 'Papel higiênico', 'Outros itens de higiene']
                },
                {
                  icon: <Utensils className="w-7 h-7" />,
                  title: 'Cozinha e utensílios',
                  highlight: 'Itens coringas',
                  items: ['Copos, pratos e bandejas', 'Panelas e escorredores', 'Talheres e utensílios para servir', 'Itens para cozinha industrial']
                }
              ].map((category, idx) => (
                <motion.div
                  key={category.title}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: idx * 0.12 }}
                  className="bg-white/[0.035] border border-white/10 hover:border-gold/40 rounded-3xl p-7 md:p-8 transition-colors"
                >
                  <div className="w-14 h-14 bg-gold/10 text-gold rounded-2xl flex items-center justify-center mb-6">{category.icon}</div>
                  <h4 className="text-xl font-bold text-white mb-2">{category.title}</h4>
                  <ul className="space-y-3 text-gray-400">
                    {category.items.map((item) => (
                      <li key={item} className="flex gap-3">
                        <Check className="w-4 h-4 text-gold shrink-0 mt-1" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </motion.div>
              ))}
            </div>
          </div>

          <div className="grid lg:grid-cols-[1fr_auto] gap-8 items-center bg-gold/10 border border-gold/25 rounded-3xl p-7 md:p-10">
            <div className="flex flex-col sm:flex-row gap-5">
              <ShieldCheck className="text-gold w-11 h-11 shrink-0" />
              <div>
                <h3 className="text-xl md:text-2xl font-bold text-white mb-3">Atenção às condições dos produtos</h3>
                <p className="text-gray-300 leading-relaxed">
                  Os itens devem estar <strong>lacrados, dentro do prazo de validade e em boas condições de uso</strong>.
                  Produtos vencidos, abertos, danificados ou impróprios não poderão ser contabilizados.
                </p>
              </div>
            </div>

            <a
              href="https://wa.me/5577998233676?text=Ol%C3%A1%21%20Quero%20ajudar%20a%20Equipe%20Vermelha%20com%20uma%20doa%C3%A7%C3%A3o.%20Como%20posso%20entregar%3F"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-3 bg-green-600 hover:bg-green-500 text-white font-bold py-4 px-7 rounded-full transition-all hover:scale-105 shadow-[0_10px_30px_rgba(22,163,74,0.25)] whitespace-nowrap"
            >
              <MessageCircle className="w-6 h-6" />
              Falar no WhatsApp
            </a>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className='grid overflow-hidden rounded-3xl border border-white/10 bg-white/[0.035] lg:grid-cols-[minmax(0,1.6fr)_minmax(300px,0.7fr)] mt-12 lg:mt-16'
          >
            <iframe
              src='https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3867.4365001332685!2d-42.781689!3d-14.2277404!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x75ac59cee209b33%3A0x412da737d2058d2d!2sSecret%C3%A1ria%20Paroquial%20de%20Sto%C2%B0%20Ant%C3%B4nio!5e0!3m2!1spt-BR!2sbr!4v1789148941232!5m2!1spt-BR!2sbr'
              width='600'
              height='450'
              style={{ border: 0 }}
              allowFullScreen
              loading='lazy'
              referrerPolicy='strict-origin-when-cross-origin'
              title='Mapa da Secretária Paroquial de Santo Antônio'
              className='block h-[360px] w-full md:h-[450px] lg:h-full lg:min-h-[450px]'
            />

            <div className='flex flex-col justify-center p-7 md:p-10'>
              <div className='mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-gold/10 text-gold'>
                <MapPin className='h-7 w-7' />
              </div>
              <p className='mb-2 text-sm font-bold uppercase tracking-[0.2em] text-gold'>Local de entrega</p>
              <h3 className='mb-7 text-2xl font-bold leading-tight text-white md:text-3xl'>
                Secretária Paroquial de Sto° Antônio
              </h3>

              <div className='rounded-2xl border border-gold/25 bg-gold/10 p-5'>
                <div className='mb-3 flex items-center gap-3 text-gold'>
                  <Clock className='h-5 w-5 shrink-0' />
                  <p className='text-sm font-bold uppercase tracking-wider'>Horário de funcionamento</p>
                </div>
                <p className='text-lg font-bold text-white'>Segunda a sexta-feira</p>
                <p className='text-lg text-gray-300'>das 8h às 17h.</p>
              </div>
            </div>
          </motion.div>

          <p className="text-center text-gray-400 mt-7">
            Contato para doações: <a href="https://wa.me/5577998233676?text=Ol%C3%A1%21%20Quero%20ajudar%20a%20Equipe%20Vermelha%20com%20uma%20doa%C3%A7%C3%A3o.%20Como%20posso%20entregar%3F" className="text-white font-bold hover:text-gold transition-colors">(77) 99823-3676</a>
          </p>
        </div>
      </section>

      {/* 6. Instagram */}
      <section className="py-20 px-6 bg-gradient-to-b from-surface-dark to-black relative overflow-hidden">
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="w-20 h-20 bg-gradient-to-tr from-[#f09433] via-[#e6683c] via-[#dc2743] via-[#cc2366] to-[#bc1888] rounded-2xl flex items-center justify-center mx-auto mb-8 shadow-lg shadow-red-900/20">
              <InstagramIcon className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">Siga a Equipe Vermelha</h2>
            <p className="text-gray-400 text-lg mb-10 max-w-2xl mx-auto leading-relaxed">
              Acompanhe de perto as provas da gincana, os bastidores, nossas ações solidárias e muito mais diretamente no nosso Instagram!
            </p>
            <a
              href="https://www.instagram.com/equipevermelha.mac/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 bg-white/5 border border-white/10 hover:border-white/30 hover:bg-white/10 text-white font-bold py-4 px-8 rounded-full transition-all hover:scale-105"
            >
              <InstagramIcon className="w-6 h-6" />
              @equipevermelha.mac
            </a>
          </motion.div>
        </div>
      </section>

      {/* 7. Footer */}
      <footer className="bg-black py-16 px-6 border-t border-white/5 text-center relative overflow-hidden">
        {/* Subtle cross watermark */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white/5 pointer-events-none">
          <div className="w-1 h-[300px] bg-current mx-auto"></div>
          <div className="w-[200px] h-1 bg-current absolute top-[100px] left-1/2 -translate-x-1/2"></div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="relative z-10 max-w-4xl mx-auto flex flex-col items-center"
        >
          <Church className="text-gold w-10 h-10 mb-6" />
          <h2 className="text-lg md:text-xl font-bold tracking-[0.4em] text-white uppercase mb-4">
            São Carlo Acutis
          </h2>
          <p className="text-gray-500 mb-8 max-w-md mx-auto text-sm leading-relaxed">
            Movimento de Amizade Cristã (MAC)<br />
            Paróquia Santo Antônio • Guanambi - BA
          </p>

          <div className="flex gap-6 mb-10">
            <a href="https://www.instagram.com/equipevermelha.mac/?hl=en" target='_blank' className="text-gray-400 hover:text-brand-red transition-colors text-sm font-bold uppercase tracking-wider">Instagram</a>
          </div>

          <p className="text-xs text-gray-600">
            &copy; {new Date().getFullYear()} Equipe Vermelha. Todos os direitos reservados.
          </p>
        </motion.div>
      </footer>
    </div>
  );
}
