<template>
  <div class="overlay">
    <div class="keypad">
      <div class="keypad-button" :key="x" v-for="x in 12" @click="$emit('selected',x);">
        <span>{{x}}</span>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    show: { type: Boolean }
  }
};
</script>

<style>
.overlay {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.75);
}
.keypad {
  position: absolute;
  left: 25%;
  top: 25%;
  width: 50%;
  height: 50%;
  display: grid;
  grid-template-columns: repeat(3, 30%);
  grid-template-rows: repeat(4, 30%);
}
.keypad-button {
  background-color: lightblue;
  border-radius: 5px;
  margin: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
