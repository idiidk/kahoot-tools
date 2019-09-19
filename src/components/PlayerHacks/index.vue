<template>
  <v-container>
    <v-row justify="center">
      <v-col>
        <v-btn color="#e21b3c" width="100%" @click="answer(0)">▲</v-btn>
      </v-col>
      <v-col>
        <v-btn color="#1368ce" width="100%" @click="answer(1)">◆</v-btn>
      </v-col>
      <v-col>
        <v-btn color="#d89e00" width="100%" @click="answer(2)">●</v-btn>
      </v-col>
      <v-col>
        <v-btn color="#298f0d" width="100%" @click="answer(3)">■</v-btn>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  name: "PlayerHacks",
  methods: {
    answer(choice) {
      const players = this.getSelectedPlayers();
      players.forEach(player => {
        player.instances.forEach(instance => {
          instance.answer(choice);
        });
      });
    },
    getSelectedPlayers() {
      const players = this.$globals.players;
      return players.filter(player => player.selected);
    }
  }
};
</script>

<style>
</style>