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

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  height: 100%;
  background-color: lightgray;
}

nav {
  padding: 30px;
}
</style>

