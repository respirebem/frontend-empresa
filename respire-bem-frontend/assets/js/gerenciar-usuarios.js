document.addEventListener('DOMContentLoaded', () => {

    const tabelaColaboradores = document.getElementById('tabelaColaboradores').querySelector('tbody');
    const tabelaProfissionais = document.getElementById('tabelaProfissionais').querySelector('tbody');
    
    const formColaborador = document.getElementById('formColaborador');
    const formProfissional = document.getElementById('formProfissional');


    const selectDepartamento = document.getElementById('departamento');
    const selectEspecialidade = document.getElementById('especialidade');

    // --- FUNÇÕES DE CARREGAMENTO (GET) ---

    // 1. Listar Colaboradores
    async function carregarColaboradores() {
        tabelaColaboradores.innerHTML = '<tr><td colspan="6">Carregando colaboradores...</td></tr>';
        try {

            const lista = await apiFetch('/colaborador/listarColaboradores');
            

            if (!Array.isArray(lista) || lista.length === 0) {
                tabelaColaboradores.innerHTML = '<tr><td colspan="6">Nenhum colaborador encontrado.</td></tr>';
                return;
            }
            
            tabelaColaboradores.innerHTML = ''; // Limpa loading

            lista.forEach(colab => {
                const row = tabelaColaboradores.insertRow();
                
                const nome = colab.nomeColaborador || '-';
                const email = colab.usuario?.email || 'undefined';
                const departamento = colab.departamento?.nomeDepartamento || '-';
                const status = colab.status ? 'Ativo' : 'Inativo';
                
                row.innerHTML = `
                    <td>${nome}</td>
                    <td>${email}</td>
                    <td>${departamento}</td>
                    <td>${status}</td>
                    <td>********</td>
                    <td>
                        <button class="btn-editar-colab" onclick="editarColaborador(${colab.idColaborador})">Editar</button>
                        <button class="btn-excluir" onclick="deletarColaborador(${colab.idColaborador})">Excluir</button>
                    </td>
                `;
            });
        } catch (error) {
            console.error("Erro ao carregar colaboradores:", error);
            tabelaColaboradores.innerHTML = `<tr><td colspan="6" class="text-danger">Erro ao carregar colaboradores: ${error.message}</td></tr>`;
        }
    }

    // 2. Listar Profissionais
    async function carregarProfissionais() {
        tabelaProfissionais.innerHTML = '<tr><td colspan="6">Carregando profissionais...</td></tr>';
        try {
            const lista = await apiFetch('/profissional/listarProfissionais');
            
            if (!Array.isArray(lista) || lista.length === 0) {
                tabelaProfissionais.innerHTML = '<tr><td colspan="6">Nenhum profissional encontrado.</td></tr>';
                return;
            }
            
            tabelaProfissionais.innerHTML = '';

            lista.forEach(prof => {
                const row = tabelaProfissionais.insertRow();
                
                const nome = prof.nomeProfissional || '-';
                const email = prof.usuario?.email || 'undefined';
                const especialidade = prof.especialidade?.nomeEspecialidade || '-';
                const status = prof.status ? 'Ativo' : 'Inativo';
                
                row.innerHTML = `
                    <td>${nome}</td>
                    <td>${email}</td>
                    <td>${especialidade}</td>
                    <td>${status}</td>
                    <td>********</td>
                    <td>
                        <button class="btn-editar-prof" onclick="editarProfissional(${prof.idProfissional})">Editar</button>
                        <button class="btn-excluir" onclick="deletarProfissional(${prof.idProfissional})">Excluir</button>
                    </td>
                `;
            });
        } catch (error) {
            console.error("Erro ao carregar profissionais:", error);
            tabelaProfissionais.innerHTML = `<tr><td colspan="6" class="text-danger">Erro ao carregar profissionais: ${error.message}</td></tr>`;
        }
    }

    // 3. Carregar Selects (Departamento e Especialidade)
    async function carregarOpcoes() {
        // garantir que a opção inicial seja sempre "Selecione..."
        selectDepartamento.innerHTML = '<option value="" disabled selected>Carregando departamentos...</option>';
        selectEspecialidade.innerHTML = '<option value="" disabled selected>Carregando especialidades...</option>';


        // --- CARREGAR DEPARTAMENTOS ---
        try {
            const deptos = await apiFetch('/departamento/listarDepartamentos');
            
            console.log('Departamentos recebidos:', deptos);
            
            // Limpa e adiciona o placeholder inicial
            selectDepartamento.innerHTML = '<option value="" disabled selected>Selecione o Departamento...</option>';
            
            if (Array.isArray(deptos)) {
                deptos.forEach(d => {

                    const idDepartamento = d.id || d.idDepartamento;
                    console.log(`Adicionando departamento: ${d.nomeDepartamento} com ID: ${idDepartamento}`);
                    selectDepartamento.innerHTML += `<option value="${idDepartamento}">${d.nomeDepartamento}</option>`;
                });
                
                // tambem preenche o select do modal de edição
                const selectDepartamentoEdit = document.getElementById('departamentoEdit');
                if (selectDepartamentoEdit) {
                    selectDepartamentoEdit.innerHTML = '<option value="" disabled selected>Selecione o Departamento...</option>';
                    deptos.forEach(d => {
                        const idDepartamento = d.id || d.idDepartamento;
                        selectDepartamentoEdit.innerHTML += `<option value="${idDepartamento}">${d.nomeDepartamento}</option>`;
                    });
                }
            } else {
                console.warn("Resposta de Departamentos não é um array:", deptos);
                selectDepartamento.innerHTML = '<option value="" disabled selected>Erro ao carregar (API)</option>';
            }

        } catch (error) {
            console.error("ERRO GRAVE ao carregar Departamentos:", error);
            selectDepartamento.innerHTML = '<option value="" disabled selected>Erro de Conexão/Token</option>';
        }

        // --- CARREGAR ESPECIALIDADES ---
        try {
            const specs = await apiFetch('/especialidade/listarEspecialidades');
            
            console.log('Especialidades recebidas:', specs);
            
            // limpa e adiciona o placeholder inicial
            selectEspecialidade.innerHTML = '<option value="" disabled selected>Selecione a Especialidade...</option>';
            
            if (Array.isArray(specs)) {
                specs.forEach(e => {
                    const idEspecialidade = e.id || e.idEspecialidade;
                    console.log(`Adicionando especialidade: ${e.nomeEspecialidade} com ID: ${idEspecialidade}`);
                    selectEspecialidade.innerHTML += `<option value="${idEspecialidade}">${e.nomeEspecialidade}</option>`;
                });
                
                // tambem preenche o select do modal de edição
                const selectEspecialidadeEdit = document.getElementById('especialidadeEdit');
                if (selectEspecialidadeEdit) {
                    selectEspecialidadeEdit.innerHTML = '<option value="" disabled selected>Selecione a Especialidade...</option>';
                    specs.forEach(e => {
                        const idEspecialidade = e.id || e.idEspecialidade;
                        selectEspecialidadeEdit.innerHTML += `<option value="${idEspecialidade}">${e.nomeEspecialidade}</option>`;
                    });
                }
            } else {
                console.warn("Resposta de Especialidades não é um array:", specs);
                selectEspecialidade.innerHTML = '<option value="" disabled selected>Erro ao carregar (API)</option>';
            }

        } catch (error) {
            console.error("ERRO GRAVE ao carregar Especialidades:", error);
            selectEspecialidade.innerHTML = '<option value="" disabled selected>Erro de Conexão/Token</option>';
        }
    }

    // --- FUNÇÕES DE CADASTRO (POST) ---

    // 1. Cadastrar Colaborador
    formColaborador.addEventListener('submit', async (e) => {
        e.preventDefault();
        

        if (!selectDepartamento.value || selectDepartamento.value === '') {
            alert('Selecione um departamento válido.');
            console.warn('Departamento não selecionado');
            return;
        }

        const departamentoId = parseInt(selectDepartamento.value);
        if (isNaN(departamentoId)) {
            alert('ID do departamento inválido.');
            console.error('departamentoId é NaN:', selectDepartamento.value);
            return;
        }

        const dados = {
            nomeColaborador: document.getElementById('nome').value.trim(),
            emailColaborador: document.getElementById('emailColaborador').value.trim(),
            senhaColaborador: document.getElementById('senhaColaborador').value.trim(), 
            departamentoId: departamentoId,
            status: document.getElementById('statusColaborador').value === 'Ativo'
        };

        console.log('Enviando dados do Colaborador:', dados);

        try {
            await apiFetch('/colaborador/cadastrarColaborador', {
                method: 'POST',
                body: JSON.stringify(dados)
            });
            alert('Colaborador cadastrado com sucesso!');
            carregarColaboradores(); // atualiza a tabela
            formColaborador.reset(); // limpa form
            // fechar modal (bootstrap)
            const modalElement = document.getElementById('modalColaborador');
            if (modalElement) {
                const modal = bootstrap.Modal.getInstance(modalElement) || new bootstrap.Modal(modalElement);
                modal.hide();
            }
        } catch (error) {
            console.error('Erro ao cadastrar:', error);
            alert('Erro ao cadastrar Colaborador: ' + error.message);
        }
    });

    // 2. Cadastrar Profissional
    formProfissional.addEventListener('submit', async (e) => {
        e.preventDefault();
        

        if (!selectEspecialidade.value || selectEspecialidade.value === '') {
            alert('Selecione uma especialidade válida.');
            console.warn('Especialidade não selecionada');
            return;
        }

        const especialidadeId = parseInt(selectEspecialidade.value);
        if (isNaN(especialidadeId)) {
            alert('ID da especialidade inválido.');
            console.error('especialidadeId é NaN:', selectEspecialidade.value);
            return;
        }

        const dados = {
            nomeProfissional: document.getElementById('nomeProfissional').value.trim(),
            emailProfissional: document.getElementById('emailProfissional').value.trim(),
            senhaProfissional: document.getElementById('senhaProfissional').value.trim(),
            especialidadeId: especialidadeId,
            status: document.getElementById('statusProfissional').value === 'Ativo'
        };

        console.log('Enviando dados do Profissional:', dados);

        try {
            await apiFetch('/profissional/cadastrarProfissional', {
                method: 'POST',
                body: JSON.stringify(dados)
            });
            alert('Profissional cadastrado com sucesso!');
            carregarProfissionais();
            formProfissional.reset();
            const modalElement = document.getElementById('modalProfissional');
            if (modalElement) {
                const modal = bootstrap.Modal.getInstance(modalElement) || new bootstrap.Modal(modalElement);
                modal.hide();
            }
        } catch (error) {
            console.error('Erro ao cadastrar:', error);
            alert('Erro ao cadastrar Profissional: ' + error.message);
        }
    });

    // --- FUNÇÕES DE BUSCA ---

    // Buscar Colaborador por Nome
    const inputBuscaColaborador = document.getElementById('buscaColaborador');
    if (inputBuscaColaborador) {
        inputBuscaColaborador.addEventListener('input', async (e) => {
            const nome = e.target.value.trim();
            
            if (nome.length === 0) {
                carregarColaboradores(); // Recarrega lista completa
                return;
            }

            // buscar apenas com 2 ou mais caracteres
            if (nome.length < 2) {
                console.log('Digite pelo menos 2 caracteres para buscar');
                return;
            }

            tabelaColaboradores.innerHTML = '<tr><td colspan="6">Buscando...</td></tr>';
            try {
                let resultado = await apiFetch(`/colaborador/buscarNomeColaborador?nomeColaborador=${encodeURIComponent(nome)}`);

                
                if (!resultado) {
                    tabelaColaboradores.innerHTML = '<tr><td colspan="6">Nenhum colaborador encontrado.</td></tr>';
                    return;
                }
                if (!Array.isArray(resultado)) {
                    
                    resultado = [resultado];
                }

                if (resultado.length === 0) {
                    tabelaColaboradores.innerHTML = '<tr><td colspan="6">Nenhum colaborador encontrado.</td></tr>';
                    return;
                }

                tabelaColaboradores.innerHTML = '';
                resultado.forEach(colab => {
                    const row = tabelaColaboradores.insertRow();
                    const email = colab.usuario?.email || 'undefined';
                    const departamento = colab.departamento?.nomeDepartamento || '-';
                    const status = colab.status ? 'Ativo' : 'Inativo';
                    
                    row.innerHTML = `
                        <td>${colab.nomeColaborador}</td>
                        <td>${email}</td>
                        <td>${departamento}</td>
                        <td>${status}</td>
                        <td>********</td>
                        <td>
                            <button class="btn-editar-colab" onclick="editarColaborador(${colab.idColaborador})">Editar</button>
                            <button class="btn-excluir" onclick="deletarColaborador(${colab.idColaborador})">Excluir</button>
                        </td>
                    `;
                });
            } catch (error) {
                console.error("Erro ao buscar colaboradores:", error);
                // tenta obter a resposta bruta do servidor para depuração
                try {
                    const debugRes = await fetch(`http://localhost:8080/colaborador/buscarNomeColaborador?nomeColaborador=${encodeURIComponent(nome)}`);
                    const debugText = await debugRes.text();
                    console.error('Resposta bruta do servidor (colaborador):', debugRes.status, debugText);
                } catch (e2) {
                    console.error('Falha ao obter resposta bruta do servidor (colaborador):', e2);
                }
                tabelaColaboradores.innerHTML = `<tr><td colspan="6" class="text-danger">Erro na busca: ${error.message}</td></tr>`;
            }
        });
    }

    // Buscar Profissional por Nome
    const inputBuscaProfissional = document.getElementById('buscaProfissional');
    if (inputBuscaProfissional) {
        inputBuscaProfissional.addEventListener('input', async (e) => {
            const nome = e.target.value.trim();
            
            if (nome.length === 0) {
                carregarProfissionais();
                return;
            }

            // Buscar apenas com 2 ou mais caracteres
            if (nome.length < 2) {
                console.log('Digite pelo menos 2 caracteres para buscar');
                return;
            }

            tabelaProfissionais.innerHTML = '<tr><td colspan="6">Buscando...</td></tr>';
            try {
                let resultado = await apiFetch(`/profissional/buscarNomeProfissional?nomeProfissional=${encodeURIComponent(nome)}`);

                
                if (!resultado) {
                    tabelaProfissionais.innerHTML = '<tr><td colspan="6">Nenhum profissional encontrado.</td></tr>';
                    return;
                }
                if (!Array.isArray(resultado)) {
                    resultado = [resultado];
                }

                if (resultado.length === 0) {
                    tabelaProfissionais.innerHTML = '<tr><td colspan="6">Nenhum profissional encontrado.</td></tr>';
                    return;
                }

                tabelaProfissionais.innerHTML = '';
                resultado.forEach(prof => {
                    const row = tabelaProfissionais.insertRow();
                    const email = prof.usuario?.email || 'undefined';
                    const especialidade = prof.especialidade?.nomeEspecialidade || '-';
                    const status = prof.status ? 'Ativo' : 'Inativo';
                    
                    row.innerHTML = `
                        <td>${prof.nomeProfissional}</td>
                        <td>${email}</td>
                        <td>${especialidade}</td>
                        <td>${status}</td>
                        <td>********</td>
                        <td>
                            <button class="btn-editar-prof" onclick="editarProfissional(${prof.idProfissional})">Editar</button>
                            <button class="btn-excluir" onclick="deletarProfissional(${prof.idProfissional})">Excluir</button>
                        </td>
                    `;
                });
            } catch (error) {
                console.error("Erro ao buscar profissionais:", error);
                // tenta obter a resposta bruta do servidor para depuração
                try {
                    const debugRes = await fetch(`http://localhost:8080/profissional/buscarNomeProfissional?nomeProfissional=${encodeURIComponent(nome)}`);
                    const debugText = await debugRes.text();
                    console.error('Resposta bruta do servidor (profissional):', debugRes.status, debugText);
                } catch (e2) {
                    console.error('Falha ao obter resposta bruta do servidor (profissional):', e2);
                }
                tabelaProfissionais.innerHTML = `<tr><td colspan="6" class="text-danger">Erro na busca: ${error.message}</td></tr>`;
            }
        });
    }

    // --- FUNÇÕES DE EDIÇÃO (PUT) ---

    // 1. Editar Colaborador
    const formColaboradorEdit = document.getElementById('formColaboradorEdit');
    if (formColaboradorEdit) {
        formColaboradorEdit.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const id = formColaboradorEdit.dataset.id;
            const dados = {
                nomeColaborador: document.getElementById('nomeEdit').value.trim(),
                emailColaborador: document.getElementById('emailEdit').value.trim(),
                departamentoId: parseInt(document.getElementById('departamentoEdit').value),
                status: document.getElementById('statusEdit').value === 'Ativo'
            };

            // Adiciona senha apenas se foi preenchida
            if (document.getElementById('senhaEdit').value.trim()) {
                dados.senhaColaborador = document.getElementById('senhaEdit').value.trim();
            }

            console.log('Atualizando colaborador com dados:', dados);

            try {
                await apiFetch(`/colaborador/editarColaborador/${id}`, {
                    method: 'PUT',
                    body: JSON.stringify(dados)
                });
                alert('Colaborador atualizado com sucesso!');
                carregarColaboradores();
                formColaboradorEdit.reset();
                const modalElement = document.getElementById('modalColaboradorEdit');
                if (modalElement) {
                    const modal = bootstrap.Modal.getInstance(modalElement);
                    if (modal) modal.hide();
                }
            } catch (error) {
                console.error('Erro ao atualizar:', error);
                alert('Erro ao atualizar Colaborador: ' + error.message);
            }
        });
    }

    // 2. Editar Profissional
    const formProfissionalEdit = document.getElementById('formProfissionalEdit');
    if (formProfissionalEdit) {
        formProfissionalEdit.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const id = formProfissionalEdit.dataset.id;
            const dados = {
                nomeProfissional: document.getElementById('nomeProfissionalEdit').value.trim(),
                emailProfissional: document.getElementById('emailProfissionalEdit').value.trim(),
                especialidadeId: parseInt(document.getElementById('especialidadeEdit').value),
                status: document.getElementById('statusProfissionalEdit').value === 'Ativo'
            };

            // Adiciona senha apenas se foi preenchida
            if (document.getElementById('senhaProfissionalEdit').value.trim()) {
                dados.senhaProfissional = document.getElementById('senhaProfissionalEdit').value.trim();
            }

            console.log('Atualizando profissional com dados:', dados);

            try {
                await apiFetch(`/profissional/editarProfissional/${id}`, {
                    method: 'PUT',
                    body: JSON.stringify(dados)
                });
                alert('Profissional atualizado com sucesso!');
                carregarProfissionais();
                formProfissionalEdit.reset();
                const modalElement = document.getElementById('modalProfissionalEdit');
                if (modalElement) {
                    const modal = bootstrap.Modal.getInstance(modalElement);
                    if (modal) modal.hide();
                }
            } catch (error) {
                console.error('Erro ao atualizar:', error);
                alert('Erro ao atualizar Profissional: ' + error.message);
            }
        });
    }

    // --- INICIALIZAÇÃO ---
    carregarOpcoes();
    carregarColaboradores();
    carregarProfissionais();
});

// Funções globais para Delete e Editar
window.editarColaborador = async (id) => {
    try {
        // Tentando buscar via PUT

        
        console.log(`Abrindo edição do colaborador ID: ${id}`);
        
        document.getElementById('nomeEdit').value = '';
        document.getElementById('emailEdit').value = '';
        document.getElementById('departamentoEdit').value = '';
        document.getElementById('statusEdit').value = 'Ativo';
        document.getElementById('senhaEdit').value = '';
        
        // armazena o ID para usar no submit
        document.getElementById('formColaboradorEdit').dataset.id = id;
        

        const modalElement = document.getElementById('modalColaboradorEdit');
        if (modalElement) {
            const modal = new bootstrap.Modal(modalElement);
            modal.show();
        }
    } catch (error) {
        console.error("Erro ao editar colaborador:", error);
        alert('Erro ao abrir edição: ' + error.message);
    }
};

window.editarProfissional = async (id) => {
    try {
        console.log(`Abrindo edição do profissional ID: ${id}`);
        
        document.getElementById('nomeProfissionalEdit').value = '';
        document.getElementById('emailProfissionalEdit').value = '';
        document.getElementById('especialidadeEdit').value = '';
        document.getElementById('statusProfissionalEdit').value = 'Ativo';
        document.getElementById('senhaProfissionalEdit').value = '';
        

        document.getElementById('formProfissionalEdit').dataset.id = id;
        

        const modalElement = document.getElementById('modalProfissionalEdit');
        if (modalElement) {
            const modal = new bootstrap.Modal(modalElement);
            modal.show();
        }
    } catch (error) {
        console.error("Erro ao editar profissional:", error);
        alert('Erro ao abrir edição: ' + error.message);
    }
};

window.deletarColaborador = async (id) => {
    if(window.confirm('Tem certeza que deseja excluir o Colaborador?')) {
        try {
            console.log(`Deletando colaborador ID: ${id}`);
            await apiFetch(`/colaborador/deletar/${id}`, { method: 'DELETE' });
            alert('Colaborador excluído com sucesso!');
            window.location.reload(); 
        } catch (error) {
            console.error("Erro ao excluir:", error);
            alert('Erro ao excluir: ' + error.message);
        }
    }
};

window.deletarProfissional = async (id) => {
    if(window.confirm('Tem certeza que deseja excluir o Profissional?')) {
        try {
            console.log(`Deletando profissional ID: ${id}`);
            await apiFetch(`/profissional/deletar/${id}`, { method: 'DELETE' });
            alert('Profissional excluído com sucesso!');
            window.location.reload();
        } catch (error) {
            console.error("Erro ao excluir:", error);
            alert('Erro ao excluir: ' + error.message);
        }
    }
};