<template>
    <div class="theme-toggle-wrapper">
      <button @click="toggleTheme" class="theme-toggle" :class="{ 'dark': isDarkMode }">
        <span class="toggle-track">
          <span class="toggle-icon sun">☀</span>
          <span class="toggle-icon moon">☾</span>
        </span>
      </button>
    </div>
  </template>
  
  <script>
  export default {
    props: ['isDarkMode'],
    methods: {
      toggleTheme() {
        this.$emit('toggle-theme')
      }
    }
  }
  </script>
  
  <style scoped>
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
    color: #E74B3B;  /* Changé de #f39c12 à #E74B3B */
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
  @media (max-width: 768px) {
    .theme-toggle-wrapper {
    left: 6em;
    top: 6em;
    position: fixed;
  }
  }
  </style>