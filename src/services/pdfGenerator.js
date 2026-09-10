import { jsPDF } from 'jspdf';

/**
 * Gera um PDF de comprovante de pagamento da rifa.
 * @param {object} ticket - Os dados do ticket com status PAGO.
 * @returns {File} Um objeto File representando o PDF gerado.
 */
export const generatePDF = (ticket) => {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a5', // Formato menor, ideal para comprovante
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 15;
  let y = margin;

  // ---- Cores ----
  const darkBg = [18, 18, 18];
  const gold = [212, 175, 55];
  const white = [255, 255, 255];
  const gray = [160, 160, 160];
  const green = [34, 197, 94];

  // ---- Fundo escuro ----
  doc.setFillColor(...darkBg);
  doc.rect(0, 0, pageWidth, doc.internal.pageSize.getHeight(), 'F');

  // ---- Borda dourada superior ----
  doc.setDrawColor(...gold);
  doc.setLineWidth(1);
  doc.line(margin, y, pageWidth - margin, y);
  y += 10;

  // ---- Titulo ----
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(18);
  doc.setTextColor(...gold);
  doc.text('COMPROVANTE DE COMPRA', pageWidth / 2, y, { align: 'center' });
  y += 8;

  doc.setFontSize(12);
  doc.setTextColor(...white);
  doc.text('Rifa - Equipe Vermelha', pageWidth / 2, y, { align: 'center' });
  y += 10;

  // ---- Linha separadora ----
  doc.setDrawColor(...gold);
  doc.setLineWidth(0.3);
  doc.line(margin, y, pageWidth - margin, y);
  y += 10;

  // ---- Status ----
  doc.setFontSize(14);
  doc.setTextColor(...green);
  doc.setFont('helvetica', 'bold');
  doc.text('PAGAMENTO CONFIRMADO', pageWidth / 2, y, { align: 'center' });
  y += 12;

  // ---- Detalhes ----
  const addField = (label, value) => {
    doc.setFontSize(9);
    doc.setTextColor(...gray);
    doc.setFont('helvetica', 'normal');
    doc.text(label, margin, y);
    y += 5;

    doc.setFontSize(12);
    doc.setTextColor(...white);
    doc.setFont('helvetica', 'bold');
    doc.text(String(value || '-'), margin, y);
    y += 9;
  };

  addField('NÚMERO DO BILHETE', `#${ticket.numero}`);
  addField('COMPRADOR', ticket.comprador_nome || 'N/A');
  addField('TELEFONE', ticket.comprador_telefone || 'N/A');

  const valorFormatado = ticket.valor_pago_centavos
    ? (ticket.valor_pago_centavos / 100).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
    : '-';
  addField('VALOR PAGO', valorFormatado);

  const dataFormatada = ticket.pago_em
    ? new Date(ticket.pago_em).toLocaleDateString('pt-BR', {
        day: '2-digit', month: '2-digit', year: 'numeric',
        hour: '2-digit', minute: '2-digit'
      })
    : '-';
  addField('DATA DO PAGAMENTO', dataFormatada);

  if (ticket.comprovante_codigo) {
    addField('CÓDIGO DE VERIFICAÇÃO', ticket.comprovante_codigo);
  }

  // ---- Linha separadora inferior ----
  y += 5;
  doc.setDrawColor(...gold);
  doc.setLineWidth(0.3);
  doc.line(margin, y, pageWidth - margin, y);
  y += 8;

  // ---- Rodapé ----
  doc.setFontSize(8);
  doc.setTextColor(...gray);
  doc.setFont('helvetica', 'italic');
  doc.text('Guarde este comprovante. Ele é a sua prova de participação.', pageWidth / 2, y, { align: 'center' });
  y += 5;
  doc.text(`Gerado em: ${new Date().toLocaleString('pt-BR')}`, pageWidth / 2, y, { align: 'center' });

  // ---- Borda dourada inferior ----
  y += 8;
  doc.setDrawColor(...gold);
  doc.setLineWidth(1);
  doc.line(margin, y, pageWidth - margin, y);

  // Retorna como File para uso com navigator.share
  const pdfBlob = doc.output('blob');
  const fileName = `comprovante_rifa_${ticket.numero}.pdf`;
  return new File([pdfBlob], fileName, { type: 'application/pdf' });
};
