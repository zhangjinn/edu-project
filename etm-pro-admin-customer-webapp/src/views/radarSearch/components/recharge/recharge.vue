<template>
  <div class="recharge-wrap">
    <etm-pop
      :visible="showPopRecharge"
      pop="complex"
      title="充值"
      confirm-btn="支付"
      cancel-btn="取消"
      append-to-body
      @close="handleCancel"
      @cancel="handleCancel"
      @confirm="popConfirm"
    >
      <div class="popContent">
        <el-form
          ref="form"
          class="recharge"
          type="dialog"
        >
          <el-form-item label="充值组织">
            {{ organization }}
          </el-form-item>
          <el-form-item label="充值数量">
            <choice
              v-if="showPopRecharge"
              @change="change"
            />
          </el-form-item>
          <el-form-item label="合计金额">
            <div>
              <span
                v-if="total"
                class="amount"
              >{{ total }} 元 </span>
              <div class="protocol">
                如支付成功即表示您同意 <span @click="protocol">《增值服务及使用协议》</span>
              </div>
            </div>
          </el-form-item>
        </el-form>
      </div>
    </etm-pop>

    <etm-pop
      :visible="showPopProtocol"
      pop="complex"
      title="增值服务及使用协议"
      append-to-body
      @close="showPopProtocol = false"
      @cancel="showPopProtocol = false"
      @confirm="showPopProtocol = false"
    >
      <div class="popContent">
        <service-agreement v-if="showPopProtocol" />
      </div>
    </etm-pop>

    <etm-pop
      :visible="showPopPay"
      class="payPop"
      title="支付"
      @close="showPopPay = false"
      @cancel="showPopPay = false"
      @confirm="popPayConfirm"
    >
      <div class="popContent">
        <pay
          v-if="showPopPay"
          :choose-package="choosePackage"
        />
      </div>
    </etm-pop>
  </div>
</template>

<script>
import choice from './choice'
import serviceAgreement from '@/views/base/paymentCenter/serviceAgreement'
import pay from './pay'

export default {
  name: 'Recharge',
  components: {
    choice,
    serviceAgreement,
    pay
  },
  props: {
    showPopRecharge: {
      type: Boolean,
      default: false
    },
    type: {
      type: String,
      default: 'OUTER',
      validator (val) {
        return ['OUTER', 'AI'].includes(val)
      }
    }
  },
  data () {
    return {
      organizationId: JSON.parse(localStorage.getItem('currentOrganizationId')),
      organization: '',
      showPopProtocol: false,
      showPopPay: false,
      choosePackage: {
        id: null,
        amount: 0
      }

    }
  },
  computed: {
    total () {
      return this.choosePackage.amount
    }
  },
  watch: {
    organizationId: {
      handler (newName, oldName) {
        const orgList = JSON.parse(localStorage.getItem('organizations'))
        orgList.forEach((val) => {
          if (val.organizationId === this.organizationId) {
            this.organization = val.organizationName
          }
        })
      },
      immediate: true,
      deep: true
    }
  },

  methods: {
    reset () {
      this.choosePackage.id = null
      this.choosePackage.amount = 0
    },

    protocol () {
      this.showPopProtocol = true
    },

    change (val, type) {
      console.log(val)
      this.choosePackage.id = val.id
      this.choosePackage.amount = val.currentPrice
    },

    handleCancel () {
      this.$emit('update:showPopRecharge', false)
      this.reset()
    },

    popConfirm () {
      this.showPopPay = true
    },

    popPayConfirm () {
      this.showPopPay = false
      this.$emit('update:showPopRecharge', false)
      this.reset()
    }

  }
}
</script>

<style scoped lang="scss">
  .recharge {
    .amount {
      font-size: 18px;
      @include etm-color();
    }

    .protocol {
      font-size: 12px;
      color: $color-info;

      span {
        @include etm-color();
        cursor: pointer;
      }
    }
  }

</style>
