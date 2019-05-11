<template>
  <div :style="{margin:'15px','user-select':'none', 'font-weight':'bolder'}">
    {{name}} {{points.amount()+currentRoundPoints.amount()}}
    <div>
      <div @click="showKeypad">{{placeString}}</div>
    </div>
    <div v-if="currentRoundPoints.amount()">
      This round: {{currentRoundPoints.amount()}}
      <button
        @mouseenter="messagesExpanded=true"
        @mouseleave="messagesExpanded=false"
      >?</button>
    </div>
    <div v-if="messagesExpanded">
      <div v-for="m in messages" :key="m">{{m}}</div>
    </div>
    <!-- <keypad :show="showKeypad" @selected="n=>{$emit('update:pendingPoints', n);showKeypad=false;}"/> -->
  </div>
</template>

<script>
import KeypadPrompt from "./KeypadPrompt";
import { addNumberEnding } from "../Util";
export default {
  props: {
    name: { type: String },
    messages: { type: Array },
    points: { type: Object },
    currentRoundPoints: { type: Object },
    pendingPoints: { type: Number },
    extraDict: { type: Array },
    colorLevel: { type: Number }
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
  },
  computed: {
    placeString() {
      return this.pendingPoints
        ? addNumberEnding(this.pendingPoints)
        : "<add placement>";
    }
  },
  methods: {
    showKeypad() {
      KeypadPrompt().then(n => this.$emit("update:pendingPoints", n));
    }
  }
};
</script>

<style scoped>
</style>