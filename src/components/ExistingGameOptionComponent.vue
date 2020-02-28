<template>
    <div class="recent-game" @click="$emit('load')">
        <div class="existing-option-id">#{{ _id }}</div>
        <div
            class="existing-option-delete"
            @click.stop.prevent="$emit('delete')"
        >
            {{ deleteContent }}
        </div>
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
import DatabaseManager from "../MongoDatabaseManager";
import { Component, Prop, Vue } from "vue-property-decorator";
@Component
export default class ExistingGameOptionComponent extends Vue {
    @Prop() public _id!: string;
    @Prop() public players!: string[];
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
        return (
            (this.history ? this.history.length : 0) +
            "/" +
            this.numRaces +
            " races"
        );
    }
    get dateString() {
        if (this.date) {
            return this.date.toLocaleString("en-US");
        }
        return "";
    }
    get deleteContent() {
        return window.innerWidth < 500 ? "X" : "Delete";
    }
}
</script>

<style>
.existing-option-id {
    color: lightgray;
    text-align: left;
    position: absolute;
}
.existing-option-delete {
    color: red;
    position: relative;
    float: right;
    cursor: pointer;
}
.recent-game {
    margin: 1vh auto;
    padding: 2vh;
    border: 1px #dddddd solid;
    border-radius: 1vh;
    min-width: 300px;
    width: 30vw;
}
</style>
