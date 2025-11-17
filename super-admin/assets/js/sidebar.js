async function loadSidebar(activePage) {
    const sidebarContainer = document.createElement("div");

    // Load sidebar HTML
    const sidebarHTML = await fetch("../templates/sidebar.html")
        .then(res => res.text());

    sidebarContainer.innerHTML = sidebarHTML;
    document.body.prepend(sidebarContainer);

    // Highlight active link
    const links = document.querySelectorAll(".nav-link");
    links.forEach(link => {
        if (link.dataset.page === activePage) {
            link.classList.add("active");
        }
    });
}

