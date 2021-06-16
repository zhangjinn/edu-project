<template>
  <div class="child-deposit-wrap">
    <etm-form
      ref="form"
      type="dialog"
      :model="depositData"
      :rules="rules"
    >
      <el-form-item label="学员姓名">
        <span>{{ depositData.childName }}</span>
      </el-form-item>
      <el-form-item label="收费日期">
        <el-date-picker
          v-model="depositData.dateCharge"
          value-format="yyyy-MM-dd"
          placeholder="请选择收费日期"
        />
      </el-form-item>
      <el-form-item
        label="订金金额"
        prop="money"
      >
        <el-input-number
          v-model="depositData.money"
          :min="0"
          placeholder="请输入订金金额"
        />
      </el-form-item>
      <el-form-item
        label="支付方式"
        prop="paymentType"
      >
        <el-select v-model="depositData.paymentType">
          <el-option
            v-for="(item, index) of paymentTypes"
            :key="index"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="备注">
        <el-input
          v-model="depositData.remark"
          :maxlength="200"
          type="textarea"
          :rows="4"
        />
      </el-form-item>
    </etm-form>
  </div>
</template>

<script>/**
 * deposit create by haijinsha
 * createTime 2020/9/8 16:54
 */

import { queryPaymentType } from '@/api/newDaycare/contract'
import baseMixin from '@/layout/mixin/baseMixin'

export default {
  name: 'ChildDeposit',
  components: {},
  filters: {},
  mixins: [baseMixin],
  props: {
    depositData: {
      type: Object,
      default () {
        return {}
      }
    }
  },
  data () {
    return {
      deposit: {
        money: '',
        dateCharge: new Date(),
        paymentType: '',
        remark: ''
      },
      rules: {
        money: [
          { required: true, message: '请输入订金金额', trigger: 'blur' }
        ],
        paymentType: { required: true, message: '请选择支付方式', trigger: 'change' },
        type: { required: true, message: '请选择业务类型', trigger: 'change' }
      },
      childInfo: {
        name: ''
      },
      paymentTypes: []
    }
  },
  computed: {},
  watch: {},
  created () {
  },
  mounted () {
    this.init()
  },
  methods: {
    init () {
      queryPaymentType().then(res => {
        this.paymentTypes = this.convertDataToOptions(res.data, 'financePayTypeName', 'financePayTypeId')
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.child-deposit-wrap {
  .el-input-number {
    ::v-deep .el-input__inner {
      padding: 0 10px;
      text-align: left;
    }

    ::v-deep .el-input-number__decrease {
      display: none;
    }

    ::v-deep .el-input-number__increase {
      display: none;
    }
  }
}
</style>
