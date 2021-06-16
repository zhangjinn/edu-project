<template>
  <div id="app">
    <etm-layout>
      <etm-nav slot="nav" />
      <etm-menu slot="menu" />
      <transition name="fade-transform" mode="out-in">
        <router-view :key="key" />
      </transition>
    </etm-layout>
  </div>
</template>

<script>

import EtmNav from '@/component/etm-nav'
import EtmMenu from '@/component/etm-menu'

export default {
  name: 'App',
  components: { EtmMenu, EtmNav },
  data() {
    return {}
  },
  computed: {
    key() {
      return this.$route.path
    }
  },
  mounted() {

  },
  methods: {}
}
</script>

<style>
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    list-style: none;
  }
</style>
