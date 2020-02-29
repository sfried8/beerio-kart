<template>
    <div>
        <input
            type="checkbox"
            v-model="showFinishedGames"
            name="showFinishedGames"
        /><label for="showFinishedGames">Show Finished Games</label>
        <existing-game-option-component
            v-for="g in gamesToShow"
            :key="g.game._id"
            @load="loadGame(g.game)"
            @delete="deleteGame(g.game)"
            v-bind.sync="g"
        ></existing-game-option-component>
    </div>
</template>
<script lang="ts">
import ExistingGameOptionComponent from "../components/ExistingGameOptionComponent.vue";
import DatabaseManager from "../MongoDatabaseManager";

import Game, { IGame } from "../models/Game";
import { Component, Prop, Vue } from "vue-property-decorator";
import { IGameData } from "../DatabaseManager";

@Component({
    components: {
        ExistingGameOptionComponent
    }
})
export default class LoadGame extends Vue {
    allExistingGames: IGameData[] = [];
    inProgressGames: IGameData[] = [];
    showFinishedGames: boolean = false;
    async mounted() {
        await DatabaseManager.init();
        this.allExistingGames = await DatabaseManager.getAllGames(true);
        this.inProgressGames = this.allExistingGames.filter(
            g => !g.game.history || g.game.numRaces > g.game.history.length
        );
    }
    get gamesToShow() {
        return this.showFinishedGames
            ? this.allExistingGames
            : this.inProgressGames;
    }
    loadGame(gameToLoad: IGame) {
        this.$router.push("game/" + gameToLoad._id);
    }
    async deleteGame(gameToDelete: IGame) {
        if (
            confirm(
                `Are you sure you want to delete this game and all data associated with it?`
            )
        ) {
            await DatabaseManager.deleteGame(gameToDelete);
            this.inProgressGames = this.inProgressGames.filter(
                g => g.game !== gameToDelete
            );
            this.allExistingGames = this.allExistingGames.filter(
                g => g.game !== gameToDelete
            );
        }
    }
}
</script>
