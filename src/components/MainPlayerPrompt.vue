<template>
  <div class="centerer full">
    <md-empty-state
      md-icon="devices_other"
      md-label="Add your main player"
      md-description="Because the game you're joining has two step login enabled, you need to add a main player."
    >
      <md-button class="md-primary md-raised">Add Main Player</md-button>
    </md-empty-state>
  </div>
</template>

<script>
export default {
  name: "MainPlayerPrompt"
};
</script>

<style lang="scss" scoped>

</style>

