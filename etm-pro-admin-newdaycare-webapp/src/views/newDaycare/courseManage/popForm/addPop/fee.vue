<template>
  <div class="earlyType">
    <etm-table-tool-bar>
      <el-input
        v-model.trim="keyword"
        placeholder="请输入费用名称"
        @keyup.native.enter="getData"
      >
        <i
          slot="suffix"
          class="el-icon-search el-input__icon"
          @click.stop="getData"
        />
      </el-input>
    </etm-table-tool-bar>
    <etm-table
      :columns="columns"
      :data="tableData"
      selection
      @selection-change="selection"
    />
  </div>
</template>
<script>
import { queryPrice } from '@/api/newDaycare/courseManage'

export default {
  data () {
    return {
      selectionData: [],
      keyword: '',
      columns: [
        { label: '费用名称', prop: 'priceName' },
        { label: '单价', prop: 'price' }
      ],
      tableData: [{}]
    }
  },
  computed: {},
  methods: {
    selection (event) {
      this.selectionData = event
    },
    getSelectionData () {
      return {
        name: 'PRICE',
        list: this.selectionData
      }
    },
    getData () {
      queryPrice(this.keyword).then(res => {
        this.tableData = res.data || []
      }).catch(err => {
        console.log(err)
      })
    }
  }
}
</script>

<style scoped lang="scss">
.earlyType {
  .el-input__icon {
    cursor: pointer;
  }
}
</style>
