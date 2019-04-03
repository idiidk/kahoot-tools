<template>
  <div id="app">
    <transition name="fade" mode="out-in">
      <router-view class="router"/>
    </transition>

    <div class="navigator md-layout">
      <router-link
        tag="md-button"
        class="md-layout-item box"
        active-class="md-primary"
        to="/"
        exact
        v-if="!this.$globals.client"
      >Login</router-link>
      <router-link
        tag="md-button"
        class="md-layout-item box"
        active-class="md-primary"
        to="/game"
        exact
        v-else
      >Game</router-link>
      <router-link
        tag="md-button"
        class="md-layout-item box"
        active-class="md-primary"
        to="/options"
        exact
      >Options</router-link>
    </div>
  </div>
</template>

<style lang="scss">
@import url("https://fonts.googleapis.com/css?family=Roboto:400,700|Material+Icons");
@import "~noty/src/noty.scss";
@import "~noty/src/themes/mint.scss";

.router {
  width: 90%;
  margin: 0 auto;
}

@media only screen and (min-width: 601px) {
  .router {
    width: 85%;
  }
}
@media only screen and (min-width: 1201px) {
  .router {
    width: 70%;
  }
}

.navigator {
  position: fixed;
  bottom: 0;
  width: 100vw;
  margin-bottom: 0.5vh;
}

.navigator .box {
  transition: all 0.2s !important;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s;
}
.fade-enter,
.fade-leave-to {
  opacity: 0;
}
</style>
