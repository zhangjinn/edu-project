<template>
  <div class="billDetailInfo">
    <etm-title>单据详情
      <slot>
        <div v-if="showBtnState === 'normal'" class="btn">
          <el-button class="refundBtn" @click="refund">退费</el-button>
          <el-button @click="settle">结算</el-button>
        </div>
        <div v-if="showBtnState === 'nopay'" class="btn">
          <el-button @click="paidAgain">重新支付</el-button>
        </div>
        <div v-if="showBtnState === 'void'" class="btn">
          <el-button class="refundBtn" @click="refund">退费</el-button>
        </div>
        <div v-if="showBtnState === 'overdue'" class="btn">
          <el-button @click="settle">结算</el-button>
        </div>
      </slot>
    </etm-title>
    <!--    基本信息-->
    <basic-info v-if="billDetail.invoicesInfo" :bill-detail="billDetail" />
    <!--    收费项目-->
    <in-come-info v-if="billDetail.invoicesInfo" :bill-detail="billDetail" />
    <!--    支付详情-->
    <paid-info v-if="billDetail.invoicesInfo" :bill-detail="billDetail" type="pop" />
    <!--    分割线-->
    <div v-if="showBtnState === 'refund'" class="divideLine" />
    <!--    退费详情-->
    <refund-info v-if="showBtnState === 'refund'" :bill-detail="billDetail" />
    <!--    完成详情-->
    <overdue-info v-if="showBtnState === 'overdue'" :bill-detail="billDetail" />
    <!--    退费弹窗-->
    <etm-pop
      :visible="showRefund"
      title="退费"
      pop="complex"
      @close="closeRefund"
      @cancel="closeRefund"
      @confirm="confirmRefund"
    >
      <slot>
        <refund-pop v-if="chargeData.length > 0" :charge-data="chargeData" type="pop" @sendData="getRefundData" />
      </slot>
    </etm-pop>
    <!--    结算弹窗-->
    <etm-pop
      :visible="showSettle"
      title="结算"
      pop="complex"
      @close="closeSettle"
      @cancel="closeSettle"
      @confirm="confirmSettle"
    >
      <slot>
        <settle-pop v-if="chargeData.length > 0" :charge-data="chargeData" @sendData="getSettleData" />
      </slot>
    </etm-pop>
  </div>
</template>

<script>
import EtmTitle from '@/layout/main/EtmTitle'
import basicInfo from './components/basicInfo/index'
import inComeInfo from './components/incomeTable/index'
import paidInfo from './components/paidInfo/index'
import refundInfo from './components/refundInfo/index'
import overdueInfo from './components/overdueInfo/index'
import EtmPop from '@/layout/main/EtmPop'
import refundPop from './components/refundPop/index'
import settlePop from './components/settlePop/index'

import { getInvoice, postInvoice } from '@/api/invoice'

export default {
  name: 'Detail',
  components: {
    EtmTitle,
    basicInfo,
    inComeInfo,
    paidInfo,
    refundInfo,
    overdueInfo,
    EtmPop,
    refundPop,
    settlePop
  },
  data() {
    return {
      billDetail: {},
      showBtnState: '',
      showRefund: false,
      showSettle: false,
      chargeData: [],
      refundData: {},
      settleData: {}
    }
  },
  created() {
    this.getInvoice()
  },
  methods: {
    getInvoice() {
      let id = this.$store.state.billInfo.billDetailId
      if (!id) {
        id = sessionStorage.getItem('billDetailId')
      }
      sessionStorage.setItem('billDetailId', id)
      getInvoice(id).then(response => {
        this.billDetail = response.data
        this.setBtnState(this.billDetail.invoicesInfo)
        this.chargeData = this.billDetail.feesDetail.items
      })
    },
    //  根据单据状态显示不同的按钮
    setBtnState(data) {
      if (data.state === 'NORMAL') {
        if (data.payState === 'NOPAY') {
          this.showBtnState = 'nopay'
        } else {
          this.showBtnState = 'normal'
        }
      } else if (data.state === 'SETTLED') {
        this.showBtnState = 'settled'
      } else if (data.state === 'REFUND') {
        this.showBtnState = 'refund'
      } else if (data.state === 'VOID') {
        this.showBtnState = 'void'
      } else if (data.state === 'OVERDUE') {
        this.showBtnState = 'overdue'
      }
    },
    //  退费
    refund() {
      this.showRefund = true
    },
    closeRefund() {
      this.showRefund = false
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
        this.showRefund = false
        this.$message({
          message: '退费成功',
          type: 'success'
        })
        this.getInvoice()
      })
    },
    //  结算
    settle() {
      this.showSettle = true
    },
    closeSettle() {
      this.showSettle = false
    },
    getSettleData(val) {
      this.settleData = val
    },
    confirmSettle() {
      if (!this.settleData.way) {
        let flag = true
        for (let i = 0; i < this.settleData.item.length; i++) {
          if (this.settleData.item[i].refundPrice > 0) {
            this.$message({
              message: '请选择退款方式',
              type: 'warning'
            })
            flag = false
            break
          }
        }
        if (flag === true) {
          this.postSettle()
        }
      } else {
        this.postSettle()
      }
    },
    postSettle() {
      this.showSettle = false
      const param = {
        invoicesId: this.billDetail.invoicesInfo.invoiceId,
        operationType: 'NORMAL',
        refundWay: this.settleData.way,
        item: this.settleData.item
      }
      postInvoice(param).then(() => {
        this.showRefund = false
        this.$message({
          message: '结算成功',
          type: 'success'
        })
        this.getInvoice()
      })
    },
    //  重新支付
    paidAgain() {
      const id = this.billDetail.invoicesInfo.invoiceId
      sessionStorage.setItem('invoiceCurd', 'put')
      this.$store.commit('billInfo/SET_BILL_ID', id)
      this.$emit('switch', { target: 'sign', index: 0 })
    }
  }
}

</script>

<style scoped lang="scss">
.billDetailInfo{
  @include bgc_white();
  /deep/.billInfo{
    position: relative;
    padding: 32px 24px 0;
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
  /deep/.EtmTitle-wrap{
    position: relative;
    .btn{
      position: absolute;
      right: 24px;
      .refundBtn{
        @include c_error_color();
        @include bgc_white();
        @include bc_error_color();
      }
    }
  }
  .divideLine{
    height: 16px;
    @include bgc_bg_color();
  }
}
</style>

