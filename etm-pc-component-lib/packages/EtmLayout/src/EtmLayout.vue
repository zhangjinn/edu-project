<template>
  <div class="EtmLayout-wrap">
    <el-header>
      <slot name="nav" />
    </el-header>
    <el-container>
      <el-aside width="200px">
        <slot name="menu" />
      </el-aside>
      <el-main>
        <slot />
      </el-main>
    </el-container>

  </div>
</template>

<script>
/**
   *  2020/4/29 9:32
   *  haijinsha
   */
export default {
  name: 'EtmLayout',
  filters: {},
  mixins: [],
  props: {},
  data() {
    return {}
  },
  computed: {},
  watch: {},
  created() {
  },
  mounted() {
  },
  methods: {}
}
</script>

<style lang="scss" scoped src="../../styles/src/etm/layout.scss"/>
