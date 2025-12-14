// assets/js/portfolio.js

document.addEventListener("DOMContentLoaded", () => {
    const GITHUB_USERNAME = 'pietrocom';
    
    // Formato: 'proprietario/nome-do-repositorio'
    const EXTRA_REPOS = [
        'Smart-Concierge/Model',
        'Smart-Concierge/Dataset'
    ];

    fetchGithubProjects(GITHUB_USERNAME, EXTRA_REPOS);
});

async function fetchGithubProjects(username, extraReposList = []) {
    const grid = document.getElementById('portfolio-grid');
    const loadingMessage = document.getElementById('loading-message');
    const errorMessage = document.getElementById('error-message');
    
    const userApiUrl = `https://api.github.com/users/${username}/repos?sort=updated&per_page=10`;

    // Tenta recuperar cache
    const cachedData = sessionStorage.getItem('github_projects_full');
    if (cachedData) {
        renderProjects(JSON.parse(cachedData));
        return;
    }

    try {
        // 1. Busca seus repositórios pessoais
        const userResponse = await fetch(userApiUrl);
        if (!userResponse.ok) throw new Error(`Erro API Usuário: ${userResponse.status}`);
        let userRepos = await userResponse.json();

        // 2. Busca os repositórios extras (Organizações) individualmente
        const extraReposPromises = extraReposList.map(async (repoFullName) => {
            const url = `https://api.github.com/repos/${repoFullName}`;
            const resp = await fetch(url);
            if (!resp.ok) {
                console.warn(`Não foi possível carregar o repo extra: ${repoFullName}`);
                return null;
            }
            return resp.json();
        });

        const extraRepos = await Promise.all(extraReposPromises);
        
        // Remove nulos (caso algum repo extra tenha falhado)
        const validExtraRepos = extraRepos.filter(repo => repo !== null);

        // --- SEU PROJETO MANUAL ---
        const manualProjects = [
            {
                id: 'deep-hochuli-research',
                name: "DeepHochuli (Undergrad Research)", 
                html_url: "assets/docs/relatórioIC.pdf", 
                
                description: "Investigating the singularity of ReLU at z=0 and its impact on Deep CNN training dynamics. This research analyzes how numerical precision (FP32/FP64) and hardware arithmetic influence gradient flow and neuron death near the origin.",
                
                stargazers_count: "🔒", 
                forks_count: 0,
                language: "Python (PyTorch)",
                fork: false,
                pushed_at: new Date().toISOString() 
            }
        ];

        // 3. Junta tudo em uma única lista
        let allProjects = [...manualProjects, ...userRepos, ...validExtraRepos];

        // 4. Remove duplicatas e aplica filtros
        const filteredProjects = allProjects.filter((project, index, self) => 
            index === self.findIndex((t) => t.id === project.id) && // Remove duplicatas por ID
            !project.fork && 
            project.description 
        );

        // 5. Ordena novamente por data de atualização (mais recente primeiro)
        filteredProjects.sort((a, b) => new Date(b.pushed_at) - new Date(a.pushed_at));

        // Pega apenas os 9 primeiros após a mistura
        const finalSelection = filteredProjects.slice(0, 9);

        // Salva no cache
        sessionStorage.setItem('github_projects_full', JSON.stringify(finalSelection));
        
        renderProjects(finalSelection);

    } catch (error) {
        console.error("Falha ao buscar projetos do GitHub:", error);
        if(loadingMessage) loadingMessage.style.display = 'none';
        if(errorMessage) errorMessage.style.display = 'block';
    }

    function renderProjects(projects) {
        if (!grid) return;
        
        let projectsHTML = '';
        
        if (projects.length === 0) {
            projectsHTML = `<div id="error-message" style="display: block;">
                                <i class="fas fa-box-open"></i> Nenhum projeto público encontrado.
                            </div>`;
        } else {
            projects.forEach(project => {
                // Lógica para abrir PDF em nova aba ou link normal
                // Se for o PDF manual, garantimos que funcione bem
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
                                ${project.language || 'Code'}
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