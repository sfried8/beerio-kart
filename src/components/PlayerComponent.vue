<template>
    <div
        class="playerComponent"
        @click.stop="messagesExpanded = true"
        :style="{ 'border-left': '6px solid ' + playerColor }"
    >
        <div class="playerName">{{ name }}</div>
        <div class="totalPoints">
            {{ points.amount() + currentRoundPoints.amount() }}
        </div>
        <v-dialog v-model="messagesExpanded" width="500">
            <v-card>
                <v-card-title class="headline grey lighten-2" primary-title>
                    {{ name }}
                </v-card-title>
                <v-card-text
                    ><div>
                        This round: {{ currentRoundPoints.amount() }}
                    </div></v-card-text
                >
                <v-divider></v-divider>
                <v-card-text>
                    <div v-for="m in messages" :key="m" class="message">
                        {{ m }}
                    </div>
                </v-card-text>

                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn
                        color="primary"
                        text
                        @click="messagesExpanded = false"
                    >
                        OK
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
        <div v-if="currentRoundPoints.amount()" class="this-round">
            This round: {{ currentRoundPoints.amount() }}
        </div>
    </div>
</template>

<script>
export default {
    props: {
        name: { type: String },
        messages: { type: Array },
        points: { type: Object },
        currentRoundPoints: { type: Object },
        pendingPoints: { type: Number },
        extraDict: { type: Array },
        playerColor: { type: String },
        history: { type: Array }
    },
    data() {
        return {
            messagesExpanded: false
        };
    },
    watch: {
        messages() {
            this.messagesExpanded = false;
        }
    }
};
</script>

<style scoped>
.playerName {
    grid-area: name;
    font-size: 18px;
    text-align: center;
}
.totalPoints {
    grid-area: total;
    font-size: 18px;
}
.playerComponent {
    margin: 10px;
    min-height: 10vh;
    user-select: none;
    padding: 10px;
    background: white;
    box-shadow: #ddd 2px 2px 10px;
    font-weight: bolder;
    display: grid;
    grid-template-columns: 1fr 6fr;
    grid-template-rows: auto auto;
    grid-template-areas:
        "name name"
        "total result";
}
@media only screen and (max-width: 1000px) {
    .playerComponent {
        margin: 0 10px;
    }
}
/* @media only screen and (orientation: landscape) { */
.playerComponent {
    width: calc(50% - 26px);
}
/* } */
.message {
    font-weight: normal;
    font-size: small;
}
.roundResults {
    grid-area: "result";
}
.this-round {
    font-size: 12px;
    font-weight: lighter;
}
</style>
