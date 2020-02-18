<template>
    <div>
        <div>#{{ id }}</div>
        <div>
            {{ playerNameString }}
        </div>
        <div>
            {{ progressString }}
        </div>
    </div>
</template>

<script lang="ts">
import { getPlayerById } from "../DatabaseManager";
import { Component, Prop, Vue } from "vue-property-decorator";
@Component
export default class ExistingGameOptionComponent extends Vue {
    @Prop() public id!: number;
    @Prop() public players!: number[];
    @Prop() public numRaces!: number;
    @Prop() public history!: number[][];
    public playerNames: string[] = [];
    async mounted() {
        for (const playerId of this.players) {
            const player = await getPlayerById(playerId);
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
}
</script>

<style></style>
