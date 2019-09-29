<template>
  <div>
    <v-row>
      <v-col v-for="(button, index) in buttons" :key="index">
        <SimpleAnswerButton :color="button.color" :choice="index">{{button.text}}</SimpleAnswerButton>
      </v-col>
    </v-row>

    <v-row>
      <v-col>
        <RandomAnswerButton />
      </v-col>

      <v-col>
        <CorrectAnswerButton />
      </v-col>
    </v-row>
  </div>
</template>

<script>
import { KahootColors } from "@/assets/colors";

import SimpleAnswerButton from "./SimpleAnswerButton";
import RandomAnswerButton from "./RandomAnswerButton";
import CorrectAnswerButton from "./CorrectAnswerButton";

export default {
  name: "NormalAnswer",
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
  components: {
    SimpleAnswerButton,
    CorrectAnswerButton,
    RandomAnswerButton
  }
};
</script>