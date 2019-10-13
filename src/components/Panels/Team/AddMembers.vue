<template>
  <div>
    <h1>Members</h1>
    <div>
      <span v-for="(member, index) of members" :key="member">
        {{member}}
        <span v-if="index !== members.length -1">-</span>
      </span>
    </div>
    <v-row>
      <v-col cols="12">
        <v-text-field v-model="memberName" v-on:keyup.enter="addMember" label="Member Name"></v-text-field>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <v-btn @click="addMember" block color="primary">add member</v-btn>
      </v-col>
      <v-col>
        <v-btn @click="removeMember" block color="primary">remove member</v-btn>
      </v-col>
      <v-col>
        <v-btn @click="sendMembers" block color="primary">send members</v-btn>
      </v-col>
    </v-row>
  </div>
</template>

<script>
export default {
  name: "AddMembers",
  data() {
    return {
      members: [],
      memberName: ""
    };
  },
  methods: {
    addMember() {
      if (!this.members.includes(this.memberName)) {
        this.members.push(this.memberName);
      }
    },
    removeMember() {
      this.members.splice(this.members.length - 1, 1);
    },
    sendMembers() {
      const players = this.$kahoot.getSelectedPlayers();
      players.forEach(player => {
        player.team(this.members);
      });
    }
  }
};
</script>