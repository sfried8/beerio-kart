<template>
  <div
    :style="{margin:'15px','user-select':'none', 'font-weight':'bolder','color':['black','darkred','red'][colorLevel]||'red'}"
  >
    {{name}} {{points.amount()+currentRoundPoints.amount()}}
    <div>
      <span @click="$emit('update:pendingPoints', Math.max(pendingPoints-1,0))">-</span>
      {{pendingPoints}}
      <span @click="$emit('update:pendingPoints', pendingPoints+1)">+</span>
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
  }
};
</script>

<style scoped>
</style>