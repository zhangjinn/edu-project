<template>
  <div class="index-wrap">
    <!--幼儿收费明细-->
    <etm-layout-split>
      <div slot="header">
        <etm-tabs v-model="activeName" :setting="false" :show-toggle="false">
          <el-tab-pane name="orderStatisticsHead" label="幼儿收费明细">
            <etm-tool-bar v-model="formData" @search="handleSearch" @reset="reset">
              <el-form-item label="园所:">
                <etm-area-garden-cascader :clear="clear" :has-default="true" @change="changeArea" />
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
          :row-class-name="rowClassNameMethod"
          :span-method="objectSpanMethod"
        >
          <etm-table-tool-bar slot="tool">
            <div slot="right">
              <el-button plain @click="exportTableToExcel({ref:$refs.xlsxTable.$el,name:tabPlanLabel})">导出Excel</el-button>
            </div>
          </etm-table-tool-bar>
        </etm-table>
      </div>
    </etm-layout-split>
  </div>

</template>

<script>
/**
 * index create by Administrator
 * createTime 2021/1/28 18:35
 */
import { downExcelOrderStatistics, queryOrderStatisticsHeadList } from '@/api/newDaycare/statisticsHead'
import baseMixin from '@/layout/mixin/baseMixin'
import EtmAreaGardenCascader from '@/views/newDaycare/statisticsHead/component/EtmAreaGardenCascader'
import { parseTime } from '@/utils'
import { downloadFileForUrl } from '@/utils/file'

export default {
  name: 'Index',
  components: { EtmAreaGardenCascader },
  filters: {},
  mixins: [baseMixin],
  props: {},
  data() {
    return {
      tabPlanLabel: '幼儿收费明细',
      activeName: 'orderStatisticsHead',
      search: {
        // chargeDateStart: '',
        // chargeDateEnd: '',
        // subjectName: '',
        // areaName: '',
        // organizationId: this.organizationId
      },
      clear: false,
      organizationId: undefined,
      tableData: [],
      columns: [
        {
          label: '幼儿姓名',
          prop: 'childName',
          width: '100',
          fixed: 'left',
          formatter: (row, column, val) => {
            if (!val) {
              return '空'
            } else {
              return val
            }
          }
        }, {
          label: '所在园所',
          prop: 'orgName',
          width: '100',
          fixed: 'left'
        }, {
          label: '班级',
          prop: 'clazzName',
          fixed: 'left'
        }, {
          label: '状态',
          prop: 'status',
          fixed: 'left'
        }, {
          label: '收费科目',
          prop: 'subjectName',
          fixed: 'left'
        },
        {
          label: '收费时段',
          width: '120',
          prop: 'chargeRange'
        },
        {
          label: '应收单价（元）',
          width: '120',
          prop: 'unitAmount'
        },
        {
          label: '实收单价（元）',
          width: '120',
          prop: 'actualUnitAmount'
        },
        {
          label: '应收小计（元）',
          width: '120',
          prop: 'totalAmount'
        },
        {
          label: '实收小计（元）',
          width: '120',
          prop: 'actualAmount'
        },
        {
          label: '应收总金额（元）',
          width: '120',
          prop: 'actualAmount'
        },
        {
          label: '实收总金额（元）',
          width: '100',
          prop: 'actualAmount'
        },
        {
          label: '收费日期',
          width: '100',
          prop: 'paymentDate',
          fixed: 'right'
        }
      ],
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
            // {
            //   label: '待入园',
            //   value: 'PENDING_REVIEW'
            // },
            // {
            //   label: '已删除',
            //   value: 'DELETED'
            // }
          ]
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
    // this.init()
  },
  methods: {
    init() {
      const result = Object.assign({
        chargeDateStart: '',
        chargeDateEnd: '',
        name: '',
        organizationId: this.organizationId,
        isGlobal: true
      }, this.search)
      console.log(result, 'result')
      queryOrderStatisticsHeadList(result).then(res => {
        // console.log(res, 'res')
        const result = []
        res.data.forEach((cur, key) => {
          // res.data[key].paymentDate = cur.paymentDate && parseTime(cur.paymentDate)
          // console.log(res.data)
          const data = cur.data || []
          data.forEach((c, k) => {
            c.childName = cur.childName
            c.status = this.statusEnum[cur.status]
            c.orgName = cur.orgName
            c.clazzName = cur.clazzName
            c.paymentDate = c.paymentDate && parseTime(c.paymentDate, '{y}-{m}-{d}')
            c.chargeRange = c.termId !== null ? c.termName : c.chargeRangeStart && c.chargeRangeEnd && `${parseTime(c.chargeRangeStart, '{y}-{m}')}~${parseTime(c.chargeRangeEnd, '{y}-{m}')}`
            // console.log(c.paymentDate, 'data')
            if (res.data.length !== (key + 1)) {
              c.row = k === 0 ? data.length : 0
              c.col = k === 0 ? 1 : 0
            } else {
              c.row = 1
              c.col = 2
            }
            result.push(c)
            // console.log(result, 'result')
          })
        })
        if (result.length) {
          result[result.length - 1].childName = '合计'
        }
        this.tableData = result
      })
    },
    changeArea(e) {
      this.organizationId = e.value[1]
      this.clear = false
      console.log('change')
      // if (e.type === 'load') {
      this.init()
      // }
    },
    reset() {
      // this.clear = true
    },
    currentChange() {

    },
    handleSelectionChange() {

    },
    objectSpanMethod({ row, column, rowIndex, columnIndex }) {
      if (columnIndex === 0 && rowIndex === this.tableData.length - 1) {
        // console.log(row, 'row')
        // row.orgName = '合计'
        return {
          rowspan: 1,
          colspan: 6
        }
      } else if ((columnIndex === 1 || columnIndex === 2 || columnIndex === 3 || columnIndex === 4 || columnIndex === 5) && rowIndex === this.tableData.length - 1) {
        return {
          rowspan: 0,
          colspan: 0
        }
      } else if (columnIndex === 0 || columnIndex === 1 || columnIndex === 2 || columnIndex === 3) {
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
    rowClassNameMethod({ row, rowIndex }) {
      if (rowIndex === this.tableData.length - 1) {
        return 'row-color'
      }
    },
    exportExcel() {
      const search = {}
      this.formData.forEach(item => {
        search[item.prop] = this.getObjectByProp(item.prop, this.formData).value
      })
      downExcelOrderStatistics(search).then(res => {
        downloadFileForUrl(res)
      })
    },
    handleSearch(event) {
      const result = {}
      const date = this.getValueByProp('date', this.formData) || {}
      // const name = this.getValueByProp('name', this.formData) || ''
      console.log(date, 'date')
      event.forEach(cur => {
        result[cur.prop] = cur.value
      })
      console.log(result, 'result')
      this.search = result
      this.search.chargeDateStart = date[0]
      this.search.chargeDateEnd = date[1]
      this.search.organizationId = this.organizationId
      this.init()
    }
  }
}
</script>
<style lang="scss" scoped>
  .index-wrap {
      margin-top: 16px;
  }
</style>
