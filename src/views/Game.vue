<template>
  <div>
    <MainPlayerPrompt v-if="mainPlayerPrompt"></MainPlayerPrompt>
    <div v-else>
      <PageHeader title="Game" :subtitle="`Pin: ${this.pin}`"/>
      <GameForm></GameForm>
    </div>
  </div>
</template>

<script>
import PageHeader from "@/components/PageHeader";
import GameForm from "@/components/GameForm";
import MainPlayerPrompt from "@/components/MainPlayerPrompt";

export default {
  components: {
    PageHeader,
    GameForm,
    MainPlayerPrompt
  },
  data: () => {
    return {
      pin: 0,
      mainPlayerPrompt: false
    };
  },
  mounted: function() {
    if (this.$globals.client) {
      this.pin = this.$globals.client.pin;

      if (this.$globals.client.twoFactor) {
        this.mainPlayerPrompt = true;
      }
    } else {
      this.$router.push("/");
    }
  }
};
</script>
