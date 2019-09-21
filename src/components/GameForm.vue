<template>
  <div class="wrapper">
    <h1>{{totalSelectedGroups}} Group<span v-if="totalSelectedGroups!==1">s</span> Selected</h1>

    <v-expansion-panels multiple>
      <v-expansion-panel>
        <v-expansion-panel-header>Player</v-expansion-panel-header>
        <v-expansion-panel-content>
          <PlayerHacks />
        </v-expansion-panel-content>
      </v-expansion-panel>

      <v-expansion-panel>
        <v-expansion-panel-header>Game Info</v-expansion-panel-header>
        <v-expansion-panel-content>
          <GameInfo />
        </v-expansion-panel-content>
      </v-expansion-panel>
    </v-expansion-panels>
  </div>
</template>
<script>
import PlayerHacks from "@/components/PlayerHacks";
import GameInfo from "@/components/GameInfo";

export default {
  name: "GameForm",
  components: {
    PlayerHacks,
    GameInfo
  },
  computed: {
    totalSelectedGroups() {
      return this.$kahoot.getSelectedGroups().length;
    }
  }
};
</script>

<style scoped>
.wrapper {
  padding-top: 5vh;
}
</style>