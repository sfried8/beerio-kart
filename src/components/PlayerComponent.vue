<template>
  <div style="margin:15px;">
    {{name}} {{points.length+currentRoundPoints.length}}
    <div>
      <span @click="$emit('update:pendingPoints', pendingPoints-1)">(-)</span> ({{pendingPoints}}) <span @click="$emit('update:pendingPoints', pendingPoints+1)">(+)</span>
    </div>
    <div v-if="currentRoundPoints.length">
      This round: {{currentRoundPoints.length}} <span @click="messagesExpanded=!messagesExpanded">?</span>
    </div>
    <div v-if="messagesExpanded">

      <div
        v-for="m in messages"
        :key="m"
      >{{m}}</div>
    </div>

  </div>
</template>

<script>
  export default {
    props: {
      name: { type: String },
      messages: { type: Array },
      points: { type: Array },
      currentRoundPoints: { type: Array },
      pendingPoints: { type: Number },
      extraDict: { type: Array }
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