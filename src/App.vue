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
  body {
    background: #fafafa;
  }
  #app {
    font-family: "Roboto", Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
    margin-top: 20px;
  }
</style>
