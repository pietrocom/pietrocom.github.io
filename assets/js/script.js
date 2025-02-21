// Função para carregar HTML de outro arquivo
function loadComponent(id, file) {
    fetch(file)
        .then(response => response.text())
        .then(data => {
            document.getElementById(id).innerHTML = data;
        })
        .catch(error => console.log('Erro ao carregar ' + file, error));
}

// Carregar Header e Footer
document.addEventListener("DOMContentLoaded", function () {
    loadComponent("header-container", "header.html");
    loadComponent("footer-container", "footer.html");
});

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
