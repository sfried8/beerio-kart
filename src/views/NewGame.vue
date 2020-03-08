<template>
    <div class="kart-game">
        <div style="max-width:900px;margin:auto;">
            <v-select
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
            <label for="numraces">Number of races: </label>
            <input name="numraces" v-model="numRaces" />
        </div>
        <div>
            <button v-if="players.length" @click="startGame">Start Game</button>
        </div>
    </div>
</template>

<script lang="ts">
import DatabaseManager from "../MongoDatabaseManager";

import Player, { IPlayer } from "../models/Player";
import { Component, Prop, Vue } from "vue-property-decorator";

@Component({})
export default class NewGame extends Vue {
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
