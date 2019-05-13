<template>
  <div class="header">
    <h1 class="display-3 font-weight-bold">{{title}}</h1>
    <h3 class="headline">{{subtitle}}</h3>
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
</style>

