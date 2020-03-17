<template>
    <v-app>
        <v-app-bar fixed app color="primary" dark>
            <v-app-bar-nav-icon @click="drawer = true"></v-app-bar-nav-icon>
            <v-toolbar-title class="pipe-dream"
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
        </v-app-bar>
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

export default Vue.extend({
    name: "App",

    data: () => ({
        drawer: false
    })
});
</script>
<style lang="less">
@font-face {
    font-family: "PipeDream";
    src: url("./assets/PipeDream.ttf");
}
.pipe-dream {
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
