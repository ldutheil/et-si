window.onload = function() {
    const SCALE = 7.3; 
    const gradBox = document.getElementById('grad-box');
    const liquidBody = document.getElementById('liquid-body');
    const meniscus = document.getElementById('meniscus');
    const figurine = document.getElementById('figurine');
    const dropZone = document.getElementById('drop-zone');
    const builderZone = document.getElementById('builder-zone');

    let baseVolume = 10; 
    let isInside = false;
    let volumeObjet = 8; 

    // Initialisation graduations
    for (let i = 0; i <= 50; i += 1) {
        const grad = document.createElement('div');
        const pos = (i-2) * SCALE;
        if (i % 10 === 0) {
            grad.className = 'grad major';
            const lbl = document.createElement('div');
            lbl.className = 'grad-label';
            lbl.style.bottom = pos + 'px';
            lbl.innerText = i;
            gradBox.appendChild(lbl);
        } else {
            grad.className = 'grad';
            grad.style.width = "15px";
        }
        grad.style.bottom = pos + 'px';
        gradBox.appendChild(grad);
    }

    function updateUI() {
        let v1 = baseVolume;
        let v2 = isInside ? (baseVolume + volumeObjet) : baseVolume;
        
        let totalVolumeVisual = v2 + 1.25; 
        let targetHeightPx = totalVolumeVisual * SCALE;
        liquidBody.style.height = (targetHeightPx + 20) + "px"; 
        meniscus.style.bottom = (targetHeightPx - 25) + "px"; 

        document.getElementById('v1-val').innerText = v1.toFixed(1) + " mL";
        document.getElementById('v2-val').innerText = v2.toFixed(1) + " mL";
        document.getElementById('vobj-val').innerText = (isInside ? volumeObjet.toFixed(1) : "0.0") + " mL";
    }

    // Contrôles boutons
    document.getElementById('add-water-btn').onclick = () => {
        if (baseVolume < 40) { baseVolume += 1; updateUI(); }
    };

    document.getElementById('reset-btn').onclick = () => {
        baseVolume = 10;
        isInside = false;
        figurine.style.transition = 'none';
        figurine.style.left = '10%';
        figurine.style.top = '30%';
        updateUI();
    };

    // Drag and Drop
    let isDragging = false;
    let startX, startY;

    figurine.addEventListener('mousedown', (e) => {
        isDragging = true;
        startX = e.clientX - figurine.offsetLeft;
        startY = e.clientY - figurine.offsetTop;
        figurine.style.transition = 'none';
        figurine.style.cursor = 'grabbing';
    });

    document.addEventListener('mousemove', (e) => {
        if (!isDragging) return;
        figurine.style.left = (e.clientX - startX) + 'px';
        figurine.style.top = (e.clientY - startY) + 'px';
    });

    document.addEventListener('mouseup', () => {
        if (!isDragging) return;
        isDragging = false;
        figurine.style.cursor = 'grab';

        const figRect = figurine.getBoundingClientRect();
        const zoneRect = dropZone.getBoundingClientRect();
        const containerRect = builderZone.getBoundingClientRect();

        // Si l'objet touche l'éprouvette
        if (figRect.left < zoneRect.right && figRect.right > zoneRect.left &&
            figRect.top < zoneRect.bottom && figRect.bottom > zoneRect.top) {
            
            figurine.style.transition = 'all 0.4s ease-in';
            
            // Calcul relatif au parent builder-zone
            const targetLeft = (zoneRect.left - containerRect.left) + (zoneRect.width / 2) - (figRect.width / 2);
            const targetTop = (zoneRect.bottom - containerRect.top) - figRect.height - 5;
            
            figurine.style.left = targetLeft + 'px';
            figurine.style.top = targetTop + 'px';
            isInside = true;
        } else {
            isInside = false;
            figurine.style.transition = 'all 0.4s ease-out';
            figurine.style.left = '10%';
            figurine.style.top = '30%';
        }
        updateUI();
    });

    updateUI();
};