<template>
  <div class="card-template-wrap">
    <div v-loading="loading" class="list">
      <slot name="before" />
      <slot name="btn" />
      <slot name="after" />
    </div>
    <el-pagination
      :current-page="pageInfo.pageNo"
      :page-sizes="pageSizes"
      :page-size="pageInfo.pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="pageInfo.count"
      class="etm-pagination"
      v-bind="$attrs"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      v-on="$listeners"
    />
  </div>
</template>
<script>
/**
 * CardTemplate create by shangLu
 * createTime 2020/10/22 14:44
 */
export default {
  name: 'CardTemplate',
  model: {
    prop: 'pageInfo',
    event: 'input'
  },
  props: {
    pageSizes: {
      type: Array,
      default: () => [10, 20, 30, 40]
    },
    pageInfo: {
      type: Object,
      default: () => {
        return {
          pageNo: 1,
          pageSize: 10,
          count: 1
        }
      }
    },
    loading: {
      type: Boolean,
      default: () => false
    }
  },
  data() {
    return {}
  },
  watch: {},
  methods: {
    handleAdd() {
      this.$emit('add')
    },
    handleSizeChange(val) {
      this.pageInfo.pageNo = 1
      this.pageInfo.pageSize = val
      this.$emit('input', this.pageInfo)
      this.$emit('change', this.pageInfo)
    },
    handleCurrentChange(val) {
      this.pageInfo.pageNo = val
      this.$emit('input', this.pageInfo)
      this.$emit('change', this.pageInfo)
    }
  }
}
</script>

<style lang="scss" scoped>
.card-template-wrap {
  padding-bottom: 36px;
  .list {
    width: 100%;
    height: 100%;
    display: flex;
    flex-flow: row wrap;
    //flex: auto;
  }

}

</style>
