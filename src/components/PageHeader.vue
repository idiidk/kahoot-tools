<template>
  <div class="header">
    <h1 class="display-3 font-weight-black">{{title}}</h1>
    <h2 class="display-1">{{subtitle}}</h2>
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
  padding-bottom: 3vh;
  
}
</style>

