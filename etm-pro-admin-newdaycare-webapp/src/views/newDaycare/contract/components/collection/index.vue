<template>
  <div class="collection-wrap">
    <etm-pop
      :pop="popSize"
      title="收款"
      :visible="isShow"
      :show-confirm-btn="false"
      :show-cancel-btn="false"
      @close="close"
    >
      <div
        class="collection-box"
        :class="{single : type === 'collection'}"
      >
        <div
          class="collection-left"
        >
          <div v-if="type === 'collection'">
            <div
              class="money"
            >
              <div class="money-icon">
                <el-image
                  :src="require('@/assets/images/money.png')"
                  style=" height: 24px;
  width: 24px;"
                />
              </div> {{ props['isColl'] ? '合同' : '订金' }}待收款 <etm-text>{{ props.money }}</etm-text> 元
            </div>

            <div class="collection-code">
              <p>付款码收款</p>
              <span>请用扫码器扫描客户的付款码</span>
              <el-input
                v-model="barCode"
                v-focus="isShow"
                placeholder="请输入付款码"
                @keyup.enter.native="barCodeEvent"
              />
            </div>
          </div>
          <div v-else>
            <el-image :src="require('@/assets/collection.png')" />
            <p class="sign-success">
              签约成功
            </p>
            <div class="print">
              <el-button
                type="primary"
                @click="printContract"
              >
                打印合同
              </el-button>
              <p>合同待收款 <etm-text>{{ props.money }}</etm-text> 元</p>
            </div>
          </div>
        </div>
        <div class="collection-right">
          <div
            v-if="type !== 'collection'"
            class="collection-code"
          >
            <p>付款码收款</p>
            <span>请用扫码器扫描客户的付款码</span>
            <el-input
              v-model="barCode"
              v-focus="isShow"
              placeholder="请输入付款码"
              @keyup.enter.native="barCodeEvent"
            />
          </div>
          <div class="collection-code">
            <p>收款码付款</p>
            <span>客户扫一扫二维码进行支付</span>
            <div class="qrcode">
              <!--              <el-image-->
              <!--                :src="qrcode.payPageUrl"-->
              <!--                style=" height: 119px;-->
              <!--  width: 119px;"-->
              <!--              />-->
              <vue-qr
                :text="qrcode.payPageUrl"
                :size="360"
                :margin="20"
                :callback="qrcodeCallBack"
              />
            </div>
            <el-button
              plain
              type="small"
              @click="downloadQrcode"
            >
              <i class="iconfont icondayin" /> 下载收款二维码
            </el-button>
          </div>
        </div>
      </div>
    </etm-pop>
  </div>
</template>

<script>
import { print } from '@/components/print/print'
import VueQr from 'vue-qr'
import {
  qrcodePay,
  createBarCode,
  queryPolling
} from '@/api/newDaycare/contract'
let polling
export default {
  name: 'Collection',
  components: {
    VueQr
  },
  directives: {
    focus: {
      update (el, binding) {
        if (binding.value) {
          el.querySelector('input').focus()
        }
      }
    }
  },
  props: {
    props: {
      type: Object,
      default () {
        return {
          money: '0.00'
        }
      }
    },
    type: {
      type: String,
      default: ''
    }
  },
  data: function () {
    return {
      barCode: '',
      isShow: false,
      base64: '',
      qrcode: {
        payPageUrl: ''
      }
    }
  },
  computed: {
    popSize () {
      return this.type === 'collection' ? 'complex' : 'big'
    }
  },
  watch: {
    isShow: {
      handler (n) {
        if (n) {
          this.init()
        } else {
          this.barCode = ''
        }
      }
    }
  },
  methods: {
    barCodeEvent (e) {
      const value = e.target.value
      if (value) {
        createBarCode({
          contractId: this.props.id,
          payOrderType: this.props.type,
          barCode: value
        }).then(res => {

        })
      }
    },
    qrcodeCallBack (e) {
      this.base64 = e
    },
    printContract () {
      const link = this.$router.resolve({
        path: '/print',
        query: {
          type: this.props.type === 'CARE_ORDER' ? 'care' : 'teach',
          props: { prop: { id: this.props.id } }
        }
      })
      print(link)
    },
    downloadQrcode () {
      if (this.qrcode.payPageUrl) {
        const link = document.createElement('a')
        link.href = this.base64
        link.download = '支付二维码.jpg'
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
      }
    },
    init () {
      qrcodePay({
        contractId: this.props.id,
        payOrderType: this.props.type
      }).then(res => {
        this.qrcode = res.data
      })

      this.pollingEvent()
    },
    // 轮询支付结果
    pollingEvent () {
      if (this.isShow) {
        setTimeout(() => {
          queryPolling({
            contractId: this.props.id,
            payOrderType: this.props.type
          }).then(res => {
            if (!res.data) {
              this.pollingEvent()
            } else {
              this.close()
              this.$message.success('收款成功')
              this.$emit('success')
            }
          }).catch(() => {
            this.pollingEvent()
          })
        }, 1000)
      }
    },
    confirm () {
      this.close()
    },
    show () {
      this.isShow = true
    },
    close () {
      clearInterval(polling)
      polling = ''
      this.isShow = false
    }
  }
}
</script>

<style scoped lang="scss">
.collection-box {
  align-items: center;
  display: flex;
  height: 400px;

  &.single {
    height: 370px;

    .collection-right {
      margin-left: 100px;
    }

    .collection-left {
      align-items: flex-start;
      height: 100%;
      justify-content: flex-start;
      text-align: left;
      width: 260px;

      .collection-code {
        width: 260px;
      }

      .money {
        align-items: center;
        display: flex;
        margin-bottom: 32px;

        .money-icon {
          display: inline-block;
          height: 24px;
          margin-right: 8px;
          width: 24px;
        }
      }
    }
  }

  .collection-left,
  .collection-right {
    align-items: center;
    display: flex;
    flex: 1;
    flex-direction: column;
    justify-content: center;
  }

  .collection-code {
    margin-bottom: 32px;
    width: 300px;

    &:last-child {
      margin-bottom: 0;
    }

    .qrcode {
      border: 1px solid #555;
      height: 120px;
      margin-bottom: 16px;
      width: 120px;

      img {
        width: 100%;
      }
    }

    p {
      color: #222;
      font-size: 14px;
      line-height: 18px;
      margin-bottom: 8px;
    }

    span {
      color: #999;
      display: block;
      font-size: 14px;
      line-height: 18px;
      margin-bottom: 16px;
    }
  }

  .collection-left {
    text-align: center;

    //.sign-success {
    //  color: #222;
    //  font-size: 16px;
    //  margin-bottom: 40px;
    //}

    ::v-deep {
      .EtmText-wrap {
        margin-right: 0;
      }
    }

    .print {
      p {
        color: #999;
        font-size: 14px;
        margin-top: 13px;
      }
    }
  }

  .collection-right {
    .money {
      margin-bottom: 16px;
      width: 300px;

      ::v-deep {
        .EtmText-wrap {
          margin-right: 0;
        }
      }
    }

  }
}
</style>
