<template>
    <v-list-item three-line @click="$emit('load')">
        <v-list-item-content>
            <v-list-item-title>{{ playerNameString }}</v-list-item-title>
            <v-list-item-subtitle>{{ dateString }}</v-list-item-subtitle>
            <v-list-item-subtitle
                >{{ gameDetailsString }} -
                {{ progressString }}</v-list-item-subtitle
            >
        </v-list-item-content>

        <v-list-item-action>
            <v-btn icon ripple @click.stop.prevent="$emit('delete')">
                <v-icon color="red darken-1">mdi-delete</v-icon>
            </v-btn>
        </v-list-item-action>
    </v-list-item>
</template>

<script lang="ts">
import DatabaseManager from "../MongoDatabaseManager";
import { Component, Prop, Vue } from "vue-property-decorator";
import { IPlayer } from "../models/Player";
import { IGame } from "../models/Game";
import { CC, ComDifficulty, Items } from "../models/Enums";
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
    get gameDetailsString() {
        return `${this.game.cc ? CC[this.game.cc].label + " - " : ""}${
            this.game.items ? Items[this.game.items].label + " - " : ""
        }${this.game.com ? ComDifficulty[this.game.com].label : ""}`;
    }
    get dateString() {
        if (this.game.date) {
            return new Date(this.game.date).toLocaleString();
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
