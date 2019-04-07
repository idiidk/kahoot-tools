<template>
  <div>
    <div class="players">
      <PlayerChip v-for="playerGroup in this.$globals.playerGroups" :key="playerGroup.cid" :group="playerGroup"></PlayerChip>
    </div>

    <md-tabs class="md-transparent" md-alignment="fixed">
      <md-tab id="tab-players" md-label="Players">
        <PlayerHacks></PlayerHacks>
      </md-tab>
      <md-tab id="tab-teams" md-label="Teams"></md-tab>
      <md-tab id="tab-answers" md-label="Answers"></md-tab>
      <md-tab id="tab-malicious" md-label="Malicious"></md-tab>
    </md-tabs>
  </div>
</template>

<script>
import PlayerChip from "@/components/PlayerChip";
import PlayerHacks from "@/components/hacks/PlayerHacks";

export default {
  name: "GameForm",
  components: {
    PlayerHacks,
    PlayerChip
  }
};
</script>

<style lang="scss" scoped>
.players {
  margin-bottom: 2vh;
}

.players div {
  margin-bottom: 5px;
}
</style>

