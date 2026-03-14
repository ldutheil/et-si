// Récupération des éléments du DOM
const slider = document.getElementById('phSlider');
const phValue = document.getElementById('phValue');
const solutionExample = document.getElementById('solutionExample');
const canvas = document.getElementById('ionsCanvas');
const ctx = canvas.getContext('2d');

// Liste des ions (position, vitesse, type)
let ions = [];
let animationId = null;

// Exemples de solutions pour chaque pH
const phExamples = {
    0: "Acide chlorhydrique concentré",
    1: "Batterie d'acide de voiture",
    2: "Jus de citron",
    3: "Vinaigre",
    4: "Tomate",
    5: "Café noir",
    6: "Lait",
    7: "Eau pure",
    8: "Œuf cru",
    9: "Bicarbonate de soude",
    10: "Savon à lessive",
    11: "Ammoniaque domestique",
    12: "Eau de Javel",
    13: "Nettoyant pour four",
    14: "Soude caustique"
};

// Classe pour un ion
class Ion {
    constructor(x, y, type) {
        this.x = x;
        this.y = y;
        this.radius = 10;
        this.type = type; // 'H+' ou 'HO-'
        this.vx = (Math.random() - 0.5) * 1; // Vitesse aléatoire en x
        this.vy = (Math.random() - 0.5) * 1; // Vitesse aléatoire en y
    }

    // Dessine l'ion avec sa légende (exposants)
    draw() {
        ctx.fillStyle = this.type === 'H+' ? 'rgba(0, 0, 255, 0.7)' : 'rgba(255, 0, 0, 0.7)';
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fill();

        // Légende avec exposants
        ctx.fillStyle = 'white';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        if (this.type === 'H+') {
            ctx.font = 'bold 8px Arial';
            ctx.fillText('H', this.x, this.y); // "H" normal
            ctx.font = 'bold 8px Arial';
            ctx.fillText('+', this.x + 3, this.y - 6); // "+" en exposant
        } else {
            ctx.font = 'bold 8px Arial';
            ctx.fillText('HO', this.x, this.y); // "HO" normal
            ctx.font = 'bold 8px Arial';
            ctx.fillText('-', this.x + 5, this.y - 6); // "-" en exposant
        }
        ctx.font = 'bold 8px Arial'; // Réinitialise la taille
    }

    // Met à jour la position (rebond sur les bords)
    update() {
        this.x += this.vx;
        this.y += this.vy;
        if (this.x < this.radius || this.x > canvas.width - this.radius) this.vx *= -1;
        if (this.y < this.radius || this.y > canvas.height - this.radius) this.vy *= -1;
    }
}

// Initialise les ions en fonction du pH
function initIons(pH) {
    ions = [];
    const totalIons = 30;
    const hCount = Math.round(totalIons * (14 - pH) / 14);
    const ohCount = totalIons - hCount;

    for (let i = 0; i < hCount; i++) {
        ions.push(new Ion(
            30 + Math.random() * (canvas.width - 60),
            30 + Math.random() * (canvas.height - 60),
            'H+'
        ));
    }
    for (let i = 0; i < ohCount; i++) {
        ions.push(new Ion(
            30 + Math.random() * (canvas.width - 60),
            30 + Math.random() * (canvas.height - 60),
            'HO-'
        ));
    }
}

// Boucle d'animation
function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ions.forEach(ion => {
        ion.update();
        ion.draw();
    });
    animationId = requestAnimationFrame(animate);
}

// Mise à jour du pH et de l'exemple de solution
slider.addEventListener('input', () => {
    const pH = parseInt(slider.value);
    phValue.textContent = `pH : ${pH}`;
    solutionExample.textContent = `Exemple : ${phExamples[pH]}`;
    initIons(pH);
    if (animationId) cancelAnimationFrame(animationId);
    animate();
});

// Initialisation
initIons(7);
solutionExample.textContent = `Exemple : ${phExamples[7]}`;
animate();
