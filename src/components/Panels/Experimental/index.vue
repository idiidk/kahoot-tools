<template>
  <div>
    <FillLeaderboard />
    <CidTakeover />
  </div>
</template>

<script>
import CidTakeover from "./CidTakeover";
import FillLeaderboard from "./FillLeaderboard";

export default {
  name: "ExperimentalPanel",
  components: {
    CidTakeover,
    FillLeaderboard
  }
};
</script>
