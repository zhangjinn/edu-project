<template>
  <div class="index-wrap">
    <etm-main-body>
      <etm-layout-split>
        <div class="container">
          <div v-if="payState === 'unSign'" class="alertBox">
            <el-alert type="warning" :closable="false">
              <div class="inner">
                <span class="iconfont iconjinggao" />
                <span>如果您未进行支付账号设置，家长缴费将会支付到广州六米网络科技有限公司</span>
              </div>
            </el-alert>
          </div>
          <div class="contentBox">
            <div class="contentLeft">
              <div v-if="payType === 'EFPS'" class="epl_logo">
                <img src="../../../assets/images/base/epl_logo.png">
              </div>
              <div v-if="payType === 'CAIBAOPAY'" class="cb_logo">
                <img src="../../../assets/images/base/cb_logo.png">
              </div>
              <div class="text">
                面向多种场景：零售支付服务、便民支
                付服务、金融支付产品、网付产品、人
                民币跨境结算，并支持分账等功能
              </div>
              <div class="btnBox">
                <el-button v-if="payState === 'unSign'" size="medium" class="btn" type="primary" @click="toSetting">选择使用</el-button>
                <el-button v-else-if="payState === 'signed'" class="btn" type="primary" @click="toSetting">查看进件信息</el-button>
              </div>
            </div>
            <div class="contentRight">
              <div class="img">
                <img src="../../../assets/images/base/paymentBg.png">
              </div>
            </div>
          </div>
        </div>
      </etm-layout-split>
    </etm-main-body>
  </div>

</template>

<script>/**
 * index create by Administrator
 * createTime 2020/12/23 18:26
 */

import { queryPaymentMerchantInfo, queryPaymentSetting } from '@/api/base/accountManage'

export default {
  name: 'Index',
  components: {},
  filters: {},
  mixins: [],
  props: {},
  data() {
    return {
      payState: '',
      payType: ''
    }
  },
  computed: {},
  watch: {},
  created() {
  },
  mounted() {
    this.getData()
  },
  methods: {
    getData() {
      queryPaymentSetting().then(res => {
        const { data } = res
        this.payType = data.merchantType
      })
      queryPaymentMerchantInfo().then(res => {
        const { data } = res
        if (data.state === 'INIT') {
          this.payState = 'unSign'
        } else {
          this.payState = 'signed'
        }
      })
    },
    toSetting() {
      if (this.payType === 'EFPS') {
        this.$router.push({
          path: '/accountSetting/merchant'
        })
      } else {
        this.$router.push({
          path: '/accountSetting/caibaoMerchant'
        })
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.index-wrap {

  .container {
    margin: 0 auto;
    padding: 80px 0 120px;
    width: 820px;

    .alertBox {
      ::v-deep .el-alert--warning {
        .el-alert__description {
          color: #E6A23C;
        }
      }

      .inner {
        display: flex;
        align-items: center;

        .iconfont {
          height: 27px;
          line-height: 27px;
        }
      }
    }

    .contentBox {
      display: flex;
      margin-top: 150px;

      img {
        width: 100%;
      }

      .contentLeft {
        width: 326px;

        .epl_logo {
          width: 184px;
        }

        .cb_logo {
          width: 289px;
        }

        .text {
          margin-top: 108px;
          width: 240px;
          @include c_title_color();
        }

        .btnBox {
          margin-top: 70px;

          .btn {
            width: 175px;
            height: 40px;
          }
        }
      }

      .contentRight {
        padding-top: 15px;

        .img {
          width: 438px;
        }
      }
    }
  }
}
</style>
