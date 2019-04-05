<template>
  <div>
    <md-chip
      v-on:click="toggleSelect"
      :class="selected ? 'md-primary' : 'md-accent'"
      class="player-chip"
      md-clickable
      md-deletable
    >Clickable</md-chip>
  </div>
</template>

<script>
export default {
  name: "PlayerChip",
  props: ["name", "amount"],
  data: () => {
    return {
      selected: false
    };
  },
  methods: {
    toggleSelect: function() {
      this.selected = !this.selected;
    }
  }
};
</script>

<style lang="scss" scoped>
</style>
