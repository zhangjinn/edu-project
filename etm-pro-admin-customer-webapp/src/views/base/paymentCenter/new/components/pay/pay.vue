<template>
  <el-form
    class="pay"
    label-width="80px"
  >
    <el-form-item label="支付金额:">
      <span class="amount">{{ choosePackage.amount }}元</span>
    </el-form-item>
    <!-- <el-form-item label="支付方式:">
      <choice-pay @change="change" />
    </el-form-item>-->
    <el-form-item label="二维码:">
      <div class="qrCode">
        <vue-qr
          v-if="qrUrl"
          :text="qrUrl"
          :logo-src="orgLogo"
          :margin="0"
        />
      </div>
    </el-form-item>
  </el-form>
</template>

<script>
import VueQr from 'vue-qr'
// import choicePay from './choicePay'
import { postRechargePay } from '@/api/base/paymentCenter'

export default {
  name: 'Pay',
  components: {
    // choicePay,
    VueQr
  },
  props: {
    choosePackage: {
      type: Object,
      default () {
        return {}
      }
    },
    orderId: {
      type: Number,
      default: 0
    }
  },
  data () {
    return {
      qrUrl: '',
      orgLogo: ''
    }
  },
  created () {
    this.postRechargePayData()
  },
  methods: {
    postRechargePayData () {
      const param = {
        packageIds: [...this.choosePackage.id]
      }
      postRechargePay(param).then((res) => {
        const { data } = res
        this.qrUrl = data.payPageUrl
        this.$emit('update:orderId', data.orderId)
      })
    },
    getOrgLogo () {
      const organizations = JSON.parse(localStorage.getItem('organizations'))
      const organizationId = parseInt(localStorage.getItem('currentOrganizationId'))
      organizations.forEach(item => {
        if (item.organizationId === organizationId) {
          this.orgLogo = item.organizationLogo
        }
      })
    }
  }
}
</script>

<style scoped lang="scss">
  .pay {
    .amount {
      font-size: 14px;
      color: $color-error;
    }

    .qrCode {
      width: 122px;
      height: 122px;
      overflow: hidden;
      border: 1px solid #E0E0E0;
      padding: 6px;

      img {
        width: 100%;
        height: 100%;
      }
    }
  }
</style>
