import { generatePedidoPDF } from './pdfGenerator';
import { linkWhatsappContato } from '../utils/formatters';
import { mensagemComprovante } from '../utils/adminPedidos';

const baixarArquivo = (arquivo) => {
  const url = URL.createObjectURL(arquivo);
  const a = document.createElement('a');
  a.href = url;
  a.download = arquivo.name;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

/**
 * Envia o PDF do pedido ao comprador. Precisa ser chamado direto de um toque/clique:
 * navegadores só liberam compartilhamento e janelas logo após uma ação do usuário.
 * @returns {Promise<'compartilhado'|'cancelado'|'baixado'|'bloqueado'>}
 */
export const compartilharComprovante = async (pedido) => {
  const pdfFile = generatePedidoPDF(pedido);
  const mensagem = mensagemComprovante(pedido, window.location.origin);

  try {
    // Web Share envia o PDF direto no celular.
    if (navigator.canShare && navigator.canShare({ files: [pdfFile] })) {
      await navigator.share({ title: `Comprovante pedido #${pedido.codigo}`, text: mensagem, files: [pdfFile] });
      return 'compartilhado';
    }
  } catch (error) {
    if (error.name === 'AbortError') return 'cancelado';
    console.error('Erro ao compartilhar comprovante:', error);
  }

  // Desktop, ou compartilhamento recusado: baixa o PDF e abre o WhatsApp Web com a mensagem.
  baixarArquivo(pdfFile);
  const janela = window.open(`${linkWhatsappContato(pedido.usuarioTelefone)}?text=${encodeURIComponent(mensagem)}`, '_blank');
  return janela ? 'baixado' : 'bloqueado';
};
