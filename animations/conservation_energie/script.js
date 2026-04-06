window.onload = function() {
    const canvas = document.getElementById('mainCanvas');
    const ctx = canvas.getContext('2d');
    const muRange = document.getElementById('mu-range');
    const muValue = document.getElementById('mu-value');
    const hRange = document.getElementById('h-range');
    const hValue = document.getElementById('h-value');

    // --- PHYSIQUE (Valeurs issues de ton fichier original) ---
    const m = 1;              
    const g = 9.81;           
    const R_pixels = 250;     
    let R_metres = 10;       
    const cx = canvas.width / 2; 
    const cy = 90;
    const dt = 0.016;         
    
    let theta = -Math.PI / 2; 
    let omega = 0;            
    let eth = 0;              
    let enMarche = false;
    let em_initiale = m * g * R_metres;

    // --- BOUTONS ---
    document.getElementById('btn-start').onclick = () => enMarche = true;
    document.getElementById('btn-pause').onclick = () => enMarche = false;
    document.getElementById('btn-reset').onclick = () => {
        enMarche = false; theta = -Math.PI / 2; omega = 0; eth = 0;
    };

    function dessinerSkier(x, y, a) {
        ctx.save();
        ctx.translate(x, y); ctx.rotate(-a);
        
        // Snowboard - plus détaillé
        ctx.fillStyle = '#ff6b35'; ctx.fillRect(-22, 0, 44, 4);
        ctx.fillStyle = '#ffa500'; ctx.fillRect(-20, 0, 40, 2);
        // Fixations
        ctx.fillStyle = '#333'; ctx.fillRect(-10, -1, 5, 6); ctx.fillRect(5, -1, 5, 6);
        
        // Pieds
        ctx.fillStyle = '#1a1a1a'; ctx.fillRect(-12, -6, 8, 5); ctx.fillRect(4, -6, 8, 5);
        
        // Jambes
        ctx.strokeStyle = '#2c3e50'; ctx.lineWidth = 4;
        ctx.beginPath(); ctx.moveTo(-5, -4); ctx.lineTo(-8, -18); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(5, -4); ctx.lineTo(8, -18); ctx.stroke();
        
        // Corps (torse)
        ctx.fillStyle = '#e74c3c'; ctx.fillRect(-6, -26, 12, 10);
        
        // Bras gauche
        ctx.strokeStyle = '#f3c192'; ctx.lineWidth = 3;
        ctx.beginPath(); ctx.moveTo(-6, -22); ctx.lineTo(-18, -20); ctx.stroke();
        // Main gauche
        ctx.fillStyle = '#f3c192'; ctx.beginPath(); ctx.arc(-20, -20, 3, 0, 7); ctx.fill();
        
        // Bras droit
        ctx.strokeStyle = '#f3c192'; ctx.lineWidth = 3;
        ctx.beginPath(); ctx.moveTo(6, -22); ctx.lineTo(18, -20); ctx.stroke();
        // Main droite
        ctx.fillStyle = '#f3c192'; ctx.beginPath(); ctx.arc(20, -20, 3, 0, 7); ctx.fill();
        
        // Cou
        ctx.strokeStyle = '#2c3e50'; ctx.lineWidth = 4;
        ctx.beginPath(); ctx.moveTo(0, -26); ctx.lineTo(0, -32); ctx.stroke();
        
        // Tête
        ctx.fillStyle = '#f3c192'; ctx.beginPath(); ctx.arc(0, -36, 5, 0, 7); ctx.fill();
        
        // Yeux
        ctx.fillStyle = '#000'; ctx.beginPath(); ctx.arc(-2, -37, 1, 0, 7); ctx.fill();
        ctx.beginPath(); ctx.arc(2, -37, 1, 0, 7); ctx.fill();
        
        // Bouche
        ctx.strokeStyle = '#000'; ctx.lineWidth = 1;
        ctx.beginPath(); ctx.arc(0, -34, 1.5, 0, Math.PI); ctx.stroke();
        
        // Chapeau/bonnet
        ctx.fillStyle = '#3498db'; ctx.fillRect(-6, -42, 12, 6);
        ctx.beginPath(); ctx.moveTo(-6, -42); ctx.lineTo(-2, -46); ctx.lineTo(2, -46); ctx.lineTo(6, -42); ctx.fill();
        
        ctx.restore();
    }

    function boucle() {
        let R_metres = parseFloat(hRange.value);
        hValue.innerText = R_metres.toFixed(1);
        em_initiale = m * g * R_metres;

        let mu = parseFloat(muRange.value);
        muValue.innerText = mu.toFixed(3);

        if (enMarche) {
            let alpha_g = -(g / R_metres) * Math.sin(theta);
            let alpha_f = (Math.abs(omega) > 0.001) ? -Math.sign(omega) * mu * g / R_metres : 0;

            omega += (alpha_g + alpha_f) * dt;
            theta += omega * dt;

            if (mu > 0) {
                eth += Math.abs(mu * m * g * (omega * dt) * R_metres);
            }

            // Limites de la piste
            if (theta < -Math.PI/2) { theta = -Math.PI/2; omega = 0; }
            if (theta > Math.PI/2) { theta = Math.PI/2; omega = 0; }
        }

        // Calculs Énergétiques
        let h = R_metres * (1 - Math.cos(theta));
        let ep = m * g * h;
        let ec = 0.5 * m * Math.pow(omega * R_metres, 2);
        let em = ep + ec;
        if (mu === 0 && enMarche) em = em_initiale; 

        // Mise à jour de l'interface (Zone de droite)
        const maj = (id, val) => {
            let p = (val / em_initiale) * 100;
            document.getElementById(id+'-f').style.height = Math.min(100, Math.max(0, p)) + '%';
            document.getElementById(id+'-v').innerText = val.toFixed(1) + 'J';
        };
        maj('pot', ep);
        maj('kin', ec);
        maj('mec', em);
        maj('th', eth);

        // Dessin
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = '#fdfdfd'; ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // La piste
        ctx.beginPath(); ctx.arc(cx, cy, R_pixels, Math.PI, 0, true);
        ctx.lineWidth = 10; ctx.strokeStyle = '#bdc3c7'; ctx.stroke();

        // Double arrow for height h
        ctx.strokeStyle = '#000';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(cx, cy + R_pixels);
        ctx.lineTo(cx, cy);
        ctx.stroke();
        // arrow at bottom
        ctx.beginPath();
        ctx.moveTo(cx, cy + R_pixels);
        ctx.lineTo(cx - 5, cy + R_pixels - 10);
        ctx.moveTo(cx, cy + R_pixels);
        ctx.lineTo(cx + 5, cy + R_pixels - 10);
        ctx.stroke();
        // arrow at top
        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.lineTo(cx - 5, cy + 10);
        ctx.moveTo(cx, cy);
        ctx.lineTo(cx + 5, cy + 10);
        ctx.stroke();
        // label h
        ctx.fillStyle = '#000';
        ctx.font = '16px Arial';
        ctx.fillText('h', cx + 10, cy + R_pixels / 2);

        // Le skieur
        let sx = cx + R_pixels * Math.sin(theta);
        let sy = cy + R_pixels * Math.cos(theta);
        dessinerSkier(sx, sy, theta);

        requestAnimationFrame(boucle);
    }

    boucle();
};