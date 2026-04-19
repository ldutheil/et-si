const houseData = [
    {
        name: "Cuisine",
        id: "kit",
        appliances: [
            { name: "Réfrigérateur", power: 150, hours: 12, icon: "❄️" },
            { name: "Four électrique", power: 2500, hours: 0.5, icon: "🔥" },
            { name: "Lave-vaisselle", power: 1200, hours: 1, icon: "💧" },
            { name: "Plaques induction", power: 3000, hours: 0.7, icon: "🍳" },
            { name: "Radiateur", power: 1500, hours: 0, icon: "🌡️" }
        ]
    },
    {
        name: "Salon",
        id: "liv",
        appliances: [
            { name: "Télévision", power: 100, hours: 4, icon: "📺" },
            { name: "Climatisation", power: 2000, hours: 0, icon: "🌬️" },
            { name: "Box Internet", power: 20, hours: 24, icon: "🌐" },
            { name: "Éclairage", power: 40, hours: 5, icon: "💡" },
            { name: "Radiateur", power: 1500, hours: 0, icon: "🌡️" }
        ]
    },
    {
        name: "Chambre 1",
        id: "ch1",
        appliances: [
            { name: "Ordinateur", power: 300, hours: 3, icon: "💻" },
            { name: "Lampe de chevet", power: 10, hours: 2, icon: "🕯️" },
            { name: "Radiateur", power: 1500, hours: 0, icon: "🌡️" }

        ]
    },
    {
        name: "Chambre 2",
        id: "ch2",
        appliances: [
            { name: "Console de jeu", power: 200, hours: 2, icon: "🎮" },
            { name: "Éclairage", power: 20, hours: 4, icon: "💡" },
            { name: "Chargeur", power: 15, hours: 3, icon: "📱" },
            { name: "Radiateur", power: 1500, hours: 0, icon: "🌡️" }
        ]
    },
    {
        name: "Garage / Buanderie",
        id: "gar",
        appliances: [
            { name: "Voiture Électrique", power: 0.18, hours: 30, icon: "🚗", isCar: true },
            { name: "Lave-linge", power: 2000, hours: 0.5, icon: "🧺" },
            { name: "Sèche-linge", power: 3000, hours: 0.5, icon: "🌪️" },
            { name: "Porte Garage", power: 500, hours: 0.1, icon: "🚪" },
        ]
    },
    {
        name: "Chambre 3",
        id: "ch3",
        hidden: true,
        appliances: [
            { name: "Éclairage", power: 20, hours: 4, icon: "💡" },
            { name: "Ordinateur", power: 250, hours: 2, icon: "💻" },
            { name: "Radiateur", power: 1500, hours: 0, icon: "🌡️" }

        ]
    },
];

function init() {
    const grid = document.getElementById('house-grid');
    const periodSelect = document.getElementById('period-select');
    const toggleCh3 = document.getElementById('toggle-ch3');
    const winterBtn = document.getElementById('winter-btn');
    const summerBtn = document.getElementById('summer-btn');
    const resetBtn = document.getElementById('reset-btn');
    const toggleEco = document.getElementById('toggle-eco');

    houseData.forEach((room, roomIdx) => {
        const roomDiv = document.createElement('div');
        roomDiv.className = `room-container room-${room.id} ${room.hidden ? 'hidden' : ''}`;
        
        roomDiv.innerHTML = `
            <div class="room-header">
                <span>${room.name}</span>
                <span id="room-total-${roomIdx}">0 kWh</span>
            </div>
            <canvas id="canvas-${roomIdx}" class="room-canvas" width="280" height="80"></canvas>
            <div class="appliance-list">
                ${room.appliances.map((app, appIdx) => {
                    const unit = app.isCar ? "km / jr" : "h / jr";
                    const label = app.isCar ? `${app.icon} ${app.name}` : `${app.icon} ${app.name} (${app.power}W)`;
                    return `
                    <div class="appliance-item">
                        <span>${label}</span>
                        <input type="number" step="${app.isCar ? 10 : 0.5}" min="0" max="${app.isCar ? 500 : 24}" 
                               value="${app.hours}" 
                               data-room="${roomIdx}" data-app="${appIdx}"> ${unit}
                    </div>
                `}).join('')}
            </div>
        `;
        grid.appendChild(roomDiv);
        drawRoom(roomIdx);
    });

    document.querySelectorAll('input').forEach(input => {
        input.addEventListener('input', (e) => {
            const rIdx = e.target.dataset.room;
            const aIdx = e.target.dataset.app;
            if (rIdx === undefined) return;

            houseData[rIdx].appliances[aIdx].hours = parseFloat(e.target.value) || 0;
            calculate();
        });
    });

    toggleCh3.addEventListener('change', (e) => {
        const isVisible = e.target.checked;
        const ch3Data = houseData.find(r => r.id === 'ch3');
        ch3Data.hidden = !isVisible;
        
        const ch3Div = document.querySelector('.room-ch3');
        if (ch3Div) ch3Div.classList.toggle('hidden', !isVisible);
        calculate();
    });

    winterBtn.addEventListener('click', () => {
        document.getElementById('roof').classList.add('winter');
        toggleSnow(true);
        toggleSun(false);
        houseData.forEach((room, roomIdx) => {
            room.appliances.forEach((app, appIdx) => {
                if (app.name === "Radiateur" || app.name === "Climatisation") {
                    app.hours = (app.name === "Radiateur") ? 4 : 0;
                    const input = document.querySelector(`input[data-room="${roomIdx}"][data-app="${appIdx}"]`);
                    if (input) input.value = app.hours;
                }
            });
        });
        calculate();
    });

    summerBtn.addEventListener('click', () => {
        document.getElementById('roof').classList.remove('winter');
        toggleSnow(false);
        toggleSun(true);
        houseData.forEach((room, roomIdx) => {
            room.appliances.forEach((app, appIdx) => {
                if (app.name === "Radiateur") {
                    app.hours = 0;
                } else if (app.name === "Climatisation") {
                    app.hours = 6;
                } else {
                    return;
                }
                const input = document.querySelector(`input[data-room="${roomIdx}"][data-app="${appIdx}"]`);
                if (input) input.value = app.hours;
            });
        });
        calculate();
    });

    resetBtn.addEventListener('click', () => {
        document.getElementById('roof').classList.remove('winter');
        document.getElementById('toggle-ch3').checked = false;
        document.getElementById('toggle-eco').checked = false;
        toggleSnow(false);
        toggleSun(false);
        
        houseData.forEach((room, roomIdx) => {
            if (room.id === 'ch3') room.hidden = true;
            const ch3Div = document.querySelector('.room-ch3');
            if (ch3Div) ch3Div.classList.add('hidden');

            room.appliances.forEach((app, appIdx) => {
                app.hours = 0;
                const input = document.querySelector(`input[data-room="${roomIdx}"][data-app="${appIdx}"]`);
                if (input) input.value = 0;
            });
        });
        calculate();
    });

    toggleEco.addEventListener('change', calculate);

    periodSelect.addEventListener('change', calculate);
    calculate();
}

function toggleSnow(active) {
    const container = document.getElementById('snow-container');
    container.innerHTML = ''; // Nettoie les anciens flocons
    
    if (active) {
        for (let i = 0; i < 80; i++) {
            const flake = document.createElement('div');
            flake.className = 'snowflake';
            const size = Math.random() * 4 + 2;
            flake.style.width = size + 'px';
            flake.style.height = size + 'px';
            flake.style.left = Math.random() * 100 + '%';
            flake.style.opacity = Math.random() * 0.7 + 0.3;
            flake.style.animationDuration = (Math.random() * 3 + 4) + 's';
            flake.style.animationDelay = (Math.random() * 5) + 's';
            container.appendChild(flake);
        }
    }
}

function toggleSun(active) {
    const container = document.getElementById('sun-container');
    container.innerHTML = ''; 
    
    if (active) {
        const sun = document.createElement('div');
        sun.className = 'sun';
        container.appendChild(sun);
    }
}

function drawRoom(idx) {
    const canvas = document.getElementById(`canvas-${idx}`);
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const room = houseData[idx];
    
    // --- MURS ET STRUCTURE ---
    ctx.strokeStyle = '#334155';
    ctx.lineWidth = 4;
    ctx.strokeRect(2, 2, canvas.width - 4, canvas.height - 4);
    
    // --- MOBILIER SELON LA PIÈCE ---
    ctx.strokeStyle = 'rgba(56, 189, 248, 0.4)';
    ctx.lineWidth = 1.5;
    ctx.fillStyle = 'rgba(56, 189, 248, 0.05)';

    if (room.id === "kit") { // Cuisine : Plan de travail + Frigo
        ctx.strokeRect(10, 10, 60, canvas.height - 20); // Plan
        ctx.strokeRect(canvas.width - 40, 10, 30, 30); // Frigo
    } else if (room.id === "liv") { // Salon : Canapé + TV
        ctx.beginPath(); // Canapé en U
        ctx.moveTo(40, 15); ctx.lineTo(15, 15); ctx.lineTo(15, canvas.height - 15); ctx.lineTo(40, canvas.height - 15);
        ctx.stroke();
        ctx.strokeRect(canvas.width - 60, canvas.height / 2 - 15, 5, 30); // Meuble TV
    } else if (room.id.startsWith("ch")) { // Chambres : Lit + Bureau
        ctx.strokeRect(15, 10, 45, 35); // Lit
        ctx.strokeRect(15, 15, 40, 5); // Oreiller
        ctx.strokeRect(canvas.width - 45, canvas.height - 30, 35, 20); // Bureau
    } else if (room.id === "gar") { // Garage : Voiture
        const carW = 80, carH = 40;
        const carX = 20, carY = canvas.height/2 - carH/2;
        ctx.roundRect(carX, carY, carW, carH, 8); // Corps voiture
        ctx.stroke();
        ctx.strokeRect(carX + 15, carY + 5, 20, 30); // Pare-brise
    }

    // --- COTES DE MESURE (Style Architecte) ---
    ctx.fillStyle = '#475569';
    ctx.font = '9px monospace';
    ctx.textAlign = 'center';
    ctx.fillText(room.id === "gar" ? "5.50m" : "4.20m", canvas.width / 2, canvas.height - 8);
    
    ctx.save();
    ctx.translate(12, canvas.height / 2);
    ctx.rotate(-Math.PI / 2);
    ctx.fillText("3.80m", 0, 0);
    ctx.restore();

    // --- FENÊTRE AVEC LUEUR ---
    const winW = 35, winH = 25;
    const winX = canvas.width / 2 - winW / 2;
    const winY = 8;
    
    // Effet de vitre
    const winGrad = ctx.createLinearGradient(winX, winY, winX + winW, winY + winH);
    winGrad.addColorStop(0, 'rgba(56, 189, 248, 0.3)');
    winGrad.addColorStop(1, 'rgba(56, 189, 248, 0.1)');
    ctx.fillStyle = winGrad;
    ctx.fillRect(winX, winY, winW, winH);
    
    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 1;
    ctx.strokeRect(winX, winY, winW, winH);
    
    // Croisillons
    ctx.beginPath();
    ctx.moveTo(winX + winW / 2, winY); ctx.lineTo(winX + winW / 2, winY + winH);
    ctx.moveTo(winX, winY + winH / 2); ctx.lineTo(winX + winW, winY + winH / 2);
    ctx.stroke();

    // --- PORTE AVEC SENS D'OUVERTURE ---
    if (room.id === "liv" || room.id === "gar") {
        const doorX = canvas.width - 5, doorY = canvas.height - 35;
        ctx.strokeStyle = '#38bdf8';
        ctx.lineWidth = 2;
        
        // Le vantail
        ctx.beginPath();
        ctx.moveTo(doorX, doorY);
        ctx.lineTo(doorX - 25, doorY - 15);
        ctx.stroke();
        
        // L'arc d'ouverture (pointillés)
        ctx.setLineDash([2, 2]);
        ctx.beginPath();
        ctx.arc(doorX, doorY, 25, Math.PI, Math.PI * 1.4);
        ctx.stroke();
        ctx.setLineDash([]);
    }
}

function calculate() {
    const periodSelect = document.getElementById('period-select');
    const multiplier = parseInt(periodSelect.value);
    const totalLabel = document.getElementById('total-consumption-label');
    const isEco = document.getElementById('toggle-eco').checked;
    let grandTotal = 0;

    // Mise à jour du libellé selon la période
    if (multiplier === 1) totalLabel.innerText = "CONSOMMATION JOURNALIÈRE";
    else if (multiplier === 30) totalLabel.innerText = "CONSOMMATION MENSUELLE";
    else if (multiplier === 365) totalLabel.innerText = "CONSOMMATION ANNUELLE";

    houseData.forEach((room, roomIdx) => {
        if (room.hidden) {
            document.getElementById(`room-total-${roomIdx}`).innerText = "0.00 kWh";
            return;
        }

        let roomTotal = room.appliances.reduce((acc, app) => {
            let power = app.power;
            // Simulation Mode Éco : Réduction de la puissance pour certains types
            if (isEco && !app.isCar) {
                if (app.name.includes("Éclairage") || app.name.includes("Lampe")) power = 5; // LED
                else if (app.name === "Réfrigérateur") power = 80; // A+++
                else if (app.name === "Ordinateur") power = 60; // Laptop vs Desktop
            }
            
            if (app.isCar) return acc + (power * app.hours); // km * kWh/km
            return acc + (power * app.hours) / 1000; // (W * h) / 1000
        }, 0);

        drawRoom(roomIdx);

        document.getElementById(`room-total-${roomIdx}`).innerText = roomTotal.toFixed(2) + " kWh";
        grandTotal += roomTotal;
    });

    document.getElementById('total-consumption').innerText = (grandTotal * multiplier).toFixed(2) + " kWh";
    document.getElementById('total-cost').innerText = (grandTotal * multiplier * 0.23).toFixed(2) + " €";
}

window.onload = init;