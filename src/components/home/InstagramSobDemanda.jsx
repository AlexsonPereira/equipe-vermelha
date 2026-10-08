import React, { useEffect, useRef, useState } from 'react';
import { InstagramEmbed } from 'react-social-media-embed';

// Só carrega o embed (scripts pesados do Instagram) quando o post chega perto da tela.
export default function InstagramSobDemanda({ url }) {
  const caixa = useRef(null);
  // Navegador sem IntersectionObserver: carrega direto.
  const [visivel, setVisivel] = useState(() => !('IntersectionObserver' in window));

  useEffect(() => {
    const elemento = caixa.current;
    if (!elemento || visivel) return undefined;
    const observador = new IntersectionObserver(
      ([entrada]) => {
        if (entrada.isIntersecting) {
          setVisivel(true);
          observador.disconnect();
        }
      },
      { rootMargin: '300px' }
    );
    observador.observe(elemento);
    return () => observador.disconnect();
  }, [visivel]);

  return (
    <div ref={caixa} className="w-full max-w-[328px] min-h-[420px] h-fit overflow-hidden rounded-2xl shadow-xl shadow-black/80 bg-white/5">
      {visivel ? (
        <InstagramEmbed url={url} width="100%" />
      ) : (
        <a href={url} target="_blank" rel="noopener noreferrer" className="flex h-[420px] items-center justify-center text-gray-400 text-sm">
          Ver post no Instagram
        </a>
      )}
    </div>
  );
}
