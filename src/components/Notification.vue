<template>
  <v-snackbar
    v-model="$globals.notification.active"
    top
    right
    :timeout="2500"
    :color="$globals.notification.type"
  >
    {{$globals.notification.text}}
    <v-btn dark text @click="$globals.notification.active = false">Close</v-btn>
  </v-snackbar>
</template>

<script>
export default {
  name: "Notification"
};
</script>