<template>
  <v-app :dark="true">
    <v-tabs grow class="navigator">
      <v-tab v-if="!this.$kahoot.session" to="/">Login</v-tab>
      <v-tab v-else to="/game">Game</v-tab>
      <v-tab to="/options">Options</v-tab>
    </v-tabs>

    <transition name="fade" mode="out-in">
      <router-view class="router" />
    </transition>

    <v-btn
      v-if="this.$kahoot.session"
      @click="sheetExpanded = !sheetExpanded"
      fixed
      dark
      fab
      bottom
      right
      color="primary"
    >
      <v-icon>person</v-icon>
    </v-btn>

    <PlayerSheet v-model="sheetExpanded" />
  </v-app>
</template>

<style lang="scss">
@import url("https://fonts.googleapis.com/css?family=Roboto:400,700|Material+Icons");
@import "~noty/src/noty.scss";
@import "~noty/src/themes/mint.scss";

html,
body {
  width: 100vw;
  height: 100vh;
  font-family: "Roboto", sans-serif;
}

.navigator {
  position: fixed;
  bottom: 0;
  width: 100vw;
}

.router {
  width: 90%;
  margin: 0 auto;

  @media only screen and (min-width: 601px) {
    width: 85%;
  }
  @media only screen and (min-width: 1201px) {
    width: 70%;
  }
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s;
}
.fade-enter,
.fade-leave-to {
  opacity: 0;
}

.centerer {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
}
</style>

<script>
import PlayerSheet from "@/components/PlayerSheet";

export default {
  data() {
    return {
      sheetExpanded: false
    };
  },
  mounted: function() {
    this.$vuetify.theme.dark = this.$globals.dark;
  },
  components: {
    PlayerSheet
  }
};
</script>