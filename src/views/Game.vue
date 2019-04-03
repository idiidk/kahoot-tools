<template>
  <div>
    <PageHeader title="Game" :subtitle="`Pin: ${this.pin}`"/>
  </div>
</template>

<script>
import PageHeader from "@/components/PageHeader";

export default {
  components: {
    PageHeader
  },
  data: () => {
    return {
      pin: 0
    };
  },
  mounted: function() {
    console.log(this.$globals.client)

    if (this.$globals.client) {
      this.pin = this.$globals.client.pin;
    } else {
      this.$router.push("/");
    }
  }
};
</script>
