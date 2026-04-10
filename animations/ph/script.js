window.onload = function() {
    const canvas = document.getElementById('ionsCanvas');
    const ctx = canvas.getContext('2d');
    const slider = document.getElementById('phSlider');
    const phValue = document.getElementById('phValue');
    const solutionExample = document.getElementById('solutionExample');
    const ratioValue = document.getElementById('ratioValue');

    let ions = [];
    let animationId = null;

    const phExamples = {
        0: "Acide chlorhydrique / Acide sulfurique", 1: "Acide de batterie / Estomac humain", 2: "Jus de citron / Soda",
        3: "Vinaigre / Jus d'orange", 4: "Tomate / Bière", 5: "Café noir / Banane", 6: "Lait / Salive",
        7: "Eau pure / Sang humain", 8: "Œuf cru / Eau de mer", 9: "Bicarbonate / Dentifrice", 10: "Savon",
        11: "Ammoniaque / Nettoyant vitres", 12: "Eau de Javel / Eau de chaux", 13: "Décapant four / Déboucheur liquide", 14: "Soude / Nettoyant industriel"
    };

    function resize() {
        const parent = canvas.parentElement;
        // On adapte la résolution interne du canvas à sa taille d'affichage réelle
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

            ctx.fillStyle = 'white';
            ctx.font = 'bold 10px Arial';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.shadowBlur = 0;

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
        const totalIons = 40; 
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

    function updateRatio(pH) {
        // Le rapport [HO-]/[H+] est 10^(2*pH - 14)
        const exponent = 2 * pH - 14;
        if (exponent === 0) {
            ratioValue.innerText = "1";
        } else {
            // Formatage en puissance de 10 pour la lisibilité scientifique
            ratioValue.innerHTML = `10<sup>${exponent}</sup>`;
        }
    }

    slider.addEventListener('input', () => {
        const pH = parseInt(slider.value);
        phValue.innerText = pH;
        solutionExample.innerText = phExamples[pH];
        initIons(pH);
        updateRatio(pH);
    });

    resize();
    animate();
};