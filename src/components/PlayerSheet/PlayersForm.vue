<template>
  <v-container grid-list-md text-xs-center>
    <v-layout row wrap>
      <v-flex xs6>
        <v-text-field v-model="name" maxlength="13" :counter="13" label="Name"></v-text-field>
      </v-flex>

      <v-flex xs6>
        <v-text-field v-model="amount" label="Amount"></v-text-field>
      </v-flex>

      <v-flex xs3>
        <v-btn width="100%" v-on:click="addPlayers" color="primary">Add Players</v-btn>
      </v-flex>
      <v-flex xs3>
        <v-btn width="100%" v-on:click="removeSelected" color="primary">Remove Selected</v-btn>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import Noty from "noty";
import { Adapters, Session } from "kahoot-api";

export default {
  name: "AddPlayersForm",
  data() {
    return {
      name: null,
      amount: 0
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
      const target = this.safeAmount;

      if (this.validate(name, target)) {
        const globals = this.$globals;
        const session = globals.session;
        const playerIndex =
          globals.players.push({
            name,
            target,
            amount: 0,
            selected: false,
            instances: []
          }) - 1;

        for (let i = 0; i < target; i++) {
          session.openSocket().then(socket => {
            const player = new Adapters.Player(socket);
            player.join(`${name}-${i}`).then(() => {
              const playerGroup = globals.players[playerIndex];

              if (playerGroup) {
                playerGroup.amount += 1;
                playerGroup.instances.push(player);
              } else {
                player.leave();
              }
            });
          });
        }
      }
    },
    removeSelected() {
      const players = this.$globals.players;
      for (let p = 0; p < players.length; p++) {
        const player = players[p];

        if (player.selected) {
          for (let i = 0; i < player.instances.length; i++) {
            const instance = player.instances[i];
            instance.leave();
          }

          players.splice(p, 1);
        }
      }
    },
    validate(name, target) {
      const notify = this.$globals.notify;

      if (name === null) {
        notify(`Player name not provided`, "warning");
        return false;
      }

      if(target <= 0) {
        notify(`Amount should be at least one`, "warning");
        return false;
      }

      const found = this.$globals.players.filter(
        player => player.name === name
      );

      if (found.length > 0) {
        notify(`Player named ${name} already added`, "warning");
        return false;
      }

      return true;
    }
  }
};
</script>

<style lang="scss" scoped>
.players {
  margin-top: 2.5vh;
}
</style>

