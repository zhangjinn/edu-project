<template>
  <div class="index-wrap">
    <etm-main-body>
      <etm-layout-split>
        <div slot="header">
          <etm-tabs v-model="activeName" :setting="hasAuthOfBool('guardcare.incomeFlow.setting')" @setting="setting">
            <el-tab-pane label="收入流水" name="income">
              <etm-tool-bar v-model="searchForm" @search="handleSearch" @reset="reset" />
            </el-tab-pane>
          </etm-tabs>
        </div>
        <div slot="body">
          <etm-table-page
            :data="tableData"
            :columns="column"
            index
            @currentChange="currentChange"
          >
            <etm-table-tool-bar slot="tool">
              <div slot="right">
                <el-button v-has="{authId: 'guardcare.incomeFlow.create'}" type="primary" @click="add">记一笔
                </el-button>
                <el-button v-has="{authId: 'guardcare.incomeFlow.excelExport'}" plain @click="exportExcel">
                  导出Excel
                </el-button>
              </div>
            </etm-table-tool-bar>
            <el-table-column slot="left" fixed="left" label="收入类型" width="120">
              <template slot-scope="scoped">
                <span>{{ transferType(scoped.row.type) }}</span>
              </template>
            </el-table-column>
            <el-table-column slot="left" fixed="left" label="收入项目" width="150">
              <template slot-scope="scoped">
                <span>{{ scoped.row.incomeStatementName }}</span>
              </template>
            </el-table-column>
            <el-table-column slot="left" label="对账状态" width="120">
              <template slot-scope="scoped">
                <span>{{ scoped.row.status === 'UN_CONFIRM' ? '未对账' : '已对账' }}</span>
              </template>
            </el-table-column>
            <el-table-column slot="left" label="收入金额" width="120" align="right">
              <template slot-scope="scoped">
                <span>{{ scoped.row.amount }}</span>
              </template>
            </el-table-column>
            <el-table-column slot="left" label="关联单号" width="180">
              <template slot-scope="scoped">
                <span v-if="scoped.row.type === 'CUSTOM'">{{ scoped.row.bindOrderCode }}</span>
                <a v-else @click="showOrder(scoped.row)">{{ scoped.row.bindOrderCode }}</a>
              </template>
            </el-table-column>
            <el-table-column slot="left" label="支付方式" width="90">
              <template slot-scope="scoped">
                <span>{{ transferPayment(scoped.row.paymentType) }}</span>
              </template>
            </el-table-column>
            <el-table-column slot="left" label="到账日期" width="180">
              <template slot-scope="scoped">
                <span>{{ transferDate(scoped.row.incomeTime) }}</span>
              </template>
            </el-table-column>
            <el-table-column slot="left" label="经办人" width="90">
              <template slot-scope="scoped">
                <span>{{ scoped.row.manageBy }}</span>
              </template>
            </el-table-column>
            <el-table-column slot="left" label="经办时间" width="180">
              <template slot-scope="scoped">
                <span>{{ transferDate(scoped.row.manageTime, 'time') }}</span>
              </template>
            </el-table-column>
            <el-table-column slot="left" label="对账人员" width="90">
              <template slot-scope="scoped">
                <span>{{ scoped.row.confirmBy }}</span>
              </template>
            </el-table-column>
            <el-table-column slot="left" label="对账时间" width="180">
              <template slot-scope="scoped">
                <span>{{ transferDate(scoped.row.confirmTime, 'time') }}</span>
              </template>
            </el-table-column>
            <el-table-column slot="right" fixed="right" label="操作" width="180">
              <template slot-scope="scoped">
                <etm-text
                  v-if="scoped.row.status === 'UN_CONFIRM'"
                  v-has="{authId: 'guardcare.incomeFlow.confirm'}"
                  type="primary"
                  @click="confirm(scoped.row)"
                >对账
                </etm-text>
                <etm-text
                  v-if="scoped.row.status === 'UN_CONFIRM' && scoped.row.type === 'CUSTOM'"
                  v-has="{authId: 'guardcare.incomeFlow.update'}"
                  type="primary"
                  @click="edit(scoped.row)"
                >编辑
                </etm-text>
                <etm-text
                  v-if="scoped.row.status === 'CONFIRMED'"
                  v-has="{authId: 'guardcare.incomeFlow.rescind'}"
                  type="primary"
                  @click="revert(scoped.row)"
                >撤销对账
                </etm-text>
                <etm-text
                  v-if="scoped.row.status === 'UN_CONFIRM' && scoped.row.type === 'CUSTOM'"
                  v-has="{authId: 'guardcare.incomeFlow.remove'}"
                  type="danger"
                  @click="remove(scoped.row)"
                >删除
                </etm-text>
              </template>
            </el-table-column>
          </etm-table-page>
        </div>
      </etm-layout-split>
    </etm-main-body>
    <etm-pop
      v-if="showPop"
      :visible="showPop"
      pop="complex"
      title="记一笔"
      confirm-btn="确定"
      cancel-btn="取消"
      @close="popCloseAdd"
      @cancel="popCloseAdd"
      @confirm="popConfirmAdd"
    >
      <form-item ref="popForm" :form-data="formData" />
    </etm-pop>
    <etm-drawer
      :visible.sync="showDrawer"
      :type="drawerType"
    >
      <etm-layout-split>
        <div v-if="drawerContent === 'income'">
          <etm-title title="编辑收入" :show-line="false" border size="big">
            <template slot="tool">
              <el-button plain size="mini" @click="closeDrawer">取消</el-button>
              <el-button type="primary" size="mini" @click="confirmDrawer">保存</el-button>
            </template>
          </etm-title>
          <form-item ref="drawerForm" :form-data="formData" />
        </div>
        <order-drawer v-else-if="drawerContent === 'order'" :order-data="orderData" />
        <deposit-drawer v-else-if="drawerContent === 'deposit'" :deposit-data="depositData" />
        <video-drawer v-else-if="drawerContent === 'video'" :video-data="videoData" />
      </etm-layout-split>
    </etm-drawer>
  </div>

</template>

<script>
/**
 * index create by Administrator
 * createTime 2020/9/8 13:49
 */
import formItem from '@/views/guardcare/financeManage/incomeFlow/component/formItem'
import orderDrawer from '@/views/guardcare/financeManage/incomeFlow/component/orderDrawer'
import depositDrawer from '@/views/guardcare/financeManage/incomeFlow/component/depositDrawer'
import videoDrawer from '@/views/guardcare/financeManage/incomeFlow/component/videoDrawer'
import {
  addIncome,
  confirmIncome,
  deleteIncome,
  exportIncomeExcel,
  getDepositByCode, getDeviceOrderByCode,
  getIncome,
  getIncomeList,
  getOrderByCode,
  renewIncome,
  revokeIncome
} from '@/api/guardcare/financeManage/incomeFlow'
import { parseTime } from '@/utils'
import { downloadFileForUrl } from '@/utils/file'
import baseMixin from '@/layout/mixin/baseMixin'

export default {
  name: 'Index',
  components: {
    formItem,
    orderDrawer,
    depositDrawer,
    videoDrawer
  },
  filters: {},
  mixins: [baseMixin],
  props: {},
  data() {
    return {
      activeName: 'income',
      searchForm: [
        {
          label: '收入类型',
          type: 'select',
          prop: 'type',
          value: '',
          props: {
            placeholder: '请选择收入类型'
          },
          options: [
            {
              label: '全部',
              value: ''
            },
            {
              label: '系统生成',
              value: 'SYSTEM'
            },
            {
              label: '云视频',
              value: 'CLOUD_VIDEO'
            },
            {
              label: '记一笔',
              value: 'CUSTOM'
            }
          ]
        },
        {
          label: '收入项目',
          type: 'input',
          prop: 'name',
          value: '',
          props: {
            placeholder: '请输入收入项目'
          }
        },
        {
          label: '到账日期',
          type: 'date',
          prop: 'incomeDate',
          value: '',
          props: {
            type: 'daterange',
            startPlaceholder: '开始日期',
            endPlaceholder: '结束日期'
          }
        },
        {
          label: '对账状态',
          type: 'select',
          prop: 'status',
          value: '',
          props: {
            placeholder: '请选择对账状态'
          },
          options: [
            {
              label: '全部',
              value: ''
            },
            {
              label: '未对账',
              value: 'UN_CONFIRM'
            },
            {
              label: '已对账',
              value: 'CONFIRMED'
            }
          ]
        },
        {
          label: '经办人',
          type: 'input',
          prop: 'manageBy',
          value: '',
          props: {
            placeholder: '请输入经办人'
          }
        },
        {
          label: '经办时间',
          type: 'date',
          prop: 'manageTime',
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
          label: '备注',
          prop: 'mark',
          minWidth: 180
        }
      ],
      showPop: false,
      formData: {},
      showDrawer: false,
      statementData: {},
      drawerType: 'small',
      drawerContent: '',
      orderData: {},
      depositData: {},
      videoData: {}
    }
  },
  computed: {},
  watch: {},
  created() {
  },
  mounted() {
    this.getList()
  },
  methods: {
    handleSearch(value) { // 搜索
      const searchInfo = {}
      value.forEach(item => {
        if (item.prop === 'incomeDate') {
          searchInfo.incomeDateStart = item.value[0]
          searchInfo.incomeDateEnd = item.value[1]
        } else if (item.prop === 'manageTime') {
          searchInfo.manageTimeStart = item.value[0]
          searchInfo.manageTimeEnd = item.value[1]
        } else {
          searchInfo[item.prop] = item.value
        }
      })
      this.pageNum = 1
      this.searchInfo = searchInfo
      this.getList()
    },
    reset() { // 重置
      this.pageNum = 1
      this.pageSize = 10
      this.searchInfo = {}
      this.getList()
    },
    currentChange(pageNum, pageSize) {
      this.pageNum = pageNum
      this.pageSize = pageSize
      this.getList()
    },
    getList() {
      const param = {
        pageNum: this.pageNum,
        pageSize: this.pageSize
      }
      for (const i in this.searchInfo) {
        param[i] = this.searchInfo[i]
      }
      getIncomeList(param).then(res => {
        this.tableData = res.data
      })
    },
    transferType(type) { // 支付方式
      switch (type) {
        case 'SYSTEM':
          return '系统生成'
        case 'CUSTOM':
          return '记一笔'
        case 'CLOUD_VIDEO':
          return '云视频'
        default:
          return type
      }
    },
    transferPayment(type) { // 支付方式
      // WECHAT :微信 ALIPAY :支付宝 CASH :现金 ONLINE_BANKING :网银
      switch (type) {
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
    transferDate(date, type) {
      if (isNaN(date)) {
        return date
      } else if (type === 'time') {
        return parseTime(date, '{y}-{m}-{d} {h}:{i}:{s}')
      } else {
        return parseTime(date, '{y}-{m}-{d}')
      }
    },
    setting() { // 应用设置
      this.$router.push({
        path: '/guardcareSettings/guardcare_incomeCostFlowSetting'
      })
    },
    add() {
      this.formData = {}
      this.showPop = true
    },
    popCloseAdd() {
      this.showPop = false
    },
    popConfirmAdd() {
      this.$refs.popForm.$children[0].$children[0].validate(valid => {
        if (valid) {
          this.formData.incomeTime = parseTime(this.formData.incomeTime, '{y}-{m}-{d} {h}:{i}:{s}')
          addIncome(this.formData).then(() => {
            this.$message.success('收入新增成功')
            this.showPop = false
            this.getList()
          })
        }
      })
    },
    confirm(row) {
      const html = `收入金额<span class="urgePayTip">${row.amount}</span>`
      this.$etmTip.init({
        type: 'warn',
        title: `确认对账`,
        html,
        confirmBtn: '确定',
        cancelBtn: '取消',
        confirm: () => {
          const param = {
            statementId: row.incomeStatementId
          }
          confirmIncome(param).then(() => {
            this.$message.success('收入对账成功')
            this.$etmTip.close()
            this.getList()
          })
        },
        cancel: () => {
          this.$etmTip.close()
        }
      })
      this.$etmTip.open()
    },
    showOrder(row) {
      if (row.sourceType === 'ORDER') {
        this.drawerType = 'big'
        this.drawerContent = 'order'
        getOrderByCode(row.bindOrderCode).then(res => {
          this.orderData = res.data
          this.showDrawer = true
        })
      } else if (row.sourceType === 'DEPOSIT') {
        this.drawerType = 'small'
        this.drawerContent = 'deposit'
        getDepositByCode(row.bindOrderCode).then(res => {
          this.depositData = res.data
          this.showDrawer = true
        })
      } else if (row.type === 'CLOUD_VIDEO') {
        this.drawerType = 'small'
        this.drawerContent = 'video'
        getDeviceOrderByCode(row.bindOrderCode).then(res => {
          this.videoData = res.data
          this.showDrawer = true
        })
      }
    },
    edit(row) {
      this.statementData = row
      this.getDetail()
    },
    getDetail() {
      getIncome(this.statementData.incomeStatementId).then(res => {
        const data = res.data
        this.formData = {
          incomeStatementName: data.incomeStatementName,
          amount: data.amount,
          paymentType: data.paymentType,
          incomeTime: data.incomeTime,
          mark: data.mark
        }
        this.drawerType = 'small'
        this.drawerContent = 'income'
        this.showDrawer = true
      })
    },
    closeDrawer() {
      this.showDrawer = false
    },
    confirmDrawer() {
      this.$refs.drawerForm.$children[0].$children[0].validate(valid => {
        if (valid) {
          this.formData.incomeTime = parseTime(this.formData.incomeTime, '{y}-{m}-{d} {h}:{i}:{s}')
          renewIncome(this.statementData.incomeStatementId, this.formData).then(() => {
            this.$message.success('收入修改成功')
            this.showDrawer = false
            this.getList()
          })
        }
      })
    },
    revert(row) {
      const html = `收入金额<span class="urgePayTip">${row.amount}</span>`
      this.$etmTip.init({
        type: 'warn',
        title: `确认撤销对账？`,
        html,
        confirmBtn: '确定',
        cancelBtn: '取消',
        confirm: () => {
          const param = {
            statementId: row.incomeStatementId
          }
          revokeIncome(param).then(() => {
            this.$message.success('撤销对账成功')
            this.$etmTip.close()
            this.getList()
          })
        },
        cancel: () => {
          this.$etmTip.close()
        }
      })
      this.$etmTip.open()
    },
    remove(row) {
      this.$etmTip.init({
        type: 'error',
        title: `确认删除？`,
        content: '删除后将无法撤销，是否继续操作？',
        confirmBtn: '确定',
        cancelBtn: '取消',
        confirm: () => {
          deleteIncome(row.incomeStatementId).then(() => {
            this.$message.success('删除成功')
            this.$etmTip.close()
            this.getList()
          })
        },
        cancel: () => {
          this.$etmTip.close()
        }
      })
      this.$etmTip.open()
    },
    exportExcel() {
      const param = {
        pageNum: this.pageNum,
        pageSize: this.pageSize
      }
      for (const i in this.searchInfo) {
        param[i] = this.searchInfo[i]
      }
      exportIncomeExcel(param).then(res => {
        downloadFileForUrl(res)
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.index-wrap {

}
</style>
