window.onload = function() {
    const canvas = document.getElementById('atomCanvas');
    const ctx = canvas.getContext('2d');
    const gCanvas = document.getElementById('gauge-canvas');
    const gCtx = gCanvas.getContext('2d');

    const elements = [
        { z: 0, n: "Vide", s: "" },
        { z: 1, n: "Hydrogène", s: "H", r: 1, c: 1 }, { z: 2, n: "Hélium", s: "He", r: 1, c: 8 },
        { z: 3, n: "Lithium", s: "Li", r: 2, c: 1 }, { z: 4, n: "Béryllium", s: "Be", r: 2, c: 2 },
        { z: 5, n: "Bore", s: "B", r: 2, c: 3 }, { z: 6, n: "Carbone", s: "C", r: 2, c: 4 },
        { z: 7, n: "Azote", s: "N", r: 2, c: 5 }, { z: 8, n: "Oxygène", s: "O", r: 2, c: 6 },
        { z: 9, n: "Fluor", s: "F", r: 2, c: 7 }, { z: 10, n: "Néon", s: "Ne", r: 2, c: 8 },
        { z: 11, n: "Sodium", s: "Na", r: 3, c: 1 }, { z: 12, n: "Magnésium", s: "Mg", r: 3, c: 2 },
        { z: 13, n: "Aluminium", s: "Al", r: 3, c: 3 }, { z: 14, n: "Silicium", s: "Si", r: 3, c: 4 },
        { z: 15, n: "Phosphore", s: "P", r: 3, c: 5 }, { z: 16, n: "Soufre", s: "S", r: 3, c: 6 },
        { z: 17, n: "Chlore", s: "Cl", r: 3, c: 7 }, { z: 18, n: "Argon", s: "Ar", r: 3, c: 8 }
    ];

    let nucleons = [], protons = 0, neutrons = 0, electrons = 0, angle = 0;

    elements.forEach((el, i) => {
        if (i === 0) return;
        const box = document.createElement('div');
        box.className = 'element-box';
        box.id = `box-${el.z}`;
        box.style.gridColumn = el.c; box.style.gridRow = el.r;
        box.innerHTML = `<span>${el.z}</span><strong>${el.s}</strong>`;
        document.getElementById('periodic-table').appendChild(box);
    });

    function updateUI() {
        const el = elements[protons] || { n: "Inconnu", s: "?" };
        const charge = protons - electrons;
        
        document.getElementById('atom-name-title').innerText = (protons === 0) ? "VIDE" : el.n.toUpperCase();

        let chargeDisplay = "";
        if (charge > 0) chargeDisplay = (charge === 1) ? "+" : charge + "+";
        else if (charge < 0) chargeDisplay = (charge === -1) ? "-" : Math.abs(charge) + "-";
        
        document.getElementById('notation-container').innerHTML = `
            <div class="indices"><span>${protons+neutrons||""}</span><span>${protons||""}</span></div>
            <div class="symbol">${el.s}</div>
            <div class="charge-exposant">${chargeDisplay}</div>`;
            
        document.querySelectorAll('.element-box').forEach(b => b.classList.remove('active'));
        if(document.getElementById(`box-${protons}`)) document.getElementById(`box-${protons}`).classList.add('active');
    }

    function drawGauge() {
        const cx = 110, cy = 130, r = 80;
        gCtx.clearRect(0, 0, gCanvas.width, gCanvas.height);
        
        const grad = gCtx.createLinearGradient(30, 0, 190, 0);
        grad.addColorStop(0, "#38bdf8"); grad.addColorStop(0.5, "#4ade80"); grad.addColorStop(1, "#ef4444");
        
        gCtx.beginPath(); gCtx.arc(cx, cy, r, Math.PI, 2 * Math.PI);
        gCtx.strokeStyle = grad; gCtx.lineWidth = 12; gCtx.stroke();
        
        gCtx.fillStyle = "white"; gCtx.font = "10px Arial"; gCtx.textAlign = "center";
        [-18, -12, -6, 0, 6, 12, 18].forEach(v => {
            const a = Math.PI + (v + 18) * (Math.PI / 36);
            gCtx.fillText(v > 0 ? "+"+v : v, cx + Math.cos(a)*(r+18), cy + Math.sin(a)*(r+18));
        });

        const charge = protons - electrons;
        let typeText = "NEUTRE"; let colorText = "#4ade80";
        if (charge > 0) { typeText = "CATION"; colorText = "#ef4444"; }
        else if (charge < 0) { typeText = "ANION"; colorText = "#38bdf8"; }
        if (protons === 0) typeText = "";

        gCtx.fillStyle = colorText; gCtx.font = "bold 14px Arial";
        gCtx.fillText(typeText, cx, cy - 25);

        const targetA = Math.PI + (Math.max(-18, Math.min(18, charge)) + 18) * (Math.PI / 36);
        gCtx.save(); gCtx.translate(cx, cy); gCtx.rotate(targetA);
        gCtx.beginPath(); gCtx.moveTo(0,0); gCtx.lineTo(r-5, 0);
        gCtx.strokeStyle = "white"; gCtx.lineWidth = 3; gCtx.stroke(); gCtx.restore();
    }

    function addNucleon(type) {
        if (type === 'p' && protons >= 18) return;
        let dist = 0, pos = null;
        while (!pos) {
            for (let a = 0; a < Math.PI * 2; a += 0.5) {
                let x = Math.cos(a) * dist, y = Math.sin(a) * dist;
                if (!nucleons.some(n => Math.hypot(n.x-x, n.y-y) < 18)) { pos = {x,y}; break; }
            }
            dist += 1;
        }
        nucleons.push({ x: pos.x, y: pos.y, type: type });
        type === 'p' ? protons++ : neutrons++; updateUI();
    }

    const btns = document.getElementById('controls');
    const create = (t, c, f) => { 
        const b = document.createElement('button'); b.innerText = t; b.style.backgroundColor = c; 
        b.onclick = f; btns.appendChild(b); 
    };
    create("+ PROTON", "#ef4444", () => addNucleon('p'));
    create("+ NEUTRON", "#64748b", () => addNucleon('n'));
    create("+ ÉLECTRON", "#3b82f6", () => { if(electrons < 36) electrons++; updateUI(); });
    create("RESET", "#334155", () => { protons=0; neutrons=0; electrons=0; nucleons=[]; updateUI(); });

    function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        const cx = canvas.width / 2;
        const cy = canvas.height / 2;

        const shells = [110, 160, 210];
        ctx.lineWidth = 2; ctx.strokeStyle = "rgba(255, 255, 255, 0.2)";
        shells.forEach(r => { ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI*2); ctx.stroke(); });

        nucleons.forEach(n => {
            ctx.beginPath(); ctx.arc(cx + n.x, cy + n.y, 9, 0, Math.PI*2);
            ctx.fillStyle = n.type === 'p' ? "#ef4444" : "#64748b"; ctx.fill();
            ctx.lineWidth = 1.5; ctx.strokeStyle = "#ffffff"; ctx.stroke();
            if (n.type === 'p') {
                ctx.fillStyle = "white"; ctx.font = "bold 11px Arial"; ctx.textAlign = "center"; ctx.textBaseline = "middle";
                ctx.fillText("+", cx + n.x, cy + n.y);
            }
        });

        angle += 0.015;
        for (let i = 0; i < electrons; i++) {
            let orbit = i < 2 ? shells[0] : (i < 10 ? shells[1] : shells[2]);
            let speed = i < 2 ? angle + i*Math.PI : (i < 10 ? -angle*0.6 + i*0.8 : angle*0.4 + i*0.5);
            const ex = cx + Math.cos(speed)*orbit;
            const ey = cy + Math.sin(speed)*orbit;
            ctx.beginPath(); ctx.arc(ex, ey, 7, 0, Math.PI*2);
            ctx.fillStyle = "#3b82f6"; ctx.fill();
            ctx.lineWidth = 1.5; ctx.strokeStyle = "#ffffff"; ctx.stroke();
            ctx.fillStyle = "white"; ctx.font = "bold 13px Arial"; ctx.textAlign = "center"; ctx.textBaseline="middle";
            ctx.fillText("-", ex, ey);
        }
        drawGauge();
        requestAnimationFrame(draw);
    }
    updateUI(); draw();
};