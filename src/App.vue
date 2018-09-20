<template>
  <div id="app">
    <keep-alive>
     <router-view/>
    </keep-alive>
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>

<style>
@import url('./assets/css/reset.css');
@import url('./assets/css/mixin.css');
body {
  background-color: #fafafa;
}
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
.picker-slot {
  font-size: 32px; /*px*/
}
.mint-toast-text {
  font-size: 30px; /*px*/
}
</style>
