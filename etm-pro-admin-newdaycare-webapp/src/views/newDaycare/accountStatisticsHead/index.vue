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
            name="accountStatisticsHead"
            label="幼儿账单统计"
          >
            <etm-tool-bar
              v-model="formData"
              @search="handleSearch"
              @reset="reset"
            >
              <el-form-item label="园所:">
                <etm-area-garden-cascader
                  :clear="clear"
                  :has-default="true"
                  @change="changeArea"
                />
              </el-form-item>
              <el-form-item
                label="学期"
                prop="date"
              >
                <el-select
                  v-model="currentSemester"
                  style="width: 100%;"
                  @change="changeSemeter"
                >
                  <el-option
                    v-for="(item, index) in semesterList"
                    :key="index"
                    :label="item.name"
                    :value="item.id"
                  />
                </el-select>
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
          :cell-class-name="cellClassNameMethod"
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
            prop="orgName"
            label="所在园所"
          >
            <template slot-scope="scope">
              {{ scope.row.orgName }}
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
            prop="status"
            label="状态"
            width="120px"
          >
            <template slot-scope="scope">
              <etm-status :type="getEtmStatus(scope.row.statusText)">
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
import EtmAreaGardenCascader from '@/views/newDaycare/statisticsHead/component/EtmAreaGardenCascader'
import { queryAccountStatisticsHead, downExcelAccountStatistics, querySemesterList } from '@/api/newDaycare/statisticsHead'
import { downloadFileForUrl } from '@/utils/file'
import baseMixin from '@/layout/mixin/baseMixin'
import { parseTime } from '@/utils'

export default {
  name: 'Index',
  components: { EtmAreaGardenCascader },
  filters: {},
  mixins: [baseMixin],
  props: {},
  data () {
    return {
      tabPlanLabel: '幼儿账单统计',
      clear: false,
      activeName: 'accountStatisticsHead',
      organizationId: undefined,
      tableData: [],
      search: {
        // chargeDateStart: '',
        // chargeDateEnd: ''
      },
      semesterList: [], // 学期列表
      currentSemester: '', // 当前学期
      columns: [
        {
          label: '收费科目',
          prop: 'subjectName'
        }, {
          label: '收费标准（元）',
          prop: 'unitAmount',
          // sortable: true,
          // sortBy: 'unitAmount',
          align: 'right',
          width: '200'
        },
        {
          label: '余额（元）',
          width: '200',
          prop: 'balance',
          // sortable: true,
          // sortBy: 'balance',
          align: 'right'
        },
        {
          label: '实收总金额（元）',
          width: '200',
          prop: 'actualAmount',
          // sortable: true,
          // sortBy: 'actualAmount',
          align: 'right'
        },
        {
          label: '实消总金额（元）',
          width: '200',
          prop: 'usedAmount',
          // sortable: true,
          // sortBy: 'usedAmount',
          align: 'right'
        },
        {
          label: '待收费账单金额（元）',
          width: '200',
          prop: 'unPayAmount',
          // sortable: true,
          // sortBy: 'unPayAmount',
          align: 'right'
        },
        {
          label: '待退费账单金额（元）',
          width: '200',
          prop: 'canRefundAmount',
          fixed: 'right',
          // sortable: true,
          // sortBy: 'canRefundAmount',
          align: 'right'
        }
      ],
      formData: [
        // {
        //   label: '学期',
        //   type: 'date',
        //   value: '',
        //   prop: 'date',
        //   props: {
        //     type: 'daterange',
        //     startPlaceholder: '年/月',
        //     endPlaceholder: '年/月'
        //   }
        // },
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
      chargeDateStart: undefined,
      chargeDateEnd: undefined
    }
  },
  computed: {},
  watch: {},
  created () {
  },
  mounted () {
    // this.init()
  },
  methods: {
    // 获取学期列表
    async getSemesterList () {
      await querySemesterList({ organizationId: this.organizationId }).then(res => {
        this.semesterList = res.data
        // console.log(this.semesterList, '我是获取的学期列表')
        // chargeDateEnd: 2021-03-03
        for (const semester of this.semesterList) {
          if (semester.currentTerm) {
            this.currentSemester = semester.id
            this.chargeDateStart = parseTime(semester.startDate, '{y}-{m}-{d}')
            this.chargeDateEnd = parseTime(semester.endDate, '{y}-{m}-{d}')
          }
        }
      })
    },
    async init () {
      console.log(this.chargeDateStart, this.chargeDateEnd, 'end')
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
      console.log(result, 'search')
      await queryAccountStatisticsHead(result).then(res => {
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
    async changeArea (e) {
      // 清除学期筛选数据
      this.currentSemester = undefined
      this.search.chargeDateStart = ''
      this.search.chargeDateEnd = ''
      // 更改园区id
      this.organizationId = e.value[1]
      this.clear = false
      await this.getSemesterList()
      this.init()
    },
    cellClassNameMethod ({ row, columnIndex }) {
      if (columnIndex === 3) { // 状态栏
        if (row.statusText === '在园') {
          return 'enabled'
        }
        if (row.statusText === '退园') {
          return 'disabled'
        }
      }
    },
    objectSpanMethod ({ row, column, rowIndex, columnIndex }) {
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
    handleSearch (event) {
      const result = {}
      event.forEach(cur => {
        result[cur.prop] = cur.value
      })
      this.search = result
      this.search.organizationId = this.organizationId
      this.search.chargeDateStart = this.chargeDateStart
      this.search.chargeDateEnd = this.chargeDateEnd
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
    reset () {},
    getEtmStatus (statusText) {
      const map = new Map()
      const defaultType = 'primary'
      map.set('在园', 'primary')
      map.set('退园', 'inactive')
      map.set('待入园', 'inactive')
      map.set('已删除', 'inactive')
      const res = map.get(statusText)
      if (res) {
        return res
      } else {
        return defaultType
      }
    },
    // 学期改变方法
    changeSemeter (e) {
      for (const semester of this.semesterList) {
        if (semester.id === e) {
          this.chargeDateStart = parseTime(semester.startDate, '{y}-{m}-{d}')
          this.chargeDateEnd = parseTime(semester.endDate, '{y}-{m}-{d}')
        }
      }
      console.log(this.chargeDateStart, this.chargeDateEnd)
    }
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
