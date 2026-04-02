document.addEventListener('DOMContentLoaded', () => {
    // verifica se função apiFetch (do api.js) existe para evitar erros 
    if (typeof apiFetch !== 'function') {
        console.error("ERRO CRÍTICO: apiFetch não foi encontrado. Verifique a importação do api.js");
        return; 
    }

    configurarSelecaoSentimento();
    configurarBotaoSalvar();
});

// variável para armazenar o sentimento escolhido
let sentimentoSelecionado = null;

// --- Configuração das Recomendações e Cores ---
const dadosSentimentos = {
    FELIZ: {
        corFundo: '#E8F5E9', 
        corBorda: '#1B5E20',
        corTextoTitulo: '#1B5E20', 
        corTextoLista: '#1B5E20', 
        recomendacoes: [
            "Continue espalhando essa energia positiva com a equipe!",
            "Aproveite este momento para realizar tarefas criativas.",
            "Que tal compartilhar uma boa prática com um colega hoje?"
        ]
    },
    BEM: {
        corFundo: '#F9FBE7', 
        corBorda: '#827717', 
        corTextoTitulo: '#827717', 
        corTextoLista: '#827717',
        recomendacoes: [
            "Ótimo estado para focar em suas metas diárias.",
            "Mantenha seu ritmo e lembre-se de beber água.",
            "Reserve um tempo para organizar sua agenda de amanhã."
        ]
    },
    NEUTRO: {
        corFundo: '#FFF3E0', 
        corBorda: '#E65100', 
        corTextoTitulo: '#E65100',
        corTextoLista: '#E65100',
        recomendacoes: [
            "Um dia tranquilo é um bom dia para colocar a leitura em dia.",
            "Faça uma pausa breve para alongar o corpo.",
            "Revise suas prioridades sem pressão excessiva."
        ]
    },
    DESANIMADO: {
        corFundo: '#ECEFF1', 
        corBorda: '#455A64', 
        corTextoTitulo: '#455A64',
        corTextoLista: '#455A64',
        recomendacoes: [
            "Tudo bem não estar 100% o tempo todo. Respeite seu tempo.",
            "Tente dividir suas tarefas em passos bem pequenos.",
            "Ouça uma música que você gosta para tentar elevar o ânimo."
        ]
    },
    TRISTE: {
        corFundo: '#E3F2FD', 
        corBorda: '#0D47A1', 
        corTextoTitulo: '#0D47A1',
        corTextoLista: '#0D47A1',
        recomendacoes: [
            "Não guarde tudo para si. Considere conversar com alguém de confiança.",
            "Se permita fazer pausas mais frequentes hoje.",
            "Lembre-se que amanhã é um novo dia. Seja gentil com você."
        ]
    },
    IRRITADO: {
        corFundo: '#FFEBEE', 
        corBorda: '#B71C1C', 
        corTextoTitulo: '#B71C1C',
        corTextoLista: '#B71C1C',
        recomendacoes: [
            "Faça o exercício de respiração abaixo (4-4-6) agora mesmo.",
            "Se possível, dê uma volta curta para esfriar a cabeça.",
            "Evite responder e-mails complexos nos próximos 30 minutos."
        ]
    }
};

// --- Funções de Interface ---

function configurarSelecaoSentimento() {
    const moods = document.querySelectorAll('.mood');
    const containerRecomendacao = document.getElementById('listaRecomendacoes');
    
    if (!containerRecomendacao) return;

    const listaUl = containerRecomendacao.querySelector('ul');
    const tituloH3 = containerRecomendacao.querySelector('h3');

    moods.forEach(mood => {
        mood.addEventListener('click', () => {
            // visual: Remove seleção anterior
            moods.forEach(m => {
                m.style.transform = 'scale(1)';
                m.style.border = '1px solid #ddd';
            });
            
            // sentimento selecionado
            mood.style.transform = 'scale(1.08)';
            mood.style.border = '2px solid #ffffffff'; 

            // identifica qual sentimento foi clicado
            if (mood.classList.contains('feliz')) sentimentoSelecionado = 'FELIZ';
            else if (mood.classList.contains('bem')) sentimentoSelecionado = 'BEM';
            else if (mood.classList.contains('neutro')) sentimentoSelecionado = 'NEUTRO';
            else if (mood.classList.contains('desanimado')) sentimentoSelecionado = 'DESANIMADO';
            else if (mood.classList.contains('triste')) sentimentoSelecionado = 'TRISTE';
            else if (mood.classList.contains('irritado')) sentimentoSelecionado = 'IRRITADO';

            // atualiza as recomendações
            atualizarRecomendacoes(containerRecomendacao, listaUl, tituloH3);
        });
    });
}

function atualizarRecomendacoes(container, ul, h3) {
    if (!sentimentoSelecionado || !dadosSentimentos[sentimentoSelecionado]) return;

    const dados = dadosSentimentos[sentimentoSelecionado];

    container.style.backgroundColor = dados.corFundo;
    container.style.borderLeft = `4px solid ${dados.corBorda}`;
    container.style.transition = 'all 0.3s ease';

    if(h3) h3.style.color = dados.corTextoTitulo;

    if(ul) {
        ul.innerHTML = ''; 
        dados.recomendacoes.forEach(texto => {
            const li = document.createElement('li');
            li.textContent = texto;
            li.style.color = dados.corTextoLista;
            ul.appendChild(li);
        });
    }
}

function resetSelecaoSentimento() {

    sentimentoSelecionado = null;
    

    document.querySelectorAll('.mood').forEach(m => {
        m.style.transform = 'scale(1)'; 
        m.style.border = '1px solid #ddd';
    });
    
    const container = document.getElementById('listaRecomendacoes');
    if(container) {
        container.style.backgroundColor = ''; 
        container.style.borderLeft = '';
        const h3 = container.querySelector('h3');
        if(h3) h3.style.color = '';
        const ul = container.querySelector('ul');
        if(ul) ul.innerHTML = '<li>Clique em um emoji para ver as recomendações personalizadas.</li>';
    }
}

// --- Funções de Integração com API ---

function configurarBotaoSalvar() {
    const btnSalvar = document.querySelector('.btn-primary[data-bs-toggle="modal"]');
    
    if (!btnSalvar) return;

    btnSalvar.addEventListener('click', async (e) => {
        e.preventDefault();
        e.stopPropagation();

        if (!sentimentoSelecionado) {
            alert('Por favor, selecione como você está se sentindo hoje antes de salvar.');
            return;
        }

        const descricaoInput = document.getElementById('descricao');
        const descricao = descricaoInput ? descricaoInput.value : '';

        const payload = {
            sentimento: sentimentoSelecionado, 
            descricaoCheckIn: descricao
        };

        btnSalvar.disabled = true;
        const textoOriginal = btnSalvar.textContent;
        btnSalvar.textContent = 'Salvando...';

        try {
            await apiFetch('/checkin/fazerCheckIn', {
                method: 'POST',
                body: JSON.stringify(payload)
            });

            // Se a API for bem-sucedida, abre o modal
            abrirModalSucesso();
            
            const modalElement = document.getElementById('modalSucesso');
            if (modalElement) {

                modalElement.addEventListener('hidden.bs.modal', function limparBackdrop() {

                    const backdrops = document.querySelectorAll('.modal-backdrop');
                    backdrops.forEach(backdrop => backdrop.remove());
                    

                    document.body.classList.remove('modal-open');
                    document.body.style.overflow = ''; 
                    

                    document.body.style.paddingRight = ''; 

                    resetSelecaoSentimento();

                    if(descricaoInput) descricaoInput.value = '';
                    

                    modalElement.removeEventListener('hidden.bs.modal', limparBackdrop);
                }, { once: true });
            }


        } catch (error) {
            console.error('Erro ao salvar check-in:', error);
            alert('Não foi possível salvar seu check-in. \nErro: ' + error.message);
            
            // se falhar, reseta o estado da tela
            resetSelecaoSentimento();

        } finally {
            btnSalvar.disabled = false;
            btnSalvar.textContent = textoOriginal;
        }
    });
}

function abrirModalSucesso() {
    const modalElement = document.getElementById('modalSucesso');
    if (modalElement && window.bootstrap) {
        // inicializa o modal
        const modal = new bootstrap.Modal(modalElement);
        modal.show();
    } else {
        alert("Check-in realizado com sucesso!"); 
    }
}