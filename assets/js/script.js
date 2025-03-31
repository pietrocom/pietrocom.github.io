// script.js

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

// Carregar Header e Footer
document.addEventListener("DOMContentLoaded", function () {
    loadComponent("header-container", "header.html", function () {
        setupSmoothScroll(); // Configurar o scroll suave
        setupSectionObserver(); // Configurar o observador de seções
    });
    loadComponent("footer-container", "footer.html");
});

// Enhanced smooth scroll function
function setupSmoothScroll() {
    // Handle all navigation links (header and footer)
    document.querySelectorAll('a[href^="#"], a[href^="/"], a[href^="."]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            // Skip if target is external or has special attributes
            if (this.hasAttribute('download') || this.getAttribute('target') === '_blank') {
                return;
            }
            
            const href = this.getAttribute('href');
            
            // Handle internal page links (like portfolio.html)
            if (href.includes('.html')) {
                // Allow normal navigation for .html links
                return;
            }
            
            // Handle anchor links
            if (href.startsWith('#')) {
                e.preventDefault();
                const targetId = href.substring(1);
                const targetElement = document.getElementById(targetId);
                
                if (targetElement) {
                    smoothScrollTo(targetElement);
                    
                    // Update URL without page reload
                    history.pushState(null, null, href);
                } else if (targetId === 'top') {
                    // Special case for "back to top" links
                    smoothScrollTo(document.body);
                    history.pushState(null, null, '#top');
                }
            }
        });
    });
}

// Update your existing smoothScrollTo function if needed
function smoothScrollTo(targetElement) {
    const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset;
    const startPosition = window.pageYOffset;
    const distance = targetPosition - startPosition;
    const duration = 800;
    let startTime = null;

    function animation(currentTime) {
        if (!startTime) startTime = currentTime;
        const timeElapsed = currentTime - startTime;
        const run = ease(timeElapsed, startPosition, distance, duration);
        window.scrollTo(0, run);
        if (timeElapsed < duration) requestAnimationFrame(animation);
    }

    function ease(t, b, c, d) {
        t /= d / 2;
        if (t < 1) return c / 2 * t * t + b;
        t--;
        return -c / 2 * (t * (t - 2) - 1) + b;
    }

    requestAnimationFrame(animation);
}

// Configurar o observador de seções
function setupSectionObserver() {
    const sections = document.querySelectorAll('section'); // Seleciona todas as seções
    const navLinks = document.querySelectorAll('nav ul li a'); // Seleciona todos os links do menu

    const options = {
        root: null, // Observa a viewport
        rootMargin: '0px',
        threshold: 0.6 // 60% da seção precisa estar visível
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Remove a classe 'active' de todos os links
                navLinks.forEach(link => {
                    link.classList.remove('active');
                });

                // Adiciona a classe 'active' ao link correspondente
                const id = entry.target.getAttribute('id');
                const correspondingLink = document.querySelector(`nav ul li a[href="#${id}"]`);
                if (correspondingLink) {
                    correspondingLink.classList.add('active');
                }
            }
        });
    }, options);

    // Observa todas as seções
    sections.forEach(section => {
        observer.observe(section);
    });

    // Observa o topo da página (#topo)
    const topo = document.getElementById('topo');
    if (topo) {
        observer.observe(topo);
    }
}

// Redução do cabeçalho ao rolar
window.addEventListener("scroll", function () {
    const header = document.getElementById("header");
    if (window.scrollY > 50) {
        header.classList.add("shrink");
    } else {
        header.classList.remove("shrink");
    }
});

// Menu Mobile
document.addEventListener("click", function (event) {
    const menu = document.querySelector("nav ul");
    const toggle = document.getElementById("menu-toggle");
    if (event.target === toggle) {
        menu.classList.toggle("show");
    } else if (!menu.contains(event.target) && !toggle.contains(event.target)) {
        menu.classList.remove("show");
    }
});

// Efeito de transição Hero - Sobre Mim e Linhas de Separação
window.addEventListener("scroll", function () {
    const sobreMim = document.getElementById("about");
    const linhasSeparacao = document.querySelector(".separation-lines");
    
    // Add robust null checks
    if (sobreMim && linhasSeparacao && sobreMim.classList && linhasSeparacao.classList) {
        const sobreMimPosition = sobreMim.getBoundingClientRect().top;
        const screenHeight = window.innerHeight;

        if (sobreMimPosition < screenHeight * 0.75) {
            sobreMim.classList.add("visible");
            linhasSeparacao.classList.add("visible");
        }
    } else {
        console.warn("Elements not found:", {sobreMim, linhasSeparacao});
    }
});

// Botao Iniciais
document.addEventListener("DOMContentLoaded", function () {
    function setupReloadButton() {
        const initialsButton = document.querySelector('.initials-button');
        if (initialsButton) {
            initialsButton.addEventListener('click', function (e) {
                e.preventDefault();
                window.location.reload();
            });
        }
    }

    setupReloadButton(); // Tenta configurar o botão imediatamente

    // Se o botão for carregado dinamicamente, aguarde e tente de novo
    setTimeout(setupReloadButton, 500);
});
