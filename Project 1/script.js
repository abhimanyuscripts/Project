const hamburger = document.querySelector(".hamburger");
const navContent = document.querySelector(".nav-content");

hamburger.addEventListener("click", () => {
    // Toggle 'active' class to show/hide menu and animate hamburger
    hamburger.classList.toggle("active");
    navContent.classList.toggle("active");
});

// Optional: Close menu when a link is clicked
document.querySelectorAll(".nav-link").forEach(link => {
    link.addEventListener("click", () => {
        hamburger.classList.remove("active");
        navContent.classList.remove("active");
    });
});