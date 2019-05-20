<template>
  <div>
    <v-select v-model="theme" :items="themes" label="Theme"></v-select>
  </div>
</template>

<script>
import Vue from "vue";

export default {
  name: "OptionsForm",
  data: () => {
    return {
      theme: "Light",
      themes: ["Light", "Dark"]
    };
  },
  watch: {
    theme: function(theme) {
      this.$globals.theme = theme;
      localStorage.setItem("theme", theme);
    }
  },
  mounted: function() {
    this.theme = this.$globals.theme;
  }
};
</script>
