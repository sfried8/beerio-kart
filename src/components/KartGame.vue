<template>
    <div class="kart-game">
        <div v-if="roundNumber >= 0">
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
                <button @click="newGame" class="newgame">New Game</button>
            </div>
            <point-place-component
                :chart-data="chartData"
                :styles="{
                    position: 'relative',
                    height: '500px'
                }"
            />
        </div>
        <div v-else>
            <div v-for="player in players" :key="player.name">
                {{ player.name }}
            </div>
            <input
                type="text"
                @keypress.enter="addPlayer()"
                v-model="pendingName"
                placeholder="Name"
            />
            <button @click="addPlayer()">Add</button>
            <div
                class="recent-name-container"
                v-if="availableRecentNames.length"
            >
                Recent:
                <div
                    v-for="n in availableRecentNames"
                    :key="n.id"
                    @click="addPlayer(n)"
                    class="recent-name"
                >
                    {{ n.name }}
                </div>
            </div>
            <div>
                <input v-model="numRaces" />
                <button v-if="players.length" @click="startGame">start</button>
            </div>
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
        </div>
    </div>
</template>

<script lang="ts">
/* eslint-disable */
import { KeypadPrompt } from "./KeypadPrompt";
import * as Util from "../Util";
import PlayerComponent from "./PlayerComponent.vue";
import ExistingGameOptionComponent from "./ExistingGameOptionComponent.vue";
import * as DatabaseManager from "../DatabaseManager";
function printScores(players: Player[]) {
    players.forEach(p => {
        p.messages = p.currentRoundPoints.displayStrings();
    });
}

import Player, { IPlayer } from "../models/Player";
import Game, { IGame } from "../models/Game";
import PointPlaceComponent from "./PointPlaceGraphComponent";
import { Component, Prop, Vue } from "vue-property-decorator";

@Component({
    components: {
        PointPlaceComponent,
        PlayerComponent,
        ExistingGameOptionComponent
    }
})
export default class KartGame extends Vue {
    players: Player[] = [];
    numRaces: number = 8;
    allExistingGames: IGame[] = [];
    inProgressGames: IGame[] = [];
    game: Game | null = null;
    pendingName: string = "";
    playersFromDatabase: IPlayer[] = [];
    showFinishedGames: boolean = false;
    async mounted() {
        await DatabaseManager.init();
        this.playersFromDatabase = await DatabaseManager.getPlayers();
        this.allExistingGames = await DatabaseManager.getAllGames(true);
        this.inProgressGames = this.allExistingGames.filter(
            g => g.numRaces > g.history.length
        );
    }
    async startGame() {
        this.game = new Game(this.players, this.numRaces);
        await this.game.init();
        this.game.startGame();
    }
    get gamesToShow() {
        return this.showFinishedGames
            ? this.allExistingGames
            : this.inProgressGames;
    }
    loadGame(gameToLoad: IGame) {
        this.players = gameToLoad.players.map(
            playerId =>
                new Player(
                    this.playersFromDatabase.find(
                        player => player.id === playerId
                    ) || { name: "uh-oh" }
                )
        );
        this.numRaces = gameToLoad.numRaces;
        this.game = new Game(
            this.players,
            this.numRaces,
            gameToLoad.history,
            gameToLoad.id
        );
    }
    async addPlayer(existingPlayer?: IPlayer) {
        if (!existingPlayer) {
            if (!this.pendingName) {
                return;
            }
            const id = await DatabaseManager.addPlayer(this.pendingName);
            existingPlayer = { name: this.pendingName, id };
        }
        this.players.push(new Player(existingPlayer));
        this.pendingName = "";
    }
    undo() {
        if (this.game) {
            this.game.undo();
        }
    }
    newGame() {
        this.game = null;
        this.pendingName = "";
        this.players = [];
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
            n => !this.players.some(p => p.id === n.id)
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
