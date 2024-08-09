<template>
    <div class="province">
      <h1>{{ provinceName }}</h1>
      <button @click="goBack" class="back-button">
    <i class="arrow-left"></i> Revenir à la carte</button>

      <div class="filters">
        <input v-model="searchQuery" placeholder="Rechercher un studio" class="search-bar">
        <button @click="toggleSortOrder" class="sort-button">
          Trier {{ sortOrder === 'asc' ? '↓' : '↑' }}
        </button>
      </div>
      <div class="studio-list-container" @scroll="handleScroll">
        <div class="studio-list">
          <div class="studio" v-for="studio in displayedStudios" :key="studio.id">
            <img :src="getRandomImage()" alt="Studio Image">
            <div class="studio-info">
              <h3>{{ studio.name }}</h3>
              <p>{{ studio.description }}</p>
              <p>{{ studio.address }}</p>
              <button @click="showReservationModal(studio.id)">Réserver</button>
            </div>
          </div>
        </div>
        <div v-if="isLoading" class="loading-indicator">
          <div class="spinner"></div>
        </div>
      </div>
      <div class="reservation-modal" v-if="showModal">
        <div class="modal-content">
          <span class="close-button" @click="closeReservationModal">&times;</span>
          <h2>Calendrier de réservation pour le studio {{ selectedStudio.name }}</h2>
          <div class="reservation-calendar">
            <div class="reservation-slot" :class="{ 'reserved': isDateReserved(date) }" v-for="date in getDates()" :key="date" @click="selectDate(date)">
              {{ formatDate(date) }}
            </div>
          </div>
          <div class="time-slots" v-if="selectedDate">
            <h3>Plages horaires disponibles</h3>
            <div class="time-slot" v-for="timeSlot in getTimeSlots()" :key="timeSlot" :class="{ 'reserved': isTimeSlotReserved(selectedDate, timeSlot) }" @click="selectTimeSlot(timeSlot)">
              {{ formatTimeSlot(timeSlot) }}
            </div>
          </div>
          <div class="reservation-form" v-if="selectedTimeSlot">
            <h3>Réservation</h3>
            <div class="time-slot-options">
              <div class="time-slot-option" v-for="timeSlotOption in getTimeSlotOptions()" :key="timeSlotOption.duration" :class="{ 'selected': selectedDuration === timeSlotOption.duration }" @click="selectDuration(timeSlotOption.duration)">
                {{ timeSlotOption.label }}
              </div>
            </div>
            <input type="email" v-model="email" placeholder="Entrez votre email" required>
            <div v-if="!isValidEmail" class="error-message">Veuillez saisir une adresse email valide.</div>
            <button @click="confirmReservation">Valider</button>
            <div v-if="showAlert" class="alert-message">Veuillez saisir une adresse email.</div>
            <div v-if="showConfirmation" class="confirmation-message">{{ confirmationMessage }}</div>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        provinceName: '',
        studios: [],
        showModal: false,
        selectedStudio: null,
        selectedDate: null,
        selectedTimeSlot: null,
        selectedDuration: null,
        email: '',
        showConfirmation: false,
        showError: false,
        reservedDates: {},
        timeSlotsData: [
          { duration: 1, price: 50 },
          { duration: 2, price: 90 },
          { duration: 3, price: 130 }
        ],
        confirmationMessage: '',
        isValidEmail: true,
        showAlert: false,
        searchQuery: '',
        sortOrder: 'asc',
        displayedStudios: [],
        isLoading: false,
        page: 1,
        itemsPerPage: 5
      }
    },
    created() {
      const provinceId = this.$route.params.id;
      this.provinceName = provinceId.charAt(0).toUpperCase() + provinceId.slice(1);
      this.loadReservations();
      this.loadStudios();
    },
    computed: {
      filteredAndSortedStudios() {
        let result = this.studios.filter(studio =>
          studio.name.toLowerCase().includes(this.searchQuery.toLowerCase())
        );
        
        result.sort((a, b) => {
          let comparison = a.name.localeCompare(b.name);
          return this.sortOrder === 'asc' ? comparison : -comparison;
        });
        
        return result;
      }
    },
    methods: {
      loadStudios() {
        const studiosByProvince = {
       bruxelles: [
         { id: 1, name: 'Studio Bruxelles Sound', description: 'Studio d\'enregistrement au cœur de Bruxelles.', address: '123 Rue de la Loi, 1000 Bruxelles' },
         { id: 2, name: 'Capital Music Lab', description: 'Espace créatif pour les musiciens de la capitale.', address: '45 Avenue Louise, 1050 Bruxelles' },
         { id: 3, name: 'Studio Bruxelles Sound', description: 'Studio d\'enregistrement au cœur de Bruxelles.', address: '123 Rue de la Loi, 1000 Bruxelles' },
         { id: 4, name: 'Capital Music Lab', description: 'Espace créatif pour les musiciens de la capitale.', address: '45 Avenue Louise, 1050 Bruxelles' },
         { id: 5, name: 'Capital Music Lab', description: 'Espace créatif pour les musiciens de la capitale.', address: '45 Avenue Louise, 1050 Bruxelles' },
         { id: 6, name: 'Capital Music Lab', description: 'Espace créatif pour les musiciens de la capitale.', address: '45 Avenue Louise, 1050 Bruxelles' },
         { id: 7, name: 'Capital Music Lab', description: 'Espace créatif pour les musiciens de la capitale.', address: '45 Avenue Louise, 1050 Bruxelles' },
       ],
       namur: [
         { id: 1, name: 'NamurAudio Hub', description: 'Studio moderne au cœur de Namur.', address: '10 Rue de Fer, 5000 Namur' },
         { id: 2, name: 'Meuse Melodies', description: 'Espace d\'enregistrement avec vue sur la Meuse.', address: '22 Quai des Joghiers, 5000 Namur' },
       ],
       liege: [
         { id: 1, name: 'Liège Lyrical Lab', description: 'Studio dynamique au bord de la Meuse.', address: '15 Quai de la Batte, 4000 Liège' },
         { id: 2, name: 'Outremeuse Notes', description: 'Espace d\'enregistrement avec vue sur la citadelle.', address: '7 Rue Surlet, 4020 Liège' },
       ],
       anvers: [
         { id: 1, name: 'Antwerp Audio Arena', description: 'Studio urbain avec une vue sur le port d\'Anvers.', address: '30 Nationalestraat, 2000 Antwerpen' },
         { id: 2, name: 'Scheldt Sound Studio', description: 'Studio élégant situé près du fleuve Escaut.', address: '18 Ernest Van Dijckkaai, 2000 Antwerpen' },
       ],
       brabantFlamand: [
         { id: 1, name: 'Louvain LoudLab', description: 'Studio dynamique au cœur de Louvain.', address: '25 Bondgenotenlaan, 3000 Leuven' },
         { id: 2, name: 'Zaventem Zen Studio', description: 'Studio moderne à proximité de l\'aéroport.', address: '5 Leuvensesteenweg, 1930 Zaventem' },
       ],
       brabantWallon: [
         { id: 1, name: 'Louvain-la-Neuve Sound Station', description: 'Studio universitaire dans la ville de Louvain-la-Neuve.', address: '10 Place de l\'Université, 1348 Louvain-la-Neuve' },
         { id: 2, name: 'Waterloo Waves', description: 'Studio historique près du champ de bataille de Waterloo.', address: '223 Chaussée de Bruxelles, 1410 Waterloo' },
       ],
       flandreOccidentale: [
         { id: 1, name: 'Bruges Beatbox', description: 'Studio historique dans le centre de Bruges.', address: '8 Markt, 8000 Brugge' },
         { id: 2, name: 'Ostend Ocean Sound', description: 'Studio avec vue sur la mer à Ostende.', address: '20 Albert I-promenade, 8400 Oostende' },
       ],
       flandreOrientale: [
         { id: 1, name: 'Ghent Groove Studio', description: 'Studio moderne au cœur de Gand.', address: '12 Korenmarkt, 9000 Gent' },
         { id: 2, name: 'Aalst AudioLab', description: 'Studio dynamique dans la ville d\'Alost.', address: '5 Grote Markt, 9300 Aalst' },
       ],
       hainaut: [
         { id: 1, name: 'Mons Music Lab', description: 'Studio moderne au cœur de Mons.', address: '7 Grand-Place, 7000 Mons' },
         { id: 2, name: 'Charleroi Chords', description: 'Studio industriel dans la ville de Charleroi.', address: '14 Boulevard Tirou, 6000 Charleroi' },
       ],
       limbourg: [
         { id: 1, name: 'Hasselt Harmonies', description: 'Studio convivial au cœur de Hasselt.', address: '9 Grote Markt, 3500 Hasselt' },
         { id: 2, name: 'Genk Groove', description: 'Studio moderne dans la ville de Genk.', address: '22 Stadsplein, 3600 Genk' },
       ],
       luxembourg: [
         { id: 1, name: 'Arlon AudioLab', description: 'Studio moderne dans la ville d\'Arlon.', address: '15 Rue des Faubourgs, 6700 Arlon' },
         { id: 2, name: 'Bastogne Beats', description: 'Studio historique dans la ville de Bastogne.', address: '8 Place McAuliffe, 6600 Bastogne' },
       ]
     };
  
        this.studios = studiosByProvince[this.provinceName.toLowerCase()] || [];
        this.loadMoreStudios();
      },
      loadMoreStudios() {
        const start = (this.page - 1) * this.itemsPerPage;
        const end = start + this.itemsPerPage;
        this.displayedStudios = this.displayedStudios.concat(
          this.filteredAndSortedStudios.slice(start, end)
        );
        this.page++;
      },
      handleScroll(e) {
        const { scrollTop, clientHeight, scrollHeight } = e.target;
        if (scrollHeight - scrollTop === clientHeight) {
          this.isLoading = true;
          setTimeout(() => {
            this.loadMoreStudios();
            this.isLoading = false;
          }, 1000);
        }
      },
      getRandomImage() {
        return `https://picsum.photos/id/${Math.floor(Math.random() * 1000)}/300/200`;
      },
      showReservationModal(studioId) {
        this.showModal = true;
        this.selectedStudio = this.studios.find(studio => studio.id === studioId);
      },
      closeReservationModal() {
        this.showModal = false;
        this.selectedStudio = null;
        this.selectedDate = null;
        this.selectedTimeSlot = null;
        this.selectedDuration = null;
        this.email = '';
        this.showConfirmation = false;
        this.showError = false;
        this.confirmationMessage = '';
        this.showAlert = false;
      },
      toggleSortOrder() {
        this.sortOrder = this.sortOrder === 'asc' ? 'desc' : 'asc';
        this.displayedStudios = [];
        this.page = 1;
        this.loadMoreStudios();
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
      getTimeSlots() {
        const timeSlots = [];
        const startHour = 9;
        const endHour = 18;
        for (let i = startHour; i <= endHour; i++) {
          timeSlots.push(i);
        }
        return timeSlots;
      },
      formatTimeSlot(timeSlot) {
        return `${timeSlot}:00`;
      },
      getTimeSlotOptions() {
        return this.timeSlotsData.map(timeSlot => ({
          duration: timeSlot.duration,
          price: timeSlot.price,
          label: `${timeSlot.duration} heure(s) - ${timeSlot.price}€`
        }));
      },
      selectDate(date) {
        this.selectedDate = date;
      },
      selectTimeSlot(timeSlot) {
        this.selectedTimeSlot = timeSlot;
        this.selectedDuration = this.timeSlotsData[0].duration;
      },
      selectDuration(duration) {
        this.selectedDuration = duration;
      },
      isDateReserved(date) {
        const dateString = this.formatDate(date);
        return Object.keys(this.reservedDates).some(key => key.startsWith(dateString) && this.reservedDates[key].studioId === this.selectedStudio.id);
      },
      isTimeSlotReserved(date, timeSlot) {
        const key = `${this.formatDate(date)}-${timeSlot}`;
        return this.reservedDates[key] && this.reservedDates[key].studioId === this.selectedStudio.id;
      },
      confirmReservation() {
        if (!this.email) {
          this.showAlert = true;
          this.showConfirmation = false;
          return;
        }
        if (!this.isValidEmail) {
          this.showAlert = false;
          this.showConfirmation = false;
          return;
        }
        const dateString = this.formatDate(this.selectedDate);
        for (let i = this.selectedTimeSlot; i < this.selectedTimeSlot + this.selectedDuration; i++) {
          const key = `${dateString}-${i}`;
          if (this.reservedDates[key] && this.reservedDates[key].studioId === this.selectedStudio.id) {
            this.showError = true;
            return;
          }
        }
        for (let i = this.selectedTimeSlot; i < this.selectedTimeSlot + this.selectedDuration; i++) {
          const key = `${dateString}-${i}`;
          this.reservedDates[key] = {
            studioId: this.selectedStudio.id,
            duration: this.selectedDuration,
            email: this.email
          };
        }
        this.saveReservations();
        this.showConfirmation = true;
        this.showError = false;
        this.showAlert = false;
        const selectedTimeSlotOption = this.getTimeSlotOptions().find(option => option.duration === this.selectedDuration);
        this.confirmationMessage = `Réservation confirmée pour ${this.formatTimeSlot(this.selectedTimeSlot)} - ${this.selectedDuration} heure(s) au prix de ${selectedTimeSlotOption.price}€.`;
      },
      saveReservations() {
        localStorage.setItem('reservations', JSON.stringify(this.reservedDates));
      },
      loadReservations() {
        const reservations = JSON.parse(localStorage.getItem('reservations')) || {};
        this.reservedDates = reservations;
      },
      validateEmail() {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        this.isValidEmail = emailRegex.test(this.email);
      },
      goBack() {
        this.$router.push('/');
      }
    },
    watch: {
      searchQuery() {
        this.displayedStudios = [];
        this.page = 1;
        this.loadMoreStudios();
      },
      email() {
        this.validateEmail();
        this.showAlert = false;
        this.showConfirmation = false;
      }
    }
  }
  </script>
  
  <style scoped>
  
 .province {
    padding: 20px;
    max-width: 1200px;
    width: 100%;
    margin: 0 auto;
}

.back-button {
    position: fixed;
    top: 20px;
    left: 20px;
    display: flex;
    align-items: center;
    padding: 10px 20px;
    background-color: #ffa500;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    font-size: 16px;
    text-decoration: none;
    transition: background-color 0.3s ease;
    z-index: 1000; /* S'assure que le bouton est au-dessus des autres éléments */
}

.back-button:hover {
    background-color: #cb8400;
}

.arrow-left {
    border: solid white;
    border-width: 0 3px 3px 0;
    display: inline-block;
    padding: 3px;
    margin-right: 10px;
    transform: rotate(135deg);
    -webkit-transform: rotate(135deg);
}

@media (max-width: 480px) {
    .back-button {
        top: 10px;
        left: 10px;
        padding: 8px 16px;
        font-size: 14px;
    }

    .arrow-left {
        margin-right: 5px;
    }
}

.studio {
    display: flex;
    align-items: center;
    border: 1px solid #ccc;
    padding: 20px;
    margin-bottom: 20px;
    background-color: #ffffff;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    flex-wrap: wrap;
}

.studio img {
    width: 100%;
    max-width: 200px;
    height: auto;
    margin-bottom: 10px;
    border-radius: 8px;
    object-fit: cover;
}

.studio-info {
    flex-grow: 1;
    min-width: 280px;
}

button {
    background-color: #ffa500;
    color: white;
    border: none;
    padding: 10px 20px;
    cursor: pointer;
    border-radius: 5px;
    transition: background-color 0.3s ease;
}

button:hover {
    background-color: #c37f00;
}

.filters {
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
    margin-bottom: 20px;
}

.search-bar {
    margin-bottom: 10px;
    padding: 10px 15px;
    border: 1px solid #ccc;
    border-radius: 5px;
    min-width: 200px;
}

.sort-button {
    padding: 10px 15px;
    background-color: #f0f0f0;
    border: 1px solid #ccc;
    cursor: pointer;
    border-radius: 5px;
    transition: background-color 0.3s ease;
}

.sort-button:hover {
    background-color: #e0e0e0;
}

.loading-indicator {
    display: flex;
    justify-content: center;
    padding: 20px 0;
}

.spinner {
    border: 4px solid #f3f3f3;
    border-top: 4px solid #ffa500;
    border-radius: 50%;
    width: 40px;
    height: 40px;
    animation: spin 1s linear infinite;
}

@keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
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
    background-color: rgba(0, 0, 0, 0.7);
    overflow: auto;
    padding: 20px;
}

.modal-content {
    background-color: #ffffff;
    padding: 20px;
    border-radius: 10px;
    max-width: 600px;
    width: 100%;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
    position: relative;
}

.close-button {
    position: absolute;
    top: 15px;
    right: 15px;
    color: #333;
    font-size: 28px;
    font-weight: bold;
    cursor: pointer;
    transition: color 0.3s ease;
}

.close-button:hover {
    color: #000;
}

.reservation-calendar {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
    gap: 15px;
    margin-bottom: 20px;
}

.reservation-slot {
    padding: 15px;
    text-align: center;
    background-color: #f8f8f8;
    cursor: pointer;
    border-radius: 8px;
    transition: background-color 0.3s ease, transform 0.3s ease;
    font-size: 16px;
    color: #333;
}

.reservation-slot:hover {
    background-color: #e0e0e0;
    transform: scale(1.05);
}

.reservation-slot.reserved {
    background-color: #cf8700;
    color: white;
    cursor: not-allowed;
}

.time-slots {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    margin-bottom: 20px;
}

.time-slot {
    padding: 10px;
    background-color: #f8f8f8;
    cursor: pointer;
    border-radius: 8px;
    transition: background-color 0.3s ease;
    font-size: 16px;
    text-align: center;
    flex: 1 1 120px;
}

.time-slot:hover {
    background-color: #e0e0e0;
}

.time-slot.reserved {
    background-color: #704900;
    cursor: not-allowed;
}

.reservation-form {
    display: flex;
    flex-direction: column;
    gap: 15px;
    margin-top: 20px;
}

.time-slot-options {
    display: flex;
    justify-content: space-between;
    gap: 10px;
    flex-wrap: wrap;
}

.time-slot-option {
    padding: 15px;
    background-color: #f8f8f8;
    cursor: pointer;
    border-radius: 8px;
    text-align: center;
    flex-grow: 1;
    transition: background-color 0.3s ease;
}

.time-slot-option.selected {
    background-color: #ffa500;
    color: white;
}

input[type="email"] {
    padding: 15px;
    border: 1px solid #ccc;
    border-radius: 5px;
}

.error-message,
.alert-message {
    color: red;
    font-size: 14px;
}

.confirmation-message {
    color: green;
    font-size: 16px;
    font-weight: bold;
}

/* Media Queries pour le Responsive Design */

@media (max-width: 768px) {
    .studio {
        flex-direction: column;
        text-align: center;
    }

    .reservation-calendar {
        grid-template-columns: repeat(auto-fill, minmax(80px, 1fr));
    }

    .time-slots {
        flex-direction: column;
    }
}

@media (max-width: 480px) {
    .reservation-slot {
        font-size: 14px;
        padding: 10px;
    }

    .time-slot {
        font-size: 14px;
        padding: 8px;
    }

    .back-button, 
    .sort-button, 
    .search-bar {
        width: 100%;
        margin-bottom: 10px;
    }

    .time-slot-option {
        font-size: 14px;
    }
}


</style>