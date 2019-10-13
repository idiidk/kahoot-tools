<template>
  <v-expansion-panel>
    <v-expansion-panel-header>{{title}}</v-expansion-panel-header>
    <v-expansion-panel-content>
      <slot></slot>
    </v-expansion-panel-content>
  </v-expansion-panel>
</template>

<script>
export default {
  name: "Panel",
  props: ["title"]
};
</script>