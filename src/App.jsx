import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Tickets from './pages/Tickets';
import Admin from './pages/Admin';
import Comprovante from './pages/Comprovante';
import MeusBilhetes from './pages/MeusBilhetes';
import Tigrinho from './pages/Tigrinho';
import Quiz from './pages/Quiz';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/tickets" element={<Tickets />} />
      <Route path="/admin" element={<Admin />} />
      <Route path="/comprovante/:codigo" element={<Comprovante />} />
      <Route path="/meus-bilhetes" element={<MeusBilhetes />} />
      <Route path="/sala-secreta/tigrinho" element={<Tigrinho />} />
      <Route path="/quiz" element={<Quiz />} />
    </Routes>
  );
}
