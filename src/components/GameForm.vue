<template>
  <div>
    <v-tabs grow v-model="tabs" class="tabs">
      <v-tab key="players" ripple>Players</v-tab>
      <v-tab key="game" ripple>Game</v-tab>
      <v-tab key="experimental" ripple>Experimental</v-tab>
    </v-tabs>

    <v-tabs-items v-model="tabs">
      <v-tab-item key="players">
        <PlayerHacks></PlayerHacks>
      </v-tab-item>

      <v-tab-item key="game">a</v-tab-item>

      <v-tab-item key="experimental">b</v-tab-item>
    </v-tabs-items>

    <div class="text-xs-center players">
      <PlayerChip
        v-for="(player, index) of this.$globals.players"
        :key="index"
        :index="index"
        :player="player"
      ></PlayerChip>
    </div>
  </div>
</template>

<script>
import PlayerHacks from "@/components/hacks/PlayerHacks";
import PlayerChip from "@/components/PlayerChip";

export default {
  name: "GameForm",
  data() {
    return {
      tabs: null
    };
  },
  components: {
    PlayerHacks,
    PlayerChip
  }
};
</script>
