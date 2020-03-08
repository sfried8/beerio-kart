<template>
    <div id="app">
        <div class="router-menu">
            <router-link v-if="$route.name !== 'newgame'" to="/newgame"
                >New Game</router-link
            >
            <router-link v-if="$route.name !== 'loadgame'" to="/loadgame"
                >Load Game</router-link
            >
            <router-link
                v-if="$route.name !== 'searchplayer'"
                to="/searchplayer"
                >Player Search</router-link
            >
        </div>
        <router-view></router-view>
    </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import KartGame from "./components/KartGame.vue";

@Component({
    components: {
        KartGame
    }
})
export default class App extends Vue {}
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
.router-menu {
    display: flex;
    flex-direction: row;
    justify-content: space-around;
    width: 20vw;
    margin: 0 auto 10px auto;
}
</style>
