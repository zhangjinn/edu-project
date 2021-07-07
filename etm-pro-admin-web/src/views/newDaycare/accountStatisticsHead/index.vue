<template>
  <div class="index-wrap">
    <!--幼儿账单统计 总部-->
    <etm-layout-split>
      <div slot="header">
        <etm-tabs v-model="activeName" :setting="false" :show-toggle="false">
          <el-tab-pane name="accountStatisticsHead" label="幼儿账单统计">
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
 * createTime 2021/2/1 16:29
 */
import EtmAreaGardenCascader from '@/views/newDaycare/statisticsHead/component/EtmAreaGardenCascader'
import { queryAccountStatisticsHead, downExcelAccountStatistics } from '@/api/newDaycare/statisticsHead'
import { downloadFileForUrl } from '@/utils/file'

import baseMixin from '@/layout/mixin/baseMixin'

export default {
  name: 'Index',
  components: { EtmAreaGardenCascader },
  filters: {},
  mixins: [baseMixin],
  props: {},
  data() {
    return {
      tabPlanLabel: '幼儿账单统计',
      clear: false,
      activeName: 'accountStatisticsHead',
      organizationId: undefined,
      tableData: [],
      search: {},
      columns: [
        {
          label: '幼儿姓名',
          prop: 'childName',
          fixed: 'left'
        },
        {
          label: '所在园所',
          prop: 'orgName',
          fixed: 'left'
        },
        {
          label: '班级',
          prop: 'clazzName',
          fixed: 'left'
        }, {
          label: '状态',
          prop: 'statusText',
          fixed: 'left'
        }, {
          label: '收费科目',
          prop: 'subjectName',
          fixed: 'left'
        }, {
          label: '收费标准（元）',
          prop: 'unitAmount'
        },
        {
          label: '余额（元）',
          width: '120',
          prop: 'balance'
        },
        {
          label: '实收总金额（元）',
          width: '120',
          prop: 'actualAmount'
        },
        {
          label: '实消总金额（元）',
          width: '120',
          prop: 'usedAmount'
        },
        {
          label: '待收费账单金额（元）',
          width: '120',
          prop: 'unPayAmount'
        },
        {
          label: '待退费账单金额（元）',
          width: '120',
          prop: 'canRefundAmount',
          fixed: 'right'
        }
      ],
      formData: [
        {
          label: '学期',
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
        }
      ],
      statusEnum: {
        IN: '在园',
        OUT: '退园'
      },
      array: []
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
    async init() {
      const result = Object.assign({
        chargeDateStart: '',
        chargeDateEnd: '',
        name: '',
        areaName: '',
        clazzId: '',
        organizationId: this.organizationId,
        childStatus: '',
        isGlobal: true
      }, this.search)
      await queryAccountStatisticsHead(result).then(res => {
        // this.reduceData(res.data)
        // const result = res.data
        // result.forEach((cur, index) => {
        //   result[index].statusText = this.statusEnum[cur.status]
        // })
        // this.tableData = result
        const result = []
        res.data.forEach((cur, key) => {
          const data = cur.data || []
          data.forEach((c, k) => {
            c.childName = cur.childName
            c.clazzName = cur.clazzName
            c.orgName = cur.orgName
            c.statusText = this.statusEnum[cur.status]
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
    changeArea(e) {
      this.organizationId = e.value[1]
      this.clear = false
      this.init()
    },
    objectSpanMethod({ row, column, rowIndex, columnIndex }) {
      if (columnIndex === 0 && rowIndex === this.tableData.length - 1) {
        return {
          rowspan: 1,
          colspan: 5
        }
      } else if ((columnIndex === 1 || columnIndex === 2 || columnIndex === 3 || columnIndex === 4) && rowIndex === this.tableData.length - 1) {
        return {
          rowspan: 0,
          colspan: 0
        }
      } else if ((columnIndex === 0 || columnIndex === 1 || columnIndex === 2 || columnIndex === 3)) {
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
      downExcelAccountStatistics(search).then(res => {
        downloadFileForUrl(res)
      })
    },
    reset() {}
  }
}
</script>
<style lang="scss" scoped>
    .index-wrap {
      margin-top: 16px;
    }
</style>
