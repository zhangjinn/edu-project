<template>
  <div class="StaticDialog-wrap">
    <etm-layout-split style="height: 100%">

      <el-button @click="test">测试</el-button>
      <EtmStaticDialog :target="target" :visible.sync="visible">
        <el-tag>我是内容</el-tag>
        <el-tag>我是内容</el-tag>
        <el-tag>我是内容</el-tag>
        <el-tag>我是内容</el-tag>
      </EtmStaticDialog>
    </etm-layout-split>
  </div>

</template>

<script>
/**
 * StaticDialog create by haijinsha
 * createTime 2020/8/25 09:18
 */
export default {
  name: 'StaticDialog',
  components: {},
  filters: {},
  mixins: [],
  props: {},
  data() {
    return {
      target: {},
      visible: false
    }
  },
  computed: {},
  watch: {},
  created() {
  },
  mounted() {
  },
  methods: {
    test(e) {
      this.target = e
      this.visible = true
    }
  }
}
</script>
<style lang="scss" scoped>
  .StaticDialog-wrap {
    height: 100%;
  }
</style>
