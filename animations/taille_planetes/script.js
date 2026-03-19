const astros = [
    { name: "Mercure", d: 4879, class: "mercure-style" },
    { name: "Mars", d: 6779, class: "mars-style" },
    { name: "Vénus", d: 12104, class: "venus-style" },
    { name: "Terre", d: 12742, class: "terre-style" },
    { name: "Neptune", d: 49244, class: "neptune-style" },
    { name: "Uranus", d: 50724, class: "uranus-style" },
    { name: "Saturne", d: 116460, class: "saturne-style" },
    { name: "Jupiter", d: 139820, class: "jupiter-style" },
    { name: "Soleil", d: 1392700, class: "sun-style" }
];

const stage = document.getElementById('viewport');
const slider = document.getElementById('zoom-slider');
const sizeLabel = document.getElementById('planet-size');

// Initialisation des objets
astros.forEach((astro) => {
    const div = document.createElement('div');
    div.className = 'astro-object ' + astro.class;
    
    const labelCont = document.createElement('div');
    labelCont.className = 'label-container';
    labelCont.innerHTML = `<div class="name-label">${astro.name}</div>
                           <div class="radius-label">R ≈ ${Math.round(astro.d/200)*100} km</div>`;
    
    div.appendChild(labelCont);
    astro.element = div;
    astro.labelElement = labelCont;
    stage.appendChild(div);
});

function update() {
    const val = 1000 - parseFloat(slider.value);
    // Courbe de zoom ajustée pour être plus sensible sur les petits objets
    const scaleBase = Math.pow(1.006, val); 
    
    const viewportW = stage.clientWidth;
    const viewportH = stage.clientHeight;
    const referenceSize = viewportH * 0.7; 

    astros.forEach((astro, i) => {
        const ratio = astro.d / 12742; // Ratio par rapport à la Terre pour plus de sens
        const size = (referenceSize * ratio) / (scaleBase * 0.05);
        
        astro.element.style.width = size + "px";
        astro.element.style.height = size + "px";

        // Positionnement horizontal dynamique
        const centerX = viewportW / 2;
        const spacing = (i - 4) * (size * 0.1 + 40); 
        astro.element.style.left = (centerX + spacing - size/2) + "px";

        // Mise à jour du nom en focus
        if (size > viewportH * 0.2 && size < viewportH * 1.2) {
            sizeLabel.innerText = astro.name;
        }

        // Gestion de l'opacité et des labels
        let opacity = 1;
        if (size > viewportW * 1.5) opacity = 0.1;
        else if (size < 5) opacity = 0;
        astro.element.style.opacity = opacity;

        const labelAlpha = (size > 80 && size < viewportH * 1.5) ? 1 : 0;
        astro.labelElement.style.opacity = labelAlpha;
    });
}

slider.addEventListener('input', update);
window.addEventListener('resize', update);
update();