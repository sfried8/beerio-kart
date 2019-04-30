<template>
  <div id="app">
    <kart-game />
  </div>
</template>

<script>
  import KartGame from "./components/KartGame.vue";

  export default {
    name: "app",
    components: {
      KartGame
    }
  };
</script>

<style>
  #app {
    font-family: "Avenir", Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
    margin-top: 60px;
  }
</style>
