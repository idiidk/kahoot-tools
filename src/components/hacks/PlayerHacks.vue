<template>
  <v-container grid-list-md text-xs-center>
    <v-layout row wrap>
      <v-flex xs6>
        <v-text-field v-model="name" maxlength="13" :counter="13" label="Name"></v-text-field>
      </v-flex>

      <v-flex xs6>
        <v-text-field v-model="amount" label="Amount"></v-text-field>
      </v-flex>

      <v-flex xs12>
        <v-switch v-model="isGhost" label="Ghost"></v-switch>
      </v-flex>

      <v-btn v-on:click="addPlayers" color="primary">Add Players</v-btn>
    </v-layout>
  </v-container>
</template>

<script>
import Noty from "noty";
import { Adapters, Session } from "kahoot-api";

export default {
  name: "PlayerHacks",
  data() {
    return {
      name: null,
      amount: 0,
      isGhost: false
    };
  },
  computed: {
    safeAmount() {
      return parseInt(this.amount);
    }
  },
  methods: {
    addPlayers() {
      const name = this.name;
      const isGhost = this.isGhost;
      if (!this.checkDuplicates(name)) {
        const globals = this.$globals;
        const session = globals.session;
        const playerIndex =
          globals.players.push({
            name: this.name,
            target: this.safeAmount,
            amount: 0,
            ghost: false,
            instances: []
          }) - 1;

        for (let i = 0; i < this.safeAmount; i++) {
          if (isGhost) {
            const ghost = new Adapters.Ghost(this.$globals.mainSocket);
            ghost.join(`${name}-${i}`).then(() => {
              if (globals.players[playerIndex]) {
                globals.players[playerIndex].amount += 1;
                globals.players[playerIndex].instances.push(ghost);
              } else {
                ghost.leave();
              }
            });
          } else {
            session.openSocket().then(socket => {
              const player = new Adapters.Player(socket);
              player.join(`${name}-${i}`).then(() => {
                if (globals.players[playerIndex]) {
                  globals.players[playerIndex].amount += 1;
                  globals.players[playerIndex].instances.push(player);
                } else {
                  player.leave();
                }
              });
            });
          }
        }
      }
    },
    checkDuplicates(name) {
      const found = this.$globals.players.filter(
        player => player.name === name
      );

      if (found.length > 0) {
        this.notify(`Player named ${name} already added!`, "warning");
      }

      return found.length > 0;
    },
    notify: function(text, type) {
      new Noty({
        text: text,
        timeout: 2000,
        layout: "bottomRight",
        type: type
      }).show();
    }
  }
};
</script>

<style lang="scss" scoped>
.players {
  margin-top: 2.5vh;
}
</style>

