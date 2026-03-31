window.onload = function() {
    const canvas = document.getElementById('soundCanvas');
    const ctx = canvas.getContext('2d');
    const categoryValue = document.getElementById('categoryValue');
    const exampleValue = document.getElementById('exampleValue');
    const freqSlider = document.getElementById('freqSlider');
    const toggleAudioBtn = document.getElementById('toggleAudio');

    let time = 0;
    let audioContext = null;
    let oscillator = null;
    let isPlaying = false;

    // --- BASE DE DONNÉES DES EXEMPLES (50 items) ---
    // Ces exemples s'affichent dynamiquement quand on bouge le curseur.
    const soundData = [
        { start: 5, end: 20, name: "Infrasons", examples: "Vibrations terrestres (Séismes)", desc: "Pas audible pour l'homme, ressenti comme vibration physique." },
        { start: 20, end: 100, name: "Son Audible (Graves)", examples: "Moteur de camion, Grosse caisse (20Hz-60Hz)", desc: "Zone la plus 'physique' du son audible." },
        { start: 100, end: 500, name: "Son Audible (Standard)", examples: "La 4 (440Hz), Voix humaine (Baryton, Soprano)", desc: "Spectre principal du langage et de la musique." },
        { start: 500, end: 2000, name: "Son Audible (Médiums)", examples: "Téléphone (1kHz), Tambourin, Sirène", desc: "Zone de meilleure sensibilité de l'oreille humaine." },
        { start: 2000, end: 20000, name: "Son Audible (Aigus)", examples: "Cymbales (12kHz), Sifflet, moustique (16kHz)", desc: "Proche de la limite supérieure de l'audition." },
        { start: 20000, end: 25000, name: "Ultrasons", examples: "Dauphins (Imagerie), Souris (Communication)", desc: "Utilisé en imagerie médicale (échographie) et détection." }
    ];

    function resize() {
        canvas.width = canvas.parentElement.clientWidth;
        canvas.height = canvas.parentElement.clientHeight;
    }

    window.addEventListener('resize', resize);
    freqSlider.addEventListener('input', updateUI);
    toggleAudioBtn.addEventListener('click', toggleAudio);

    function updateUI() {
        const freq = parseInt(freqSlider.value);
        const zone = soundData.find(z => freq >= z.start && freq <= z.end);
        
        if (zone) {
            categoryValue.innerText = zone.name;
            exampleValue.innerText = `${freq} Hz (${zone.examples})`;
        }

        // Mettre à jour l'oscillateur réel s'il est actif
        if (oscillator) {
            oscillator.frequency.setValueAtTime(freq, audioContext.currentTime);
        }
    }

    // --- FONCTIONS AUDIO RÉELLES ---
    function toggleAudio() {
        if (!audioContext) {
            // Créer le contexte audio au premier clic (sécurité navigateur)
            audioContext = new (window.AudioContext || window.webkitAudioContext)();
        }

        if (isPlaying) {
            stopSound();
        } else {
            startSound();
        }
    }

    function startSound() {
        const freq = parseInt(freqSlider.value);
        
        // Créer l'oscillateur (générateur d'onde sinusoïdale pure)
        oscillator = audioContext.createOscillator();
        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(freq, audioContext.currentTime);

        // Connecter l'oscillateur aux haut-parleurs (destination)
        oscillator.connect(audioContext.destination);
        
        // Démarrer la production sonore
        oscillator.start();
        isPlaying = true;
        toggleAudioBtn.innerText = "■ PAUSE (STOP SON)";
        toggleAudioBtn.classList.add('playing');
    }

    function stopSound() {
        if (oscillator) {
            oscillator.stop();
            oscillator.disconnect();
            oscillator = null;
        }
        isPlaying = false;
        toggleAudioBtn.innerText = "▶ JOUER LE SON";
        toggleAudioBtn.classList.remove('playing');
    }

    // --- ANIMATION CANVAS (Onde Visuelle) ---
    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        time += 0.05;

        // Paramètres de l'onde visuelle basés sur le curseur
        const freqInput = parseInt(freqSlider.value);
        // On convertit la fréquence audio en une fréquence visuelle qui a du sens
        const visualFreq = 0.005 + (freqInput / 1000) * 0.1;
        const amplitude = 50;

        ctx.beginPath();
        ctx.strokeStyle = '#38bdf8';
        ctx.lineWidth = 3;
        
        for (let x = 0; x < canvas.width; x++) {
            // Équation de l'onde sinusoïdale dynamique
            const y = canvas.height / 2 + Math.sin(x * visualFreq - time) * amplitude;
            if (x === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
        }
        
        ctx.stroke();
        requestAnimationFrame(animate);
    }

    // Modal Logic (Identique à EM-Scope)
    const modal = document.getElementById('usageModal');
    const btn = document.getElementById('usageTableBtn');
    const closeBtn = document.querySelector('.close-btn');

    btn.onclick = function() {
        populateUsageTable();
        modal.style.display = 'block';
    }
    closeBtn.onclick = function() { modal.style.display = 'none'; }
    window.onclick = function(event) { if (event.target == modal) modal.style.display = 'none'; }

    function populateUsageTable() {
        const tbody = document.querySelector('#usageTable tbody');
        tbody.innerHTML = '';
        soundData.forEach(item => {
            tbody.innerHTML += `<tr><td>${item.name}</td><td>${item.start} - ${item.end}</td><td>${item.examples} (${item.desc})</td></tr>`;
        });
    }

    resize();
    animate();
    updateUI();
};