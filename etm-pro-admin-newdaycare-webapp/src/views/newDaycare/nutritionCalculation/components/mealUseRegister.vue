<template>
  <div class="mealUseRegister-wrap">
    <etm-table
      :columns="columns.slice(0, columns.length - 3)"
      :data="tableData"
    >
      <etm-table-tool-bar slot="tool">
        <etm-table-digit :data="tipDada" />
        <div slot="right">
          <el-button
            plain
            @click="printTable"
          >
            打印
          </el-button>
          <el-button
            plain
            @click="exportExcel"
          >
            导出Excel
          </el-button>
        </div>
      </etm-table-tool-bar>
      <template slot="right">
        <el-table-column
          label="实际用量（g）"
          prop="realityUse"
        >
          <template slot-scope="{ row }">
            <el-input
              v-model="row['realityUse']"
              @blur="priceChange(row, 'realityUse')"
            />
          </template>
        </el-table-column>
        <el-table-column
          label="实际单价（元）"
          prop="realityPrice"
        >
          <template slot-scope="{ row }">
            <el-input
              v-model="row['realityPrice']"
              @blur="priceChange(row, 'realityPrice')"
            />
          </template>
        </el-table-column>
        <el-table-column
          label="所需费用（元）"
          prop="price"
        />
      </template>
    </etm-table>

    <print-template
      ref="printTemplateRef"
      :columns="columns"
      :table-data="tableData"
    >
      <template slot="top">
        <h3
          style=" text-align: center;
        width: 100%;"
        >
          食物用量登记
        </h3>
        <div
          style="font-weight: 700;
        margin-bottom: 8px;"
        >
          <span>分析范围：2020-02</span>
          <span style="margin-left: 16px;">人日数：<i>60.61</i></span>
        </div>
      </template>
    </print-template>
  </div>
</template>

<script>
import { dataToExcel } from '@/views/newDaycare/nutritionCalculation/utils'
import printTemplate from '@/views/newDaycare/nutritionCalculation/components/printTemplate'

/**
   * mealUseRegister create by 油麦菜
   * createTime 2021/3/25 10:20
   */
export default {
  name: 'MealUseRegister',
  components: {
    printTemplate
  },
  filters: {},
  mixins: [],
  props: {},
  data () {
    return {
      columns: [
        { label: '序号', prop: 'no' },
        { label: '食材编号', prop: 'mealNo' },
        { label: '食材名称', prop: 'mealName' },
        { label: '食材类型', prop: 'mealType' },
        { label: '计划用量（g）', prop: 'planUse' },
        { label: '实际用量（g）', prop: 'realityUse' },
        { label: '实际单价（元）', prop: 'realityPrice' },
        { label: '所需费用（元）', prop: 'price' }
      ],
      tableData: [
        {
          no: 1,
          mealNo: 123,
          mealName: 123,
          mealType: 123,
          planUse: 123,
          realityUse: 123,
          realityPrice: 123,
          price: 123
        },
        {
          no: 1,
          mealNo: 123,
          mealName: 123,
          mealType: 123,
          planUse: 123,
          realityUse: 123,
          realityPrice: 123,
          price: 123
        },
        {
          no: 1,
          mealNo: 123,
          mealName: 123,
          mealType: 123,
          planUse: 123,
          realityUse: 123,
          realityPrice: 123,
          price: 123
        }
      ],
      tipDada: [
        {
          digit: '2020-02',
          text: '分析范围'
        },
        {
          digit: 60.61,
          text: '人日数'
        }
      ]
    }
  },
  computed: {},
  watch: {},
  created () {
  },
  mounted () {
  },
  methods: {
    priceChange (row, key) {
      row[key] = parseFloat(row[key]) || 0
    },
    exportExcel () {
      dataToExcel({ columns: this.columns, tableData: this.tableData })
    },
    printTable () {
      this.$refs.printTemplateRef.printTable()
    }
  }
}
</script>
<style lang="scss" scoped>
</style>
