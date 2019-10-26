<template>
  <v-container>
    <v-row>
      <v-col>
        <v-text-field
          label="Pin"
          v-model="pin"
          v-on:keyup.enter="login"
          :disabled="loading"
          type="pin"
        ></v-text-field>
      </v-col>
      <v-col>
        <v-text-field
          label="Name"
          v-model="name"
          v-on:keyup.enter="login"
          :disabled="loading"
          type="text"
        ></v-text-field>
      </v-col>
    </v-row>
    <v-row justify="center">
      <v-btn :loading="loading" @click="login" color="primary">find session</v-btn>
    </v-row>
  </v-container>
</template>

<script>
import { Config } from "@/main";
import { PlayerGroup } from "@/plugins/kahoot";
import { Session, Adapters } from "kahoot-api";

export default {
  name: "LoginForm",
  data: () => {
    return {
      loading: false,
      pin: null,
      name: null
    };
  },
  methods: {
    login: function() {
      const notify = this.$globals.notify;

      if (!this.pin) {
        notify("Please provide a pin", "error");
        return;
      }

      if (!this.name) {
        notify("Please provide a main player name", "error");
        return;
      }

      this.loading = true;

      const session = new Session(
        this.pin,
        `//${Config.corsUrl}:${Config.corsPort}/`
      );

      session
        .openSocket()
        .then(socket => {
          const mainPlayer = new Adapters.Player(socket);
          return mainPlayer.join(this.name).then(() => {
            this.loading = false;

            const group = new PlayerGroup(
              this.name,
              1,
              false,
              this.$globals.options.selectOnAdd
            );
            group.players.push(mainPlayer);
            group.joined = 1;

            this.$kahoot.pin = this.pin;
            this.$kahoot.session = session;
            this.$kahoot.socket = socket;
            this.$kahoot.groups.push(group);
            this.$globals.mainPlayer = mainPlayer;
            mainPlayer.on("message", msg =>
              this.$globals.$emit("message", msg)
            );
            this.$globals.initListeners();

            notify("Connected, ready for action!", "success");
            this.$router.push("game");
          });
        })
        .catch(error => {
          this.loading = false;
          notify(error.toString(), "error");
        });
    }
  }
};
</script>
