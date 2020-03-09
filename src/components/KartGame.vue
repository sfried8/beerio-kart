<template>
    <div class="kart-game">
        <div>
            <div style="height:calc(40vh - 64px)">
                <h3 style="text-align:center">Round {{ roundNumber }}</h3>

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

                    <v-btn
                        @click="promptAll"
                        color="success"
                        v-if="roundNumber < numRaces"
                    >
                        <v-icon>mdi-flag-plus</v-icon> Race
                        {{ roundNumber + 1 }}
                    </v-btn>
                </div>
            </div>
            <div style="height:60vh;">
                <v-divider></v-divider>
                <v-tabs v-model="activeTab">
                    <v-tab :key="1" ripple>
                        <v-icon>mdi-flag-checkered</v-icon>Races
                    </v-tab>
                    <v-tab :key="2" ripple>
                        <v-icon>mdi-chart-timeline-variant</v-icon>
                        {{ " Game" }}
                    </v-tab>
                    <v-tab :key="3" ripple>
                        <v-icon>mdi-chart-timeline-variant</v-icon
                        >{{ " All Time" }}
                    </v-tab>
                    <v-tab-item :key="1">
                        <GameHistoryComponent
                            v-if="game"
                            :game="game"
                            :players="players"
                        />
                    </v-tab-item>
                    <v-tab-item :key="2">
                        <GameGraphComponent
                            v-if="game"
                            :game="game"
                            :players="players"
                            :showHistory="false"
                        />
                    </v-tab-item>
                    <v-tab-item :key="3">
                        <GameGraphComponent
                            v-if="game"
                            :game="game"
                            :players="players"
                            :showHistory="true"
                        />
                    </v-tab-item>
                </v-tabs>
            </div>
            <!-- <keep-alive>
                <component
                    :is="
                        activeTab
                            ? 'GameGraphComponent'
                            : 'GameHistoryComponent'
                    "
                    v-if="game"
                    :game="game"
                    :players="players"
                />
            </keep-alive> -->
            <!-- <br /> -->
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
    activeTab: number = 0;
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
    margin-bottom: 10px;
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
