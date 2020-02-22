<template>
    <div class="recent-game">
        <div class="existing-option-id">#{{ id }}</div>
        <div>{{ dateString }}</div>
        <div>
            {{ playerNameString }}
        </div>
        <div>
            {{ progressString }}
        </div>
    </div>
</template>

<script lang="ts">
import DatabaseManager from "../DatabaseManager";
import { Component, Prop, Vue } from "vue-property-decorator";
@Component
export default class ExistingGameOptionComponent extends Vue {
    @Prop() public id!: number;
    @Prop() public players!: number[];
    @Prop() public numRaces!: number;
    @Prop() public history!: number[][];
    @Prop() public date!: Date;
    public playerNames: string[] = [];
    async mounted() {
        for (const playerId of this.players) {
            const player = await DatabaseManager.getPlayerById(playerId);
            if (player) {
                this.playerNames.push(player.name);
            }
        }
    }
    get playerNameString() {
        return this.playerNames.join(", ");
    }
    get progressString() {
        return this.history.length + "/" + this.numRaces + " races";
    }
    get dateString() {
        if (this.date) {
            return this.date.toLocaleString("en-US");
        }
        return "";
    }
}
</script>

<style>
.existing-option-id {
    color: lightgray;
    text-align: left;
    position: absolute;
}
.recent-game {
    margin: 1vh auto;
    padding: 2vh;
    border: 1px #dddddd solid;
    border-radius: 1vh;
    width: 15vw;
}
</style>
