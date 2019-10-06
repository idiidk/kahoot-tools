<template>
  <v-list flat>
    <v-list-item-group>
      <BotItem
        v-for="(group, index) of this.$kahoot.groups"
        :key="index"
        :index="index"
        :group="group"
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