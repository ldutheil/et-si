import * as THREE from 'three';

const container = document.getElementById('builder-zone');
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(45, container.clientWidth / container.clientHeight, 1, 3000);
const renderer = new THREE.WebGLRenderer({ antialias: true });

renderer.setSize(container.clientWidth, container.clientHeight);
container.appendChild(renderer.domElement);

// --- PARAMÈTRES ---
let isPaused = false;
let cumulativeTime = 0; 
const orbitDuration = 120000; 
const orbitRadius = 170; 
const tiltRad = -23.4 * (Math.PI / 180); 
const earthRadius = 24;  

// --- OBJETS ---

// 1. Soleil
const sun = new THREE.Mesh(new THREE.SphereGeometry(18, 64, 64), new THREE.MeshBasicMaterial({ color: 0xfff000 }));
scene.add(sun);

const sunLight = new THREE.PointLight(0xffffff, 60000, 2000);
sunLight.decay = 1.5;
scene.add(sunLight);

scene.add(new THREE.AmbientLight(0xffffff, 0.1));

// 2. Terre
const earthGroup = new THREE.Group(); 
scene.add(earthGroup);

const loader = new THREE.TextureLoader();
const earthTexture = loader.load('https://unpkg.com/three-globe/example/img/earth-blue-marble.jpg');

const earthMesh = new THREE.Mesh(
    new THREE.SphereGeometry(earthRadius, 64, 64),
    new THREE.MeshStandardMaterial({ map: earthTexture, roughness: 0.8, metalness: 0.1 })
);
earthGroup.add(earthMesh);

// 3. Axe de rotation
const axisGeom = new THREE.CylinderGeometry(0.2, 0.2, earthRadius * 2.8, 32);
const axisMat = new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 1 });
const rotationAxis = new THREE.Mesh(axisGeom, axisMat);
earthGroup.add(rotationAxis);

const poleGeom = new THREE.SphereGeometry(0.6, 16, 16);
const northPole = new THREE.Mesh(poleGeom, new THREE.MeshBasicMaterial({ color: 0xffffff }));
const southPole = new THREE.Mesh(poleGeom, new THREE.MeshBasicMaterial({ color: 0xaaaaaa }));
northPole.position.y = (earthRadius * 2.8) / 2;
southPole.position.y = -(earthRadius * 2.8) / 2;
rotationAxis.add(northPole, southPole);

// 4. Point Rouge (France)
const franceMarker = new THREE.Mesh(new THREE.SphereGeometry(1.5, 16, 16), new THREE.MeshBasicMaterial({ color: 0xff0000 }));
const lat = 48 * (Math.PI / 180);
const lon = 85 * (Math.PI / 180);
franceMarker.position.set(
    earthRadius * Math.cos(lat) * Math.sin(lon),
    earthRadius * Math.sin(lat),
    earthRadius * Math.cos(lat) * Math.cos(lon)
);
earthMesh.add(franceMarker);

// 5. Orbite et traits de Solstice (Modifiés)
const orbitRing = new THREE.Mesh(
    new THREE.TorusGeometry(orbitRadius, 0.5, 16, 200),
    new THREE.MeshBasicMaterial({ color: 0x00ffff, transparent: true, opacity: 0.2 })
);
orbitRing.rotation.x = Math.PI / 2;
scene.add(orbitRing);

// Création de "traits" épais via BoxGeometry au lieu de Line
const solsticeMat = new THREE.MeshBasicMaterial({ color: 0xffff00, transparent: true, opacity: 0.6 });
const solsticeWidth = 2; // Épaisseur du trait

const createSolsticeBar = (direction) => {
    // Géométrie : longueur = orbitRadius, hauteur et profondeur = solsticeWidth
    const geom = new THREE.BoxGeometry(orbitRadius, solsticeWidth, solsticeWidth);
    const bar = new THREE.Mesh(geom, solsticeMat);
    // On décale la barre pour qu'elle parte du centre (soleil)
    bar.position.x = (orbitRadius / 2) * direction;
    return bar;
};

const winterBar = createSolsticeBar(1);  // Côté droit (Angle 0)
const summerBar = createSolsticeBar(-1); // Côté gauche (Angle PI)
scene.add(winterBar, summerBar);

// Labels UI
const labelWinter = document.getElementById('label-winter');
const labelSummer = document.getElementById('label-summer');
const posWinter = new THREE.Vector3(orbitRadius + 25, 0, 0);
const posSummer = new THREE.Vector3(-orbitRadius - 25, 0, 0);

function updateLabelPosition(vector, element) {
    if (!element) return;
    const tempV = vector.clone().project(camera);
    element.style.left = `${(tempV.x * 0.5 + 0.5) * container.clientWidth}px`;
    element.style.top = `${(tempV.y * -0.5 + 0.5) * container.clientHeight}px`;
}

// --- LOGIQUE SAISONS ---
const seasonElement = document.getElementById('currentSeason');
camera.position.set(0, 150, 400);
camera.lookAt(0, 0, 0);

function updateSeasonInfo(angle) {
    const norm = (angle % (Math.PI * 2) + Math.PI * 2) % (Math.PI * 2);
    if (norm < 0.78 || norm > 5.5) seasonElement.innerText = "Hiver";
    else if (norm < 2.35) seasonElement.innerText = "Printemps";
    else if (norm < 3.92) seasonElement.innerText = "Été";
    else seasonElement.innerText = "Automne";
}

// --- BOUTONS ---
document.getElementById('winterBtn').onclick = () => { cumulativeTime = 0; };
document.getElementById('summerBtn').onclick = () => { cumulativeTime = orbitDuration / 2; };
document.getElementById('pauseBtn').onclick = () => isPaused = !isPaused;
document.getElementById('addHourBtn').onclick = () => { cumulativeTime += orbitDuration / (365.25 * 24); };
document.getElementById('addDayBtn').onclick = () => { cumulativeTime += orbitDuration / 365.25; };
document.getElementById('addMonthBtn').onclick = () => { cumulativeTime += orbitDuration * 30.44 / 365.25; };

// --- ANIMATION ---
let lastTime = performance.now();
function animate(now) {
    requestAnimationFrame(animate);
    const dt = now - lastTime;
    lastTime = now;
    if (!isPaused) cumulativeTime += dt;

    const orbitAngle = (cumulativeTime / orbitDuration) * Math.PI * 2;
    earthGroup.position.set(Math.cos(orbitAngle) * orbitRadius, 0, Math.sin(orbitAngle) * orbitRadius);

    earthGroup.rotation.set(0, 0, 0);
    earthGroup.rotateZ(tiltRad); 

    const dayRotation = (cumulativeTime / (orbitDuration / 365.25)) * Math.PI * 2;
    earthMesh.rotation.y = dayRotation;

    updateLabelPosition(posWinter, labelWinter);
    updateLabelPosition(posSummer, labelSummer);
    updateSeasonInfo(orbitAngle);
    renderer.render(scene, camera);
}
requestAnimationFrame(animate);

window.addEventListener('resize', () => {
    camera.aspect = container.clientWidth / container.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(container.clientWidth, container.clientHeight);
});