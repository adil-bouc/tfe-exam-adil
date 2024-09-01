<template>
    <div class="loader-container">
      <img src="../assets/logo.png" alt="Wherecord Logo" class="logo">
      <div class="spinner"></div>
    </div>
  </template>
  
  <script>
  import { gsap } from 'gsap'
  
  export default {
    name: 'Loader',
    mounted() {
      gsap.to('.spinner', {
        rotation: 360,
        duration: 1,
        repeat: -1,
        ease: 'linear'
      })
    }
  }
  </script>
  
  <style scoped>
  .loader-container {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: #ffffff;
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 9999;
  }
  
  .logo {
    width: 70px;
    height: auto;
  }
  
  .spinner {
    position: absolute;
    width: 120px;
    height: 120px;
    border: 3px solid transparent;
    border-top: 3px solid #e74c3c;
    border-radius: 50%;
  }
  </style>