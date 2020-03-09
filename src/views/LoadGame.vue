<template>
    <div>
        <v-list two-line subheader>
            <v-subheader>In Progress</v-subheader>
            <existing-game-option-component
                v-for="g in inProgressGames"
                :key="g.game._id"
                @load="loadGame(g.game)"
                @delete="deleteGame(g.game)"
                v-bind.sync="g"
            ></existing-game-option-component>
            <v-divider></v-divider>
            <v-subheader>Finished</v-subheader>
            <existing-game-option-component
                v-for="g in finishedGames"
                :key="g.game._id"
                @load="loadGame(g.game)"
                @delete="deleteGame(g.game)"
                v-bind.sync="g"
            ></existing-game-option-component>
        </v-list>
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
    finishedGames: IGameData[] = [];
    async mounted() {
        await DatabaseManager.init();
        this.allExistingGames = await DatabaseManager.getAllGames(true);
        this.allExistingGames.forEach(g => {
            if (!g.game.history || g.game.numRaces > g.game.history.length) {
                this.inProgressGames.push(g);
            } else {
                this.finishedGames.push(g);
            }
        });
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
