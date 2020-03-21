<template>
    <div class="history-container">
        <div
            class="history-race-container py-2 px-3"
            v-for="(s, i) in historyItems"
            :key="s.course"
        >
            <div>{{ i + 1 }}) {{ s.course }}</div>
            <div>
                <div v-for="p in s.places" :key="p">{{ p }}</div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import { IGame } from "@/models/Game";
import { IPlayer } from "@/models/Player";
import { Course } from "../models/Enums";
import * as Util from "@/Util";

@Component({})
export default class GameHistoryComponent extends Vue {
    @Prop() public game!: IGame;
    @Prop() public players!: IPlayer[];
    get historyItems() {
        if (!this.game) {
            return [];
        }
        return this.game.history.map((turn, turnIndex) => ({
            course: Course[this.game.courseHistory[turnIndex]].label,
            places: this.getHistoryItem(turn)
        }));
    }
    getHistoryItem(turn: number[]) {
        const indexedTurn = turn.map((t, i) => [t, i]);
        indexedTurn.sort((a, b) => a[0] - b[0]);
        return indexedTurn.map(
            result =>
                Util.addNumberEnding(result[0]) +
                ": " +
                this.players[result[1]].name
        );
    }
}
</script>
<style>
.history-race-container {
    display: flex;
    flex-direction: row;
    width: 100vw;
    max-width: 1000px;
    justify-content: space-between;
    text-align: left;
    margin: 2vh auto;
}
.history-container {
    display: flex;
    flex-direction: column;
    height: calc(60vh - 48px);
    overflow: auto;
}
</style>
