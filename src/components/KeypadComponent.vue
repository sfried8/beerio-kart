<template>
  <div class="overlay">
    <h1 style="color:white">
      {{title}}
    </h1>
    <div class="keypad">
      <div
        class="keypad-button"
        :key="x"
        v-for="x in 12"
        @click="$emit('selected',x);"
      >
        <span>{{x}}</span>
      </div>
    </div>
  </div>
</template>
<script>
  export default {
    props: {
      title: { type: String }
    }
  };
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
    left: 25%;
    top: 25%;
    width: 50%;
    height: 50%;
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
  }
</style>
