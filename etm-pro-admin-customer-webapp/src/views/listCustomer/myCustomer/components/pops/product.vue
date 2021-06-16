<template>
  <div class="earlyType">
    <etm-table-tool-bar>
      <el-row>
        <el-col :span="11">
          <el-select
            v-model="productValue"
            @change="getData"
          >
            <el-option
              label="所有类型"
              :value="null"
            />
            <el-option
              v-for="(item,index) in productType"
              :key="index"
              :label="item.productTypeName"
              :value="item.productTypeId"
            />
          </el-select>
        </el-col>
        <el-col
          :span="11"
          :offset="1"
        >
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
        </el-col>
      </el-row>
    </etm-table-tool-bar>
    <etm-table
      :columns="columns"
      :data="tableData"
      selection
      @selection-change="selection"
    >
      <el-table-column
        slot="left"
        label="封面"
        width="100"
      >
        <template v-slot="{row}">
          <el-image
            :src="row.cover"
            style="width:60px; height:60px"
          />
        </template>
      </el-table-column>
    </etm-table>
  </div>
</template>
<script>
import {
  queryProductType,
  queryProduct
} from '@/api/customer'
export default {
  data () {
    return {
      selectionData: [],
      keyword: null,
      productType: [],
      productValue: null,
      columns: [
        { label: '产品名称', prop: 'productName' },
        { label: '单价', prop: 'unitPrice' }
      ],
      tableData: []
    }
  },
  computed: {},
  created () {
    this.getProtype()
  },
  methods: {
    getProtype () {
      queryProductType().then(res => {
        this.productType = res.data
      })
    },
    getData () {
      queryProduct({
        name: this.keyword,
        productTypeId: this.productValue
      }).then(res => {
        const result = res.data
        this.tableData = result
        return result
      })
    },
    selection (event) {
      this.selectionData = event
    },
    getSelectionData () {
      return {
        name: 'PRODUCT',
        list: this.selectionData
      }
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
