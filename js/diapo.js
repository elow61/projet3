// Objet Diaporama
const Diapo = {
    images: document.getElementsByClassName('diapositive'), 
    index: 0, // Position actuelle du slider
    boutonPause: document.getElementById('button-pause'), // Appel du bouton pause/play
    boucle: setInterval(function () {Diapo.changerImage();}, 5000), // Temps en milliseconde entre chaque images

    init: function () { 
       this.sliderNext();
       this.appelFonctions();
       this.touche();
    },

    // fonction permettant de remettre à zéro le temps du diapo
    resetDiapo: function () {
        clearInterval(this.boucle);
        this.boucle = setInterval(function () {Diapo.changerImage();}, 5000);
    },

    // Permets de modifier l'image 
    changerImage: function () { 
        this.images[this.index].style.display = "none"; // Masque l'image active
        if (this.index < this.images.length - 1) { // Si l'index est inférieur au nombre d'images
            this.index++; // on augmente l'index pour qu'il puisse passer à l'image suivante
        } else {
            this.index = 0; // Sinon l'index revient à la 1ère image
        }
        this.images[this.index].style.display = "block"; // Montre l'image correspondant à l'index
    },

    // Fonction permettant le clic sur le bouton "NEXT"
    sliderNext: function () { 
        document.getElementById('button-next').addEventListener('click', function () {
            Diapo.changerImage();
            Diapo.resetDiapo();
        });
    },

    // Fonction permettant le clic sur le bouton "PREV"
    sliderPrev: function () { 
        this.images[this.index].style.display = "none"; // Masque l'image active
        if (this.index === 0) { // Si l'index est égal à 0 (donc à la première image)
            this.index = this.images.length -1; // L'index sera donc égal au nombre d'images afin de faire apparaitre l'image précédente
        } else {
            this.index -= 1; // Sinon l'index recul
        }
        this.images[this.index].style.display = "block"; // Montre l'image correspondant à l'index
    },

    // Appel de différentes fonctions (bouton de retour et le bouton pause/play)
    appelFonctions: function () { 
        document.getElementById('button-prev').addEventListener('click', function () {
            Diapo.sliderPrev();
            Diapo.resetDiapo();
        });
        document.getElementById('button-pause').addEventListener('click', function () {
            Diapo.sliderPause();
        });
    },

    // Gestion du bouton play/pause
    sliderPause: function () {
        const sClass = 'play'; // Gestion du passage au bouton "Play" 
        if (this.boutonPause.classList.contains(sClass) === true) {
            this.boutonPause.classList.remove(sClass); // Cache le bouton "Play"
            this.boutonPause.classList.add('pause'); // Affiche le bouton "Pause"
            this.boucle = setInterval(function () {Diapo.changerImage();}, 5000); // Relance la boucle
        } else {
            this.boutonPause.classList.add(sClass); // Ajoute le bouton "Play"
            this.boutonPause.classList.remove('pause'); // Cache le bouton "Pause"
            clearInterval(this.boucle);
        }
    },

    // Gestion des touches du clavier
    touche: function () {
        document.addEventListener('keyup', function (e) {
            if (e.keyCode === 37) {
                Diapo.sliderPrev();
            } else if (e.keyCode === 39) {
                Diapo.changerImage();
            } else if (e.keyCode === 32) {
                Diapo.sliderPause();
            }
        });
    }
}
Diapo.init();