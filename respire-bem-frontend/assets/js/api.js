
const API_BASE_URL = 'http://localhost:8080'; // URL base da API

/**
 * função para fazer requisições à API, automaticamente incluindo o token JWT do localStorage.
 * * @param {string} endpoint O caminho da rota (ex: '/colaborador/listarColaboradores')
 * @param {object} options opções padrão do Fetch (method, headers, body, etc.)
 * @returns {Promise<any>} o objeto JSON da resposta da API.
 */
async function apiFetch(endpoint, options = {}) {
    const token = localStorage.getItem('jwt_token');
    
    const headers = {
        'Content-Type': 'application/json',
        ...options.headers 
    };

    // adiciona o token de autorização
    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    // faz a requisição
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        ...options,
        headers: headers,
    });

    // se a resposta for 204 No Content (DELETE, por exemplo), retorna vazio
    if (response.status === 204) {
        return null;
    }
    
    // tenta obter o corpo JSON da resposta
    let data;
    try {
        data = await response.json();
    } catch (e) {
        // se falhar o JSON, mas o status for OK (ex: 200 com corpo vazio), retorna nulo.
        if (response.ok) return null; 
        throw new Error(`Erro ao processar JSON. Status: ${response.status}`);
    }

    // lança um erro se o status não for OK (2xx)
    if (!response.ok) {
        // assume que a API retorna 'message' em caso de erro
        const errorMessage = data.message || `Erro da API: Status ${response.status}`;
        throw new Error(errorMessage);
    }

    return data;
}

window.apiFetch = apiFetch;