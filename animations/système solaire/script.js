const canvas = document.getElementById('solarCanvas');
const ctx = canvas.getContext('2d');
const zoomInput = document.getElementById('zoomRange');

function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
window.addEventListener('resize', resize);
resize();

const planets = [
    { name: "Soleil", dist: 0, color: "#FFD700", size: 18 },
    { name: "Mercure", dist: 0.39, color: "#A5A5A5", size: 4 },
    { name: "Vénus", dist: 0.72, color: "#E3BB76", size: 6 },
    { name: "Terre", dist: 1.00, color: "#2271B3", size: 6 },
    { name: "Mars", dist: 1.52, color: "#E27B58", size: 5 },
    { name: "Jupiter", dist: 5.20, color: "#D39C7E", size: 14 },
    { name: "Saturne", dist: 9.54, color: "#C5AB6E", size: 12 },
    { name: "Uranus", dist: 19.22, color: "#BBE1E4", size: 9 },
    { name: "Neptune", dist: 30.06, color: "#6081FF", size: 9 }
];

let pixelsPerAU = 200;

zoomInput.addEventListener('input', (e) => {
    // Logique de zoom plus fluide (exponentielle)
    const val = e.target.value;
    pixelsPerAU = 10000 / val;
});

function drawScaleBar() {
    const maxWidth = 150; // Largeur max de la barre en pixels
    
    // Calcul de la distance UA brute pour cette largeur
    let rawAU = maxWidth / pixelsPerAU;
    
    // On cherche un nombre "rond" (1, 2, 5, 10, 20, 50...)
    let niceAU;
    if (rawAU < 0.1) niceAU = 0.05;
    else if (rawAU < 0.2) niceAU = 0.1;
    else if (rawAU < 0.5) niceAU = 0.25;
    else if (rawAU < 1) niceAU = 0.5;
    else if (rawAU < 2) niceAU = 1;
    else if (rawAU < 5) niceAU = 2;
    else if (rawAU < 10) niceAU = 5;
    else if (rawAU < 25) niceAU = 10;
    else niceAU = 20;

    const barWidthInPixels = niceAU * pixelsPerAU;
    const x = canvas.width - barWidthInPixels - 30;
    const y = canvas.height - 40;

    // Dessin de la barre
    ctx.strokeStyle = "white";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(x, y - 5);
    ctx.lineTo(x, y);
    ctx.lineTo(x + barWidthInPixels, y);
    ctx.lineTo(x + barWidthInPixels, y - 5);
    ctx.stroke();

    // Texte
    ctx.fillStyle = "white";
    ctx.font = "bold 14px Arial";
    ctx.textAlign = "center";
    ctx.fillText(`${niceAU} UA`, x + barWidthInPixels / 2, y - 10);
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;

    planets.forEach(planet => {
        const xPos = centerX + (planet.dist * pixelsPerAU);

        // Orbite
        if (planet.dist > 0) {
            ctx.beginPath();
            ctx.arc(centerX, centerY, planet.dist * pixelsPerAU, 0, Math.PI * 2);
            ctx.strokeStyle = "rgba(255, 255, 255, 0.08)";
            ctx.stroke();
        }

        // Planète
        ctx.beginPath();
        ctx.arc(xPos, centerY, planet.size, 0, Math.PI * 2);
        ctx.fillStyle = planet.color;
        if(planet.dist === 0) {
            ctx.shadowBlur = 20;
            ctx.shadowColor = planet.color;
        } else {
            ctx.shadowBlur = 0;
        }
        ctx.fill();

        // Label (uniquement si visible et pas trop serré)
        if (planet.dist === 0 || (planet.dist * pixelsPerAU > 20)) {
            ctx.fillStyle = "rgba(255,255,255,0.8)";
            ctx.font = "11px sans-serif";
            ctx.fillText(planet.name, xPos, centerY + planet.size + 15);
        }
    });

    drawScaleBar();
    requestAnimationFrame(draw);
}

draw();