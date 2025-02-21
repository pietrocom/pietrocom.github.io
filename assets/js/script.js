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
    loadComponent("header-container", "header.html", highlightActivePage);
    loadComponent("footer-container", "footer.html");
});

// Destacar a página ativa no menu
function highlightActivePage() {
    let currentPage = window.location.pathname.split("/").pop(); // Obtém o nome do arquivo
    if (!currentPage) currentPage = "index.html"; // Caso esteja na home

    let links = document.querySelectorAll("nav ul li a");
    links.forEach(link => {
        link.classList.remove("active");
        if (link.getAttribute("href") === currentPage) {
            link.classList.add("active");
        }
    });
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
    if (event.target.id === "menu-toggle") {
        document.querySelector("nav ul").classList.toggle("show");
    }
});

// Fechar o menu ao clicar fora
document.addEventListener("click", function (event) {
    const menu = document.querySelector("nav ul");
    const toggle = document.getElementById("menu-toggle");
    if (event.target !== toggle && !toggle.contains(event.target) && !menu.contains(event.target)) {
        menu.classList.remove("show");
    }
});

