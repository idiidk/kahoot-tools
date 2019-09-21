<template>
  <v-container>
    <v-row justify="center">
      <v-col>
        <v-btn class="answer-button white--text" color="#e21b3c" @click="answer(0)">▲</v-btn>
      </v-col>
      <v-col>
        <v-btn class="answer-button white--text" color="#1368ce" @click="answer(1)">◆</v-btn>
      </v-col>
      <v-col>
        <v-btn class="answer-button white--text" color="#d89e00" @click="answer(2)">●</v-btn>
      </v-col>
      <v-col>
        <v-btn class="answer-button white--text" color="#298f0d" @click="answer(3)">■</v-btn>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  name: "PlayerHacks",
  methods: {
    answer(choice) {
      const players = this.$kahoot.getSelectedPlayers();
      players.forEach(player => {
        player.answer(choice);
      });
    }
  }
};
</script>

<style>
.answer-button {
  width: 100%;
}
</style>