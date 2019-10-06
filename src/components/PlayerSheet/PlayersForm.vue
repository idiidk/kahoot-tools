<template>
  <v-container grid-list-md text-xs-center>
    <v-layout row wrap>
      <v-flex xs6>
        <v-text-field v-model="name" maxlength="13" :counter="13" label="Name"></v-text-field>
      </v-flex>

      <v-flex xs6>
        <v-text-field v-model="amount" label="Amount"></v-text-field>
      </v-flex>

      <v-flex xs6>
        <v-btn width="100%" v-on:click="addGroup" color="primary">Add Group</v-btn>
      </v-flex>
      <v-flex xs6>
        <v-btn width="100%" v-on:click="removeSelected" color="primary">Remove Selected</v-btn>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
export default {
  name: "AddPlayersForm",
  data() {
    return {
      name: null,
      amount: 0
    };
  },
  computed: {
    safeAmount() {
      return parseInt(this.amount);
    }
  },
  methods: {
    addGroup() {
      const name = this.name;
      const amount = this.safeAmount;

      if (this.validate(name, amount)) {
        this.$kahoot.addPlayerGroup(name, amount, true, this.$globals.options.selectOnAdd).catch(error => {
          const notify = this.$globals.notify;
          notify(error.message, "error");
        });
      }
    },
    removeSelected() {
      this.$kahoot.removeSelectedGroups();
    },
    validate(name, target) {
      const notify = this.$globals.notify;

      if (name === null) {
        notify(`Player name not provided`, "warning");
        return false;
      }

      if (target <= 0) {
        notify(`Amount should be at least one`, "warning");
        return false;
      }

      if (isNaN(this.safeAmount)) {
        notify(`Amount invalid`, "warning");
        return false;
      }

      const found = this.$kahoot.getGroupByName(name);

      if (found.length > 0) {
        notify(`Group named ${name} already added`, "warning");
        return false;
      }

      return true;
    }
  }
};
</script>

<style lang="scss" scoped>
.players {
  margin-top: 2.5vh;
}
</style>

