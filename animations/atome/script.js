window.onload = function() {
    const canvas = document.getElementById('atomCanvas');
    const ctx = canvas.getContext('2d');
    const gCanvas = document.getElementById('gauge-canvas');
    const gCtx = gCanvas.getContext('2d');
    const scaler = document.getElementById('app-scaler');

    function handleResize() {
        const scale = Math.min(window.innerWidth / 1280, window.innerHeight / 720);
        scaler.style.transform = `scale(${scale})`;
    }
    window.addEventListener('resize', handleResize);
    handleResize();

    const elements = [
        { z: 0, n: "Vide", s: "" },
        { z: 1, n: "Hydrogène", s: "H", r: 1, c: 1, nz: 0 }, { z: 2, n: "Hélium", s: "He", r: 1, c: 8, nz: 2 },
        { z: 3, n: "Lithium", s: "Li", r: 2, c: 1, nz: 4 }, { z: 4, n: "Béryllium", s: "Be", r: 2, c: 2, nz: 5 },
        { z: 5, n: "Bore", s: "B", r: 2, c: 3, nz: 6 }, { z: 6, n: "Carbone", s: "C", r: 2, c: 4, nz: 6 },
        { z: 7, n: "Azote", s: "N", r: 2, c: 5, nz: 7 }, { z: 8, n: "Oxygène", s: "O", r: 2, c: 6, nz: 8 },
        { z: 9, n: "Fluor", s: "F", r: 2, c: 7, nz: 10 }, { z: 10, n: "Néon", s: "Ne", r: 2, c: 8, nz: 10 },
        { z: 11, n: "Sodium", s: "Na", r: 3, c: 1, nz: 12 }, { z: 12, n: "Magnésium", s: "Mg", r: 3, c: 2, nz: 12 },
        { z: 13, n: "Aluminium", s: "Al", r: 3, c: 3, nz: 14 }, { z: 14, n: "Silicium", s: "Si", r: 3, c: 4, nz: 14 },
        { z: 15, n: "Phosphore", s: "P", r: 3, c: 5, nz: 16 }, { z: 16, n: "Soufre", s: "S", r: 3, c: 6, nz: 16 },
        { z: 17, n: "Chlore", s: "Cl", r: 3, c: 7, nz: 18 }, { z: 18, n: "Argon", s: "Ar", r: 3, c: 8, nz: 22 }
    ];

    let nucleons = [], protons = 0, neutrons = 0, electrons = 0, angle = 0, isStable = true;

    elements.forEach((el, i) => {
        if (i === 0) return;
        const box = document.createElement('div');
        box.className = 'element-box';
        box.id = `box-${el.z}`;
        box.style.gridColumn = el.c > 2 ? el.c + 1 : el.c;
        box.style.gridRow = el.r;
        box.innerHTML = `<span>${el.z}</span><strong>${el.s}</strong>`;
        box.onclick = () => {
            protons = el.z; neutrons = el.nz; electrons = el.z;
            generateMixedNucleus(protons, neutrons);
            updateUI();
        };
        document.getElementById('periodic-table').appendChild(box);
    });

    function generateMixedNucleus(pCount, nCount) {
        nucleons = [];
        let pool = [];
        for(let i=0; i<pCount; i++) pool.push('p');
        for(let i=0; i<nCount; i++) pool.push('n');
        for (let i = pool.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [pool[i], pool[j]] = [pool[j], pool[i]];
        }
        pool.forEach(type => {
            let dist = 0, pos = null;
            while (!pos) {
                for (let a = 0; a < Math.PI * 2; a += 0.5) {
                    let x = Math.cos(a) * dist, y = Math.sin(a) * dist;
                    if (!nucleons.some(n => Math.hypot(n.x-x, n.y-y) < 18)) { pos = {x,y}; break; }
                } dist += 1;
            }
            nucleons.push({ x: pos.x, y: pos.y, type: type });
        });
    }

    function updateUI() {
        const el = elements[protons] || { n: "Inconnu", s: protons > 0 ? "?" : "" };
        const charge = protons - electrons;
        isStable = (protons === 0) || (neutrons >= protons - 1 && neutrons <= protons + Math.ceil(protons * 0.2) + 1);
        const stabDiv = document.getElementById('stability-info');
        stabDiv.innerText = protons > 0 ? (isStable ? "Noyau Stable" : "Noyau Instable") : "";
        stabDiv.className = isStable ? "stable" : "instable";
        document.getElementById('atom-name-title').innerText = protons === 0 ? "VIDE" : el.n.toUpperCase();
        let cD = "";
        if (charge > 0) cD = charge === 1 ? "+" : charge + "+";
        else if (charge < 0) cD = charge === -1 ? "-" : Math.abs(charge) + "-";
        document.getElementById('notation-container').innerHTML = `
            <div class="indices"><span>${protons+neutrons||""}</span><span>${protons||""}</span></div>
            <div class="symbol">${el.s}</div>
            <div class="charge-exposant">${cD}</div>`;
        document.querySelectorAll('.element-box').forEach(b => b.classList.remove('active'));
        if(document.getElementById(`box-${protons}`)) document.getElementById(`box-${protons}`).classList.add('active');
    }

    function addNucleon(type) {
        if (type === 'p' && protons >= 18) return;
        let dist = 0, pos = null;
        while (!pos) {
            for (let a = 0; a < Math.PI * 2; a += 0.5) {
                let x = Math.cos(a) * dist, y = Math.sin(a) * dist;
                if (!nucleons.some(n => Math.hypot(n.x-x, n.y-y) < 18)) { pos = {x,y}; break; }
            } dist += 1;
        }
        nucleons.push({ x: pos.x, y: pos.y, type: type });
        type === 'p' ? protons++ : neutrons++; updateUI();
    }

    function removeParticle(type) {
        if (type === 'e') { if (electrons > 0) electrons--; }
        else {
            const idx = nucleons.findLastIndex(n => n.type === type);
            if (idx !== -1) { nucleons.splice(idx, 1); type === 'p' ? protons-- : neutrons--; }
        } updateUI();
    }

    const ctrl = document.getElementById('controls');
    [['Protons', '#ef4444', 'p'], ['Neutrons', '#64748b', 'n'], ['Électrons', '#3b82f6', 'e']].forEach(p => {
        const div = document.createElement('div'); div.className = 'control-group';
        div.innerHTML = `<button style="background:#1e293b">−</button><label>${p[0]}</label><button style="background:${p[1]}">+</button>`;
        div.querySelectorAll('button')[0].onclick = () => removeParticle(p[2]);
        div.querySelectorAll('button')[1].onclick = () => {
            if(p[2] === 'e') { if(electrons < 36) electrons++; } else addNucleon(p[2]);
            updateUI();
        };
        ctrl.appendChild(div);
    });

    const resetBtn = document.createElement('button');
    resetBtn.innerText = "RÉINITIALISER";
    resetBtn.style.cssText = "margin-top:10px; width:100%; border-radius:10px; background:#ef4444; padding:12px; border:none; color:white; font-weight:bold; cursor:pointer; font-size:1rem;";
    resetBtn.onclick = () => { protons = 0; neutrons = 0; electrons = 0; nucleons = []; updateUI(); };
    ctrl.appendChild(resetBtn);

    function drawGauge() {
        const cx = 110, cy = 130, r = 70;
        gCtx.clearRect(0, 0, gCanvas.width, gCanvas.height);
        const grad = gCtx.createLinearGradient(30, 0, 190, 0);
        grad.addColorStop(0, "#38bdf8"); grad.addColorStop(0.5, "#4ade80"); grad.addColorStop(1, "#ef4444");
        gCtx.beginPath(); gCtx.arc(cx, cy, r, Math.PI, 2 * Math.PI);
        gCtx.strokeStyle = grad; gCtx.lineWidth = 10; gCtx.stroke();
        const charge = protons - electrons;
        const targetA = Math.PI + (Math.max(-18, Math.min(18, charge)) + 18) * (Math.PI / 36);
        gCtx.save(); gCtx.translate(cx, cy); gCtx.rotate(targetA);
        gCtx.beginPath(); gCtx.moveTo(0,0); gCtx.lineTo(r-5, 0);
        gCtx.strokeStyle = "white"; gCtx.lineWidth = 3; gCtx.stroke(); gCtx.restore();
        gCtx.fillStyle = "white"; gCtx.font = "bold 14px Arial"; gCtx.textAlign = "center";
        let txt = protons === 0 ? "" : (charge === 0 ? "NEUTRE" : (charge > 0 ? "CATION" : "ANION")) + " ("+(charge>0?"+":"")+charge+")";
        gCtx.fillText(txt, cx, cy + 30);
    }

    function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        let cx = 250, cy = 250;
        if (!isStable && protons > 0) { cx += Math.random()*4-2; cy += Math.random()*4-2; }
        let shells = [110, 160, 210]; if (electrons > 28) shells.push(260);
        ctx.lineWidth = 2; ctx.strokeStyle = "rgba(255,255,255,0.1)";
        shells.forEach(r => { ctx.beginPath(); ctx.arc(250, 250, r, 0, Math.PI*2); ctx.stroke(); });
        nucleons.forEach(n => {
            ctx.beginPath(); ctx.arc(cx + n.x, cy + n.y, 9, 0, Math.PI*2);
            ctx.fillStyle = n.type === 'p' ? "#ef4444" : "#64748b"; ctx.fill();
        });
        angle += 0.015;
        for (let i = 0; i < electrons; i++) {
            let orbit = i < 2 ? shells[0] : (i < 10 ? shells[1] : (i < 28 ? shells[2] : shells[3]));
            let speed = i < 2 ? angle + i*Math.PI : (i < 10 ? -angle*0.6 + i*0.8 : angle*0.4 + i*0.5);
            ctx.beginPath(); ctx.arc(250 + Math.cos(speed)*orbit, 250 + Math.sin(speed)*orbit, 7, 0, Math.PI*2);
            ctx.fillStyle = "#3b82f6"; ctx.fill();
        }
        drawGauge(); requestAnimationFrame(draw);
    }

    const fullData = [
        {z:1, s:"H", n:"Hydrogène", x:1, y:1}, {z:2, s:"He", n:"Hélium", x:18, y:1},
        {z:3, s:"Li", n:"Lithium", x:1, y:2}, {z:4, s:"Be", n:"Béryllium", x:2, y:2}, {z:5, s:"B", n:"Bore", x:13, y:2}, {z:6, s:"C", n:"Carbone", x:14, y:2}, {z:7, s:"N", n:"Azote", x:15, y:2}, {z:8, s:"O", n:"Oxygène", x:16, y:2}, {z:9, s:"F", n:"Fluor", x:17, y:2}, {z:10, s:"Ne", n:"Néon", x:18, y:2},
        {z:11, s:"Na", n:"Sodium", x:1, y:3}, {z:12, s:"Mg", n:"Magnésium", x:2, y:3}, {z:13, s:"Al", n:"Aluminium", x:13, y:3}, {z:14, s:"Si", n:"Silicium", x:14, y:3}, {z:15, s:"P", n:"Phosphore", x:15, y:3}, {z:16, s:"S", n:"Soufre", x:16, y:3}, {z:17, s:"Cl", n:"Chlore", x:17, y:3}, {z:18, s:"Ar", n:"Argon", x:18, y:3},
        {z:19, s:"K", n:"Potassium", x:1, y:4}, {z:20, s:"Ca", n:"Calcium", x:2, y:4}, {z:21, s:"Sc", n:"Scandium", x:3, y:4}, {z:22, s:"Ti", n:"Titane", x:4, y:4}, {z:23, s:"V", n:"Vanadium", x:5, y:4}, {z:24, s:"Cr", n:"Chrome", x:6, y:4}, {z:25, s:"Mn", n:"Manganèse", x:7, y:4}, {z:26, s:"Fe", n:"Fer", x:8, y:4}, {z:27, s:"Co", n:"Cobalt", x:9, y:4}, {z:28, s:"Ni", n:"Nickel", x:10, y:4}, {z:29, s:"Cu", n:"Cuivre", x:11, y:4}, {z:30, s:"Zn", n:"Zinc", x:12, y:4}, {z:31, s:"Ga", n:"Gallium", x:13, y:4}, {z:32, s:"Ge", n:"Germanium", x:14, y:4}, {z:33, s:"As", n:"Arsenic", x:15, y:4}, {z:34, s:"Se", n:"Sélénium", x:16, y:4}, {z:35, s:"Br", n:"Brome", x:17, y:4}, {z:36, s:"Kr", n:"Krypton", x:18, y:4},
        {z:37, s:"Rb", n:"Rubidium", x:1, y:5}, {z:38, s:"Sr", n:"Strontium", x:2, y:5}, {z:39, s:"Y", n:"Yttrium", x:3, y:5}, {z:40, s:"Zr", n:"Zirconium", x:4, y:5}, {z:41, s:"Nb", n:"Niobium", x:5, y:5}, {z:42, s:"Mo", n:"Molybdène", x:6, y:5}, {z:43, s:"Tc", n:"Technétium", x:7, y:5}, {z:44, s:"Ru", n:"Ruthénium", x:8, y:5}, {z:45, s:"Rh", n:"Rhodium", x:9, y:5}, {z:46, s:"Pd", n:"Palladium", x:10, y:5}, {z:47, s:"Ag", n:"Argent", x:11, y:5}, {z:48, s:"Cd", n:"Cadmium", x:12, y:5}, {z:49, s:"In", n:"Indium", x:13, y:5}, {z:50, s:"Sn", n:"Étain", x:14, y:5}, {z:51, s:"Sb", n:"Antimoine", x:15, y:5}, {z:52, s:"Te", n:"Tellure", x:16, y:5}, {z:53, s:"I", n:"Iode", x:17, y:5}, {z:54, s:"Xe", n:"Xénon", x:18, y:5},
        {z:55, s:"Cs", n:"Césium", x:1, y:6}, {z:56, s:"Ba", n:"Baryum", x:2, y:6}, {z:57, s:"La", n:"Lanthane", x:3, y:6}, {z:72, s:"Hf", n:"Hafnium", x:4, y:6}, {z:73, s:"Ta", n:"Tantale", x:5, y:6}, {z:74, s:"W", n:"Tungstène", x:6, y:6}, {z:75, s:"Re", n:"Rhénium", x:7, y:6}, {z:76, s:"Os", n:"Osmium", x:8, y:6}, {z:77, s:"Ir", n:"Iridium", x:9, y:6}, {z:78, s:"Pt", n:"Platine", x:10, y:6}, {z:79, s:"Au", n:"Or", x:11, y:6}, {z:80, s:"Hg", n:"Mercure", x:12, y:6}, {z:81, s:"Tl", n:"Thallium", x:13, y:6}, {z:82, s:"Pb", n:"Plomb", x:14, y:6}, {z:83, s:"Bi", n:"Bismuth", x:15, y:6}, {z:84, s:"Po", n:"Polonium", x:16, y:6}, {z:85, s:"At", n:"Astate", x:17, y:6}, {z:86, s:"Rn", n:"Radon", x:18, y:6},
        {z:87, s:"Fr", n:"Francium", x:1, y:7}, {z:88, s:"Ra", n:"Radium", x:2, y:7}, {z:89, s:"Ac", n:"Actinium", x:3, y:7}, {z:104, s:"Rf", n:"Rutherfordium", x:4, y:7}, {z:105, s:"Db", n:"Dubnium", x:5, y:7}, {z:106, s:"Sg", n:"Seaborgium", x:6, y:7}, {z:107, s:"Bh", n:"Bohrium", x:7, y:7}, {z:108, s:"Hs", n:"Hassium", x:8, y:7}, {z:109, s:"Mt", n:"Meitnerium", x:9, y:7}, {z:110, s:"Ds", n:"Darmstadtium", x:10, y:7}, {z:111, s:"Rg", n:"Roentgenium", x:11, y:7}, {z:112, s:"Cn", n:"Copernicium", x:12, y:7}, {z:113, s:"Nh", n:"Nihonium", x:13, y:7}, {z:114, s:"Fl", n:"Flerovium", x:14, y:7}, {z:115, s:"Mc", n:"Moscovium", x:15, y:7}, {z:116, s:"Lv", n:"Livermorium", x:16, y:7}, {z:117, s:"Ts", n:"Tennesse", x:17, y:7}, {z:118, s:"Og", n:"Oganesson", x:18, y:7}
    ];

    const fGrid = document.getElementById('full-table-grid');
    fullData.forEach(e => {
        const d = document.createElement('div'); d.className = 'full-cell';
        d.style.gridColumn = e.x; d.style.gridRow = e.y;
        d.innerHTML = `<span>${e.z}</span><strong>${e.s}</strong><em>${e.n}</em>`;
        fGrid.appendChild(d);
    });

    const mod = document.getElementById('modal-table');
    document.getElementById('btn-full-table').onclick = () => mod.style.display = 'flex';
    document.getElementById('close-modal').onclick = () => mod.style.display = 'none';
    window.onclick = (e) => { if(e.target == mod) mod.style.display = 'none'; };

    updateUI(); draw();
};