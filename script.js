const navToggle = document.getElementById("navToggle");
const navMenu = document.getElementById("navMenu");

if (navToggle && navMenu) {
    navToggle.addEventListener("click", () => {
        const isOpen = navMenu.classList.toggle("is-open");
        navToggle.setAttribute("aria-expanded", String(isOpen));
    });

    document.addEventListener("click", (event) => {
        const target = event.target;
        if (!(target instanceof Node)) {
            return;
        }

        if (!navMenu.contains(target) && !navToggle.contains(target)) {
            navMenu.classList.remove("is-open");
            navToggle.setAttribute("aria-expanded", "false");
        }
    });
}

document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", (event) => {
        const href = anchor.getAttribute("href");
        if (!href || href === "#") {
            return;
        }

        const target = document.querySelector(href);
        if (!target) {
            return;
        }

        event.preventDefault();
        target.scrollIntoView({ behavior: "smooth", block: "start" });

        if (navMenu && navToggle) {
            navMenu.classList.remove("is-open");
            navToggle.setAttribute("aria-expanded", "false");
        }
    });
});

const revealItems = document.querySelectorAll(".reveal");

if ("IntersectionObserver" in window) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach((entry) => {
            if (!entry.isIntersecting) {
                return;
            }

            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
        });
    }, { threshold: 0.15, rootMargin: "0px 0px -40px 0px" });

    revealItems.forEach((item) => revealObserver.observe(item));
} else {
    revealItems.forEach((item) => item.classList.add("is-visible"));
}

const counters = document.querySelectorAll(".counter");

if (counters.length) {
    const animateCounter = (element) => {
        const target = Number(element.dataset.counter || 0);
        const duration = 1200;
        const startTime = performance.now();

        const step = (time) => {
            const progress = Math.min((time - startTime) / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            const value = Math.round(target * eased);
            element.textContent = `${value}+`;

            if (progress < 1) {
                requestAnimationFrame(step);
            }
        };

        requestAnimationFrame(step);
    };

    if ("IntersectionObserver" in window) {
        const counterObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach((entry) => {
                if (!entry.isIntersecting) {
                    return;
                }

                animateCounter(entry.target);
                observer.unobserve(entry.target);
            });
        }, { threshold: 0.5 });

        counters.forEach((counter) => counterObserver.observe(counter));
    } else {
        counters.forEach(animateCounter);
    }
}

const filterButtons = document.querySelectorAll("[data-filter]");
const caseCards = document.querySelectorAll(".case-card");

filterButtons.forEach((button) => {
    button.addEventListener("click", () => {
        const filter = button.dataset.filter;

        filterButtons.forEach((item) => item.classList.remove("active"));
        button.classList.add("active");

        caseCards.forEach((card) => {
            const categories = (card.dataset.category || "").split(" ");
            const shouldShow = filter === "all" || categories.includes(filter);
            card.hidden = !shouldShow;
        });
    });
});

const contactForm = document.getElementById("contactForm");

if (contactForm) {
    const status = document.getElementById("formStatus");

    contactForm.addEventListener("submit", (event) => {
        event.preventDefault();

        const formData = new FormData(contactForm);
        const data = Object.fromEntries(formData.entries());
        const requiredFields = ["name", "email", "phone", "service", "siteType", "message"];

        const hasMissingField = requiredFields.some((field) => !String(data[field] || "").trim());

        if (hasMissingField) {
            if (status) {
                status.textContent = "Complete all required fields before sending the brief.";
            }
            return;
        }

        const message = [
            "New VSS Salesco inquiry",
            `Name: ${data.name}`,
            `Email: ${data.email}`,
            `Phone: ${data.phone}`,
            `Service: ${data.service}`,
            `Site Type: ${data.siteType}`,
            `Project Brief: ${data.message}`
        ].join("\n");

        const whatsappUrl = `https://wa.me/919990696111?text=${encodeURIComponent(message)}`;

        if (status) {
            status.textContent = "Opening WhatsApp with your project brief.";
        }

        window.open(whatsappUrl, "_blank", "noopener,noreferrer");
    });
}
