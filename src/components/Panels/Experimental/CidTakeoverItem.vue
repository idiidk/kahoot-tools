<template>
  <v-list-item>
    <v-list-item-icon>
      <v-icon color="primary">person</v-icon>
    </v-list-item-icon>
    <v-list-item-content>
      <v-list-item-title>{{player.name}}</v-list-item-title>
      <v-list-item-subtitle>{{player.totalScore}} points - cid: {{player.cid}}</v-list-item-subtitle>
    </v-list-item-content>
    <v-list-item-action>
      <v-btn @click="initiateTakeover" color="primary">take over</v-btn>
    </v-list-item-action>
  </v-list-item>
</template>

<script>
import { Adapters } from "kahoot-api";
import { PlayerGroup } from "@/plugins/kahoot";

export default {
  name: "CidTakeoverItem",
  props: ["player"],
  methods: {
    async initiateTakeover() {
      const found = this.$kahoot.getGroupByName(
        `${this.player.name} (TAKEN OVER)`
      );
      if (found.length > 0) {
        this.$globals.notify(`Group named ${name} already added`, "warning");
        return false;
      }

      this.$globals.notify(`Doing some pirate shit`, "info");
      const socket = await this.$kahoot.session.openSocket();
      const adapter = new Adapters.Generic(socket);
      const content = {
        device: {
          userAgent:
            "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/77.0.3865.75 Safari/537.36",
          screen: { width: 1920, height: 1080 }
        }
      };

      adapter.send("/service/controller", {
        cid: this.player.cid,
        content: JSON.stringify(content),
        type: "relogin"
      });

      const player = new Adapters.Player(socket);
      player.loggedIn = true;
      player.cid = this.player.cid;
      player.name = this.player.name;

      const group = new PlayerGroup(
        `${this.player.name} (TAKEN OVER)`,
        1,
        true,
        this.$globals.options.selectOnAdd
      );
      group.players.push(player);
      group.joined = 1;
      this.$globals.notify(
        `Taken over the player, player was added to group list!`,
        "success"
      );
      this.$kahoot.groups.push(group);
    }
  }
};
</script>