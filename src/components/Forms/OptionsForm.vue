<template>
  <v-container fluid>
    <v-row>
      <v-col>
        <v-select v-model="$globals.options.dark" :items="themeItems" label="Theme"></v-select>
      </v-col>

      <v-col>
        <v-select
          v-model="$globals.options.stealthMode"
          :items="stealthModeItems"
          label="Stealth Mode"
        ></v-select>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <v-select
          v-model="$globals.options.selectOnAdd"
          :items="selectOnAddItems"
          label="Select Group on Add"
        ></v-select>
      </v-col>
    </v-row>
    <v-row>
      <v-col align="center" cols="12">
        <v-btn color="primary" @click="reset">reset configuration</v-btn>
      </v-col>
    </v-row>
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
      ],
      stealthModeItems: [
        { text: "On", value: true },
        { text: "Off", value: false }
      ]
    };
  },
  methods: {
    reset() {
      localStorage.clear();
      location.reload();
    }
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
