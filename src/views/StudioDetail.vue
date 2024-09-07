<template >
  <div class="full-width-container"  v-if="studio" :class="{ 'dark-mode': isDarkMode }">
    <nav class="navbar">
      <div class="logo">
        <img src="../assets/logo.png" alt="Wherecord Logo">
        <span>WHERECORD</span>
      </div>
      <a href="tel:+32485059254" class="phone-button">
        <i class="fas fa-phone-alt"></i>
        <span class="phone-number">+32 485 05 92 54</span>
      </a>
    </nav>
    <button @click="goBack" class="back-button">
      ⬅ㅤREVENIR
    </button> 
    <div class="content-container">
      <div class="studio-detail">
        <div class="theme-toggle-wrapper">
          <button @click="toggleTheme" class="theme-toggle" :class="{ 'dark': isDarkMode }">
            <span class="toggle-track">
              <span class="toggle-icon sun">☀</span>
              <span class="toggle-icon moon">☾</span>
            </span>
          </button>
        </div>

        <main>
          <div class="title-section">
            <h1>{{ studio.name }}</h1>
            <p>Prix : {{ studio.price }}€ / heure</p>
            <button @click="showReservationModal" class="reserve-button">Réserver</button>
          </div>

          <div class="image-gallery">
            <img v-for="(image, index) in studio.images" :key="index" :src="image" :alt="studio.name">
          </div>

          <div class="studio-info-and-booking">
            <div class="studio-info">
              <h2>{{ studio.name }} à {{ studio.address }}</h2>
              <p>{{ studio.description }}</p>
            </div>
          </div>
        </main>

        <div class="reservation-modal" v-if="showModal">
          <div class="modal-content">
            <span class="close-button" @click="closeReservationModal">&times;</span>
            <div v-if="reservationConfirmed">
              <div class="confirmation-icon"></div>
              <h2>Réservation confirmée</h2>
              <p class="confirmation-message">Votre paiement a été traité avec succès</p>
              <p class="confirmation-details">
                Nous vous enverrons votre reçu et les détails de votre réservation par e-mail.
                Vous recevrez ces informations dans les 24 heures. Si ce n'est pas le cas, veuillez nous contacter.
              </p>
              <p class="confirmation-details">
                Vous avez réservé : {{ studio.name }} - {{ formatDate(selectedDate) }}
              </p>
              <button @click="closeReservationModal" class="back-to-website-button">Retour au site</button>
            </div>
            <div v-else>
              <h2>Réservation pour {{ studio.name }}</h2>
              <div class="reservation-calendar">
                <div 
                  class="reservation-slot" 
                  :class="{ 'reserved': isDateReserved(date), 'selected': isDateSelected(date) }" 
                  v-for="date in getDates()" 
                  :key="date" 
                  @click="selectDate(date)"
                >
                  {{ formatDate(date) }}
                </div>
              </div>
              <div class="time-slots" v-if="selectedDate">
                <h3>Heure</h3>
                <div 
                  class="time-slot" 
                  v-for="timeSlot in getTimeSlots()" 
                  :key="timeSlot" 
                  :class="{ 'reserved': isTimeSlotReserved(selectedDate, timeSlot), 'selected': isTimeSlotSelected(timeSlot) }" 
                  @click="selectTimeSlot(timeSlot)"
                >
                  {{ formatTimeSlot(timeSlot) }}
                </div>
              </div>
              <div class="reservation-form" v-if="selectedTimeSlot">
                <h3>Durée</h3>
                <div class="time-slot-options">
                  <div 
                    class="time-slot-option" 
                    v-for="timeSlotOption in getTimeSlotOptions()" 
                    :key="timeSlotOption.duration" 
                    :class="{ 'selected': selectedDuration === timeSlotOption.duration }" 
                    @click="selectDuration(timeSlotOption.duration)"
                  >
                    {{ timeSlotOption.label }}
                  </div>
                </div>
                <input 
                  type="email" 
                  v-model="email" 
                  placeholder="Entrez votre email" 
                  required
                >
                <div v-if="!isValidEmail" class="error-message">
                  Veuillez saisir une adresse email valide.
                </div>
                <button @click="confirmReservation" class="confirm-reservation-button">Valider la réservation</button>
                <div v-if="showAlert" class="alert-message">
                  Veuillez saisir une adresse email.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <footer>
      <div class="footer-content">
        <div class="footer-section">
          <h3>Contact</h3>
          <ul id="provinces-ul">
            <li><a href="#">wherecord@gmail.com</a></li>
            <li><a href="#">Place de la libération 28, 4020 Liège</a></li>
            <li><a href="#">Belgium</a></li>
          </ul>
        </div>
        <div class="footer-section footer-right">
          <h3>Socials</h3>
          <ul>
            <li><a href="#">LinkedIn</a></li>
          </ul>
        </div>
      </div>
      <div class="footer-bottom">
        <div class="footer-logo">
          <span>WHERECORD</span>
        </div>
        <div class="footer-links">
          <a href="#">Retour ↑</a>
          <a href="tel:+32485059254" class="phone-button">
            <i class="fas fa-phone-alt"></i>
            <span class="phone-number">+32 485 05 92 54</span>
          </a>
        </div>
      </div>
    </footer>
  </div>
</template>

  <script>
  export default {
    props: ['provinceName', 'studioId'],
    data() {
      return {
        showModal: false,
        studio: null,
        selectedDate: null,
        selectedTimeSlot: null,
        selectedDuration: null,
        email: '',
        isValidEmail: true,
        showAlert: false,
        reservationConfirmed: false,
        reservedDates: {},
        isDarkMode: false
      }
    },
    created() {
  const { studioId, provinceName } = this.$route.params;
  if (studioId && provinceName) {
    this.fetchStudioDetails(studioId, provinceName);
    this.loadReservations();
  } else {
    console.error('Missing required parameters');
    // Rediriger vers une page d'erreur ou la page principale
  }
},
    methods: {
      fetchStudioDetails(studioId, provinceName) {
        const allStudios = {
  bruxelles: [
    { id: 1, name: 'Studio Bruxelles Sound', description: 'Studio d\'enregistrement au cœur de Bruxelles.', address: '123 Rue de la Loi, 1000 Bruxelles', price: 55, imageUrl: 'https://picsum.photos/id/1/300/220' },
    { id: 2, name: 'Capital Music Lab', description: 'Espace créatif pour les musiciens de la capitale.', address: '45 Avenue Louise, 1050 Bruxelles', price: 60, imageUrl: 'https://picsum.photos/id/2/300/22' },
    { id: 3, name: 'Brussels Beat Box', description: 'Studio moderne avec équipement de pointe.', address: '78 Rue Neuve, 1000 Bruxelles', price: 65, imageUrl: 'https://picsum.photos/id/3/300/200' },
    { id: 4, name: 'Atomium Audio', description: 'Vue panoramique et acoustique exceptionnelle.', address: '1 Place de l\'Atomium, 1020 Bruxelles', price: 70, imageUrl: 'https://picsum.photos/id/4/300/200' },
    { id: 5, name: 'Grand Place Grooves', description: 'Au cœur de l\'histoire, proche de la Grand Place.', address: '10 Rue des Chapeliers, 1000 Bruxelles', price: 58, imageUrl: 'https://picsum.photos/id/5/300/200' },
    { id: 6, name: 'Sablon Sound Studio', description: 'Ambiance bohème dans le quartier du Sablon.', address: '22 Rue de la Régence, 1000 Bruxelles', price: 62, imageUrl: 'https://picsum.photos/id/6/300/200' },
    { id: 7, name: 'Marolles Music Maker', description: 'Studio authentique dans le quartier des Marolles.', address: '5 Place du Jeu de Balle, 1000 Bruxelles', price: 53, imageUrl: 'https://picsum.photos/id/7/300/200' },
  ],
  flandreㅤoccidentale: [
    { id: 1, name: 'Bruges Beats', description: 'Studio historique au cœur de Bruges.', address: '15 Markt, 8000 Bruges', price: 50, imageUrl: 'https://picsum.photos/id/8/300/200' },
    { id: 2, name: 'Ostend Ocean Sounds', description: 'Enregistrez avec vue sur mer.', address: '22 Albert I Promenade, 8400 Ostende', price: 55, imageUrl: 'https://picsum.photos/id/9/300/200' },
    { id: 3, name: 'Kortrijk Kreativ', description: 'Espace moderne pour artistes innovants.', address: '7 Grote Markt, 8500 Courtrai', price: 48, imageUrl: 'https://picsum.photos/id/10/300/200' },
    { id: 4, name: 'Ypres Echoes', description: 'Studio dans un bâtiment historique rénové.', address: '3 Grote Markt, 8900 Ypres', price: 52, imageUrl: 'https://picsum.photos/id/11/300/200' },
    { id: 5, name: 'Roeselare Rhythm', description: 'Équipement de pointe dans un cadre paisible.', address: '12 Botermarkt, 8800 Roulers', price: 47, imageUrl: 'https://picsum.photos/id/12/300/200' },
    { id: 6, name: 'Knokke Seaside Studio', description: 'Luxe et technologie près de la plage.', address: '8 Lippenslaan, 8300 Knokke-Heist', price: 65, imageUrl: 'https://picsum.photos/id/13/300/200' },
    { id: 7, name: 'Poperinge Pop Studio', description: 'Ambiance rurale pour sons authentiques.', address: '5 Grote Markt, 8970 Poperinge', price: 45, imageUrl: 'https://picsum.photos/id/14/300/200' },
  ],
  flandreㅤorientale: [
    { id: 1, name: 'Ghent Groove Factory', description: 'Studio moderne au cœur de Gand.', address: '20 Korenmarkt, 9000 Gand', price: 58, imageUrl: 'https://picsum.photos/id/15/300/200' },
    { id: 2, name: 'Sint-Niklaas Sound Lab', description: 'Espace créatif polyvalent.', address: '10 Grote Markt, 9100 Sint-Niklaas', price: 52, imageUrl: 'https://picsum.photos/id/16/300/200' },
    { id: 3, name: 'Aalst Audio Arena', description: 'Studio high-tech dans un bâtiment industriel rénové.', address: '5 Grote Markt, 9300 Alost', price: 50, imageUrl: 'https://picsum.photos/id/17/300/200' },
    { id: 4, name: 'Oudenaarde Old School', description: 'Charme ancien, équipement moderne.', address: '12 Markt, 9700 Audenarde', price: 48, imageUrl: 'https://picsum.photos/id/18/300/200' },
    { id: 5, name: 'Dendermonde Decibel', description: 'Studio spacieux avec acoustique remarquable.', address: '3 Grote Markt, 9200 Termonde', price: 53, imageUrl: 'https://picsum.photos/id/19/300/200' },
    { id: 6, name: 'Eeklo Echo Chamber', description: 'Petit studio intimiste avec grande qualité sonore.', address: '7 Markt, 9900 Eeklo', price: 45, imageUrl: 'https://picsum.photos/id/20/300/200' },
    { id: 7, name: 'Lokeren Loft', description: 'Studio moderne dans un loft industriel.', address: '15 Grote Markt, 9160 Lokeren', price: 51, imageUrl: 'https://picsum.photos/id/21/300/200' },
  ],
  anvers: [
    { id: 1, name: 'Antwerp Audio Atelier', description: 'Studio haut de gamme en plein centre.', address: '25 Groenplaats, 2000 Anvers', price: 65, imageUrl: 'https://picsum.photos/id/22/300/200' },
    { id: 2, name: 'Mechelen Music Mill', description: 'Ancien moulin transformé en studio créatif.', address: '10 Grote Markt, 2800 Malines', price: 55, imageUrl: 'https://picsum.photos/id/23/300/200' },
    { id: 3, name: 'Turnhout Tone Factory', description: 'Studio moderne avec équipement varié.', address: '5 Grote Markt, 2300 Turnhout', price: 50, imageUrl: 'https://picsum.photos/id/24/300/200' },
    { id: 4, name: 'Lier Loft Loops', description: 'Espace ouvert pour sessions dynamiques.', address: '8 Grote Markt, 2500 Lierre', price: 52, imageUrl: 'https://picsum.photos/id/25/300/200' },
    { id: 5, name: 'Mol Melody Maker', description: 'Studio familial avec ambiance chaleureuse.', address: '12 Markt, 2400 Mol', price: 48, imageUrl: 'https://picsum.photos/id/26/300/200' },
    { id: 6, name: 'Boom Bass Bunker', description: 'Studio souterrain spécialisé en musique électronique.', address: '3 Grote Markt, 2850 Boom', price: 58, imageUrl: 'https://picsum.photos/id/27/300/200' },
    { id: 7, name: 'Herentals Harmonic Hub', description: 'Studio polyvalent pour tous styles musicaux.', address: '7 Grote Markt, 2200 Herentals', price: 53, imageUrl: 'https://picsum.photos/id/28/300/200' },
  ],
  limbourg: [
    { id: 1, name: 'Hasselt Harmony House', description: 'Studio moderne au cœur de Hasselt.', address: '12 Grote Markt, 3500 Hasselt', price: 54, imageUrl: 'https://picsum.photos/id/29/300/200' },
    { id: 2, name: 'Genk Groove Gallery', description: 'Ancien bâtiment industriel reconverti en studio.', address: '8 Stadsplein, 3600 Genk', price: 52, imageUrl: 'https://picsum.photos/id/30/300/200' },
    { id: 3, name: 'Sint-Truiden Sound Sanctuary', description: 'Studio paisible dans un cadre verdoyant.', address: '5 Grote Markt, 3800 Saint-Trond', price: 50, imageUrl: 'https://picsum.photos/id/31/300/200' },
    { id: 4, name: 'Tongeren Time Capsule', description: 'Studio vintage avec équipement d\'époque et moderne.', address: '10 Grote Markt, 3700 Tongres', price: 55, imageUrl: 'https://picsum.photos/id/32/300/200' },
    { id: 5, name: 'Beringen Beat Bunker', description: 'Studio souterrain dans une ancienne mine.', address: '3 Koolmijnlaan, 3580 Beringen', price: 48, imageUrl: 'https://picsum.photos/id/33/300/200' },
    { id: 6, name: 'Lommel Loop Lab', description: 'Espace créatif axé sur la musique électronique.', address: '7 Dorp, 3920 Lommel', price: 51, imageUrl: 'https://picsum.photos/id/34/300/200' },
    { id: 7, name: 'Peer Pulse Studio', description: 'Studio moderne avec vue panoramique.', address: '9 Markt, 3990 Peer', price: 53, imageUrl: 'https://picsum.photos/id/35/300/200' },
  ],
  brabantㅤflamand: [
    { id: 1, name: 'Leuven Lyric Lab', description: 'Studio universitaire à la pointe de la technologie.', address: '15 Oude Markt, 3000 Louvain', price: 56, imageUrl: 'https://picsum.photos/id/36/300/200' },
    { id: 2, name: 'Vilvoorde Vinyl Vault', description: 'Studio rétro avec collection impressionnante de vinyles.', address: '10 Grote Markt, 1800 Vilvorde', price: 52, imageUrl: 'https://picsum.photos/id/37/300/200' },
    { id: 3, name: 'Tienen Treble Centre', description: 'Studio spécialisé dans les voix et instruments acoustiques.', address: '5 Grote Markt, 3300 Tirlemont', price: 50, imageUrl: 'https://picsum.photos/id/38/300/200' },
    { id: 4, name: 'Diest Digital Den', description: 'Studio high-tech pour productions modernes.', address: '8 Grote Markt, 3290 Diest', price: 54, imageUrl: 'https://picsum.photos/id/39/300/200' },
    { id: 5, name: 'Aarschot Audio Attic', description: 'Studio chaleureux sous les toits.', address: '12 Grote Markt, 3200 Aarschot', price: 48, imageUrl: 'https://picsum.photos/id/40/300/200' },
    { id: 6, name: 'Zaventem Zen Studio', description: 'Oasis de calme près de l\'aéroport.', address: '3 Stationsstraat, 1930 Zaventem', price: 58, imageUrl: 'https://picsum.photos/id/41/300/200' },
    { id: 7, name: 'Overijse Overtone', description: 'Studio dans un cadre verdoyant.', address: '7 Justus Lipsiusplein, 3090 Overijse', price: 53, imageUrl: 'https://picsum.photos/id/42/300/200' },
  ],
  brabantㅤwallon: [
    { id: 1, name: 'Leuven Lyric Lab', description: 'Studio universitaire à la pointe de la technologie.', address: '15 Oude Markt, 3000 Louvain', price: 56, imageUrl: 'https://picsum.photos/id/36/300/200' },
    { id: 2, name: 'Vilvoorde Vinyl Vault', description: 'Studio rétro avec collection impressionnante de vinyles.', address: '10 Grote Markt, 1800 Vilvorde', price: 52, imageUrl: 'https://picsum.photos/id/37/300/200' },
    { id: 3, name: 'Tienen Treble Centre', description: 'Studio spécialisé dans les voix et instruments acoustiques.', address: '5 Grote Markt, 3300 Tirlemont', price: 50, imageUrl: 'https://picsum.photos/id/38/300/200' },
    { id: 4, name: 'Diest Digital Den', description: 'Studio high-tech pour productions modernes.', address: '8 Grote Markt, 3290 Diest', price: 54, imageUrl: 'https://picsum.photos/id/39/300/200' },
    { id: 5, name: 'Aarschot Audio Attic', description: 'Studio chaleureux sous les toits.', address: '12 Grote Markt, 3200 Aarschot', price: 48, imageUrl: 'https://picsum.photos/id/40/300/200' },
    { id: 6, name: 'Zaventem Zen Studio', description: 'Oasis de calme près de l\'aéroport.', address: '3 Stationsstraat, 1930 Zaventem', price: 58, imageUrl: 'https://picsum.photos/id/41/300/200' },
    { id: 7, name: 'Overijse Overtone', description: 'Studio dans un cadre verdoyant.', address: '7 Justus Lipsiusplein, 3090 Overijse', price: 53, imageUrl: 'https://picsum.photos/id/42/300/200' },
  ],
  namur: [
    { id: 1, name: 'Namur Noise Lab', description: 'Studio moderne surplombant la Meuse.', address: '20 Rue de Fer, 5000 Namur', price: 52, imageUrl: 'https://picsum.photos/id/43/300/200' },
    { id: 2, name: 'Dinant Decibel Den', description: 'Studio dans les rochers de la Meuse.', address: '8 Rue Grande, 5500 Dinant', price: 50, imageUrl: 'https://picsum.photos/id/44/300/200' },
    { id: 3, name: 'Sambreville Sound Shack', description: 'Studio convivial dans un ancien hangar.', address: '5 Rue du Centre, 5060 Sambreville', price: 48, imageUrl: 'https://picsum.photos/id/45/300/200' },
    { id: 4, name: 'Andenne Audio Atelier', description: 'Espace créatif dans un bâtiment Art Nouveau.', address: '12 Rue du Commerce, 5300 Andenne', price: 51, imageUrl: 'https://picsum.photos/id/46/300/200' },
    { id: 5, name: 'Gembloux Groove Garden', description: 'Studio dans un parc avec possibilité d\'enregistrement extérieur.', address: '3 Rue Notre-Dame, 5030 Gembloux', price: 53, imageUrl: 'https://picsum.photos/id/47/300/200' },
    { id: 6, name: 'Ciney Creative Corner', description: 'Petit studio chaleureux au cœur du Condroz.', address: '7 Rue du Centre, 5590 Ciney', price: 47, imageUrl: 'https://picsum.photos/id/48/300/200' },
      ],
      hainaut: [
    { id: 1, name: 'Mons Melody Mansion', description: 'Studio historique au cœur de Mons.', address: '15 Grand-Place, 7000 Mons', price: 54, imageUrl: 'https://picsum.photos/id/50/300/200' },
    { id: 2, name: 'Charleroi Chord Chamber', description: 'Studio moderne dans un ancien bâtiment industriel.', address: '22 Boulevard Tirou, 6000 Charleroi', price: 52, imageUrl: 'https://picsum.photos/id/51/300/200' },
    { id: 3, name: 'Tournai Tune Tower', description: 'Studio avec vue panoramique sur la ville.', address: '7 Grand-Place, 7500 Tournai', price: 53, imageUrl: 'https://picsum.photos/id/52/300/200' },
    { id: 4, name: 'La Louvière Lyric Lab', description: 'Espace créatif dans un ancien site minier.', address: '10 Place Communale, 7100 La Louvière', price: 50, imageUrl: 'https://picsum.photos/id/53/300/200' },
    { id: 5, name: 'Mouscron Music Mill', description: 'Studio convivial près de la frontière française.', address: '5 Grand-Place, 7700 Mouscron', price: 48, imageUrl: 'https://picsum.photos/id/54/300/200' },
    { id: 6, name: 'Soignies Sound Sanctuary', description: 'Studio paisible dans un ancien monastère.', address: '12 Rue de la Station, 7060 Soignies', price: 51, imageUrl: 'https://picsum.photos/id/55/300/200' },
    { id: 7, name: 'Ath Audio Atelier', description: 'Studio polyvalent au cœur de la cité des géants.', address: '8 Rue de Pintamont, 7800 Ath', price: 49, imageUrl: 'https://picsum.photos/id/56/300/200' },
  ],
  liege: [
    { id: 1, name: 'Liège Lyric Loft', description: 'Studio spacieux avec vue sur la Meuse.', address: '30 Rue de la Cathédrale, 4000 Liège', price: 58, imageUrl: 'https://picsum.photos/id/57/300/200' },
    { id: 2, name: 'Verviers Vibration Valley', description: 'Studio accueillant dans les collines.', address: '5 Rue du Centre, 4800 Verviers', price: 50, imageUrl: 'https://picsum.photos/id/58/300/200' },
    { id: 3, name: 'Seraing Sound Station', description: 'Studio moderne dans un ancien complexe sidérurgique.', address: '15 Place Communale, 4100 Seraing', price: 52, imageUrl: 'https://picsum.photos/id/59/300/200' },
    { id: 4, name: 'Herstal Harmony Hub', description: 'Espace d\'enregistrement près des usines FN.', address: '20 Place Jean Jaurès, 4040 Herstal', price: 51, imageUrl: 'https://picsum.photos/id/60/300/200' },
    { id: 5, name: 'Eupen Echo Ensemble', description: 'Studio bilingue dans la communauté germanophone.', address: '8 Stadtplatz, 4700 Eupen', price: 53, imageUrl: 'https://picsum.photos/id/61/300/200' },
    { id: 6, name: 'Huy Hillside Hymns', description: 'Studio avec vue sur le Hoyoux et la citadelle.', address: '12 Grand-Place, 4500 Huy', price: 49, imageUrl: 'https://picsum.photos/id/62/300/200' },
    { id: 7, name: 'Waremme Wave Workshop', description: 'Studio intime au cœur de la Hesbaye.', address: '6 Rue de Huy, 4300 Waremme', price: 47, imageUrl: 'https://picsum.photos/id/63/300/200' },
  ],
  luxembourg: [
    { id: 1, name: 'Luxembourg Lyric Loft', description: 'Studio spacieux avec vue sur la Meuse.', address: '30 Rue de la Cathédrale, 4000 Liège', price: 58, imageUrl: 'https://picsum.photos/id/57/300/200' },
    { id: 2, name: 'Arlong Vibration Valley', description: 'Studio accueillant dans les collines.', address: '5 Rue du Centre, 4800 Verviers', price: 50, imageUrl: 'https://picsum.photos/id/58/300/200' },
    { id: 3, name: 'Duni Sound Station', description: 'Studio moderne dans un ancien complexe sidérurgique.', address: '15 Place Communale, 4100 Seraing', price: 52, imageUrl: 'https://picsum.photos/id/59/300/200' },
    { id: 4, name: 'Albert Harmony Hub', description: 'Espace d\'enregistrement près des usines FN.', address: '20 Place Jean Jaurès, 4040 Herstal', price: 51, imageUrl: 'https://picsum.photos/id/60/300/200' },
    { id: 5, name: 'Ziop Echo Ensemble', description: 'Studio bilingue dans la communauté germanophone.', address: '8 Stadtplatz, 4700 Eupen', price: 53, imageUrl: 'https://picsum.photos/id/61/300/200' },
    { id: 6, name: 'Nabert Hillside Hymns', description: 'Studio avec vue sur le Hoyoux et la citadelle.', address: '12 Grand-Place, 4500 Huy', price: 49, imageUrl: 'https://picsum.photos/id/62/300/200' },
    { id: 7, name: 'Wame Workshop', description: 'Studio intime au cœur de la Hesbaye.', address: '6 Rue de Huy, 4300 Waremme', price: 47, imageUrl: 'https://picsum.photos/id/63/300/200' },
  ],
      }
        this.studio = {
          id: studioId,
          name: 'Studio Example',
          description: 'Un studio d\'enregistrement de qualité professionnelle.',
          price: 50,
          address: '123 Rue de la Musique, 75000 Paris',
          images: [
            'https://picsum.photos/id/1/500/300',
            'https://picsum.photos/id/2/500/300',
            'https://picsum.photos/id/3/500/300',
          ],
        };  
        const provinceStudios = allStudios[provinceName.toLowerCase()] || []
        const studio = provinceStudios.find(s => s.id === parseInt(studioId));

if (studio) {
  this.studio = {
    ...studio,
    images: [studio.imageUrl, 'https://picsum.photos/id/2/500/300', 'https://picsum.photos/id/3/500/300'],
  };
} else {
  console.error('Studio not found');
}
},
      loadReservations() {
        // Chargez les réservations depuis le localStorage ou une API
        this.reservedDates = JSON.parse(localStorage.getItem('reservations')) || {};
      },
      getDates() {
        const dates = [];
        for (let i = 0; i < 10; i++) {
          const date = new Date();
          date.setDate(date.getDate() + i);
          dates.push(date.getTime());
        }
        return dates;
      },
      formatDate(timestamp) {
        const date = new Date(timestamp);
        return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
      },
      isDateReserved(date) {
        const dateString = this.formatDate(date);
        return Object.keys(this.reservedDates).some(key => key.startsWith(dateString) && this.reservedDates[key].studioId === this.studio.id);
      },
      isDateSelected(date) {
        return this.selectedDate === date;
      },
      selectDate(date) {
        this.selectedDate = date;
        this.selectedTimeSlot = null;
        this.selectedDuration = null;
      },
      getTimeSlots() {
        const timeSlots = [];
        for (let i = 9; i <= 18; i++) {
          timeSlots.push(i);
        }
        return timeSlots;
      },
   
      toggleTheme() {
      this.isDarkMode = !this.isDarkMode;
    },

    showReservationModal() {
      this.showModal = true;
    },

    closeReservationModal() {
      this.showModal = false;
      this.selectedDate = null;
      this.selectedTimeSlot = null;
      this.selectedDuration = null;
      this.email = '';
      this.reservationConfirmed = false;
    },
    goBack() {
    this.$router.go(-1); // Ceci ramènera l'utilisateur à la page précédente
  },
      formatTimeSlot(timeSlot) {
        return `${timeSlot}:00`;
      },
      isTimeSlotReserved(date, timeSlot) {
        const key = `${this.formatDate(date)}-${timeSlot}`;
        return this.reservedDates[key] && this.reservedDates[key].studioId === this.studio.id;
      },
      isTimeSlotSelected(timeSlot) {
        return this.selectedTimeSlot === timeSlot;
      },
      selectTimeSlot(timeSlot) {
        this.selectedTimeSlot = timeSlot;
        this.selectedDuration = null;
      },
      getTimeSlotOptions() {
        return [
          { duration: 1, label: '1 heure - ' + this.studio.price + '€' },
          { duration: 2, label: '2 heures - ' + (this.studio.price * 1.8) + '€' },
          { duration: 3, label: '3 heures - ' + (this.studio.price * 2.6) + '€' }
        ];
      },
      selectDuration(duration) {
        this.selectedDuration = duration;
      },
      validateEmail() {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        this.isValidEmail = emailRegex.test(this.email);
      },
      confirmReservation() {
        if (!this.email) {
          this.showAlert = true;
          return;
        }
        this.validateEmail();
        if (!this.isValidEmail) {
          return;
        }
        
        const dateString = this.formatDate(this.selectedDate);
        for (let i = this.selectedTimeSlot; i < this.selectedTimeSlot + this.selectedDuration; i++) {
          const key = `${dateString}-${i}`;
          this.reservedDates[key] = {
            studioId: this.studio.id,
            duration: this.selectedDuration,
            email: this.email
          };
        }
        
        this.saveReservations();
        this.reservationConfirmed = true;
      },
      saveReservations() {
        localStorage.setItem('reservations', JSON.stringify(this.reservedDates));
      },
      closeConfirmation() {
        this.reservationConfirmed = false;
        this.$router.push('/'); // Redirige vers la page d'accueil
      }
    },
    watch: {
      email() {
        this.validateEmail();
        this.showAlert = false;
      }
    }
  }
  </script>
  
  <style scoped>
  @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@400;700&display=swap');

  .studio-detail {
    font-family: 'Montserrat', sans-serif;
    min-height: 100vh;
    display: flex;
    flex-direction: column;
  }
  input[type="email"] {
  padding: 15px;
  border: 2px solid #dfe4ea;
  border-radius: 25px;
  font-size: 16px;
  width: 100%;
  box-sizing: border-box;
  margin-bottom: 15px;
}

input[type="email"]:focus {
  border-color: #e74c3c;
  outline: none;
  box-shadow: 0 0 0 3px rgba(231, 76, 60, 0.2);
}

.confirm-reservation-button {
  padding: 15px 30px;
  background-color: #e74c3c;
  color: white;
  border: none;
  border-radius: 25px;
  cursor: pointer;
  font-size: 16px;
  font-weight: bold;
  transition: background-color 0.3s ease;
  width: 100%;
}
.back-to-website-button{
  padding: 15px 30px;
  background-color: #e74c3c;
  color: white;
  border: none;
  border-radius: 25px;
  cursor: pointer;
  font-size: 16px;
  font-weight: bold;
  transition: background-color 0.3s ease;
  width: 100%;
}
.confirm-reservation-button:hover {
  background-color: #c0392b;
}

.error-message,
.alert-message {
  color: #e74c3c;
  font-size: 14px;
  margin-top: 5px;
}

  .navbar {
  z-index: 4;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 2rem 2rem;
  background-color: #ffffff;
  box-shadow: 0 2px 15px rgba(0,0,0,0.3);
}
  main {
    flex: 1;
    padding: 2rem;
  }
  
  .studio-images {
    display: flex;
    overflow-x: auto;
    gap: 1rem;
    margin-bottom: 2rem;
  }
  
  .studio-images img {
    width: 500px;
    height: 300px;
    object-fit: cover;
    border-radius: 10px;
  }
  
  .studio-info {
    margin-bottom: 2rem;
  }
  
  .reservation-section {
    background-color: #f5f5f5;
    padding: 2rem;
    border-radius: 10px;
  }
  
  .reservation-calendar,
  .time-slots,
  .time-slot-options {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
    gap: 1rem;
    margin-bottom: 1rem;
  }
  
  .reservation-slot,
  .time-slot,
  .time-slot-option {
    padding: 0.5rem;
    text-align: center;
    background-color: #e0e0e0;
    border-radius: 5px;
    cursor: pointer;
  }
  
  .reservation-slot.reserved,
  .time-slot.reserved {
    background-color: #ff9999;
    cursor: not-allowed;
  }
  
  .reservation-slot.selected,
  .time-slot.selected,
  .time-slot-option.selected {
    background-color: #ef3838;
    color: white;
  }
  
  .confirmation-modal {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
  }
  
  .modal-content {
    background-color: white;
    padding: 2rem;
    border-radius: 10px;
    text-align: center;
  }
  
  .studio-detail {
  font-family: 'Circular', -apple-system, BlinkMacSystemFont, Roboto, Helvetica Neue, sans-serif;
  max-width: 1120px;
  margin: 0 auto;
  padding: 24px;
}

header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.logo {
  height: 32px;
}

.title-section {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.image-gallery {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  grid-gap: 8px;
  border-radius: 12px;
  overflow: hidden;
  position: relative;
}

.image-gallery img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.image-gallery img:first-child {
  grid-column: span 2;
  grid-row: span 2;
}

.show-all-photos {
  position: absolute;
  bottom: 24px;
  right: 24px;
  background-color: white;
  border: 1px solid #222;
  border-radius: 8px;
  padding: 8px 16px;
  cursor: pointer;
}

.studio-info-and-booking {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 80px;
  margin-top: 48px;
}

.booking-system {
  border: 1px solid #ddd;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 6px 16px rgba(0,0,0,0.12);
}
.studio-detail {
  font-family: 'Montserrat', sans-serif;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  width: 100%;
}

.navbar {
  z-index: 4;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 2rem 2rem;
  background-color: #ffffff;
  box-shadow: 0 2px 15px rgba(0,0,0,0.3);
}

.logo {
  display: flex;
  align-items: center;
}

.logo img {
  height: 40px;
  margin-right: 10px;
}

.logo span {
  font-size: 1.5rem;
  font-weight: 700;
  color: #2c3e50;
  letter-spacing: 1px;
}

.phone-button {
  display: flex;
  align-items: center;
  margin-right: 5em;
  justify-content: center;
  padding: 0.5rem;
  background-color: #e74c3c;
  color: white;
  text-decoration: none;
  border-radius: 25px;
  font-size: 1rem;
  font-weight: 600;
  transition: all 0.5s ease;
  box-shadow: 0 2px 10px rgba(231, 76, 60, 0.3);
  overflow: hidden;
  width: 2.5rem;
  height: 2.5rem;
}

.phone-button:hover {
  width: auto;
  padding-right: 1rem;
}

.phone-button i {
  margin-right: 0;
  transition: margin-right 0.5s ease;
}

.phone-button:hover i {
  margin-right: 0.5rem;
}

.phone-number {
  white-space: nowrap;
  opacity: 0;
  max-width: 0;
}

.phone-button:hover .phone-number {
  opacity: 1;
  max-width: 200px;
  transition: opacity 0.5s ease, max-width 0.5s ease;
}

main {
  flex: 1;
  padding: 3rem 2rem;
}

footer {
  background-color: rgb(70,70,70);
  color: #fff;
  padding: 2rem;
  margin-top: auto;
}

.footer-content {
  display: flex;
  justify-content: space-between;
  margin-top: 1.3em;
  margin-bottom: 4rem;
  margin-right: 4em;
}

.footer-section h3 {
  font-size: 1rem;
  margin-bottom: 1rem;
  text-align: left;
}

.footer-section ul {
  list-style-type: none;
  padding: 0;
}

.footer-section ul li {
  margin-bottom: 0.5rem;
}

.footer-section ul li a {
  color: #666;
  text-decoration: none;
  transition: color 0.3s ease;
}

.footer-section ul li a:hover {
  color: #fff;
}

.footer-right h3 {
  text-align: right;
}

.footer-right ul {
  text-align: right;
}

.footer-bottom {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 2rem;
}

#provinces-ul {
  text-align: left;
}

.footer-logo {
  display: flex;
  scale: 3;
  margin-left: 15em;
  margin-bottom: 1em;
  align-items: center;
}

.footer-logo span {
  font-size: 2rem;
  font-weight: bold;
  margin-right: 1rem;
}

.footer-links {
  display: flex;
  align-items: center;
  gap: 2rem;
}

.footer-links a {
  color: #fff;
  text-decoration: none;
}

/* Styles pour le mode sombre */
.dark-mode {
  background-color: #333;
  color: #fff;
}

.dark-mode .navbar {
  background-color: #222;
  box-shadow: 0 2px 15px rgba(255,255,255,0.1);
}

.dark-mode .logo span {
  color: #fff;
}

.dark-mode .phone-button {
  background-color: #ff7e7e;
  box-shadow: 0 2px 10px rgba(255, 126, 126, 0.3);
}

.dark-mode .phone-button:hover {
  background-color: #e74c3c;
}

.dark-mode footer {
  background-color: #222;
}

.dark-mode .footer-section ul li a {
  color: #999;
}

.dark-mode .footer-section ul li a:hover {
  color: #fff;
}

/* Styles responsives */
@media (max-width: 768px) {
  .navbar {
    padding: 1rem;
  }

  .footer-content {
    flex-direction: column;
  }

  .footer-section {
    margin-bottom: 2rem;
  }

  .footer-right h3,
  .footer-right ul {
    text-align: left;
  }

  .footer-bottom {
    flex-direction: column;
    align-items: center;
  }

  .footer-logo {
    margin-left: 0;
    margin-bottom: 1rem;
  }

  .footer-links {
    flex-direction: column;
    align-items: center;
  }
}

@media (max-width: 480px) {
  .navbar {
    padding: 0.5rem;
  }

  .logo img {
    height: 30px;
  }

  .logo span {
    font-size: 1.2rem;
  }

  .footer {
    padding: 1rem;
  }

  .footer-logo {
    scale: 2;
  }
}

.theme-toggle-wrapper {
  position: absolute;
  top: 8em;
  right: 2.8em;
  scale: 1.5;
  z-index: 1000;
}

.theme-toggle {
  background-color: #f0f0f0;
  border: none;
  border-radius: 30px;
  cursor: pointer;
  display: flex;
  align-items: center;
  padding: 2px;
  position: relative;
  width: 60px;
  height: 30px;
  transition: background-color 0.3s ease;
}

.theme-toggle.dark {
  background-color: #333;
}

.toggle-track {
  position: absolute;
  top: 2px;
  left: 2px;
  width: 26px;
  height: 26px;
  background-color: white;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  transition: transform 0.3s ease;
}

.theme-toggle.dark .toggle-track {
  transform: translateX(30px);
}

.toggle-icon {
  font-size: 16px;
  line-height: 1;
}

.toggle-icon.sun {
  display: block;
  color: #E74B3B;
}

.toggle-icon.moon {
  display: none;
  color: #E74B3B;
}

.theme-toggle.dark .toggle-icon.sun {
  display: none;
}

.theme-toggle.dark .toggle-icon.moon {
  display: block;
}

/* Styles pour le modal de réservation */
.reservation-modal {
  position: fixed;
  z-index: 1000;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
}

.modal-content {
  background-color: #fff;
  padding: 2rem;
  border-radius: 10px;
  max-width: 500px;
  width: 100%;
}

/* Autres styles pour le modal... */

@media (max-width: 768px) {
  .theme-toggle-wrapper {
    left: 6em;
    top: 6em;
    position: fixed;
  }
}
.reservation-modal {
  display: flex;
  align-items: center;
  justify-content: center;
  position: fixed;
  z-index: 1000;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  overflow: auto;
}

.modal-content {
  background-color: #ffffff;
  padding: 30px;
  border-radius: 15px;
  max-width: 400px;
  width: 100%;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
  position: relative;
}

.close-button {
  position: absolute;
  top: 15px;
  right: 15px;
  color: #747d8c;
  font-size: 28px;
  font-weight: bold;
  cursor: pointer;
  transition: color 0.3s ease;
}

.close-button:hover {
  color: #2f3542;
}

.confirmation-icon {
  width: 80px;
  height: 80px;
  background-color: #5cd6b3;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 0 auto 20px;
}

.confirmation-icon::after {
  content: '✓';
  font-size: 40px;
  color: white;
}

.confirmation-message {
  color: #2f3542;
  font-size: 18px;
  margin-bottom: 20px;
}

.confirmation-details {
  color: #747d8c;
  font-size: 14px;
  margin-bottom: 30px;
}

.studio-detail {
  max-width: 1120px;
  margin: 0 auto;
  padding: 24px;
}
.full-width-container {
  width: 100%;
}

.navbar, footer {
  width: 100%;
}

.studio-detail {
  max-width: 1120px;
  margin: 0 auto;
  padding: 24px;
}
.full-width-container {
  width: 100%;
}

.navbar, footer {
  width: 100%;
}

.studio-detail {
  max-width: 1120px;
  margin: 0 auto;
  padding: 24px;
}

.full-width-container {
  width: 100%;
}

.content-container {
  max-width: 1120px;
  margin: 0 auto;
  padding: 24px;
}

.navbar, footer {
  width: 100%;
}

.reserve-button {
  background-color: #e74c3c;
  color: white;
  border: none;
  border-radius: 25px;
  padding: 12px 24px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.3s ease, transform 0.2s ease;
  box-shadow: 0 2px 10px rgba(231, 76, 60, 0.3);
}

.reserve-button:hover {
  background-color: #c0392b;
  transform: translateY(-2px);
}

.reserve-button:active {
  transform: translateY(0);
}

/* Style pour le mode sombre */
.dark-mode .reserve-button {
  background-color: #ff7e7e;
  box-shadow: 0 2px 10px rgba(255, 126, 126, 0.3);
}

.dark-mode .reserve-button:hover {
  background-color: #e74c3c;
}
/* Existing styles... */

/* Responsive styles */
@media (max-width: 1200px) {
  .content-container {
    padding: 16px;
  }

  .studio-info-and-booking {
    grid-template-columns: 1fr;
    gap: 40px;
  }
}

@media (max-width: 992px) {
  .image-gallery {
    grid-template-columns: repeat(2, 1fr);
  }

  .image-gallery img:first-child {
    grid-column: span 1;
    grid-row: span 1;
  }

  .title-section {
    flex-direction: column;
    align-items: flex-start;
  }

  .title-section h1 {
    margin-bottom: 10px;
  }

  .reserve-button {
    margin-top: 15px;
  }
}

@media (max-width: 768px) {
  .navbar {
    flex-direction: column;
    align-items: flex-start;
  }

  .phone-button {
    margin-top: 15px;
    margin-right: 0;
  }

  .theme-toggle-wrapper {
    top: 80px;
    right: 16px;
  }

  .footer-content {
    flex-direction: column;
    margin-right: 0;
  }

  .footer-section {
    margin-bottom: 30px;
  }

  .footer-right h3,
  .footer-right ul {
    text-align: left;
  }

  .footer-bottom {
    flex-direction: column;
    align-items: flex-start;
  }

  .footer-logo {
    margin-left: 0;
    margin-bottom: 20px;
  }

  .footer-links {
    flex-direction: column;
    align-items: flex-start;
    gap: 15px;
  }
}

@media (max-width: 576px) {
  .image-gallery {
    grid-template-columns: 1fr;
  }

  .modal-content {
    padding: 20px;
  }

  .reservation-calendar,
  .time-slots,
  .time-slot-options {
    grid-template-columns: repeat(auto-fill, minmax(80px, 1fr));
  }

  .reservation-slot,
  .time-slot,
  .time-slot-option {
    padding: 0.3rem;
    font-size: 14px;
  }
}

@media (max-width: 480px) {
  .navbar {
    padding: 1rem;
  }

  .logo img {
    height: 30px;
  }

  .logo span {
    font-size: 1.2rem;
  }

  .phone-button {
    font-size: 0.9rem;
  }

  .theme-toggle-wrapper {
    scale: 1.2;
    top: 70px;
  }

  main {
    padding: 1.5rem 1rem;
  }

  h1 {
    font-size: 1.5rem;
  }

  h2 {
    font-size: 1.3rem;
  }

  .reserve-button {
    padding: 10px 20px;
    font-size: 14px;
  }

  .footer {
    padding: 1.5rem 1rem;
  }

  .footer-logo {
    scale: 2;
  }
}
@media (max-width: 768px) {
  .navbar {
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    padding: 1rem;
  }

  .phone-button {
    display: none; /* Supprime le bouton téléphone */
  }



  .footer-logo span {
    font-size: 1rem; /* Réduit la taille du texte du logo dans le footer */
    scale: 0.5; /* Réduit l'échelle du logo dans le footer */
  }
 

  .theme-toggle-wrapper{
    margin-left: 14em;
    top: 1em;
   
  }



  .footer-logo span {
    scale: 1;
    margin-left: 2.2em;
  }
  main{
    margin-right: 3em;
  }
}
.back-button {
  position: absolute;
  top: 10em;
  left: 2em;
  padding: 0.75rem 1.5rem;
  background-color: #e74c3c;
  color: white;
  border: none;
  border-radius: 50px;
  font-size: 1rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(231, 76, 60, 0.3);
}

.back-button:hover {
  background-color: #c0392b;
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(231, 76, 60, 0.4);
}

.back-button i {
  margin-right: 0.5rem;
}

/* Ajustement pour le mode sombre */
.dark-mode .back-button {
  background-color: #ff7e7e;
  box-shadow: 0 4px 15px rgba(255, 126, 126, 0.3);
}

.dark-mode .back-button:hover {
  background-color: #e74c3c;
}


@media (max-width: 768px) {
  .back-button {
    top: 5em;
    left: 18em;
    font-size: 0.9rem;
    padding: 0.5rem 1rem;
  }
}
  </style>