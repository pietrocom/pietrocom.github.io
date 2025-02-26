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

// Configurar o scroll suave
function setupSmoothScroll() {
    // Scroll suave para links com âncora
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault(); // Evita o comportamento padrão do link
            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);

            if (targetElement) {
                // Scroll suave personalizado
                smoothScrollTo(targetElement);
            }
        });
    });
}

// Função para scroll suave personalizado
function smoothScrollTo(targetElement) {
    const targetPosition = targetElement.offsetTop;
    const startPosition = window.pageYOffset;
    const distance = targetPosition - startPosition;
    const duration = 800; // Duração da animação em milissegundos
    let startTime = null;

    function animation(currentTime) {
        if (startTime === null) startTime = currentTime;
        const timeElapsed = currentTime - startTime;
        const run = ease(timeElapsed, startPosition, distance, duration);
        window.scrollTo(0, run);
        if (timeElapsed < duration) requestAnimationFrame(animation);
    }

    // Função de easing para suavizar a animação
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
    const sobreMim = document.querySelector("#sobre-mim");
    const linhasSeparacao = document.querySelector(".linhas-separacao");
    const sobreMimPosition = sobreMim.getBoundingClientRect().top;
    const screenHeight = window.innerHeight;

    // Ativa a animação quando a seção "Sobre Mim" entra na tela
    if (sobreMimPosition < screenHeight * 0.75) {
        sobreMim.classList.add("visible");
        linhasSeparacao.classList.add("visible");
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
