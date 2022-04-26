const useEquipoApi = () => {
  //Hace referencia al dominio
  const baseUrl = LOCAL_BASE_URL;

  const list = async () => {
    //GET -> http://localhost:4000/players
    const response = await fetch(`${baseUrl}/players`, { method: 'GET' });
    return response.json();
  };

  const create = async (data) => {
    //POST -> http://localhost:4000/players
    const response = await fetch(`${baseUrl}/players`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return response.json();
  };

  const read = async (id) => {
    //GET -> http://localhost:4000/players/${id}
    const response = await fetch(`${baseUrl}/players/${id}`, { method: 'GET' });
    return response.json();
  };

  const update = async (id, data) => {
    const response = await fetch(`${baseUrl}/players/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return response.json();
  };

  const remove = async (id) => {
    //DELETE -> http://localhost:4000/players/${id}
    const response = await fetch(`${baseUrl}/players/${id}`, {
      method: 'DELETE',
    });
    return response.json();
  };

  return {
    list,
    create,
    read,
    update,
    remove,
  };
};
