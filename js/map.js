// Objet Map
const Carte = {
  boutonReserver: false,

  init: function () {
    this.afficher();
  },

  afficher: function () {
    // Affiche la carte sur le site  
    const Map = new L.map('map').setView([45.764043, 4.835659], 13);
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      minZoom: 1,
      maxZoom: 20
      }).addTo(Map);

    // Requête AJAX permettant de récupérer les informations de l'API JC Decaux  
    ajaxGet('https://api.jcdecaux.com/vls/v1/stations?contract=Lyon&apiKey=b40d40d793c892f0901088a21e0a1c167aab814e', function (reponse) {
      // On récupère les éléments du fichier JSON sous forme de tableau.  
      const infosVelo = JSON.parse(reponse);
      // On gère les cluster grâce à la fonction suivante de Leaflet
      const clusters = new L.MarkerClusterGroup();
      
      // Création d'une boucle permettant la récupération de certains éléments du fichier JSON
      infosVelo.forEach(info => {
        // Création des markers en récupérant les éléments dans le fichier JSON
        let marker = L.marker([info.position.lat, info.position.lng]);
        clusters.addLayer(marker); // On ajoute les markers au cluster
        // Gestion du marker "rouge"
        if (info.available_bikes === 0) {
          const redMarker = L.icon ({
            iconUrl: 'img/img-marker/marker-icon-2x-red.png', 
            shadowUrl: 'img/img-marker/marker-shadow.png',
            iconSize: [25, 41],
            iconAchor: [12, 41],
            popupAnchor: [1, -34],
            shadowSize: [41, 41]
          });
          marker = L.marker([info.position.lat, info.position.lng], {icon: redMarker}).addTo(clusters);
        // Gestion du marker "noir"
        } else if (info.status === 'CLOSE') {
          const blackMarker = L.icon ({
            iconUrl: 'img/img-marker/marker-icon-2x-black.png', 
            shadowUrl: 'img/img-marker/marker-shadow.png',
            iconSize: [25, 41],
            iconAchor: [12, 41],
            popupAnchor: [1, -34],
            shadowSize: [41, 41]
          });
          marker = L.marker([info.position.lat, info.position.lng], {icon: blackMarker}).addTo(clusters);
        }
  
        // Gestion du clic sur le marker
        marker.addEventListener('click', function () {
          // Nom de la station
          const nom = document.getElementById('name-data');
          nom.innerHTML = info.name;
          // Adresse de la station 
          const adresse = document.getElementById('address-data');
          adresse.innerHTML = info.address;
          // Statut actuel de la station 
          const statut = document.getElementById('statut-data');
          statut.innerHTML = info.status;
          // Disponibilité des vélos
          const veloDispo = document.getElementById('velo-data');
          veloDispo.innerHTML = info.available_bikes;

          // Gestion du bouton "Réservez" : 
          if (info.status === 'OPEN' && info.available_bikes >= 1) {
            this.boutonReserver = true;
          }

          if (this.boutonReserver === true) {
            document.getElementById('reserve').addEventListener('click', function () {
              sessionStorage.setItem('station', info.address); // On enregistre la station dans le session Storage
              document.getElementById('container-canvas').style.display = 'block';
              document.getElementById('mess-info').style.display = 'block';
            });
          } else {
            alert('Veuillez sélectionner une station ouverte et contenant des vélos.');
            document.getElementById('container-canvas').style.display = 'none';
          }
        });

      });
      Map.addLayer(clusters); // Ajout des clusters à la carte
    });
    
  }
    
}
Carte.init();
