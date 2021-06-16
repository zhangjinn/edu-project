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
            name="refundSummary"
            label="园所退费汇总"
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
                @click="exportExcel"
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
import { queryRefundSummaryHead, downRefundSummaryExcel } from '@/api/newDaycare/orderSummaryHead'
import { downloadFileForUrl } from '@/utils/file'
import baseMixin from '@/layout/mixin/baseMixin'
import EtmAreaGardenCascader from '@/views/newDaycare/statisticsHead/component/EtmAreaGardenCascader'
export default {
  name: 'Index',
  components: { EtmAreaGardenCascader },
  filters: {},
  mixins: [baseMixin],
  props: {},
  data () {
    return {
      activeName: 'refundSummary',
      search: {
        chargeDateStart: '',
        chargeDateEnd: '',
        areaName: '',
        organizationId: ''
      },
      clear: false,
      organizaitonId: undefined,
      tableData: [],
      columns: [
        {
          label: '园所名称',
          prop: 'organizationName'
        }, {
          label: '退费科目',
          prop: 'subjectName'
        }, {
          label: '退费人数',
          prop: 'refundCount',
          width: '300',
          sortable: true,
          sortBy: 'refundCount'
        },
        {
          label: '实退总金额（元）',
          width: '300',
          prop: 'refundAmount',
          sortable: true,
          sortBy: 'refundAmount'
        }
      ],
      formData: [
        {
          label: '退费日期',
          type: 'date',
          value: '',
          prop: 'date',
          props: {
            type: 'daterange',
            startPlaceholder: '年/月',
            endPlaceholder: '年/月'
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
        startDate: '',
        endDate: '',
        areaName: '',
        organizationId: this.organizationId
      }, this.search)
      queryRefundSummaryHead(result).then(res => {
        // console.log(res, 'res')
        this.tableData = res.data
        this.organizaitonId = undefined
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
    currentChange () {

    },
    handleSelectionChange () {

    },
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
        downRefundSummaryExcel(search).then(res => {
          downloadFileForUrl(res)
        })
      })
    },
    handleSearch () {
      const date = this.getValueByProp('date', this.formData) || {}
      console.log(date, 'date')
      this.search.startDate = date[0]
      this.search.endDate = date[1]
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
