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

    function drawAxes(ctx, w, h, xMax, xUnit, yLabel) {
        ctx.strokeStyle = "#334155"; ctx.lineWidth = 1; ctx.fillStyle = "#94a3b8"; ctx.font = "8px Arial";
        // Axes
        ctx.beginPath();
        ctx.moveTo(PAD_X, 5); ctx.lineTo(PAD_X, h - PAD_Y); ctx.lineTo(w - 5, h - PAD_Y);
        ctx.stroke();
        // Graduation X (min/max)
        ctx.fillText("0", PAD_X, h - 8);
        ctx.fillText(xMax + xUnit, w - 25, h - 8);
        // Label Y (Amplitude ou Intensité)
        ctx.save(); ctx.translate(10, h/2); ctx.rotate(-Math.PI/2);
        ctx.fillText(yLabel, -10, 0); ctx.restore();
    }

    function draw() {
        Object.keys(canvasMap).forEach(inst => {
            const {t, f} = canvasMap[inst];
            const profile = profiles[inst];
            const w = t.canvas.width, h = t.canvas.height;
            if (w === 0) return;

            t.clearRect(0, 0, w, h); f.clearRect(0, 0, w, h);
            
            // --- SIGNAL TEMPOREL (Centré sur 0) ---
            drawAxes(t, w, h, 10, "ms", "Amp");
            t.beginPath(); t.strokeStyle = profile.color; t.lineWidth = 1.5;
            const drawW = w - PAD_X - 5;
            const midY = (h - PAD_Y) / 2 + 2; // Centre de l'axe vertical

            for(let x = PAD_X; x < w - 5; x++) {
                const time = ((x - PAD_X) / drawW) * 0.01; // Fenêtre de 10ms
                let yVal = 0;
                // Calcul du signal : somme des harmoniques
                profile.coeffs.forEach((amp, i) => { if(i > 0) yVal += Math.sin(2 * Math.PI * currentFreq * i * time) * amp; });
                
                // Normalisation visuelle pour éviter que ça dépasse du cadre
                const yPos = midY - (yVal * (h / 10)); 
                if(x === PAD_X) t.moveTo(x, yPos); else t.lineTo(x, yPos);
            }
            t.stroke();

            // --- SPECTRE ---
            drawAxes(f, w, h, 3, "kHz", "Int");
            f.fillStyle = "#fbbf24";
            profile.coeffs.forEach((amp, i) => {
                if(i === 0) return;
                const freq = currentFreq * i;
                if(freq > 3000) return;
                const xPos = PAD_X + (freq / 3000) * (w - PAD_X - 5);
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