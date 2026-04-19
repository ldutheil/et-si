const events = [
    { year: -400, isMajor: true, title: "L'Atome de Démocrite", desc: "Le philosophe grec imagine que la matière est composée de grains insécables.\nIl les nomme 'atomos' (indivisibles).\nCette vision est purement philosophique.\nElle sera oubliée pendant plus de 2000 ans.\nAristote impose alors l'idée des quatre éléments." },
    { year: -250, title: "Eurêka d'Archimède", desc: "Archimède découvre le principe de la poussée statique.\nTout corps plongé dans un fluide subit une force vers le haut.\nIl définit également les lois des leviers et des poulies.\nIl fonde ainsi la statique des solides et des fluides.\nC'est l'un des premiers physiciens mathématiciens." },
    { year: 60, title: "L'Éolipyle de Héron", desc: "Héron d'Alexandrie crée la première machine à vapeur.\nUne sphère tourne grâce à la vapeur s'échappant de tubes.\nC'est la première conversion de pression en mouvement.\nElle restera un simple jouet de curiosité.\nElle préfigure pourtant la machine à vapeur industrielle." },
    { year: 800, title: "Alchimie de Jabir", desc: "Jabir ibn Hayyan (Geber) transforme l'alchimie en chimie.\nIl invente l'alambic et perfectionne la distillation.\nIl isole l'acide citrique, tartrique et sulfurique.\nIl insiste sur l'expérimentation systématique.\nOn le considère comme le père de la chimie arabe." },
    { year: 1021, title: "Optique d'Al-Haytham", desc: "Ibn al-Haytham publie son 'Traité d'optique'.\nIl prouve que la lumière entre dans l'œil (intromission).\nIl étudie la réflexion, la réfraction et les miroirs.\nIl invente la chambre noire (camera obscura).\nIl est le précurseur de la méthode scientifique moderne." },
    { year: 1543, title: "Héliocentrisme", desc: "Nicolas Copernic publie son modèle du système solaire.\nIl place le Soleil au centre, et non plus la Terre.\nC'est le début de la 'Révolution Copernicienne'.\nIl simplifie ainsi le calcul des éphémérides.\nL'ouvrage est publié sur son lit de mort." },
    { year: 1609, title: "Orbites de Kepler", desc: "Johannes Kepler découvre que les orbites ne sont pas des cercles.\nLes planètes décrivent des ellipses dont le Soleil est un foyer.\nIl définit la loi des aires (vitesse variable).\nIl utilise les données ultra-précises de Tycho Brahe.\nC'est la fin du dogme des mouvements circulaires parfaits." },
    { year: 1610, title: "Sidereus Nuncius", desc: "Galilée pointe sa lunette vers le ciel nocturne.\nIl découvre les montagnes de la Lune et les phases de Vénus.\nIl observe quatre lunes tournant autour de Jupiter.\nC'est la preuve visuelle que tout ne tourne pas autour de la Terre.\nL'Église commence à s'inquiéter de ses découvertes." },
    { year: 1643, title: "Le Baromètre", desc: "Evangelista Torricelli prouve que l'air a un poids.\nIl utilise un tube de mercure pour mesurer la pression.\nIl crée ainsi le premier vide artificiel (le haut du tube).\nIl contredit le dogme de l''horreur du vide'.\nIl remarque que la pression change selon la météo." },
    { year: 1661, title: "The Sceptical Chymist", desc: "Robert Boyle définit la notion moderne d'élément chimique.\nIl rejette les 4 éléments grecs et les 3 principes alchimiques.\nIl établit la loi PV = k (Loi de Boyle-Mariotte).\nIl insiste sur la chimie comme science expérimentale.\nC'est la rupture définitive entre alchimie et chimie." },
    { year: 1666, title: "Spectre de la Lumière", desc: "Isaac Newton décompose la lumière blanche avec un prisme.\nIl prouve que la couleur est une propriété de la lumière.\nLa lumière blanche est un mélange de toutes les couleurs.\nIl invente le premier télescope à miroir (réflecteur).\nIl évite ainsi les aberrations chromatiques des lunettes." },
    { year: 1687, isMajor: true, title: "Lois de Newton", desc: "Isaac Newton publie ses 'Principia Mathematica'.\nIl définit la loi de la gravitation universelle.\nExplique le mouvement des planètes et des objets.\nC'est la naissance de la physique moderne.\nIl introduit les concepts de masse et de force." },
    { year: 1789, title: "Conservation de la Masse", desc: "Antoine Lavoisier révolutionne la chimie moderne.\n'Rien ne se perd, rien ne se crée, tout se transforme'.\nIl identifie l'oxygène et l'hydrogène.\nIl prouve que l'eau n'est pas un élément unique.\nIl meurt guillotiné sous la Révolution." },
    { year: 1803, title: "Théorie Atomique", desc: "John Dalton relance l'idée de l'atome.\nIl propose que chaque élément a un poids propre.\nLes réactions sont des réarrangements d'atomes.\nIl crée les premiers symboles chimiques.\nIl explique ainsi la loi des proportions définies." },
    { year: 1869, isMajor: true, title: "Tableau de Mendeleïev", desc: "Dmitri Mendeleïev classe les 63 éléments connus.\nIl les range par masse atomique croissante.\nIl laisse des cases vides pour les éléments inconnus.\nIl prédit avec succès les propriétés du Gallium.\nSon système devient la bible de la chimie mondiale." },
    { year: 1897, title: "Découverte de l'Électron", desc: "J.J. Thomson étudie les rayons cathodiques.\nIl découvre une particule chargée négativement.\nC'est le premier composant de l'atome identifié.\nIl prouve que l'atome n'est pas indivisible.\nModèle dit du 'Plum Pudding'." },
    { year: 1898, title: "Radioactivité", desc: "Marie et Pierre Curie isolent le Polonium et le Radium.\nIls découvrent que certains atomes sont instables.\nLa matière peut émettre de l'énergie spontanément.\nMarie sera la première femme prix Nobel.\nElle est la seule à en avoir reçu deux différents." },
    { year: 1905, isMajor: true, title: "Année Miraculeuse", desc: "Albert Einstein publie 4 articles fondateurs.\nIl explique l'effet photoélectrique (photons).\nIl prouve l'existence réelle des molécules.\nIl introduit la Relativité Restreinte (E=mc²).\nIl change radicalement notre vision du temps." },
    { year: 1913, title: "Modèle de Bohr", desc: "Niels Bohr propose un modèle planétaire de l'atome.\nLes électrons orbitent sur des niveaux d'énergie.\nIls sautent d'une couche à l'autre par 'quanta'.\nExplique pourquoi les atomes émettent de la lumière.\nBase fondamentale de la mécanique quantique." },
    { year: 1926, isMajor: true, title: "Mécanique Ondulatoire", desc: "Erwin Schrödinger propose son équation d'onde.\nL'électron n'est plus une bille mais une probabilité.\nC'est la naissance de la physique quantique moderne.\nIl introduit le célèbre paradoxe du chat.\nLa matière devient floue à l'échelle microscopique." },
    { year: 1932, title: "Le Neutron", desc: "James Chadwick découvre le neutron dans le noyau.\nParticule de masse égale au proton mais neutre.\nPermet de comprendre la stabilité des noyaux lourds.\nOuvre la voie à la fission nucléaire.\nL'atome est désormais complet : p+, n0 et e-." }
];

const container = document.getElementById('events-container');
const marksContainer = document.getElementById('marks-container');
const zoomBtn = document.getElementById('zoom-toggle');
const tooltip = document.getElementById('details-tooltip');
const ttTitle = document.getElementById('tooltip-title');
const ttDesc = document.getElementById('tooltip-desc');

let isModernView = false;

function renderTimeline() {
    container.innerHTML = '';
    marksContainer.innerHTML = '';
    
    const startYear = isModernView ? 1500 : -500;
    const endYear = 2025;
    const range = endYear - startYear;

    // Graduations
    const step = isModernView ? 25 : 250;
    for (let y = Math.ceil(startYear / step) * step; y <= endYear; y += step) {
        const xPercent = ((y - startYear) / range) * 100;
        if (xPercent < 0 || xPercent > 100) continue;

        const mark = document.createElement('div');
        mark.className = 'century-mark';
        mark.style.left = `${xPercent}%`;
        mark.innerHTML = `<div class="tick"></div><div class="century-label">${y}</div>`;
        marksContainer.appendChild(mark);
    }

    // Événements
    // On filtre d'abord les événements qui seront réellement affichés pour calculer les collisions
    const displayableEvents = events
        .filter(e => e.year >= startYear)
        .filter(e => isModernView || e.isMajor)
        .sort((a,b) => a.year - b.year);
    
    let lastX = -100;
    let level = 0;

    displayableEvents.forEach(ev => {
        const xPercent = ((ev.year - startYear) / range) * 100;
        
        // Gestion de l'empilement : si moins de 12% d'écart, on change de niveau
        if (xPercent - lastX < 12) { level++; } else { level = 0; }
        lastX = xPercent;

        const marker = document.createElement('div');
        marker.className = 'event-marker';
        marker.style.left = `${xPercent}%`;
        
        marker.onmouseenter = () => {
            tooltip.style.display = 'block';
            ttTitle.innerText = `${ev.year} : ${ev.title}`;
            ttDesc.innerText = ev.desc;
            line.classList.add('active');
        };
        marker.onmouseleave = () => {
            tooltip.style.display = 'none';
            line.classList.remove('active');
        };

        // Libellé de l'événement
        const label = document.createElement('div');
        label.className = 'event-text';
        label.style.left = `${xPercent}%`;
        label.style.transform = 'translateX(-50%)';
        
        // Création de la ligne de rappel
        const line = document.createElement('div');
        line.className = 'event-line';
        line.style.left = `${xPercent}%`;

        const yOffset = 45 + (level * 35);
        if (level % 2 === 0) {
            label.style.bottom = `calc(50% + ${yOffset}px)`;
            line.style.bottom = '50%';
            line.style.height = `${yOffset - 10}px`;
            line.style.transformOrigin = 'bottom';
        } else {
            label.style.top = `calc(50% + ${yOffset}px)`;
            line.style.top = '50%';
            line.style.height = `${yOffset - 10}px`;
            line.style.transformOrigin = 'top';
        }
        
        label.innerText = ev.title;

        container.appendChild(marker);
        container.appendChild(line);
        container.appendChild(label);
    });
}

zoomBtn.onclick = () => {
    isModernView = !isModernView;
    zoomBtn.innerText = isModernView ? "Retour à la vue globale" : "Zoomer sur l'époque moderne (1500+)";
    renderTimeline();
};

window.onresize = renderTimeline;
renderTimeline();