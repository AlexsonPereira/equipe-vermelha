export const apenasDigitos = (valor = '') => String(valor ?? '').replace(/\D/g, '');

// Números copiados do WhatsApp vêm com o DDI (+55): 12 ou 13 dígitos viram 10 ou 11.
const semDdi = (digitos) => (digitos.length > 11 && digitos.startsWith('55') ? digitos.slice(2) : digitos);

export const formatPhone = (value = '') => {
  const digits = semDdi(apenasDigitos(value)).slice(0, 11);
  if (digits.length <= 2) return digits ? `(${digits}` : '';
  const areaCode = digits.slice(0, 2);
  const number = digits.slice(2);
  if (number.length <= 4) return `(${areaCode}) ${number}`;
  const prefixLength = number.length <= 8 ? 4 : 5;
  return `(${areaCode}) ${number.slice(0, prefixLength)}-${number.slice(prefixLength)}`;
};

export const formatCpf = (value = '') => {
  const digits = apenasDigitos(value).slice(0, 11);
  return digits.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
};

export const telefoneValido = (value = '') => {
  const total = semDdi(apenasDigitos(value)).length;
  return total === 10 || total === 11;
};

export const formatCurrency = (cents) => {
  if (cents === null || cents === undefined) return '-';
  return (cents / 100).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
};

export const formatDateTime = (value) => {
  if (!value) return '-';
  return new Date(value).toLocaleString('pt-BR', {
    day: '2-digit', month: '2-digit', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });
};

// Telefones guardados sem DDI (10 ou 11 dígitos) recebem o 55; os demais seguem como estão.
export const linkWhatsappContato = (telefone = '') => {
  const digitos = apenasDigitos(telefone);
  if (!digitos) return 'https://wa.me/';
  return `https://wa.me/${digitos.length <= 11 ? `55${digitos}` : digitos}`;
};
