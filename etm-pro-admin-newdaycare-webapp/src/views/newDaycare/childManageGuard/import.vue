<template>
  <div class="import-wrap">
    <etm-main-body>
      <etm-layout-split>
        <div slot="header">
          <div>
            <etm-tabs v-model="activeName">
              <el-tab-pane
                label="导入批次管理"
                name="batch"
              >
                <etm-tool-bar
                  v-model="formData"
                  @search="handleSearch"
                  @reset="reset"
                />
              </el-tab-pane>
            </etm-tabs>
          </div>
        </div>
        <div slot="body">
          <etm-table-page
            :data="tableData"
            :columns="column"
            index
            @currentChange="currentChange"
          >
            <el-table-column
              slot="left"
              label="批次号"
              width="200"
            >
              <template slot-scope="scoped">
                <a @click="showDetail(scoped.row)">{{ scoped.row.batchNumber }}</a>
              </template>
            </el-table-column>
            <el-table-column
              slot="left"
              label="批次状态"
              width="120"
            >
              <template slot-scope="scoped">
                <span>{{ scoped.row.status === 'NORMAL' ? '正常' : '已撤销' }}</span>
              </template>
            </el-table-column>
            <el-table-column
              slot="right"
              label="导入时间"
              width="180"
            >
              <template slot-scope="scoped">
                <span>{{ transferDate(scoped.row.createTime) }}</span>
              </template>
            </el-table-column>
            <el-table-column
              slot="right"
              label="操作"
              width="120"
            >
              <template slot-scope="scoped">
                <etm-text
                  v-if="scoped.row.status === 'NORMAL'"
                  type="danger"
                  @click="revoke(scoped.row)"
                >
                  撤销
                </etm-text>
              </template>
            </el-table-column>
          </etm-table-page>
        </div>
      </etm-layout-split>
    </etm-main-body>
    <etm-drawer
      :visible.sync="showDrawer"
      type="big"
    >
      <detail :batch-id="batchId" />
    </etm-drawer>
  </div>
</template>

<script>
/**
 * import create by Administrator
 * createTime 2021/1/15 10:51
 */
import { queryImportBatchList, updateChildImportRevoke } from '@/api/newDaycare/childManageGuard'
import { parseTime } from '@/utils'
import Detail from './component/importDetail'
export default {
  name: 'Import',
  components: {
    Detail
  },
  filters: {},
  mixins: [],
  props: {},
  data () {
    return {
      activeName: 'batch',
      formData: [
        {
          label: '批次号',
          type: 'input',
          prop: 'batchNumber',
          value: '',
          props: {
            placeholder: '请输入批次号'
          }
        },
        {
          label: '批次状态',
          type: 'select',
          prop: 'status',
          value: '',
          props: {
            placeholder: '请选择批次状态'
          },
          options: [
            {
              label: '正常',
              value: 'NORMAL'
            },
            {
              label: '已撤销',
              value: 'RESCINDED'
            }
          ]
        },
        {
          label: '导入时间',
          type: 'date',
          prop: 'date',
          value: '',
          props: {
            type: 'daterange',
            startPlaceholder: '开始日期',
            endPlaceholder: '结束日期'
          }
        }
      ],
      searchInfo: {},
      tableData: {
        content: []
      },
      pageNum: 1,
      pageSize: 10,
      column: [
        {
          label: '导入成功数据（条）',
          prop: 'successCount'
        },
        {
          label: '导入失败数据（条）',
          prop: 'failedCount'
        },
        {
          label: '操作人',
          prop: 'operatorName'
        }
      ],
      batchId: '',
      showDrawer: false
    }
  },
  computed: {},
  watch: {},
  created () {
  },
  activated () {
    if (sessionStorage.getItem('checkBatch')) {
      this.getList()
      this.batchId = JSON.parse(sessionStorage.getItem('checkBatch'))
      sessionStorage.removeItem('checkBatch')
      this.showDrawer = true
    }
  },
  mounted () {
    this.getList()
  },
  methods: {
    getList () {
      const param = {}
      param.pageNum = this.pageNum
      param.pageSize = this.pageSize
      for (const i in this.searchInfo) {
        param[i] = this.searchInfo[i]
      }
      queryImportBatchList(param).then(res => {
        this.tableData = res.data
      })
    },
    currentChange (pageNum, pageSize) {
      this.pageNum = pageNum
      this.pageSize = pageSize
      this.getList()
    },
    handleSearch (value) {
      const searchInfo = {}
      value.forEach(item => {
        if (item.prop === 'date') {
          searchInfo.startTime = item.value[0]
          searchInfo.endTime = item.value[1]
        } else {
          searchInfo[item.prop] = item.value
        }
      })
      this.pageNum = 1
      this.searchInfo = searchInfo
      this.getList()
    },
    reset () {
      this.pageNum = 1
      this.pageSize = 10
      this.searchInfo = {}
      this.getList()
    },
    transferDate (date) {
      if (isNaN(date)) {
        return date
      } else {
        return parseTime(date, '{y}-{m}-{d} {h}:{i}:{s}')
      }
    },
    showDetail (row) {
      this.batchId = row.batchId
      this.showDrawer = true
    },
    revoke (row) {
      this.$etmTip.init({
        type: 'error',
        title: '确认撤销该导入批次？',
        content: '撤销后该批次导入的数据将被删除，是否继续操作？',
        confirmBtn: '撤销',
        cancelBtn: '取消',
        cancel: () => {
          this.$etmTip.close()
        },
        confirm: () => {
          const param = {
            batchId: row.batchId
          }
          updateChildImportRevoke(param).then(() => {
            this.$message.success('撤销成功')
            this.$etmTip.close()
            this.getList()
          })
        }
      })
      this.$etmTip.open()
    }
  }
}
</script>
<style lang="scss" scoped>
</style>
