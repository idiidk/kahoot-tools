<template>
  <div>
    <h1>Add Player Groups</h1>

    <div class="md-layout md-gutter">
      <div class="md-layout-item">
        <md-field>
          <label>Name</label>
          <md-input v-model="name"></md-input>
        </md-field>
      </div>
      <div class="md-layout-item">
        <md-field>
          <label>Amount</label>
          <md-input type="number" v-model="amount"></md-input>
        </md-field>
      </div>
    </div>

    <md-checkbox v-model="isGhost">Is Ghost</md-checkbox>
    <div class="md-layout md-gutter">
      <div class="md-layout-item">
        <md-button v-on:click="addPlayer" class="md-raised md-primary add-button">Add</md-button>
      </div>
      <div class="md-layout-item">
        <md-button v-on:click="toggleSelect" class="md-raised md-primary add-button">Toggle Selected</md-button>
      </div>
      <div class="md-layout-item">
        <md-button v-on:click="removeSelect" class="md-raised md-primary add-button">Remove Selected</md-button>
      </div>
    </div>
  </div>
</template>

<script>
import Noty from "noty";
import uuidv4 from "uuid/v4";
import { setTimeout } from "timers";

export default {
  name: "PlayerHacks",
  methods: {
    addPlayer: function() {
      let error = null;
      const players = [];
      const exists =
        this.$globals.playerGroups.filter(group => {
          return group.name === this.name;
        }).length !== 0;

      if (!exists) {
        if (this.amount > 0 && this.name !== "") {
          const cid = uuidv4();

          for (let i = 0; i < this.amount; i++) {
            const player = this.$globals.client.addPlayer(
              parseInt(this.amount) === 1 ? this.name : `${this.name}-${i}`,
              cid,
              this.isGhost
            );

            setTimeout(() => {
              player.bruteForceTwoFactor();
            }, 250);

            players.push(player);
          }

          this.$globals.playerGroups.push({
            name: this.name,
            amount: this.amount,
            isGhost: this.isGhost,
            cid: cid,
            players: players,
            selected: false
          });
        } else {
          error = "Please specify an amount greater than 0 and a valid name!";
        }
      } else {
        error = "Player with this name already added";
      }

      if (error) {
        this.notify(error, "warning");
      }
    },
    toggleSelect: function() {
      this.$globals.playerGroups.forEach(group => {
        group.selected = !group.selected;
      });
    },
    removeSelect: function() {
      this.$globals.playerGroups.forEach(group => {
        if (group.selected) {
          group.players.forEach(player => {
            player.removeFromGame();
          });

          this.$globals.playerGroups.splice(
            this.$globals.playerGroups.indexOf(group),
            1
          );
        }
      });
    },
    notify: function(text, type) {
      new Noty({
        text: text,
        timeout: 2000,
        layout: "bottomRight",
        type: type
      }).show();
    }
  },
  data: () => {
    return {
      name: "",
      amount: 0,
      isGhost: false
    };
  }
};
</script>

<style lang="scss" scoped>
.add-button {
  margin: 0;
  margin-top: 4px;
  width: 100%;
}
</style>

