<template>
  <SimpleAnswerButton color="primary" :choice="Math.floor(Math.random() * 4)">random</SimpleAnswerButton>
</template>

<script>
import SimpleAnswerButton from "./SimpleAnswerButton";

export default {
  name: "RandomAnswerButton",
  components: {
    SimpleAnswerButton
  }
};
</script>