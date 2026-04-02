document.addEventListener('DOMContentLoaded', function() {

  // --- CÓDIGO DA BOLA DE RESPIRAÇÃO (Já existia) ---
  const bola = document.getElementById('bolaRespiracao');
  const texto = document.getElementById('textoRespiracao');
  
  let animando = false;
  let timerInspire, timerSegure, timerExpire; 

  function iniciarCicloTexto() {
    if (!animando) return; 
    texto.textContent = 'Inspire...';
    timerInspire = setTimeout(() => { if (animando) texto.textContent = 'Segure...'; }, 4000); 
    timerSegure = setTimeout(() => { if (animando) texto.textContent = 'Expire...'; }, 8000); 
    timerExpire = setTimeout(iniciarCicloTexto, 14000); 
  }

  bola.onclick = function() {
    if (!animando) {
      animando = true;
      bola.classList.add('animando');
      iniciarCicloTexto(); 
    } else {
      animando = false;
      bola.classList.remove('animando');
      texto.textContent = 'Clique para Iniciar';
      clearTimeout(timerInspire);
      clearTimeout(timerSegure);
      clearTimeout(timerExpire);
    }
  };

  // --- SELEÇÃO DE HUMOR  ---
  
  // 1. Pega todos os elementos com a classe "mood"
  const moods = document.querySelectorAll('.mood');

  // 2. Para cada ícone de humor...
  moods.forEach(mood => {
    // 3. Adiciona um "ouvidor" de clique
    mood.addEventListener('click', function() {
      
      // A. Remove a classe 'selected' de TODOS os ícones primeiro (limpa a seleção anterior)
      moods.forEach(m => m.classList.remove('selected'));

      // B. Adiciona a classe 'selected' APENAS no ícone que foi clicado agora
      this.classList.add('selected');
      
    });
  });

});