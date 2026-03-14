const canvas = document.getElementById('canvasOndes');
const ctx = canvas.getContext('2d');
const freqInput = document.getElementById('freqRange');

let waves = [];
let particles = [];
let frameCount = 0;
let waveCounter = 0;

const config = {
    waveSpeed: 2.5,
    particleDensity: 0.0015, 
    particleSize: 4.4,       
    springStrength: 0.12,
    friction: 0.85,
    basePushForce: 16,       
    percentRed: 0.20
};

const speaker = {
    x: 180,
    y: 0,
    angle: Math.PI / 1.6,
    membraneX: 0,            
    isVibrating: false,
    membraneWidth: 15
};

function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    speaker.y = canvas.height / 2;
    initParticles();
}

window.addEventListener('resize', resize);

class AirParticle {
    constructor(isRed) {
        this.homeX = Math.random() * canvas.width;
        this.homeY = Math.random() * canvas.height;
        this.x = this.homeX;
        this.y = this.homeY;
        this.vx = 0;
        this.isRed = isRed;
        this.lastWaveId = -1;
        this.active = false;
    }

    update() {
        const membraneFront = speaker.x - 20 + speaker.membraneX;

        // Collision physique avec la membrane
        if (Math.abs(this.y - speaker.y) < 80) {
            if (this.x < membraneFront + 5) {
                this.x = membraneFront + 5;
                if (speaker.isVibrating && speaker.membraneX > 0) {
                    this.vx = config.basePushForce;
                    this.active = true;
                } else {
                    this.vx = Math.abs(this.vx) * 0.5; 
                }
            }
        }

        let forceRappel = (this.homeX - this.x) * config.springStrength;
        this.vx += forceRappel;
        this.vx *= config.friction;
        this.x += this.vx;
        this.active = false;
    }

    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, config.particleSize, 0, Math.PI * 2);
        
        if (this.isRed) {
            ctx.fillStyle = this.active ? "#ff8888" : "#ff0000";
            if(this.active) { ctx.shadowBlur = 12; ctx.shadowColor = "#ff0000"; }
            else { ctx.shadowBlur = 0; }
        } else {
            ctx.fillStyle = this.active ? "#a0d8f0" : "rgba(50, 110, 220, 0.7)";
            ctx.shadowBlur = 0;
        }
        
        ctx.fill();
        ctx.closePath();
    }
}

function initParticles() {
    particles = [];
    const count = Math.floor(canvas.width * canvas.height * config.particleDensity);
    for (let i = 0; i < count; i++) {
        particles.push(new AirParticle(Math.random() < config.percentRed));
    }
}

class Wave {
    constructor(id) {
        this.id = id;
        this.radius = 0;
        this.opacity = 1;
        this.maxRadius = canvas.width * 1.3;
    }

    update() {
        this.radius += config.waveSpeed;
        this.opacity = Math.max(0, 1 - (this.radius / this.maxRadius));

        const thickness = 25;
        for (let p of particles) {
            const dx = p.x - speaker.x;
            const dy = p.y - speaker.y;
            const dist = Math.sqrt(dx*dx + dy*dy);
            const angle = Math.atan2(dy, dx);

            if (Math.abs(angle) < speaker.angle / 2) {
                if (dist > this.radius - thickness && dist < this.radius + thickness) {
                    if (p.lastWaveId !== this.id) {
                        p.vx = config.basePushForce * this.opacity; 
                        p.lastWaveId = this.id;
                    }
                    p.active = true;
                }
            }
        }
    }

    draw() {
        ctx.beginPath();
        ctx.arc(speaker.x, speaker.y, this.radius, -speaker.angle/2, speaker.angle/2);
        ctx.strokeStyle = `rgba(150, 255, 255, ${this.opacity * 0.08})`;
        ctx.lineWidth = 1;
        ctx.stroke();
    }
}

function drawSpeaker() {
    ctx.save();
    ctx.translate(speaker.x, speaker.y);
    
    if (speaker.isVibrating) {
        speaker.membraneX = Math.cos(frameCount * 0.6) * speaker.membraneWidth;
    } else {
        speaker.membraneX *= 0.8; 
    }

    // Corps
    ctx.beginPath();
    ctx.moveTo(-60, -50); ctx.lineTo(-20, -70); ctx.lineTo(-20, 70); ctx.lineTo(-60, 50);
    ctx.closePath();
    ctx.fillStyle = "#111"; ctx.fill();
    ctx.strokeStyle = "#444"; ctx.stroke();

    // Membrane mobile
    ctx.beginPath();
    ctx.moveTo(-20 + speaker.membraneX, -70);
    ctx.lineTo(-20 + speaker.membraneX, 70);
    ctx.lineWidth = 10;
    ctx.strokeStyle = "#888";
    ctx.stroke();

    ctx.fillStyle = "white";
    ctx.font = "bold 16px sans-serif";
    ctx.textAlign = "right";
    ctx.fillText("Haut parleur", -70, 5);
    ctx.restore();
}

resize();

function animate() {
    ctx.fillStyle = '#050505';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    particles.forEach(p => { p.update(); p.draw(); });

    const interval = parseInt(freqInput.value);
    
    if (frameCount % interval === 0) {
        waves.push(new Wave(waveCounter++));
        speaker.isVibrating = true;
    } 
    
    if (frameCount % interval === 15) {
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