<template>
    <div class="overlay">
        <h1 style="color:white">
            {{ title }}
        </h1>
        <div class="keypad">
            <div
                class="keypad-button"
                :key="x"
                v-for="(x, i) in valuesToShow"
                @click="$emit('selected', i + 1)"
            >
                <span>{{ x }}</span>
            </div>
        </div>
    </div>
</template>
<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";

const places = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
const points = [15, 12, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1];
@Component
export default class KeypadComponent extends Vue {
    @Prop() private title!: string;
    @Prop() private startingScore!: number;
    get valuesToShow() {
        return points.map(
            (p, i) => i + 1 + " (" + (p + this.startingScore) + ")"
        );
    }
}
</script>

<style>
.overlay {
    position: fixed;
    left: 0;
    top: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.75);
}
.keypad {
    position: absolute;
    left: 20%;
    top: 20%;
    width: 60%;
    height: 60%;
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    grid-template-rows: repeat(4, 1fr);
    column-gap: 4%;
    row-gap: 4%;
}
.keypad-button {
    background-color: lightblue;
    border-radius: 5px;
    display: flex;
    justify-content: center;
    align-items: center;
    border: 2px solid rgba(0, 0, 0, 0.1);
    box-shadow: inset 0 8px 12px rgba(255, 255, 255, 0.3),
        inset 0 -8px 12px rgba(0, 0, 0, 0.3), 0 4px 4px rgba(0, 0, 0, 0.5);
}
</style>
