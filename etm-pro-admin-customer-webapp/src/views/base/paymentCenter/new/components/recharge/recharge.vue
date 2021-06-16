<template>
  <el-form
    class="recharge"
    label-width="80px"
  >
    <el-form-item label="充值组织:">
      {{ organization }}
    </el-form-item>
    <el-form-item
      v-if="item.type === 'CALL'"
      label="电话套餐:"
    >
      <choice @change="change" />
    </el-form-item>
    <el-form-item
      v-if="item.type === 'MESSAGE'"
      label="短信套餐:"
    >
      <msg-package @change="handleMsgChange" />
    </el-form-item>
    <el-form-item
      v-if="item.type === 'CLOUD_DISK'"
      label="云盘套餐:"
    >
      <cloud-package @change="handleCloud" />
    </el-form-item>
    <el-form-item label="合计金额:">
      <span
        v-if="total"
        class="amount"
      >{{ total }} 元 </span>
      <span class="protocol">如支付成功即表示您同意 <span @click="protocol">《增值服务及使用协议》</span></span>
    </el-form-item>
  </el-form>
</template>

<script>
import choice from './choice'
import MsgPackage from '@/views/base/paymentCenter/components/recharge/msgPackage'
import cloudPackage from '@/views/base/paymentCenter/components/recharge/cloudPackage'

export default {
  name: 'Recharge',
  components: {
    MsgPackage,
    cloudPackage,
    choice
  },
  props: {
    org: {
      type: String,
      default: ''
    },
    item: {
      type: Object,
      default () {
        return {}
      }
    }
  },
  data () {
    return {
      organization: this.org,
      choosePackage: {
        id: null,
        amount: 0,
        time: null
      },
      messagePackage: {
        id: '',
        amount: 0,
        time: ''
      },
      cloudPackage: {
        id: '',
        amount: 0,
        time: ''
      }
    }
  },
  computed: {
    total () {
      return (this.choosePackage.amount + this.messagePackage.amount + this.cloudPackage.amount).toFixed(2)
    }
  },
  methods: {
    protocol () {
      this.$emit('protocol')
    },
    change (val, type) {
      this.choosePackage.id = val.id
      this.choosePackage.amount = val.amount
      this.choosePackage.time = val.time
      this.pay()
    },
    handleMsgChange (value, type) {
      this.messagePackage = value
      this.pay()
    },
    handleCloud (value, type) {
      this.cloudPackage = value
      this.pay()
    },
    pay () {
      const phonePackageId = this.choosePackage.id
      const messagePackageId = this.messagePackage.id
      const cloudPackageId = this.cloudPackage.id
      const totalAmount = this.choosePackage.amount + this.messagePackage.amount + this.cloudPackage.amount

      let choicePackageInfo = {}
      const choicePackageArray = [this.choosePackage, this.messagePackage, this.cloudPackage]
      choicePackageArray.forEach(cur => {
        if (cur.id) {
          choicePackageInfo = cur
        }
      })

      this.$emit('pay', { amount: totalAmount, id: [phonePackageId, messagePackageId, cloudPackageId], choiceInfo: choicePackageInfo })
    }

  }
}
</script>

<style scoped lang="scss">
  .recharge {
    .amount {
      font-size: 18px;
      color: $color-error;
    }

    .protocol {
      font-size: 12px;
      color: $color-info;

      span {
        @include etm-color();
        cursor: pointer;
        font-size: 12px;
      }
    }
  }

</style>
