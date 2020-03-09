<template>
    <div class="kart-game">
        <div style="max-width:900px;margin:auto;">
            <vue-select
                :options="playersFromDatabase"
                label="name"
                placeholder="Find Player"
                @input="onSelected"
            />
        </div>
    </div>
</template>

<script lang="ts">
import DatabaseManager from "../MongoDatabaseManager";

import Player, { IPlayer } from "../models/Player";
import { Component, Prop, Vue } from "vue-property-decorator";

@Component({})
export default class NewGame extends Vue {
    playersFromDatabase: IPlayer[] = [];
    async mounted() {
        await DatabaseManager.init();
        this.playersFromDatabase = await DatabaseManager.getPlayers();
    }
    onSelected(value: IPlayer) {
        this.$router.push("/player/" + value._id);
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
