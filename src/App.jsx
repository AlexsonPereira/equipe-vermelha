import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Tickets from './pages/Tickets';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/tickets" element={<Tickets />} />
    </Routes>
  );
}
