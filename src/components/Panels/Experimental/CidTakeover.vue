<template>
  <div>
    <v-row>
      <v-col>
        <h1>Player Takeover</h1>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <v-switch v-model="enableTakeover" label="Enable Takeover"></v-switch>
      </v-col>
    </v-row>
    <v-list subheader>
      <v-subheader>PLAYERS</v-subheader>
      <CidTakeoverItem v-for="player of players" :key="player.cid" :player="player" />
    </v-list>
  </div>
</template>

<script>
import { Events } from "kahoot-api";
import CidTakeoverItem from "./CidTakeoverItem";

export default {
  name: "CidTakeover",
  data() {
    return {
      players: [],
      enableTakeover: false
    };
  },
  methods: {
    onMessage(message) {
      if (!this.enableTakeover) return;
      switch (message.id) {
        case Events.revealAnswer: {
          const nemesis = message.content.nemesis;
          if (nemesis) {
            const found = this.players.find(
              player => player.cid === nemesis.cid
            );

            if (!found) {
              this.$globals.notify(
                `Able to take over ${nemesis.name} with ${nemesis.totalScore} points!`,
                "info"
              );
              this.players.push(nemesis);
            } else {
              this.players.forEach((player, index) => {
                if (player.cid === nemesis.cid) {
                  this.players[index] = nemesis;
                }
              });
            }
          }
          break;
        }
      }
    }
  },
  beforeCreate() {
    this.$kahoot.$on("global", this.onMessage);
  },
  components: { CidTakeoverItem }
};
</script>