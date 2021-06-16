<template>
  <div class="index-wrap">
    <!--幼儿账单统计 总部-->
    <etm-layout-split>
      <div slot="header">
        <etm-tabs
          v-model="activeName"
          :setting="false"
          :show-toggle="false"
        >
          <el-tab-pane
            name="accountStatistics"
            label="幼儿账单统计"
          >
            <etm-tool-bar
              v-model="formData"
              @search="handleSearch"
              @reset="reset"
              @change="change"
            />
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
          :cell-class-name="cellClassNameMethod"
          :span-method="objectSpanMethod"
        >
          <etm-table-tool-bar slot="tool">
            <div slot="right">
              <el-button
                plain
                @click="exportTableToExcel({ref:$refs.xlsxTable.$el,name:tabPlanLabel})"
              >
                导出Excel
              </el-button>
            </div>
          </etm-table-tool-bar>

          <el-table-column
            slot="left"
            prop="childName"
            label="幼儿姓名"
          >
            <template slot-scope="scope">
              {{ scope.row.childName }}
            </template>
          </el-table-column>

          <el-table-column
            slot="left"
            prop="clazzName"
            label="班级"
          >
            <template slot-scope="scope">
              {{ scope.row.clazzName }}
            </template>
          </el-table-column>

          <el-table-column
            slot="left"
            prop="statusText"
            label="状态"
            width="120px"
          >
            <template slot-scope="scope">
              <etm-status :type="scope.row.statusText==='在园' ? 'active' : 'inactive'">
                {{ scope.row.statusText }}
              </etm-status>
            </template>
          </el-table-column>
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
// import EtmAreaGardenCascader from '@/views/newDaycare/statisticsHead/component/EtmAreaGardenCascader'
import { queryAccountStatisticsHead, downExcelAccountStatistics, queryClassList, queryTermList } from '@/api/newDaycare/statisticsHead'
import { downloadFileForUrl } from '@/utils/file'

import baseMixin from '@/layout/mixin/baseMixin'
export default {
  name: 'Index',
  components: {},
  filters: {},
  mixins: [baseMixin],
  props: {},
  data () {
    return {
      tabPlanLabel: '幼儿账单统计',
      activeName: 'accountStatistics',
      tableData: [],
      search: {},
      formData: [
        {
          label: '学期',
          type: 'select',
          value: '',
          prop: 'termId',
          options: []
          // props: {
          //   type: 'daterange',
          //   startPlaceholder: '年/月',
          //   endPlaceholder: '年/月'
          // }
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
        // {
        //   label: '幼儿姓名',
        //   prop: 'childName',
        //   fixed: 'left'
        // }, {
        //   label: '班级',
        //   prop: 'clazzName',
        //   fixed: 'left'
        // }, {
        //   label: '状态',
        //   prop: 'statusText',
        //   fixed: 'left'
        // },
        {
          label: '收费科目',
          prop: 'subjectName'
        }, {
          label: '收费标准（元）',
          prop: 'unitAmount'
          // sortable: true,
          // sortBy: 'unitAmount'
        },
        {
          label: '余额（元）',
          width: '120',
          prop: 'balance'
          // sortable: true,
          // sortBy: 'balance'
        },
        {
          label: '实收总金额（元）',
          width: '160',
          prop: 'actualAmount'
          // sortable: true,
          // sortBy: 'actualAmount'
        },
        {
          label: '实消总金额（元）',
          width: '160',
          prop: 'usedAmount'
          // sortable: true,
          // sortBy: 'usedAmount'
        },
        {
          label: '待收费账单金额（元）',
          width: '200',
          prop: 'unPayAmount'
          // sortable: true,
          // sortBy: 'unPayAmount'
        },
        {
          label: '待退费账单金额（元）',
          width: '200',
          prop: 'canRefundAmount',
          fixed: 'right'
          // sortable: true,
          // sortBy: 'canRefundAmount'
        }
      ],
      statusEnum: {
        IN: '在园',
        OUT: '退园'
      },
      termList: [],
      currentTerm: null
    }
  },
  computed: {},
  watch: {},
  created () {
  },
  mounted () {
    this.init()
    this.getClazzList()
    this.getTermList()
  },
  methods: {
    cellClassNameMethod ({ row, columnIndex }) {
      if (columnIndex === 2) { // 状态栏
        if (row.statusText === '在园') {
          return 'enabled'
        }
        if (row.statusText === '退园') {
          return 'disabled'
        }
      }
    },
    change (e) {
      // console.log(e, '是')
    },
    getTermList () {
      queryTermList().then(res => {
        const data = []
        res.data.forEach(v => {
          data.push({
            label: v.name,
            value: v.id
          })
          if (v.currentTerm) {
            this.currentTerm = {
              label: v.name,
              value: v.id
            }
            this.formData[0].value = this.currentTerm.value
          }
        })
        this.termList = data
        this.formData[0].options = this.termList
      })
    },
    getClazzList () {
      queryClassList().then(res => {
        // console.log(res.data, 'data')
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
    init () {
      const result = Object.assign({
        name: '',
        areaName: '',
        termId: '',
        clazzId: '',
        childStatus: '',
        isGlobal: false
      }, this.search)
      queryAccountStatisticsHead(result).then(res => {
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
    objectSpanMethod ({ row, column, rowIndex, columnIndex }) {
      if (columnIndex === 0 && rowIndex === this.tableData.length - 1) {
        return {
          rowspan: 1,
          colspan: 4
        }
      } else if ((columnIndex === 1 || columnIndex === 2 || columnIndex === 3) && rowIndex === this.tableData.length - 1) {
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
    handleSearch (event) {
      // console.log(event, 'event')
      // const date = this.getValueByProp('date', this.formData) || {}
      const result = {}

      event.forEach(cur => {
        result[cur.prop] = cur.value
      })
      this.search = result
      console.log(this.search)
      // if (date) {
      //   this.search.chargeDateStart = date[0]
      //   this.search.chargeDateEnd = date[1]
      // }
      // console.log(this.search, 'serach')
      this.init()
    },
    rowClassNameMethod ({ row, rowIndex }) {
      if (rowIndex === this.tableData.length - 1) {
        return 'row-color'
      }
    },
    exportExcel () {
      const search = {}
      this.formData.forEach(item => {
        search[item.prop] = this.getObjectByProp(item.prop, this.formData).value
      })
      downExcelAccountStatistics(search).then(res => {
        downloadFileForUrl(res)
      })
    },
    reset () {}
  }
}
</script>
<style lang="scss" scoped>
  .index-wrap {
    margin-top: 16px;

    ::v-deep .el-table {
      .enabled {
        @include etm-color();
      }

      .disabled {
        color: #999;
      }
    }
  }
</style>
