import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Church } from 'lucide-react';

const LINKS = [
  { rotulo: 'Rifa', para: '/tickets' },
  { rotulo: 'Meus Bilhetes', para: '/meus-bilhetes' },
  { rotulo: 'Quiz', para: '/quiz' },
];

export default function Rodape() {
  return (
    <footer className="bg-black pt-16 pb-28 md:pb-16 px-6 border-t border-white/5 text-center relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white/5 pointer-events-none" aria-hidden="true">
        <div className="w-1 h-[300px] bg-current mx-auto" />
        <div className="w-[200px] h-1 bg-current absolute top-[100px] left-1/2 -translate-x-1/2" />
      </div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="relative z-10 max-w-4xl mx-auto flex flex-col items-center"
      >
        <Church className="text-gold w-10 h-10 mb-6" />
        <h2 className="text-lg md:text-xl font-bold tracking-[0.4em] text-white uppercase mb-4">São Carlo Acutis</h2>
        <p className="text-gray-500 mb-8 max-w-md mx-auto text-sm leading-relaxed">
          Movimento de Amizade Cristã (MAC)<br />
          Paróquia Santo Antônio • Guanambi - BA
        </p>
        <nav className="flex flex-wrap justify-center gap-x-6 gap-y-2 mb-10" aria-label="Rodapé">
          {LINKS.map((link) => (
            <Link key={link.para} to={link.para} className="min-h-11 flex items-center text-gray-400 hover:text-brand-red text-sm font-bold uppercase tracking-wider">
              {link.rotulo}
            </Link>
          ))}
          <a href="#doacoes" className="min-h-11 flex items-center text-gray-400 hover:text-brand-red text-sm font-bold uppercase tracking-wider">Doações</a>
          <a href="https://www.instagram.com/equipevermelha.mac/" target="_blank" rel="noopener noreferrer" className="min-h-11 flex items-center text-gray-400 hover:text-brand-red text-sm font-bold uppercase tracking-wider">
            Instagram
          </a>
        </nav>
        <p className="text-xs text-gray-600">&copy; {new Date().getFullYear()} Equipe Vermelha. Todos os direitos reservados.</p>
      </motion.div>
    </footer>
  );
}
