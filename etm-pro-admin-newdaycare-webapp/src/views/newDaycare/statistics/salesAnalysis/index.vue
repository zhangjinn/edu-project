<template>
  <div class="index-wrap">
    <etm-main-body>
      <etm-layout-split>
        <div slot="header">
          <etm-tabs>
            <el-tab-pane :label="tabPlanLabel">
              <etm-tool-bar
                v-show="true"
                v-model="formData"
                @search="handleSearch"
              />
            </el-tab-pane>
          </etm-tabs>
        </div>
        <div slot="body">
          <etm-table
            id="xlsxTable"
            :columns="colOption"
            :data="tableData"
            :row-class-name="rowClassNameMethod"
          >
            <etm-table-tool-bar slot="tool">
              <div slot="right">
                <el-button
                  plain
                  @click="exportTableToExcel({id: 'xlsxTable', name:tabPlanLabel})"
                >
                  导出Excel
                </el-button>
              </div>
            </etm-table-tool-bar>
          </etm-table>
        </div>
      </etm-layout-split>
    </etm-main-body>
  </div>
</template>

<script>
/**
 * index create by Administrator
 * createTime 2020/09/28 15:56
 */
import baseMixin from '@/layout/mixin/baseMixin'
import { querySales, querySource } from '@/api/newDaycare/statistics'
import { parseTime } from '@/utils'

export default {
  name: 'Index',
  components: {},
  filters: {},
  mixins: [baseMixin],
  props: {},
  data () {
    return {
      tabPlanLabel: '销售效率评估',
      searchForm: {
        name: '',
        startTime: '',
        endTime: ''
      },
      formData: [{
        label: '录入日期',
        type: 'date',
        value: '',
        prop: 'inTime',
        default: [parseTime((new Date()).setDate(1), '{y}-{m}-{d}'), parseTime(new Date(), '{y}-{m}-{d}')],
        props: {
          type: 'daterange',
          startPlaceholder: '年/月',
          endPlaceholder: '年/月'
        }
      },
      {
        label: '统计日期',
        type: 'date',
        value: '',
        prop: 'allTime',
        props: {
          type: 'daterange',
          startPlaceholder: '年/月',
          endPlaceholder: '年/月'
        }
      }, {
        label: '学员来源',
        type: 'select',
        prop: 'status',
        value: '',
        default: '',
        options: [
        ],
        props: {
          placeholder: '请选择学员来源'
        }
      }],
      tableData: [
      ],
      colOption: [
        {
          label: '跟进人员', prop: 'employeeName'
        }, {
          label: '名单总数', prop: 'totalNumberOfLists', sortable: true, sortBy: 'totalNumberOfLists'
        }, {
          label: '跟进学员人数', prop: 'numberOfFollowStudents', sortable: true, sortBy: 'numberOfFollowStudents'
        }, {
          label: '跟进率', prop: 'followRate', sortable: true, sortBy: 'followRate'
        }, {
          label: '诺到访人数', prop: 'noOfVisitors', sortable: true, sortBy: 'noOfVisitors'
        }, {
          label: '到访人数', prop: 'numberOfVisitors', sortable: true, sortBy: 'numberOfVisitors'
        }, {
          label: '到访率', prop: 'visitRate', sortable: true, sortBy: 'visitRate'
        }, {
          label: '诺试听人数', prop: 'noOfAuditions', sortable: true, sortBy: 'noOfAuditions'
        }, {
          label: '试听人数', prop: 'auditionNumber', sortable: true, sortBy: 'auditionNumber'
        },
        {
          label: '试听率', prop: 'auditionRate', sortable: true, sortBy: 'auditionRate'
        },
        {
          label: '签约人数', prop: 'numberOfSignatories', sortable: true, sortBy: 'numberOfSignatories'
        }, {
          label: '签约率', prop: 'signingRate', sortable: true, sortBy: 'signingRate'
        }
      ]
    }
  },
  computed: {},
  watch: {},
  created () {
    this.comeForm()
  },
  mounted () {
    this.init()
  },
  methods: {
    init () {
      const status = this.getValueByProp('status', this.formData)
      const inTime = this.getValueByProp('inTime', this.formData)
      const allTime = this.getValueByProp('allTime', this.formData)
      querySales({
        entryStartDate: (inTime[0]) || null,
        entryEndDate: (inTime[1]) || null,
        statisticsStartDate: (allTime[0]) || null,
        statisticsEndDate: (allTime[1]) || null,
        sourceId: (status) || null
      }).then(res => {
        // console.log(res)
        this.tableData = res.data
        this.tableData.forEach(item => {
          item.followRate += '%'
          item.visitRate += '%'
          item.auditionRate += '%'
          item.signingRate += '%'
        })
        this.tableData[this.tableData.length - 1].followRate = null
      })
    },
    rowClassNameMethod ({ rowIndex }) {
      if (rowIndex === this.tableData.length - 1) {
        return 'row-color'
      }
    },
    handleSearch () {
      this.init()
    },
    comeForm () {
      querySource().then(res => {
        // console.log(res)
        const options = []
        res.data.forEach(item => {
          options.push({
            label: item.childSourceName,
            value: item.childSourceId
          })
        })
        this.formData[2].options = options
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.index-wrap {
  ::v-deep .row-color {
    @include etm-color;
  }
}
</style>
