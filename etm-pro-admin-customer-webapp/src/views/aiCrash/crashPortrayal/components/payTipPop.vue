<template>
  <div class="payPop-wrap">
    <!--    充值弹窗提示-->
    <etm-pop
      :visible="showPayPop"
      pop="complex"
      :title="title"
      :confirm-btn="confirmBtn"
      :cancel-btn="cancelBtn"
      @close="$emit('update:showPayPop', false)"
      @confirm="confirm"
      @cancel="$emit('update:showPayPop', false)"
    >
      <recharge
        :item="currentItem"
        :org="basicInfo.companyName"
        @protocol="protocol"
        @pay="pay"
        @log="$refs.detail.show()"
      />
    </etm-pop>

    <etm-pop
      :visible="popPayVisible"
      class="payPop"
      :title="payCountDown"
      @close="popPayClose"
      @cancel="popPayClose"
      @confirm="popPayConfirm"
    >
      <div class="popContent">
        <pay
          v-if="popPayVisible"
          :order-id.sync="paymentOrderId"
          :choose-package="choosePackage"
        />
      </div>
    </etm-pop>

    <!--    增值服务-->
    <etm-pop
      :visible="popVisibleProtocol"
      pop="complex"
      title="增值服务及使用协议"
      @close="popCloseProtocol"
      @cancel="popCloseProtocol"
      @confirm="popConfirmProtocol"
    >
      <div class="popContent">
        <service-agreement v-if="popVisibleProtocol" />
      </div>
    </etm-pop>

    <detail ref="detail" />
  </div>
</template>

<script>
/**
   * payPop create by 油麦菜
   * createTime 2021/3/13 16:40
   */
import recharge from '@/views/historyPortrayal/components/recharge/recharge'
import pay from '@/views/historyPortrayal/components/pay/pay'
import serviceAgreement from '@/views/historyPortrayal/components/serviceAgreement'
import { getEnterpriseCurrent } from '@/api/base/base'
import {
  queryVerifyPortrayalPay
} from '@/api/base/paymentCenter'
import Detail from '@/views/historyPortrayal/components/detail'
let payCountDownBox
export default {
  name: 'PayTipPop',
  components: {
    Detail,
    recharge,
    serviceAgreement,
    pay
  },
  filters: {},
  mixins: [],
  props: {
    point: {
      type: Number,
      default: 0
    },
    showPayPop: {
      type: Boolean,
      default: false
    },
    title: {
      type: String,
      default: 'AI碰客点数充值'
    },
    confirmBtn: {
      type: String,
      default: '支付'
    },
    cancelBtn: {
      type: String,
      default: '取消'
    }
  },
  data () {
    return {
      choosePackage: {},
      popVisibleProtocol: false,
      paymentOrderId: 0, // 支付订单id
      countDown: 90, //  倒计时
      popPayVisible: false,
      currentItem: {
        point: 0,
        text: {
          typeName: ''
        }
      },
      basicInfo: {
        callTime: null,
        companyName: null,
        principal: null,
        phoneNumber: null,
        address: null,
        remainingSpace: ''
      }
    }
  },
  computed: {
    payCountDown () {
      return `支付 · 剩余时间（${this.countDown}秒）`
    }
  },
  watch: {
    popPayVisible: {
      handler (n) {
        if (n) {
          this.countDownCallBack()
        } else {
          this.countDown = 90
          clearTimeout(payCountDownBox)
        }
      }
    },
    point: {
      immediate: true,
      handler (n) {
        this.currentItem.point = n
      }
    }
  },
  created () {
    this.getEnterpriseCurrentData()
  },
  mounted () {
  },
  methods: {
    popCloseProtocol () {
      this.popVisibleProtocol = false
    },
    popConfirmProtocol () {
      this.popVisibleProtocol = false
    },
    countDownCallBack () {
      const currCountDown = this.countDown - 1
      this.countDown = currCountDown

      if (currCountDown <= 0) {
        this.popPayVisible = false
        return
      }

      if (currCountDown % 2 === 0) {
        if (this.paymentOrderId) {
          queryVerifyPortrayalPay(this.paymentOrderId).then(res => {
            if (res.data !== 'UNPAID') {
              this.popPayVisible = false
              this.countDown = 90
              this.paymentOrderId = 0
              this.popVisible = false
              this.popVisibleProtocol = false
              clearTimeout(payCountDownBox)

              const content = `成功充值${this.choicePackageInfo.time}点`
              this.$emit('update:showPayPop', false)
              this.$emit('success')

              this.$etmTip.init({
                type: 'success',
                title: '充值成功',
                content,
                confirmBtn: '确定',
                confirm: () => {
                  this.$emit('success')
                  this.$etmTip.close()
                }
              })
              this.$etmTip.open()
            }
          })
        }
      }

      payCountDownBox = setTimeout(() => {
        this.countDownCallBack()
      }, 1000)
    },
    getEnterpriseCurrentData () {
      getEnterpriseCurrent().then((res) => {
        const { data } = res
        this.basicInfo.companyName = data.name
        this.basicInfo.principal = data.principalName
        this.basicInfo.phoneNumber = data.principalTelephone
        this.basicInfo.remainingSpace = data.remainingSpace
      })
    },
    popPayClose () {
      this.popPayVisible = false
      // this.getTableData()
    },
    popPayConfirm () {
      this.popPayVisible = false
      this.popVisible = false
      // this.getTableData()
    },
    confirm () {
      this.choosePackage.id = this.choosePackage.id.filter(item => item)
      if (this.choosePackage.id.length <= 0) {
        this.$message.warning('请选择一个套餐')
        return
      }
      this.popPayVisible = true
    },
    protocol () {
      this.popVisibleProtocol = true
    },
    pay (val) {
      this.choosePackage = { amount: val.amount, id: val.id }
      this.choicePackageInfo = val.choiceInfo
    }
  }
}
</script>
<style lang="scss" scoped>

</style>
