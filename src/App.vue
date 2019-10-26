<template>
  <v-app :dark="true">
    <StealthOverlay />
    <Notification />

    <v-fade-transition mode="out-in">
      <keep-alive>
        <router-view class="router" />
      </keep-alive>
    </v-fade-transition>

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

    <v-tabs grow class="navigator">
      <v-tab v-if="!this.$kahoot.session" to="/">Login</v-tab>
      <v-tab v-else to="/game">Game</v-tab>
      <v-tab to="/options">Options</v-tab>
    </v-tabs>
  </v-app>
</template>

<script>
import StealthOverlay from "@/components/StealthOverlay";
import Notification from "@/components/Notification";
import PlayerSheet from "@/components/PlayerSheet";

export default {
  data() {
    return {
      sheetExpanded: false
    };
  },
  mounted: function() {
    this.loadConfig();

    function clean() {
      this.$kahoot.groups.forEach(group => {
        for (let i = 0; i < group.players.length; i++) {
          const player = group.players[i];
          player.leave();
        }
      });
    }
    const globalClean = clean.bind(this);
    window.onbeforeunload = globalClean;
  },
  methods: {
    getConfig() {
      const options = localStorage.getItem("options");
      if (options) {
        return JSON.parse(options);
      } else {
        return this.$globals.options;
      }
    },
    loadConfig() {
      this.$globals.options = this.getConfig();
      this.$vuetify.theme.dark = this.$globals.options.dark;
    }
  },
  components: {
    PlayerSheet,
    Notification,
    StealthOverlay
  }
};
</script>

<style lang="scss">
.navigator {
  position: fixed;
  bottom: 0;
  width: 100vw;
  z-index: 2;
}

.router {
  width: 90%;
  margin: 0 auto;
  margin-bottom: calc(48px * 2);

  @media only screen and (min-width: 601px) {
    width: 85%;
  }
  @media only screen and (min-width: 1201px) {
    width: 70%;
  }
}
</style>