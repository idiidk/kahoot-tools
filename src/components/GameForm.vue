<template>
  <div class="wrapper">
    <h1>
      {{totalSelectedGroups}}
      Group<span v-if="totalSelectedGroups!==1">s</span>
      Selected
    </h1>

    <v-expansion-panels multiple>
      <HackPanel title="Player">
        <PlayerHacks />
      </HackPanel>

      <HackPanel title="Experimental">
        <ExperimentalHacks />
      </HackPanel>

      <HackPanel title="Answer Explorer">
        <AnswerExplorer />
      </HackPanel>
    </v-expansion-panels>
  </div>
</template>
<script>
import { Events } from "kahoot-api";

import HackPanel from "@/components/HackPanel";
import PlayerHacks from "@/components/PlayerHacks";
import ExperimentalHacks from "@/components/ExperimentalHacks";
import AnswerExplorer from "@/components/AnswerExplorer";

export default {
  name: "GameForm",
  components: {
    PlayerHacks,
    ExperimentalHacks,
    AnswerExplorer,
    HackPanel
  },
  computed: {
    totalSelectedGroups() {
      return this.$kahoot.getSelectedGroups().length;
    }
  },
  methods: {
    onMessage(message) {
      switch (message.id) {
        case Events.startQuiz: {
          const quizName = message.content.quizName;
          this.$kahoot.quizName = quizName;
          break;
        }
        case Events.getReady: {
          const questionIndex = message.content.questionIndex;
          this.$kahoot.questionIndex = questionIndex;
          break;
        }
      }
    }
  },
  mounted() {
    if (this.$kahoot.mainPlayer) {
      this.$kahoot.mainPlayer.on("message", this.onMessage);
    }
  }
};
</script>

<style scoped>
.wrapper {
  padding-top: 5vh;
}
</style>