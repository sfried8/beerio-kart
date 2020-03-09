<template>
    <div>
        <div>
            {{ name }}
        </div>
        <div>Total games: {{ totalGames }}</div>
        <div>Total races: {{ totalRaces }}</div>
        <div>Favorite course: {{ favoriteCourse }}</div>
        <div>Best course: {{ bestCourse }}</div>
        <div>Worst course: {{ worstCourse }}</div>
        <div class="graph-container">
            <div class="graph-inner">
                <point-place-graph-component
                    :players="playerArray"
                    :datasets="datapoints"
                >
                </point-place-graph-component>
            </div>
            <div class="graph-panel">
                <vue-select
                    multiple
                    placeholder="Filter courses"
                    :options="filterOptions"
                    v-model="filteredCourses"
                />
                <vue-select
                    multiple
                    v-model="otherPlayers"
                    :options="playersFromDatabase"
                    label="name"
                    placeholder="Compare Player"
                />
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import DatabaseManager from "../MongoDatabaseManager";
import Player, { IPlayer } from "../models/Player";
import { Component, Prop, Vue, Watch } from "vue-property-decorator";
import { IDataPoint } from "../models/DataPoint";
import { IPlayerData } from "@/DatabaseManager";
import PointPlaceGraphComponent from "@/components/PointPlaceGraphComponent.vue";
import * as Util from "@/Util";
import Course from "../models/Course";
@Component({
    components: { PointPlaceGraphComponent }
})
export default class PlayerPage extends Vue {
    filteredCourses: { id: number; label: string }[] = [];
    player: IPlayerData | null = null;
    otherPlayers: IPlayer[] = [];
    playersFromDatabase: IPlayer[] = [];
    otherPlayerData: Record<string, IPlayerData | null> = {};
    async mounted() {
        await DatabaseManager.init();
        this.player =
            (await DatabaseManager.getPlayerById(this.$route.params.id)) ||
            null;
        this.playersFromDatabase = await DatabaseManager.getPlayers();
    }
    get datapoints() {
        if (this.player && this.player.datapoints) {
            const allDatapoints = [
                this.player.datapoints,
                ...this.otherPlayerDatapoints
            ].map(dps =>
                dps.filter(
                    dp => !this.filteredCourses.some(c => c.id === dp.course)
                )
            );
            return allDatapoints;
        }
        return [];
    }
    @Watch("otherPlayers")
    onOtherPlayersChanged(val: IPlayer[]) {
        val.forEach(p => {
            if (p._id) {
                if (this.otherPlayerData[p._id] === undefined) {
                    this.$set(this.otherPlayerData, p._id, null);
                    DatabaseManager.getPlayerById(p._id).then(data => {
                        if (data && p._id) {
                            this.$set(this.otherPlayerData, p._id, data);
                        }
                    });
                }
            }
        });
    }
    get otherPlayerDatapoints() {
        const playerData: IDataPoint[][] = [];
        this.otherPlayers.forEach(other => {
            if (other._id) {
                const otherData = this.otherPlayerData[other._id];
                if (otherData && otherData.datapoints) {
                    playerData.push(otherData.datapoints);
                }
            }
        });
        return playerData;
    }
    get playerArray() {
        return this.player ? [this.player.player, ...this.otherPlayers] : [];
    }
    get name() {
        if (this.player) {
            return this.player.player.name;
        }
        return "";
    }
    get totalGames() {
        if (!this.player) {
            return 0;
        }
        return this.player.games.length;
    }
    get totalRaces() {
        if (!this.player) {
            return 0;
        }
        return this.player.games.reduce(
            (acc, cur) => acc + cur.history.length,
            0
        );
    }
    get games() {
        if (this.player) {
            return this.player.games.map(g => g._id).join(", ");
        }
        return "";
    }
    get favoriteCourse() {
        if (!this.player) {
            return "";
        }
        const course = Util.mode(
            (this.player.datapoints || []).map(d => d.course)
        );
        if (!course.value) {
            return "-";
        }
        return `${Course[course.value].label} (${course.frequency} plays)`;
    }
    get bestCourse() {
        if (!this.player || !this.player.datapoints) {
            return "";
        }
        const course = Util.bestAndWorstCourse(this.player.datapoints).best;
        if (course) {
            return Course[course].label;
        }
        return "-";
    }
    get worstCourse() {
        if (!this.player || !this.player.datapoints) {
            return "";
        }
        const course = Util.bestAndWorstCourse(this.player.datapoints).worst;
        if (course) {
            return Course[course].label;
        }
        return "-";
    }
    get filterOptions() {
        if (!this.player || !this.player.datapoints) {
            return [];
        }
        return Util.uniquify(
            this.player.datapoints.map(dp => dp.course || 0)
        ).map(cid => Course[cid]);
    }
}
</script>
<style lang="less">
.graph-container {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: space-evenly;
    width: 90vw;
    margin: 2vh auto;
}
.graph-inner {
    width: 80%;
}
.graph-panel {
    width: 18%;
}
@media screen and (max-width: 1000px) {
    .graph-inner {
        width: 100%;
    }
    .graph-panel {
        width: 75%;
    }
}
</style>
