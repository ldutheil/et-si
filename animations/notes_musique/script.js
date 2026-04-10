window.onload = function() {
    const playBtn = document.getElementById('playBtn');
    const audioSelect = document.getElementById('audioSelect');
    const noteBtns = document.querySelectorAll('.note-btn');

    let audioCtx = null, oscillator = null, gainNode = null, isPlaying = false;
    let currentFreq = 440;
    let hoveredCanvas = null, hoverX = 0;
    let measureAnchor = null;

    const profiles = {
        diapason: { coeffs: [0, 1], color: "#38bdf8" },
        piano:    { coeffs: [0, 1, 0.5, 0.3, 0.1, 0.1, 0.05], color: "#4ade80" },
        guitare:  { coeffs: [0, 1, 0.8, 0.4, 0.6, 0.2, 0.4, 0.1], color: "#f87171" }
    };

    const canvasMap = {
        diapason: { t: document.getElementById('time_diapason').getContext('2d'), f: document.getElementById('freq_diapason').getContext('2d') },
        piano:    { t: document.getElementById('time_piano').getContext('2d'), f: document.getElementById('freq_piano').getContext('2d') },
        guitare:  { t: document.getElementById('time_guitare').getContext('2d'), f: document.getElementById('freq_guitare').getContext('2d') }
    };

    const PAD_X = 30;
    const PAD_R = 30;
    const PAD_Y = 20;

    function resize() {
        Object.keys(canvasMap).forEach(inst => {
            const container = canvasMap[inst].t.canvas.parentElement;
            canvasMap[inst].t.canvas.width = canvasMap[inst].f.canvas.width = container.clientWidth;
            canvasMap[inst].t.canvas.height = canvasMap[inst].f.canvas.height = container.clientHeight;
        });
        draw();
    }
    window.addEventListener('resize', resize);

    // Gestion du curseur interactif sur les graphiques (temporels et fréquentiels)
    Object.keys(canvasMap).forEach(inst => {
        [canvasMap[inst].t.canvas, canvasMap[inst].f.canvas].forEach(c => {
            c.onmousemove = (e) => {
                const rect = c.getBoundingClientRect();
                // Calcul de la position X relative au canvas
                hoverX = (e.clientX - rect.left) * (c.width / rect.width);
                hoveredCanvas = c;
                draw();
            };
            c.onmouseleave = () => { hoveredCanvas = null; draw(); };
            c.onclick = () => {
                if (measureAnchor) {
                    measureAnchor = null;
                } else if (hoverX >= PAD_X && hoverX <= c.width - PAD_R) {
                    const isTime = c.id.startsWith('time');
                    const drawW = c.width - PAD_X - PAD_R;
                    const val = ((hoverX - PAD_X) / drawW) * (isTime ? 10 : 3);
                    measureAnchor = { canvas: c, x: hoverX, val: val, isTime: isTime };
                }
                draw();
            };
        });
    });

    function drawAxes(ctx, w, h, xMax, xUnit, yLabel, xStep, yAxisPos) {
        const yBase = yAxisPos !== undefined ? yAxisPos : (h - PAD_Y);
        const arrowSize = 8; // Taille des pointes de flèche, légèrement augmentée pour la visibilité

        ctx.strokeStyle = "#000000"; ctx.lineWidth = 2; ctx.fillStyle = "#000000";
        // Axes
        ctx.beginPath();
        // Axe vertical
        const yAxisEnd = 10; // On s'arrête un peu avant le haut du canvas
        ctx.moveTo(PAD_X, h - PAD_Y); ctx.lineTo(PAD_X, yAxisEnd);
        // Flèche haut
        ctx.lineTo(PAD_X - arrowSize / 2, yAxisEnd + arrowSize);
        ctx.moveTo(PAD_X, yAxisEnd);
        ctx.lineTo(PAD_X + arrowSize / 2, yAxisEnd + arrowSize);

        // Axe horizontal
        const xAxisEnd = w - PAD_R + 25; // Étend l'axe de 25px après la dernière graduation
        ctx.moveTo(PAD_X, yBase); ctx.lineTo(xAxisEnd, yBase);
        // Flèche droite
        ctx.lineTo(xAxisEnd - arrowSize, yBase - arrowSize / 2);
        ctx.moveTo(xAxisEnd, yBase);
        ctx.lineTo(xAxisEnd - arrowSize, yBase + arrowSize / 2);

        ctx.stroke();

        ctx.font = "bold 9px Arial"; let count = 0;
        if (xStep) {
            for (let v = 0; v <= xMax + 0.001; v += xStep) {
                let x = PAD_X + (v / xMax) * (w - PAD_X - PAD_R);
                ctx.beginPath(); ctx.lineWidth = 1;
                ctx.moveTo(x, yBase - 5); ctx.lineTo(x, yBase + 5);
                ctx.stroke();

                // On n'affiche qu'une valeur sur deux pour le spectre (tous les 200 Hz)
                const isLast = Math.abs(v - xMax) < 0.001;
                if (yAxisPos === undefined && !isLast && (count % 2 !== 0)) { count++; continue; }

                let label = v.toFixed(v % 1 === 0 ? 0 : 1);
                if (isLast) label += xUnit;
                ctx.textAlign = (v === 0) ? "left" : "center";
                
                // Position : juste sous l'axe pour le temporel (yBase), ou en bas du canvas pour le spectre
                ctx.fillText(label, x, yAxisPos !== undefined ? yBase + 14 : h - 5);
                count++;
            }
        }
        // Label Y (Amplitude ou Intensité)
        ctx.save(); ctx.translate(15, h / 2); ctx.rotate(-Math.PI / 2);
        ctx.textAlign = "center"; ctx.font = "bold 12px Arial";
        ctx.fillText(yLabel, 0, 0); ctx.restore();
    }

    function draw() {
        Object.keys(canvasMap).forEach(inst => {
            const {t, f} = canvasMap[inst];
            const profile = profiles[inst];
            const w = t.canvas.width, h = t.canvas.height;
            if (w === 0) return;

            t.fillStyle = "white"; t.fillRect(0, 0, w, h);
            f.fillStyle = "white"; f.fillRect(0, 0, w, h);
            
            // --- SIGNAL TEMPOREL (Centré sur 0) ---
            const midY = (h - PAD_Y) / 2 + 2; // Centre de l'axe vertical
            drawAxes(t, w, h, 10, "ms", "Amplitude", 1, midY);
            t.beginPath(); t.strokeStyle = profile.color; t.lineWidth = 1.5;
            const drawW = w - PAD_X - PAD_R;

            for(let x = PAD_X; x < w - PAD_R; x++) {
                const time = ((x - PAD_X) / drawW) * 0.01; // Fenêtre de 10ms
                let yVal = 0;
                // Calcul du signal : somme des harmoniques
                profile.coeffs.forEach((amp, i) => { if(i > 0) yVal += Math.sin(2 * Math.PI * currentFreq * i * time) * amp; });
                
                // Normalisation visuelle pour éviter que ça dépasse du cadre
                const yPos = midY - (yVal * (h / 6)); 
                if(x === PAD_X) t.moveTo(x, yPos); else t.lineTo(x, yPos);
            }
            t.stroke();

            // --- MESURE DELTA T ---
            if (measureAnchor && measureAnchor.canvas === t.canvas) {
                t.strokeStyle = "#ef4444"; t.lineWidth = 2;
                t.beginPath(); t.moveTo(measureAnchor.x, 5); t.lineTo(measureAnchor.x, h - PAD_Y); t.stroke();
                if (hoveredCanvas === t.canvas && hoverX >= PAD_X && hoverX <= w - PAD_R) {
                    const delta = Math.abs(((hoverX - PAD_X) / drawW) * 10 - measureAnchor.val);
                    t.fillStyle = "rgba(239, 68, 68, 0.15)";
                    t.fillRect(measureAnchor.x, 5, hoverX - measureAnchor.x, h - PAD_Y - 5);
                    t.fillStyle = "#ef4444"; t.font = "bold 11px Arial"; t.textAlign = "center";
                    t.fillText("Δt = " + delta.toFixed(2) + " ms", (measureAnchor.x + hoverX) / 2, h - 5);
                }
            }

            // --- CURSEUR INTERACTIF (Uniquement au survol) ---
            if (hoveredCanvas === t.canvas && hoverX >= PAD_X && hoverX <= w - PAD_R) {
                t.setLineDash([5, 5]); t.strokeStyle = "rgba(0,0,0,0.4)"; t.lineWidth = 1;
                t.beginPath(); t.moveTo(hoverX, 5); t.lineTo(hoverX, h - PAD_Y); t.stroke();
                t.setLineDash([]);
                
                const timeMs = ((hoverX - PAD_X) / drawW) * 10;
                t.fillStyle = "#000"; t.font = "bold 10px Arial"; t.textAlign = "center";
                t.fillText(timeMs.toFixed(2) + " ms", hoverX, 15);
            }

            // --- SPECTRE ---
            drawAxes(f, w, h, 3, "kHz", "Intensité", 0.1);
            f.fillStyle = "#fbbf24";
            profile.coeffs.forEach((amp, i) => {
                if(i === 0) return;
                const freq = currentFreq * i;
                if(freq > 3000) return;
                const xPos = PAD_X + (freq / 3000) * (w - PAD_X - PAD_R);
                const barH = amp * (h - PAD_Y - 10) * 0.8;
                f.fillRect(xPos - 1, h - PAD_Y - barH, 2, barH);
            });

            // --- MESURE DELTA F ---
            if (measureAnchor && measureAnchor.canvas === f.canvas) {
                f.strokeStyle = "#ef4444"; f.lineWidth = 2;
                f.beginPath(); f.moveTo(measureAnchor.x, 5); f.lineTo(measureAnchor.x, h - PAD_Y); f.stroke();
                if (hoveredCanvas === f.canvas && hoverX >= PAD_X && hoverX <= w - PAD_R) {
                    const delta = Math.abs(((hoverX - PAD_X) / drawW) * 3 - measureAnchor.val);
                    f.fillStyle = "rgba(239, 68, 68, 0.15)";
                    f.fillRect(measureAnchor.x, 5, hoverX - measureAnchor.x, h - PAD_Y - 5);
                    f.fillStyle = "#ef4444"; f.font = "bold 11px Arial"; f.textAlign = "center";
                    f.fillText("Δf = " + delta.toFixed(2) + " kHz", (measureAnchor.x + hoverX) / 2, h - 5);
                }
            }

            // --- CURSEUR INTERACTIF SPECTRE ---
            if (hoveredCanvas === f.canvas && hoverX >= PAD_X && hoverX <= w - PAD_R) {
                f.setLineDash([5, 5]); f.strokeStyle = "rgba(0,0,0,0.4)"; f.lineWidth = 1;
                f.beginPath(); f.moveTo(hoverX, 5); f.lineTo(hoverX, h - PAD_Y); f.stroke();
                f.setLineDash([]);
                
                const freqKHz = ((hoverX - PAD_X) / drawW) * 3;
                f.fillStyle = "#000"; f.font = "bold 10px Arial"; f.textAlign = "center";
                f.fillText(freqKHz.toFixed(2) + " kHz", hoverX, 15);
            }
        });
    }

    // Gestion Audio et Boutons
    noteBtns.forEach(btn => {
        btn.onclick = () => {
            noteBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentFreq = parseFloat(btn.dataset.freq);
            document.getElementById('freqValue').innerText = Math.round(currentFreq) + " Hz";
            if(isPlaying) { stopAudio(); startAudio(); }
            draw();
        };
    });

    function startAudio() {
        if(!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        oscillator = audioCtx.createOscillator();
        const profile = profiles[audioSelect.value];
        const real = new Float32Array(profile.coeffs);
        const imag = new Float32Array(real.length).fill(0);
        oscillator.setPeriodicWave(audioCtx.createPeriodicWave(real, imag));
        oscillator.frequency.value = currentFreq;
        gainNode = audioCtx.createGain();
        gainNode.gain.setValueAtTime(0.1, audioCtx.currentTime);
        oscillator.connect(gainNode).connect(audioCtx.destination);
        oscillator.start();
    }

    function stopAudio() { if(oscillator) { oscillator.stop(); oscillator = null; } }

    playBtn.onclick = () => {
        if(isPlaying) { stopAudio(); isPlaying = false; playBtn.innerText = "▶ JOUER"; }
        else { startAudio(); isPlaying = true; playBtn.innerText = "■ STOP"; }
    };

    resize();
};