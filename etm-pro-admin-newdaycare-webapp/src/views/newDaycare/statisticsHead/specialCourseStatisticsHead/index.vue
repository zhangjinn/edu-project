<template>
  <div class="index-wrap">
    <etm-main-body>
      <etm-layout-split>
        <div slot="header">
          <etm-tabs v-model="activeName">
            <el-tab-pane
              label="特色课情况统计"
              name="special"
            >
              <etm-tool-bar
                v-model="searchData"
                @search="handleSearch"
                @reset="reset"
              >
                <el-form-item
                  label="园所:"
                  prop="organizationId"
                >
                  <etm-area-garden-cascader
                    :clear="clear"
                    :has-default="true"
                    @change="getOrganizationId"
                  />
                </el-form-item>
                <el-form-item
                  label="学期:"
                  prop="courseTermId"
                >
                  <el-select
                    v-model="searchInfo.courseTermId"
                    @change="$forceUpdate()"
                  >
                    <el-option
                      v-for="(item,index) in courseTermList"
                      :key="index"
                      :value="item.id"
                      :label="item.name"
                    />
                  </el-select>
                </el-form-item>
                <el-form-item
                  label="课程名称:"
                  prop="specialCourseName"
                >
                  <el-input
                    v-model="searchInfo.specialCourseName"
                    placeholder="请输入课程名称"
                  />
                </el-form-item>
              </etm-tool-bar>
            </el-tab-pane>
          </etm-tabs>
        </div>
        <div slot="body">
          <etm-table
            ref="xlsxTable"
            v-fixedHead
            :data="tableData"
            :columns="columns"
            :span-method="objectSpanMethod"
          >
            <etm-table-tool-bar slot="tool">
              <el-button
                slot="right"
                plain
                @click="exportTableToExcel({ref:$refs.xlsxTable.$el, name:'特色课情况统计'})"
              >
                导出Excel
              </el-button>
            </etm-table-tool-bar>
            <el-table-column
              slot="left"
              label="特色课程名称"
              prop="specialCourseName"
            >
              <template slot-scope="scoped">
                <div :class="getClass(scoped.$index) ? 'main textCenter' : ''">
                  {{ scoped.row.specialCourseName }}
                </div>
              </template>
            </el-table-column>
            <el-table-column
              slot="left"
              label="授课老师"
              prop="employeeName"
            >
              <template slot-scope="scoped">
                <div :class="getClass(scoped.$index) ? 'main textCenter' : ''">
                  {{ scoped.row.employeeName }}
                </div>
              </template>
            </el-table-column>
            <el-table-column
              slot="right"
              label="老师类型"
              prop="employeeType"
            >
              <template slot-scope="scoped">
                <div :class="getClass(scoped.$index) ? 'main textCenter' : ''">
                  {{ scoped.row.employeeType }}
                </div>
              </template>
            </el-table-column>
            <el-table-column
              slot="right"
              align="right"
              label="课程价格（元）"
              prop="price"
            >
              <template slot-scope="scoped">
                <div :class="getClass(scoped.$index) ? 'main textCenter' : ''">
                  {{ formatMoney(scoped.row.price) }}
                </div>
              </template>
            </el-table-column>
            <el-table-column
              slot="right"
              label="报名人数"
              prop="purchasedNum"
            >
              <template slot-scope="scoped">
                <div :class="getClass(scoped.$index) ? 'main' : ''">
                  {{ scoped.row.purchasedNum }}
                </div>
              </template>
            </el-table-column>
            <el-table-column
              slot="right"
              align="right"
              label="待对账金额"
              prop="notReconciliationAmount"
            >
              <template slot-scope="scoped">
                <div :class="getClass(scoped.$index) ? 'main' : ''">
                  {{
                    formatMoney(scoped.row.notReconciliationAmount)
                  }}
                </div>
              </template>
            </el-table-column>
            <el-table-column
              slot="right"
              align="right"
              label="已对账金额"
              prop="reconciliationAmount"
            >
              <template slot-scope="scoped">
                <div :class="getClass(scoped.$index) ? 'main' : ''">
                  {{
                    formatMoney(scoped.row.reconciliationAmount)
                  }}
                </div>
              </template>
            </el-table-column>
          </etm-table>
        </div>
      </etm-layout-split>
    </etm-main-body>
  </div>
</template>

<script>/**
 * index create by Administrator
 * createTime 2021/1/28 10:28
 */

import {
  queryCourseTermListByOrganizationId,
  querySpecialCourseStatistics
} from '@/api/newDaycare/statisticsHead'
import EtmAreaGardenCascader from '@/views/newDaycare/statisticsHead/component/EtmAreaGardenCascader'
import baseMixin from '@/layout/mixin/baseMixin'

export default {
  name: 'Index',
  components: { EtmAreaGardenCascader },
  filters: {},
  mixins: [baseMixin],
  props: {},
  data () {
    return {
      activeName: 'special',
      searchData: [],
      searchInfo: {},
      clear: false,
      courseTermList: [],
      tableData: [],
      columns: []
    }
  },
  computed: {},
  watch: {},
  created () {

  },
  mounted () {
  },
  methods: {
    handleSearch () {
      this.getList()
    },
    reset () {
      this.searchInfo.specialCourseName = null
      this.clear = !this.clear
    },
    getTermList (id, type) {
      const param = {
        organizationId: id
      }
      queryCourseTermListByOrganizationId(param).then(res => {
        this.courseTermList = res.data
        if (this.courseTermList.length) {
          let flag = false
          this.courseTermList.forEach(item => {
            if (item.currentTerm) {
              this.searchInfo.courseTermId = item.id
              flag = true
            }
          })
          if (!flag) {
            this.searchInfo.courseTermId = this.courseTermList[0].id
          }
        }
        if (type === 'load') {
          this.getList()
        }
      })
    },
    getOrganizationId (value) {
      this.searchInfo.organizationId = value.value[1]
      if (value.type === 'load') {
        if (this.courseTermList.length) {
          let flag = false
          this.courseTermList.forEach(item => {
            if (item.currentTerm) {
              this.searchInfo.courseTermId = item.id
              flag = true
            }
          })
          if (!flag) {
            this.searchInfo.courseTermId = this.courseTermList[0].id
          }
          this.getList()
        } else {
          this.getTermList(this.searchInfo.organizationId, 'load')
        }
      } else {
        this.getTermList(this.searchInfo.organizationId)
      }
    },
    getList () {
      const param = {}
      for (const i in this.searchInfo) {
        param[i] = this.searchInfo[i]
      }
      querySpecialCourseStatistics(param).then(res => {
        const data = res.data
        const tableData = data.list
        if (data.list.length) {
          const itemData = {
            specialCourseName: '汇总',
            employeeName: '汇总',
            employeeType: '汇总',
            price: '汇总',
            purchasedNum: data.purchasedNumTotal,
            notReconciliationAmount: data.notReconciliationAmountTotal,
            reconciliationAmount: data.reconciliationAmountTotal
          }
          tableData.push(itemData)
        }
        this.tableData = tableData
      })
    },
    objectSpanMethod ({ row, column, rowIndex, columnIndex }) { // 表格合并
      if (rowIndex === (this.tableData.length - 1)) {
        if (columnIndex === 1) {
          return {
            rowspan: 1,
            colspan: 4
          }
        } else if (columnIndex < 4) {
          return {
            rowspan: 0,
            colspan: 0
          }
        }
      }
    },
    getClass (index) {
      if (index === (this.tableData.length - 1)) {
        return true
      } else {
        return false
      }
    },
    formatMoney (money) {
      if (!isNaN(money)) {
        return money.toFixed(2)
      } else {
        return money
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.index-wrap {
  .main {
    @include etm-color();
  }

  .textCenter {
    text-align: center;
  }
}
</style>
