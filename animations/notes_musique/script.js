window.onload = function() {
    const playBtn = document.getElementById('playBtn');
    const audioSelect = document.getElementById('audioSelect');
    const noteBtns = document.querySelectorAll('.note-btn');

    let audioCtx = null, oscillator = null, gainNode = null, isPlaying = false;
    let currentFreq = 440;

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

    function drawAxes(ctx, w, h, xMax, xUnit, yLabel, xStep, yAxisPos) {
        const yBase = yAxisPos !== undefined ? yAxisPos : (h - PAD_Y);
        ctx.strokeStyle = "#000000"; ctx.lineWidth = 2; ctx.fillStyle = "#000000";
        // Axes
        ctx.beginPath();
        ctx.moveTo(PAD_X, 5); ctx.lineTo(PAD_X, h - PAD_Y);
        ctx.moveTo(PAD_X, yBase); ctx.lineTo(w - PAD_R, yBase);
        ctx.stroke();

        ctx.font = "bold 9px Arial"; let count = 0;
        if (xStep) {
            for (let v = 0; v <= xMax + 0.001; v += xStep) {
                let x = PAD_X + (v / xMax) * (w - PAD_X - PAD_R);
                ctx.beginPath(); ctx.lineWidth = 1;
                ctx.moveTo(x, yBase - 5); ctx.lineTo(x, yBase + 5);
                ctx.stroke();

                // On n'affiche qu'une valeur sur deux pour le spectre
                // Et on masque la graduation juste avant la fin (2.8) pour laisser de la place à "3kHz"
                const isLast = Math.abs(v - xMax) < 0.001;
                if (yAxisPos === undefined && !isLast && (count % 2 !== 0 || v > xMax - xStep * 2.5)) { count++; continue; }

                let label = v.toFixed(v % 1 === 0 ? 0 : 1);
                if (isLast) { label += xUnit; ctx.textAlign = "right"; }
                else if (v === 0) { ctx.textAlign = "left"; }
                else { ctx.textAlign = "center"; }
                
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