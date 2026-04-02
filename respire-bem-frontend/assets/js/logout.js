//logout.js 

// Função de logout global
window.fazerLogout = function() {
    // limpa dados de autenticação
    localStorage.removeItem('jwt_token');
    localStorage.removeItem('user_role');
    
    console.log('Usuário desconectado. Limpando dados de sessão...');
    
    // redireciona para a página inicial (ladingpage do projeto)
    window.location.href = window.location.pathname.includes('/pages/') 
        ? '../../index.html' 
        : '../index.html';
};


document.addEventListener('DOMContentLoaded', () => {
    // encontra todos os botões/links que devem fazer logout
    // procura por: classe 'sair', texto contendo 'Sair', ou href para index.html
    
    //elementos com classe 'sair'
    const elementosSair = document.querySelectorAll('.sair');
    elementosSair.forEach(el => {
        el.addEventListener('click', (e) => {
            e.preventDefault();
            window.fazerLogout();
        });
    });
    
    //links por href que contenham "index.html"
    const todosLinks = document.querySelectorAll('a[href*="index.html"]');
    todosLinks.forEach(link => {
        const textoLink = link.textContent.trim().toLowerCase();
        if (textoLink.includes('sair') || textoLink.includes('logout')) {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                window.fazerLogout();
            });
        }
    });
    
    //elemento com onclick contendo 'sair' ou 'logout'
    const todosElementos = document.querySelectorAll('[onclick*="sair"], [onclick*="logout"]');
    todosElementos.forEach(el => {
        el.addEventListener('click', (e) => {
            e.preventDefault();
            window.fazerLogout();
        });
    });
});
