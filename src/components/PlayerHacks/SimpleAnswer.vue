<template>
  <div>
    <v-row>
      <v-col v-for="(button, index) in buttons" :key="index">
        <v-btn
          block
          class="white--text"
          :color="button.color"
          @click="answer(index)"
        >{{button.text}}</v-btn>
      </v-col>
    </v-row>

    <v-row>
      <v-col>
        <v-btn block color="primary" @click="answer(4)">random</v-btn>
      </v-col>

      <v-col>
        <v-btn
          block
          color="primary"
          :disabled="!$kahoot.activeKahoot.title"
          @click="answer(5)"
        >{{correctText}}</v-btn>
      </v-col>
    </v-row>
  </div>
</template>

<script>
export default {
  name: "NormalAnswer",
  data() {
    return {
      buttons: [
        { color: "#e21b3c", text: "▲" },
        { color: "#1368ce", text: "◆" },
        { color: "#d89e00", text: "●" },
        { color: "#298f0d", text: "■" }
      ]
    };
  },
  methods: {
    answer(choice) {
      const players = this.$kahoot.getSelectedPlayers();
      players.push(this.$kahoot.mainPlayer);

      players.forEach(player => {
        if (choice === 4) {
          const finalChoice = Math.floor(Math.random() * 4);
          player.answer(finalChoice);
        } else if (choice === 5) {
          const questionIndex = this.$kahoot.questionIndex;
          const questions = this.$kahoot.activeKahoot.questions;
          if (questionIndex > questions.length) {
            this.$globals.notify(
              "Reached end of quiz, the selected quiz probably doesn't match the quiz you are playing",
              "warning"
            );
            return;
          }

          const question = questions[questionIndex];
          question.choices.forEach((choice, index) => {
            if (choice.correct) {
              player.answer(index);
            }
          });
        } else {
          const finalChoice = choice;
          player.answer(finalChoice);
        }
      });
    }
  },
  computed: {
    correctText() {
      return this.$kahoot.activeKahoot.title
        ? "correct"
        : "select a kahoot first";
    }
  }
};
</script>