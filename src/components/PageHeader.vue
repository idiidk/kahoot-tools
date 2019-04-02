<template>
  <div class="header">
    <span class="title">{{title}}</span>
    <p class="subtitle">{{subtitle}}</p>
  </div>
</template>

<script>
export default {
  name: "PageHeader",
  props: ["title", "subtitle"]
};
</script>

<style scoped>
.header {
  width: 100%;
  text-align: center;
  padding-top: 7.5vh;
}

.title {
  font-size: 7.5vmin;
  font-weight: 700;
}

.subtitle {
  font-size: 4vmin;
  font-weight: normal;
}
</style>

