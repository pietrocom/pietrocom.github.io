// assets/js/portfolio.js

document.addEventListener("DOMContentLoaded", () => {
    const GITHUB_USERNAME = 'pietrocom'; 
    fetchGithubProjects(GITHUB_USERNAME);
});

async function fetchGithubProjects(username) {
    const grid = document.getElementById('portfolio-grid');
    const loadingMessage = document.getElementById('loading-message');
    const errorMessage = document.getElementById('error-message');
    
    // API URL para buscar repositórios, ordenados pelo mais recente, pegando até 9.
    const apiUrl = `https://api.github.com/users/${username}/repos?sort=updated&per_page=9`;

    // Cache na sessão para evitar sobrecarregar a API em múltiplos reloads da página.
    const cachedData = sessionStorage.getItem('github_projects');
    if (cachedData) {
        renderProjects(JSON.parse(cachedData));
        return;
    }

    try {
        const response = await fetch(apiUrl);
        if (!response.ok) {
            throw new Error(`Erro na API: ${response.status}`);
        }
        const data = await response.json();
        
        // Salva os dados no cache da sessão para uso futuro.
        sessionStorage.setItem('github_projects', JSON.stringify(data));
        
        renderProjects(data);

    } catch (error) {
        console.error("Falha ao buscar projetos do GitHub:", error);
        if(loadingMessage) loadingMessage.style.display = 'none';
        if(errorMessage) errorMessage.style.display = 'block';
    }

    function renderProjects(projects) {
        if (!grid) return; // Sai da função se o grid não existir na página

        // Filtra para não mostrar repositórios que são 'forks' e que não têm descrição.
        const filteredProjects = projects.filter(project => !project.fork && project.description);
        
        let projectsHTML = '';
        if (filteredProjects.length === 0) {
            projectsHTML = `<div id="error-message" style="display: block;">
                                <i class="fas fa-box-open"></i> Nenhum projeto público com descrição foi encontrado para exibir.
                            </div>`;
        } else {
            filteredProjects.forEach(project => {
                // Cria o HTML para cada card de projeto.
                projectsHTML += `
                    <a href="${project.html_url}" target="_blank" rel="noopener noreferrer" class="portfolio-card">
                        <div class="card-header">
                            <i class="fab fa-github"></i>
                            <h3>${project.name.replace(/[-_]/g, ' ')}</h3>
                        </div>
                        <div class="card-body">
                            <p>${project.description}</p>
                        </div>
                        <div class="card-footer">
                            <div class="card-stats">
                                <span><i class="fas fa-star"></i> ${project.stargazers_count}</span>
                                <span><i class="fas fa-code-branch"></i> ${project.forks_count}</span>
                            </div>
                            <div class="card-language">
                                ${project.language || 'N/A'}
                            </div>
                        </div>
                    </a>
                `;
            });
        }

        if(loadingMessage) loadingMessage.style.display = 'none';
        grid.innerHTML = projectsHTML;
    }
}