const API_URL = 'http://localhost:3000/api';

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

export const reservarTicket = async (dadosDaReserva) => {
  const response = await fetch(`${API_URL}/rifa/reservar`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(dadosDaReserva),
  });

  if (!response.ok) {
    if (response.status === 409) {
      const errorData = await response.json().catch(() => ({}));
      const error = new Error(errorData.error || 'Número já reservado ou indisponível.');
      error.status = 409;
      throw error;
    }
    throw new Error('Erro ao reservar o número');
  }

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

export const fetchAdminTickets = async (token) => {
  const response = await fetch(`${API_URL}/admin/numeros`, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });

  if (!response.ok) {
    if (response.status === 401 || response.status === 403) {
      const error = new Error('Sessão expirada. Faça login novamente.');
      error.status = response.status;
      throw error;
    }
    throw new Error('Erro ao buscar tickets como admin');
  }

  const data = await response.json();
  return Array.isArray(data) ? data : (data.tickets || []);
};

export const updateTicketStatus = async (numero, status, token) => {
  const response = await fetch(`${API_URL}/admin/numeros/${numero}/status`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({ status }),
  });

  if (!response.ok) {
    if (response.status === 401 || response.status === 403) {
      const error = new Error('Sessão expirada. Faça login novamente.');
      error.status = response.status;
      throw error;
    }
    throw new Error('Erro ao atualizar status');
  }

  return await response.json();
};
