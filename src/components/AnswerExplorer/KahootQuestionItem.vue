<template>
  <v-expansion-panel>
    <v-expansion-panel-header>{{question.question}}</v-expansion-panel-header>
    <v-expansion-panel-content>
      <v-list-item v-for="(choice, index) of question.choices" :key="index">
        <v-list-item-content>
          <v-list-item-title>{{choice.answer}} - {{choice.correct ? "correct" : "incorrect"}}</v-list-item-title>
        </v-list-item-content>
      </v-list-item>
    </v-expansion-panel-content>
  </v-expansion-panel>
</template>

<script>
export default {
  name: "KahootQuestionItem",
  props: ["question"]
};
</script>