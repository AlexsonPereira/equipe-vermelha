import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Crown, HeartHandshake, Copy, Check, Church, Flame, Smartphone, Quote, MapPin, Ticket, ChevronLeft, ChevronRight } from 'lucide-react';
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
            <Link target="_blank" to="https://wa.me/5577991175001?text=Quero%20comprar%20um%20numero%20da%20rifa.%20" className="bg-gold hover:bg-yellow-500 text-surface-dark font-bold py-3 sm:py-4 px-6 sm:px-8 rounded-full shadow-[0_0_20px_rgba(212,175,55,0.4)] transition-all flex items-center justify-center gap-2">
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
                Participe da nossa rifa e concorra a uma incrível Air Fryer Mondial! Além de ter a chance de ganhar esse super prêmio, você ajuda a Equipe Vermelha na gincana e colabora com nossas ações solidárias. Não fique de fora dessa!
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
      <section id="doacoes" className="py-24 px-4 sm:px-6 bg-surface-dark">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="bg-gradient-to-br from-[#3a0000] to-surface-dark border border-brand-red/50 rounded-3xl p-6 sm:p-8 md:p-12 shadow-[0_20px_50px_rgba(0,0,0,0.5)] relative overflow-hidden"
          >
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-brand-red via-gold to-brand-red"></div>

            <div className="text-center mb-12">
              <h2 className="font-marker text-4xl md:text-6xl text-brand-red mb-4">Ação Solidária</h2>
              <p className="text-gray-300 text-base md:text-lg max-w-2xl mx-auto">
                Sua doação ajuda a equipe a pontuar na gincana e, o mais importante, leva alimento para famílias carentes assistidas pela nossa paróquia.
              </p>
            </div>

            <div className="flex flex-col lg:grid lg:grid-cols-3 gap-8 lg:gap-12 items-start">
              {/* PIX Section */}
              <div className=" max-lg:w-full flex flex-col items-center justify-center p-6 md:p-8 bg-black/40 rounded-2xl border border-white/5">
                <h3 className="text-gold font-bold mb-6 text-xl">Doação Financeira (PIX)</h3>

                <div className="w-48 h-48 bg-white p-2 rounded-xl mb-6 shadow-inner flex items-center justify-center overflow-hidden">
                  <img src="/qrcode.PNG" alt="QR Code PIX" className="w-full h-full object-contain" />
                </div>

                <div className="w-full relative max-w-sm">
                  <button
                    onClick={handleCopyPix}
                    className="w-full bg-surface-dark border border-gold/50 text-white font-mono py-3 md:py-4 px-4 rounded-xl flex items-center justify-between hover:bg-gold/10 hover:border-gold transition-all group"
                  >
                    <span className="truncate mr-4 text-sm md:text-base text-gray-300 select-all">00020126360014br.gov.bcb.pix0114+55779982336765204000053039865802BR5901N6001C62180514Equipevermelha6304C736</span>
                    {copied ? <Check className="text-green-500 w-5 h-5 flex-shrink-0" /> : <Copy className="text-gold w-5 h-5 group-hover:scale-110 transition-transform flex-shrink-0" />}
                  </button>

                  <AnimatePresence>
                    {copied && (
                      <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.8 }}
                        animate={{ opacity: 1, y: -45, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        className="absolute top-0 right-0 bg-green-500 text-white text-xs font-bold px-4 py-1.5 rounded-full shadow-lg flex items-center gap-1"
                      >
                        <Check className="w-3 h-3" />
                        Chave Copiada!
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>

              {/* Food Tracker Section */}
              <div className="flex flex-col justify-center w-full">
                <h3 className="text-gold font-bold mb-6 text-xl text-center lg:text-left">Alimentos Prioritários</h3>

                <div className="space-y-6">
                  {[
                    { name: 'Arroz', meta: 'Meta: 500kg', progress: '0%' },
                    { name: 'Feijão', meta: 'Meta: 500kg', progress: '0%' },
                    { name: 'Óleo de Soja', meta: 'Meta: 200 un.', progress: '0%' },
                    { name: 'Leite em Pó', meta: 'Meta: 100 latas', progress: '0%' },
                    // { name: 'Flocão', meta: 'Meta: 100 latas', progress: '0%' },
                    { name: 'Café', meta: 'Meta: 100 latas', progress: '0%' },
                    // { name: 'Açúcar', meta: 'Meta: 100 latas', progress: '0%' },
                    // { name: 'Macarrão', meta: 'Meta: 100 latas', progress: '0%' },
                    // { name: 'Margarina', meta: 'Meta: 100 latas', progress: '0%' },
                    // { name: 'Bolacha', meta: 'Meta: 100 latas', progress: '0%' },
                    // { name: 'Polvilho', meta: 'Meta: 100 latas', progress: '0%' },
                  ].map((item, idx) => (
                    <div key={idx} className="w-full">
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-white font-bold">{item.name}</span>
                        {/* <span className="text-gray-400 font-mono text-xs">{item.meta}</span> */}
                      </div>
                      <div className="h-4 w-full bg-black/60 rounded-full overflow-hidden border border-white/5 relative">
                        <motion.div
                          initial={{ width: 0 }}
                          whileInView={{ width: item.progress }}
                          viewport={{ once: true }}
                          transition={{ duration: 1.5, delay: 0.2 + (idx * 0.2), ease: "easeOut" }}
                          className="h-full bg-brand-red rounded-full relative"
                        >
                          <div className="absolute top-0 right-0 bottom-0 left-0 bg-[linear-gradient(45deg,rgba(255,255,255,.15)_25%,transparent_25%,transparent_50%,rgba(255,255,255,.15)_50%,rgba(255,255,255,.15)_75%,transparent_75%,transparent)] bg-[length:1rem_1rem] opacity-50"></div>
                        </motion.div>
                      </div>
                    </div>
                  ))}
                </div>

              </div>

              {/* Cleaning Tracker Section */}
              <div className="flex flex-col justify-center w-full">
                <h3 className="text-gold font-bold mb-6 text-xl text-center lg:text-left">Produtos de Limpeza</h3>

                <div className="space-y-6">
                  {[
                    { name: 'Água Sanitária', meta: 'Meta: 100L', progress: '0%' },
                    { name: 'Sabão em Pó', meta: 'Meta: 100kg', progress: '0%' },
                    { name: 'Detergente', meta: 'Meta: 200 un.', progress: '0%' },
                    { name: 'Desinfetante', meta: 'Meta: 100L', progress: '0%' },
                  ].map((item, idx) => (
                    <div key={idx} className="w-full">
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-white font-bold">{item.name}</span>
                        {/* <span className="text-gray-400 font-mono text-xs">{item.meta}</span> */}
                      </div>
                      <div className="h-4 w-full bg-black/60 rounded-full overflow-hidden border border-white/5 relative">
                        <motion.div
                          initial={{ width: 0 }}
                          whileInView={{ width: item.progress }}
                          viewport={{ once: true }}
                          transition={{ duration: 1.5, delay: 0.2 + (idx * 0.2), ease: "easeOut" }}
                          className="h-full bg-brand-red rounded-full relative"
                        >
                          <div className="absolute top-0 right-0 bottom-0 left-0 bg-[linear-gradient(45deg,rgba(255,255,255,.15)_25%,transparent_25%,transparent_50%,rgba(255,255,255,.15)_50%,rgba(255,255,255,.15)_75%,transparent_75%,transparent)] bg-[length:1rem_1rem] opacity-50"></div>
                        </motion.div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>

            <div className="mt-12 p-5 bg-gold/10 rounded-xl border border-gold/20 flex flex-col sm:flex-row items-center sm:items-start gap-4 text-center sm:text-left max-w-2xl mx-auto">
              <MapPin className="text-gold w-8 h-8 flex-shrink-0 sm:mt-1" />
              <div>
                <h4 className="text-white font-bold mb-2">Pontos de Coleta</h4>
                <p className="text-gray-400 text-sm leading-relaxed">
                  Será definido em breve
                </p>
                {/* <p className="text-gray-400 text-sm leading-relaxed">
                  Entregue sua doação física no salão da <strong>Paróquia Santo Antônio</strong> (Guanambi-BA) aos finais de semana, informando que é para a <span className="text-brand-red font-bold">Equipe Vermelha</span>.
                </p> */}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* 6. Footer */}
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
