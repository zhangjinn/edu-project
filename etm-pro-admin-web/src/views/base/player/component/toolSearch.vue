<template>
  <div class="toolSearch-wrap">
    <el-row type="flex" justify="space-between">
      <el-col :span="6">
        <el-input
          v-model="value"
          style="width: 218px;"
          clearable
          v-bind="$attrs"
          @change="$emit('change', value)"
          @keydown.13.native.prevent="search(value)"
          @submit.native.prevent
          @blur="search(value)"
        />
        <!--        <el-button>搜索</el-button>-->
      </el-col>
      <el-col :span="18">
        <el-row type="flex" justify="end">
          <slot />
        </el-row>
      </el-col>
    </el-row>
  </div>
</template>

<script>
/**
   * toolSearch create by    dengShen
   * createTime   2020/3/16 14:19:36
   */
export default {
  name: 'ToolSearch',
  components: {},
  props: {},
  data() {
    return {
      value: '',
      routeQuery: this.$route.query
    }
  },
  computed: {},
  watch: {},
  created() {
  },
  mounted() {
    this.init()
  },
  methods: {
    init() {
      console.log(`toolSearch is running...`)
    },
    keydown(e) {
      console.log('$emit(search, value)', e)
    },
    search(value) {
      this.$emit('input', value)
      this.$emit('search', value)
    }
  }
}
</script>

<style lang="scss" scoped>
  .toolSearch-wrap {
    margin: 16px 0;
  }
</style>
