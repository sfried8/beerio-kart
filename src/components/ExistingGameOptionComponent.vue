<template>
    <div class="recent-game" @click="$emit('load')">
        <div class="existing-option-id">#{{ game._id }}</div>
        <div
            class="existing-option-delete"
            @click.stop.prevent="$emit('delete')"
        >
            {{ deleteContent }}
        </div>
        <div class="existing-option-data">
            <div>{{ dateString }}</div>
            <div>
                {{ playerNameString }}
            </div>
            <div>
                {{ progressString }}
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import DatabaseManager from "../MongoDatabaseManager";
import { Component, Prop, Vue } from "vue-property-decorator";
import { IPlayer } from "../models/Player";
import { IGame } from "../models/Game";
@Component
export default class ExistingGameOptionComponent extends Vue {
    @Prop() public players!: IPlayer[];
    @Prop() public game!: IGame;

    get playerNameString() {
        return this.players.map(p => p.name).join(", ");
    }
    get progressString() {
        return (
            (this.game.history ? this.game.history.length : 0) +
            "/" +
            this.game.numRaces +
            " races"
        );
    }
    get dateString() {
        if (this.game.date) {
            return this.game.date.toLocaleString("en-US");
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
.existing-option-data {
    margin: 2vh auto 1vh auto;
}
</style>
