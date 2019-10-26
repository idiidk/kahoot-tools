<template>
  <div>
    <v-row>
      <v-col>
        <h1>Player Takeover</h1>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <v-switch v-model="enableTakeover" label="Enable takeover"></v-switch>
      </v-col>
    </v-row>

    <div v-if="enableTakeover">
      <v-row>
        <v-col>
          <v-btn color="primary" @click="takeOverAll">take over all</v-btn>
        </v-col>
      </v-row>
      <v-list subheader>
        <v-subheader>PLAYERS</v-subheader>
        <CidTakeoverItem
          v-for="nemesis of $globals.nemeses"
          ref="nemeses"
          :key="nemesis.cid"
          :player="nemesis"
        />
      </v-list>
    </div>
  </div>
</template>

<script>
import CidTakeoverItem from "./CidTakeoverItem";

export default {
  name: "CidTakeover",
  components: { CidTakeoverItem },
  methods: {
    takeOverAll() {
      const nemeses = this.$refs.nemeses;
      if (nemeses) {
        nemeses.forEach(nemesis => {
          nemesis.initiateTakeover();
        });
      }
    }
  },
  data() {
    return {
      enableTakeover: false
    };
  }
};
</script>