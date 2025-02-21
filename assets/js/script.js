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
document.getElementById("menu-toggle").addEventListener("click", function () {
    document.querySelector("nav ul").classList.toggle("show");
});
