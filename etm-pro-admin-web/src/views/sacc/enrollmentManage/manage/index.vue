<template>
  <div class="enrollmentManage">
    <etm-layout-split>
      <div slot="header">
        <div class="customerTabItem">
          <etm-tabs v-model="activeName" :setting="true" @setting="setting">
            <el-tab-pane label="报名信息" name="message">
              <etm-tool-bar v-show="show" v-model="formData" @search="handleSearch" @reset="reset" />
            </el-tab-pane>
          </etm-tabs>
        </div>
      </div>
      <div slot="body">
        <template v-if="activeName === 'message'">
          <etm-table-page
            :columns="columns"
            :data="tableData"
            index-type="index"
            border
            @currentChange="currentChange"
          >
            <etm-table-tool-bar slot="tool" v-model="toolBar">
              <div slot="right">
                <el-button v-has="{authId: 'sacc.enroll.create'}" type="primary" @click="addSignUp">入学报名</el-button>
              </div>
            </etm-table-tool-bar>
            <el-table-column slot="left" type="index" label="序号" fixed="left" width="60" />
            <el-table-column slot="left" label="报名单号" fixed="left" width="180">
              <template slot-scope="scoped">
                <a @click.stop="showDetail(scoped.row)">{{ scoped.row.orderNumber }}</a>
              </template>
            </el-table-column>
            <el-table-column slot="left" label="状态" fixed="left" width="120">
              <template slot-scope="scoped">
                {{ transferState(scoped.row.orderState) }}
              </template>
            </el-table-column>
            <el-table-column slot="left" label="报名类型" width="120">
              <template slot-scope="scoped">
                {{ transferType(scoped.row.orderType) }}
              </template>
            </el-table-column>
            <el-table-column slot="right" label="签约日期" width="120">
              <template slot-scope="scoped">
                {{ transferDate(scoped.row.signDate) }}
              </template>
            </el-table-column>
            <el-table-column slot="right" label="有效期" width="240">
              <template slot-scope="scoped">
                {{ transferDate(scoped.row.startDate) + ' 至 ' + transferDate(scoped.row.endDate) }}
              </template>
            </el-table-column>
            <el-table-column slot="right" label="操作" fixed="right" width="200">
              <template slot-scope="scoped">
                <etm-text v-has="{authId: 'sacc.enroll.update'}" type="primary" @click="edit(scoped.row)">修改</etm-text>
                <etm-text v-if="scoped.row.orderState === 'UNAUDIT'" v-has="{authId: 'sacc.enroll.remove'}" type="danger" @click="remove(scoped.row)">删除
                </etm-text>
                <etm-text v-if="scoped.row.orderState === 'UNAUDIT'" v-has="{authId: 'sacc.enroll.exam'}" type="primary" @click="approve(scoped.row)">审核
                </etm-text>
                <etm-text v-if="scoped.row.orderState === 'REJECT'" type="primary" @click="checkReason(scoped.row)">查看原因
                </etm-text>
              </template>
            </el-table-column>
          </etm-table-page>
        </template>
      </div>
    </etm-layout-split>
    <etm-pop
      v-if="showApprovePop"
      :visible="showApprovePop"
      pop="simple"
      :title="popTitle"
      confirm-btn="通过"
      cancel-btn="不通过"
      @close="handlePopClose"
      @confirm="handlePopConfirm"
      @cancel="handlePopCancel"
    >
      <div class="popContent">
        <div>请确认以下收款信息:</div>
        <div>
          <span>会员姓名:</span>
          <span>{{ approveData.customerName }}</span>
        </div>
        <div>
          <span>应收总价（元）:</span>
          <span>{{ approveData.actualAmount }}</span>
        </div>
      </div>
    </etm-pop>
    <etm-pop
      v-if="showRejectPop"
      :visible="showRejectPop"
      pop="simple"
      :title="rejectTitle"
      confirm-btn="确定"
      cancel-btn="取消"
      @close="onClose"
      @confirm="onConfirm"
      @cancel="onCancel"
    >
      <div class="rejectPop">
        <etm-form ref="form" :model="formItem" :rules="rules" type="dialog">
          <el-form-item label="不通过原因" prop="rejectReason">
            <el-input
              v-model="formItem.rejectReason"
              type="textarea"
              :rows="5"
              placeholder="请填写原因"
            />
          </el-form-item>
        </etm-form>
      </div>
    </etm-pop>
  </div>
</template>

<script>
import { getCareTypeEnable, getCareOrderList, auditOrder, getOrderDetail, deleteOrder } from '@/api/sacc/enrollmentManage'
import EtmPop from '@/layout/main/EtmPop/src/EtmPop'
import { parseTime } from '@/utils'

export default {
  components: {
    EtmPop
  },
  data() {
    return {
      activeName: 'message',
      show: true,
      formData: [
        {
          label: '学员姓名',
          type: 'input',
          prop: 'name',
          value: '',
          props: {
            placeholder: '请输入学员姓名'
          }
        },
        {
          label: '课程类型',
          type: 'select',
          prop: 'careType',
          value: '',
          options: [
            {
              label: '全部',
              value: 0
            }
          ],
          props: {
            placeholder: '请选择课程类型'
          }
        },
        {
          label: '签约日期',
          type: 'date',
          prop: 'date',
          value: '',
          props: {
            type: 'daterange',
            startPlaceholder: '开始日期',
            endPlaceholder: '结束日期'
          }
        },
        {
          label: '状态',
          type: 'select',
          prop: 'orderState',
          value: '',
          options: [
            {
              label: '全部',
              value: ''
            },
            {
              label: '待审核',
              value: 'UNAUDIT'
            },
            {
              label: '不通过',
              value: 'REJECT'
            },
            {
              label: '未开课',
              value: 'UNSTART'
            },
            {
              label: '已开课',
              value: 'STARTING'
            },
            {
              label: '已结束',
              value: 'END'
            },
            {
              label: '已退费',
              value: 'REFUND'
            }
          ],
          props: {
            placeholder: '请选择状态'
          }
        },
        {
          label: '报名类型',
          type: 'select',
          prop: 'orderType',
          value: '',
          options: [
            {
              label: '全部',
              value: ''
            },
            {
              label: '新生',
              value: 'NEW_SIGN'
            },
            {
              label: '续报',
              value: 'RENEW'
            }
          ],
          props: {
            placeholder: '请选择报名类型'
          }
        }
      ],
      tableData: {
        content: []
      },
      pageNum: 1,
      pageSize: 10,
      searchInfo: {},
      columns: [
        {
          label: '套餐名称',
          prop: 'packageName',
          width: '100px'
        },
        {
          label: '课程类型',
          prop: 'typeName',
          width: '100px'
        },
        {
          label: '会员姓名',
          prop: 'customerName',
          width: '100px'
        },
        {
          label: '家长姓名',
          prop: 'parentName',
          width: '100px'
        },
        {
          label: '套餐价格',
          prop: 'actualAmount',
          width: '100px'
        },
        {
          label: '套餐时长（月）',
          prop: 'duration',
          width: '130px'
        }
      ],
      toolBar: [],
      showApprovePop: false,
      popTitle: '报名审核',
      approveData: {},
      showRejectPop: false,
      rejectTitle: '填写原因',
      formItem: {
        rejectReason: ''
      },
      rules: {
        rejectReason: [{ required: true, message: '不通过原因不能为空', trigger: 'blur' }]
      }
    }
  },
  created() {
    this.getCareTypeList()
    this.getTableList()
  },
  methods: {
    getCareTypeList() {
      getCareTypeEnable().then(res => {
        const data = res.data
        data.forEach(item => {
          const option = {
            label: item.careTypeName,
            value: item.careTypeName
          }
          this.formData[1].options.push(option)
        })
      })
    },
    getTableList() {
      const param = {}
      for (const i in this.searchInfo) {
        param[i] = this.searchInfo[i]
      }
      param.pageNum = this.pageNum
      param.pageSize = this.pageSize
      getCareOrderList(param).then(res => {
        this.tableData = res.data
      })
    },
    transferState(state) { // 报名订单状态
      if (!state) return
      switch (state) {
        case 'UNAUDIT':
          return '待审核'
        case 'REJECT':
          return '不通过'
        case 'UNSTART':
          return '未开课'
        case 'STARTING':
          return '已开课'
        case 'END':
          return '已结束'
        case 'REFUND':
          return '已退费'
      }
    },
    transferType(type) { // 报名订单类型
      if (!type) return
      switch (type) {
        case 'NEW_SIGN':
          return '新生'
        case 'RENEW':
          return '续报'
      }
    },
    transferDate(date) {
      if (!date) return
      return parseTime(date, '{y}-{m}-{d}')
    },
    setting() { // 应用设置
      this.$emit('switch', { target: 'setup', index: 1 })
    },
    handleSearch(value) { // 输入搜索
      const param = {}
      value.forEach(item => {
        if (item.value) {
          if (item.prop === 'date') {
            param.startDate = item.value[0]
            param.endDate = item.value[1]
          } else {
            param[item.prop] = item.value
          }
        }
      })
      this.searchInfo = param
      this.pageNum = 1
      this.getTableList()
    },
    reset() { // 重置
      this.searchInfo = {}
      this.pageNum = 1
      this.getTableList()
    },
    currentChange(pageNum, pageSize) { // 表格翻页
      this.pageNum = pageNum
      this.pageSize = pageSize
      this.getTableList()
    },
    addSignUp() {
      this.$store.commit('sacc/enrollment/set_order_id', '')
      this.$emit('switch', { target: 'enrollment', index: 2 })
    },
    showDetail(row) {
      this.$store.commit('sacc/enrollment/set_order_id', row.orderId)
      this.$emit('switch', { target: 'detail', index: 0 })
    },
    edit(row) {
      if (row.orderState === 'UNAUDIT' || row.orderState === 'REJECT') {
        this.$store.commit('sacc/enrollment/set_order_id', row.orderId)
        this.$emit('switch', { target: 'enrollEdit', index: 3 })
      } else {
        this.$store.commit('sacc/enrollment/set_order_id', row.orderId)
        this.$emit('switch', { target: 'orderEdit', index: 4 })
      }
    },
    remove(row) {
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
          deleteOrder(row.orderId).then(() => {
            this.$etmTip.close()
            this.$message.success('删除成功')
            this.getTableList()
          })
        }
      })
      this.$etmTip.open()
    },
    approve(row) {
      this.approveData = row
      this.showApprovePop = true
    },
    handlePopClose() {
      this.showApprovePop = false
    },
    handlePopConfirm() {
      const param = {
        orderId: this.approveData.orderId,
        pass: true
      }
      auditOrder(param).then(() => {
        this.$message.success('审核成功')
        this.showApprovePop = false
        this.getTableList()
      })
    },
    handlePopCancel() {
      this.showApprovePop = false
      this.showRejectPop = true
    },
    onClose() {
      this.showRejectPop = false
    },
    onConfirm() {
      this.$refs['form'].$children[0].validate((valid) => {
        if (valid) {
          const param = {
            orderId: this.approveData.orderId,
            pass: false,
            message: this.formItem.rejectReason
          }
          this.submitAudit(param)
        }
      })
    },
    submitAudit(data) {
      auditOrder(data).then(() => {
        this.$message.success('审核成功')
        this.showRejectPop = false
        this.getTableList()
      })
    },
    onCancel() {
      this.showRejectPop = false
    },
    checkReason(row) {
      getOrderDetail(row.orderId).then(res => {
        const orderData = res.data
        this.$etmTip.init({
          type: 'warn',
          title: '查看原因',
          content: orderData.message,
          confirmBtn: '关闭',
          confirm: () => {
            this.$etmTip.close()
          }
        })
        this.$etmTip.open()
      })
    }
  }
}
</script>

<style lang="scss" scoped>

  .popContent {
    div {
      margin-bottom: 16px;
      @include c_title_color();
    }
  }

  .rejectPop {
    /deep/ textarea {
      resize: none;
    }
  }
</style>
