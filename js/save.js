const Sauvegarde = {
    time: '',
    after: '',
    now: '',

    init: function () {
        this.messageInfo();
        this.annuler();
    },

    // Compte à rebours de la réservation 
    timer: function (date) {

        if (date) { // si le paramètre "date" contient un temps (précedemment sauvegardé dans le SessionStorage), 
            this.after = new Date().getTime() + Number(date); // after sera à l'heure actuelle + le reste de temps du timer (donc du paramètre "date")
        } else {
            this.after = new Date().getTime() + (20*60*1000); // Sinon after sera à l'heure actuelle + 20 mins
        }

        // Compte à rebours mis à jour toutes les secondes
        const x = setInterval(function () {
            // On récupère l'heure actuelle
            Sauvegarde.now = new Date().getTime();
            // On définit la distance entre l'heure actuelle et l'heure de fin 
            const distance = Sauvegarde.after - Sauvegarde.now;

            // On calcule le temps pour les minutes et les secondes 
            const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            const secondes = Math.floor((distance % (1000 * 60)) / 1000);

            // Ajoute le résultat dans l'élément <span id="timing">
            this.time = document.getElementById('timing');
            this.time.innerHTML = minutes + "m " + secondes + "s.";

            // si le compte à rebours est terminé, un message est affiché
            if (distance < 0) {
                clearInterval(x);
                this.time.innerHTML = " temps écoulé";
            }

            // On sauvegarde dans le sessionStorage la distance entre l'heure actuelle et l'heure de fin
            sessionStorage.setItem('timer', distance);

            // Si nous cliquons sur le bouton "annuler", on stoppe le compte à rebours
            document.getElementById('annuler').addEventListener('click', function () {
                clearInterval(x);
            });
        }, 1000);
    },

    messageInfo: function () {
        const nom = document.getElementById('first-name');
        const prenom = document.getElementById('name');
        
        // Gestion du rechargement de la page
        if (sessionStorage.getItem('station')) {
            Sauvegarde.timer(sessionStorage.getItem('timer')); // On lance le compte à rebours en récupérant la sauvegarde de la distance
            document.getElementById('mess-timer').textContent = "Votre vélo est disponible à cette adresse : " + sessionStorage.getItem('station') + " durant ";
            document.getElementById('annuler').style.display = 'inline-block';
            document.getElementById('mess-info').style.display = 'block';
            document.getElementById('reset').style.display = 'none';
            document.getElementById('container-canvas').style.display = 'block';
        }

        // Gestion du bouton "Valider"
        document.getElementById('valider').addEventListener('click', function (e) {
            e.preventDefault(); // On bloque la soumission du formulaire


            // On vérifie si le formulaire est vide
            if (nom.validity.valueMissing || prenom.validity.valueMissing || Canvas.canvasElmt === false) {
                e.preventDefault();
                alert('Veuillez remplir tous les champs');
            } else {
                // On gère à nouveau la présence du message informatif 
                document.getElementById('mess-timer').textContent = "Votre vélo est disponible à cette adresse : " + sessionStorage.getItem('station') + " durant ";
                document.getElementById('annuler').style.display = 'inline-block';
                document.getElementById('mess-info').style.display = 'block';
                document.getElementById('reset').style.display = 'none';
                Sauvegarde.timer();

                // Sauvegarde du nom et prénom sous forme d'objet dans le localStorage
                if (typeof localStorage != 'undefined' && JSON) {
                    const coordonnees = {
                        nom: document.getElementById('first-name').value,
                        prenom: document.getElementById('name').value,
                    };
                    localStorage.setItem('coord', JSON.stringify(coordonnees));
                } else {
                    alert("localStorage n'est pas supporté");
                }
            }
        });
        
        // Gestion de la fermeture du navigateur
        if (localStorage.getItem('coord')) {
            // On enregistre le nom et prénom dans les inputs attitrés
            const objCoords = localStorage.getItem('coord');
            const coordsJson = JSON.parse(objCoords);
            nom.value = coordsJson.nom;
            prenom.value = coordsJson.prenom;
        }
    },

    // Fonction du bouton "annuler"
    annuler: function () {
        document.getElementById('annuler').addEventListener('click', function () {
            localStorage.clear();
            sessionStorage.clear();
            alert("Votre réservation est annulée.");
            document.getElementById('mess-info').style.display = 'none';
        });
    }
}
Sauvegarde.init();