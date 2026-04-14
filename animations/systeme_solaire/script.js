const canvas = document.getElementById('solarCanvas');
const ctx = canvas.getContext('2d');
const zoomInput = document.getElementById('zoomRange');
const unitToggle = document.getElementById('unitToggle');
const container = document.getElementById('builder-zone');

const AU_TO_KM = 149597871;

function resize() {
    canvas.width = container.clientWidth;
    canvas.height = container.clientHeight;
}
window.addEventListener('resize', resize);
resize();

const planets = [
    { name: "SOLEIL", dist: 0, color: "#FFD700", size: 18 },
    { name: "MERCURE", dist: 0.39, color: "#A5A5A5", size: 4 },
    { name: "VÉNUS", dist: 0.72, color: "#E3BB76", size: 6 },
    { name: "TERRE", dist: 1.00, color: "#2271B3", size: 6 },
    { name: "MARS", dist: 1.52, color: "#E27B58", size: 5 },
    { name: "JUPITER", dist: 5.20, color: "#D39C7E", size: 14 },
    { name: "SATURNE", dist: 9.54, color: "#C5AB6E", size: 12 },
    { name: "URANUS", dist: 19.22, color: "#BBE1E4", size: 9 },
    { name: "NEPTUNE", dist: 30.06, color: "#6081FF", size: 9 }
];

const kuiperAsteroids = Array.from({ length: 5000 }, () => ({
    dist: 30 + Math.random() * 20, // Entre 30 et 50 UA
    angle: Math.random() * Math.PI * 2,
    size: Math.random() * 1.2 + 0.3
}));

let pixelsPerAU = 100;

zoomInput.addEventListener('input', (e) => {
    pixelsPerAU = 15000 / e.target.value;
});

function formatNumber(num) {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
}

function drawScaleBar() {
    const maxWidth = 150;
    const isKm = unitToggle.checked;
    
    let displayValue;
    let label;
    let barWidthInPixels;

    if (!isKm) {
        // Logique UA
        let rawAU = maxWidth / pixelsPerAU;
        let niceAU;
        if (rawAU < 0.1) niceAU = 0.05;
        else if (rawAU < 0.5) niceAU = 0.25;
        else if (rawAU < 2) niceAU = 1;
        else if (rawAU < 10) niceAU = 5;
        else niceAU = 10;
        
        displayValue = niceAU;
        label = niceAU + " UA";
        barWidthInPixels = niceAU * pixelsPerAU;
    } else {
        // Logique Kilomètres
        let rawKm = (maxWidth / pixelsPerAU) * AU_TO_KM;
        let niceKm;
        if (rawKm < 20000000) niceKm = 10000000;
        else if (rawKm < 100000000) niceKm = 50000000;
        else if (rawKm < 300000000) niceKm = 100000000;
        else if (rawKm < 1000000000) niceKm = 500000000;
        else if (rawKm < 2000000000) niceKm = 1000000000;
        else niceKm = 5000000000;

        displayValue = niceKm;
        label = formatNumber(niceKm) + " km";
        barWidthInPixels = (niceKm / AU_TO_KM) * pixelsPerAU;
    }

    const x = canvas.width - barWidthInPixels - 40;
    const y = canvas.height - 40;

    ctx.strokeStyle = "rgba(255,255,255,0.5)";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(x, y - 5);
    ctx.lineTo(x, y);
    ctx.lineTo(x + barWidthInPixels, y);
    ctx.lineTo(x + barWidthInPixels, y - 5);
    ctx.stroke();

    ctx.fillStyle = "rgba(255,255,255,0.7)";
    ctx.font = "12px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText(label, x + barWidthInPixels / 2, y - 10);
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const centerX = 100;
    const centerY = canvas.height / 2;

    // Dessin de la ceinture de Kuiper (Astéroïdes marrons)
    ctx.fillStyle = "rgba(139, 69, 19, 0.7)";
    kuiperAsteroids.forEach(asteroid => {
        const r = asteroid.dist * pixelsPerAU;
        const x = centerX + Math.cos(asteroid.angle) * r;
        const y = centerY + Math.sin(asteroid.angle) * r;
        ctx.beginPath();
        ctx.arc(x, y, asteroid.size, 0, Math.PI * 2);
        ctx.fill();
    });

    // Label pour la ceinture de Kuiper
    const beltLabelX = centerX + (40 * pixelsPerAU);
    if (40 * pixelsPerAU > 100) {
        ctx.fillStyle = "rgba(139, 69, 19, 0.9)";
        ctx.font = "bold 13px sans-serif";
        ctx.textAlign = "center";
        ctx.fillText("CEINTURE DE KUIPER", beltLabelX, centerY + 80);
    }

    planets.forEach(planet => {
        const xPos = centerX + (planet.dist * pixelsPerAU);

        if (planet.dist > 0) {
            ctx.beginPath();
            ctx.arc(centerX, centerY, planet.dist * pixelsPerAU, 0, Math.PI * 2);
            ctx.strokeStyle = "rgba(255, 255, 255, 0.2)";
            ctx.lineWidth = 1.5;
            ctx.stroke();
        }

        ctx.beginPath();
        ctx.arc(xPos, centerY, planet.size, 0, Math.PI * 2);
        ctx.fillStyle = planet.color;
        
        if(planet.dist === 0) {
            ctx.shadowBlur = 30;
            ctx.shadowColor = planet.color;
        } else {
            ctx.shadowBlur = 0;
        }
        ctx.fill();



        if (planet.dist === 0 || (planet.dist * pixelsPerAU > 30)) {
            ctx.fillStyle = "rgba(255,255,255,0.6)";
            ctx.font = "10px sans-serif";
            ctx.textAlign = "center";
            ctx.fillText(planet.name, xPos, centerY + planet.size + 15);
        }
    });

    drawScaleBar();
    requestAnimationFrame(draw);
}

draw();