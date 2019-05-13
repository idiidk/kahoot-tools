<template>
  <v-chip v-on:input="removePlayers" close color="primary">
    <v-avatar class="primary darken-1">{{player.amount}}</v-avatar>
    {{player.name}}
    <span v-if="player.target !== player.amount"> (joining...)</span>
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
          this.$globals.players.splice(this.index, 1);
        });
      }
    }
  }
};
</script>
