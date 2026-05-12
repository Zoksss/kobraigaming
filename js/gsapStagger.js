// Proveri da li su GSAP i ScrollTrigger učitani
if (gsap && ScrollTrigger) {
    gsap.registerPlugin(ScrollTrigger);

    console.log("GSAP i ScrollTrigger su uspešno učitani. Inicijalizacija animacija...");

    // Selektuj sve kontejnere koji imaju data-animate="stagger"
    const staggerContainers = document.querySelectorAll('[data-animate="stagger"]');

    staggerContainers.forEach((container) => {
        // Uzimamo direktnu decu kontejnera (kartice)
        const cards = container.children;

        gsap.from(cards, {
            scrollTrigger: {
                trigger: container,
                start: "top 70%", // Animacija kreće kad je vrh kontejnera na 85% visine ekrana
                toggleActions: "play none none none", // Igraj samo jednom pri ulasku
            },
            opacity: 0,
            y: 30, // Pomera kartice malo na dole pre starta
            duration: 0.8,
            stagger: 0.1, // Razmak od 0.2s između svake kartice
            ease: "power2.inOut",
        });
    });
}