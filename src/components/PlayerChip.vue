<template>
  <md-chip
    v-on:click="toggleSelect"
    :class="selected ? 'md-primary' : ''"
    class="player-chip"
  >{{group.name}} x {{group.amount}}</md-chip>
</template>

<script>
export default {
  name: "PlayerChip",
  props: ["group"],
  methods: {
    toggleSelect: function() {
      this.group.selected = !this.group.selected;
    }
  },
  computed: {
    selected: function() {
      return this.group.selected;
    }
  }
};
</script>

<style lang="scss" scoped>
.player-chip {
  -webkit-touch-callout: none;
  -webkit-user-select: none;
  -khtml-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;

  cursor: pointer;
}
</style>
