<script>
import ContainerGame from "./components/ContainerGame.vue";
export default {
  name: "AppVue",
  components: {
    ContainerGame
  },
};
</script>

<template>
  <div id="app">
    <div class="container">
      <container-game></container-game>
    </div>
  </div>
</template>

<style lang="scss">
@use "./assets/scss/style.scss";
</style>

