<template>
  <div>
    <PageHeader title="Game" :subtitle="`Pin: ${this.pin}`"/>
    <GameForm></GameForm>
  </div>
</template>

<script>
import PageHeader from "@/components/PageHeader";
import GameForm from "@/components/GameForm"

export default {
  components: {
    PageHeader,
    GameForm
  },
  data: () => {
    return {
      pin: 0
    };
  },
  mounted: function() {
    if (this.$globals.client) {
      this.pin = this.$globals.client.pin;
    } else {
      this.$router.push("/");
    }
  }
};
</script>
