<template>
    <div>
        <input type="checkbox" v-model="showHistory" name="showhistory" />
        <label for="showhistory">Show history?</label>
        <point-place-scatter
            :chart-data="chartData"
            :courseNames="courseNames"
            :styles="{
                position: 'relative',
                height: '500px'
            }"
        />
    </div>
</template>

<script lang="ts">
import * as Util from "../Util";
import PlayerComponent from "./PlayerComponent.vue";
import DatabaseManager from "../MongoDatabaseManager";

import Player, { IPlayer } from "../models/Player";
import Game, { IGame } from "../models/Game";
import PointPlaceScatter from "./PointPlaceScatter";
import { Component, Prop, Vue } from "vue-property-decorator";
import { IGameData } from "../DatabaseManager";
import Course from "../models/Course";
import { IDataPoint } from "../models/DataPoint";

@Component({
    components: {
        PointPlaceScatter
    }
})
export default class PointPlaceGraphComponent extends Vue {
    showHistory: boolean = false;

    @Prop() players!: Player[];
    @Prop() datasets!: IDataPoint[][];
    @Prop() gameId!: string;
    historyDatasets: IDataPoint[][] = [];
    async mounted() {
        const data = [];
        for (const player of this.players) {
            const dps = await DatabaseManager.getDataPointsByPlayer(
                player._id || ""
            );
            data.push(dps.filter(dp => dp.gameId !== this.gameId));
        }
        this.historyDatasets = data;
    }
    get allDatasets(): IDataPoint[][] {
        if (this.showHistory) {
            return this.historyDatasets.map((ds, i) => [
                ...ds,
                ...this.datasets[i]
            ]);
        } else {
            return this.datasets;
        }
    }
    get chartData() {
        const trendlines: any[] = [];
        if (!this.allDatasets) {
            return { datasets: [] };
        }
        this.allDatasets.forEach((d, i) => {
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
                    data: this.allDatasets[i],
                    backgroundColor: p.playerColor,
                    pointRadius: 6
                })),
                ...trendlines
            ]
        };
    }
    get courseNames() {
        return this.allDatasets.map(d =>
            d.map(dp => Course[dp.course || 0].label)
        );
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
