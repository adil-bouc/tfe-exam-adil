<template>
    <div :class="{ 'dark-mode': isDarkMode }">
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
      
      
      
      <main>
        <div class="content">
          <h1>Oups! Page <span class="highlight">introuvable</span></h1>
          <p>Désolé, la page que vous recherchez n'existe pas. Mais ne vous inquiétez pas, il y a encore plein de studios à découvrir!</p>
          <router-link to="/" class="explore-btn jelly-btn">
            Retour à l'accueilㅤㅤ⮕ 
          </router-link>
        </div>
        
        <div class="error-image">
          <img src="../assets/404.png" alt="404 Error" class="error-404">
        </div>
      </main>
  
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
  import ThemeToggle from '@/components/ThemeToggle.vue'
  
  export default {
    name: 'NotFound',
    data() {
      return {
        isDarkMode: false
      }
    },
    methods: {
      toggleTheme() {
        this.isDarkMode = !this.isDarkMode;
      }
    }
  }
  </script>
  
  <style scoped>
  @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@400;700&display=swap');
  
  #app {
    width: 100%;
    min-height: 100vh;
  }
  
  .home {
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
    display: flex;
    flex: 1;
    padding: 3rem 2rem;
    align-items: center;
  }
  
  .content {
    flex: 1;
    padding-right: 3rem;
    z-index: 4;
  }
  
  h1 {
    font-size: 3rem;
    color: #2c3e50;
    margin-bottom: 1rem;
    line-height: 1.2;
    z-index: 4;
  }
  
  .highlight {
    color: #e74c3c;
    position: relative;
  }
  
  .highlight::after {
    content: '';
    position: absolute;
    bottom: -5px;
    left: 0;
    width: 100%;
    height: 3px;
    background-color: #e74c3c;
  }
  
  p {
    font-size: 1.1rem;
    color: #34495e;
    margin-bottom: 2rem;
    line-height: 1.6;
    z-index: 4;
  }
  
  .explore-btn {
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
    text-decoration: none;
    display: inline-block;
  }
  
  .explore-btn:hover {
    background-color: #c0392b;
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(231, 76, 60, 0.4);
  }
  
  .jelly-btn {
    transition: all 0.3s ease;
    border-radius: 50px;
    overflow: hidden;
    position: relative;
  }
  
  .jelly-btn::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(255, 255, 255, 0.2);
    border-radius: 50px;
    opacity: 0;
    transition: all 0.3s ease;
  }
  
  .jelly-btn:active::after {
    opacity: 1;
  }
  
  .error-image {
    flex: 1;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  
  .error-404 {
    max-width: 100%;
    height: auto;
  }
  
  footer {
    position: relative;
    background-color: rgb(70,70,70);
    color: #fff;
    padding: 2rem;
    font-family: 'Montserrat', sans-serif;
    z-index: 4;
    margin-top: auto;
    margin-bottom: -1em;
  }
  
  .footer-content {
    display: flex;
    justify-content: space-between;
    margin-bottom: 4rem;
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
  
  .footer-right h3{
    text-align: right;
  }
  
  .footer-right ul{
    text-align: right;
  }
  
  .footer-bottom {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-top: 2rem;
  }
  
  #provinces-ul{
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
  
  .dark-mode {
    background-color: #333;
    color: #fff;
  }
  
  .dark-mode .navbar {
    background-color: #222;
    color: #fff;
  }
  
  .dark-mode .logo span {
    color: #fff;
  }
  
  .dark-mode h1,
  .dark-mode p {
    color: #fff;
  }
  
  .dark-mode .highlight::after {
    background-color: #ff7e7e;
  }
  
  .dark-mode .explore-btn {
    background-color: #ff7e7e;
  }
  
  .dark-mode footer {
    background-color: #222;
    color: #fff;
  }
  
  .dark-mode .footer-section ul li a {
    color: #999;
  }
  
  .dark-mode .footer-section ul li a:hover {
    color: #fff;
  }
  
  .dark-mode .footer-logo span {
    color: #fff;
  }
  
  .dark-mode .footer-links a {
    color: #fff;
  }
  
  .dark-mode .footer-links .phone-button {
    background-color: #ff7e7e;
    color: #333;
  }
  
  .dark-mode .footer-links .phone-button:hover {
    background-color: #e74c3c;
  }
  
  .dark-mode .navbar {
    box-shadow: 0 2px 15px rgba(255,255,255,0.1);
  }
  
  .dark-mode .explore-btn {
    box-shadow: 0 4px 15px rgba(255, 126, 126, 0.3);
  }
  
  .dark-mode .explore-btn:hover {
    box-shadow: 0 6px 20px rgba(255, 126, 126, 0.4);
  }
  
  .dark-mode .phone-button {
    background-color: #ff7e7e;
    box-shadow: 0 2px 10px rgba(255, 126, 126, 0.3);
  }
  
  .dark-mode .phone-button:hover {
    background-color: #e74c3c;
  }
  
  @media (max-width: 1400px) {
    .navbar {
      width: 90%;
    }
  }
  
  @media (max-width: 1200px) {
    main {
      flex-direction: column;
    }
  
    .content {
      padding-right: 0;
      z-index: 4;
      margin-bottom: 2rem;
    }
  
    .error-image {
      width: 100%;
      margin-top: 2rem;
    }
  }
  
  @media (max-width: 768px) {
    .navbar {
      align-items: center;
      width: 102%;
      display: flex;
    }
  
    .logo {
      margin: 1rem;
    }
  
    h1 {
      font-size: 2.5rem;
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
  
    .phone-number {
      display: none;
    }
  
    .error-404 {
      max-width: 80%;
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
  
    h1 {
      font-size: 2rem;
    }
  
    p {
      font-size: 0.9rem;
    }
  
    .footer {
      padding: 1rem;
    }
  
    .footer-logo {
      scale: 2;
    }
  }
  </style>