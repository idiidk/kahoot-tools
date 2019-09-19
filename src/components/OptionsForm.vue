<template>
  <v-container fluid>
    <v-switch v-model="dark" label="Dark Mode"></v-switch>
  </v-container>
</template>

<script>
import Vue from "vue";

export default {
  name: "OptionsForm",
  data() {
    return { dark: this.$globals.dark };
  },
  watch: {
    dark: function(theme) {
      this.$globals.dark = this.dark;
      this.$vuetify.theme.dark = this.$globals.dark;
      localStorage.setItem("dark", this.dark);
    }
  }
};
</script>
