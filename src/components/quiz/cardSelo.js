// Card 1080×1080 do selo conquistado, desenhado no próprio celular (sem biblioteca).
const TAMANHO = 1080;

const quebrarTexto = (contexto, texto, larguraMaxima) => {
  const palavras = texto.split(' ');
  const linhas = [];
  let atual = '';
  for (const palavra of palavras) {
    const teste = atual ? `${atual} ${palavra}` : palavra;
    if (contexto.measureText(teste).width > larguraMaxima && atual) {
      linhas.push(atual);
      atual = palavra;
    } else {
      atual = teste;
    }
  }
  if (atual) linhas.push(atual);
  return linhas;
};

export const gerarCardSelo = ({ apelido, pontos, selo }) =>
  new Promise((resolver, rejeitar) => {
    const canvas = document.createElement('canvas');
    canvas.width = TAMANHO;
    canvas.height = TAMANHO;
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      rejeitar(new Error('Canvas indisponível'));
      return;
    }

    const fundo = ctx.createLinearGradient(0, 0, TAMANHO, TAMANHO);
    fundo.addColorStop(0, '#4a0505');
    fundo.addColorStop(0.55, '#1a0202');
    fundo.addColorStop(1, '#000000');
    ctx.fillStyle = fundo;
    ctx.fillRect(0, 0, TAMANHO, TAMANHO);

    // Moldura dourada
    ctx.strokeStyle = '#D4AF37';
    ctx.lineWidth = 12;
    ctx.strokeRect(40, 40, TAMANHO - 80, TAMANHO - 80);

    // Halo atrás do selo
    const halo = ctx.createRadialGradient(TAMANHO / 2, 430, 20, TAMANHO / 2, 430, 260);
    halo.addColorStop(0, `${selo.cor}88`);
    halo.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = halo;
    ctx.fillRect(0, 150, TAMANHO, 560);

    ctx.textAlign = 'center';
    ctx.fillStyle = '#D4AF37';
    ctx.font = 'bold 44px sans-serif';
    ctx.fillText('DESAFIO RELÂMPAGO', TAMANHO / 2, 150);
    ctx.fillStyle = '#e5e7eb';
    ctx.font = '34px sans-serif';
    ctx.fillText('Quanto você conhece São Carlo Acutis?', TAMANHO / 2, 205);

    ctx.font = '230px sans-serif';
    ctx.fillText(selo.emoji, TAMANHO / 2, 520);

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 76px sans-serif';
    quebrarTexto(ctx, selo.nome, TAMANHO - 200).forEach((linha, indice) => {
      ctx.fillText(linha, TAMANHO / 2, 660 + indice * 84);
    });

    ctx.fillStyle = '#D4AF37';
    ctx.font = 'bold 96px sans-serif';
    ctx.fillText(`${pontos} pontos`, TAMANHO / 2, 850);

    ctx.fillStyle = '#d1d5db';
    ctx.font = '40px sans-serif';
    ctx.fillText(apelido, TAMANHO / 2, 920);

    ctx.fillStyle = '#9ca3af';
    ctx.font = '30px sans-serif';
    ctx.fillText(`Equipe Vermelha · ${window.location.host}/quiz`, TAMANHO / 2, 995);

    canvas.toBlob((blob) => (blob ? resolver(blob) : rejeitar(new Error('Falha ao gerar imagem'))), 'image/png');
  });

// Recebe o arquivo já gerado: o compartilhamento precisa partir direto do toque.
export const compartilharCardSelo = async (arquivo, texto) => {
  if (arquivo && navigator.canShare && navigator.canShare({ files: [arquivo] })) {
    try {
      await navigator.share({ files: [arquivo], text: texto, title: 'Desafio Relâmpago' });
      return 'compartilhado';
    } catch (error) {
      if (error.name === 'AbortError') return 'cancelado';
    }
  }
  if (arquivo) {
    const url = URL.createObjectURL(arquivo);
    const link = document.createElement('a');
    link.href = url;
    link.download = arquivo.name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }
  window.open(`https://wa.me/?text=${encodeURIComponent(`${texto} ${window.location.origin}/quiz`)}`, '_blank');
  return 'baixado';
};
