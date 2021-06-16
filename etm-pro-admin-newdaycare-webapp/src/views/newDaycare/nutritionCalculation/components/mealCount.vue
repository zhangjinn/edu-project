<template>
  <div class="mealCount-wrap">
    <etm-table
      :data="tableData"
      :span-method="spanMethod"
    >
      <etm-table-tool-bar slot="tool">
        <div class="meal-count-register">
          <span class="month-register">2月就餐人数登记</span>
          <span class="people-count">人日数：<i>0</i></span>
          <el-radio-group
            v-model="radio"
            @change="radioChange"
          >
            <el-radio label="all">
              显示所有
            </el-radio>
            <el-radio label="total">
              只显示合计
            </el-radio>
          </el-radio-group>
        </div>
        <div slot="right">
          <el-button type="primary">
            重新登记
          </el-button>
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
      <el-table-column
        v-for="item in dynamicColumns"
        :key="item.prop"
        :label="item.label"
        :prop="item.prop"
      >
        <template slot-scope="{ row }">
          <template v-if="radio === 'all'">
            <template v-if="row.a !== '合计'">
              <el-input
                v-if="item.isEdit"
                v-model="row[item.prop]"
                @blur="priceChange(row, item.prop)"
              />
              <span v-else>{{ row[item.prop] }}</span>
            </template>
            <template v-else>
              <span>{{ row[item.prop] }}</span>
            </template>
          </template>
          <template v-else>
            <el-input
              v-if="item.isEdit"
              v-model="row[item.prop]"
              @blur="priceChange(row, item.prop)"
            />
            <span v-else>{{ row[item.prop] }}</span>
          </template>
        </template>
      </el-table-column>
    </etm-table>
    <print-template
      ref="printTemplateRef"
      :columns="dynamicColumns"
      :table-data="tableData"
      :merge="true"
    >
      <template slot="top">
        <h3
          style=" text-align: center;
        width: 100%;"
        >
          就餐人数登记
        </h3>
        <div
          style="font-weight: 700;
        margin-bottom: 8px;"
        >
          <span>2月就餐人数登记</span>
          <span style="margin-left: 16px;">人日数：<i>0</i></span>
        </div>
      </template>
    </print-template>
  </div>
</template>

<script>
/**
   * mealCount create by 油麦菜
   * createTime 2021/3/23 15:55
   */
import formValidate from '@/utils/rules'
import { dataToExcel } from '@/views/newDaycare/nutritionCalculation/utils'
import printTemplate from '@/views/newDaycare/nutritionCalculation/components/printTemplate'

export default {
  name: 'MealCount',
  components: {
    printTemplate
  },
  filters: {},
  mixins: [],
  props: {},
  data () {
    return {
      formValidate: formValidate,
      dynamicColumns: [
        { label: '年级', prop: 'a', isEdit: false },
        { label: '班级', prop: 'b', isEdit: false },
        { label: '早餐', prop: 'c', isEdit: true },
        { label: '早点', prop: 'd', isEdit: true },
        { label: '午餐', prop: 'e', isEdit: true },
        { label: '午点', prop: 'f', isEdit: true },
        { label: '晚餐', prop: 'g', isEdit: true },
        { label: '晚点', prop: 'h', isEdit: true },
        { label: '平均人日数', prop: 'i', isEdit: false }
      ],
      tableData: [
        {
          a: 'a',
          b: 1,
          c: 1,
          d: 1,
          e: 1,
          f: 1,
          g: 1,
          h: 1,
          i: 1
        },
        {
          a: 'a',
          b: 1,
          c: 1,
          d: 1,
          e: 1,
          f: 1,
          g: 1,
          h: 1,
          i: 1
        },
        {
          a: 'a',
          b: 1,
          c: 1,
          d: 1,
          e: 1,
          f: 1,
          g: 1,
          h: 1,
          i: 1
        },
        {
          a: 'a',
          b: 1,
          c: 1,
          d: 1,
          e: 1,
          f: 1,
          g: 1,
          h: 1,
          i: 1
        },
        {
          a: 'aa',
          b: 1,
          c: 1,
          d: 1,
          e: 1,
          f: 1,
          g: 1,
          h: 1,
          i: 1
        },
        {
          a: 'aaa',
          b: 1,
          c: 1,
          d: 1,
          e: 1,
          f: 1,
          g: 1,
          h: 1,
          i: 1
        },
        {
          a: 'aaaa',
          b: 1,
          c: 1,
          d: 1,
          e: 1,
          f: 1,
          g: 1,
          h: 1,
          i: 1
        },
        {
          a: 'aaaaa',
          b: 1,
          c: 1,
          d: 1,
          e: 1,
          f: 1,
          g: 1,
          h: 1,
          i: 1
        },
        {
          a: '你',
          b: 1,
          c: 1,
          d: 1,
          e: 1,
          f: 1,
          g: 1,
          h: 1,
          i: 1
        },
        {
          a: '你你你你你你你你你你你你你你你你你你你你你你',
          b: 1,
          c: 1,
          d: 1,
          e: 1,
          f: 1,
          g: 1,
          h: 1,
          i: 1
        },
        {
          a: '你你你',
          b: 1,
          c: 1,
          d: 1,
          e: 1,
          f: 1,
          g: 1,
          h: 1,
          i: 1
        },
        {
          a: '合计',
          b: 1,
          c: 1,
          d: 1,
          e: 1,
          f: 1,
          g: 1,
          h: 1,
          i: 1
        }
      ],
      radio: 'all'
    }
  },
  computed: {
  },
  watch: {},
  created () {
  },
  mounted () {
  },
  methods: {
    priceChange (row, key) {
      row[key] = parseFloat(row[key]) || 0
    },
    spanMethod ({ row, column, rowIndex, columnIndex }) {
      if ((rowIndex + 1) === this.tableData.length) {
        if (columnIndex === 0) {
          return {
            rowspan: 1,
            colspan: 2
          }
        } else if (columnIndex === 1) {
          return {
            rowspan: 0,
            colspan: 0
          }
        }
      }
    },
    exportExcel () {
      const merges = [{
        row: this.tableData.length + 1,
        col: 1,
        rowspan: 0,
        colspan: 2
      }]
      dataToExcel({ columns: this.dynamicColumns, tableData: this.tableData, merges })
    },
    radioChange (val) {
      console.log('请求数据', val)
      if (val === 'total') {
        this.tableData = [
          {
            a: '合计',
            b: 1,
            c: 1,
            d: 1,
            e: 1,
            f: 1,
            g: 1,
            h: 1,
            i: 1
          }
        ]
      } else {
        this.resetDataTmp()
      }
    },
    resetDataTmp () {
      this.tableData = [
        {
          a: 'a',
          b: 1,
          c: 1,
          d: 1,
          e: 1,
          f: 1,
          g: 1,
          h: 1,
          i: 1
        },
        {
          a: 'aa',
          b: 1,
          c: 1,
          d: 1,
          e: 1,
          f: 1,
          g: 1,
          h: 1,
          i: 1
        },
        {
          a: 'aaa',
          b: 1,
          c: 1,
          d: 1,
          e: 1,
          f: 1,
          g: 1,
          h: 1,
          i: 1
        },
        {
          a: 'aaaa',
          b: 1,
          c: 1,
          d: 1,
          e: 1,
          f: 1,
          g: 1,
          h: 1,
          i: 1
        },
        {
          a: 'aaaaa',
          b: 1,
          c: 1,
          d: 1,
          e: 1,
          f: 1,
          g: 1,
          h: 1,
          i: 1
        },
        {
          a: '你',
          b: 1,
          c: 1,
          d: 1,
          e: 1,
          f: 1,
          g: 1,
          h: 1,
          i: 1
        },
        {
          a: '你你你你你你你你你你你你你你你你你你你你你你',
          b: 1,
          c: 1,
          d: 1,
          e: 1,
          f: 1,
          g: 1,
          h: 1,
          i: 1
        },
        {
          a: '你你你',
          b: 1,
          c: 1,
          d: 1,
          e: 1,
          f: 1,
          g: 1,
          h: 1,
          i: 1
        },
        {
          a: '合计',
          b: 1,
          c: 1,
          d: 1,
          e: 1,
          f: 1,
          g: 1,
          h: 1,
          i: 1
        }
      ]
    },
    printTable () {
      this.$refs.printTemplateRef.printTable()
    }
  }
}
</script>
<style lang="scss" scoped>

  .mealCount-wrap {
    margin-top: 16px;

    .inschool-wrap {
      align-items: flex-end;
      display: flex;
      height: 32px;
      line-height: 1.2;
    }

    .meal-count-register {
      align-items: center;
      display: flex;
      justify-content: center;

      .month-register,
      .people-count {
        color: #222;
        font-size: 14px;
        font-weight: 700;

        i {
          @include etm-color;
          color: #222;
          font-size: 14px;
          font-style: normal;
          font-weight: 400;
        }
      }

      .people-count {
        margin: 0 40px;
      }
    }
  }

  .el-form-item--small.el-form-item {
    margin-bottom: 0;
  }
</style>
