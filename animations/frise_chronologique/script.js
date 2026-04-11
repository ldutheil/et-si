window.onload = function() {
    const marksContainer = document.getElementById('marks-container');
    
    const startYear = -300;
    const endYear = 2000;
    const range = endYear - startYear;

    // Génération des tirets par siècle
    for (let year = startYear; year <= endYear; year += 100) {
        const mark = document.createElement('div');
        mark.className = 'century-mark';
        
        // Calcul de la position en pourcentage
        const position = ((year - startYear) / range) * 100;
        mark.style.left = position + "%";

        mark.innerHTML = `
            <div class="tick"></div>
            <div class="century-label">${year}</div>
        `;

        marksContainer.appendChild(mark);
    }
};