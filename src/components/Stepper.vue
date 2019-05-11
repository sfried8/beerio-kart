<template>
  <div>
    <span @click="$emit('update:pendingPoints', Math.max(pendingPoints-1,0))">-</span>
    {{pendingPoints}}
    <span @click="$emit('update:pendingPoints', pendingPoints+1)">+</span>
  </div>
</template>

<script>
export default {
  props: {
    pendingPoints: { type: Number }
  }
};
</script>
