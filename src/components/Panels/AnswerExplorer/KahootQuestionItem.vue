<template>
  <v-expansion-panel>
    <v-expansion-panel-header>{{question.question}}</v-expansion-panel-header>
    <v-expansion-panel-content>
      <v-list-item v-for="(choice, index) of question.choices" :key="index">
        <v-list-item-content>
          <v-list-item-title>
            {{choice.answer}} -
            <span
              :class="`${correctColor(choice)}--text`"
            >{{correctText(choice)}}</span>
          </v-list-item-title>

          <v-row>
            <v-col cols="2">
              <SimpleAnswerButton
                :color="buttons[index].color"
                :choice="index"
                v-if="choice.correct"
              >{{buttons[index].text}}</SimpleAnswerButton>
            </v-col>
          </v-row>
        </v-list-item-content>
      </v-list-item>
    </v-expansion-panel-content>
  </v-expansion-panel>
</template>

<script>
import { KahootColors } from "@/assets/colors";
import SimpleAnswerButton from "@/components/Panels/Player/SimpleAnswerButton";

export default {
  name: "KahootQuestionItem",
  props: ["question"],
  data() {
    return {
      buttons: [
        { color: KahootColors.Triangle, text: "▲" },
        { color: KahootColors.Diamond, text: "◆" },
        { color: KahootColors.Circle, text: "●" },
        { color: KahootColors.Square, text: "■" }
      ]
    };
  },
  methods: {
    correctText(choice) {
      return choice.correct ? "correct" : "incorrect";
    },
    correctColor(choice) {
      return choice.correct ? "green" : "red";
    }
  },
  components: {
    SimpleAnswerButton
  }
};
</script>