<template>
  <div class="index-wrap">
    <!--幼儿退费明细-->
    <etm-layout-split>
      <div slot="header">
        <etm-tabs v-model="activeName" :setting="false" :show-toggle="false">
          <el-tab-pane name="refundStatisticsHead" label="幼儿退费明细">
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
// import { queryOrderSummaryHeadList } from '@/api/newDaycare/orderSummaryHead'
import { queryRefundStatisticsHeadList, downExcelRefundStatistics } from '@/api/newDaycare/statisticsHead'
import { downloadFileForUrl } from '@/utils/file'
import baseMixin from '@/layout/mixin/baseMixin'
import { parseTime } from '@/utils'
import EtmAreaGardenCascader from '@/views/newDaycare/statisticsHead/component/EtmAreaGardenCascader'
export default {
  name: 'Index',
  components: { EtmAreaGardenCascader },
  filters: {},
  mixins: [baseMixin],
  props: {},
  data() {
    return {
      tabPlanLabel: '幼儿退费明细',
      activeName: 'refundStatisticsHead',
      clear: false,
      organizationId: undefined,
      search: {},
      tableData: [],
      columns: [
        {
          label: '幼儿姓名',
          prop: 'childName'
        }, {
          label: '所在园所',
          prop: 'orgName'
        }, {
          label: '状态',
          prop: 'statusText'
        }, {
          label: '班级',
          prop: 'clazzName'
        }, {
          label: '退费科目',
          prop: 'subjectName'
        },
        {
          label: '实退金额（元）',
          width: '120',
          prop: 'refundAmount'
        },
        {
          label: '退费日期',
          width: '120',
          prop: 'refundTime'
        }
      ],
      formData: [
        {
          label: '收费日期',
          type: 'date',
          value: '',
          prop: 'date',
          props: {
            type: 'daterange',
            startPlaceholder: '年/月',
            endPlaceholder: '年/月'
          }
        },
        {
          label: '退费科目',
          type: 'input',
          value: '',
          prop: 'subjectName',
          props: {
            placeholder: '请输入收费科目'
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
              label: '离园',
              value: 'OUT'
            },
            {
              label: '待入园',
              value: 'PENDING_REVIEW'
            },
            {
              label: '已删除',
              value: 'DELETED'
            }
          ]
        }
      ],
      statusEnum: {
        IN: '在园',
        OUT: '离园',
        PENDING_REVIEW: '待入园',
        DELETED: '已删除'
      }
    }
  },
  computed: {},
  watch: {},
  created() {
  },
  mounted() {
    this.init()
  },
  methods: {
    init() {
      const result = Object.assign({
        chargeDateStart: '',
        chargeDateEnd: '',
        childName: '',
        areaName: '',
        childStatus: '',
        organizationId: this.organizationId
      }, this.search)
      queryRefundStatisticsHeadList(result).then(res => {
        // const result = res.data
        // result.forEach((cur, index) => {
        //   result[index].statusText = this.statusEnum[cur.status]
        //   result[index].refundTime = cur.refundTime && parseTime(cur.refundTime)
        // })
        // this.tableData = result
        const result = []
        res.data.forEach((cur, key) => {
          // result[index].paymentDate = cur.paymentDate && parseTime(cur.paymentDate)
          // result[index].status = this.statusEnum[cur.status]
          const data = cur.data || []
          data.forEach((c, k) => {
            c.childName = cur.childName
            c.statusText = this.statusEnum[cur.status]
            c.orgName = cur.orgName
            c.clazzName = cur.clazzName
            c.paymentDate = c.paymentDate && parseTime(c.paymentDate, '{y}-{m}-{d}')
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
        this.tableData = result
      })
    },
    reset() {

    },
    currentChange() {

    },
    changeArea(e) {
      this.organizationId = e.value[1]
      this.clear = false
      // if (e.type === 'load') {
      this.init()
    },
    handleSelectionChange() {

    },
    objectSpanMethod({ row, column, rowIndex, columnIndex }) {
      if (columnIndex === 0 || columnIndex === 1 || columnIndex === 2 || columnIndex === 3) {
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
        downExcelRefundStatistics(search).then(res => {
          downloadFileForUrl(res)
        })
      })
    },
    handleSearch(event) {
      const date = this.getValueByProp('date', this.formData) || {}
      const result = {}
      event.forEach(cur => {
        result[cur.prop] = cur.value
      })
      this.search = result
      this.search.organizationId = this.organizationId
      if (date) {
        this.search.chargeDateStart = date[0]
        this.search.chargeDateEnd = date[1]
      }
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
