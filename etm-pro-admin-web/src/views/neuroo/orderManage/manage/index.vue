<template>
  <div class="orderManage_neurro_manage">
    <etm-layout-split>
      <div slot="header">
        <fil ref="filter" @query="query" />
      </div>
      <div slot="body">
        <etm-table-page
          ref="table"
          :columns="columns"
          :data="tableData"
          index-type="index"
          border
          @currentChange="currentChange"
          @selection-change="selectionChange"
        >
          <etm-table-tool-bar slot="tool">
            <div slot="right">
              <el-button plain :disabled="disabled" style="margin-left: 8px;" @click.stop="exportSelect">导出选中</el-button>
              <el-button plain @click.stop="exportAll">导出所有</el-button>
            </div>
          </etm-table-tool-bar>
          <el-table-column slot="left" type="selection" fixed="left" />
          <!-- <el-table-column slot="left" type="index" label="序号" width="70" fixed="left" /> -->

          <el-table-column slot="left" label="订单编号" fixed="left" width="150">
            <template slot-scope="scoped">
              <a @click.stop="showOrder(scoped)">{{ scoped.row.orderNo }}</a>
            </template>
          </el-table-column>

          <el-table-column slot="left" label="会员姓名" fixed="left" width="190">
            <template slot-scope="scoped">
              <a @click.stop="showCustomer(scoped)">{{ scoped.row.customerName }}</a>
            </template>
          </el-table-column>

          <el-table-column slot="right" label="操作" width="230" fixed="right">
            <template slot-scope="scoped">
              <etm-text type="primary" @click.stop="handleModify(scoped)">修改</etm-text>
              <etm-text v-show="scoped.row.orderState !== '已退费' && scoped.row.orderState !== '使用完'" type="primary" @click.stop="handleRefund(scoped)">退费</etm-text>
              <etm-text v-show="scoped.row.arrangeState !== '已排课' && scoped.row.orderBusinessType !== '早教师上门业务' && scoped.row.orderState !== '已退费'" type="primary" @click.stop="handleArrange(scoped)">排课</etm-text>
            </template>
          </el-table-column>
        </etm-table-page>
      </div>
    </etm-layout-split>

    <etm-pop
      :visible="pop"
      pop="simple"
      :title="popTitle"
      confirm-btn="确定"
      cancel-btn="取消"
      @open="handlePopOpen"
      @close="handlePopClose"
      @confirm="handlePopConfirm"
      @cancel="handlePopCancel"
    >
      <etm-form v-show="popTitle === '自动排课'" ref="form" :model="form" :rules="rules" type="dialog">
        <el-form-item label="剩余课时:">
          {{ selectOrderDetail.leftTotalHour }}
        </el-form-item>
        <el-form-item label="上课园区:">
          {{ selectOrderDetail.school || '-' }}
        </el-form-item>
        <el-form-item label="选择班级:" prop="classId">
          <el-select v-model="form.classId" :placeholder="$t('schedule.classSelectPlaceHolderText')">
            <el-option v-for="(c, index) in classList" :key="index" :label="c.clazzName" :value="c.clazzId" />
          </el-select>
        </el-form-item>
        <el-form-item label="开始时间:" prop="date">
          <el-date-picker
            ref="date"
            v-model="form.date"
            placeholder="请选择日期"
          />
        </el-form-item>
      </etm-form>
      <el-form v-show="popTitle === '订单退费'" ref="refund" label-position="left" class="refund" :rules="refundRules" :model="refundForm">
        <el-form-item label="订单编号:">
          {{ selectOrderDetail.orderNo }}
        </el-form-item>
        <el-form-item label="订单金额:">
          {{ selectOrderDetail.depositAmount }}
        </el-form-item>
        <el-form-item label="总课时:">
          {{ selectOrderDetail.totalHour }}
        </el-form-item>
        <el-form-item label="剩余总课时:">
          {{ selectOrderDetail.leftTotalHour }}
        </el-form-item>
        <el-form-item label="消课课时:">
          {{ selectOrderDetail.usedHour }}
        </el-form-item>
        <el-form-item label="订单时长（月）:">
          {{ selectOrderDetail.packageLength }}
        </el-form-item>
        <el-form-item label="签到天数:">
          {{ signIndays }}
        </el-form-item>
        <el-form-item label="剩余金额:">
          {{ selectOrderDetail.leftAmount }}
        </el-form-item>
        <el-form-item label="退款金额:" prop="amount">
          <el-input v-model="refundForm.amount" placeholder="请输入退款金额" />
        </el-form-item>
      </el-form>
    </etm-pop>
    <etm-side
      :visible="side"
      :title="sideTitle"
      @close="handleSideClose"
      @open="handleSideOpen"
    >
      <info v-show="sideTitle === '宝宝详情'" :content="babyInfo" :name="babyName" />
      <el-form v-show="sideTitle === '订单详情'">
        <el-form class="orderDetail" label-position="left">
          <el-form-item v-for="(o, i) in detailList" :key="i" :label="o.label + '：'">
            {{ o.value }}
          </el-form-item>
        </el-form>
      </el-form>
    </etm-side>
  </div>
</template>
<script>
import fil from './filter'
import etmSide from '@/layout/main/EtmSide'
import etmPop from '@/layout/main/EtmPop'
import {
  arrangeClass,
  checkArrangeState,
  getClazzList,
  getMemberDetail,
  getOrderDetailList,
  getOrderList,
  getSignInDays,
  refund
} from '@/api/neuroo/orderManage'
import transferDate from '@/utils/date'
import info from './info'
import getXlsx from '@/utils/xlsx'

export default {
  components: {
    fil,
    etmSide,
    etmPop,
    info
  },
  data() {
    return {
      tableData: {
        content: []
      },
      columns: [
        {
          label: '订单状态',
          prop: 'orderState',
          fixed: 'left'
        },
        {
          label: '排课状态',
          prop: 'arrangeState'
        },
        {
          label: '上课园区',
          prop: 'schoolName'
        },
        {
          label: '业务类型',
          prop: 'orderBusinessType'
        },
        {
          label: '家长姓名',
          prop: 'parentName'
        },
        {
          label: '单价',
          prop: 'price'
        },
        {
          label: '课程费合计',
          prop: 'totalAmount'
        },
        {
          label: '剩余金额',
          prop: 'leftAmount'
        },
        {
          label: '时长',
          prop: 'packageLength'
        },
        {
          label: '总课时',
          prop: 'totalHour'
        }
      ],
      pageInfo: {
        pageNum: 1,
        pageSize: 10
      },
      selection: [],
      disabled: true,
      side: false,
      sideTitle: '',
      pop: false,
      popTitle: '',
      form: {
        date: '',
        classId: undefined
      },
      refundForm: {
        amount: ''
      },
      rules: {
        classId: [{
          required: true,
          message: '请选择班级'
        }],
        date: [{
          required: true,
          message: '请选择日期'
        }]
      },
      refundRules: {
        amount: [{
          required: true,
          message: '请输入退款金额'
        }]
      },
      babyInfo: null,
      babyName: '',
      fieldList: {
        orderNo: '订单编号',
        orderType: '订单类型',
        orderBusinessType: '业务类型',
        outOrderNo: '转出订单号',
        intoOrderNo: '转入订单号',
        customerName: '会员名称',
        parentName: '家长名称',
        packageLength: '套餐时长',
        payHour: '付费课时',
        giveHour: '赠送课时',
        totalHour: '总课时',
        usedHour: '消课课时',
        usedAmount: '消课金额',
        leftPayHour: '剩余付费课时',
        leftGiveHour: '剩余赠送课时',
        leftTotalHour: '剩余总课时',
        leftAmount: '剩余金额',
        totalAmount: '课程费合计',
        price: '课时单价',
        supplementHour: '需补课课时',
        usedSupplementHour: '已补课课时',
        depositAmount: '订金金额',
        discountCouponAmount: '优惠券金额',
        orderState: '订单状态',
        bigCustomerDiscount: '是否使用大客户优惠',
        startDate: '开始日期',
        endDate: '结束日期',
        orderTime: '下单日期',
        totalMealsAmount: '餐费合计',
        actualMealsAmount: '餐费实收',
        remark: '备注',
        attachment: '附件',
        signSchool: '签约园区',
        signPerformance: '签约园区业绩',
        school: '上课园区',
        performance: '上课园区业绩',
        experienceTeacher: '体验课老师',
        owner: '负责人',
        ownerPerformance: '负责人业绩占比',
        otherOwner: '次业绩所属人',
        otherOwnerPerformance: '次业绩所属人业绩占比',
        refundDate: '退款日期',
        refundAmount: '退款金额'
      },
      detailList: [],
      selectOrderDetail: {},
      selectScoped: {},
      classList: [],
      enable: true,
      signIndays: '-',
      name: ''
    }
  },
  computed: {
    filter() {
      return this.$store.state.orderManageNeuroo.filter
    }
  },
  watch: {
    selection(v) {
      v.length ? this.disabled = false : this.disabled = true
    }
  },
  created() {
    this.refreshTableData()
  },
  methods: {
    query() {
      this.pageInfo.pageNum = 1
      this.refreshTableData()
    },
    refreshTableData() {
      const options = {
        pageNum: this.pageInfo.pageNum,
        pageSize: this.pageInfo.pageSize
      }
      if (this.filter) {
        Object.assign(options, this.filter)
        for (const k in options) {
          if (!options[k]) {
            delete options[k]
          }
        }
      }
      getOrderList(options).then(res => {
        this.tableData = res.data
      }).catch(err => {
        console.log(err)
      })
    },
    currentChange(pageNum, pageSize) {
      this.pageInfo = {
        pageNum, pageSize
      }
      this.refreshTableData()
    },
    selectionChange(val) {
      this.selection = val
    },
    toModify() {
      this.$emit('switch', 'modify')
    },
    showOrder(scoped) {
      this.sideTitle = '订单详情'
      getOrderDetailList(scoped.row.id).then(res => {
        const rawData = res.data
        this.detailList = []
        for (const k in this.fieldList) {
          if (['endDate', 'orderTime', 'refundDate', 'startDate'].indexOf(k) !== -1) {
            this.detailList.push({
              label: this.fieldList[k],
              value: transferDate(+rawData[k]).time
            })
          } else {
            this.detailList.push({
              label: this.fieldList[k],
              value: rawData[k]
            })
          }
        }
        this.handleSideOpen()
      }).catch(err => {
        this.$message.error('获取订单详情失败')
        console.log(err)
      })
    },
    showCustomer(scoped) {
      this.sideTitle = '宝宝详情'
      getMemberDetail(scoped.row.customerId).then(res => {
        const { data } = res
        data.customerInfo.birthday = transferDate(data.customerInfo.birthday).time
        data.customerInfo.enterSchoolTime = transferDate(data.customerInfo.enterSchoolTime).time
        this.babyInfo = data
        this.babyName = scoped.row.customerName
        this.handleSideOpen()
      }).catch(err => {
        console.log(err)
      })
    },
    exportAll() {

    },
    exportSelect() {
      if (!this.enable) {
        return
      }
      this.enable = false
      getXlsx({
        data: this.selection,
        columns: [
          {
            label: '订单编号',
            prop: 'orderNo'
          },
          {
            label: '会员姓名',
            prop: 'customerName'
          },
          ...this.columns
        ],
        fileName: '订单列表'
      })
      setTimeout(() => {
        this.enable = true
      }, 1000)
    },
    getSelectOrderDetail(id) {
      const p1 = getSignInDays(id)
      const p2 = getOrderDetailList(id)
      Promise.all([p1, p2]).then(res => {
        this.selectOrderDetail = res[1].data
        this.signIndays = res[0].data.day
        this.handlePopOpen()
      }).catch(err => {
        this.$message.error('获取订单详情失败')
        console.log(err)
      })
    },
    handleModify(scoped) {
      localStorage.setItem('orderManageNeuroo_currentId', scoped.row.id)
      this.toModify()
    },
    handleRefund(scoped) {
      this.popTitle = '订单退费'
      this.selectScoped = scoped.row
      this.refundForm.amount = scoped.row.leftAmount || ''
      this.getSelectOrderDetail(scoped.row.id)
    },
    handleArrange(scoped) {
      this.popTitle = '自动排课'
      this.selectScoped = scoped.row
      const startDate = scoped.row.startDate || 0
      this.form.date = new Date(Math.max(+startDate, Date.now()))
      this.name = scoped.row.customerName
      getClazzList(this.selectScoped.schoolId).then(res => {
        this.classList = res.data
      }).catch(err => {
        console.log(err)
      })
      this.getSelectOrderDetail(scoped.row.id)
    },
    handleSideClose() {
      this.side = false
    },
    handleSideOpen() {
      this.side = true
    },
    handlePopOpen() {
      this.pop = true
      this.$nextTick(() => {
        this.$refs.form.$children[0].clearValidate()
      })
    },
    handlePopClose() {
      this.pop = false
      this.form.classId = ''
    },
    handlePopConfirm() {
      switch (this.popTitle) {
        case '订单退费':
          this.$refs.refund.validate(valid => {
            if (valid) {
              refund({
                orderId: this.selectScoped.id,
                refundAmount: this.refundForm.amount
              }).then(res => {
                this.$message({
                  type: 'success',
                  message: '退费成功'
                })
                this.handlePopClose()
                this.refreshTableData()
              }).catch(err => {
                console.log(err)
              })
            } else {
              return false
            }
          })
          break
        case '自动排课':
          this.$refs.form.$children[0].validate(valid => {
            if (valid) {
              checkArrangeState({
                customerId: this.selectScoped.customerId,
                lastLesson: this.selectOrderDetail.leftTotalHour,
                startDate: transferDate(this.form.date).time
              }).then(res => {
                if (Array.isArray(res.data) && res.data.length) {
                  // 已有排课，不能自动排课
                  let html = `<div>${this.name}学员已有以下排课：</div>`
                  let li = ''
                  res.data.forEach(v => {
                    li += `<li>${transferDate(v.date).time} ${v.courseName}课程</li>`
                  })
                  html += `<ul>${li}</ul>`
                  this.$etmTip.init({
                    type: 'warn',
                    title: '排课冲突',
                    html,
                    confirmBtn: '确定',
                    confirm: () => {
                      this.$etmTip.close()
                      this.handlePopClose()
                    }
                  })
                  this.$etmTip.open()
                } else {
                  // 可以自动排课
                  return arrangeClass({
                    customerId: this.selectScoped.customerId,
                    lastLesson: this.selectOrderDetail.leftTotalHour,
                    clazzId: this.form.classId,
                    startDate: transferDate(this.form.date).time,
                    orderId: this.selectScoped.id
                  }).then(res => {
                    this.$message({
                      type: 'success',
                      message: '自动排课成功'
                    })
                    this.refreshTableData()
                    this.handlePopClose()
                  })
                }
              }).catch(err => {
                console.log(err)
                this.handlePopClose()
              })
            } else {
              return false
            }
          })
          break
      }
    },
    handlePopCancel() {
      this.handlePopClose()
    }
  }
}
</script>

<style scoped lang="scss">
.orderManage_neurro_manage {

}
.el-form.refund {
  .el-form-item {
    margin-bottom: 3px;
  }
  .el-input {
    width: 80%;
  }
  & >>> .el-form-item__error {
    margin-left: 84px;
  }
}
.orderDetail {
  height: calc(100vh - 55px);
  overflow-y: auto;
  padding-top: 16px;
  & >>> .el-form-item {
    margin-bottom: 16px;
    padding-left: 24px;
  }
}
</style>
