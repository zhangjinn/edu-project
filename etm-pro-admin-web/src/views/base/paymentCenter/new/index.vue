<template>
  <etm-main-body class="main-body">
    <etm-layout-split>
      <div class="payment-box">
        <div v-for="(item, index) in paymentInfo" :key="index" class="payment-item">
          <div class="payment-bg-icon" :class="[item.type]"><i :class="['iconfont', item.icon]" /></div>

          <div class="payment-body">
            <div class="payment-title">
              <i :class="['iconfont', item.icon]" />
              {{ item.text.title }}
            </div>
            <div class="payment-info">
              <div>
                <strong :class="[item.status.status]">{{ status[item.status.status].text }}</strong>
                <div class="payment-number">
                  {{ item.status.remaining.label }}<span>{{ item.status.remaining.unit }}</span>
                </div>
                <p>{{ item.text.remaining }}</p>
              </div>
            </div>
            <div class="payment-other">
              <div class="payment-other-item">
                <div>
                  {{ item.status.total.label }} <span>{{ item.status.total.unit }}</span>
                </div>
                <p>{{ item.text.total }}</p>
              </div>
              <div class="payment-other-item">
                <div>
                  {{ item.status.use.label }} <span>{{ item.status.use.unit }}</span>
                </div>
                <p>{{ item.text.use }}</p>
              </div>
            </div>
            <el-button type="primary" @click="recharge(item)">充值</el-button>
            <etm-text @click="seeRecord(item)">{{ item.text.typeName }}充值记录</etm-text>
          </div>
        </div>

      </div>
    </etm-layout-split>

    <detail ref="detail" :prop="prop" />

    <!--    充值界面-->
    <etm-pop
      :visible="popVisible"
      pop="complex"
      :title="`${czTitle}充值`"
      confirm-btn="支付"
      cancel-btn="取消"
      @close="popClose"
      @cancel="popClose"
      @confirm="popConfirm"
    >
      <div class="popContent">
        <recharge v-if="popVisible" :item="currentItem" :org="basicInfo.companyName" @protocol="protocol" @pay="pay" />
      </div>
    </etm-pop>

    <!--    支付界面-->
    <etm-pop
      :visible="popPayVisible"
      class="payPop"
      :title="payCountDown"
      @close="popPayClose"
      @cancel="popPayClose"
      @confirm="popPayConfirm"
    >
      <div class="popContent">
        <pay v-if="popPayVisible" :order-id.sync="paymentOrderId" :choose-package="choosePackage" />
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

  </etm-main-body>
</template>

<script>

import etmMainBody from '@/layout/main/EtmMainBody'
import Detail from './components/detail'
import recharge from './components/recharge/recharge'
import pay from './components/pay/pay'
import serviceAgreement from '../serviceAgreement'
import { getEnterpriseCurrent, queryAreaInfoByAreaId, queryPaymentStatistics } from '@/api/base/base'
import { queryVerifyPay } from '@/api/base/paymentCenter'

let payCountDownBox

export default {
  name: 'PaymentCenter',
  components: {
    etmMainBody,
    recharge,
    Detail,
    pay,
    serviceAgreement
  },
  data() {
    return {
      paymentOrderId: 0, // 支付订单id
      choicePackageInfo: {},
      countDown: 90, //  倒计时
      sideVisible: false,
      popVisible: false,
      popPayVisible: false,
      popVisibleProtocol: false,
      currentItem: {
        text: {
          typeName: ''
        }
      },
      basicInfo: {},
      prop: {},
      paymentInfo: [],
      choosePackage: {},
      status: {
        'insufficient': {
          // textColor: 'rgba(222, 24, 24, .12)',
          // bgColor: 'rgba(222, 24, 24, 1)',
          text: '不足'
        },
        'adequate': {
          // textColor: 'rgba(18, 113, 182, 1)',
          // bgColor: 'rgba(0, 200, 69, .12)',
          text: '充足'
        },
        'normal': {
          // textColor: 'rgba(18, 113, 182, .12)',
          // bgColor: 'rgba(0, 200, 69, 1)',
          text: '正常'
        }
      }
    }
  },
  computed: {
    czTitle() {
      return `${this.currentItem.text.typeName}`
    },
    payCountDown() {
      return `支付 · 剩余时间（${this.countDown}秒）`
    }
  },
  watch: {
    popPayVisible: {
      handler(n) {
        if (n) {
          this.countDownCallBack()
        } else {
          this.countDown = 90
          clearTimeout(payCountDownBox)
        }
      }
    }
  },
  created() {
    this.getEnterpriseCurrentData()
    this.init()
  },
  methods: {
    init() {
      queryPaymentStatistics().then(res => {
        this.paymentInfo = res.data.map(cur => {
          const result = {}

          result.status = this.getStatus(cur)
          result.type = cur.type

          switch (cur.type) {
            case 'MESSAGE' :
              result.icon = 'iconduanxinshuliang'
              result.text = {
                title: '短信数量',
                total: '短信总数量',
                use: '已发送数量',
                remaining: '剩余数量',
                typeName: '短信'
              }
              break
            case 'CALL':
              result.text = {
                title: '通话时长',
                total: '通话总时长',
                use: '已使用时长',
                remaining: '剩余时长',
                typeName: '话费'
              }
              result.icon = 'icontonghuashichang'
              break
            case 'CLOUD_DISK':
              result.text = {
                title: '云盘空间',
                total: '云盘总空间',
                use: '已使用空间',
                remaining: '剩余空间',
                typeName: '云盘'
              }

              result.icon = 'iconyunpankongjian'
              break
            case 'CUSTOMER_PORTRAYAL':
              result.text = {
                title: 'AI碰客',
                total: '总充值点数',
                use: '已使用点数',
                remaining: '剩余点数',
                typeName: 'AI碰客'
              }

              result.icon = 'iconpengke'
              break
            case 'MESSAGE_5G':
              result.text = {
                title: '5G消息数量',
                total: '短信总数量',
                use: '已发送数量',
                remaining: '剩余数量',
                typeName: '5G消息'
              }

              result.icon = 'icon5G1'
              break
            default :
              result.text = {
                title: '',
                total: '',
                use: '',
                remaining: '',
                typeName: ''
              }
              result.icon = 'iconyunpankongjian'
          }

          return result
        })
      })
    },
    countDownCallBack() {
      const currCountDown = this.countDown - 1
      this.countDown = currCountDown

      if (currCountDown <= 0) {
        this.popPayVisible = false
        return
      }

      if (currCountDown % 2 === 0) {
        if (this.paymentOrderId) {
          // if (currCountDown === 81) {
          //   this.popPayVisible = false
          //   this.countDown = 90
          //   this.paymentOrderId = 0
          //   this.popVisible = false
          //   this.popVisibleProtocol = false
          //   clearTimeout(payCountDownBox)
          //
          //   this.$etmTip.init({
          //     type: 'success',
          //     title: `充值成功`,
          //     content: `充值${this.czTitle} ${this.choicePackageInfo.time}${this.czTitle === '话费' ? '分钟' : (this.czTitle === '短信' ? '条' : 'GB')}`,
          //     confirmBtn: '确定',
          //     confirm: () => {
          //       this.init()
          //       this.$etmTip.close()
          //     }
          //   })
          //   this.$etmTip.open()
          // }
          queryVerifyPay(this.paymentOrderId).then(res => {
            if (res.data !== 'UNPAID') {
              let content

              this.popPayVisible = false
              this.countDown = 90
              this.paymentOrderId = 0
              this.popVisible = false
              this.popVisibleProtocol = false
              clearTimeout(payCountDownBox)

              switch (this.czTitle) {
                case '话费':
                  content = `充值通话时长${this.choicePackageInfo.time}分钟`
                  break
                case '短信':
                  content = `充值短信${this.choicePackageInfo.time}条`
                  break
                case '云盘':
                  content = `成功扩容${this.choicePackageInfo.time}GB`
                  break
                case 'AI碰客':
                  content = `成功充值${this.choicePackageInfo.time}点`
                  break
                case '5G消息':
                  content = `充值短信${this.choicePackageInfo.time}条`
                  break
                default:
                  content = '充值成功'
              }

              this.$etmTip.init({
                type: 'success',
                title: `充值成功`,
                content,
                confirmBtn: '确定',
                confirm: () => {
                  this.init()
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
    getEnterpriseCurrentData() {
      getEnterpriseCurrent().then((res) => {
        const { data } = res
        this.basicInfo.companyName = data.name
        this.basicInfo.principal = data.principalName
        this.basicInfo.phoneNumber = data.principalTelephone
        this.basicInfo.remainingSpace = data.remainingSpace
        if (data.areaCode) {
          const param = {
            areaId: data.areaCode
          }
          queryAreaInfoByAreaId(param).then(res => {
            const { provinceName, cityName, countyName } = res.data
            this.basicInfo.address = provinceName + cityName + countyName + (data.address || '')
          })
        }
      })
    },
    popConfirm() {
      this.choosePackage.id = this.choosePackage.id.filter(item => item)
      if (this.choosePackage.id.length <= 0) {
        this.$message.warning('请选择一个套餐')
        return
      }
      this.popPayVisible = true
    },
    recharge(item) {
      this.currentItem = item
      this.popVisible = true
    },

    popClose() {
      this.popVisible = false
    },
    popCloseProtocol() {
      this.popVisibleProtocol = false
    },
    popConfirmProtocol() {
      this.popVisibleProtocol = false
    },
    popPayClose() {
      this.popPayVisible = false
      // this.getTableData()
    },
    popPayConfirm() {
      this.popPayVisible = false
      this.popVisible = false
      // this.getTableData()
    },
    // 打开协议
    // 支付
    pay(val) {
      this.choosePackage = { amount: val.amount, id: val.id }
      this.choicePackageInfo = val.choiceInfo
    },
    protocol() {
      this.popVisibleProtocol = true
    },
    seeRecord(item) {
      this.prop = item
      this.$nextTick(() => {
        this.$refs['detail'].show()
      })
    },
    getFlowUnit(size) {
      const step = 1024 * 1024

      return {
        unit: size > (step * 1024) ? 'GB' : 'MB',
        formatSize: size > (step * 1024) ? this.getDiskCloudSize(size, step * 1024) : this.getDiskCloudSize(size, step)
      }
    },
    getDiskCloudSize(size, step) {
      // const remainder = size % step
      // const method = remainder >= 512 ? Math.ceil : Math.floor

      return (parseInt(`${size * 100 / step}`) / 100).toFixed(2)
    },
    getMinute(size) {
      const step = 60
      const remainder = Math.abs(size % step)
      let method

      if (size < 0) {
        method = remainder >= 30 ? Math.floor : Math.ceil
      } else {
        method = remainder >= 30 ? Math.ceil : Math.floor
      }
      return {
        unit: '分钟',
        formatSize: method(size / step)
      }
    },
    getStatus(item) {
      const result = {}

      switch (item.type) {
        case 'MESSAGE':
          result.status = item.remaining >= 3000 ? 'adequate' : (item.remaining < 1500 ? 'insufficient' : 'normal')
          result.total = {
            label: item.total,
            unit: '条'
          }
          result.use = {
            label: item.use,
            unit: '条'
          }
          result.remaining = {
            label: item.remaining,
            unit: '条'
          }
          break
        case 'CALL':
          result.status = this.getMinute(item.remaining).formatSize >= 500 ? 'adequate' : (this.getMinute(item.remaining).formatSize <= 200 ? 'insufficient' : 'normal')
          result.total = {
            label: this.getMinute(item.total).formatSize,
            unit: this.getMinute(this.total).unit
          }
          result.use = {
            label: this.getMinute(item.use).formatSize,
            unit: this.getMinute(this.use).unit
          }
          result.remaining = {
            label: this.getMinute(item.remaining).formatSize,
            unit: this.getMinute(this.remaining).unit
          }
          break
        case 'CLOUD_DISK':
          result.status = Math.floor(item.remaining / (1024 * 1024)) >= 2048 ? 'adequate' : (Math.floor(item.remaining / (1024 * 1024)) < 1024 ? 'insufficient' : 'normal')
          result.total = {
            label: this.getFlowUnit(item.total).formatSize,
            unit: this.getFlowUnit(item.total).unit
          }
          result.use = {
            label: this.getFlowUnit(item.use).formatSize,
            unit: this.getFlowUnit(item.use).unit
          }
          result.remaining = {
            label: this.getFlowUnit(item.remaining).formatSize,
            unit: this.getFlowUnit(item.remaining).unit
          }
          break
        case 'CUSTOMER_PORTRAYAL':
          result.status = item.remaining >= 500 ? 'adequate' : (item.remaining < 100 ? 'insufficient' : 'normal')
          result.total = {
            label: item.total,
            unit: '点'
          }
          result.use = {
            label: item.use,
            unit: '点'
          }
          result.remaining = {
            label: item.remaining,
            unit: '点'
          }
          break
        case 'MESSAGE_5G':
          result.status = item.remaining >= 500 ? 'adequate' : (item.remaining < 100 ? 'insufficient' : 'normal')
          result.total = {
            label: item.total,
            unit: '条'
          }
          result.use = {
            label: item.use,
            unit: '条'
          }
          result.remaining = {
            label: item.remaining,
            unit: '条'
          }
          break
        default :
          result.status = 'adequate'
          result.total = {
            label: 0,
            unit: 0
          }
          result.use = {
            label: 0,
            unit: 0
          }
          result.remaining = {
            label: 0,
            unit: 0
          }
      }

      return result
    }
  }
}
</script>

<style scoped lang="scss">
.payment-box{
  display: flex;
  justify-content: left;
  flex-wrap: wrap;
  min-height: calc(100vh - 128px);
  padding: 16px;
  .payment-body{
    position: relative;
    z-index: 2;
  }

  .payment-item{
    width: 312px;
    height: 378px;
    background: #FFFFFF;
    border: 1px solid #F5F5F5;
    overflow:hidden;
    box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.1);
    border-radius: 10px;
    position: relative;
    margin-bottom: 24px;
    margin-right: 44px;

    .payment-bg-icon{
      color: #F5F5F5;
      bottom: -10px;
      position: absolute;
      left: -20px;
      transform: rotate(-30deg);
      width: 200px;
      height: 200px;

      &.CALL{
        transform: rotate(0);
      }

      i{
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 200px;
        width: 100%;
        height: 100%;
        &:before{
          display: block;
        }
      }
    }

    &:first-child{
      margin-left: 0;
    }

    .payment-title{
      margin-top: 29px;
      font-size: 15px;
      line-height: 1;
      color: #555;
      display: flex;
      align-items: center;
      justify-content: center;

      i{
        font-size: 22px;
        display: block;
        color: #999;
      }
    }

    .payment-info {
      margin: 56px 0 30px;
      text-align: center;
      & > div{
        position: relative;
        display: inline-block;

        strong{
          position: absolute;
          top: -28px;
          right:-30px;
          background: rgba(0, 200, 69, .12);
          font-weight: 500;
          color: #00C845;
          font-size: 12px;
          text-align: center;
          line-height: 24px;
          width: 40px;
          height: 24px;
          border-radius: 12px 12px 12px 0;

          &.normal{
            background: rgba(0, 200, 69, .12);
            color: #00C845;
          }

          &.insufficient{
            background: rgba(222, 24, 24, .12);
            color: rgba(222, 24, 24, 1);
          }

          &.adequate{
            background: rgba(18, 113, 182, .12);
            color: rgba(18, 113, 182, 1);
          }

        }
      }

      p {
        font-size: 12px;
        color: #555;
        margin-top: 20px;
        line-height: 1;
        text-align: center;
      }
      .payment-number{
        font-size: 20px;
        color: #555;
        justify-content: center;
        font-weight: bold;
        text-align: center;
        display: flex;
        margin: 0 auto;
        line-height: .8;
        align-items: flex-end;

        span{
          font-size: 14px;
          display: block;
          color: #999;
          font-weight: 500;
        }
      }
    }
    .payment-other{
      display: flex;
      width: 248px;
      font-size: 12px;
      color: #666;
      margin: 0 auto;
      font-weight: 500;

      .payment-other-item{
        flex: 1;
        text-align: center;
        font-size: 12px;
        div{
          font-size: 16px;
          font-weight: bold;
          color: #555555;
        }

        span {
          font-size: 12px;
          font-weight: 500;
          color: #999;
        }
      }
    }

    ::v-deep{
      .el-button--small{
        width: 186px;
        display: block;
        font-size: 14px;
        height: 30px;
        line-height: 30px;
        padding: 0;
        border-radius: 4px;
        margin: 30px auto 30px;
      }

      .EtmText-wrap{
        font-size: 14px;
        text-align: center;
        margin: 0 auto;
        display: block;
      }
    }
  }
}

.main-body{
  height: 90%!important;
}

@media screen and (max-width:1500px){

  //.payment-box {
  //  background: #000;
  //}
}

</style>
