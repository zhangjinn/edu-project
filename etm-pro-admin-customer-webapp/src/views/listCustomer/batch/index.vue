<template>
  <div class="my-customer-wrap">
    <!--    <etm-main-body>-->
    <etm-layout-split>
      <div slot="header">
        <etm-tabs
          ref="tabs"
          v-model="currentTab"
          setting
          @setting="setting"
        >
          <el-tab-pane
            label="分配批次"
            name="distribution"
          >
            <etm-tool-bar
              v-model="toolBar"
              @search="handleSearch"
              @reset="reset"
            />
          </el-tab-pane>
          <el-tab-pane
            label="导入批次"
            name="import"
          >
            <etm-tool-bar
              v-model="toolBar"
              @search="handleSearch"
              @reset="reset"
            />
          </el-tab-pane>
        </etm-tabs>
      </div>

      <div slot="body">
        <etm-table-page
          :columns="columns"
          :data="tableData"
          @currentChange="currentChange"
        >
          <el-table-column
            slot="right"
            width="180"
            label="操作"
          >
            <template v-slot="{row}">
              <etm-text @click="detail(row)">
                详情
              </etm-text>
              <etm-text
                type="danger"
                @click="revoke(row)"
              >
                撤销
              </etm-text>
            </template>
          </el-table-column>
        </etm-table-page>
      </div>
    </etm-layout-split>
    <!--    </etm-main-body>-->

    <etm-pop
      :title="`${api[currentTab].title}详情`"
      :visible="batchPop"
      cancel-btn="取消"
      pop="complex"
      @cancel="batchPop = false"
      @close="batchPop = false"
      @confirm="batchPop = false"
    >
      <div style="min-height: 224px;">
        <etm-table
          v-if="currentTab === 'distribution'"
          :columns="popColumns"
          :data="popData"
        />
        <div v-else>
          <el-tabs v-model="activeName">
            <el-tab-pane
              label="成功记录"
              name="success"
            >
              <etm-table
                :columns="popColumns2.success"
                :data="popData.importSuccessList"
              />
            </el-tab-pane>
            <el-tab-pane
              label="失败记录"
              name="fail"
            >
              <etm-table
                :columns="popColumns2.fail"
                :data="popData.importFailList"
              />
            </el-tab-pane>
          </el-tabs>
        </div>
      </div>
    </etm-pop>
  </div>
</template>

<script>
import {
  queryImportBatchList,
  queryAssignBatchList,
  queryAssignDetail,
  queryImportDetail,
  createImportRevoke,
  createAssignRevoke
} from '@/api/customer'
import { parseTime } from '@/utils'
export default {
  name: 'MyCustomer',
  components: {
  },
  data () {
    return {
      batchPop: false,
      batchCurrentId: 0,
      popData: [],
      activeName: 'success',
      popColumns2: {
        success: [
          {
            label: '批次号',
            prop: 'batchCode'
          }, {
            label: '学员姓名',
            prop: 'assignEmployee'
          }, {
            label: '联系电话',
            prop: 'assignType'
          }, {
            label: '操作人',
            prop: 'customerName'
          }, {
            label: '导入时间',
            prop: 'currentAssignEmployee'
          }
        ],
        fail: [
          {
            label: '批次号',
            prop: 'batchCode'
          }, {
            label: '学员姓名',
            prop: 'assignEmployee'
          }, {
            label: '联系电话',
            prop: 'assignType'
          }, {
            label: '失败原因',
            prop: 'reason'
          }, {
            label: '操作人',
            prop: 'customerName'
          }, {
            label: '导入时间',
            prop: 'currentAssignEmployee'
          }
        ]
      },
      popColumns: [
        {
          label: '批次号',
          prop: 'batchCode'
        }, {
          label: '分配人',
          prop: 'assignEmployee'
        }, {
          label: '分配方式',
          prop: 'assignType'
        }, {
          label: '客户姓名',
          prop: 'customerName'
        }, {
          label: '分配前顾问',
          prop: 'currentAssignEmployee'
        }, {
          label: '操作时间',
          prop: 'createTime'
        }
      ],
      api: {
        // 分配
        distribution: {
          title: '分配批次',
          list: queryAssignBatchList,
          detail: queryAssignDetail,
          revoke: createAssignRevoke
        },
        // 导入
        import: {
          title: '导入批次',
          list: queryImportBatchList,
          detail: queryImportDetail,
          revoke: createImportRevoke
        }
      },
      tableParams: {
        batchCode: null,
        cancel: null,
        startTime: null,
        endTime: null,
        pageNum: 1,
        pageSize: 10
      },
      currentTab: 'distribution',
      tableData: {
        content: []
      },
      toolBar: [
        {
          label: '批次号',
          prop: 'batchCode',
          type: 'input',
          value: '',
          props: {
            placeholder: '请输入批次号'
          }
        },
        {
          label: '批次状态',
          value: '',
          prop: 'cancel',
          type: 'select',
          options: [
            {
              label: '正常',
              value: false
            }, {
              label: '已撤销',
              value: true
            }
          ],
          props: {
            placeholder: '请选择批次状态'
          }
        }, {
          type: 'date',
          label: '操作时间',
          value: [],
          prop: 'date',
          props: {
            type: 'daterange',
            // 'range-separator': '至',
            'value-format': 'yyyy-MM-dd',
            startPlaceholder: '开始日期',
            endPlaceholder: '结束日期'
          }
        }
      ],
      columns: [
        {
          label: '批次号',
          prop: 'batchCode'
        }, {
          label: '批次状态',
          width: '180',
          prop: 'status'
        }, {
          label: '批次数据(条)',
          width: '180',
          prop: 'amount'
        }, {
          label: '操作时间',
          width: '180',
          prop: 'createTime'
        }
      ]
    }
  },
  watch: {
    batchPop: {
      handler (n) {
        if (n) {
          this.api[this.currentTab].detail(this.batchCurrentId).then(res => {
            if (this.currentTab === 'distribution') {
              this.popData = res.data.map(cur => {
                cur.createTime = parseTime(cur.createTime, '{y}-{m}-{d}')
                return cur
              })
            } else {
              const result = {
                importSuccessList: [],
                importFailList: []
              }

              result.importSuccessList = res.data.importSuccessList.map(cur => {
                cur.createTime = parseTime(cur.createTime, '{y}-{m}-{d}')
                return cur
              })

              result.importFailList = res.data.importFailList.map(cur => {
                cur.createTime = parseTime(cur.createTime, '{y}-{m}-{d}')
                return cur
              })

              this.popData = result
            }
          })
        }
      }
    },
    currentTab: {
      handler (n) {
        this.toolBar.forEach(cur => {
          cur.value = ''
        })
        this.tableParams.pageNum = 1
        this.$nextTick(() => {
          this.init()
        })
      }
    }
  },
  created () {
    this.init()
  },
  methods: {
    currentChange (pageNum, pageSize) {
      this.tableParams.pageNum = pageNum
      this.tableParams.pageSize = pageSize
      this.init()
    },
    detail (row) {
      this.batchCurrentId = row.batchId
      this.batchPop = true
    },
    revoke (row) {
      this.$etmTip.init({
        type: 'warn',
        title: '确定撤销该批次？',
        content: '',
        confirmBtn: '删除',
        cancelBtn: '取消',
        cancel: () => {
          this.$etmTip.close()
        },
        confirm: () => {
          this.api[this.currentTab].revoke(row.batchId).then(res => {
            this.$message.success('撤销成功')
          })
          this.$etmTip.close()
        }
      })

      this.$etmTip.open()
    },
    init () {
      this.api[this.currentTab].list(this.tableParams).then(res => {
        const result = res.data

        result.conent = res.data.content.map(c => {
          c.createTime = parseTime(c.createTime, '{y}-{m}-{d}')
          c.status = c.cancel ? '已撤销' : '正常'
          return c
        })
        this.tableData = result
      })
    },
    setting () {
      this.$router.push({ path: '/customer_settings' })
    },
    reset () {
      this.tableParams = {
        batchCode: null,
        cancel: null,
        startTime: null,
        endTime: null,
        pageNum: 1,
        pageSize: 10
      }

      this.init()
    },
    handleSearch (e) {
      this.tableParams.pageNum = 1
      e.forEach(cur => {
        if (cur.prop === 'date') {
          this.tableParams.startTime = cur.value[0]
          this.tableParams.endTime = cur.value[1]
        } else {
          this.tableParams[cur.prop] = cur.value
        }
      })

      this.init()
    }

  }
}
</script>

<style scoped lang="scss">
.my-customer-wrap{

}
</style>
