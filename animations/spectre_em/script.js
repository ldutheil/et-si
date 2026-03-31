window.onload = function() {
    const canvas = document.getElementById('spectrumCanvas');
    const ctx = canvas.getContext('2d');
    const categoryValue = document.getElementById('categoryValue');
    const exampleValue = document.getElementById('exampleValue');
    const freqSlider = document.getElementById('freqSlider');
    const toggleBtn = document.getElementById('toggleWavelength');

    let mouseX = 0;
    let showNm = false;

    // --- BASE DE DONNÉES (7 catégories, ~60 exemples au total) ---
    const spectrumData = [
        { start: 0, end: 0.2, name: "Ondes Radio", color: "#38bdf8", examples: ["Radio AM", "Radio FM", "GPS", "Smartphones", "TV Numérique", "Talkie-Walkie", "Radar météo", "Lignes Haute Tension", "Signaux Sous-marins", "Pulsars"] },
        { start: 0.2, end: 0.4, name: "Micro-ondes", color: "#60a5fa", examples: ["Four Micro-ondes", "WiFi 2.4GHz", "Bluetooth", "Satellite Starlink", "Radars de vitesse", "Téléphonie 5G", "Sondes Deep Space", "Bruit de fond cosmologique", "Scanner Corporel", "Séchage industriel"] },
        { start: 0.4, end: 0.55, name: "Infrarouges", color: "#fb923c", examples: ["Télécommande", "Caméra thermique", "Capteur de présence", "Fibre optique", "Chaleur corporelle", "LED infrarouge", "Laser de découpe", "Télescope James Webb", "Vision nocturne", "Sauna IR"] },
        { start: 0.55, end: 0.65, name: "Visible", color: "rainbow", examples: ["Laser rouge", "Arc-en-ciel", "Écran OLED", "Lumière du jour", "Bioluminescence", "LED blanche", "Feux tricolores", "Chlorophylle", "Aurores boréales", "Signalisation marine"] },
        { start: 0.65, end: 0.8, name: "Ultraviolets", color: "#a855f7", examples: ["Bronzage", "Stérilisation UV", "Lampe à polymériser", "Détection faux billets", "Lumière noire", "Soudure à l'arc", "Synthèse Vitamine D", "Télescopes UV", "Analyse forensic", "Pièges à insectes"] },
        { start: 0.8, end: 0.9, name: "Rayons X", color: "#f43f5e", examples: ["Radiographie dentaire", "Scanner CT", "Cristallographie", "Contrôle bagages", "Inspection soudures", "Radiothérapie", "Trous noirs", "Microscopie X", "Astrophysique haute énergie", "Détection fissures"] },
        { start: 0.9, end: 1.0, name: "Rayons Gamma", color: "#ef4444", examples: ["Médecine Nucléaire", "Stérilisation médicale", "Traceurs radioactifs", "Scanner PET", "Réactions nucléaires", "Explosion Supernova", "Bombardement cosmique", "Désintégration Cobalt-60", "Sondes de densité", "Éclairs gamma terrestres"] }
    ];

    function resize() {
        canvas.width = canvas.parentElement.clientWidth;
        canvas.height = canvas.parentElement.clientHeight;
    }

    window.addEventListener('resize', resize);
    
    canvas.addEventListener('mousemove', (e) => {
        const rect = canvas.getBoundingClientRect();
        mouseX = e.clientX - rect.left;
        updateUI();
    });

    toggleBtn.addEventListener('click', () => {
        showNm = !showNm;
        toggleBtn.innerText = showNm ? "📏 Masquer les mesures" : "📏 Afficher les nanomètres (nm)";
    });

    function updateUI() {
        const percent = mouseX / canvas.width;
        // On cherche dans quelle catégorie se trouve la souris
        const zone = spectrumData.find(z => percent >= z.start && percent <= z.end);
        
        if (zone) {
            categoryValue.innerText = zone.name;
            categoryValue.style.color = (zone.color === 'rainbow') ? '#fff' : zone.color;
            
            // On calcule l'index de l'exemple en fonction de la position précise DANS la zone
            const localPercent = (percent - zone.start) / (zone.end - zone.start);
            const exIndex = Math.floor(localPercent * zone.examples.length);
            exampleValue.innerText = zone.examples[Math.min(exIndex, zone.examples.length - 1)];
        }
    }

    function drawSpectrumBar(y, height, isVisibleOnly = false) {
        const grad = ctx.createLinearGradient(0, 0, canvas.width, 0);
        
        if (!isVisibleOnly) {
            spectrumData.forEach(z => {
                if (z.color === 'rainbow') {
                    grad.addColorStop(z.start, "#ff0000");
                    grad.addColorStop(z.end, "#4b0082");
                } else {
                    grad.addColorStop((z.start + z.end) / 2, z.color);
                }
            });
        } else {
            // Spectre Visible pur (380nm - 750nm)
            grad.addColorStop(0, "#ff0000"); grad.addColorStop(0.2, "#ffff00");
            grad.addColorStop(0.4, "#00ff00"); grad.addColorStop(0.6, "#00ffff");
            grad.addColorStop(0.8, "#0000ff"); grad.addColorStop(1, "#ff00ff");
        }

        ctx.fillStyle = grad;
        ctx.fillRect(0, y, canvas.width, height);

        // Dessiner les séparations
        if (!isVisibleOnly) {
            ctx.strokeStyle = "rgba(10, 15, 30, 0.5)";
            ctx.lineWidth = 2;
            spectrumData.forEach(z => {
                ctx.beginPath();
                ctx.moveTo(z.start * canvas.width, y);
                ctx.lineTo(z.start * canvas.width, y + height);
                ctx.stroke();
            });
        }
    }

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        const midY = canvas.height * 0.3;
        const zoomY = canvas.height * 0.7;

        // 1. Barre Principale
        ctx.fillStyle = "#94a3b8"; ctx.font = "10px monospace";
        ctx.fillText("SPECTRE ÉLECTROMAGNÉTIQUE COMPLET", 10, midY - 50);
        drawSpectrumBar(midY - 40, 40);

        // 2. Zone de Zoom (Visible)
        ctx.fillStyle = "#94a3b8";
        ctx.fillText("ZOOM : LUMIÈRE VISIBLE", 10, zoomY - 15);
        drawSpectrumBar(zoomY, 60, true);

        // Labels des nanomètres (Si activé)
        if (showNm) {
            ctx.fillStyle = "#38bdf8";
            ctx.font = "bold 10px Arial";
            for(let i=0; i<=6; i++) {
                const x = (i/6) * canvas.width;
                const val = 700 - (i * 50); // Approximatif pour le visuel
                ctx.fillText(val + " nm", x + 5, zoomY + 75);
                ctx.fillRect(x, zoomY + 60, 1, 10);
            }
        }

        // 3. Curseur d'interaction
        ctx.strokeStyle = "#fff";
        ctx.setLineDash([5, 5]);
        ctx.beginPath();
        ctx.moveTo(mouseX, 50);
        ctx.lineTo(mouseX, canvas.height - 50);
        ctx.stroke();
        ctx.setLineDash([]);

        requestAnimationFrame(animate);
    }

    // Modal logic (inchangée)
    const modal = document.getElementById('usageModal');
    const btn = document.getElementById('usageTableBtn');
    const closeBtn = document.querySelector('.close-btn');
    btn.onclick = () => {
        const tbody = document.querySelector('#usageTable tbody');
        tbody.innerHTML = spectrumData.map(d => `<tr><td>${d.name}</td><td>${d.color}</td><td>${d.examples.slice(0,3).join(', ')}...</td></tr>`).join('');
        modal.style.display = 'block';
    };
    closeBtn.onclick = () => modal.style.display = 'none';

    resize();
    animate();
};