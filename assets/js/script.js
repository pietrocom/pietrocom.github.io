// assets/js/script.js

document.addEventListener('DOMContentLoaded', () => {
    // Procura pelo container de digitação na página
    const typingContainer = document.querySelector('.typing-container');
    
    if (typingContainer) {
        // Elementos do DOM
        const line1Text = document.getElementById('typed-line1');
        const line2Text = document.getElementById('typed-line2');
        const cursor1 = typingContainer.querySelector('.cursor.cursor-line1');
        const cursor2 = typingContainer.querySelector('.cursor.cursor-line2');

        // Configurações da Animação
        const textLines = ["Pietro Comin", "Computer Science · UFPR"];
        const typingSpeed = 120;
        const deleteSpeed = 60;
        const pauseAfterTyping = 1500; // Pausa após digitar cada linha
        const pauseBeforeLoop = 2000; // Pausa antes de apagar tudo e recomeçar

        // Função auxiliar para criar pausas
        const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

        // Função para digitar um texto em um elemento
        async function type(element, text) {
            for (let i = 0; i < text.length; i++) {
                element.textContent += text.charAt(i);
                await sleep(typingSpeed);
            }
        }

        // Função para apagar um texto de um elemento
        async function erase(element) {
            const text = element.textContent;
            for (let i = text.length; i > 0; i--) {
                element.textContent = text.substring(0, i - 1);
                await sleep(deleteSpeed);
            }
        }

        // Loop principal da animação
        async function runTypingEffect() {
            while (true) {
                // Digita a primeira linha
                cursor1.style.visibility = 'visible';
                await type(line1Text, textLines[0]);
                await sleep(pauseAfterTyping);
                cursor1.style.visibility = 'hidden';

                // Digita a segunda linha
                cursor2.style.visibility = 'visible';
                await type(line2Text, textLines[1]);
                await sleep(pauseBeforeLoop);
                cursor2.style.visibility = 'hidden';

                // Apaga a segunda linha
                cursor2.style.visibility = 'visible';
                await erase(line2Text);
                await sleep(pauseAfterTyping / 2);
                cursor2.style.visibility = 'hidden';

                // Apaga a primeira linha
                cursor1.style.visibility = 'visible';
                await erase(line1Text);
                await sleep(pauseBeforeLoop / 2);
                cursor1.style.visibility = 'hidden';
            }
        }

        // Inicia o efeito
        runTypingEffect();
    }
});

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