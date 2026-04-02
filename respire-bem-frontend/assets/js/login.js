document.addEventListener('DOMContentLoaded', () => {
    // Endpoints e URLs de redirecionamento
    const ENDPOINTS = {
        empresa: '/auth/login',
        profissional: '/auth/login',
        colaborador: '/auth/login'
    };

    const REDIRECTS = {
        empresa: 'pages/empresa/tela-inicial-empresa.html',
        profissional: 'pages/profissional/tela-inicial-profissional.html',
        colaborador: 'pages/colaborador/tela-inicial-colaborador.html'
    };

    // função para decodificar JWT e extrair o role
    function decodeToken(token) {
        try {
            const payload = token.split('.')[1];
            const decoded = JSON.parse(atob(payload));
            return decoded;
        } catch (e) {
            console.error("Erro ao decodificar token:", e);
            return null;
        }
    }

    // função genérica para lidar com o login
    async function handleLogin(e, tipoUsuario) {
        e.preventDefault();
        
        const form = e.target;
        
        // identifica campo baseados no tipo de usuário
        const emailId = `loginEmail${tipoUsuario.charAt(0).toUpperCase() + tipoUsuario.slice(1)}`;
        const senhaId = `loginSenha${tipoUsuario.charAt(0).toUpperCase() + tipoUsuario.slice(1)}`;
        
        const email = document.getElementById(emailId).value;
        const senha = document.getElementById(senhaId).value;
        const btn = form.querySelector('button[type="submit"]');

        if (!email || !senha) {
            console.error("Email e senha são obrigatórios.");
            return;
        }

        btn.disabled = true;
        btn.textContent = 'Entrando...';

        try {
            const endpoint = ENDPOINTS[tipoUsuario];
            
            // 1. chamada à API
            const responseData = await apiFetch(endpoint, {
                method: 'POST',
                body: JSON.stringify({ email: email, senha: senha })
            });

            // 2. armazenamento do Token JWT
            if (responseData && responseData.token) {
                localStorage.setItem('jwt_token', responseData.token);
                
                // 3. decodificar token para descobrir o role do usuário
                const decodedToken = decodeToken(responseData.token);
                let userRole = decodedToken?.role || decodedToken?.authorities?.[0] || tipoUsuario.toUpperCase();
                
                // normalizar o role (remover ROLE_ se existir)
                userRole = userRole.replace('ROLE_', '').toLowerCase();
                localStorage.setItem('user_role', userRole);
                
                // 4. mapear role para rota de redirecionamento
                const roleRedirectMap = {
                    'empresa': 'pages/empresa/tela-inicial-empresa.html',
                    'profissional': 'pages/profissional/tela-inicial-profissional.html',
                    'colaborador': 'pages/colaborador/tela-inicial-colaborador.html'
                };
                
                const redirectUrl = roleRedirectMap[userRole] || REDIRECTS[tipoUsuario];
                
                // 5. redirecionamento
                window.location.href = redirectUrl;
            } else {
                throw new Error("Resposta de token inválida da API.");
            }

        } catch (error) {
            console.error(`Falha no login (${tipoUsuario}):`, error);
            alert(`Erro ao tentar login: ${error.message || 'Credenciais inválidas ou erro de conexão.'}`);
            btn.disabled = false;
            btn.textContent = 'Entrar';
        }
    }

    // --- Vinculando Event Listeners aos Formulários ---
    
    // Login Empresa
    const formEmpresa = document.querySelector('#modalEmpresa form');
    if (formEmpresa) {
        formEmpresa.addEventListener('submit', (e) => handleLogin(e, 'empresa'));
    }

    // Login Profissional
    const formProfissional = document.querySelector('#modalProfissional form');
    if (formProfissional) {
        formProfissional.addEventListener('submit', (e) => handleLogin(e, 'profissional'));
    }
    
    // Login Colaborador
    const formColaborador = document.querySelector('#modalColaborador form');
    if (formColaborador) {
        formColaborador.addEventListener('submit', (e) => handleLogin(e, 'colaborador'));
    }
});