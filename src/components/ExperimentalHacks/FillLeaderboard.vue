<template>
  <v-row no-gutters>
    <v-col>
      <h1>Non-Recoverable</h1>
      <v-switch v-model="fillLeaderboard" label="Fill leaderboard"></v-switch>
      <v-switch
        :disabled="!fillLeaderboard"
        v-model="autoAnswer"
        label="Auto Answer (nobody else able to answer)"
      ></v-switch>
    </v-col>
  </v-row>
</template>

<script>
export default {
  name: "FillLeaderboard",
  data() {
    return {
      fillLeaderboard: false,
      autoAnswer: false,
      intervalId: null
    };
  },
  watch: {
    fillLeaderboard: function() {
      const selected = this.$kahoot.getSelectedPlayers();
      if (selected.length > 1) {
        this.$globals.notify(
          "This hack works best with one player selected",
          "warning"
        );
      }

      if (this.fillLeaderboard) {
        this.intervalId = setInterval(() => {
          const players = this.$kahoot.getSelectedPlayers();
          players.forEach(player => {
            player.send("/service/controller", {
              name: player.name,
              type: "login",
              status: "VERIFIED"
            });

            if (this.autoAnswer) {
              const choice = Math.floor(Math.random() * 4);
              player.answer(choice);
            }

            player.send("/service/controller", {
              cid: player.cid,
              type: "left"
            });
          });
        }, 50);
      } else {
        clearInterval(this.intervalId);
      }
    }
  }
};
</script>