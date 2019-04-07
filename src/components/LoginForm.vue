<template>
  <div>
    <md-field>
      <label>Pin</label>
      <md-input v-model="pin" :disabled="loading" type="pin"></md-input>
    </md-field>

    <div class="centerer" v-if="!loading">
      <md-button class="md-primary md-raised" v-on:click="doLogin">find session</md-button>
    </div>

    <span class="centerer" v-else>
      <md-progress-spinner md-mode="indeterminate"></md-progress-spinner>
    </span>
  </div>
</template>

<script>
import { Config } from "@/main";
import Kahoot from "kahoot-api";
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

      const client = new Kahoot.Client(
        this.pin,
        `//${Config.corsUrl}:${Config.corsPort}/`
      );

      client
        .initialize()
        .then(session => {
          this.loading = false;
          this.notify("Got session, ready for action!", "success");

          this.$globals.client = client;
          this.$router.push("game");
        })
        .catch(error => {
          this.loading = false;

          if (error.toString().includes(404)) {
            error = "Game not found";
          } else if (
            error
              .toString()
              .toLowerCase()
              .includes("network")
          ) {
            error = "Network error, is the cors proxy running?";
          }

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
