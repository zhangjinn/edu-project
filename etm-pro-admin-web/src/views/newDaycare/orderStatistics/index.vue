<template>
  <div class="index-wrap">
    <!--幼儿收费明细 数字化报表-->
    <etm-layout-split>
      <div slot="header">
        <etm-tabs v-model="activeName" :setting="false" :show-toggle="false">
          <el-tab-pane name="orderStatistics" label="幼儿收费明细">
            <etm-tool-bar v-model="formData" @search="handleSearch" @reset="reset" />
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
          @currentChange="currentChange"
          @selection-change="handleSelectionChange"
        >
          <etm-table-tool-bar slot="tool">
            <div slot="right">
              <el-button plain @click="exportTableToExcel({ref:$refs.xlsxTable.$el,name:tabPlanLabel})">导出Excel</el-button>
            </div>
          </etm-table-tool-bar>
          <!--<el-table-column slot="left" fixed="left" label="幼儿姓名" width="180" prop="enterpriseName">-->
          <!--  <template slot-scope="scoped">-->
          <!--    <div>{{ scoped.row.childName }}</div>-->
          <!--  </template>-->
          <!--</el-table-column>-->
          <!--<el-table-column slot="right" fixed="right" label="日期" width="120" align="right">-->
          <!--  <template slot-scope="scoped">-->
          <!--    <span class="main">{{ scoped.row.paymentDate }}</span>-->
          <!--  </template>-->
          <!--</el-table-column>-->
        </etm-table>
      </div>
    </etm-layout-split>
  </div>

</template>

<script>
/**
 * index create by Administrator
 * createTime 2021/2/1 15:15
 */
import { queryOrderStatisticsHeadList, downExcelOrderStatistics, queryClassList } from '@/api/newDaycare/statisticsHead'
import { downloadFileForUrl } from '@/utils/file'
import { parseTime } from '@/utils'
import baseMixin from '@/layout/mixin/baseMixin'

export default {
  name: 'Index',
  components: {},
  filters: {},
  mixins: [baseMixin],
  props: {},
  data() {
    return {
      tabPlanLabel: '幼儿收费明细',
      activeName: 'orderStatistics',
      tableData: [],
      formData: [
        {
          label: '收费日期',
          type: 'date',
          value: [parseTime(new Date(), '{y}-{m}-{d}'), parseTime(new Date(), '{y}-{m}-{d}')],
          prop: 'date',
          props: {
            type: 'daterange',
            startPlaceholder: '年/月',
            endPlaceholder: '年/月'
            // defaultTime: [new Date(), new Date()]
          }
        },
        {
          label: '幼儿姓名',
          type: 'input',
          value: '',
          prop: 'name',
          props: {
            placeholder: '请输入幼儿姓名'
          }
        },
        {
          label: '状态',
          type: 'select',
          value: '',
          prop: 'childStatus',
          props: {
            placeholder: '请选择状态'
          },
          options: [
            {
              label: '在园',
              value: 'IN'
            },
            {
              label: '退园',
              value: 'OUT'
            }
          ]
        },
        {
          label: '班级',
          type: 'select',
          value: '',
          prop: 'clazzId',
          props: {
            placeholder: '请选择班级'
          },
          options: []
        }
      ],
      columns: [
        {
          label: '幼儿姓名',
          width: '120',
          prop: 'childName',
          fixed: 'left'
        },
        {
          label: '班级',
          width: '120',
          prop: 'clazzName',
          fixed: 'left'
        },
        {
          label: '状态',
          width: '120',
          prop: 'status',
          fixed: 'left'
        },
        {
          label: '收费科目',
          width: '120',
          prop: 'subjectName',
          fixed: 'left'
        },
        {
          label: '收费时段',
          width: '120',
          prop: 'chargeRange'
          // fixed: 'left'
        },
        {
          label: '应收单价（元）',
          width: '120',
          prop: 'unitAmount'
          // fixed: 'left'
        },
        {
          label: '实收单价（元）',
          width: '120',
          prop: 'actualUnitAmount'
          // fixed: 'left'
        },
        {
          label: '应收小计（元）',
          width: '120',
          prop: 'totalAmount'
          // fixed: 'left'
        },
        {
          label: '实收小计（元）',
          width: '120',
          prop: 'actualAmount'
          // fixed: 'left'
        },
        // 应收总金额和实收总金额需要自行计算
        {
          label: '应收总金额（元）',
          width: '120',
          prop: 'actualAmount'
          // fixed: 'left'
        },
        {
          label: '实收总金额（元）',
          width: '120',
          prop: 'actualAmount'
          // fixed: 'left'
        },
        {
          label: '收费日期',
          prop: 'paymentDate',
          fixed: 'right'
        }
      ],
      statusEnum: {
        IN: '在园',
        OUT: '退园'
        // PENDING_REVIEW: '待入园',
        // DELETED: '已删除'
      }
    }
  },
  computed: {},
  watch: {},
  created() {
  },
  mounted() {
    this.getClazzList()
    this.init()
  },
  methods: {
    getClazzList() {
      queryClassList().then(res => {
        console.log(res.data, 'data')
        const data = []
        res.data.content.forEach(v => {
          data.push({
            label: v.name,
            value: v.id
          })
        })
        this.classList = data
        this.formData[3].options = this.classList
      })
    },
    init() {
      const result = Object.assign({
        chargeDateStart: '',
        chargeDateEnd: '',
        subjectName: '',
        areaName: '',
        clazzId: '',
        isGlobal: false
      }, this.search)
      queryOrderStatisticsHeadList(result).then(res => {
        // console.log(res, '幼儿收费明细数字化报表')
        const result = []
        res.data.forEach((cur, key) => {
          // result[index].paymentDate = cur.paymentDate && parseTime(cur.paymentDate)
          // result[index].status = this.statusEnum[cur.status]
          const data = cur.data || []
          data.forEach((c, k) => {
            c.childName = cur.childName
            c.status = this.statusEnum[cur.status]
            c.orgName = cur.orgName
            c.clazzName = cur.clazzName
            c.paymentDate = c.paymentDate && parseTime(c.paymentDate, '{y}-{m}-{d}')
            c.chargeRange = c.termId !== null ? c.termName : c.chargeRangeStart && c.chargeRangeEnd && `${parseTime(c.chargeRangeStart, '{y}-{m}')}至${parseTime(c.chargeRangeEnd, '{y}-{m}')}`
            if (res.data.length !== (key + 1)) {
              c.row = k === 0 ? data.length : 0
              c.col = k === 0 ? 1 : 0
            } else {
              c.row = 1
              c.col = 2
            }
            result.push(c)
          })
        })
        if (result.length) {
          result[result.length - 1].childName = '合计'
        }
        // result[result.length - 1].orgName = '合计'
        this.tableData = result
      })
    },
    handleSearch(event) {
      const result = {}
      const date = this.getValueByProp('date', this.formData) || {}
      event.forEach(cur => {
        result[cur.prop] = cur.value
      })
      this.search = result
      this.search.chargeDateStart = date[0]
      this.search.chargeDateEnd = date[1]
      this.init()
    },
    objectSpanMethod({ row, column, rowIndex, columnIndex }) {
      // console.log()
      if (columnIndex === 0 && rowIndex === this.tableData.length - 1) {
        console.log(row, 'row')
        // row.orgName = '合计'
        return {
          rowspan: 1,
          colspan: 5
        }
      } else if ((columnIndex === 1 || columnIndex === 2 || columnIndex === 3 || columnIndex === 4) && rowIndex === this.tableData.length - 1) {
        return {
          rowspan: 0,
          colspan: 0
        }
      } else if (columnIndex === 0 || columnIndex === 1 || columnIndex === 2) {
        return {
          rowspan: row.row,
          colspan: row.col
        }
      } else if (columnIndex === 1 && row.col === 2) {
        return {
          rowspan: 0,
          colspan: 0
        }
      }
    },
    reset() {

    },
    currentChange(pageNum, pageSize) {
      this.pageInfo = {
        pageNum,
        pageSize
      }
      // this.init()
    },
    handleSelectionChange() {},
    exportExcel() {
      const search = {}
      this.formData.forEach(item => {
        search[item.prop] = this.getObjectByProp(item.prop, this.formData).value
      })
      downExcelOrderStatistics(search).then(res => {
        downloadFileForUrl(res)
      })
    }
  }
}
</script>
<style lang="scss" scoped>
    .index-wrap {
      margin-top: 16px;
    }
</style>
