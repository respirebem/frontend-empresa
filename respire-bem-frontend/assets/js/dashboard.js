document.addEventListener('DOMContentLoaded', async () => {
    try {
        // Busca os dados do dashboard da API
        const dados = await apiFetch('/dashboard/dados?dias=15');
        
        console.log('Dados do Dashboard:', dados);
        
        // --- GRÁFICO 1: Linha (Histórico de Bem-estar) ---
        if (dados.historicoBemEstar && dados.historicoBemEstar.length > 0) {
            const labels1 = dados.historicoBemEstar.map(item => {
                const data = new Date(item.data);
                return data.toLocaleDateString('pt-BR', { month: 'short', day: 'numeric' });
            });
            
            const values1 = dados.historicoBemEstar.map(item => item.media);
            
            const ctx1 = document.getElementById('graficoSentimento');
            new Chart(ctx1, {
                type: 'line',
                data: {
                    labels: labels1,
                    datasets: [{
                        label: 'Nível de Bem-estar (Média)',
                        data: values1,
                        borderColor: '#3E9CB2',
                        backgroundColor: 'rgba(62, 156, 178, 0.1)',
                        tension: 0.4,
                        fill: true
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                        y: { beginAtZero: true, max: 5 }
                    }
                }
            });
        }
        
        // --- GRÁFICO 2: Rosca (Taxa de Adesão ao Check-in) ---
        if (dados.totalColaboradores > 0) {
            const ctx2 = document.getElementById('graficoAdesao');
            new Chart(ctx2, {
                type: 'doughnut',
                data: {
                    labels: ['Realizaram Check-in', 'Não Realizaram'],
                    datasets: [{
                        data: [dados.totalCheckInsHoje, dados.naoRealizaramCheckIn],
                        backgroundColor: [
                            '#639D8C', 
                            '#e0e0e0' 
                        ],
                        borderWidth: 0
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                }
            });
        }
        
        // --- GRÁFICO 3: Barras (Contagem de Sentimentos) ---
        if (dados.contagemSentimentos && Object.keys(dados.contagemSentimentos).length > 0) {
            // Mapeia os sentimentos para Labels em português
            const sentimentoLabels = {
                'FELIZ': '😊 Feliz',
                'BEM': '🙂 Bem',
                'NEUTRO': '😐 Neutro (a)',
                'DESANIMADO': '😕 Desanimado (a)',
                'TRISTE': '😢 Triste',
                'IRRITADO': '😠 Irritado (a)'
            };
            
            // Cores para cada sentimento
            const sentimentoCores = {
                'FELIZ': '#2E7D32',        
                'BEM': '#AFB42B',          
                'NEUTRO': '#F57C00',       
                'DESANIMADO': '#546E7A',   
                'TRISTE': '#1565C0',       
                'IRRITADO': '#C62828'      
            };
            
            const labels3 = Object.keys(dados.contagemSentimentos).map(s => sentimentoLabels[s] || s);
            const values3 = Object.values(dados.contagemSentimentos);
            const cores3 = Object.keys(dados.contagemSentimentos).map(s => sentimentoCores[s] || '#999');
            
            const ctx3 = document.getElementById('graficoTopicos');
            new Chart(ctx3, {
                type: 'bar',
                data: {
                    labels: labels3,
                    datasets: [{
                        label: 'Nº de Relatos',
                        data: values3,
                        backgroundColor: cores3,
                        borderRadius: 5
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: { display: false }
                    }
                }
            });
        }
        
    } catch (error) {
        console.error("Erro ao carregar dados do dashboard:", error);
        alert('Erro ao carregar dados do dashboard: ' + error.message);
    }
});
