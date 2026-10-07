const API_URL = 'https://backend-rifa-ijgv.onrender.com/api';
// const API_URL = 'http://localhost:3000/api';

const erroComStatus = async (response, mensagemPadrao) => {
  const errorData = await response.json().catch(() => ({}));
  const error = new Error(errorData.error || mensagemPadrao);
  error.status = response.status;
  return error;
};

const erroAdmin = async (response, mensagemPadrao) => {
  if (response.status === 401 || response.status === 403) {
    const error = new Error('Sessão expirada. Faça login novamente.');
    error.status = response.status;
    return error;
  }
  return erroComStatus(response, mensagemPadrao);
};

const postAdmin = async (path, token, mensagemPadrao) => {
  const response = await fetch(`${API_URL}${path}`, {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${token}` },
  });
  if (!response.ok) throw await erroAdmin(response, mensagemPadrao);
  return await response.json();
};

export const fetchRifa = async () => {
  const response = await fetch(`${API_URL}/rifa`);
  if (!response.ok) {
    throw new Error('Erro ao buscar dados da rifa');
  }
  const data = await response.json();
  // Retorna { tickets: [...], premio: '...', valorCentavos: 1000 }
  return data;
};

export const fetchComprovante = async (codigo) => {
  const response = await fetch(`${API_URL}/rifa/comprovantes/${codigo}`);
  if (!response.ok) {
    throw new Error('Erro ao buscar comprovante');
  }
  return await response.json();
};

export const criarPedido = async (dados) => {
  const response = await fetch(`${API_URL}/pedidos`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(dados),
  });

  if (!response.ok) throw await erroComStatus(response, 'Não foi possível reservar. Tente novamente.');

  return await response.json();
};

export const adminLogin = async (senha) => {
  const response = await fetch(`${API_URL}/admin/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ password: senha }),
  });

  if (!response.ok) {
    throw new Error('Senha inválida');
  }

  const data = await response.json();
  return data.token;
};

export const fetchAdminPedidos = async (token) => {
  const response = await fetch(`${API_URL}/admin/pedidos`, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });

  if (!response.ok) throw await erroAdmin(response, 'Erro ao buscar pedidos');

  return await response.json();
};

export const confirmarPedido = (id, token) =>
  postAdmin(`/admin/pedidos/${id}/confirmar`, token, 'Erro ao confirmar pedido');

export const cancelarPedido = (id, token) =>
  postAdmin(`/admin/pedidos/${id}/cancelar`, token, 'Erro ao cancelar pedido');

export const liberarTicketLegado = (numero, token) =>
  postAdmin(`/admin/numeros/${numero}/liberar`, token, 'Erro ao liberar número');

export const fetchMeusBilhetes = async (telefone) => {
  const digitos = String(telefone).replace(/\D/g, '');
  const response = await fetch(`${API_URL}/rifa/meus-bilhetes/${digitos}`);
  if (!response.ok) throw await erroComStatus(response, 'Erro ao buscar bilhetes');
  return await response.json();
};
