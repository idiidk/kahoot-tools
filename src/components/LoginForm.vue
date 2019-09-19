<template>
  <div>
    <v-text-field label="Pin" v-model="pin" :disabled="loading" type="pin"></v-text-field>

    <div class="centerer">
      <v-btn :loading="loading" v-on:click="doLogin" color="primary">find session</v-btn>
    </div>
  </div>
</template>

<script>
import { Config } from "@/main";
import { Session } from "kahoot-api";

export default {
  data: () => {
    return {
      loading: false,
      pin: null
    };
  },
  methods: {
    doLogin: function() {
      const notify = this.$globals.notify;

      if (!this.pin) {
        notify("Please provide a pin", "error");
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
          this.loading = false;

          this.$globals.pin = this.pin;
          this.$globals.session = session;
          this.$globals.mainSocket = socket;
          notify(
            "Got session info, ready for action!",
            "success"
          );
          this.$router.push("game");
        })
        .catch(error => {
          this.loading = false;
          notify(error.toString(), "error");
        });
    }
  }
};
</script>
