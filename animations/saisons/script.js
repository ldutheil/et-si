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

const ambient = new THREE.AmbientLight(0xffffff, 0.05);
scene.add(ambient);

// 2. Terre
const loader = new THREE.TextureLoader();
const earthTexture = loader.load('https://unpkg.com/three-globe/example/img/earth-blue-marble.jpg');
const earthGroup = new THREE.Group(); 
scene.add(earthGroup);

const earthMesh = new THREE.Mesh(
    new THREE.SphereGeometry(earthRadius, 64, 64),
    new THREE.MeshStandardMaterial({ map: earthTexture, roughness: 0.8, metalness: 0.1 })
);
earthGroup.add(earthMesh);

// 3. Point Rouge (France)
const franceMarker = new THREE.Mesh(
    new THREE.SphereGeometry(2, 16, 16),
    new THREE.MeshBasicMaterial({ color: 0xff0000 })
);
const lat = 48 * (Math.PI / 180);
const lon = 85 * (Math.PI / 180);
franceMarker.position.set(
    earthRadius * Math.cos(lat) * Math.sin(lon),
    earthRadius * Math.sin(lat),
    earthRadius * Math.cos(lat) * Math.cos(lon)
);
earthMesh.add(franceMarker);

// 4. Orbite
const orbitRing = new THREE.Mesh(
    new THREE.TorusGeometry(orbitRadius, 1, 16, 200),
    new THREE.MeshBasicMaterial({ color: 0x00ffff, transparent: true, opacity: 0.4 })
);
orbitRing.rotation.x = Math.PI / 2;
scene.add(orbitRing);

// --- MONITORING & CAMÉRA ---
const seasonElement = document.getElementById('currentSeason');
camera.position.set(0, 180, 350);
camera.lookAt(0, -20, 0);

function updateSeasonInfo(angle) {
    const normAngle = (angle % (Math.PI * 2) + Math.PI * 2) % (Math.PI * 2);
    
    // Découpage : Hiver (autour de 0), Printemps (autour de PI/2), Été (autour de PI), Automne (autour de 3PI/2)
    if (normAngle < 0.78 || normAngle > 5.5) {
        seasonElement.innerText = "Hiver";
    } else if (normAngle < 2.35) {
        seasonElement.innerText = "Printemps";
    } else if (normAngle < 3.92) {
        seasonElement.innerText = "Été";
    } else {
        seasonElement.innerText = "Automne";
    }
}

// --- BOUTONS ---
// Hiver à Droite (X = 170) -> Angle 0
document.getElementById('winterBtn').onclick = () => { cumulativeTime = 0; }; 
// Été à Gauche (X = -170) -> Angle PI (moitié de l'orbite)
document.getElementById('summerBtn').onclick = () => { cumulativeTime = orbitDuration / 2; };

document.getElementById('pauseBtn').onclick = () => isPaused = !isPaused;
document.getElementById('addHourBtn').onclick = () => { cumulativeTime += orbitDuration / (365.25 * 24); };
document.getElementById('addDayBtn').onclick = () => { cumulativeTime += orbitDuration / 365.25; };

// --- ANIMATION ---
let lastTime = performance.now();
function animate(now) {
    requestAnimationFrame(animate);
    const dt = now - lastTime;
    lastTime = now;
    if (!isPaused) cumulativeTime += dt;

    const orbitAngle = (cumulativeTime / orbitDuration) * Math.PI * 2;
    earthGroup.position.set(Math.cos(orbitAngle) * orbitRadius, 0, Math.sin(orbitAngle) * orbitRadius);

    const dayRotation = (cumulativeTime / (orbitDuration / 365.25)) * Math.PI * 2;
    earthGroup.rotation.set(0, 0, 0);
    earthGroup.rotateZ(tiltRad); 
    earthMesh.rotation.y = dayRotation;

    updateSeasonInfo(orbitAngle);
    renderer.render(scene, camera);
}
requestAnimationFrame(animate);

window.addEventListener('resize', () => {
    camera.aspect = container.clientWidth / container.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(container.clientWidth, container.clientHeight);
});