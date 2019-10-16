<template>
  <v-row no-gutters>
    <v-col>
      <v-scale-transition leave-absolute>
        <v-progress-linear class="spaced" v-if="!kahoot.title" indeterminate></v-progress-linear>
        <h1 v-else>{{kahoot.title}}</h1>
      </v-scale-transition>

      <v-btn class="spaced" @click="$emit('resetSelected')" color="primary">back</v-btn>
      <v-btn
        class="spaced white--text"
        @click="toggleActive"
        :color="activeColor"
      >toggle active quiz</v-btn>

      <v-expansion-panels>
        <KahootQuestionItem
          v-for="(question, index) of kahoot.questions"
          :key="index"
          :question="question"
        />
      </v-expansion-panels>
    </v-col>
  </v-row>
</template>

<script>
import KahootQuestionItem from "./KahootQuestionItem";

export default {
  name: "KahootInfo",
  props: ["uuid"],
  data() {
    return {
      kahoot: {}
    };
  },
  mounted: function() {
    this.getAnswers(this.uuid);
  },
  methods: {
    getAnswers(uuid) {
      this.$kahoot.session.web.getKahoot(uuid).then(kahoot => {
        this.kahoot = kahoot;
      });
    },
    toggleActive() {
      if (this.isActive()) {
        this.$globals.activeKahoot = {};
      } else {
        this.$globals.activeKahoot = this.kahoot;
      }
    },
    isActive() {
      if (!this.kahoot.uuid) {
        return false;
      }
      return this.$globals.activeKahoot.uuid === this.kahoot.uuid;
    }
  },
  computed: {
    activeColor() {
      return this.isActive() ? "green" : "primary";
    }
  },
  components: {
    KahootQuestionItem
  }
};
</script>

<style scoped>
.spaced {
  margin: 2vh 0 2vh 0;
  margin-right: 2vw;
}
</style>