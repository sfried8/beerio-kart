<template>
    <div class="pa-5">
        <div class="subtitle-1">Players</div>
        <v-dialog
            v-model="newPlayerDialog"
            style="max-width:900px;margin:auto;"
        >
            <v-card style="height:70vh;">
                <v-card-subtitle>
                    Add existing player
                </v-card-subtitle>
                <v-card-text>
                    <vue-select
                        :options="availablePlayers"
                        label="name"
                        @input="limitSelections"
                        v-model="playerToAdd"
                        placeholder="Add Player"
                    />
                </v-card-text>
                <v-divider></v-divider>
                <v-card-subtitle>
                    Create new player
                </v-card-subtitle>
                <v-card-text>
                    <v-text-field
                        v-model="pendingPlayerName"
                        @submit="createPlayer"
                        placeholder="Player Name"
                    />
                    <v-btn @click="createPlayer">
                        Create Player
                    </v-btn>
                </v-card-text>
            </v-card>
        </v-dialog>
        <v-simple-table style="width:90vw;">
            <thead>
                <tr>
                    <th>Name</th>
                    <th>Character</th>
                    <th>Vehicle</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(p, i) in players" :key="p._id">
                    <td>{{ p.name }}</td>
                    <td>
                        <!-- calculatePosition="calculatePosition" -->
                        <vue-select
                            append-to-body
                            :clearable="false"
                            v-model="characters[i]"
                            :options="charactertypes"
                            placeholder="Character"
                        />
                    </td>
                    <td>
                        <!-- calculatePosition="calculatePosition" -->
                        <vue-select
                            append-to-body
                            :clearable="false"
                            v-model="vehicles[i]"
                            :options="vehicletypes"
                            placeholder="Vehicle"
                        />
                    </td>
                </tr>
            </tbody>
        </v-simple-table>
        <v-btn color="blue" class="my-5" @click="newPlayerDialog = true">
            Add Player
        </v-btn>
        <div class="my-12"></div>
        <v-divider class="my-5"></v-divider>
        <div class="subtitle-1">Config</div>
        <div style="margin:3vh;margin-bottom:0;">
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

        <div style="max-width:900px;margin:auto;">
            <vue-select
                class="ma-3"
                :clearable="false"
                v-model="cc"
                :options="ccs"
                placeholder="CC"
            />
            <vue-select
                class="ma-3"
                :clearable="false"
                v-model="comDifficulty"
                :options="comDifficulties"
                placeholder="COM Difficulty"
            />
            <vue-select
                class="ma-3"
                :clearable="false"
                v-model="items"
                :options="itemtypes"
                placeholder="Items"
            />
        </div>
        <div class="my-12"></div>
        <v-divider class="my-5"></v-divider>
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
import { Character, CC, ComDifficulty, Items, Vehicle } from "../models/Enums";
import { Component, Prop, Vue } from "vue-property-decorator";

@Component({})
export default class NewGame extends Vue {
    newPlayerDialog: boolean = false;
    pendingPlayerName: string = "";
    players: IPlayer[] = [];
    vehicles: { id: number; label: string }[] = [];
    characters: { id: number; label: string }[] = [];
    playerToAdd: IPlayer | null = null;
    cc: { id: number; label: string } = CC[3];
    items: { id: number; label: string } = Items[1];
    comDifficulty: { id: number; label: string } = ComDifficulty[3];
    numRaces: number = 8;
    playersFromDatabase: IPlayer[] = [];
    async mounted() {
        await DatabaseManager.init();
        this.playersFromDatabase = await DatabaseManager.getPlayers();
        while (this.characters.length < 4) {
            this.characters.push(Character[0]);
        }
        while (this.vehicles.length < 4) {
            this.vehicles.push(Vehicle[0]);
        }
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
            date: new Date(),
            cc: this.cc.id,
            items: this.items.id,
            com: this.comDifficulty.id,
            vehicles: this.vehicles.map(v => v.id),
            characters: this.characters.map(c => c.id)
        });
        this.$router.push("/game/" + gameId);
    }
    get availablePlayers() {
        return this.playersFromDatabase.filter(
            n => !this.players.some(p => p._id === n._id)
        );
    }
    get ccs() {
        return CC;
    }
    get comDifficulties() {
        return ComDifficulty;
    }
    get itemtypes() {
        return Items;
    }
    get vehicletypes() {
        return Vehicle;
    }
    get charactertypes() {
        return Character;
    }
    get racePresets() {
        return [4, 6, 8, 12, 16, 24, 32, 48];
    }
    limitSelections(e: IPlayer) {
        if (e) {
            this.players.push(e);
            this.newPlayerDialog = false;
            this.pendingPlayerName = "";
            this.playerToAdd = null;
        }
    }
    createPlayer() {
        if (this.pendingPlayerName) {
            this.players.push({ name: this.pendingPlayerName });
            this.pendingPlayerName = "";
            this.newPlayerDialog = false;
        }
    }
    // calculatePosition (dropdownList, component, {width}) {

    // }
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
