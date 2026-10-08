import React from 'react';
import { motion, useScroll, useSpring } from 'framer-motion';

// Faixa fina no topo que acompanha a rolagem da página.
export default function BarraProgressoLeitura() {
  const { scrollYProgress } = useScroll();
  const escala = useSpring(scrollYProgress, { stiffness: 120, damping: 30, restDelta: 0.001 });

  return (
    <motion.div
      aria-hidden="true"
      style={{ scaleX: escala }}
      className="fixed top-0 left-0 right-0 h-1 origin-left z-[60] bg-gradient-to-r from-brand-red via-gold to-brand-red"
    />
  );
}
