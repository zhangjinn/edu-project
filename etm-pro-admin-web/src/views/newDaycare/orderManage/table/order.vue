<template>
  <div class="orderTable-wrap">
    <etm-table-page
      :data="tableData"
      :columns="columns"
      :stripe="false"
      :span-method="objectSpanMethod"
      @currentChange="currentChange"
      @selection-change="selectionChange"
    >
      <etm-table-tool-bar slot="tool">
        <div slot="right">
          <el-button plain @click="urgePayBatch">批量催缴
          </el-button>
          <el-button plain @click="chargeConfirmBatch">
            批量收费
          </el-button>
          <el-button plain @click="exportOrder">导出Excel
          </el-button>
        </div>
      </etm-table-tool-bar>
      <el-table-column slot="left" fixed="left" type="selection" width="60" :selectable="selectable" />
      <el-table-column slot="left" fixed="left" label="账单编号" prop="code" width="180">
        <template slot-scope="scoped">
          <a @click="showDetail(scoped.row)">{{ scoped.row.code }}</a>
        </template>
      </el-table-column>
      <el-table-column slot="left" fixed="left" label="幼儿姓名" prop="childName" width="120">
        <template slot-scope="scoped">
          <span>{{ scoped.row.childName }}</span>
        </template>
      </el-table-column>
      <el-table-column slot="left" fixed="left" label="班级" prop="clazzName" width="150">
        <template slot-scope="scoped">
          <span>{{ scoped.row.clazzName }}</span>
        </template>
      </el-table-column>
      <el-table-column slot="left" label="收费方式" prop="chargeType" width="90">
        <template slot-scope="scoped">
          <span>{{ transferChargeType(scoped.row.chargeType) }}</span>
        </template>
      </el-table-column>
      <el-table-column slot="left" label="收费时段" prop="chargeRangeTime" width="150">
        <template slot-scope="scoped">
          <span>{{ transferChargeTime(scoped.row) }}</span>
        </template>
      </el-table-column>
      <el-table-column slot="left" label="应收总金额（元）" prop="totalAmount" align="right" width="150">
        <template slot-scope="scoped">
          <span>{{ formatMoney(scoped.row.totalAmount) }}</span>
        </template>
      </el-table-column>
      <el-table-column slot="left" label="实收总金额（元）" prop="actualAmount" align="right" width="150">
        <template slot-scope="scoped">
          <span>{{ formatMoney(scoped.row.actualAmount) }}</span>
        </template>
      </el-table-column>
      <el-table-column slot="right" label="应收小计（元）" prop="itemTotalAmount" align="right" width="120">
        <template slot-scope="scoped">
          <span>{{ formatMoney(scoped.row.itemTotalAmount) }}</span>
        </template>
      </el-table-column>
      <el-table-column slot="right" label="应收单价（元）" prop="unitAmount" align="right" width="120">
        <template slot-scope="scoped">
          <span>{{ formatMoney(scoped.row.unitAmount) }}</span>
        </template>
      </el-table-column>
      <el-table-column slot="right" label="实收小计（元）" prop="itemActualAmount" align="right" width="120">
        <template slot-scope="scoped">
          <span>{{ formatMoney(scoped.row.itemActualAmount) }}</span>
        </template>
      </el-table-column>
      <el-table-column slot="right" label="实收单价（元）" prop="actualUnitAmount" align="right" width="120">
        <template slot-scope="scoped">
          <span>{{ formatMoney(scoped.row.actualUnitAmount) }}</span>
        </template>
      </el-table-column>
      <el-table-column slot="right" label="是否使用订金" prop="depositAmount" align="right" width="120">
        <template slot-scope="scoped">
          <span>{{ formatMoney(scoped.row.depositAmount) }}</span>
        </template>
      </el-table-column>
      <el-table-column slot="right" label="缴费方式" prop="payType" width="90">
        <template slot-scope="scoped">
          <span>{{ transferPayType(scoped.row.payType) }}</span>
        </template>
      </el-table-column>
      <el-table-column slot="right" label="支付方式" prop="paymentType" width="90">
        <template slot-scope="scoped">
          <span>{{ transferPaymentType(scoped.row.paymentType) }}</span>
        </template>
      </el-table-column>
      <el-table-column slot="right" label="操作人" prop="operateBy" width="90">
        <template slot-scope="scoped">
          <span>{{ scoped.row.operateBy }}</span>
        </template>
      </el-table-column>
      <el-table-column slot="right" label="收费时间" prop="paymentDate" width="180">
        <template slot-scope="scoped">
          <span>{{ transferDate(scoped.row.paymentDate) }}</span>
        </template>
      </el-table-column>
      <el-table-column slot="right" label="制单时间" prop="createTime" width="180">
        <template slot-scope="scoped">
          <span>{{ transferDate(scoped.row.createTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column slot="right" label="制单人" prop="createBy" width="90">
        <template slot-scope="scoped">
          <span>{{ scoped.row.createBy }}</span>
        </template>
      </el-table-column>
      <el-table-column slot="right" label="审核人" prop="confirmEmployee" width="90">
        <template slot-scope="scoped">
          <span>{{ scoped.row.confirmEmployee }}</span>
        </template>
      </el-table-column>
      <el-table-column slot="right" fixed="right" label="收费状态" prop="status" width="90">
        <template slot-scope="scoped">
          <span>{{ transferStatus(scoped.row.status) }}</span>
        </template>
      </el-table-column>
      <el-table-column slot="right" fixed="right" label="操作" prop="operate" width="200">
        <template slot-scope="scoped">
          <etm-text
            v-if="scoped.row.status === 'UN_PAY'"
            type="primary"
            @click="urgePay(scoped.row)"
          >催缴
          </etm-text>
          <etm-text
            v-if="scoped.row.status === 'UN_PAY'"
            type="primary"
            @click="chargeConfirm(scoped.row)"
          >确认收费
          </etm-text>
          <span v-if="scoped.row.status === 'PAYED'">--</span>
        </template>
      </el-table-column>
    </etm-table-page>
    <etm-pop
      v-if="showChargePop"
      :visible="showChargePop"
      pop="complex"
      :title="popTitle"
      confirm-btn="确定"
      cancel-btn="取消"
      @close="handlePopClose"
      @confirm="handlePopConfirm"
      @cancel="handlePopCancel"
    >
      <div class="popBox">
        <etm-form ref="form" :model="chargeForm" :rules="rule" type="dialog">
          <el-form-item label="支付类型" prop="paymentTypeEnum">
            <el-select v-model="chargeForm.paymentTypeEnum">
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="缴费日期">
            <el-date-picker v-model="chargeForm.paymentDate" type="datetime" :clearable="false" />
          </el-form-item>
        </etm-form>
        <div class="totalBox">已选<span>{{ chargeTable.length }}</span>人</div>
        <etm-table :data="chargeTable">
          <el-table-column slot="left" label="幼儿姓名" prop="childName" />
          <el-table-column slot="left" label="性别">
            <template slot-scope="scoped">
              <span>{{ scoped.row.gender === 'MALE' ? '男' : '女' }}</span>
            </template>
          </el-table-column>
          <el-table-column slot="left" label="班级" prop="clazzName" />
        </etm-table>
      </div>
    </etm-pop>
    <etm-drawer
      :visible.sync="showDrawer"
      type="big"
    >
      <etm-layout-split>
        <order-detail :order-data="orderData" />
      </etm-layout-split>
    </etm-drawer>
  </div>

</template>

<script>/**
 * orderTable create by Administrator
 * createTime 2020/8/20 16:09
 */

import {
  updateOrderCall,
  queryOrderExport,
  queryOrderList,
  updateOrderConfirm, queryOrderById
} from '@/api/newDaycare/orderManage'
import { parseTime } from '@/utils'
import { unique } from '@/utils/arrUtils'
import { downloadFileForUrl } from '@/utils/file'
import orderDetail from './components/orderDetail'

export default {
  name: 'OrderTable',
  components: {
    orderDetail
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
          label: '收费项目',
          prop: 'orderItemName',
          width: 150
        }
      ],
      tableData: {
        content: []
      },
      pageNum: 1,
      pageSize: 10,
      rowNum: [],
      showChargePop: false,
      popTitle: '',
      rule: {
        paymentTypeEnum: [{ required: true, message: '支付类型不能为空', trigger: 'change' }]
      },
      options: [
        {
          label: '支付宝',
          value: 'ALIPAY'
        },
        {
          label: '微信',
          value: 'WECHAT'
        },
        {
          label: '现金',
          value: 'CASH'
        },
        {
          label: '网银',
          value: 'ONLINE_BANKING'
        }
      ],
      chargeForm: {
        paymentDate: new Date()
      },
      chargeTable: [],
      selectionData: [],
      showDrawer: false,
      orderData: {}
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
    selectionChange(val) {
      this.selectionData = val
    },
    getList() { // 获取列表数据
      const param = {}
      param.pageNum = this.pageNum
      param.pageSize = this.pageSize
      for (const i in this.searchInfo) {
        param[i] = this.searchInfo[i]
      }
      queryOrderList(param).then(res => {
        const tableData = JSON.parse(JSON.stringify(res.data))
        tableData.content = []
        this.rowNum = []
        res.data.content.forEach(item => { // 拆分数据
          this.rowNum.push(item.orderItemList.length) // 记录每项数据有几个子项，在进行表格合并时用到
          item.orderItemList.forEach(list => { // 将每项数据里的子项抽出并形成新的一项数据
            const data = JSON.parse(JSON.stringify(item))
            data.orderItemName = list.orderItemName
            data.itemTotalAmount = list.totalAmount
            data.unitAmount = list.unitAmount
            data.itemActualAmount = list.actualAmount
            data.actualUnitAmount = list.actualUnitAmount
            tableData.content.push(data)
          })
        })
        this.tableData = tableData
      })
    },
    selectable(row) {
      if (row.status === 'PAYED') {
        return false
      } else {
        return true
      }
    },
    objectSpanMethod({ row, column, rowIndex, columnIndex }) { // 表格合并
      if (column.type === 'selection' || this.judgeColumnType(column.property)) {
        let num = 0
        let flag = false
        for (let i = 0; i < this.rowNum.length; i++) {
          if (rowIndex === this.addNum(i - 1)) {
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
      }
    },
    judgeColumnType(type) { // 判断行是否合并
      if (type === 'code' || type === 'childName' || type === 'clazzName' || type === 'chargeType' || type === 'chargeRangeTime' || type === 'totalAmount' || type === 'actualAmount' || type === 'name' || type === 'payType' || type === 'paymentType' || type === 'operateBy' || type === 'paymentDate' || type === 'createTime' || type === 'createBy' || type === 'confirmEmployee' || type === 'status' || type === 'operate' || type === 'depositAmount') {
        return true
      } else {
        return false
      }
    },
    addNum(index) { // 数组前index+1项之和
      if (index < 0) return 0
      let num = 0
      this.rowNum.forEach((item, ind) => {
        if (ind <= index) {
          num += item
        }
      })
      return num
    },
    transferChargeType(chargeType) {
      switch (chargeType) {
        case 'PER_MONTH':
          return '按月'
        case 'PER_TERM':
          return '按学期'
        default:
          return chargeType
      }
    },
    transferChargeTime(data) {
      if (data.chargeType === 'PER_MONTH') {
        return this.transferDate(data.chargeRangeStart, 'month') + '至' + this.transferDate(data.chargeRangeEnd, 'month')
      } else if (data.chargeType === 'PER_TERM') {
        return data.termName
      } else {
        return '--'
      }
    },
    transferPayType(type) { // 支付类型
      switch (type) {
        case 'OFFLINE':
          return '线下'
        case 'ONLINE':
          return '线上'
        default:
          return type
      }
    },
    transferPaymentType(type) { // 支付方式
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
    transferDate(date, type) { // 日期转换
      if (isNaN(date)) {
        return date
      } else if (type === 'month') {
        return parseTime(date, '{y}-{m}')
      } else {
        return parseTime(date, '{y}-{m}-{d} {h}:{i}:{s}')
      }
    },
    transferStatus(status) { // 收费状态
      switch (status) {
        case 'UN_PAY':
          return '未收费'
        case 'PAYED':
          return '已收费'
        case 'REFUND':
          return '已退费'
        default:
          return status
      }
    },
    formatMoney(money) {
      if (!isNaN(money)) {
        return money.toFixed(2)
      } else {
        return money
      }
    },
    showDetail(row) {
      queryOrderById({ orderId: row.orderId }).then(res => {
        this.orderData = res.data
        this.showDrawer = true
      })
    },
    urgePay(row) { // 催缴确认弹窗
      const html = `将<span class="urgePayTip">催缴</span>消息发送给<span class="urgePayTip">${row.childName}</span>的家长，是否继续操作？`
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
          this.$etmTip.close()
          const param = {
            orderIdList: []
          }
          param.orderIdList.push(row.orderId)
          updateOrderCall(param).then(() => {
            this.$message.success('催缴发送成功')
          })
        }
      })
      this.$etmTip.open()
    },
    urgePayBatch() { // 批量催缴确认弹窗
      let arr = []
      this.selectionData.forEach(item => { // 选中的数据中未支付的数据
        if (item.status === 'UN_PAY') {
          arr.push(item)
        }
      })
      if (!this.selectionData.length || !arr.length) {
        this.$message.warning('请勾选需催缴的幼儿')
        return
      }
      arr = unique(arr, 'orderId')
      let str = ''
      arr.forEach((item, index) => {
        if (index === 0) {
          str += item.childName
        } else {
          str += '、' + item.childName
        }
      })
      const html = `将<span class="urgePayTip">催缴</span>消息发送给<span class="urgePayTip">${str}</span>的家长，是否继续操作？`
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
            orderIdList: []
          }
          arr.forEach(item => {
            param.orderIdList.push(item.orderId)
          })
          updateOrderCall(param).then(() => {
            this.$message.success('催缴发送成功')
            this.$etmTip.close()
          })
        }
      })
      this.$etmTip.open()
    },
    chargeConfirm(row) { // 打开确认收费弹窗
      this.chargeForm = {
        paymentDate: new Date()
      }
      this.chargeTable = []
      this.chargeTable.push(row)
      this.popTitle = '确认收费'
      this.showChargePop = true
    },
    chargeConfirmBatch() { // 批量收费
      this.chargeTable = []
      this.selectionData.forEach(item => {
        if (item.status === 'UN_PAY') {
          this.chargeTable.push(item)
        }
      })
      this.chargeTable = unique(this.chargeTable, 'orderId')
      if (!this.selectionData.length || !this.chargeTable.length) {
        this.$message.warning('请勾选需收费的幼儿')
        return
      }
      this.chargeForm = {
        paymentDate: new Date()
      }
      this.popTitle = '批量收费'
      this.showChargePop = true
    },
    handlePopClose() {
      this.showChargePop = false
    },
    handlePopConfirm() { // 提交收费数据
      this.$refs.form.$children[0].validate(valid => {
        if (valid) {
          const param = {
            orderIdList: [],
            paymentDate: parseTime(this.chargeForm.paymentDate, '{y}-{m}-{d} {h}:{i}:{s}'),
            paymentTypeEnum: this.chargeForm.paymentTypeEnum
          }
          this.chargeTable.forEach(item => {
            param.orderIdList.push(item.orderId)
          })
          updateOrderConfirm(param).then(() => {
            this.$message.success('收费成功')
            this.showChargePop = false
            this.getList()
          })
        }
      })
    },
    handlePopCancel() {
      this.showChargePop = false
    },
    exportOrder() {
      const param = {}
      param.pageNum = this.pageNum
      param.pageSize = this.pageSize
      for (const i in this.searchInfo) {
        param[i] = this.searchInfo[i]
      }
      queryOrderExport(param).then(res => {
        downloadFileForUrl(res)
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.orderTable-wrap {

}

.totalBox {
  padding-bottom: 16px;

  span {
    @include c_main_color();
  }
}
</style>
