<template>
  <div class="Title-wrap">
    <etm-layout-split :styles="{height: '100vh'}">
      <etm-title title="标题" />
      <etm-title>标题1</etm-title>
      <etm-title title="标题2" border>
        <template slot="tool">
          <el-button type="primary">按钮</el-button>
          <el-button type="primary">按钮</el-button>
        </template>
      </etm-title>
    </etm-layout-split>
  </div>

</template>

<script>
/**
 * Title create by haijinsha
 * createTime 2020/9/2 16:15
 */
export default {
  name: 'Title',
  components: {},
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
<style lang="scss" scoped>
  .Title-wrap {

  }
</style>
