<template>
  <v-list flat>
    <v-list-item-group>
      <BotItem
        v-for="(player, index) of this.$globals.players"
        :key="index"
        :index="index"
        :player="player"
      />
    </v-list-item-group>
  </v-list>
</template>

<script>
import BotItem from "./BotItem";

export default {
  name: "BotList",
  components: {
    BotItem
  }
};
</script>

<style>
</style>