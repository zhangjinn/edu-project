<template>
  <div class="refund">
    <etm-title>退费</etm-title>
    <!--    基本信息-->
    <basic-info v-if="billDetail.invoicesInfo" :bill-detail="billDetail" />
    <!--    收费项目-->
    <in-come-info v-if="billDetail.invoicesInfo" :bill-detail="billDetail" />
    <!--    支付详情-->
    <paid-info v-if="billDetail.invoicesInfo" :bill-detail="billDetail" type="page" />
    <!--    退费单据-->
    <div class="refundBill billInfo">
      <div class="titleText">退费单据</div>
      <refund-bill v-if="chargeData.length > 0" :charge-data="chargeData" type="page" @sendData="getRefundData" @confirm="confirmRefund" />
    </div>
  </div>
</template>

<script>
import EtmTitle from '@/layout/main/EtmTitle'
import basicInfo from '../detail/components/basicInfo/index'
import inComeInfo from '../detail/components/incomeTable/index'
import paidInfo from '../detail/components/paidInfo/index'
import refundBill from '../detail/components/refundPop/index'

import { getInvoice, postInvoice } from '@/api/invoice'

export default {
  name: 'Index',
  components: {
    EtmTitle,
    basicInfo,
    inComeInfo,
    paidInfo,
    refundBill
  },
  data() {
    return {
      customerId: '',
      billDetail: {},
      chargeData: [],
      refundData: {}
    }
  },
  created() {
    this.getInvoice()
  },
  methods: {
    getInvoice() {
      let id = this.$store.state.billInfo.billDetailId
      if (!id) { // 防止刷新页面后拿不到id
        id = sessionStorage.getItem('billDetailId')
      }
      sessionStorage.setItem('billDetailId', id)
      getInvoice(id).then(response => {
        this.billDetail = response.data
        this.chargeData = this.billDetail.feesDetail.items
      })
    },
    getRefundData(val) {
      this.refundData = val
    },
    confirmRefund() {
      if (!this.refundData.way) {
        let flag = true
        for (let i = 0; i < this.refundData.item.length; i++) {
          if (this.refundData.item[i].refundPrice > 0) {
            this.$message({
              message: '请选择退款方式',
              type: 'warning'
            })
            flag = false
            break
          }
        }
        if (flag === true) {
          this.postRefund()
        }
      } else {
        this.postRefund()
      }
    },
    postRefund() {
      const param = {
        invoicesId: this.billDetail.invoicesInfo.invoiceId,
        operationType: 'REFUND',
        refundWay: this.refundData.way,
        item: this.refundData.item
      }
      postInvoice(param).then(() => {
        this.$message({
          message: '退费成功',
          type: 'success'
        })
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.refund{
  height: calc(100vh - 143px);
  @include bgc_white();
  overflow-y: auto;
  /deep/.billInfo{
    position: relative;
    padding: 32px 24px 0;
    font-size: 14px;
    &::after{
      display: inline-block;
      position: absolute;
      bottom: 0;
      left: 24px;
      right: 24px;
      content: '';
      border: .5px solid;
      @include bc_divide_color();
    }

  }
  /deep/.titleText{
    padding-bottom: 24px;
    font-size: 16px;
    @include c_title_color();
  }
}
</style>
