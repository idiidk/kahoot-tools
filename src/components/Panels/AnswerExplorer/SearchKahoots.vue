<template>
  <v-row no-gutters>
    <v-col cols="12">
      <h1>Kahoot Name: {{this.$globals.mainPlayer.quiz.name || "not started yet"}}</h1>
      <p class="subtitle">Active Kahoot: {{this.$globals.activeKahoot.title}}</p>
      <v-text-field
        v-model="name"
        @click:append="refreshName"
        :append-icon="appendIcon"
        label="Kahoot Name"
      ></v-text-field>
      <v-btn @click="search" :loading="loading" :disabled="loading" color="primary">search</v-btn>
    </v-col>

    <v-col>
      <v-list two-line>
        <v-slide-x-transition group>
          <KahootSearchResult
            v-for="(kahoot, index) of kahoots"
            :key="index"
            :kahoot="kahoot"
            @click="$emit('kahootSelected', kahoot.card.uuid)"
          />
        </v-slide-x-transition>
      </v-list>
    </v-col>
  </v-row>
</template>

<script>
import KahootSearchResult from "./KahootSearchResult";

export default {
  name: "SearchKahoots",
  data() {
    return {
      name: "",
      kahoots: [],
      loading: false
    };
  },
  methods: {
    search() {
      this.loading = true;

      this.$kahoot.session.web.searchKahoots(this.name, 5).then(kahoots => {
        this.kahoots = kahoots.entities;
        this.loading = false;
      });
    },
    refreshName() {
      this.name = this.$globals.mainPlayer.quiz.name;
    }
  },
  computed: {
    appendIcon() {
      if (this.name === this.$globals.mainPlayer.quiz.name) {
        return "check";
      } else {
        return "refresh";
      }
    }
  },
  components: {
    KahootSearchResult
  }
};
</script>
