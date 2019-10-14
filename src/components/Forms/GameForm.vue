<template>
  <div class="wrapper">
    <h1>
      {{totalSelectedGroups}}
      Group<span v-if="totalSelectedGroups!==1">s</span>
      Selected
    </h1>

    <v-expansion-panels multiple>
      <Panel title="Player">
        <PlayerPanel />
      </Panel>

      <Panel title="Team">
        <TeamPanel />
      </Panel>

      <Panel title="Experimental">
        <ExperimentalPanel />
      </Panel>

      <Panel title="Answer Explorer">
        <AnswerExplorerPanel />
      </Panel>
    </v-expansion-panels>
  </div>
</template>
<script>
import Panel from "@/components/Panel";
import PlayerPanel from "@/components/Panels/Player";
import ExperimentalPanel from "@/components/Panels/Experimental";
import AnswerExplorerPanel from "@/components/Panels/AnswerExplorer";
import TeamPanel from "@/components/Panels/Team";

export default {
  name: "GameForm",
  components: {
    PlayerPanel,
    ExperimentalPanel,
    AnswerExplorerPanel,
    TeamPanel,
    Panel
  },
  computed: {
    totalSelectedGroups() {
      return this.$kahoot.getSelectedGroups().length;
    }
  }
};
</script>

<style scoped>
.wrapper {
  padding-top: 5vh;
}
</style>