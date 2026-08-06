# Respire Bem - Frontend Empresa

Este README é um guia para o repositório do front-end do projeto **Respire Bem**.
Ele descreve como configurar a aplicação no Apache/XAMPP e como consumir as rotas do backend.

## Visão geral
O front-end oferece a interface para empresas gerenciarem o bem-estar de seus colaboradores.
A aplicação consome o backend Spring Boot rodando em `http://localhost:8080` e exibe funcionalidades de cadastro, lista, check-in e dashboard.

## Principais funcionalidades
- Login e autenticação do usuário
- Cadastro inicial de empresa e administrador
- Visualização de dados da empresa
- Cadastro e listagem de colaboradores
- Cadastro e listagem de profissionais e especialidades
- Consulta de departamentos
- Registro e histórico de check-ins
- Dashboard com métricas agregadas

## Tecnologias
- HTML
- CSS
- JavaScript
- Apache (XAMPP)
- Consumo de API REST

## Rotas do backend utilizadas
### Autenticação
- `POST /auth/registrar/empresa` - registra empresa e usuário ADMIN
- `POST /auth/login` - autentica e retorna token JWT

### Empresa
- `GET /empresa/meus-dados` - obtém dados da empresa autenticada
- `PUT /empresa/atualizar-dados?nomeEmpresa={nome}&cnpjEmpresa={cnpj}` - atualiza empresa

### Usuário (role ADMIN)
- `GET /usuario/listarUsuarios` - lista usuários
- `PUT /usuario/alterar-credenciais/{idUsuario}?novoEmail={email}&novaSenha={senha}` - altera credenciais
- `DELETE /usuario/deletar/{idUsuario}` - deleta usuário

### Departamento
- `GET /departamento/listarDepartamentos` - lista departamentos

### Especialidade
- `GET /especialidade/listarEspecialidades` - lista especialidades

### Colaborador
- `POST /colaborador/cadastrarColaborador` - cadastra colaborador
- `GET /colaborador/listarColaboradores` - lista colaboradores
- `GET /colaborador/buscarNomeColaborador?nomeColaborador={nome}` - busca colaborador
- `PUT /colaborador/editarColaborador/{idColaboradorAlterar}` - atualiza colaborador
- `DELETE /colaborador/deletar/{idColaborador}` - remove colaborador

### Profissional
- `POST /profissional/cadastrarProfissional` - cadastra profissional
- `GET /profissional/listarProfissionais` - lista profissionais
- `GET /profissional/buscarNomeProfissional?nomeProfissional={nome}` - busca profissional
- `PUT /profissional/editarProfissional/{idProfissionalAlterar}` - atualiza profissional
- `DELETE /profissional/deletar/{idProfissional}` - remove profissional

### Check-in
- `POST /checkin/fazerCheckIn` - registra check-in de colaborador
- `GET /checkin/historico` - obtém histórico de check-ins

### Dashboard
- `GET /dashboard/dados` - retorna dados agregados para gráficos ou visão geral

## Configuração local do front-end
### Pré-requisitos
- XAMPP instalado com Apache
- Backend rodando em `http://localhost:8080` (ou em uma URL pública do ngrok)
- Git

### Passo a passo para rodar o front-end com Apache/XAMPP
1. Clone o repositório front-end:
   - `git clone https://github.com/respirebem/frontend-empresa.git`
2. Copie a pasta do front-end para o diretório do Apache:
   - Normalmente `C:\xampp\htdocs\frontend-empresa`
3. Ajuste a URL do backend na configuração do front-end:
   - Abra o arquivo `assets/js/api.js`
   - Altere a constante `API_BASE_URL` para o endereço do backend atual.
   - Use a URL do backend que estiver disponível: `http://localhost:8080` ou a URL pública do ngrok.
4. Inicie o Apache pelo painel do XAMPP.
5. Abra o navegador e acesse a aplicação usando a porta configurada do Apache:
   - Exemplo padrão: `http://localhost/frontend-empresa`
   - Se o Apache estiver em outra porta: `http://localhost:<porta>/frontend-empresa`
   - Exemplo de porta customizada: `http://localhost:8081/frontend-empresa`

> Observação: o front-end pode rodar em uma porta diferente do backend, então não há conflito entre Apache e Spring Boot.

### Como usar em conjunto com o backend
1. Execute o backend localmente ou exponha-o com ngrok:
   - Local: `./mvnw.cmd spring-boot:run` na pasta `empresa`
   - ngrok: `ngrok http 8080` e use a URL pública gerada (`https://xxxxxx.ngrok.io`).
   - Se o Apache estiver em `http://localhost:8081`, o front-end acessa o backend em `http://localhost:8080` ou na URL do ngrok.
2. Ajuste no front-end a base URL da API para a URL do backend atual.
3. Use o front-end para criar a empresa e o usuário ADMIN via `/auth/registrar/empresa`.
4. Faça login via `/auth/login`.
5. O front-end deve armazenar o token JWT e enviar o header `Authorization: Bearer <token>` para rotas protegidas.

### Observações de integração
- Se o front-end estiver em outro host ou porta, ajuste a origem no backend para evitar problemas de CORS.
- Verifique se a aplicação front-end está usando a URL correta do backend ao consumir as APIs.
- Se o backend estiver exposto por ngrok, use a URL do ngrok em vez de `http://localhost:8080`.
- Se o Apache estiver em porta não padrão, abra a URL correta com a porta configurada.

## Dicas para depuração
- Abra o console do navegador para ver requisições e respostas da API.
- Confirme que o token JWT está sendo enviado em `Authorization`.
- Valide se o backend responde corretamente no Swagger em `http://localhost:8080/swagger-ui.html`.

## Status da integração
- Front-end preparado para consumir o backend do Respire Bem
- Integração via Apache/XAMPP suportada
- Rotas de login, cadastro, colaboradores, profissionais, check-ins e dashboard disponíveis
