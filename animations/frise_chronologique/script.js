const events = [
    { year: -400, isMajor: true, title: "L'Atome de Démocrite", desc: "Le philosophe grec imagine que la matière est composée de grains insécables.\nIl les nomme 'atomos' (indivisibles).\nCette vision est purement philosophique.\nElle sera oubliée pendant plus de 2000 ans.\nAristote impose alors l'idée des quatre éléments." },
    { year: -250, title: "Eurêka d'Archimède", desc: "Archimède découvre le principe de la poussée statique.\nTout corps plongé dans un fluide subit une force vers le haut.\nIl définit les lois des leviers et des poulies.\nIl fonde ainsi la statique des solides et des fluides.\nC'est l'un des premiers physiciens mathématiciens." },
    { year: -240, isMajor: true, title: "Ératosthène", desc: "Mesure de la circonférence de la Terre.\nIl utilise l'ombre d'un bâton à deux endroits différents.\nIl obtient un résultat d'une précision remarquable.\nIl prouve ainsi que la Terre est ronde.\nIl est considéré comme le père de la géodésie." },
    { year: 150, title: "Modèle Géocentrique", desc: "Ptolémée formalise le modèle géocentrique.\nLa Terre est immobile au centre de l'Univers.\nLes astres tournent autour dans des systèmes complexes d'épicycles.\nCe modèle dominera la pensée scientifique pendant 14 siècles.\nIl sera détrôné par Copernic." },
    { year: 60, title: "L'Éolipyle de Héron", desc: "Héron d'Alexandrie crée la première machine à vapeur.\nUne sphère tourne grâce à la vapeur s'échappant de tubes.\nC'est la première conversion de pression en mouvement.\nElle restera un simple jouet de curiosité.\nElle préfigure pourtant la machine à vapeur industrielle." },
    { year: 800, title: "Alchimie de Jabir", desc: "Jabir ibn Hayyan (Geber) transforme l'alchimie en chimie.\nIl invente l'alambic et perfectionne la distillation.\nIl isole l'acide citrique, tartrique et sulfurique.\nIl insiste sur l'expérimentation systématique.\nOn le considère comme le père de la chimie arabe." },
    { year: 1021, isMajor: true, title: "Traité d'optique", desc: "Alhazen publie son 'Traité d'optique'.\nIl prouve que la lumière entre dans l'œil (intromission).\nIl étudie la réflexion, la réfraction et les miroirs.\nIl invente la chambre noire (camera obscura).\nIl est le précurseur de la méthode scientifique moderne." },
    { year: 1543, title: "Héliocentrisme", desc: "Nicolas Copernic publie son modèle du système solaire.\nIl place le Soleil au centre, et non plus la Terre.\nC'est le début de la 'Révolution Copernicienne'.\nIl simplifie ainsi le calcul des éphémérides.\nL'ouvrage est publié sur son lit de mort." },
    { year: 1572, title: "Tycho Brahe", desc: "Observation d'une supernova.\nTycho prouve que le ciel n'est pas immuable.\nIl réalise des mesures d'une précision inégalée sans télescope.\nSes données permettront à Kepler de trouver ses lois.\nIl brise définitivement les sphères d'Aristote." },
    { year: 1608, title: "Invention du Télescope", desc: "Apparition des premières lunettes d'approche.\nHans Lippershey dépose le premier brevet.\nGalilée perfectionne l'instrument l'année suivante.\nCela permet d'observer les lunes de Jupiter et les phases de Vénus.\nL'Univers devient enfin accessible à l'observation directe." },
    { year: 1609, title: "Orbites de Kepler", desc: "Johannes Kepler découvre que les orbites ne sont pas des cercles.\nLes planètes décrivent des ellipses dont le Soleil est un foyer.\nIl définit la loi des aires (vitesse variable).\nIl utilise les données ultra-précises de Tycho Brahe.\nC'est la fin du dogme des mouvements circulaires parfaits." },
    { year: 1610, title: "Galilée", desc: "Galilée pointe sa lunette vers le ciel nocturne.\nIl découvre les montagnes de la Lune et les phases de Vénus.\nIl observe quatre lunes tournant autour de Jupiter.\nC'est la preuve visuelle que tout ne tourne pas autour de la Terre.\nL'Église commence à s'inquiéter de ses découvertes." },
    { year: 1621, title: "Descartes / Snell", desc: "Lois de la réfraction de la lumière.\nSnell définit la loi mathématique, Descartes la publie.\nPermet de comprendre le fonctionnement des lentilles.\nC'est la base de l'optique géométrique moderne.\nLien entre angle d'incidence et angle de réfraction." },
    { year: 1643, title: "Le Baromètre", desc: "Evangelista Torricelli prouve que l'air a un poids.\nIl utilise un tube de mercure pour mesurer la pression.\nIl crée ainsi le premier vide artificiel (le haut du tube).\nIl contredit le dogme de l''horreur du vide'.\nIl remarque que la pression change selon la météo." },
    { year: 1661, title: "The Sceptical Chymist", desc: "Robert Boyle définit la notion moderne d'élément chimique.\nIl rejette les 4 éléments grecs et les 3 principes alchimiques.\nIl établit la loi PV = k (Loi de Boyle-Mariotte).\nIl insiste sur la chimie comme science expérimentale.\nC'est la rupture définitive entre alchimie et chimie." },
    { year: 1666, title: "Spectre de la Lumière", desc: "Isaac Newton décompose la lumière blanche avec un prisme.\nIl prouve que la couleur est une propriété de la lumière.\nLa lumière blanche est un mélange de toutes les couleurs.\nIl invente le premier télescope à miroir (réflecteur).\nIl évite ainsi les aberrations chromatiques des lunettes." },
    { year: 1678, title: "Huygens / Lorentz", desc: "Théorie ondulatoire de la lumière.\nHuygens propose que la lumière est une onde.\nElle se propage dans l'éther comme le son dans l'air.\nLorentz unira plus tard ces concepts à l'électromagnétisme.\nDébut du débat séculaire : onde ou particule ?" },
    { year: 1687, isMajor: true, title: "Lois de Newton", desc: "Isaac Newton publie ses 'Principia Mathematica'.\nIl définit la loi de la gravitation universelle.\nExplique le mouvement des planètes et des objets.\nC'est la naissance de la physique moderne.\nIl introduit les concepts de masse et de force." },
    { year: 1742, title: "Celsius / Kelvin", desc: "Définition des échelles de température.\nAnders Celsius crée l'échelle centésimale (1742).\nLord Kelvin définit le zéro absolu en 1848.\nLien direct entre température et agitation moléculaire.\nIndispensable pour la thermodynamique." },
    { year: 1789, isMajor: true, title: "Lavoisier", desc: "Antoine Lavoisier révolutionne la chimie moderne.\n'Rien ne se perd, rien ne se crée, tout se transforme'.\nIl identifie l'oxygène et l'hydrogène.\nIl prouve que l'eau n'est pas un élément unique.\nIl meurt guillotiné sous la Révolution." },
    { year: 1799, title: "Laplace", desc: "Publication de la Mécanique Céleste.\nPierre-Simon de Laplace explique la stabilité du système solaire.\nIl propose l'existence des trous noirs (astres occlus).\nIl développe la théorie des probabilités.\nOn l'appelle le 'Newton français'." },
    { year: 1803, title: "Dalton / Atome", desc: "John Dalton relance l'idée de l'atome.\nIl propose que chaque élément a un poids propre.\nLes réactions sont des réarrangements d'atomes.\nIl crée les premiers symboles chimiques.\nIl explique ainsi la loi des proportions définies." },
    { year: 1822, title: "Fourier", desc: "Théorie analytique de la chaleur.\nJoseph Fourier explique comment la chaleur se propage.\nIl invente les séries de Fourier.\nC'est l'outil mathématique le plus utilisé aujourd'hui.\nIl est le premier à théoriser l'effet de serre." },
    { year: 1824, title: "Carnot", desc: "Naissance de la thermodynamique.\nSadi Carnot définit le cycle des machines thermiques.\nIl comprend que la chaleur peut produire du mouvement.\nIl pose les bases du deuxième principe de la thermodynamique.\nTravail crucial pour la révolution industrielle." },
    { year: 1828, title: "Chimie Organique", desc: "Friedrich Wöhler synthétise l'urée.\nIl prouve qu'on peut créer du vivant à partir du minéral.\nFin de la théorie de la 'force vitale'.\nNaissance de la chimie organique moderne.\nLa matière du vivant est la même que celle de la pierre." },
    { year: 1865, isMajor: true, title: "Maxwell", desc: "Synthèse de l'électromagnétisme.\nJames Clerk Maxwell unifie électricité et magnétisme.\nIl prouve que la lumière est une onde électromagnétique.\nSes 4 équations sont le pilier de la physique.\nOuvre la voie aux télécommunications." },
    { year: 1869, isMajor: true, title: "Mendeleïev", desc: "Dmitri Mendeleïev classe les 63 éléments connus.\nIl les range par masse atomique croissante.\nIl laisse des cases vides pour les éléments inconnus.\nIl prédit avec succès les propriétés du Gallium.\nSon système devient la bible de la chimie mondiale." },
    { year: 1872, title: "Boltzmann / Perrin", desc: "Preuve de l'existence des atomes.\nLudwig Boltzmann lie entropie et probabilité (1872).\nJean Perrin prouve mathématiquement l'atome (1908).\nLa matière est discontinue, formée de briques élémentaires.\nDébut de la physique statistique." },
    { year: 1898, isMajor: true, title: "Radioactivité / Curie", desc: "Marie et Pierre Curie isolent le Polonium et le Radium.\nIls découvrent que certains atomes sont instables.\nLa matière peut émettre de l'énergie spontanément.\nMarie sera la première femme prix Nobel.\nElle est la seule à en avoir reçu deux différents." },
    { year: 1900, title: "Planck / Quanta", desc: "Max Planck résout la catastrophe ultraviolette.\nIl propose que l'énergie est émise par 'paquets' (quanta).\nC'est l'acte de naissance de la physique quantique.\nIl introduit la constante de Planck h.\nBouleversement total de la physique classique." },
    { year: 1905, isMajor: true, title: "Einstein 1905", desc: "Année Miraculeuse d'Albert Einstein.\nIl explique l'effet photoélectrique (photons).\nIl introduit la Relativité Restreinte (E=mc²).\nIl prouve le mouvement brownien.\nIl change radicalement notre vision du temps." },
    { year: 1907, title: "Plastique", desc: "Invention de la Bakélite par Leo Baekeland.\nPremier plastique entièrement synthétique.\nMatériau isolant, résistant et malléable.\nDébut de l'ère des matériaux polymères.\nVa révolutionner l'industrie et le design." },
    { year: 1909, title: "Synthèse des Engrais", desc: "Procédé Haber-Bosch.\nSynthèse de l'ammoniac à partir de l'azote de l'air.\nPermet la production massive d'engrais chimiques.\nVa nourrir des milliards d'êtres humains.\nL'une des découvertes les plus importantes pour l'humanité." },
    { year: 1913, isMajor: true, title: "Bohr / Rutherford", desc: "Modèle planétaire de l'atome.\nRutherford découvre le noyau (1911).\nBohr quantifie les orbites des électrons (1913).\nL'atome est vide à 99,99%.\nBase fondamentale de la chimie quantique." },
    { year: 1915, title: "Noether", desc: "Théorème d'Emmy Noether.\nElle lie les symétries aux lois de conservation.\nLa symétrie du temps implique la conservation de l'énergie.\nOutil mathématique le plus profond de la physique.\nEinstein la considérait comme un génie absolu." },
    { year: 1924, title: "Bose / Payne", desc: "Statistiques et composition stellaire.\nBose définit une nouvelle statistique (1924).\nCecilia Payne prouve que les étoiles sont d'Hydrogène (1925).\nDécouverte du cinquième état de la matière (Bose-Einstein).\nCompréhension du cœur des étoiles." },
    { year: 1926, isMajor: true, title: "Schrödinger / Pauli", desc: "Sommet de la mécanique quantique.\nSchrödinger définit l'équation d'onde (1926).\nPauli énonce le principe d'exclusion (1925).\nHeisenberg introduit l'incertitude (1927).\nLa matière devient une onde de probabilité." },
    { year: 1945, isMajor: true, title: "Oppenheimer", desc: "Projet Manhattan : La Bombe Atomique.\nPremière utilisation de la fission nucléaire.\nRobert Oppenheimer dirige le laboratoire de Los Alamos.\nChange à jamais la géopolitique et l'éthique scientifique.\n'Je suis devenu la Mort, le destructeur des mondes'." },
    { year: 1947, title: "Semi-conducteurs", desc: "Invention du Transistor.\nShockley, Bardeen et Brattain aux Bell Labs.\nRemplace les lampes à vide par des composants minuscules.\nNaissance de l'électronique moderne et de l'informatique.\nCœur de tous nos ordinateurs et smartphones." },
    { year: 1948, title: "Néel", desc: "Découverte de l'Antiferromagnétisme.\nLouis Néel explique pourquoi certains matériaux ne s'aimantent pas.\nTravaux essentiels pour le stockage de données.\nIl recevra le prix Nobel en 1970.\nPilier de la physique de la matière condensée." },
    { year: 1960, title: "Invention du Laser", desc: "Theodore Maiman réalise le premier laser.\nLumière cohérente et unidirectionnelle.\nUtilisé aujourd'hui partout : chirurgie, fibre optique, industrie.\n'Une solution à la recherche d'un problème'.\nBasé sur l'émission stimulée d'Einstein." },
    { year: 1967, title: "Prigogine", desc: "Systèmes dissipatifs.\nIlya Prigogine étudie la thermodynamique hors équilibre.\nExplique comment l'ordre peut naître du chaos.\nEssentiel pour comprendre les systèmes biologiques complexes.\nRemet en question la flèche du temps." },
    { year: 1969, isMajor: true, title: "Homme sur la Lune", desc: "Mission Apollo 11.\nNeil Armstrong et Buzz Aldrin marchent sur la Lune.\nPlus grand exploit technologique du XXe siècle.\nFruit d'une course spatiale intense entre USA et URSS.\n'Un petit pas pour l'homme, un bond de géant pour l'humanité'." },
    { year: 1977, title: "Voyager 1 et 2", desc: "Lancement des sondes Voyager.\nExploration des planètes géantes et au-delà.\nEmportent le 'Golden Record' pour d'éventuels extraterrestres.\nVoyager 1 est désormais l'objet humain le plus lointain.\nElle a quitté le système solaire (héliopause)." },
    { year: 1995, title: "Exoplanètes", desc: "Première planète autour d'une étoile type Soleil.\nMayor et Queloz découvrent 51 Pegasi b.\nProuve que le système solaire n'est pas unique.\nOuvre la chasse aux planètes habitables.\nBouleversement philosophique et astronomique." },
    { year: 1997, title: "Robot sur Mars", desc: "Mission Pathfinder et robot Sojourner.\nPremier véhicule mobile sur une autre planète.\nDébut d'une présence robotique continue sur Mars.\nRecherche de traces d'eau et de vie passée.\nPréparation de futures missions habitées." }
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
        .sort((a,b) => a.year - b.year);
    
    // Système de gestion des couloirs (Lanes) pour éviter les collisions et les débordements
    // On définit 5 couloirs en haut (0-4) et 5 en bas (5-9)
    const laneOccupancy = new Array(10).fill(-100); 
    const labelWidthPx = 160; // Largeur estimée d'une étiquette + marge
    const containerWidth = container.offsetWidth || window.innerWidth - 100;
    const labelWidthPercent = (labelWidthPx / containerWidth) * 100;

    displayableEvents.forEach(ev => {
        const xPercent = ((ev.year - startYear) / range) * 100;
        const shouldShowLabel = isModernView || ev.year <= 1500 || ev.isMajor;
        
        let chosenLane = 0;
        let foundLane = false;

        // Lane logic : uniquement si l'étiquette est visible
        if (shouldShowLabel) {
            for (let i = 0; i < laneOccupancy.length; i++) {
                if (xPercent > laneOccupancy[i]) {
                    chosenLane = i;
                    foundLane = true;
                    break;
                }
            }
            if (!foundLane) chosenLane = laneOccupancy.indexOf(Math.min(...laneOccupancy));
            laneOccupancy[chosenLane] = xPercent + labelWidthPercent;
        }

        const isTop = chosenLane < 5;
        const level = isTop ? chosenLane : chosenLane - 5;

        const marker = document.createElement('div');
        marker.className = 'event-marker';
        marker.style.left = `${xPercent}%`;
        
        const showDetail = () => {
            tooltip.style.display = 'block';
            ttTitle.innerText = `${ev.year} : ${ev.title}`;
            ttDesc.innerText = ev.desc;
            line.classList.add('active');
        };
        const hideDetail = () => {
            tooltip.style.display = 'none';
            line.classList.remove('active');
        };

        marker.onmouseenter = showDetail;
        marker.onmouseleave = hideDetail;

        // Libellé de l'événement
        const label = document.createElement('div');
        label.className = 'event-text';
        label.style.left = `${xPercent}%`;
        label.style.transform = 'translateX(-50%)';
        
        label.onmouseenter = showDetail;
        label.onmouseleave = hideDetail;

        // Création de la ligne de rappel (seulement si étiquette visible)
        const line = document.createElement('div');
        line.className = 'event-line';
        line.style.left = `${xPercent}%`;

        if (!shouldShowLabel) {
            label.style.display = 'none';
            line.style.display = 'none';
        }

        const yOffset = 35 + (level * 28); // Espacement plus compact
        if (isTop) {
            label.style.bottom = `calc(50% + ${yOffset}px)`;
            line.style.bottom = '50%';
            line.style.height = `${yOffset - 5}px`;
            line.style.transformOrigin = 'bottom';
        } else {
            label.style.top = `calc(50% + ${yOffset}px)`;
            line.style.top = '50%';
            line.style.height = `${yOffset - 5}px`;
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