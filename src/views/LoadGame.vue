<template>
    <div>
        <input
            type="checkbox"
            v-model="showFinishedGames"
            name="showFinishedGames"
        /><label for="showFinishedGames">Show Finished Games</label>
        <existing-game-option-component
            v-for="g in gamesToShow"
            :key="g.id"
            @click.native="loadGame(g)"
            class="recent-name"
            v-bind.sync="g"
        ></existing-game-option-component>
    </div>
</template>
<script lang="ts">
import ExistingGameOptionComponent from "../components/ExistingGameOptionComponent.vue";
import DatabaseManager from "../DatabaseManager";

import Game, { IGame } from "../models/Game";
import { Component, Prop, Vue } from "vue-property-decorator";

@Component({
    components: {
        ExistingGameOptionComponent
    }
})
export default class LoadGame extends Vue {
    allExistingGames: IGame[] = [];
    inProgressGames: IGame[] = [];
    showFinishedGames: boolean = false;
    async mounted() {
        await DatabaseManager.init();
        this.allExistingGames = await DatabaseManager.getAllGames(true);
        this.inProgressGames = this.allExistingGames.filter(
            g => g.numRaces > g.history.length
        );
    }
    get gamesToShow() {
        return this.showFinishedGames
            ? this.allExistingGames
            : this.inProgressGames;
    }
    loadGame(gameToLoad: IGame) {
        this.$router.push("game/" + gameToLoad.id);
    }
}
</script>
