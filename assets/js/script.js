// assets/js/script.js

// Função para carregar HTML de outro arquivo
function loadComponent(id, file, callback) {
    fetch(file)
        .then(response => response.text())
        .then(data => {
            document.getElementById(id).innerHTML = data;
            if (callback) callback();
        })
        .catch(error => console.log('Erro ao carregar ' + file, error));
}

// Carregar Header e Footer e depois configurar os scripts
document.addEventListener("DOMContentLoaded", function () {
    loadComponent("header-container", "header.html", function () {
        // As funções de navegação agora são chamadas APÓS o header ser carregado
        setupSmoothScroll();
        setupMobileMenu();
    });
    loadComponent("footer-container", "footer.html", function() {
        // Garante que os links do footer também funcionem
        setupSmoothScroll();
    });
});

// =========================================================================
// === LÓGICA DE NAVEGAÇÃO REESCRITA (A CORREÇÃO ESTÁ AQUI) ===
// =========================================================================
function setupSmoothScroll() {
    // Seleciona todos os links importantes da navegação
    document.querySelectorAll('.desktop-nav a, .mobile-menu a, .footer-column a, .initials-button').forEach(anchor => {
        // Evita adicionar o mesmo listener múltiplas vezes
        if (anchor.dataset.listenerAttached) return;
        anchor.dataset.listenerAttached = 'true';

        anchor.addEventListener('click', function(e) {
            // Ignora links que abrem em nova aba ou são para download
            if (this.hasAttribute('download') || this.getAttribute('target') === '_blank') {
                return;
            }

            // Constrói URLs completos para uma comparação segura
            const targetUrl = new URL(this.href);
            const currentUrl = new URL(window.location.href);

            // Verifica se o caminho da URL é o mesmo (ex: /index.html vs /portfolio.html)
            // A comparação ignora o hash (#)
            const isSamePage = targetUrl.pathname === currentUrl.pathname;

            // Se for um link para a MESMA PÁGINA e tiver um hash (#), faz a rolagem suave
            if (isSamePage && targetUrl.hash) {
                e.preventDefault(); // Previne o salto brusco do navegador
                const targetId = targetUrl.hash.substring(1);
                const targetElement = document.getElementById(targetId);

                if (targetElement) {
                    smoothScrollTo(targetElement);
                    history.pushState(null, null, targetUrl.hash);
                }
                
                // Fecha o menu mobile se estiver aberto
                const mobileMenu = document.querySelector('.mobile-menu');
                if (mobileMenu && mobileMenu.classList.contains('active')) {
                    toggleMobileMenu();
                }
            }
            // Se for um link para OUTRA PÁGINA (ex: de portfolio.html para index.html#about),
            // a condição 'if' acima será falsa. Nada acontece aqui, e o navegador
            // segue seu comportamento padrão: carregar a nova página e rolar para a âncora.
        });
    });
}

function smoothScrollTo(targetElement) {
    const headerOffset = 90; // Espaço para o header fixo
    const elementPosition = targetElement.getBoundingClientRect().top;
    const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

    window.scrollTo({
        top: offsetPosition,
        behavior: "smooth"
    });
}

// Mobile Menu Functionality (sem alterações)
function setupMobileMenu() {
    const menuToggle = document.querySelector('.menu-toggle');
    const mobileMenu = document.querySelector('.mobile-menu');
    
    if (menuToggle && mobileMenu) {
        menuToggle.addEventListener('click', function(e) {
            e.stopPropagation();
            toggleMobileMenu();
        });
        
        document.addEventListener('click', function(e) {
            if (!mobileMenu.contains(e.target) && e.target !== menuToggle && mobileMenu.classList.contains('active')) {
                toggleMobileMenu();
            }
        });
    }
}

function toggleMobileMenu() {
    const menuToggle = document.querySelector('.menu-toggle');
    const mobileMenu = document.querySelector('.mobile-menu');
    
    if (menuToggle && mobileMenu) {
        menuToggle.classList.toggle('active');
        mobileMenu.classList.toggle('active');
    }
}

// Redução do cabeçalho ao rolar (sem alterações)
window.addEventListener("scroll", function () {
    const header = document.querySelector("header");
    if (header) {
        if (window.scrollY > 50) {
            header.classList.add("shrink");
        } else {
            header.classList.remove("shrink");
        }
    }
});