<template>
    <v-app>
        <v-app-bar fixed app color="primary" dark>
            <v-app-bar-nav-icon @click="drawer = true"></v-app-bar-nav-icon>
            <v-toolbar-title class="pipe-dream-title" @click="$router.push('/')"
                ><span class="pipe-dream-blue">B</span
                ><span class="pipe-dream-yellow">e</span
                ><span class="pipe-dream-red">e</span
                ><span class="pipe-dream-green">r</span
                ><span class="pipe-dream-yellow">i</span
                ><span class="pipe-dream-blue">o</span
                ><span class="pipe-dream-red"> K</span
                ><span class="pipe-dream-green">a</span
                ><span class="pipe-dream-yellow">r</span
                ><span class="pipe-dream-blue">t</span></v-toolbar-title
            >
            <v-spacer></v-spacer>

            <v-btn
                icon
                v-if="offlineMode"
                @click.stop="() => (offlineDialog = true)"
            >
                <v-icon>mdi-wifi-off</v-icon>
            </v-btn>
        </v-app-bar>
        <v-dialog v-model="offlineDialog" width="500">
            <v-card>
                <v-card-title class="headline grey lighten-2" primary-title>
                    You're in Offline Mode
                </v-card-title>
                <v-card-text>
                    You can still play Beerio Kart, but your results will not be
                    saved</v-card-text
                >
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="primary" text @click="offlineDialog = false">
                        OK
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
        <v-navigation-drawer v-model="drawer" app temporary>
            <v-list nav dense>
                <v-list-item-group active-class="blue--text text--accent-4">
                    <v-list-item to="/">
                        <v-list-item-icon>
                            <v-icon>mdi-home</v-icon>
                        </v-list-item-icon>
                        <v-list-item-title>Home</v-list-item-title>
                    </v-list-item>

                    <v-list-item to="/newgame">
                        <v-list-item-icon>
                            <v-icon>mdi-plus-circle</v-icon>
                        </v-list-item-icon>
                        <v-list-item-title>New Game</v-list-item-title>
                    </v-list-item>
                    <v-list-item to="/loadgame">
                        <v-list-item-icon>
                            <v-icon>mdi-history</v-icon>
                        </v-list-item-icon>
                        <v-list-item-title>Resume Game</v-list-item-title>
                    </v-list-item>
                    <v-list-item to="/searchplayer">
                        <v-list-item-icon>
                            <v-icon>mdi-account</v-icon>
                        </v-list-item-icon>
                        <v-list-item-title>Players</v-list-item-title>
                    </v-list-item>
                </v-list-item-group>
            </v-list>
        </v-navigation-drawer>
        <v-content>
            <router-view />
        </v-content>
    </v-app>
</template>

<script lang="ts">
import Vue from "vue";
import MongoFallbackManager from "./MongoDatabaseManager";

export default Vue.extend({
    name: "App",

    data: () => ({
        drawer: false,
        offlineDialog: false,
        MongoFallbackManager
    }),
    mounted() {
        this.MongoFallbackManager.init();
    },
    computed: {
        offlineMode() {
            return !this.MongoFallbackManager.initialized;
        }
    }
});
</script>
<style lang="less">
body {
    font-family: "Roboto";
}
@font-face {
    font-family: "PipeDream";
    src: url("./assets/PipeDream.ttf");
}
.pipe-dream-title {
    cursor: pointer;
    user-select: none;
    font-family: "PipeDream";
    font-size: 2rem !important;
    -webkit-text-stroke: 1px black;
    text-shadow: black 1px 1px 2px;
}
.pipe-dream-red {
    color: #fd3332;
}
.pipe-dream-green {
    color: #22ba31;
}
.pipe-dream-yellow {
    color: #ffc61d;
}
.pipe-dream-blue {
    color: #2a78fe;
}
</style>
