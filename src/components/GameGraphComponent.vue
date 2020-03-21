<template>
    <div>
        <point-place-graph-component
            :datasets="allDatasets"
            :players="players"
        />
    </div>
</template>

<script lang="ts">
import * as Util from "../Util";
import PlayerComponent from "./PlayerComponent.vue";
import PointPlaceGraphComponent from "./PointPlaceGraphComponent.vue";
import DatabaseManager from "../MongoDatabaseManager";

import Player, { IPlayer } from "../models/Player";
import Game, { IGame } from "../models/Game";
import { Component, Prop, Vue } from "vue-property-decorator";
import { IGameData } from "../DatabaseManager";
import { Course } from "../models/Enums";
import { IDataPoint } from "../models/DataPoint";

@Component({
    components: {
        PointPlaceGraphComponent
    }
})
export default class GameGraphComponent extends Vue {
    @Prop() showHistory!: boolean;

    @Prop() players!: Player[];
    @Prop() game!: Game;
    historyDatasets: IDataPoint[][] = [];
    async mounted() {
        if (!this.showHistory) {
            return;
        }
        const data = [];
        for (const player of this.players) {
            const dps = await DatabaseManager.getDataPointsByPlayer(
                player._id || ""
            );
            data.push(dps.filter(dp => dp.gameId !== this.game._id));
        }
        this.historyDatasets = data;
    }
    get allDatasets(): IDataPoint[][] {
        if (this.showHistory) {
            return this.historyDatasets.map((ds, i) => [
                ...ds,
                ...this.game.datasets[i]
            ]);
        } else {
            return this.game.datasets;
        }
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
