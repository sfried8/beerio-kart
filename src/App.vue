<template>
    <v-app>
        <v-app-bar app color="primary" dark>
            <v-app-bar-nav-icon @click="drawer = true"></v-app-bar-nav-icon>
            <v-toolbar-title>Beerio Kart</v-toolbar-title>
        </v-app-bar>
        <v-navigation-drawer v-model="drawer" absolute temporary>
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
