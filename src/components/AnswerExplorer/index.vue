<template>
  <v-row no-gutters>
    <v-slide-x-transition hide-on-leave>
      <SearchKahoots v-on:kahootSelected="kahootSelected" v-if="!uuid" />
      <KahootInfo v-else v-on:resetSelected="resetSelected" :uuid="uuid" />
    </v-slide-x-transition>
  </v-row>
</template>

<script>
import SearchKahoots from "./SearchKahoots";
import KahootInfo from "./KahootInfo";

export default {
  name: "AnswerExplorer",
  data() {
    return {
      uuid: null
    };
  },
  components: {
    SearchKahoots,
    KahootInfo
  },
  methods: {
    kahootSelected(uuid) {
      this.uuid = uuid;
    },
    resetSelected() {
      this.uuid = null;
    }
  }
};
</script>