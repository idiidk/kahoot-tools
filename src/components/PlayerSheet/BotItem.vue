<template>
  <v-list-item @click="player.selected = !player.selected" class="player active">
    <v-list-item-icon>
      <v-icon color="accent">person</v-icon>
    </v-list-item-icon>

    <v-list-item-content>
      <v-list-item-title>{{player.name}}</v-list-item-title>
      <v-fade-transition hide-on-leave>
        <v-progress-linear v-if="!allJoined" :value="progress"></v-progress-linear>
        <v-list-item-subtitle v-else>{{player.amount}} joined</v-list-item-subtitle>
      </v-fade-transition>
    </v-list-item-content>

    <v-scale-transition>
      <v-icon color="accent" v-if="player.selected">check</v-icon>
    </v-scale-transition>
  </v-list-item>
</template>

<script>
export default {
  props: ["player", "index"],
  methods: {
    removePlayers() {
      if (this.player.instances) {
        this.player.instances.forEach(player => {
          player.leave();
        });
        this.$globals.players.splice(this.index, 1);
      }
    }
  },
  computed: {
    allJoined() {
      return this.player.target === this.player.amount;
    },
    progress() {
      return (100 / this.player.target) * this.player.amount;
    }
  }
};
</script>

<style lang="scss" scoped>
.player {
  transition: background-color 1s;
}
</style>

