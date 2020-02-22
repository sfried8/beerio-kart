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
            @load="loadGame(g)"
            @delete="deleteGame(g)"
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
            g => !g.history || g.numRaces > g.history.length
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
    async deleteGame(gameToDelete: IGame) {
        if (
            confirm(
                `Are you sure you want to delete this game and all data associated with it?`
            )
        ) {
            await DatabaseManager.deleteGame(gameToDelete);
            this.inProgressGames = this.inProgressGames.filter(
                g => g !== gameToDelete
            );
            this.allExistingGames = this.allExistingGames.filter(
                g => g !== gameToDelete
            );
        }
    }
}
</script>
