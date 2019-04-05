<template>
  <div>
    <h1>Add Player Groups</h1>

    <div class="md-layout md-gutter">
      <div class="md-layout-item">
        <md-field>
          <label>Name</label>
          <md-input v-model="name"></md-input>
        </md-field>
      </div>
      <div class="md-layout-item">
        <md-field>
          <label>Amount</label>
          <md-input type="number" v-model="amount"></md-input>
        </md-field>
      </div>
    </div>

    <md-button class="md-raised md-primary add-button">Add</md-button>
  </div>
</template>

<script>
export default {
  name: "PlayerHacks",
  methods: {
    addPlayer: function() {}
  },
  data: () => {
    return {
      name: "",
      amount: 0
    };
  }
};
</script>

<style lang="scss" scoped>
.add-button {
  margin: 0;
  margin-top: 4px;
  width: 100%;
}
</style>

