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
import Noty from "noty";

export default {
  data: () => {
    return {
      loading: false,
      pin: null
    };
  },
  methods: {
    doLogin: function() {
      if (!this.pin) {
        this.notify("Please provide a pin", "error");
        return;
      }

      this.loading = true;

      const session = new Session(`//${Config.corsUrl}:${Config.corsPort}/`);

      session
        .check(this.pin)
        .then(sessionInfo => {
          this.loading = false;

          this.$globals.pin = this.pin;
          this.$globals.session = session;
          this.notify("Got session info, ready for action!", "success");
          this.$router.push("game");
        })
        .catch(error => {
          this.loading = false;
          this.notify(error.toString(), "error");
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
  }
};
</script>
