const API_URL = 'http://localhost:3000/api';

export const fetchTickets = async () => {
  const response = await fetch(`${API_URL}/rifa`);
  if (!response.ok) {
    throw new Error('Erro ao buscar tickets');
  }
  const data = await response.json();
  return Array.isArray(data) ? data : (data.tickets || []);
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

  console.log(response);


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
    throw new Error('Erro ao atualizar status');
  }

  return await response.json();
};
