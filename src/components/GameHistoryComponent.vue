<template>
    <div>
        <div v-for="s in historyStrings" :key="s">{{ s }}</div>
    </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import { IGame } from "@/models/Game";
import { IPlayer } from "@/models/Player";
import Course from "../models/Course";
import * as Util from "@/Util";

@Component({})
export default class GameHistoryComponent extends Vue {
    @Prop() public game!: IGame;
    @Prop() public players!: IPlayer[];
    get historyStrings() {
        if (!this.game) {
            return [];
        }
        return this.game.history.map(
            (turn, turnIndex) =>
                Course[this.game.courseHistory[turnIndex]].label +
                ":  " +
                this.getHistoryString(turn)
        );
    }
    getHistoryString(turn: number[]) {
        const indexedTurn = turn.map((t, i) => [t, i]);
        indexedTurn.sort((a, b) => a[0] - b[0]);
        return indexedTurn
            .map(
                result =>
                    Util.addNumberEnding(result[0]) +
                    ": " +
                    this.players[result[1]].name
            )
            .join(", ");
    }
}
</script>
<style></style>
