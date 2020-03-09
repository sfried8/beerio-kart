<template>
    <div class="kart-game">
        <div>
            <div>Round {{ roundNumber }}</div>

            <div class="player-component-container">
                <player-component
                    v-for="player in players"
                    :key="player.name"
                    v-bind.sync="player"
                ></player-component>
            </div>

            <div class="button-panel">
                <v-btn @click="undo" v-if="roundNumber > 0" class="undo">
                    undo
                </v-btn>

                <v-btn @click="promptAll" v-if="roundNumber < numRaces">
                    Enter race {{ roundNumber + 1 }} results
                </v-btn>
            </div>
            <input type="checkbox" v-model="showGraph" name="showgraph" />
            <label for="showgraph">Show graph</label>

            <keep-alive>
                <component
                    :is="
                        showGraph
                            ? 'GameGraphComponent'
                            : 'GameHistoryComponent'
                    "
                    v-if="game"
                    :game="game"
                    :players="players"
                />
            </keep-alive>
            <br />
        </div>
    </div>
</template>

<script lang="ts">
/* eslint-disable */
import { KeypadPrompt } from "./PromptManager";
import * as Util from "../Util";
import PlayerComponent from "./PlayerComponent.vue";
import DatabaseManager from "../MongoDatabaseManager";

import Player, { IPlayer } from "../models/Player";
import Game, { IGame } from "../models/Game";
import GameGraphComponent from "./GameGraphComponent.vue";
import GameHistoryComponent from "./GameHistoryComponent.vue";
import { Component, Prop, Vue } from "vue-property-decorator";
import { IGameData } from "../DatabaseManager";

@Component({
    components: {
        GameGraphComponent,
        GameHistoryComponent,
        PlayerComponent
    }
})
export default class KartGame extends Vue {
    players: Player[] = [];
    numRaces: number = 8;
    game: Game | null = null;
    pendingName: string = "";
    playersFromDatabase: IPlayer[] = [];
    showGraph: boolean = false;
    async mounted() {
        await DatabaseManager.init();
        this.playersFromDatabase = await DatabaseManager.getPlayers();
        if (this.$route.params.gameid) {
            const game = await DatabaseManager.getGameById(
                this.$route.params.gameid
            );
            if (game) {
                this.loadGame(game);
            }
        }
    }
    async startGame() {
        this.game = new Game(this.players, this.numRaces);
        await this.game.init();
        this.game.startGame();
    }
    loadGame(gameToLoad: IGameData) {
        this.players = gameToLoad.players.map(player => new Player(player));
        this.numRaces = gameToLoad.game.numRaces;
        this.game = new Game(
            this.players,
            this.numRaces,
            gameToLoad.game.history,
            gameToLoad.game.courseHistory,
            gameToLoad.game._id,
            gameToLoad.datapoints
        );
        if (!gameToLoad.game.history || gameToLoad.game.history.length === 0) {
            this.game.startGame();
        }
    }
    async addPlayer(existingPlayer?: IPlayer) {
        if (!existingPlayer) {
            if (!this.pendingName) {
                return;
            }
            const _id = await DatabaseManager.addPlayer(this.pendingName);
            existingPlayer = { name: this.pendingName, _id };
        }
        this.players.push(new Player(existingPlayer));
        this.pendingName = "";
    }
    undo() {
        if (this.game) {
            this.game.undo();
        }
    }
    promptAll() {
        if (this.game) {
            this.game.promptAll();
        }
    }
    get roundNumber(): number {
        return this.game ? this.game.roundNumber : -1;
    }
    get availableRecentNames(): IPlayer[] {
        return this.playersFromDatabase.filter(
            n => !this.players.some(p => p._id === n._id)
        );
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.button-panel {
    display: flex;
    padding: 10px;
    height: 50px;
    justify-content: space-between;
}
.undo {
    grid-area: undo;
}
.newgame {
    grid-area: newgame;
}
.next {
    grid-area: next;
}
.recent-name-container {
    display: flex;
    flex-direction: column;
    align-items: center;
}
.recent-name {
    margin: 1vh;
    padding: 2vh;
    border: 1px #dddddd solid;
    border-radius: 1vh;
    width: 15vw;
}
.player-component-container {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
}
</style>
