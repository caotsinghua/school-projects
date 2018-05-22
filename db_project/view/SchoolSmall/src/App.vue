<template>
  <div id="app">
  <transition mode="out-in" leave-active-class="animated fadeOut">
    <router-view></router-view>
  </transition>
    
  </div>
</template>

<script>
export default {
  name: 'app'
}
</script>

<style>

</style>
