<template>
  <div>
    <PageHeader title="Game" :subtitle="`Connected to ${$kahoot.pin}`" />
    <GameForm></GameForm>
  </div>
</template>

<script>
import PageHeader from "@/components/PageHeader";
import GameForm from "@/components/Forms/GameForm";

export default {
  components: {
    PageHeader,
    GameForm
  },
  mounted: function() {
    if (!this.$kahoot.session) {
      this.$router.push("/");
    }
  }
};
</script>
