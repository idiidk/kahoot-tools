<template>
  <div>
    <v-row>
      <v-col>
        <h1>Player Takeover</h1>
      </v-col>
    </v-row>
    <v-list subheader>
      <v-subheader>PLAYERS</v-subheader>
      <CidTakeoverItem v-for="nemesis of $globals.nemeses" :key="nemesis.cid" :player="nemesis" />
    </v-list>
  </div>
</template>

<script>
import CidTakeoverItem from "./CidTakeoverItem";

export default {
  name: "CidTakeover",
  components: { CidTakeoverItem }
};
</script>