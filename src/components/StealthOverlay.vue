<template>
  <v-scale-transition>
    <iframe
      v-if="$globals.options.stealthMode"
      class="frame"
      src="https://kahoot.it/"
      frameborder="0"
    ></iframe>
  </v-scale-transition>
</template>

<script>
export default {
  name: "Stealth",
  watch: {
    "$globals.options.stealthMode"(activated) {
      if (activated) {
        this.$globals.notify("Scroll down :D", "primary");
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.frame {
  position: relative;
  width: 100vw;
  height: 100vh;
  z-index: 100;
}
</style>