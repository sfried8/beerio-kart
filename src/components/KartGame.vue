<template>
    <div class="kart-game">
        <div v-if="roundNumber >= 0">
            <div>Round {{ roundNumber }}</div>

            <div v-for="player in players" :key="player.name">
                <player-component v-bind.sync="player"></player-component>
            </div>

            <div class="button-panel">
                <button @click="undo" v-if="roundNumber > 0" class="undo">
                    undo
                </button>

                <button @click="promptAll" class="next">
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
                @keypress.enter="addPlayer"
                v-model="pendingName"
                placeholder="Name"
            />
            <button @click="addPlayer">Add</button>
            <div
                class="recent-name-container"
                v-if="availableRecentNames.length"
            >
                Recent:
                <div
                    v-for="n in availableRecentNames"
                    :key="n"
                    @click="
                        pendingName = n;
                        addPlayer();
                    "
                    class="recent-name"
                >
                    {{ n }}
                </div>
            </div>
            <button v-if="players.length" @click="startGame">start</button>
        </div>
    </div>
</template>

<script lang="ts">
/* eslint-disable */
import { KeypadPrompt } from "./KeypadPrompt";
import * as Util from "../Util";
import PlayerComponent from "./PlayerComponent.vue";

function printScores(players: Player[]) {
    players.forEach(p => {
        p.messages = p.currentRoundPoints.displayStrings();
    });
}

import Player from "../Player";
import PointPlaceComponent from "./PointPlaceGraphComponent";
import { Component, Prop, Vue } from "vue-property-decorator";

@Component({
    components: { PointPlaceComponent, PlayerComponent }
})
export default class KartGame extends Vue {
    players: Player[] = [];
    roundNumber: number = -1;
    pendingName: string = "";
    recentNames: string[] = [];

    mounted() {
        const existingGameStr = window.localStorage.getItem("game");
        if (existingGameStr) {
            const existingGame = JSON.parse(existingGameStr);
            if (
                existingGame &&
                existingGame.players &&
                existingGame.roundNumber
            ) {
                this.roundNumber = existingGame.roundNumber;

                existingGame.players.forEach((p: Player, i: number) => {
                    const player = new Player(p);
                    this.players.push(player);
                    player.playerColor = [
                        "#fae451",
                        "#6cecfd",
                        "#fe727d",
                        "#3ee413"
                    ][i];
                });
                printScores(this.players);
            }
        }
        this.recentNames = JSON.parse(
            window.localStorage.getItem("recentNames") || "[]"
        );
    }
    startGame() {
        this.roundNumber = 0;
        this.players.forEach((p, i) => {
            this.recentNames.unshift(p.name);
            p.playerColor = ["#fae451", "#6cecfd", "#fe727d", "#3ee413"][i];
        });
        this.recentNames = Util.uniquify(this.recentNames);
        window.localStorage.setItem(
            "recentNames",
            JSON.stringify(this.recentNames)
        );
    }
    addPlayer() {
        if (!this.pendingName) {
            return;
        }
        this.players.push(new Player(this.pendingName));
        this.pendingName = "";
    }
    round() {
        this.players.forEach(p => (p.numPlayers = this.players.length));
        this.roundNumber += 1;
        const lastPlace = Math.max(...this.players.map(p => p.pendingPoints));
        for (let p of this.players) {
            p.saveState();
            const addedPoints = p.pendingPoints;
            p.pendingPoints = 0;
            p.points.combineGroup(p.currentRoundPoints);
            p.currentRoundPoints.clear();
            p.addRacePoints(addedPoints, lastPlace);
            if (this.roundNumber % 4 === 0) {
                p.addKanpaiPoint(this.roundNumber);
            }
        }
        while (true) {
            for (let p of this.players) {
                const opponents = this.players.filter(x => x !== p);

                while (p.extraDict.length) {
                    const extraPoint = p.extraDict.shift();
                    if (extraPoint) {
                        opponents.forEach(o => {
                            o.addBonusPoint(p.name, extraPoint);
                        });
                    }
                }
            }

            if (!this.players.some(x => x.extraDict.length > 0)) {
                printScores(this.players);
                this.saveGame();
                return;
            }
        }
    }
    undo() {
        this.roundNumber -= 1;
        for (let p of this.players) {
            p.undo();
        }
        printScores(this.players);
    }
    saveGame() {
        window.localStorage.setItem(
            "game",
            JSON.stringify({
                roundNumber: this.roundNumber,
                players: this.players.map(({ messages, ...p }) => p)
            })
        );
    }
    newGame() {
        this.roundNumber = -1;
        this.pendingName = "";
        this.players = [];
    }
    promptAll() {
        let prom: any = Promise.resolve();
        this.players.forEach(p => {
            prom = prom
                .then((_: any) => KeypadPrompt(p.name))
                .then((val: number) => (p.pendingPoints = val));
        });
        prom = prom.then((_: any) => this.round());
    }
    get availableRecentNames() {
        return this.recentNames.filter(
            n => !this.players.some(p => p.name === n)
        );
    }
    get chartData() {
        const trendlines: any[] = [];
        this.players.forEach(p => {
            const playerAverages: number[][] = [];
            p.history.forEach(h => {
                const numPoints = [
                    ...Object.values(h.points.points),
                    ...Object.values(h.currentRoundPoints.points)
                ].reduce((acc, cur) => acc + cur.length, 0);
                if (!playerAverages[numPoints]) {
                    playerAverages[numPoints] = [];
                }
                playerAverages[numPoints].push(h.place);
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
                backgroundColor: p.playerColor,
                borderColor: p.playerColor,
                fill: false,
                type: "line"
            });
        });
        return {
            datasets: [
                ...this.players.map(p => ({
                    label: p.name,
                    data: p.history.map(h => ({
                        x: [
                            ...Object.values(h.points.points),
                            ...Object.values(h.currentRoundPoints.points)
                        ].reduce((acc, cur) => acc + cur.length, 0),
                        y: h.place
                    })),
                    backgroundColor: p.playerColor,
                    pointRadius: 6
                })),
                ...trendlines
            ]
        };
    }
    get options() {
        return {
            // responsive: true,
            scales: {
                yAxes: [
                    {
                        ticks: {
                            max: 12,
                            min: 1,
                            stepSize: 1
                        }
                    }
                ],
                xAxes: [
                    {
                        ticks: {
                            max: 1,
                            min: 12,
                            stepSize: 1
                        }
                    }
                ]
            }
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
</style>
