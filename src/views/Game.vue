<template>
  <div>
    <PageHeader title="Game" :subtitle="`Connected to ${$globals.pin}`"/>
    <GameForm></GameForm>
  </div>
</template>

<script>
import PageHeader from "@/components/PageHeader";
import GameForm from "@/components/GameForm";

export default {
  components: {
    PageHeader,
    GameForm,
  },
  mounted: function() {
    if (!this.$globals.session) {
      this.$router.push("/");
    }
  },
  data() {
    return {
      tabs: null
    };
  }
};
</script>

<style lang="scss">
.tabs {
  margin-top: 5vh !important;
}
</style>
