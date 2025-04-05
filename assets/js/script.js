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
        setupMobileMenu(); // Configurar o menu mobile
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
                    
                    // Close mobile menu if open
                    const mobileMenu = document.querySelector('.mobile-menu');
                    if (mobileMenu && mobileMenu.classList.contains('active')) {
                        toggleMobileMenu();
                    }
                } else if (targetId === 'top') {
                    // Special case for "back to top" links
                    smoothScrollTo(document.body);
                    history.pushState(null, null, '#top');
                }
            }
        });
    });
}

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

// Mobile Menu Functionality
function setupMobileMenu() {
    const menuToggle = document.querySelector('.menu-toggle');
    const mobileMenu = document.querySelector('.mobile-menu');
    
    if (menuToggle && mobileMenu) {
        menuToggle.addEventListener('click', function(e) {
            e.stopPropagation();
            toggleMobileMenu();
        });
        
        // Close menu when clicking outside
        document.addEventListener('click', function(e) {
            if (!mobileMenu.contains(e.target) && e.target !== menuToggle) {
                mobileMenu.classList.remove('active');
                menuToggle.classList.remove('active');
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

// Redução do cabeçalho ao rolar
window.addEventListener("scroll", function () {
    const header = document.getElementById("header");
    if (window.scrollY > 50) {
        header.classList.add("shrink");
    } else {
        header.classList.remove("shrink");
    }
});

// Efeito de transição Hero - Sobre Mim e Linhas de Separação
window.addEventListener("scroll", function () {
    const sobreMim = document.getElementById("about");
    const linhasSeparacao = document.querySelector(".separation-lines");
    
    if (sobreMim && linhasSeparacao && sobreMim.classList && linhasSeparacao.classList) {
        const sobreMimPosition = sobreMim.getBoundingClientRect().top;
        const screenHeight = window.innerHeight;

        if (sobreMimPosition < screenHeight * 0.75) {
            sobreMim.classList.add("visible");
            linhasSeparacao.classList.add("visible");
        }
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

    setupReloadButton();
    setTimeout(setupReloadButton, 500);
});