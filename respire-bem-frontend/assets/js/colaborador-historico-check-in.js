// colaborador-historico-check-in.js

document.addEventListener('DOMContentLoaded', () => {
    // a função apiFetch do api.js
    if (typeof apiFetch === 'function') {
        carregarHistoricoCheckIn();
    } else {
        console.error("Erro: A função 'apiFetch' não está definida. Verifique se o api.js foi carregado corretamente.");
        const tbody = document.querySelector('.historico-checkin tbody');
        tbody.innerHTML = '<tr><td colspan="3">❌ Erro de configuração: Função API não encontrada.</td></tr>';
    }
});


 //busca o histórico de check-ins do colaborador logado no backend e preenche a tabela.
async function carregarHistoricoCheckIn() {
    const tbody = document.querySelector('.historico-checkin tbody');

    tbody.innerHTML = '<tr><td colspan="3">Carregando histórico...</td></tr>'; 

    try {
        const historico = await apiFetch('/checkin/historico', { method: 'GET' });
        preencherTabela(historico || [], tbody); 

    } catch (error) {
        console.error('Erro ao carregar histórico de Check-in:', error);
        tbody.innerHTML = '<tr><td colspan="3">❌ Erro ao carregar o histórico. Verifique a conexão com a API.</td></tr>';
    }
}

/**
 * preenche a tabela com os dados do histórico.
 * @param {Array<Object>} historico lista de objetos HistoricoCheckInDto.
 * @param {HTMLElement} tbody o elemento <tbody> da tabela.
 */
function preencherTabela(historico, tbody) {
    tbody.innerHTML = ''; 
    
    if (historico.length === 0) {
        tbody.innerHTML = '<tr><td colspan="3">Nenhum registro de Check-in encontrado.</td></tr>';
        return;
    }

    // ordena por data (o mais recente primeiro)
    historico.sort((a, b) => new Date(b.dataCheckIns) - new Date(a.dataCheckIns));

    historico.forEach(item => {
        // pega a estrutura do DTO: { idCheckIn, dataCheckIns, descricaoCheckIn, sentimento }
        const tr = document.createElement('tr');
        
        const dataFormatada = formatarData(item.dataCheckIns);
        const sentimentoFormatado = formatarSentimento(item.sentimento);

        tr.innerHTML = `
            <td>${sentimentoFormatado}</td>
            <td>${item.descricaoCheckIn}</td>
            <td>${dataFormatada}</td>
        `;
        tbody.appendChild(tr);
    });
}

/**
 * converte a data (aaaa-mm-dd) para o formato brasileiro (dd/mm/aaaa).
 * @param {string} dataString 
 * @returns {string} 
 */
function formatarData(dataString) {
    if (!dataString) return 'N/A';
    // o backend retorna "yyyy-mm-dd..."
    try {
        const [ano, mes, dia] = dataString.split('T')[0].split('-');
        return `${dia}/${mes}/${ano}`;
    } catch (e) {
        return dataString; // retorna a string original se a formatação falhar
    }
}

/**
 * mapeia o ENUM Sentimento.java (FELIZ, BEM, NEUTRO, DESANIMADO, TRISTE, IRRITADO) para o formato de exibição desejado na tabela.
 * @param {string} sentimento string do ENUM (em maiúsculas).
 * @returns {string} sentimento formatado.
 */
function formatarSentimento(sentimento) {
    if (!sentimento) return 'N/A';
    
    const sentimentoUpper = sentimento.toUpperCase();

    switch (sentimentoUpper) {
        case 'FELIZ':
            return 'Feliz';
        case 'BEM':
            return 'Bem';
        case 'NEUTRO':
            return 'Neutro (a)';
        case 'DESANIMADO':
            return 'Desanimado (a)';
        case 'TRISTE':
            return 'Triste';
        case 'IRRITADO':
            return 'Irritado (a)';
        default:
            // caso um novo ENUM seja adicionado e o switch não tenha sido atualizado
            console.warn(`Sentimento desconhecido: ${sentimento}`);
            return sentimento.charAt(0).toUpperCase() + sentimento.slice(1).toLowerCase();
    }
}