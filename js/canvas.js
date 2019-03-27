// Objet Canvas 
const Canvas = {
    canvas: document.getElementById('canvas'),
    ctx: '', //document.getElementById('canvas').getContext('2d'),
    dessin: false, // gestion du dessin (défini à false au départ puisque le canvas est vide)
    canvasElmt: false, // On définit si le canvas est vide ou non

    init: function () {
        this.event();
    },

    // Position Souris
    position: function (e) {
        const rect = this.canvas.getBoundingClientRect(); // Renvoie la taille et la position de l'élément canvas
        const x = e.clientX - rect.left; // "clientX" permet de récupérer la position horizontale de la souris
        const y = e.clientY - rect.top; // "clientY" permet de récupérer la position verticale de la souris
        
        return {
            x: x,
            y: y
        };
    },

    // Gestion de l'appui souris
    appuiSouris: function () {
        this.ctx = document.getElementById('canvas').getContext('2d'); // On initialise le context du canvas
        this.canvasElmt = true;
        this.dessin = true; // Lors de l'appui de la souris, on passe le dessin à "true" puisque l'on va dessiner
        this.ctx.beginPath(); // On commence un nouveau dessin
    },

    // Méthode permettant de tracer notre dessin 
    tracer: function (e) {
        const indexPosition = this.position(e); // On récupère la position de la souris

        const posX = indexPosition.x;
        const posY = indexPosition.y;
        this.signer(posX, posY); // On exécute la méthode signer() qui permet de réaliser le tracé
    },

    // Méthode permettant d'arrêter le tracé
    stopTracer: function () {
        this.dessin = false; 
    },

    // Méthode permettant de dessiner sur le canvas
    signer: function (x, y) {
        this.ctx = document.getElementById('canvas').getContext('2d');
        
        this.ctx.strokeStyle = "#000000"; // couleur du tracé
        this.ctx.lineWidth = 2; // Taille du tracé
        this.ctx.lineCap = 'round'; // permet d'arrondir le tracé

        if (this.dessin) {  // Si le dessin est égal à "true"
            this.ctx.lineTo(x, y); // Trace une ligne 
            this.ctx.stroke(); // Exécute la ligne 

            this.canvasElmt = true;
        }
    },

    // Méthode permettant d'initialiser le canvas 
    recommencer: function () {
        this.ctx = document.getElementById('canvas').getContext('2d');
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.canvasElmt = false;
    },

    // Méthode gérant tous les évenements
    event: function () {
        // Evènements tactile (doigt, stylet...)
        this.canvas.addEventListener('touchstart', function (e) {
            const touch = e.touches[0]; // On récupères la position du doigt
            const mouseEvent = new MouseEvent('mousedown', { // On convertit l'évènement "touchstart" en évènement "mousedown"
                clientX: touch.clientX, // "clientX" devient la position horizontale du doigt
                clientY: touch.clientY // "clientY" devient la position verticale du doigt
            });
            this.dispatchEvent(mouseEvent); // Appel de l'évènement "mousedown"
        });
        this.canvas.addEventListener('touchmove', function (e) {
            e.preventDefault();
            const touch = e.touches[0];
            const mouseEvent = new MouseEvent('mousemove', {
                clientX: touch.clientX,
                clientY: touch.clientY
            });
            this.dispatchEvent(mouseEvent); // Appel de l'évènement "mousemove"
        });
        this.canvas.addEventListener('touchend', function () {
            const mouseEvent = new MouseEvent('mouseup', {});
            this.dispatchEvent(mouseEvent); // Appel de l'évènement "mouseup"
        });

        // Evènements souris
        this.canvas.addEventListener('mousedown', function () {
            Canvas.appuiSouris();
        });
        this.canvas.addEventListener('mousemove', function (e) {
            Canvas.tracer(e);
        });
        this.canvas.addEventListener('mouseup', function () {
            Canvas.stopTracer();
        });

        // Gestion du bouton "Recommencez"
        document.getElementById('reset').addEventListener('click', function (e) {
            e.preventDefault(); // On stoppe la fonction d'envoi du formulaire
            Canvas.recommencer();
            document.getElementById('annuler').style.display = 'none'; // On cache le bouton "Recommencez"
        });
    }
}
Canvas.init();
