window.onload = function() {
    const canvas = document.getElementById('soundCanvas');
    const ctx = canvas.getContext('2d');
    const categoryValue = document.getElementById('categoryValue');
    const exampleValue = document.getElementById('exampleValue');
    const freqSlider = document.getElementById('freqSlider');
    const freqManual = document.getElementById('freqManual');
    const toggleAudioBtn = document.getElementById('toggleAudio');

    let time = 0;
    let audioContext = null;
    let oscillator = null;
    let isPlaying = false;

    // --- BASE DE DONNÉES DES EXEMPLES (50 items) ---
    // Ces exemples s'affichent dynamiquement quand on bouge le curseur.
    const soundData = [
        { start: 5, end: 20, name: "Infrasons", examples: "Séismes, Éléphants", desc: "Pas audible, ressenti comme vibration." },
        { start: 20, end: 100, name: "Audible (Graves)", examples: "Contrebasse, Moteur", desc: "Sensibilité basse de l'oreille." },
        { start: 100, end: 500, name: "Audible (Médiums)", examples: "Voix humaine, Piano", desc: "Spectre principal de la musique." },
        { start: 500, end: 2000, name: "Audible (Médiums)", examples: "Téléphone, Sirène", desc: "Fréquences où l'oreille entend le mieux" },
        { start: 2000, end: 20000, name: "Audible (Aigus)", examples: "Sifflets", desc: "Sons très aigus." },
        { start: 20000, end: 25000, name: "Ultrasons", examples: "Chauve-souris, Dauphins", desc: "Au-delà de l'audition humaine, utilisé en échographie." }
    ];

    function resize() {
        canvas.width = canvas.parentElement.clientWidth;
        canvas.height = canvas.parentElement.clientHeight;
    }

    window.addEventListener('resize', resize);

    freqSlider.addEventListener('input', () => {
        freqManual.value = freqSlider.value;
        updateUI();
    });

    freqManual.addEventListener('input', () => {
        const val = parseInt(freqManual.value);
        if (!isNaN(val) && val >= 5 && val <= 25000) {
            freqSlider.value = val;
            updateUI();
        }
    });

    toggleAudioBtn.addEventListener('click', toggleAudio);

    function updateUI() {
        const freq = parseInt(freqSlider.value);
        const zone = soundData.find(z => freq >= z.start && freq <= z.end);
        
        if (zone) {
            categoryValue.innerText = zone.name;
            // On affiche la fréquence, les exemples ET la description
            exampleValue.innerText = `${freq} Hz\n${zone.examples}\n(${zone.desc})`;
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

        // Ajout de la légende en haut au centre
        ctx.fillStyle = "rgba(148, 163, 184, 0.6)";
        ctx.font = "italic 13px sans-serif";
        ctx.textAlign = "center";
        ctx.fillText("Représentation temporelle du son pur (à la fréquence choisie)", canvas.width / 2, 40);

        // Paramètres de l'onde visuelle basés sur le curseur
        // On plafonne la fréquence visuelle à 6600 Hz pour garder une onde lisible
        const freqInput = Math.min(parseInt(freqSlider.value), 6600);
        const visualScale = 0.0002; // Facteur d'échelle pour la fréquence réelle
        const amplitude = 50;

        ctx.beginPath();
        ctx.strokeStyle = '#38bdf8';
        ctx.lineWidth = 3;
        
        for (let x = 0; x < canvas.width; x++) {
            // Représentation temporelle : y = sin(2 * PI * f * t)
            const y = canvas.height / 2 + Math.sin(x * freqInput * visualScale) * amplitude;
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