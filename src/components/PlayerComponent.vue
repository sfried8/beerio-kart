<template>
  <div style="margin:15px;">
    {{name}} {{points+currentRoundPoints}}
    <div>
      <span @click="$emit('update:pendingPoints', pendingPoints-1)">(-)</span> ({{pendingPoints}}) <span @click="$emit('update:pendingPoints', pendingPoints+1)">(+)</span>
    </div>
    <div
      v-for="m in messages"
      :key="m"
    >{{m}}</div>
  </div>
</template>

<script>
  export default {
    props: {
      name: { type: String },
      messages: { type: Array },
      points: { type: Number },
      currentRoundPoints: { type: Number },
      pendingPoints: { type: Number },
      fromDict: { type: Array },
      toDistribute: { type: Number },
      extraDict: { type: Array }
    }
  };
</script>

<style scoped>
</style>