<template>
  <div :class="{ 'dark-mode': isDarkMode }">
    <Loader v-if="isLoading" />
    <div v-else class="home">
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
      
      <ThemeToggle :isDarkMode="isDarkMode" @toggle-theme="toggleTheme" />
      
      <main>
        <div class="content">
          <h1>Trouvez votre studio <span class="highlight">parfait</span></h1>
          <p>Explorez les meilleurs studios de musique en <span class="highlight">Belgique</span>, province par province. Votre art unique commence ici.</p>
          <button 
            class="explore-btn jelly-btn" 
            @click="addLogo" 
            @mousedown="addLogo" 
            @mouseup="resetButtonAnimation" 
            @mouseleave="resetButtonAnimation"
          >
            Carte cliquableㅤㅤ⮕ 
          </button>
        </div>
        
        <div class="map-container">
          <div v-if="!isMobile" class="map">
            <svg viewBox="0 0 600 500" ref="mapSvg">
              <path
                v-for="province in provinces"
                :key="province.id"
                :d="province.path"
                :fill="getProvinceColor(province.id)"
                :stroke="isDarkMode ? '#333333' : '#FFFFFF'"
                stroke-width="4"
                @mouseover="highlightProvince(province.id)"
                @mouseout="resetHighlight"
                @click="selectProvince(province.id)"
              />
            </svg>
          </div>
          <ul v-else class="province-list">
            <li v-for="province in provinces" :key="province.id" @click="selectProvince(province.id)">
              {{ province.name }}
            </li>
          </ul>
        </div>
      </main>

      <div class="logo-container">
        <img
          v-for="logo in logos"
          :key="logo.id"
          :id="`logo-${logo.id}`"
          src="../assets/logo.png"
          class="floating-logo"
          :style="{
            left: `${logo.x}px`,
            top: `${logo.y}px`,
            transform: `rotate(${logo.rotation}deg)`
          }"
        />
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
  </div>
</template>

<script>
import Loader from '@/components/Loader.vue'
import ThemeToggle from '@/components/ThemeToggle.vue'
import { gsap } from 'gsap'

export default {
  name: 'Home',
  components: {
    Loader,
    ThemeToggle
  },
  data() {
    return {
      isLoading: true,
      provinces: [
        { id: 'luxembourg', name: 'Luxembourg', path: 'M380,417 L382,411 L381,405 L394,398 L390,392 L403,387 L401,378 L395,372 L386,373 L381,363 L385,357 L394,351 L394,338 L399,346 L414,345 L421,343 L426,343 L421,334 L428,334 L427,327 L423,321 L417,315 L424,311 L431,307 L440,303 L445,296 L445,287 L445,277 L450,273 L449,264 L457,268 L464,265 L469,272 L476,272 L484,279 L496,282 L493,290 L497,295 L502,296 L497,303 L504,304 L511,304 L517,304 L521,300 L517,291 L518,284 L524,286 L529,287 L537,290 L543,294 L541,303 L541,311 L541,319 L544,327 L533,328 L529,336 L523,343 L517,351 L513,359 L513,366 L508,375 L502,382 L497,390 L495,398 L501,402 L497,410 L497,418 L502,422 L506,427 L509,435 L515,439 L516,447 L521,452 L516,461 L513,468 L516,474 L508,478 L500,477 L493,480 L485,479 L477,483 L468,483 L457,490 L457,479 L452,469 L445,461 L436,457 L431,462 L433,449 L427,443 L418,442 L410,442 L405,435 L398,427 L389,424 Z' },
        { id: 'liege', name: 'Liège', path: 'M544,330 L544,318 L541,304 L543,292 L533,286 L518,283 L517,290 L516,297 L510,302 L498,301 L501,294 L493,289 L496,280 L487,277 L476,270 L468,272 L464,264 L457,267 L448,262 L449,270 L445,276 L437,272 L430,277 L426,270 L419,266 L422,260 L415,251 L409,253 L404,246 L397,238 L390,238 L391,230 L389,222 L383,216 L382,208 L385,200 L387,193 L388,185 L395,194 L400,194 L406,196 L411,198 L411,191 L420,192 L427,190 L433,192 L444,184 L448,191 L454,191 L457,186 L460,190 L465,186 L468,181 L479,179 L486,171 L492,175 L490,182 L496,185 L501,179 L507,184 L522,185 L537,185 L542,188 L541,194 L551,193 L562,209 L565,218 L579,218 L574,226 L564,233 L566,240 L570,248 L580,248 L593,251 L593,261 L591,277 L598,290 L587,291 L581,302 L570,307 L562,316 L565,324 L558,336 Z' },
        { id: 'namur', name: 'Namur', path: 'M379,415 L382,405 L394,396 L394,389 L401,387 L400,378 L394,371 L385,372 L380,359 L392,351 L394,336 L398,344 L416,343 L425,340 L421,334 L428,329 L415,314 L429,306 L434,307 L446,297 L437,292 L444,285 L445,276 L438,272 L432,278 L420,269 L421,260 L416,251 L409,253 L404,244 L389,238 L391,232 L382,218 L382,211 L375,211 L367,216 L346,222 L338,221 L331,221 L333,229 L319,230 L316,247 L323,245 L319,259 L326,264 L320,271 L324,275 L319,290 L309,291 L300,292 L289,293 L285,299 L274,305 L282,312 L287,308 L291,312 L290,321 L285,327 L291,337 L289,354 L293,357 L293,368 L298,376 L296,382 L322,371 L330,370 L334,355 L334,347 L356,328 L359,333 L364,333 L364,346 L359,350 L358,357 L355,364 L352,371 L352,377 L359,381 L363,388 L363,395 L360,403 L362,408 L362,417 L369,418 Z' },
        { id: 'hainaut', name: 'Hainaut', path: 'M297,383 L300,377 L294,368 L294,357 L289,350 L293,340 L286,328 L291,323 L291,312 L282,311 L274,305 L286,300 L293,293 L300,294 L307,288 L312,291 L323,291 L321,281 L325,276 L326,265 L319,261 L323,252 L318,247 L319,236 L305,239 L304,231 L284,232 L268,222 L259,208 L250,214 L244,207 L244,197 L228,199 L219,200 L212,192 L212,184 L202,187 L194,184 L192,177 L181,180 L173,191 L159,188 L157,181 L145,181 L132,195 L124,190 L122,184 L101,184 L106,193 L114,202 L110,209 L115,221 L116,234 L118,241 L131,250 L141,244 L152,241 L153,248 L166,250 L176,258 L176,270 L177,280 L177,288 L182,292 L191,283 L201,282 L210,284 L216,287 L228,284 L237,288 L243,292 L251,304 L255,299 L260,304 L259,310 L255,315 L252,324 L251,329 L250,335 L256,334 L259,339 L262,345 L263,351 L251,361 L252,372 L259,377 L271,373 Z' },
        { id: 'brabantwallon', name: 'Brabant Wallon', path: 'M245,196 L251,193 L257,194 L266,199 L275,199 L281,191 L287,196 L288,189 L295,189 L305,183 L310,190 L321,183 L327,188 L332,183 L328,174 L337,174 L347,170 L355,175 L359,181 L371,182 L373,187 L383,181 L388,185 L385,191 L388,197 L386,206 L383,212 L375,212 L367,217 L357,220 L349,223 L343,218 L334,220 L333,228 L323,229 L319,236 L311,239 L304,237 L299,231 L288,230 L281,236 L276,229 L269,223 L268,216 L261,217 L259,207 L251,213 L245,208 Z' },
        { id: 'bruxelles', name: 'Bruxelles', path: 'M268,168 L271,162 L276,158 L275,150 L282,147 L287,148 L293,144 L298,151 L295,156 L302,160 L305,165 L301,168 L305,174 L298,176 L290,180 L283,179 L278,170 Z' },
        { id: 'brabantflamand', name: 'Brabant Flamand', path: 'M305,184 L305,175 L297,178 L289,181 L282,178 L278,171 L267,169 L270,163 L275,157 L276,150 L283,147 L291,146 L292,126 L287,120 L278,116 L270,114 L266,119 L263,127 L256,126 L253,133 L255,139 L252,144 L245,140 L242,147 L245,153 L237,162 L243,167 L239,176 L232,180 L223,178 L220,183 L223,189 L214,191 L214,196 L224,199 L234,197 L242,195 L252,190 L258,195 L267,197 L275,197 L279,190 L286,193 L289,188 L296,188 M292,127 L293,133 L293,145 L299,152 L296,157 L302,161 L304,168 L305,175 L300,178 L292,182 L294,189 L306,183 L311,190 L322,183 L326,189 L332,185 L329,175 L340,176 L346,172 L354,175 L359,180 L369,181 L373,188 L382,182 L390,186 L394,193 L400,194 L404,190 L401,180 L407,172 L408,156 L414,151 L407,145 L397,144 L393,140 L397,133 L401,127 L407,121 L405,113 L398,111 L397,118 L390,119 L383,115 L376,114 L363,118 L356,120 L354,114 L349,116 L343,117 L340,122 L336,117 L325,120 L320,125 L315,123 L307,123 L296,123' },
        { id: 'limbourg', name: 'Limbourg', path: 'M383,112 L387,105 L398,102 L406,94 L412,93 L418,88 L425,88 L425,80 L420,70 L420,61 L448,59 L459,51 L466,55 L469,64 L470,71 L481,75 L487,79 L497,78 L505,85 L513,84 L516,90 L515,96 L510,99 L511,106 L505,108 L503,113 L506,119 L497,131 L503,133 L499,141 L494,145 L482,159 L486,169 L483,175 L475,180 L467,181 L462,189 L456,191 L449,190 L445,185 L436,187 L433,192 L426,190 L419,191 L411,191 L413,197 L403,195 L404,187 L401,177 L410,171 L405,168 L409,155 L414,148 L408,143 L400,144 L394,143 L391,136 L399,131 L403,123 L409,117 L401,110 L397,116 L389,117 Z' },
        { id: 'anvers', name: 'Anvers', path: 'M274,33 L275,46 L282,50 L275,58 L277,69 L281,80 L280,90 L267,94 L260,96 L259,107 L263,113 L271,113 L281,114 L288,118 L293,123 L303,123 L311,122 L319,123 L327,120 L337,118 L345,118 L353,116 L358,119 L369,118 L377,114 L385,112 L387,106 L396,103 L402,100 L406,95 L415,94 L424,88 L427,80 L420,72 L422,63 L418,56 L416,49 L407,48 L401,41 L399,35 L395,31 L396,17 L393,9 L387,6 L375,24 L359,24 L349,22 L351,16 L359,9 L355,3 L347,2 L343,8 L336,14 L329,20 L319,19 L311,17 L312,8 L303,8 L293,11 L291,19 L295,25 L296,31 L292,35 L286,38 Z' },
        { id: 'flandreorientale',  name: 'Flandre Orientale', path: 'M136,64 L152,65 L153,55 L172,54 L194,61 L197,72 L218,73 L233,65 L250,56 L260,47 L265,33 L271,46 L276,54 L276,70 L283,80 L279,90 L264,93 L258,99 L259,112 L268,113 L263,126 L255,127 L254,139 L245,142 L244,151 L237,162 L242,167 L239,176 L229,179 L221,179 L222,188 L214,189 L202,186 L192,178 L183,177 L175,184 L174,192 L157,188 L149,182 L156,173 L155,165 L145,158 L149,152 L141,147 L145,139 L140,133 L145,123 L142,113 L125,99 L139,84 L131,76 Z'},
        { id: 'flandreoccidentale', name: 'Flandre Occidentale', path: 'M58,198 L65,186 L94,177 L100,186 L108,181 L123,184 L129,194 L156,174 L155,165 L144,158 L144,148 L140,137 L144,125 L142,113 L126,100 L139,85 L129,75 L136,64 L128,55 L129,42 L128,32 L95,43 L15,96 L2,102 L5,121 L16,134 L9,145 L11,161 L17,169 L27,169 L36,181 L41,191 Z' },
      ],
      selectedProvince: null,
      highlightedProvince: null,
      logos: [],
      logoCounter: 0,
      isDarkMode: false,
      isMobile: false
    }
  },
  mounted() {
    setTimeout(() => {
      this.isLoading = false
    }, 2000)
    this.checkMobile();
    window.addEventListener('resize', this.checkMobile);
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.checkMobile);
  },
  methods: {
    selectProvince(id) {
      this.$router.push({ name: 'Province', params: { id: id } });
    },
    highlightProvince(id) {
      this.highlightedProvince = id;
    },
    resetHighlight() {
      this.highlightedProvince = null;
    },
    getProvinceColor(id) {
      if (this.selectedProvince === id) return '#ff4b4b';
      if (this.highlightedProvince === id) return '#ff7e7e';
      return this.isDarkMode ? '#ffffff' : '#464646';
    },
    addLogo() {
      // Animation "gelée" du bouton
      gsap.to(".explore-btn", {
        scale: 0.9,
        duration: 0.1,
        ease: "power2.in",
        onComplete: () => {
          gsap.to(".explore-btn", {
            scale: 1.1,
            duration: 0.3,
            ease: "elastic.out(1, 0.3)"
          });
          gsap.to(".explore-btn", {
            scaleY: 0.8,
            scaleX: 1.2,
            duration: 0.2,
            ease: "power2.in",
            onComplete: () => {
              gsap.to(".explore-btn", {
                scaleY: 1,
                scaleX: 1,
                duration: 0.5,
                ease: "elastic.out(1, 0.3)"
              });
            }
          });
        }
      });

      const windowWidth = window.innerWidth;
      const windowHeight = window.innerHeight;

      const randomX = Math.random() * windowWidth;
      const randomY = Math.random() * windowHeight;
      const rotation = Math.random() * 360;
      const logoId = this.logoCounter++;

      this.logos.push({ id: logoId, x: randomX, y: randomY, rotation });

      this.$nextTick(() => {
        const logoElement = document.getElementById(`logo-${logoId}`);
        if (logoElement) {
          gsap.fromTo(logoElement, 
            { opacity: 0, scale: 2 },
            { 
              duration: 1.5, 
              opacity: 1, 
              scale: 1,
              ease: "bounce.out",
              onComplete: () => {
                setTimeout(() => {
                  gsap.to(logoElement, {
                    duration: 1,
                    opacity: 0,
                    scale: 1,
                    ease: "power2.out",
                    onComplete: () => {
                      this.logos = this.logos.filter(l => l.id !== logoId);
                    }
                  });
                }, 3000);
              }
            }
          );
        }
      });
    },
    resetButtonAnimation() {
      gsap.to(".explore-btn", {
        scale: 1,
        scaleY: 1,
        scaleX: 1,
        duration: 0.5,
        ease: "elastic.out(1, 0.3)"
      });
    },
    toggleTheme() {
      this.isDarkMode = !this.isDarkMode;
    },
    checkMobile() {
      this.isMobile = window.innerWidth <= 768;
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
}

.explore-btn:hover {
  background-color: #c0392b;
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(231, 76, 60, 0.4);
}
.footer-section ul li a {
  color: #666;
  text-decoration: none;
  transition: color 0.3s ease;
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

.map-container {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
}

.map {
  width: 100%;
  max-width: 600px;
  margin-top: 4em;
  z-index: 4;
}

svg {
  width: 100%;
  height: auto;
}

path {
  transition: all 0.3s ease;
  cursor: pointer;
}

.province-list {
  list-style: none;
  padding: 0;
  width: 100%;
}

.province-list li {
  padding: 1rem;
  margin-bottom: 0.5rem;
  background-color: #f0f0f0;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.province-list li:hover {
  background-color: #e0e0e0;
}

.logo-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 3;
}

.floating-logo {
  position: absolute;
  width: 30px;
  height: 30px;
  filter: drop-shadow(0 0 2px rgba(255, 255, 255, 0.5));
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

.footer-logo img {
  height: 40px;
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

.dark-mode .footer-logo img {
  filter: invert(1);
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

.dark-mode .province-list li {
  background-color: #444;
  color: #fff;
}

.dark-mode .province-list li:hover {
  background-color: #555;
}

.invert {
  filter: invert(1) drop-shadow(0 0 2px rgba(0, 0, 0, 0.5));
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

  .map-container {
    width: 100%;
  }
}

@media (max-width: 768px) {
  .navbar {
    align-items: center;
    width: 102%;
    display: flex;
  }
  .theme-toggle-wrapper{
    margin-left: 14em;
    top: 1em;
   
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
  .phone-button{
    display: none;
  }
  
  .phone-number {
    display: none;
  }
  .explore-btn{
    display: none;
  }
  .footer-logo span{
    scale: 0.8;
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