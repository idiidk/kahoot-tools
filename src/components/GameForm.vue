<template>
  <div class="wrapper">
    <h1>Hacks</h1>

    <v-expansion-panels>
      <v-expansion-panel>
        <v-expansion-panel-header>Player</v-expansion-panel-header>
        <v-expansion-panel-content>
          <PlayerHacks />
        </v-expansion-panel-content>
      </v-expansion-panel>
    </v-expansion-panels>
  </div>
</template>
<script>
import PlayerHacks from "@/components/PlayerHacks";

export default {
  name: "GameForm",
  components: {
    PlayerHacks
  }
};
</script>

<style scoped>
.wrapper {
  padding-top: 5vh;
}
</style>