<template>
  <v-bottom-sheet v-model="expanded" transition="slide-y-reverse-transition" :hide-overlay="true">
    <v-sheet class="sheet-content">
      <v-subheader>
        {{this.$kahoot.groups.length}} Group
        <span v-if="this.$kahoot.groups.length!==1">s</span>
      </v-subheader>

      <BotList />
      <PlayersForm />
    </v-sheet>
  </v-bottom-sheet>
</template>

<script>
import PlayersForm from "./PlayersForm";
import BotList from "./BotList";

export default {
  name: "PlayerSheet",
  props: ["value"],
  data() {
    return { expanded: false };
  },
  watch: {
    value() {
      this.expanded = this.value;
    },
    expanded() {
      this.$emit("input", this.expanded);
    }
  },
  components: {
    PlayersForm,
    BotList
  }
};
</script>