window.onload = function() {
    const SCALE = 7.3; 
    const app = document.getElementById('app');
    const gradBox = document.getElementById('grad-box');
    const liquidBody = document.getElementById('liquid-body');
    const meniscus = document.getElementById('meniscus');
    const dropZone = document.getElementById('drop-zone');
    const builderZone = document.getElementById('builder-zone');

    let baseVolume = 10; 
    let appScale = 1;

    function resizeApp() {
        const baseHeight = 700;
        // On ne scale que si la fenêtre est plus petite que la hauteur requise
        if (window.innerHeight < baseHeight) {
            appScale = window.innerHeight / baseHeight;
        } else {
            appScale = 1;
        }
        app.style.transform = `scale(${appScale})`;
        app.style.width = (100 / appScale) + '%';
    }

    window.addEventListener('resize', resizeApp);
    resizeApp();
    
    const items = [
        { id: 'figurine', volume: 8, isInside: false, startPos: { left: '50px', top: '150px' } },
        { id: 'dino', volume: 5, isInside: false, startPos: { left: '50px', top: '250px' } }
    ];

    // Graduations
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
        let addedVolume = items.reduce((acc, item) => item.isInside ? acc + item.volume : acc, 0);
        let v2 = v1 + addedVolume;
        let totalVolumeVisual = v2 + 1.25; 
        let targetHeightPx = totalVolumeVisual * SCALE;
        liquidBody.style.height = (targetHeightPx + 20) + "px"; 
        meniscus.style.bottom = (targetHeightPx - 25) + "px"; 
        document.getElementById('v1-val').innerText = v1.toFixed(1) + " mL";
        document.getElementById('v2-val').innerText = v2.toFixed(1) + " mL";
        document.getElementById('vobj-val').innerText = addedVolume.toFixed(1) + " mL";
    }

    document.getElementById('add-water-btn').onclick = () => { if (baseVolume < 40) { baseVolume += 1; updateUI(); } };
    document.getElementById('reset-btn').onclick = () => {
        baseVolume = 10;
        items.forEach(item => {
            const el = document.getElementById(item.id);
            item.isInside = false;
            el.style.transition = 'none';
            el.style.left = item.startPos.left;
            el.style.top = item.startPos.top;
        });
        updateUI();
    };

    items.forEach(item => {
        const el = document.getElementById(item.id);
        let isDragging = false;
        let startX, startY, initialLeft, initialTop;

        const startDrag = (e) => {
            isDragging = true;
            const pt = e.touches ? e.touches[0] : e;
            startX = pt.clientX;
            startY = pt.clientY;
            initialLeft = el.offsetLeft;
            initialTop = el.offsetTop;
            el.style.transition = 'none';
            el.style.zIndex = '100';
            if (e.cancelable) e.preventDefault();
        };

        const moveDrag = (e) => {
            if (!isDragging) return;
            const pt = e.touches ? e.touches[0] : e;
            const dx = (pt.clientX - startX) / appScale;
            const dy = (pt.clientY - startY) / appScale;
            el.style.left = (initialLeft + dx) + 'px';
            el.style.top = (initialTop + dy) + 'px';
        };

        const endDrag = () => {
            if (!isDragging) return;
            isDragging = false;
            el.style.zIndex = '10';
            const figRect = el.getBoundingClientRect();
            const zoneRect = dropZone.getBoundingClientRect();
            const containerRect = builderZone.getBoundingClientRect();

            if (figRect.left < zoneRect.right && figRect.right > zoneRect.left &&
                figRect.top < zoneRect.bottom && figRect.bottom > zoneRect.top) {
                el.style.transition = 'all 0.4s ease-in';
                const unscaledZoneWidth = zoneRect.width / appScale;
                const unscaledFigWidth = figRect.width / appScale;
                const unscaledFigHeight = figRect.height / appScale;
                const targetLeft = ((zoneRect.left - containerRect.left) / appScale) + (unscaledZoneWidth / 2) - (unscaledFigWidth / 2);
                let offsetStack = items.filter(i => i.isInside && i.id !== item.id).length * 10;
                const targetTop = ((zoneRect.bottom - containerRect.top) / appScale) - unscaledFigHeight - 5 - offsetStack;
                el.style.left = targetLeft + 'px';
                el.style.top = targetTop + 'px';
                item.isInside = true;
            } else {
                item.isInside = false;
                el.style.transition = 'all 0.4s ease-out';
                el.style.left = item.startPos.left;
                el.style.top = item.startPos.top;
            }
            updateUI();
        };

        el.addEventListener('mousedown', startDrag);
        document.addEventListener('mousemove', moveDrag);
        document.addEventListener('mouseup', endDrag);
        el.addEventListener('touchstart', startDrag, { passive: false });
        document.addEventListener('touchmove', moveDrag, { passive: false });
        document.addEventListener('touchend', endDrag);
    });

    updateUI();
};