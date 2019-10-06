<template>
  <v-container fluid>
    <v-select v-model="$globals.options.dark" :items="themeItems" label="Theme"></v-select>
    <v-select
      v-model="$globals.options.selectOnAdd"
      :items="selectOnAddItems"
      label="Select Group on Add"
    ></v-select>
  </v-container>
</template>

<script>
export default {
  name: "OptionsForm",
  data() {
    return {
      themeItems: [
        { text: "Light", value: false },
        { text: "Dark", value: true }
      ],
      selectOnAddItems: [
        { text: "Yes", value: true },
        { text: "No", value: false }
      ]
    };
  },
  watch: {
    "$globals.options.dark": {
      handler() {
        this.$vuetify.theme.dark = this.$globals.options.dark;
      }
    }
  }
};
</script>
