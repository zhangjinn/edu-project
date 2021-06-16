<template>
  <div class="index-wrap">
    <etm-main-body>
      <etm-layout-split>
        <div slot="header">
          <etm-tabs v-model="activeName">
            <el-tab-pane
              label="幼儿退费"
              name="refund"
            >
              <etm-tool-bar
                v-model="searchData"
                @search="handleSearch"
                @reset="reset"
              >
                <el-form-item label="班级:">
                  <etm-clazz-cascader
                    :clear="clear"
                    @change="getClazz"
                  />
                </el-form-item>
              </etm-tool-bar>
            </el-tab-pane>
          </etm-tabs>
        </div>
        <div slot="body">
          <etm-table-page
            v-fixedHead
            :data="tableData"
            :columns="column"
            :stripe="false"
            :span-method="objectSpanMethod"
            :cell-class-name="cellClassNameMethod"
            @currentChange="currentChange"
          >
            <el-table-column
              slot="left"
              fixed="left"
              type="index"
              label="序号"
              width="60"
            >
              <template slot-scope="scoped">
                <span>{{ getRowIndex(scoped.$index) }}</span>
              </template>
            </el-table-column>
            <el-table-column
              slot="left"
              fixed="left"
              label="所属年级"
              width="150"
              prop="gradeName"
            />
            <el-table-column
              slot="left"
              fixed="left"
              label="班级"
              width="150"
              prop="clazzName"
            />
            <el-table-column
              slot="left"
              fixed="left"
              label="幼儿姓名"
              width="120"
              prop="childName"
            />
            <el-table-column
              slot="left"
              fixed="left"
              label="幼儿状态"
              width="120"
              prop="childStatus"
            >
              <template slot-scope="scoped">
                <span>{{ transferChildStatus(scoped.row.childStatus) }}</span>
              </template>
            </el-table-column>
            <el-table-column
              slot="right"
              label="退费项目"
              min-width="150"
              prop="originName"
            />
            <el-table-column
              slot="right"
              label="已收金额（元）"
              min-width="180"
              prop="remainingAmount"
              align="right"
              sortable
              sort-by="remainingAmount"
            >
              <template slot-scope="scoped">
                <span>{{ formatMoney(scoped.row.remainingAmount) }}</span>
              </template>
            </el-table-column>
            <el-table-column
              slot="right"
              label="退费状态"
              width="120"
            >
              <template slot-scope="scoped">
                <etm-status :type="getEtmStatus(scoped.row.status)">
                  <span>{{ transferStatus(scoped.row.status) }}</span>
                </etm-status>
              </template>
            </el-table-column>
            <el-table-column
              slot="right"
              label="收费日期"
              width="150"
              prop="chargeTime"
              sortable
              sort-by="chargeTime"
            >
              <template slot-scope="scoped">
                <span>{{ transferDate(scoped.row.chargeTime) }}</span>
              </template>
            </el-table-column>
            <el-table-column
              slot="right"
              label="退费日期"
              width="150"
              prop="refundTime"
              sortable
              sort-by="refundTime"
            >
              <template slot-scope="scoped">
                <span>{{ transferDate(scoped.row.refundTime) }}</span>
              </template>
            </el-table-column>
            <el-table-column
              slot="right"
              label="审核日期"
              width="150"
              prop="auditTime"
              sortable
              sort-by="auditTime"
            >
              <template slot-scope="scoped">
                <span>{{ transferDate(scoped.row.auditTime) }}</span>
              </template>
            </el-table-column>
            <el-table-column
              slot="right"
              fixed="right"
              label="操作"
              width="120"
            >
              <template slot-scope="scoped">
                <etm-text
                  v-if="scoped.row.status === 'TO_BE_REFUNDED' || scoped.row.status === 'FAILED'"
                  type="primary"
                  @click="refund(scoped.row)"
                >
                  退费
                </etm-text>
                <etm-text
                  v-else-if="scoped.row.status === 'IN_PROGRESS'"
                  type="primary"
                  @click="audit(scoped.row)"
                >
                  审核
                </etm-text>
                <span v-else>--</span>
              </template>
            </el-table-column>
          </etm-table-page>
        </div>
      </etm-layout-split>
    </etm-main-body>
    <etm-drawer
      :visible.sync="showDrawer"
      type="small"
    >
      <etm-layout-split>
        <etm-title
          :title="drawerTitle"
          :show-line="false"
          border
          size="big"
        >
          <template slot="tool">
            <el-button
              v-if="rowData.status === 'IN_PROGRESS'"
              plain
              size="mini"
              @click="submitAudit(false)"
            >
              不通过
            </el-button>
            <el-button
              v-if="rowData.status === 'IN_PROGRESS'"
              type="primary"
              size="mini"
              @click="submitAudit(true)"
            >
              通过
            </el-button>
            <el-button
              v-if="rowData.status === 'TO_BE_REFUNDED' || rowData.status === 'FAILED'"
              plain
              size="mini"
              @click="close"
            >
              取消
            </el-button>
            <el-button
              v-if="rowData.status === 'TO_BE_REFUNDED' || rowData.status === 'FAILED'"
              type="primary"
              size="mini"
              @click="submit"
            >
              提交审核
            </el-button>
          </template>
        </etm-title>
        <div
          v-if="rowData.status === 'FAILED'"
          class="warnText"
        >
          <el-alert
            title="请重新填写退费金额"
            type="warning"
            :closable="false"
          />
        </div>
        <etm-form type="dialog">
          <etm-field-label
            type="left"
            label="幼儿姓名"
          >
            {{ rowData.childName }}
          </etm-field-label>
          <etm-field-label
            type="left"
            label="年级"
          >
            {{ rowData.gradeName }}
          </etm-field-label>
          <etm-field-label
            type="left"
            label="班级"
          >
            {{ rowData.clazzName }}
          </etm-field-label>
          <etm-field-label
            type="left"
            label="退费项目"
          >
            {{ refundData.originName }}
          </etm-field-label>
          <etm-field-label
            type="left"
            label="已收金额（元）"
          >
            {{ formatMoney(refundData.remainingAmount) }}
          </etm-field-label>
          <etm-field-label
            type="left"
            label="结算可退金额（元）"
          >
            {{ formatMoney(refundData.actualSettlementAmount) }}
          </etm-field-label>
          <template v-if="rowData.status === 'IN_PROGRESS'">
            <etm-field-label
              type="left"
              label="退费金额（元）"
            >
              {{ formatMoney(refundData.refundAmount) }}
            </etm-field-label>
            <etm-field-label
              type="left"
              label="支付方式"
            >
              {{ transferType(refundData.paymentType) }}
            </etm-field-label>
          </template>
          <template v-else>
            <etm-field-label
              type="left"
              label="退费金额（元）"
              class="inputLabel"
            >
              <el-input-number
                v-model="refundAmount"
                :min="0"
                placeholder="请输入退费金额"
              />
            </etm-field-label>
            <etm-field-label
              type="left"
              label="支付方式"
              class="inputLabel"
            >
              <el-select v-model="paymentType">
                <el-option
                  v-for="(list, index) in paymentTypeList"
                  :key="index"
                  :value="list.value"
                  :label="list.label"
                />
              </el-select>
            </etm-field-label>
          </template>
        </etm-form>
      </etm-layout-split>
    </etm-drawer>
  </div>
</template>

<script>
import EtmClazzCascader from '@/views/newDaycare/childManageGuard/EtmClazzCascader'
import {
  queryRefundCheck,
  updateRefundAudit,
  updateRefundAuditCreate,
  queryRefundById,
  queryRefundList
} from '@/api/newDaycare/refundManage'
import { parseTime } from '@/utils'

/**
 * index create by Administrator
 * createTime 2020/9/8 17:05
 */
export default {
  name: 'Index',
  components: {
    EtmClazzCascader
  },
  filters: {},
  mixins: [],
  props: {},
  data () {
    return {
      activeName: 'refund',
      clazzValue: [],
      clear: false,
      searchData: [
        {
          label: '幼儿姓名',
          type: 'input',
          prop: 'childName',
          value: '',
          props: {
            placeholder: '请输入幼儿姓名'
          }
        },
        {
          label: '退费状态',
          type: 'select',
          prop: 'status',
          value: '',
          props: {
            placeholder: '请选择'
          },
          options: [
            {
              label: '全部',
              value: ''
            },
            {
              label: '可退费',
              value: 'TO_BE_REFUNDED'
            },
            {
              label: '退费中',
              value: 'IN_PROGRESS'
            },
            {
              label: '已退费',
              value: 'REFUND'
            },
            {
              label: '不通过',
              value: 'FAILED'
            }
          ]
        },
        {
          label: '幼儿状态',
          type: 'select',
          prop: 'childStatus',
          value: '',
          props: {
            placeholder: '请选择'
          },
          options: [
            {
              label: '全部',
              value: ''
            },
            {
              label: '预备生',
              value: 'PREPARATORY_STUDENT'
            },
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
      searchInfo: {},
      rowNum: [],
      refundItemNum: [],
      tableData: {
        content: []
      },
      pageNum: 1,
      pageSize: 10,
      column: [],
      showDrawer: false,
      drawerTitle: '',
      rowData: {},
      refundData: {},
      refundAmount: '',
      paymentType: '',
      paymentTypeList: [ // WECHAT :微信 ALIPAY :支付宝 CASH :现金 ONLINE_BANKING :网银
        {
          label: '微信',
          value: 'WECHAT'
        },
        {
          label: '支付宝',
          value: 'ALIPAY'
        },
        {
          label: '现金',
          value: 'CASH'
        },
        {
          label: '网银',
          value: 'ONLINE_BANKING'
        }
      ]
    }
  },
  computed: {},
  watch: {},
  created () {
  },
  mounted () {
    this.getList()
  },
  methods: {
    cellClassNameMethod ({ row, columnIndex }) {
      if (columnIndex === 7) { // 状态栏
        if (row.status === 'IN_PROGRESS') {
          return 'theme'
        }
        if (row.status === 'REFUND') {
          return 'disabled'
        }
        if (row.status === 'TO_BE_REFUNDED') {
          return 'enabled'
        }
        if (row.status === 'FAILED') {
          return 'danger'
        }
      }
    },
    getClazz (value) {
      this.clazzValue = value
    },
    handleSearch (value) {
      const searchInfo = {}
      value.forEach(item => {
        searchInfo[item.prop] = item.value
      })
      this.pageNum = 1
      this.searchInfo = searchInfo
      this.getList()
    },
    reset () {
      this.clear = !this.clear
      this.pageNum = 1
      this.pageSize = 10
      this.searchInfo = {}
      this.clazzValue = []
      this.getList()
    },
    currentChange (pageNum, pageSize) {
      this.pageNum = pageNum
      this.pageSize = pageSize
      this.getList()
    },
    getList () {
      const param = {
        pageNum: this.pageNum,
        pageSize: this.pageSize
      }
      for (const i in this.searchInfo) {
        param[i] = this.searchInfo[i]
      }
      if (this.clazzValue.length) {
        param.gradeId = this.clazzValue[0]
        param.clazzId = this.clazzValue[1]
      }
      queryRefundList(param).then(res => {
        const tableData = JSON.parse(JSON.stringify(res.data))
        tableData.content = []
        this.rowNum = []
        this.refundItemNum = []
        if (res.data.content) {
          res.data.content.forEach(item => { // 拆分数据
            if (item.originList.length) {
              let num = 0
              item.originList.forEach(origin => {
                if (origin.refundList.length) {
                  this.refundItemNum.push(origin.refundList.length)
                  num += origin.refundList.length
                  origin.refundList.forEach(refund => {
                    const data = JSON.parse(JSON.stringify(item))
                    for (const i in origin) {
                      data[i] = origin[i]
                    }
                    for (const n in refund) {
                      data[n] = refund[n]
                    }
                    tableData.content.push(data)
                  })
                } else {
                  this.refundItemNum.push(1)
                  const data = JSON.parse(JSON.stringify(item))
                  for (const i in origin) {
                    data[i] = origin[i]
                  }
                  data.refundId = null
                  data.originName = null
                  data.refundAmount = null
                  data.status = null
                  data.chargeTime = null
                  data.auditTime = null
                  data.refundTime = null
                  data.paymentType = null
                  data.remainingAmount = null
                  tableData.content.push(data)
                }
              })
              this.rowNum.push(num)
            } else {
              this.rowNum.push(1)
              this.refundItemNum.push(1)
              const data = JSON.parse(JSON.stringify(item))
              data.originId = null
              data.originName = null
              data.refundId = null
              data.refundAmount = null
              data.status = null
              data.chargeTime = null
              data.auditTime = null
              data.refundTime = null
              data.paymentType = null
              data.remainingAmount = null
              tableData.content.push(data)
            }
          })
          this.tableData = tableData
        }
      })
    },
    objectSpanMethod ({ row, column, rowIndex, columnIndex }) { // 表格合并
      if (column.type === 'index' || this.judgeColumnType(column.property)) {
        let num = 0
        let flag = false
        for (let i = 0; i < this.rowNum.length; i++) {
          if (rowIndex === this.addNum((i - 1), this.rowNum)) {
            num = i
            flag = true
          }
        }
        if (flag) {
          return {
            rowspan: this.rowNum[num],
            colspan: 1
          }
        } else {
          return {
            rowspan: 0,
            colspan: 0
          }
        }
      } else if (column.property === 'originName') {
        let num = 0
        let flag = false
        for (let i = 0; i < this.refundItemNum.length; i++) {
          if (rowIndex === this.addNum((i - 1), this.refundItemNum)) {
            num = i
            flag = true
          }
        }
        if (flag) {
          return {
            rowspan: this.refundItemNum[num],
            colspan: 1
          }
        } else {
          return {
            rowspan: 0,
            colspan: 0
          }
        }
      }
    },
    judgeColumnType (type) { // 判断行是否合并
      if (type === 'gradeName' || type === 'clazzName' || type === 'childName' || type === 'childStatus') {
        return true
      } else {
        return false
      }
    },
    addNum (index, data) { // 数组前index+1项之和
      if (index < 0) return 0
      let num = 0
      data.forEach((item, ind) => {
        if (ind <= index) {
          num += item
        }
      })
      return num
    },
    getRowIndex (index) {
      for (let i = 0; i < this.rowNum.length; i++) {
        if (index < this.addNum(i, this.rowNum)) {
          return (i + 1)
        }
      }
    },
    transferChildStatus (childStatus) { // PENDING_REVIEW :待入园 IN :在园 OUT :离园 DELETED :已删除 PREPARATORY_STUDENT :预备生
      switch (childStatus) {
        case 'PENDING_REVIEW':
          return '待入园'
        case 'IN':
          return '在园'
        case 'OUT':
          return '退园'
        case 'DELETED':
          return '已删除'
        case 'PREPARATORY_STUDENT':
          return '预备生'
        default:
          return childStatus
      }
    },
    formatMoney (money) {
      if (!isNaN(money)) {
        return money.toFixed(2)
      } else {
        return money
      }
    },
    getEtmStatus (status) {
      switch (status) {
        case 'TO_BE_REFUNDED':
          return 'primary'
        case 'IN_PROGRESS':
          return 'active'
        case 'REFUND':
          return 'inactive'
        case 'FAILED':
          return 'danger'
        default:
          return status
      }
    },
    transferStatus (status) { // 状态-- TO_BE_REFUNDED :待退费 IN_PROGRESS :退费中 REFUND :已退费 FAILED :不通过
      switch (status) {
        case 'TO_BE_REFUNDED':
          return '可退费'
        case 'IN_PROGRESS':
          return '退费中'
        case 'REFUND':
          return '已退费'
        case 'FAILED':
          return '不通过'
        default:
          return status
      }
    },
    transferDate (date) { // 日期转换
      if (isNaN(date)) {
        return date
      } else {
        return parseTime(date, '{y}-{m}-{d}')
      }
    },
    refund (row) {
      const param = {
        refundId: row.refundId
      }
      queryRefundCheck(param).then(res => {
        if (res.data.canRefund) {
          this.drawerTitle = '退费'
          this.rowData = row
          this.getDetail()
        } else {
          this.showTips(row.childName, res.data.month)
        }
      })
    },
    showTips (name, date) {
      this.$etmTip.init({
        type: 'warn',
        title: '提示',
        content: `${name}${date}月份的数据未结算，请先结算再操作退费！`,
        confirmBtn: '知道了',
        confirm: () => {
          this.$etmTip.close()
        }
      })
      this.$etmTip.open()
    },
    audit (row) {
      this.drawerTitle = '退费审核'
      this.rowData = row
      this.getDetail()
    },
    getDetail () {
      queryRefundById({ refundId: this.rowData.refundId }).then(res => {
        this.refundData = res.data
        this.refundAmount = res.data.refundAmount
        this.showDrawer = true
      })
    },
    transferType (type) {
      switch (type) { // WECHAT :微信 ALIPAY :支付宝 CASH :现金 ONLINE_BANKING :网银
        case 'WECHAT':
          return '微信'
        case 'ALIPAY':
          return '支付宝'
        case 'CASH':
          return '现金'
        case 'ONLINE_BANKING':
          return '网银'
        default:
          return type
      }
    },
    close () {
      this.showDrawer = false
    },
    submit () {
      if (!this.refundAmount) {
        this.$message.warning('退费金额不能为空')
      } else if (!this.paymentType) {
        this.$message.warning('支付方式不能为空')
      } else {
        const param = {
          refundId: this.refundData.refundId,
          refundAmount: this.refundAmount,
          paymentType: this.paymentType
        }
        updateRefundAuditCreate(param).then(() => {
          this.$message.success('提交成功')
          this.showDrawer = false
          this.getList()
        })
      }
    },
    submitAudit (value) {
      const param = {
        refundId: this.refundData.refundId,
        isPass: value,
        refundAmount: this.refundData.refundAmount,
        paymentType: this.refundData.paymentType
      }
      updateRefundAudit(param).then(() => {
        this.$message.success('审核成功')
        this.showDrawer = false
        this.getList()
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.index-wrap {
  .el-alert {
    padding: 0 16px;
  }

  ::v-deep .el-table {
    .enabled {
      color: #67c23a;
    }

    .theme {
      @include etm-color();
    }

    .danger {
      color: #f5222d;
    }

    .disabled {
      color: #999;
    }
  }

  .warnText {
    padding-bottom: 16px;

    .el-alert {
      padding: 8px 16px;
    }
  }

  .inputLabel {
    align-items: center;
  }

  .el-input-number {
    width: 200px;

    ::v-deep input {
      padding: 0 10px;
      text-align: left;
    }

    ::v-deep .el-input-number__increase {
      display: none;
    }

    ::v-deep .el-input-number__decrease {
      display: none;
    }
  }

  .el-select {
    width: 200px;
  }
}
</style>
