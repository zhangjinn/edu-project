<template>
  <div class="EtmTablePage-wrap">
    <div v-if="$slots.tool">
      <slot name="tool" />
    </div>
    <el-table
      v-bind="$attrs"
      :data="tableData.content"
      class="etm-table"
      v-on="$listeners"
    >
      <slot name="left" />
      <el-table-column v-if="type" :type="type" label="序号" align="center" width="80px" />
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
    <el-pagination
      v-if="showPage"
      v-bind="$attrs"
      style="padding-left: 24px;"
      :page-sizes="[10, 20, 30, 40]"
      :page-size="pageInfo.pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="tableData.totalElements"
      @size-change="sizeChange"
      @current-change="currentChange"
      v-on="$listeners"
    />
  </div>
</template>

<script>/**
   *  2020/4/3 14:17
   *  haijinsha
   */

import baseMixin from '@/layout/mixin/baseMixin'

export default {
  name: 'EtmTablePage',
  filters: {},
  mixins: [baseMixin],
  props: {
    tableData: {
      type: Object,
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
      default: '',
      validator(val) {
        return ['selection', 'index', ''].includes(val)
      }
    },
    showPage: {
      type: Boolean,
      default: true
    },
    pageSize: {
      type: Number,
      default: 10
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
    return {}
  },
  computed: {},
  watch: {},
  created() {
  },
  mounted() {

  },
  methods: {
    sizeChange(e) { // xuancao-add
      this.$emit('sizeChange', e)
    },
    currentChange(e) {
      this.$emit('currentChange', e)
    }
  }
}
</script>

<style lang="scss" scoped>
  .EtmTablePage-wrap {
    padding-top: 24px;

  }
</style>
