<template>
  <el-form
    class="recharge"
    label-width="80px"
  >
    <el-form-item label="充值组织:">
      {{ organization }}
    </el-form-item>
    <el-form-item label="剩余点数">
      <span style="margin-right: 16px;">{{ item.point }}</span> <etm-text @click="$emit('log')">
        查看充值记录
      </etm-text>
    </el-form-item>
    <el-form-item
      label="点数套餐:"
    >
      <choice @change="change" />
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

export default {
  name: 'Recharge',
  components: {
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
      }
    }
  },
  computed: {
    total () {
      return (this.choosePackage.amount).toFixed(2)
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
    pay () {
      const phonePackageId = this.choosePackage.id
      // const messagePackageId = this.messagePackage.id
      // const cloudPackageId = this.cloudPackage.id
      const totalAmount = this.choosePackage.amount

      let choicePackageInfo = {}
      const choicePackageArray = [this.choosePackage]
      choicePackageArray.forEach(cur => {
        if (cur.id) {
          choicePackageInfo = cur
        }
      })

      this.$emit('pay', { amount: totalAmount, id: [phonePackageId], choiceInfo: choicePackageInfo })
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
