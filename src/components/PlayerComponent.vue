<template>
    <div
        class="playerComponent"
        :style="{ 'border-left': '6px solid ' + playerColor }"
    >
        <div class="playerName">{{ name }}</div>
        <div class="totalPoints">
            {{ points.amount() + currentRoundPoints.amount() }}
        </div>
        <div v-if="currentRoundPoints.amount()">
            This round: {{ currentRoundPoints.amount() }}
            <button @click="messagesExpanded = !messagesExpanded">?</button>
        </div>
        <div v-if="messagesExpanded">
            <div v-for="m in messages" :key="m" class="message">{{ m }}</div>
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
    font-size: 24px;
}
.totalPoints {
    grid-area: total;
    font-size: 24px;
}
.playerComponent {
    margin: 15px;
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
        "name result"
        "total result";
}
@media only screen and (orientation: landscape) {
    .playerComponent {
        width: calc(50% - 60px);
    }
}
.message {
    font-weight: normal;
    font-size: small;
}
.roundResults {
    grid-area: "result";
}
</style>
