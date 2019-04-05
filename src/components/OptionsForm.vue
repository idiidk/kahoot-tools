<template>
  <div>
    <md-field>
      <label for="theme">Theme</label>
      <md-select v-model="theme" name="theme" id="theme">
        <md-option value="light">Light</md-option>
        <md-option value="dark">Dark</md-option>
      </md-select>
    </md-field>
  </div>
</template>

<script>
import Vue from "vue";

export default {
  name: "OptionsForm",
  data: () => {
    return {
      theme: "light"
    };
  },
  watch: {
    theme: function(theme) {
      this.$globals.theme = theme;
      localStorage.setItem("theme", theme);
      Vue.material.theming.theme = theme;
    }
  },
  mounted: function() {
    this.theme = this.$globals.theme;
  }
};
</script>
