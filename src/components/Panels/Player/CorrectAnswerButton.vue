<template>
  <SimpleAnswerButton
    color="primary"
    :disabled="!this.$globals.activeKahoot.title"
    :choice="choice"
  >{{correctText}}</SimpleAnswerButton>
</template>

<script>
import SimpleAnswerButton from "./SimpleAnswerButton";

export default {
  name: "CorrectAnswerButton",
  computed: {
    choice() {
      if (this.$globals.activeKahoot.title) {
        const questionIndex = this.$globals.mainPlayer.quiz.questionIndex;
        const questions = this.$globals.activeKahoot.questions;
        if (questionIndex > questions.length) {
          this.$globals.notify(
            "Reached end of quiz, the selected quiz probably doesn't match the quiz you are playing",
            "warning"
          );
          return;
        }

        const question = questions[questionIndex];
        for (let i = 0; i < question.choices.length; i++) {
          const choice = question.choices[i];
          if (choice.correct) {
            return i;
          }
        }
      }
    },
    correctText() {
      return this.$globals.activeKahoot.title
        ? "correct"
        : "select a kahoot first";
    }
  },
  components: {
    SimpleAnswerButton
  }
};
</script>