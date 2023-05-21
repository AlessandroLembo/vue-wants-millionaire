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
    <container-game></container-game>
  </div>
</template>

<style lang="scss">
@use "./assets/scss/style.scss";
</style>
