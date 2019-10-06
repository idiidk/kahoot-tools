<template>
  <v-list-item @click="group.selected = !group.selected" class="group active">
    <v-list-item-icon>
      <v-icon color="primary">person</v-icon>
    </v-list-item-icon>

    <v-list-item-content>
      <v-list-item-title>
        <b>{{group.name}}</b>
      </v-list-item-title>
      <v-fade-transition hide-on-leave>
        <v-progress-linear v-if="!allJoined" :value="progress"></v-progress-linear>
        <v-list-item-subtitle v-else>
          {{group.joined}} / {{group.target}} joined
          <span v-if="!group.canBeRemoved">- not removable</span>
        </v-list-item-subtitle>
      </v-fade-transition>
    </v-list-item-content>

    <v-scale-transition>
      <v-icon v-if="group.selected">check</v-icon>
    </v-scale-transition>
  </v-list-item>
</template>

<script>
export default {
  props: ["group", "index"],
  computed: {
    allJoined() {
      return this.group.totalPlayers === this.group.target;
    },
    progress() {
      return (100 / this.group.target) * this.group.totalPlayers;
    }
  }
};
</script>

<style lang="scss" scoped>
.group {
  transition: background-color 1s;
}
</style>

