window.onload = function() {
    const canvas = document.getElementById('ionsCanvas');
    const ctx = canvas.getContext('2d');
    const slider = document.getElementById('phSlider');
    const phValue = document.getElementById('phValue');
    const solutionExample = document.getElementById('solutionExample');

    let ions = [];
    let animationId = null;

    const phExamples = {
        0: "Acide chlorhydrique", 1: "Acide de batterie", 2: "Jus de citron",
        3: "Vinaigre", 4: "Tomate", 5: "Café noir", 6: "Lait",
        7: "Eau pure", 8: "Œuf cru", 9: "Bicarbonate", 10: "Savon",
        11: "Ammoniaque", 12: "Eau de Javel", 13: "Décapant four", 14: "Soude"
    };

    function resize() {
        const parent = canvas.parentElement;
        canvas.width = parent.clientWidth;
        canvas.height = parent.clientHeight;
        initIons(parseInt(slider.value));
    }

    window.addEventListener('resize', resize);

    class Ion {
        constructor(x, y, type) {
            this.x = x;
            this.y = y;
            this.radius = 12;
            this.type = type; 
            this.vx = (Math.random() - 0.5) * 1.5;
            this.vy = (Math.random() - 0.5) * 1.5;
        }

        draw() {
            ctx.save();
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
            
            if (this.type === 'H+') {
                ctx.fillStyle = 'rgba(0, 150, 255, 0.6)';
                ctx.strokeStyle = '#00fbff';
                ctx.shadowBlur = 10;
                ctx.shadowColor = '#00fbff';
            } else {
                ctx.fillStyle = 'rgba(255, 50, 50, 0.6)';
                ctx.strokeStyle = '#ff4444';
                ctx.shadowBlur = 10;
                ctx.shadowColor = '#ff4444';
            }
            
            ctx.fill();
            ctx.lineWidth = 2;
            ctx.stroke();

            // Texte de l'ion
            ctx.fillStyle = 'white';
            ctx.font = 'bold 10px Arial';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.shadowBlur = 0; // Pas de flou sur le texte

            if (this.type === 'H+') {
                ctx.fillText('H', this.x - 2, this.y);
                ctx.font = '8px Arial';
                ctx.fillText('+', this.x + 6, this.y - 4);
            } else {
                ctx.fillText('HO', this.x - 2, this.y);
                ctx.font = '8px Arial';
                ctx.fillText('-', this.x + 8, this.y - 4);
            }
            ctx.restore();
        }

        update() {
            this.x += this.vx;
            this.y += this.vy;
            if (this.x < this.radius || this.x > canvas.width - this.radius) this.vx *= -1;
            if (this.y < this.radius || this.y > canvas.height - this.radius) this.vy *= -1;
        }
    }

    function initIons(pH) {
        ions = [];
        const totalIons = 40; // Augmenté pour mieux remplir l'espace large
        const hCount = Math.round(totalIons * (14 - pH) / 14);
        const ohCount = totalIons - hCount;

        for (let i = 0; i < hCount; i++) {
            ions.push(new Ion(Math.random() * canvas.width, Math.random() * canvas.height, 'H+'));
        }
        for (let i = 0; i < ohCount; i++) {
            ions.push(new Ion(Math.random() * canvas.width, Math.random() * canvas.height, 'HO-'));
        }
    }

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ions.forEach(ion => {
            ion.update();
            ion.draw();
        });
        animationId = requestAnimationFrame(animate);
    }

    slider.addEventListener('input', () => {
        const pH = parseInt(slider.value);
        phValue.innerText = pH;
        solutionExample.innerText = phExamples[pH];
        initIons(pH);
    });

    resize();
    animate();
};