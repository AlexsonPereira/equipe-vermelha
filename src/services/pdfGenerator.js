import { jsPDF } from 'jspdf';
import QRCode from 'qrcode';
import { formatCurrency } from '../utils/formatters.js';

// Mesmo padrão visual da página /comprovante/:codigo (Comprovante.jsx).
const ORGANIZADOR = 'MAC - Equipe Vermelha';
const PREMIO = 'Air Fryer';

// ---- Cores ----
const verde = [22, 163, 74];
const verdeClaro = [220, 252, 231];
const vermelho = [179, 0, 0];
const branco = [255, 255, 255];
const textoEscuro = [31, 41, 55];
const textoCinza = [107, 114, 128];
const textoSuave = [75, 85, 99];
const rodapeTexto = [156, 163, 175];
const borda = [229, 231, 235];
const bordaQr = [209, 213, 219];
const caixaCinza = [243, 244, 246];
const rodapeFundo = [249, 250, 251];

const formatarData = (valor) =>
  valor
    ? new Date(valor).toLocaleDateString('pt-BR', {
        day: '2-digit', month: '2-digit', year: 'numeric',
        hour: '2-digit', minute: '2-digit',
      })
    : '-';

// QR vetorial gerado na hora: sem rede, para o compartilhamento continuar partindo do toque.
const desenharQrCode = (doc, texto, x, y, tamanho) => {
  const { modules } = QRCode.create(texto, { errorCorrectionLevel: 'M' });
  const celula = tamanho / modules.size;
  doc.setFillColor(0, 0, 0);
  for (let linha = 0; linha < modules.size; linha += 1) {
    let inicio = null;
    for (let coluna = 0; coluna <= modules.size; coluna += 1) {
      const escuro = coluna < modules.size && modules.get(linha, coluna);
      if (escuro && inicio === null) inicio = coluna;
      if (!escuro && inicio !== null) {
        // Um retângulo por trecho contínuo evita frestas entre módulos vizinhos.
        doc.rect(x + inicio * celula, y + linha * celula, (coluna - inicio) * celula, celula, 'F');
        inicio = null;
      }
    }
  }
};

const desenharCheck = (doc, cx, cy) => {
  doc.setDrawColor(...branco);
  doc.setLineWidth(1.1);
  doc.circle(cx, cy, 7, 'S');
  doc.setLineWidth(1.3);
  doc.lines([[2.4, 2.5], [4.8, -5]], cx - 3.6, cy + 0.2, [1, 1], 'S');
};

const desenharPagina = (doc, ticket, codigoPedido, origem) => {
  const largura = doc.internal.pageSize.getWidth();
  const altura = doc.internal.pageSize.getHeight();
  const margem = 14;
  const larguraUtil = largura - margem * 2;
  const colunaDireita = largura / 2 + 4;
  const larguraColuna = larguraUtil / 2 - 4;

  doc.setFillColor(...branco);
  doc.rect(0, 0, largura, altura, 'F');

  // ---- Cabeçalho verde ----
  doc.setFillColor(...verde);
  doc.rect(0, 0, largura, 44, 'F');
  desenharCheck(doc, largura / 2, 15);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(15);
  doc.setTextColor(...branco);
  doc.text('COMPROVANTE DE COMPRA', largura / 2, 31, { align: 'center', charSpace: 0.4 });
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(...verdeClaro);
  doc.text('Válido e Confirmado', largura / 2, 37, { align: 'center' });

  const rotulo = (texto, x, y, opcoes) => {
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7);
    doc.setTextColor(...textoCinza);
    doc.text(texto, x, y, { charSpace: 0.2, ...opcoes });
  };

  // Rótulo + valor em negrito; devolve a altura ocupada para alinhar a linha da grade.
  const campo = (titulo, valor, x, y, larguraMax, cor = textoEscuro) => {
    rotulo(titulo, x, y);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.setTextColor(...cor);
    const linhas = doc.splitTextToSize(String(valor || '-'), larguraMax).slice(0, 3);
    doc.text(linhas, x, y + 5.5);
    return 5.5 + linhas.length * 4.8;
  };

  // ---- Código e número ----
  let y = 54;
  rotulo('CÓDIGO DE AUTENTICIDADE', margem, y);
  rotulo('NÚMERO', largura - margem, y, { align: 'right' });
  doc.setFont('courier', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(...textoEscuro);
  doc.text(ticket.comprovante_codigo || '-', margem, y + 6);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(26);
  doc.setTextColor(...vermelho);
  doc.text(`#${ticket.numero}`, largura - margem, y + 11, { align: 'right' });

  y += 18;
  doc.setDrawColor(...borda);
  doc.setLineWidth(0.3);
  doc.line(margem, y, largura - margem, y);

  // ---- Grade de dados ----
  y += 9;
  y += Math.max(
    campo('COMPRADOR', ticket.comprador_nome, margem, y, larguraColuna),
    campo('DATA DO PAGAMENTO', formatarData(ticket.pago_em), colunaDireita, y, larguraColuna),
  ) + 5;
  y += Math.max(
    campo('ORGANIZADOR', ORGANIZADOR, margem, y, larguraColuna),
    campo('VALOR PAGO', formatCurrency(ticket.valor_pago_centavos), colunaDireita, y, larguraColuna, verde),
  ) + 5;
  y += campo('PRÊMIO CONCORRENDO', PREMIO, margem, y, larguraUtil) + 6;

  // ---- Verificação digital ----
  const alturaCaixa = 38;
  doc.setFillColor(...caixaCinza);
  doc.roundedRect(margem, y, larguraUtil, alturaCaixa, 4, 4, 'F');
  doc.setFillColor(...branco);
  doc.setDrawColor(...bordaQr);
  doc.setLineWidth(0.3);
  doc.roundedRect(margem + 5, y + 5, 28, 28, 2, 2, 'FD');
  desenharQrCode(doc, `${origem}/comprovante/${ticket.comprovante_codigo}`, margem + 7, y + 7, 24);

  const textoX = margem + 39;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(...textoEscuro);
  doc.text('Verificação Digital', textoX, y + 12);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(...textoSuave);
  doc.text(
    doc.splitTextToSize(
      'Aponte a câmera do seu celular para o QR Code ao lado para verificar a autenticidade deste comprovante online a qualquer momento.',
      larguraUtil - 45,
    ),
    textoX,
    y + 18,
  );

  // ---- Rodapé ----
  const topoRodape = altura - 14;
  doc.setFillColor(...rodapeFundo);
  doc.rect(0, topoRodape, largura, 14, 'F');
  doc.setDrawColor(...borda);
  doc.line(0, topoRodape, largura, topoRodape);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7);
  doc.setTextColor(...rodapeTexto);
  doc.text(`Pedido #${codigoPedido} · Rifa Solidária - Gerado Eletronicamente`, largura / 2, topoRodape + 8, { align: 'center' });
};

/**
 * Monta o documento com uma página de comprovante por número do pedido.
 * @param {object} pedido - Pedido pago, no formato de GET /api/admin/pedidos.
 * @param {string} origem - Origem do site, usada no link do QR Code.
 */
export const montarPedidoPDF = (pedido, origem) => {
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a5' });

  pedido.tickets.forEach((ticket, indice) => {
    if (indice > 0) doc.addPage('a5', 'portrait');
    desenharPagina(doc, ticket, pedido.codigo, origem);
  });

  return doc;
};

/**
 * @returns {File} PDF pronto para navigator.share ou download.
 */
export const generatePedidoPDF = (pedido, origem = window.location.origin) => {
  const pdfBlob = montarPedidoPDF(pedido, origem).output('blob');
  return new File([pdfBlob], `comprovante_pedido_${pedido.codigo}.pdf`, { type: 'application/pdf' });
};
