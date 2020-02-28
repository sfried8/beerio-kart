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
                <button @click="undo" v-if="roundNumber > 0" class="undo">
                    undo
                </button>

                <button
                    @click="promptAll"
                    v-if="roundNumber < numRaces"
                    class="next"
                >
                    Enter race {{ roundNumber + 1 }} results
                </button>
            </div>
            <point-place-component
                :chart-data="chartData"
                :styles="{
                    position: 'relative',
                    height: '500px'
                }"
            />
        </div>
    </div>
</template>

<script lang="ts">
/* eslint-disable */
import { KeypadPrompt } from "./KeypadPrompt";
import * as Util from "../Util";
import PlayerComponent from "./PlayerComponent.vue";
import DatabaseManager from "../MongoDatabaseManager";

import Player, { IPlayer } from "../models/Player";
import Game, { IGame } from "../models/Game";
import PointPlaceComponent from "./PointPlaceGraphComponent";
import { Component, Prop, Vue } from "vue-property-decorator";

@Component({
    components: {
        PointPlaceComponent,
        PlayerComponent
    }
})
export default class KartGame extends Vue {
    players: Player[] = [];
    numRaces: number = 8;
    game: Game | null = null;
    pendingName: string = "";
    playersFromDatabase: IPlayer[] = [];
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
    loadGame(gameToLoad: IGame) {
        this.players = gameToLoad.players.map(
            playerId =>
                new Player(
                    this.playersFromDatabase.find(
                        player => player._id === playerId
                    ) || { name: "uh-oh" }
                )
        );
        this.numRaces = gameToLoad.numRaces;
        this.game = new Game(
            this.players,
            this.numRaces,
            gameToLoad.history,
            gameToLoad._id
        );
        if (!gameToLoad.history || gameToLoad.history.length === 0) {
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
    get roundNumber() {
        return this.game ? this.game.roundNumber : -1;
    }
    get availableRecentNames() {
        return this.playersFromDatabase.filter(
            n => !this.players.some(p => p._id === n._id)
        );
    }
    get chartData() {
        const trendlines: any[] = [];
        if (!this.game) {
            return { datasets: [] };
        }
        this.game.datasets.forEach((d, i) => {
            const playerAverages: number[][] = [];
            d.forEach(h => {
                if (!playerAverages[h.x]) {
                    playerAverages[h.x] = [];
                }
                playerAverages[h.x].push(h.y);
            });
            const playerTrendlines = [];

            for (let i = 0; i < playerAverages.length; i++) {
                if (i in playerAverages) {
                    playerTrendlines.push({
                        x: i,
                        y: Util.average(playerAverages[i])
                    });
                }
            }
            trendlines.push({
                label: "remove",
                data: playerTrendlines,
                backgroundColor: this.players[i].playerColor,
                borderColor: this.players[i].playerColor,
                fill: false,
                pointHitRadius: 0.01,
                type: "line"
            });
        });
        return {
            datasets: [
                ...this.players.map((p, i) => ({
                    label: p.name,
                    data: this.game ? this.game.datasets[i] : [],
                    backgroundColor: p.playerColor,
                    pointRadius: 6
                })),
                ...trendlines
            ]
        };
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.button-panel {
    display: grid;
    grid-template-columns: 1fr 1fr 4fr 1fr;
    column-gap: 5%;
    padding: 10px;
    height: 50px;
    grid-template-areas: "undo newgame . next";
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
