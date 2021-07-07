<template>
  <div class="charge-wrap">
    <etm-table-page
      :columns="columns"
      :data="tableData"
      index
      @currentChange="currentChange"
    >
      <etm-table-tool-bar slot="tool">
        <div slot="right">
          <el-button v-has="{authId: 'guardcare.orderBunch.create'}" type="primary" @click="openChargePop">
            发起收费
          </el-button>
          <el-button v-has="{authId: 'guardcare.orderBunch.excelExport'}" plain @click="exportOrderBunch">
            导出Excel
          </el-button>
        </div>
      </etm-table-tool-bar>
      <el-table-column slot="left" fixed="left" label="收费名称" width="120">
        <template slot-scope="scoped">
          <a @click="showDetail(scoped.row)">{{ scoped.row.orderBunchName }}</a>
        </template>
      </el-table-column>
      <el-table-column slot="left" label="发送类型" width="90">
        <template slot-scope="scoped">
          <span>{{ transferType(scoped.row.type) }}</span>
        </template>
      </el-table-column>
      <el-table-column slot="left" label="收费对象" width="120">
        <template slot-scope="scoped">
          <span>{{ transferTarget(scoped.row.sendTargetList) }}</span>
        </template>
      </el-table-column>
      <el-table-column slot="right" label="制单时间" width="150">
        <template slot-scope="scoped">
          <span>{{ transferDate(scoped.row.createTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column slot="right" label="审核时间" width="150">
        <template slot-scope="scoped">
          <span>{{ transferDate(scoped.row.auditTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column slot="right" label="制单人" prop="createBy" width="90" />
      <el-table-column slot="right" label="审核人" prop="auditBy" width="90" />
      <el-table-column slot="right" fixed="right" label="账单状态" width="90">
        <template slot-scope="scoped">
          <span>{{ transferStatus(scoped.row.status) }}</span>
        </template>
      </el-table-column>
      <el-table-column slot="right" fixed="right" label="操作" width="180">
        <template slot-scope="scoped">
          <etm-text
            v-if="scoped.row.status === 'UN_AUDIT'"
            v-has="{authId: 'guardcare.orderBunch.exam'}"
            type="primary"
            @click="audit(scoped.row)"
          >审核
          </etm-text>
          <etm-text
            v-if="scoped.row.status === 'REJECT'"
            v-has="{authId: 'guardcare.orderBunch.query'}"
            type="primary"
            @click="checkReason(scoped.row)"
          >查看原因
          </etm-text>
          <etm-text
            v-if="scoped.row.status === 'UN_AUDIT' || scoped.row.status === 'REJECT'"
            v-has="{authId: 'guardcare.orderBunch.update'}"
            type="primary"
            @click="edit(scoped.row)"
          >编辑
          </etm-text>
          <etm-text v-if="scoped.row.status === 'UN_AUDIT'" type="danger" @click="remove(scoped.row)">删除</etm-text>
          <etm-text v-if="scoped.row.status === 'UN_FULL'" type="primary" @click="callPay(scoped.row)">催缴</etm-text>
          <span v-if="scoped.row.status === 'FULL'">--</span>
        </template>
      </el-table-column>
    </etm-table-page>
    <etm-pop
      v-if="showPop"
      :visible.sync="showPop"
      pop="big"
      title="发起收费"
      :confirm-btn="confirmText"
      :cancel-btn="cancelText"
      @close="handlePopClose"
      @confirm="handlePopConfirm"
      @cancel="handlePopCancel"
    >
      <div>
        <charge-form v-show="popActive === 1" ref="chargeForm" :form-data="chargeData" />
        <order-form v-show="popActive === 2" :form-data="orderData" />
      </div>
    </etm-pop>
    <etm-drawer
      :visible.sync="showSide"
      type="big"
    >
      <order-side
        :order-bunch-id="orderBunchId"
        :drawer-type="drawerType"
        @finish="finishDrawer"
        @change="changeType"
        @close="closeSide"
      />
    </etm-drawer>
  </div>

</template>

<script>
import chargeForm from '../conponent/chargeForm'
import orderForm from '../conponent/orderForm'
import {
  callOrderBunch,
  deleteOrderBunch,
  exportOrderBunchExcel,
  getOrderBunch,
  postNewCharge,
  postNewChargeConfirm
} from '@/api/guardcare/orderManage/charge'
import { parseTime } from '@/utils'
import orderSide from '../conponent/orderSide'
import { downloadFileForUrl } from '@/utils/file'

/**
 * charge create by Administrator
 * createTime 2020/8/20 14:13
 */
export default {
  name: 'Charge',
  components: {
    chargeForm,
    orderForm,
    orderSide
  },
  filters: {},
  mixins: [],
  props: {
    searchInfo: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  data() {
    return {
      columns: [
        {
          label: '接受数（人）',
          prop: 'receiveNumber'
        },
        {
          label: '线上支付（人）',
          prop: 'onlinePayNumber'
        },
        {
          label: '线下支付（人）',
          prop: 'offlinePayNumber'
        },
        {
          label: '未收费（人）',
          prop: 'unpaidNumber'
        },
        {
          label: '应收总金额（元）',
          prop: 'totalAmount',
          align: 'right'
        },
        {
          label: '实收总金额（元）',
          prop: 'actualAmount',
          align: 'right'
        }
      ],
      tableData: {
        content: []
      },
      pageNum: 1,
      pageSize: 10,
      showPop: false,
      popActive: 1,
      chargeData: {},
      orderData: {},
      confirmText: '下一步',
      cancelText: '取消',
      toNext: false,
      showSide: false,
      orderBunchId: '',
      drawerType: ''
    }
  },
  computed: {},
  watch: {
    searchInfo: {
      handler() {
        this.pageNum = 1
        this.getList()
      },
      deep: true
    },
    chargeData: {
      handler() {
        if (this.toNext) {
          this.toNext = false
        }
      },
      deep: true
    }
  },
  created() {
  },
  mounted() {
    this.getList()
  },
  methods: {
    currentChange(pageNum, pageSize) {
      this.pageNum = pageNum
      this.pageSize = pageSize
      this.getList()
    },
    getList() {
      const param = {}
      param.pageNum = this.pageNum
      param.pageSize = this.pageSize
      for (const i in this.searchInfo) {
        param[i] = this.searchInfo[i]
      }
      getOrderBunch(param).then(res => {
        this.tableData = res.data
      })
    },
    transferType(type) { // 发送类型
      switch (type) {
        case 'PER_CLAZZ':
          return '按班级'
        case 'PER_CHILD':
          return '按幼儿'
        default:
          return type
      }
    },
    transferTarget(data) { // 接收对象的处理
      if (!Array.isArray(data)) {
        return data
      } else {
        return data.join(',')
      }
    },
    transferDate(date) { // 日期转换
      if (isNaN(date)) {
        return date
      } else {
        return parseTime(date, '{y}-{m}-{d} {h}:{i}')
      }
    },
    transferStatus(status) { // 账单状态
      switch (status) {
        case 'UN_AUDIT':
          return '待审核'
        case 'REJECT':
          return '不通过'
        case 'UN_FULL':
          return '未收全'
        case 'FULL':
          return '已收全'
        default:
          return status
      }
    },
    showDetail(row) { // 查看详情
      this.orderBunchId = row.orderBunchId
      this.showSide = true
      this.drawerType = 'detail'
    },
    audit(row) { // 审核批次
      this.orderBunchId = row.orderBunchId
      this.showSide = true
      this.drawerType = 'audit'
    },
    edit(row) { // 编辑批次
      this.orderBunchId = row.orderBunchId
      this.showSide = true
      this.drawerType = 'edit'
    },
    changeType(type) { // 抽屉弹窗编辑与详情切换
      this.drawerType = type
    },
    finishDrawer() { // 审核完成关闭抽屉，并重新请求数据
      this.getList()
    },
    closeSide() { // 关闭抽屉
      this.showSide = false
    },
    remove(row) { // 删除确认弹窗
      this.$etmTip.init({
        type: 'error',
        title: `确认删除该数据？`,
        content: `删除后将无法撤销，是否继续操作？`,
        confirmBtn: '删除',
        cancelBtn: '取消',
        cancel: () => {
          this.$etmTip.close()
        },
        confirm: () => {
          deleteOrderBunch(row.orderBunchId).then(() => {
            this.$message.success('删除成功')
            this.$etmTip.close()
            this.getList()
          })
        }
      })
      this.$etmTip.open()
    },
    callPay(row) { // 催缴信息发送提示弹窗
      const html = `发送催缴信息，是否继续操作？`
      this.$etmTip.init({
        type: 'warn',
        title: `确认`,
        html,
        confirmBtn: '确定',
        cancelBtn: '取消',
        cancel: () => {
          this.$etmTip.close()
        },
        confirm: () => {
          const param = {
            orderBunchIdList: []
          }
          param.orderBunchIdList.push(row.orderBunchId)
          callOrderBunch(param).then(() => {
            this.$message.success('催缴信息发送成功')
            this.$etmTip.close()
          })
        }
      })
      this.$etmTip.open()
    },
    checkReason(row) { // 查看不通过原因
      this.$etmTip.init({
        type: 'warn',
        title: `原因`,
        content: row.rejectMessage,
        confirmBtn: '知道了',
        confirm: () => {
          this.$etmTip.close()
        }
      })
      this.$etmTip.open()
    },
    openChargePop() { // 打开添加弹窗
      this.chargeData = { // 初始化添加弹窗数据
        type: 'PER_CHILD',
        childTargets: [],
        clazzTargets: [],
        sendTargetList: [],
        noticeParent: true,
        usingDeposit: true,
        orderBunchItemList: []
      }
      this.popActive = 1
      this.showPop = true
    },
    handlePopClose() { // 关闭添加弹窗
      this.showPop = false
    },
    handlePopConfirm() {
      if (this.popActive === 1) { // 点击下一步
        if (this.toNext) { // 第一步数据提交后是否再次返回第一步修改了数据
          this.popActive++
          this.confirmText = '提交审核'
          this.cancelText = '上一步'
        } else { // 提交第一步的数据
          this.$refs.chargeForm.$children[0].$children[0].validate(valid => {
            if (valid) {
              if (!this.chargeData.orderBunchItemList.length) {
                this.$message.warning('收费项目不能为空')
                return
              }
              const param = {
                orderBunchName: this.chargeData.orderBunchName,
                type: this.chargeData.type,
                sendTargets: [],
                sendTargetList: [],
                noticeParent: this.chargeData.noticeParent,
                usingDeposit: this.chargeData.usingDeposit,
                orderBunchItemList: []
              }
              if (this.chargeData.type === 'PER_CHILD') {
                this.chargeData.childTargets.forEach(item => {
                  param.sendTargets.push(item.childId)
                  param.sendTargetList.push(item.childName)
                })
              } else if (this.chargeData.type === 'PER_CLAZZ') {
                param.sendTargets.push(this.chargeData.clazzTargets[1])
                param.sendTargetList.push(this.chargeData.sendTargetList[0])
              }
              this.chargeData.orderBunchItemList.forEach(item => {
                const data = {}
                for (const i in item) {
                  if (i !== 'unit') {
                    data[i] = item[i]
                  }
                }
                param.orderBunchItemList.push(data)
              })
              postNewCharge(param).then(res => {
                this.orderData = res.data
                this.popActive++
                this.confirmText = '提交审核'
                this.cancelText = '上一步'
                this.toNext = true
              })
            }
          })
        }
      } else { // 提交第二步的数据
        postNewChargeConfirm(this.orderData).then(() => {
          this.$message.success('账单发起成功')
          this.showPop = false
          this.getList()
        })
      }
    },
    handlePopCancel() {
      if (this.popActive === 1) { // 添加弹窗第一步
        this.showPop = false
      } else { // 添加弹窗第二步
        this.popActive--
        this.confirmText = '下一步'
        this.cancelText = '取消'
      }
    },
    exportOrderBunch() {
      const param = {}
      param.pageNum = this.pageNum
      param.pageSize = this.pageSize
      for (const i in this.searchInfo) {
        param[i] = this.searchInfo[i]
      }
      exportOrderBunchExcel(param).then(res => {
        downloadFileForUrl(res)
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.charge-wrap {

}
</style>
