import * as THREE from 'three';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 3000);
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// --- PARAMÈTRES ---
let isPaused = false;
let cumulativeTime = 0; 
const orbitDuration = 60000; 
const orbitRadius = 180; 
const tiltRad = -23.4 * (Math.PI / 180); 
const earthRadius = 12;

// --- OBJETS ---

// 1. Soleil
const sun = new THREE.Mesh(
    new THREE.SphereGeometry(15, 64, 64),
    new THREE.MeshBasicMaterial({ color: 0xfff000 })
);
scene.add(sun);
const sunLight = new THREE.PointLight(0xffffff, 65000, 1500);
sunLight.decay = 2;
scene.add(sunLight);

// 2. Terre
const loader = new THREE.TextureLoader();
const earthTexture = loader.load('https://unpkg.com/three-globe/example/img/earth-blue-marble.jpg');
const earthGroup = new THREE.Group(); 
scene.add(earthGroup);

const earthMesh = new THREE.Mesh(
    new THREE.SphereGeometry(earthRadius, 64, 64),
    new THREE.MeshStandardMaterial({ map: earthTexture, roughness: 1, metalness: 0 })
);
earthGroup.add(earthMesh);

// 3. Point France
const lat = 46.2 * (Math.PI / 180);
const lon = 2.2 * (Math.PI / 180);
const franceDot = new THREE.Mesh(new THREE.SphereGeometry(0.6, 12, 12), new THREE.MeshBasicMaterial({ color: 0xff0000 }));
franceDot.position.set(
    earthRadius * Math.cos(lat) * Math.sin(lon + Math.PI),
    earthRadius * Math.sin(lat),
    earthRadius * Math.cos(lat) * Math.cos(lon + Math.PI)
);
earthMesh.add(franceDot);

// 4. Orbite
const orbitRing = new THREE.Mesh(
    new THREE.TorusGeometry(orbitRadius, 0.4, 16, 200),
    new THREE.MeshBasicMaterial({ color: 0x00ffff, transparent: true, opacity: 0.15 })
);
orbitRing.rotation.x = Math.PI / 2;
scene.add(orbitRing);

// 5. Étoiles
const starPositions = [];
for (let i = 0; i < 5000; i++) {
    starPositions.push((Math.random() - 0.5) * 2000, (Math.random() - 0.5) * 2000, (Math.random() - 0.5) * 2000);
}
const starGeom = new THREE.BufferGeometry().setAttribute('position', new THREE.Float32BufferAttribute(starPositions, 3));
scene.add(new THREE.Points(starGeom, new THREE.PointsMaterial({ color: 0x888888, size: 0.8 })));

scene.add(new THREE.AmbientLight(0xffffff, 0.001)); // Nuit totale

// --- CAMÉRA (Inclinaison 20°) ---
const cameraDist = 320;
const cameraAngle = 20 * (Math.PI / 180);
camera.position.set(0, cameraDist * Math.sin(cameraAngle), cameraDist * Math.cos(cameraAngle));
camera.lookAt(0, -10, 0);

// --- NAVIGATION ---
document.getElementById('pauseBtn').onclick = () => isPaused = !isPaused;
document.getElementById('addHourBtn').onclick = () => { cumulativeTime += orbitDuration / (365.25 * 24); };
document.getElementById('addDayBtn').onclick = () => { cumulativeTime += orbitDuration / 365.25; };

// Tes réglages personnalisés
document.getElementById('winterBtn').onclick = () => cumulativeTime = 0.075 * orbitDuration;
document.getElementById('summerBtn').onclick = () => cumulativeTime = orbitDuration / 2 - 0.075 * orbitDuration;

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

    renderer.render(scene, camera);
}
requestAnimationFrame(animate);

window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});