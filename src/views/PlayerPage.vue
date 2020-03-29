<template>
    <div class="ma-5">
        <h2 class="text-center">
            {{ name }}
        </h2>

        <!-- <div>
            <div>Total games:</div>
            <div>Total races:</div>
            <div>Favorite course:</div>
            <div>Best course:</div>
            <div>Worst course:</div>
        </div>
        <div>{{ totalGames }}</div>
        <div>{{ totalRaces }}</div>
        <div
            style="width:100%;overflow:hidden;white-space:nowrap; text-overflow:ellipsis"
        >
            {{ favoriteCourse }}
        </div>
        <div>{{ bestCourse }}</div>
        <div>{{ worstCourse }}</div> -->
        <div class="graph-container">
            <div class="graph-inner">
                <point-place-graph-component
                    :players="playerArray"
                    :datasets="datapoints"
                >
                </point-place-graph-component>
            </div>
            <div class="graph-panel">
                <v-expansion-panels accordion class="filter-panel">
                    <span>Filter</span>
                    <v-expansion-panel>
                        <v-expansion-panel-header>
                            Courses
                        </v-expansion-panel-header>
                        <v-expansion-panel-content>
                            <v-row>
                                <v-btn
                                    text
                                    small
                                    @click="() => selectAll(courseOptions)"
                                    >Show all</v-btn
                                >
                                <v-btn
                                    text
                                    small
                                    @click="() => deselectAll(courseSelections)"
                                    >Hide all</v-btn
                                >
                            </v-row>
                            <v-switch
                                dense
                                style="margin-right:3vw;margin-top:0;"
                                v-model="courseSelections"
                                v-for="c in courseOptions"
                                :key="c.id"
                                :label="c.label"
                                :value="c"
                            />
                        </v-expansion-panel-content>
                    </v-expansion-panel>
                    <v-expansion-panel>
                        <v-expansion-panel-header>
                            Weight Class
                        </v-expansion-panel-header>
                        <v-expansion-panel-content>
                            <v-switch
                                dense
                                style="margin-right:3vw;margin-top:0;"
                                v-model="weightSelections"
                                v-for="w in weightOptions"
                                :key="w"
                                :label="w"
                                :value="w"
                            />
                        </v-expansion-panel-content>
                    </v-expansion-panel>
                    <v-expansion-panel>
                        <v-expansion-panel-header>
                            Vehicle Type
                        </v-expansion-panel-header>
                        <v-expansion-panel-content>
                            <v-switch
                                dense
                                style="margin-right:3vw;margin-top:0;"
                                v-model="vehicleSelections"
                                v-for="v in vehicleOptions"
                                :key="v.id"
                                :label="v.label"
                                :value="v"
                            />
                        </v-expansion-panel-content>
                    </v-expansion-panel>
                    <v-expansion-panel>
                        <v-expansion-panel-header>
                            CC
                        </v-expansion-panel-header>
                        <v-expansion-panel-content>
                            <v-switch
                                dense
                                style="margin-right:3vw;margin-top:0;"
                                v-model="ccSelections"
                                v-for="c in ccOptions"
                                :key="c.id"
                                :label="c.label"
                                :value="c"
                            />
                        </v-expansion-panel-content>
                    </v-expansion-panel>
                    <v-expansion-panel>
                        <v-expansion-panel-header>
                            COM Difficulty
                        </v-expansion-panel-header>
                        <v-expansion-panel-content>
                            <v-switch
                                dense
                                style="margin-right:3vw;margin-top:0;"
                                v-model="difficultySelections"
                                v-for="c in difficultyOptions"
                                :key="c.id"
                                :label="c.label"
                                :value="c"
                            />
                        </v-expansion-panel-content>
                    </v-expansion-panel>
                    <v-expansion-panel>
                        <v-expansion-panel-header>
                            Items
                        </v-expansion-panel-header>
                        <v-expansion-panel-content>
                            <v-switch
                                dense
                                style="margin-right:3vw;margin-top:0;"
                                v-model="itemsSelections"
                                v-for="i in itemsOptions"
                                :key="i.id"
                                :label="i.label"
                                :value="i"
                            />
                        </v-expansion-panel-content>
                    </v-expansion-panel>
                </v-expansion-panels>
                <!-- <vue-select
                    multiple
                    v-model="otherPlayers"
                    :options="playersFromDatabase"
                    label="name"
                    placeholder="Compare Player"
                /> -->
            </div>
        </div>
        <v-divider class="d-lg-none my-4"></v-divider>
        <v-simple-table class="stats-panel">
            <tbody>
                <tr v-for="stat in stats" :key="stat.label">
                    <td>{{ stat.label }}</td>
                    <td>{{ stat.value }}</td>
                </tr>
            </tbody>
        </v-simple-table>
    </div>
</template>

<script src="./PlayerPageScript.ts" />
<style lang="less">
.graph-container {
    display: flex;
    flex-direction: row-reverse;
    flex-wrap: wrap;
    justify-content: space-evenly;
    width: 90vw;
    margin: 2vh auto;
}
.filter-panel {
    position: absolute;
    width: 15%;
}
.stats-panel {
    left: 25%;
    width: 75%;
    max-width: 1000px;
    position: absolute;
}
.graph-inner {
    width: 80%;
}
.graph-panel {
    width: 18%;
}
@media screen and (max-width: 1000px) {
    .graph-container {
        flex-direction: row;
    }
    .graph-inner {
        width: 100%;
    }
    .graph-panel {
        width: 100%;
    }
    .stats-panel {
        left: 5%;
        width: 90%;
    }
    .filter-panel {
        position: initial;
        width: 100%;
        margin: auto;
    }
}
</style>
