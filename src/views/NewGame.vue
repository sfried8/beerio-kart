<template>
    <div class="pa-5">
        <div style="max-width:900px;margin:auto;">
            <vue-select
                taggable
                multiple
                v-model="players"
                :options="availableOptions"
                :create-option="name => ({ name })"
                label="name"
                @input="limitSelections"
                placeholder="Add Player"
            />
        </div>
        <div style="margin:3vh">
            <v-text-field
                type="number"
                label="Number of races"
                v-model="numRaces"
            />
        </div>
        <div class="preset-container">
            <v-btn
                v-for="n in racePresets"
                :color="numRaces == n ? 'blue' : ''"
                :key="n"
                @click="() => (numRaces = n)"
                >{{ n }}</v-btn
            >
        </div>
        <div
            style="width:100%;display:flex;justify-content:center;align-items:center;"
        >
            <v-btn
                :disabled="!players.length"
                large
                color="success"
                @click="startGame"
                >Start Game</v-btn
            >
        </div>
    </div>
</template>

<script lang="ts">
import DatabaseManager from "../MongoDatabaseManager";

import Player, { IPlayer } from "../models/Player";
import { Component, Prop, Vue } from "vue-property-decorator";

@Component({})
export default class NewGame extends Vue {
    racePresets: number[] = [4, 6, 8, 12, 16, 24, 32, 48];
    players: IPlayer[] = [];
    numRaces: number = 8;
    playersFromDatabase: IPlayer[] = [];
    async mounted() {
        await DatabaseManager.init();
        this.playersFromDatabase = await DatabaseManager.getPlayers();
    }
    async startGame() {
        for (const player of this.players) {
            if (!player._id) {
                player._id = await DatabaseManager.addPlayer(player.name);
            }
        }
        const gameId = await DatabaseManager.newGame({
            players: this.players.map(({ _id }) => _id!),
            numRaces: this.numRaces,
            courseHistory: [],
            history: [],
            date: new Date()
        });
        this.$router.push("/game/" + gameId);
    }
    get availableOptions() {
        return this.playersFromDatabase.filter(
            n => !this.players.some(p => p._id === n._id)
        );
    }
    limitSelections(e: IPlayer[]) {
        if (e.length > 4) {
            e.pop();
        }
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less">
.new-game {
    padding: 15px;
}
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
.preset-container {
    display: flex;
    flex-wrap: wrap;
    flex-direction: row;
    justify-content: space-evenly;
    margin-bottom: 3vh;
    button {
        margin: 2vw;
    }
}
</style>
