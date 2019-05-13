<template>
  <v-chip
    class="player-chip"
    v-on:input="removePlayers"
    close
    :color="allJoined ? 'primary' : 'red'"
  >
    <v-avatar class="darken-1 indicator" :color="allJoined ? 'primary' : 'red'">{{player.amount}}</v-avatar>
    {{player.name}}
  </v-chip>
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
    }
  }
};
</script>

<style lang="scss" scoped>
.player-chip,
.player-chip .indicator {
  transition: background-color 1s;
}
</style>

