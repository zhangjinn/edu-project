<template>
  <div class="index-wrap">
    <!--园所收费汇总-->
    <etm-layout-split>
      <div slot="header">
        <etm-tabs
          v-model="activeName"
          :setting="false"
          :show-toggle="false"
        >
          <el-tab-pane
            name="orderSummary"
            label="园所收费汇总"
          >
            <etm-tool-bar
              v-model="formData"
              @search="handleSearch"
              @reset="reset"
            >
              <el-form-item label="园所：">
                <etm-area-garden-cascader
                  :clear="clear"
                  @change="changeArea"
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
          :row-class-name="rowClassNameMethod"
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
import { queryOrderSummaryHeadList } from '@/api/newDaycare/orderSummaryHead'
import baseMixin from '@/layout/mixin/baseMixin'
import EtmAreaGardenCascader from '@/views/newDaycare/statisticsHead/component/EtmAreaGardenCascader'
import { downExcelOrderSummaryHead } from '@/api/newDaycare/statisticsHead'
import { downloadFileForUrl } from '@/utils/file'
export default {
  name: 'Index',
  components: { EtmAreaGardenCascader },
  filters: {},
  mixins: [baseMixin],
  props: {},
  data () {
    return {
      tabPlanLabel: '园所收费汇总',
      activeName: 'orderSummary',
      search: {
        chargeDateStart: '',
        chargeDateEnd: '',
        childName: '',
        areaName: '',
        organizationId: ''
      },
      clear: false,
      organizaitonId: undefined,
      tableData: [],
      columns: [
        {
          label: '园所名称',
          prop: 'orgName'
        }, {
          label: '收费科目',
          prop: 'childName'
        }, {
          label: '已收费人数',
          prop: 'childCount',
          sortable: true,
          sortBy: 'childCount',
          width: '240'
        }, {
          label: '应收单价（元）',
          prop: 'unitAmount',
          sortable: true,
          sortBy: 'unitAmount',
          width: '240',
          align: 'right'
        }, {
          label: '实收单价（元）',
          prop: 'actualUnitAmount',
          sortable: true,
          sortBy: 'actualUnitAmount',
          width: '240',
          align: 'right'
        },
        {
          label: '应收总金额（元）',
          prop: 'totalAmount',
          sortable: true,
          sortBy: 'totalAmount',
          width: '240',
          align: 'right'
        },
        {
          label: '实收总金额（元）',
          prop: 'actualAmount',
          sortable: true,
          sortBy: 'actualAmount',
          width: '240',
          align: 'right'
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
          label: '收费科目',
          type: 'input',
          value: '',
          prop: 'subjectName',
          props: {
            placeholder: '请输入收费科目'
          }
        }
      ]
    }
  },
  computed: {},
  watch: {},
  created () {
  },
  mounted () {
    this.init()
  },
  methods: {
    init () {
      const result = Object.assign({
        chargeDateStart: '',
        chargeDateEnd: '',
        subjectName: '',
        areaName: '',
        organizationId: ''
      }, this.search)
      queryOrderSummaryHeadList(result).then(res => {
        console.log(res, 'res')

        const result = res.data
        this.organizaitonId = undefined
        result.forEach((cur, index) => {
          result[result.length - 1].orgName = '汇总'
        })
        this.tableData = result
      })
    },
    changeArea (e) {
      this.organizaitonId = e.value[1]
      this.clear = false
      if (e.type === 'load') {
        this.init()
      }
    },
    reset () {
      this.clear = true
    },
    currentChange (pageNum, pageSize) {
      this.pageInfo = {
        pageNum,
        pageSize
      }
      this.init()
    },
    // handleSelectionChange() {
    //
    // },
    objectSpanMethod ({ row, column, rowIndex, columnIndex }) {
      if (columnIndex === 0) {
        // console.log(this.tableData.length)
        if (rowIndex === this.tableData.length - 1) {
          return {
            rowspan: 1,
            colspan: 2
          }
        }
      } else if ((columnIndex === 1) && rowIndex === this.tableData.length - 1) {
        return {
          rowspan: 0,
          colspan: 0
        }
      }
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
      downExcelOrderSummaryHead(search).then(res => {
        downloadFileForUrl(res)
      })
    },
    handleSearch () {
      const date = this.getValueByProp('date', this.formData) || {}
      this.search.chargeDateStart = date[0]
      this.search.chargeDateEnd = date[1]
      this.search.organizationId = this.organizaitonId
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
