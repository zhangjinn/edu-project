<template>
  <div class="order">
    <etm-table-page
      ref="table"
      :columns="columns"
      :data="tableData"
      index-type="index"
      border
      @currentChange="currentChange"
    >
      <el-table-column slot="right" label="操作" width="126">
        <template slot-scope="scoped">
          <etm-text type="primary" @click.stop="handleDetail(scoped)">详情</etm-text>
          <etm-text v-show="scoped.row.arrangeState !== '已排课' && scoped.row.orderBusinessType !== '早教师上门业务' && memberState !== 'OUT'" type="primary" @click.stop="handleArrange(scoped)">排课</etm-text>
        </template>
      </el-table-column>
    </etm-table-page>
    <etm-side
      :visible="side"
      title="订单详情"
      @close="handleSideClose"
      @open="handleSideOpen"
    >
      <el-form class="orderDetail" label-position="left">
        <el-form-item v-for="(o, i) in detailList" :key="i" :label="o.label + '：'">
          {{ o.value }}
        </el-form-item>
      </el-form>
    </etm-side>
    <etm-pop
      :visible="pop"
      pop="simple"
      title="自动排课"
      :confirm-btn="$t('schedule.confirmBtnText')"
      :cancel-btn="$t('schedule.cancelBtnText')"
      class="classArrangePop"
      @open="handlePopOpen"
      @close="handlePopClose"
      @confirm="handlePopConfirm"
      @cancel="handlePopCancel"
    >
      <etm-form ref="form" :model="form" :rules="rules" type="dialog">
        <el-form-item label="剩余课时:">
          {{ selectOrder.leftTotalHour }}
        </el-form-item>
        <el-form-item label="上课园区:">
          {{ selectOrder.schoolName || '-' }}
        </el-form-item>
        <el-form-item label="选择班级:" prop="classId">
          <el-select v-model="form.classId" :placeholder="$t('schedule.classSelectPlaceHolderText')">
            <el-option v-for="(clazz, index) in classList" :key="index" :label="clazz.clazzName" :value="clazz.clazzId" />
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
    </etm-pop>
  </div>
</template>

<script>
import etmSide from '@/layout/main/EtmSide'
import etmPop from '@/layout/main/EtmPop'
import transferDate from '../../../../../utils/date'
import { queryOrderList, getClazzList, arrangeClass, getOrderDetail, checkArrangeState } from '@/api/neuroo/memberManage'
export default {
  components: {
    etmSide,
    etmPop
  },
  props: {
    // eslint-disable-next-line vue/require-default-prop
    name: {
      type: String
    }
  },
  data() {
    return {
      tableData: {
        content: []
      },
      columns: [
        {
          type: 'index',
          label: '序号',
          width: '60'
        },
        {
          label: '订单编号',
          prop: 'orderNo'
        },
        {
          label: '排课状态',
          prop: 'arrangeState'
        },
        {
          label: '业务类型',
          prop: 'orderBusinessType'
        },
        {
          label: '订单状态',
          prop: 'orderState'
        },
        {
          label: '总课时',
          prop: 'totalHour'
        },
        {
          label: '剩余总课时',
          prop: 'leftTotalHour'
        },
        {
          label: '上课园区',
          prop: 'schoolName'
        },
        {
          label: '开始日期',
          prop: 'startDate'
        },
        {
          label: '到期日期',
          prop: 'endDate'
        }
      ],
      side: false,
      pop: false,
      form: {
        date: '',
        classId: undefined
      },
      rules: {
        classId: [{
          required: true,
          trigger: 'change',
          message: '请选择班级'
        }],
        date: [{
          required: true,
          trigger: 'blur',
          message: '请选择日期'
        }]
      },
      selectOrder: {},
      classList: [],
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
      pageInfo: {
        pageNum: 1,
        pageSize: 10
      },
      autoDate: Date.now()
    }
  },
  computed: {
    id() {
      return localStorage.getItem('memberManage_neuroo_currentId')
    },
    memberState() {
      return localStorage.getItem('memberManage_neuroo_memberState')
    }
  },
  created() {
    this.refreshTableData()
  },
  methods: {
    refresh() {
      this.refreshTableData()
    },
    currentChange(pageNum, pageSize) {
      this.pageInfo = {
        pageNum, pageSize
      }
      this.refreshTableData()
    },
    refreshTableData() {
      queryOrderList({
        customerId: this.id,
        pageNum: this.pageInfo.pageNum,
        pageSize: this.pageInfo.pageSize
      }).then(res => {
        const targetData = res.data
        targetData.content.forEach(v => {
          if (v.startDate) {
            v.startDate = transferDate(new Date(v.startDate)).time
          }
          if (v.endDate) {
            v.endDate = transferDate(new Date(v.endDate)).time
          }
        })
        this.tableData = targetData
      }).catch(err => {
        console.log(err)
      })
    },
    handleDetail(scoped) {
      getOrderDetail(scoped.row.id).then(res => {
        const rawData = res.data
        this.detailList = []
        for (const k in this.fieldList) {
          if (['endDate', 'orderTime', 'refundDate', 'startDate'].indexOf(k) !== -1) {
            this.detailList.push({
              label: this.fieldList[k],
              value: rawData[k] ? transferDate(rawData[k]).time : '-'
            })
          } else {
            this.detailList.push({
              label: this.fieldList[k],
              value: rawData[k]
            })
          }
        }
        this.handleSideOpen()
      })
        .catch(err => {
          this.$message.error('获取订单详情失败')
          console.log(err)
        })
    },
    handleArrange(scoped) {
      this.selectOrder = scoped.row
      const startDate = scoped.row.startDate ? new Date(scoped.row.startDate).getTime() : Date.now()
      this.autoDate = Math.max(+startDate, Date.now())
      this.form.date = new Date(this.autoDate)
      getClazzList(scoped.row.schoolId).then(res => {
        this.classList = res.data
      }).catch(err => {
        console.log(err)
      })
      this.handlePopOpen()
    },
    handleSideClose() {
      this.side = false
    },
    handleSideOpen() {
      this.side = true
    },
    handlePopOpen() {
      this.pop = true
    },
    handlePopClose() {
      this.$refs.form.$children[0].resetFields()
      this.pop = false
    },
    handlePopConfirm() {
      this.$refs.form.$children[0].validate(valid => {
        if (valid) {
          checkArrangeState({
            customerId: this.id,
            lastLesson: this.selectOrder.leftTotalHour,
            startDate: transferDate(this.form.date).time
          }).then(res => {
            if (Array.isArray(res.data) && res.data.length) {
              // 已有排课，不能自动排课
              let html = `<div>${this.name}学员已有以下排课：</div>`
              html += `<ul>`
              res.data.forEach(v => {
                html += `<li>${transferDate(v.date).time} ${v.courseName}课程</li>`
              })
              html += `</ul>`
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
                customerId: this.id,
                lastLesson: this.selectOrder.leftTotalHour,
                clazzId: this.form.classId,
                startDate: transferDate(this.form.date).time,
                orderId: this.selectOrder.id
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
    },
    handlePopCancel() {
      this.handlePopClose()
    },
    disabledDateFunc(time) {
      return time.getTime() < this.autoDate - 24 * 60 * 60 * 1000
    }
  }
}
</script>

<style scoped lang="scss">
.order {
  /*height: calc(100vh - 206px);*/
  /*overflow-y: auto;*/
  /*& >>> .el-table {*/
  /*  height: calc(100vh - 276px)!important;*/
  /*}*/
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
