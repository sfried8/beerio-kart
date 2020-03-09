<template>
    <div class="home-container">
        Welcome to Beerio Kart! Please drink responsibly.
        <img src="/drunk-mario.png" />
    </div>
</template>

<script lang="ts">
import Vue from "vue";

export default Vue.extend({
    name: "Home"
});
</script>
<style lang="less">
.home-container {
    margin-top: 5vh;
    width: 100vw;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
}
</style>
