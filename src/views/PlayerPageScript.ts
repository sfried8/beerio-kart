import DatabaseManager from "../MongoDatabaseManager";
import Player, { IPlayer } from "../models/Player";
import { Component, Prop, Vue, Watch } from "vue-property-decorator";
import { IDataPoint } from "../models/DataPoint";
import { IPlayerData } from "@/DatabaseManager";
import PointPlaceGraphComponent from "@/components/PointPlaceGraphComponent.vue";
import * as Util from "@/Util";
import {
    Course,
    Character,
    Vehicle,
    IDataValue,
    CC,
    Items,
    ComDifficulty
} from "../models/Enums";
@Component({
    components: { PointPlaceGraphComponent }
})
export default class PlayerPage extends Vue {
    player: IPlayerData | null = null;
    otherPlayers: IPlayer[] = [];
    playersFromDatabase: IPlayer[] = [];
    otherPlayerData: Record<string, IPlayerData | null> = {};
    async mounted() {
        await DatabaseManager.init();
        this.player =
            (await DatabaseManager.getPlayerById(this.$route.params.id)) ||
            null;
        this.itemsSelections = [...this.itemsOptions];
        this.courseSelections = [...this.courseOptions];
        this.ccSelections = [...this.ccOptions];
        this.vehicleSelections = [...this.vehicleOptions];
        this.difficultySelections = [...this.difficultyOptions];
        this.weightSelections = [...this.weightOptions];
        this.playersFromDatabase = await DatabaseManager.getPlayers();
    }
    get datapoints() {
        if (this.player && this.player.datapoints) {
            const allDatapoints = [
                this.player.datapoints,
                ...this.otherPlayerDatapoints
            ].map(dps =>
                dps.filter(dp => {
                    const showCourse = this.courseSelections.some(
                        c => (c.id || 0) === (dp.course || 0)
                    );
                    const showCc = this.ccSelections.some(
                        c => (c.id || 0) === (dp.cc || 0)
                    );
                    const showVehicle = this.vehicleSelections.some(
                        c => (c.id || 0) === (dp.vehicle || 0)
                    );
                    const showItems = this.itemsSelections.some(
                        c => (c.id || 0) === (dp.items || 0)
                    );
                    const showDifficulty = this.difficultySelections.some(
                        c => (c.id || 0) === (dp.com || 0)
                    );

                    const showWeight = this.weightSelections.includes(
                        ["Unknown", "Light", "Medium", "Heavy"][
                            Character[dp.character || 0].weight
                        ]
                    );
                    return (
                        showCourse &&
                        showCc &&
                        showDifficulty &&
                        showItems &&
                        showVehicle &&
                        showWeight
                    );
                })
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
    getModeOfProperty(property: string) {
        if (!this.player || !this.player.datapoints) {
            return { value: null, frequency: 0 };
        }
        return Util.mode(
            this.player.datapoints.map(dp => (dp as any)[property])
        );
    }
    get favoriteCharacter() {
        return (
            Character[this.getModeOfProperty("character").value]?.label ?? ""
        );
    }
    get favoriteVehicle() {
        return Vehicle[this.getModeOfProperty("vehicle").value]?.label ?? "";
    }
    get filterOptions() {
        if (!this.player || !this.player.datapoints) {
            return [];
        }
        return Util.uniquify(
            this.player.datapoints.map(dp => dp.course || 0)
        ).map(cid => Course[cid]);
    }
    get stats() {
        return [
            { label: "Total Games", value: this.totalGames },
            {
                label: "Total Races",
                value: this.totalRaces
            },
            { label: "Favorite Course", value: this.favoriteCourse },
            { label: "Best Course", value: this.bestCourse },
            { label: "Worst Course", value: this.worstCourse },
            { label: "Favorite Character", value: this.favoriteCharacter },
            { label: "Favorite Vehicle", value: this.favoriteVehicle }
        ];
    }
    optionsGetter(
        getFieldFunc: (dp: IDataPoint) => number | undefined,
        dataValues: IDataValue[]
    ) {
        if (!this.player || !this.player.datapoints) {
            return [];
        }
        return Util.uniquify(this.player.datapoints.map(getFieldFunc))
            .sort((a, b) => (a || 0) - (b || 0))
            .map(x => dataValues[x || 0]);
    }
    get courseOptions() {
        return this.optionsGetter(dp => dp.course, Course);
    }
    get ccOptions() {
        return this.optionsGetter(dp => dp.cc, CC);
    }
    get weightOptions() {
        if (!this.player || !this.player.datapoints) {
            return [];
        }
        return Util.uniquify(
            this.player.datapoints.map(
                dp => Character[dp.character || 0].weight
            )
        )
            .sort((a, b) => a - b)
            .map(cid => ["Unknown", "Light", "Medium", "Heavy"][cid]);
    }
    get vehicleOptions() {
        return this.optionsGetter(dp => dp.vehicle, Vehicle);
    }
    get itemsOptions() {
        return this.optionsGetter(dp => dp.items, Items);
    }
    get difficultyOptions() {
        return this.optionsGetter(dp => dp.com, ComDifficulty);
    }

    courseSelections: IDataValue[] = [];
    ccSelections: IDataValue[] = [];
    weightSelections: string[] = [];
    vehicleSelections: IDataValue[] = [];
    itemsSelections: IDataValue[] = [];
    difficultySelections: IDataValue[] = [];

    selectAll(optionsArray: IDataValue[] | string[]) {
        if (optionsArray === this.courseOptions) {
            this.courseSelections = [...optionsArray];
        } else if (optionsArray === this.ccOptions) {
            this.ccSelections = [...optionsArray];
        } else if (optionsArray === this.weightOptions) {
            this.weightSelections = [...optionsArray];
        } else if (optionsArray === this.vehicleOptions) {
            this.vehicleSelections = [...optionsArray];
        } else if (optionsArray === this.itemsOptions) {
            this.itemsSelections = [...optionsArray];
        } else if (optionsArray === this.difficultyOptions) {
            this.difficultySelections = [...optionsArray];
        }
    }
    deselectAll(selectedArray: IDataValue[] | string[]) {
        selectedArray.splice(0, selectedArray.length);
    }
}
