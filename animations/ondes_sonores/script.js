window.onload = function() {
    const canvas = document.getElementById('canvasOndes');
    const ctx = canvas.getContext('2d');
    const freqInput = document.getElementById('freqRange');
    const freqVal = document.getElementById('freq-val');

    let waves = [];
    let particles = [];
    let greenParticle; 
    let frameCount = 0;
    let waveCounter = 0;

    const config = {
        waveSpeed: 2.5,
        particleDensity: 0.0015, 
        particleSize: 3.5,       
        springStrength: 0.12,
        friction: 0.85,
        basePushForce: 16,       
        percentRed: 0.15
    };

    const speaker = {
        x: 100,
        y: 0,
        angle: Math.PI / 1.6,
        membraneX: 0,            
        isVibrating: false,
        membraneWidth: 15
    };

    function resize() {
        const parent = canvas.parentElement;
        canvas.width = parent.clientWidth;
        canvas.height = parent.clientHeight;
        speaker.y = canvas.height / 2;
        initParticles();
    }

    window.addEventListener('resize', resize);

    class Particle {
        constructor(homeX, homeY) {
            this.homeX = homeX;
            this.homeY = homeY;
            this.x = this.homeX;
            this.y = this.homeY;
            this.vx = 0;
            this.lastWaveId = -1;
            this.active = false;
        }

        update() {
            // Zone de contact de la membrane (avec une marge de 10px pour éviter le blocage)
            const membraneLimit = speaker.x - 10 + speaker.membraneX;

            // 1. Gestion de la collision avec le haut-parleur
            if (Math.abs(this.y - speaker.y) < 85) { // Un peu plus large que le HP
                if (this.x < membraneLimit + 5) {
                    this.x = membraneLimit + 5; // On force la molécule à rester devant
                    
                    // Si la membrane avance (vibration positive), elle donne une impulsion
                    if (speaker.isVibrating && speaker.membraneX > 2) {
                        this.vx = config.basePushForce;
                        this.active = true;
                    }
                }
            }

            // 2. Physique de ressort (retour à la position initiale)
            let forceRappel = (this.homeX - this.x) * config.springStrength;
            this.vx += forceRappel;
            this.vx *= config.friction;
            this.x += this.vx;
            
            // On réinitialise l'état visuel "active" après un court instant
            if (Math.abs(this.vx) < 0.5) this.active = false;
        }
    }

    class AirParticle extends Particle {
        constructor(isRed) {
            // Placement : minimum à speaker.x + 20 pour ne pas être "dans" le plastique du HP
            const hX = (speaker.x + 20) + Math.random() * (canvas.width - (speaker.x + 20));
            const hY = Math.random() * canvas.height;
            super(hX, hY);
            this.isRed = isRed;
        }

        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, config.particleSize, 0, Math.PI * 2);
            if (this.isRed) {
                ctx.fillStyle = this.active ? "#ff8888" : "#ef4444";
            } else {
                ctx.fillStyle = this.active ? "#a0d8f0" : "rgba(148, 163, 184, 0.4)";
            }
            ctx.fill();
        }
    }

    class SpecialParticle extends Particle {
        constructor() {
            // Placée à 120px du HP, pile en face du centre
            super(speaker.x + 120, speaker.y); 
            this.size = config.particleSize * 2;
        }

        draw() {
            ctx.save();
            ctx.shadowBlur = 20;
            ctx.shadowColor = "#00ff44";
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fillStyle = "#00ff44";
            ctx.fill();
            ctx.strokeStyle = "#fff";
            ctx.lineWidth = 2;
            ctx.stroke();
            ctx.restore();
        }
    }

    function initParticles() {
        particles = [];
        greenParticle = new SpecialParticle();
        const effectiveWidth = canvas.width - (speaker.x + 20);
        const count = Math.floor(effectiveWidth * canvas.height * config.particleDensity);
        for (let i = 0; i < count; i++) {
            particles.push(new AirParticle(Math.random() < config.percentRed));
        }
    }

    class Wave {
        constructor(id) {
            this.id = id;
            this.radius = 0;
            this.opacity = 1;
            this.maxRadius = canvas.width * 1.1;
        }

        update() {
            this.radius += config.waveSpeed;
            this.opacity = Math.max(0, 1 - (this.radius / this.maxRadius));
            const thickness = 30;
            
            particles.forEach(p => this.applyForce(p, thickness));
            this.applyForce(greenParticle, thickness);
        }

        applyForce(p, thickness) {
            const dx = p.x - speaker.x;
            const dy = p.y - speaker.y;
            const dist = Math.sqrt(dx*dx + dy*dy);
            const angle = Math.atan2(dy, dx);

            if (Math.abs(angle) < speaker.angle / 2) {
                if (dist > this.radius - thickness && dist < this.radius + thickness) {
                    if (p.lastWaveId !== this.id) {
                        p.vx += (config.basePushForce * this.opacity * 0.8); 
                        p.lastWaveId = this.id;
                        p.active = true;
                    }
                }
            }
        }

        draw() {
            ctx.beginPath();
            ctx.arc(speaker.x, speaker.y, this.radius, -speaker.angle/2, speaker.angle/2);
            ctx.strokeStyle = `rgba(56, 189, 248, ${this.opacity * 0.2})`;
            ctx.lineWidth = 3;
            ctx.stroke();
        }
    }

    function drawSpeaker() {
        ctx.save();
        ctx.translate(speaker.x, speaker.y);
        
        if (speaker.isVibrating) {
            speaker.membraneX = Math.cos(frameCount * 0.5) * speaker.membraneWidth;
        } else {
            speaker.membraneX *= 0.8; 
        }

        // Dessin du socle du HP
        ctx.beginPath();
        ctx.moveTo(-50, -40); ctx.lineTo(-10, -60); ctx.lineTo(-10, 60); ctx.lineTo(-50, 40);
        ctx.closePath();
        ctx.fillStyle = "#1e293b"; ctx.fill();
        ctx.strokeStyle = "#38bdf8"; ctx.lineWidth = 2; ctx.stroke();

        // Membrane
        ctx.beginPath();
        ctx.moveTo(-10 + speaker.membraneX, -60);
        ctx.lineTo(-10 + speaker.membraneX, 60);
        ctx.lineWidth = 10;
        ctx.lineCap = "round";
        ctx.strokeStyle = "#94a3b8";
        ctx.stroke();
        ctx.restore();
    }

    resize();

    function animate() {
        ctx.fillStyle = '#050505';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        const interval = parseInt(freqInput.value);
        if (freqVal) freqVal.innerText = interval + " ms";

        particles.forEach(p => { p.update(); p.draw(); });
        greenParticle.update();
        greenParticle.draw();

        if (frameCount % interval === 0) {
            waves.push(new Wave(waveCounter++));
            speaker.isVibrating = true;
        } 
        if (frameCount % interval === 12) {
            speaker.isVibrating = false;
        }

        for (let i = waves.length - 1; i >= 0; i--) {
            waves[i].update();
            waves[i].draw();
            if (waves[i].opacity <= 0.01) waves.splice(i, 1);
        }

        drawSpeaker();
        frameCount++;
        requestAnimationFrame(animate);
    }

    animate();
};