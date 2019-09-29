<template>
  <v-btn :disabled="disabled" block class="white--text" :color="color" @click="answer(choice)">
    <slot />
  </v-btn>
</template>

<script>
export default {
  name: "SimpleAnswerButton",
  props: ["color", "choice", "disabled"],
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