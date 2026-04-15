window.onload = function() {
    const canvas = document.getElementById('spectrumCanvas');
    const ctx = canvas.getContext('2d');
    const categoryValue = document.getElementById('categoryValue');
    const exampleValue = document.getElementById('exampleValue');
    const freqSlider = document.getElementById('freqSlider');
    const toggleBtn = document.getElementById('toggleWavelength');

    let mouseX = 0;
    let unitMode = 'nm'; // 'nm' ou 'hz'

    // --- BASE DE DONNÉES (7 catégories, ~60 exemples au total) ---
    const spectrumData = [
        { start: 0, end: 0.1, name: "Rayons Gamma", color: "#334155", examples: ["Médecine Nucléaire", "Stérilisation médicale", "Traceurs radioactifs", "Scanner PET", "Réactions nucléaires", "Explosion Supernova", "Bombardement cosmique", "Éclairs gamma terrestres"] },
        { start: 0.1, end: 0.2, name: "Rayons X", color: "#475569", examples: ["Radiographie dentaire", "Scanner CT", "Cristallographie", "Contrôle bagages", "Inspection soudures", "Radiothérapie", "Trous noirs", "Astrophysique haute énergie"] },
        { start: 0.2, end: 0.35, name: "Ultraviolets", color: "#64748b", examples: ["Bronzage", "Stérilisation UV", "Lampe à polymériser", "Détection faux billets", "Lumière noire", "Soudure à l'arc", "Synthèse Vitamine D", "Télescopes UV", "Pièges à insectes"] },
        { start: 0.35, end: 0.45, name: "Visible", color: "rainbow", examples: [] },
        { start: 0.45, end: 0.6, name: "Infrarouges", color: "#64748b", examples: ["Télécommande", "Caméra thermique", "Capteur de présence", "Fibre optique", "Chaleur corporelle", "LED infrarouge", "Laser de découpe", "Télescope James Webb", "Vision nocturne"] },
        { start: 0.6, end: 0.8, name: "Micro-ondes", color: "#475569", examples: ["Four Micro-ondes", "WiFi 2.4GHz", "Bluetooth", "Satellite Starlink", "Radars de vitesse", "Téléphonie 5G", "Sondes Deep Space", "Scanner Corporel", "Séchage industriel"] },
        { start: 0.8, end: 1.0, name: "Ondes Radio", color: "#334155", examples: ["Radio AM", "Radio FM", "GPS", "Smartphones", "TV Numérique", "Talkie-Walkie", "Radar météo", "Lignes Haute Tension", "Pulsars"] }
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
        unitMode = (unitMode === 'nm') ? 'hz' : 'nm';
        toggleBtn.innerText = (unitMode === 'nm') ? "Afficher les fréquences (en TeraHertz)" : "Afficher les longueurs d'onde (en nanomètres)";
    });

    function updateUI() {
        const percent = mouseX / canvas.width;
        // On cherche dans quelle catégorie se trouve la souris
        const zone = spectrumData.find(z => percent >= z.start && percent <= z.end);
        
        if (zone) {
            categoryValue.innerText = zone.name;
            categoryValue.style.color = (zone.color === 'rainbow') ? '#fff' : '#94a3b8';
            
            // On calcule l'index de l'exemple en fonction de la position précise DANS la zone
            const localPercent = (percent - zone.start) / (zone.end - zone.start);
            
            if (zone.examples.length > 0) {
                const exIndex = Math.floor(localPercent * zone.examples.length);
                exampleValue.innerText = zone.examples[Math.min(exIndex, zone.examples.length - 1)];
            } else {
                exampleValue.innerText = "";
            }

            // Ajout de la valeur numérique si on est dans le visible
            if (zone.name === "Visible") {
                if (unitMode === 'nm') {
                    const nm = Math.round(380 + localPercent * 370);
                    exampleValue.innerText = `${nm} nm`;
                } else {
                    const thz = Math.round(790 - localPercent * 390);
                    exampleValue.innerText = `${thz} THz`;
                }
            }
        }
    }

    function drawSpectrumBar(y, height, isVisibleOnly = false) {
        const grad = ctx.createLinearGradient(0, 0, canvas.width, 0);
        
        if (!isVisibleOnly) {
            spectrumData.forEach(z => {
                if (z.color === 'rainbow') {
                    const r = z.end - z.start;
                    grad.addColorStop(z.start, "#ff00ff");
                    grad.addColorStop(z.start + r * 0.2, "#0000ff");
                    grad.addColorStop(z.start + r * 0.4, "#00ffff");
                    grad.addColorStop(z.start + r * 0.6, "#00ff00");
                    grad.addColorStop(z.start + r * 0.8, "#ffff00");
                    grad.addColorStop(z.end, "#ff0000");
                } else {
                    grad.addColorStop((z.start + z.end) / 2, z.color);
                }
            });
        } else {
            // Spectre Visible pur (380nm - 750nm)
            grad.addColorStop(0, "#ff00ff"); grad.addColorStop(0.2, "#0000ff");
            grad.addColorStop(0.4, "#00ffff"); grad.addColorStop(0.6, "#00ff00");
            grad.addColorStop(0.8, "#ffff00"); grad.addColorStop(1, "#ff0000");
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

        // --- LIGNES DE RAPPEL (Tirets) ---
        const visibleZone = spectrumData.find(z => z.name === "Visible");
        if (visibleZone) {
            ctx.setLineDash([5, 5]);
            ctx.strokeStyle = "rgba(148, 163, 184, 0.4)";
            ctx.lineWidth = 3;
            
            // Ligne gauche (Début du visible vers le bord gauche du zoom)
            ctx.beginPath();
            ctx.moveTo(visibleZone.start * canvas.width, midY);
            ctx.lineTo(0, zoomY);
            ctx.stroke();
            
            // Ligne droite (Fin du visible vers le bord droit du zoom)
            ctx.beginPath();
            ctx.moveTo(visibleZone.end * canvas.width, midY);
            ctx.lineTo(canvas.width, zoomY);
            ctx.stroke();
            ctx.setLineDash([]);
        }

        // 2. Zone de Zoom (Visible)
        ctx.fillStyle = "#94a3b8";
        ctx.fillText("ZOOM : LUMIÈRE VISIBLE", 10, zoomY - 15);
        drawSpectrumBar(zoomY, 60, true);

        // Labels dynamiques (nm ou THz)
        ctx.fillStyle = "#38bdf8";
        ctx.font = "bold 10px Arial";
        for(let i=0; i<=6; i++) {
            const x = (i/6) * canvas.width;
            const val = (unitMode === 'nm') 
                ? Math.round(380 + (i/6) * 370) 
                : Math.round(790 - (i/6) * 390);
            const unit = (unitMode === 'nm') ? "nm" : "THz";
            ctx.fillText(val + " " + unit, x + 5, zoomY + 75);
            ctx.fillRect(x, zoomY, 1, 70); // Graduation complète
        }

        // 3. Curseur d'interaction
        ctx.strokeStyle = "#fff";
        ctx.lineWidth = 2;
        ctx.setLineDash([5, 5]);
        
        // Curseur sur la barre du haut
        ctx.beginPath();
        ctx.moveTo(mouseX, midY - 45);
        ctx.lineTo(mouseX, midY);
        ctx.stroke();

        // Curseur sur la barre du bas (uniquement si dans le visible)
        const percent = mouseX / canvas.width;
        if (visibleZone && percent >= visibleZone.start && percent <= visibleZone.end) {
            const localPercent = (percent - visibleZone.start) / (visibleZone.end - visibleZone.start);
            const zoomX = localPercent * canvas.width;
            ctx.beginPath();
            ctx.moveTo(zoomX, zoomY - 10);
            ctx.lineTo(zoomX, zoomY + 75);
            ctx.stroke();
        }
        ctx.setLineDash([]);
        requestAnimationFrame(animate);
    }

    // Modal logic (inchangée)
    const modal = document.getElementById('usageModal');
    const btn = document.getElementById('usageTableBtn');
    const closeBtn = document.querySelector('.close-btn');
    btn.onclick = () => {
        const tbody = document.querySelector('#usageTable tbody');
        tbody.innerHTML = spectrumData.map(d => `<tr><td>${d.name}</td><td>${d.examples.join(', ')}</td></tr>`).join('');
        modal.style.display = 'block';
    };
    closeBtn.onclick = () => modal.style.display = 'none';

    resize();
    animate();
};