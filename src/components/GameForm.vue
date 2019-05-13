<template>
  <div>
    <v-tabs grow v-model="tabs" class="tabs">
      <v-tab key="players" ripple>Players</v-tab>
      <v-tab key="game" ripple>Game</v-tab>
      <v-tab key="games" ripple>Games</v-tab>
    </v-tabs>

    <v-tabs-items v-model="tabs">
      <v-tab-item key="players">
        <PlayerHacks></PlayerHacks>
      </v-tab-item>

      <v-tab-item key="game">
        <PlayerHacks></PlayerHacks>
      </v-tab-item>

      <v-tab-item key="games">a</v-tab-item>
    </v-tabs-items>
  </div>
</template>

<script>
import PlayerHacks from "@/components/hacks/PlayerHacks";

export default {
  name: "GameForm",
  data() {
    return {
      tabs: null
    };
  },
  components: {
    PlayerHacks
  }
};
</script>
