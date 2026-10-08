import React, { Suspense, lazy } from 'react';
import { Routes, Route } from 'react-router-dom';
import { MotionConfig } from 'framer-motion';

// Cada página vira um arquivo separado: quem abre a Home não baixa o PDF do admin, o Tigrinho etc.
const Home = lazy(() => import('./pages/Home'));
const Tickets = lazy(() => import('./pages/Tickets'));
const Admin = lazy(() => import('./pages/Admin'));
const Comprovante = lazy(() => import('./pages/Comprovante'));
const MeusBilhetes = lazy(() => import('./pages/MeusBilhetes'));
const Tigrinho = lazy(() => import('./pages/Tigrinho'));
const Quiz = lazy(() => import('./pages/Quiz'));

function CarregandoPagina() {
  return (
    <div className="min-h-screen bg-surface-dark flex items-center justify-center" role="status" aria-label="Carregando">
      <div className="w-12 h-12 border-4 border-white/10 border-t-gold rounded-full animate-spin" />
    </div>
  );
}

export default function App() {
  return (
    // "user": quem ativou "reduzir movimento" no celular não recebe as animações de deslocamento.
    <MotionConfig reducedMotion="user">
      <Suspense fallback={<CarregandoPagina />}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/tickets" element={<Tickets />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/comprovante/:codigo" element={<Comprovante />} />
          <Route path="/meus-bilhetes" element={<MeusBilhetes />} />
          <Route path="/sala-secreta/tigrinho" element={<Tigrinho />} />
          <Route path="/quiz" element={<Quiz />} />
        </Routes>
      </Suspense>
    </MotionConfig>
  );
}
