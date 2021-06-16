<template>
  <div class="columns-wrap">
    <el-row class="row">
      <el-col :span="8" />
    </el-row>
  </div>
</template>

<script>
/**
 * columns create by Administrator
 * createTime 2020/9/10 13:51
 */
export default {
  name: 'Columns',
  components: {},
  filters: {},
  mixins: [],
  props: {},
  data () {
    return {}
  },
  computed: {},
  watch: {},
  created () {
    console.log(this.$slots)
  },
  mounted () {
  },
  methods: {}
}
</script>
<style lang="scss" scoped>
</style>
