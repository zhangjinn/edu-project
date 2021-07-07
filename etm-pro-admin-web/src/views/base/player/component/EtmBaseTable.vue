<template>
  <div class="EtmBaseTable-wrap">
    <el-table
      v-bind="$attrs"
      :data="tableData"
      v-on="$listeners"
    >
      <slot name="left" />
      <el-table-column v-if="type" label="序号" :type="type" width="80px" />
      <el-table-column
        v-for="(col, index) of columns"
        :key="index"
        :show-overflow-tooltip="true"
        :label="col.label"
        :prop="col.prop"
        v-bind="{...col}"
      />
      <slot name="right" />
    </el-table>
  </div>
</template>

<script>
/**
   * EtmBaseTable create by    dengShen
   * createTime   2020/3/16 16:02:16
   */
export default {
  name: 'EtmBaseTable',
  components: {},
  props: {
    tableData: {
      type: Array,
      required: true
    },
    columns: {
      type: Array,
      required: false,
      default() {
        return []
      }
    },
    type: {
      type: String,
      default: 'index',
      validator(val) {
        return ['index', 'selection'].includes(val)
      }
    },
    total: {
      type: Number,
      required: false,
      default() {
        return 1
      }
    }
  },
  data() {
    return {
      routeQuery: this.$route.query
    }
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
  .EtmBaseTable-wrap {

  }
</style>
