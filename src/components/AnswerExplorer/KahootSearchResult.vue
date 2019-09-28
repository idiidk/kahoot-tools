<template>
  <v-list-item @click="$emit('click')">
    <v-list-item-content>
      <v-list-item-title>{{kahoot.card.title}}</v-list-item-title>
      <v-list-item-subtitle class="no-overflow">{{kahoot.card.description}}</v-list-item-subtitle>
    </v-list-item-content>
  </v-list-item>
</template>

<script>
export default {
  name: "KahootItem",
  props: ["kahoot"]
};
</script>

<style scoped>
.no-overflow {
  max-width: 75vw;
}
</style>