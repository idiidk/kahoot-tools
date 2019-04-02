<template>
  <div>
    <md-field>
      <label>Pin</label>
      <md-input v-model="pin" :disabled="loading" type="pin"></md-input>
    </md-field>

    <div class="centerer">
      <md-button class="md-primary md-raised" v-on:click="doLogin" v-if="!loading">find session</md-button>
      <md-progress-spinner :md-diameter="50" :md-stroke="5" md-mode="indeterminate" v-else></md-progress-spinner>
    </div>
  </div>
</template>

<script>
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

      const client = new Kahoot.Client()
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

<style>
.centerer {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
}
</style>
