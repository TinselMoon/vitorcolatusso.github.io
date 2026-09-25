// --- Configuração dos Projetos Automáticos (API do GitHub) ---
// Basta adicionar o nome do seu usuário e repositório nesta lista
const meusRepositorios = [
    "TinselMoon/stalingrado",          // Exemplo
    "TinselMoon/collision_simulator_3D",          // Exemplo
    "TinselMoon/Pendulo_OHA",         // Exemplo
    "TinselMoon/collision_simulator"
];

const projetosContainer = document.getElementById('projetos-container');

async function carregarProjetos() {
    if (!projetosContainer) return;
    
    projetosContainer.innerHTML = '<p style="text-align: center; width: 100%;">Carregando projetos diretamente do GitHub...</p>';
    
    try {
        const htmlProjetos = await Promise.all(meusRepositorios.map(async (repo) => {
            const response = await fetch(`https://api.github.com/repos/${repo}`);
            if (!response.ok) throw new Error(`Repositório ${repo} não encontrado`);
            
            const data = await response.json();
            
            return `
                <div class="projeto-card content-section">
                    <div class="projeto-info">
                        <h3>${data.name}</h3>
                        <p>${data.description ? data.description : 'Nenhuma descrição fornecida no repositório.'}</p>
                        <div class="tech-tags">
                            ${data.language ? `<span>${data.language}</span>` : ''}
                            <span title="Estrelas no GitHub">⭐ ${data.stargazers_count}</span>
                        </div>
                        <div class="projeto-links">
                            <a href="${data.html_url}" target="_blank" class="btn-link"><i class="fab fa-github"></i> Acessar Repositório</a>
                        </div>
                    </div>
                </div>
            `;
        }));
        
        projetosContainer.innerHTML = htmlProjetos.join('');
        aplicarAnimacoes(); // Reaplica as animações de scroll aos novos cards renderizados
    } catch (error) {
        console.error('Erro ao buscar projetos do GitHub:', error);
        projetosContainer.innerHTML = '<p style="text-align: center; color: #ff5555; width: 100%;">Erro ao carregar os projetos. Verifique se os nomes dos repositórios no script.js estão corretos.</p>';
    }
}

// Inicializa o fetch quando a página terminar de carregar
document.addEventListener('DOMContentLoaded', carregarProjetos);


// --- Efeitos Visuais (Scroll e Animações) ---
window.addEventListener('scroll', () => {
    const header = document.querySelector('header');
    if (window.scrollY > 50) {
        header.style.backgroundColor = 'rgba(15, 23, 42, 0.98)';
        header.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1)';
    } else {
        header.style.backgroundColor = 'rgba(15, 23, 42, 0.9)';
        header.style.boxShadow = 'none';
    }
});

const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1
};

const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if(entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

function aplicarAnimacoes() {
    document.querySelectorAll('.content-section, .projeto-card').forEach(elemento => {
        // Apenas aplica se ainda não foi animado
        if (elemento.style.opacity !== '1') {
            elemento.style.opacity = '0';
            elemento.style.transform = 'translateY(20px)';
            elemento.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
            observer.observe(elemento);
        }
    });
}

// Aplica aos elementos iniciais que já estão no HTML
aplicarAnimacoes();
