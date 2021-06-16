<template>
  <div class="child-deposit-wrap">
    <etm-form
      ref="etmForm"
      type="dialog"
      :model="deposit"
      :rules="rules"
    >
      <el-form-item label="学员姓名">
        <span>{{ childInfo.childName }}</span>
      </el-form-item>
      <el-form-item label="收费日期">
        <el-date-picker
          v-model="deposit.dateCharge"
          value-format="yyyy-MM-dd"
          placeholder="请选择收费日期"
        />
      </el-form-item>
      <el-form-item
        label="业务类型"
        prop="type"
      >
        <el-select v-model="deposit.type">
          <el-option
            value="CARE"
            label="托育园"
          />
          <el-option
            value="TODDLER"
            label="幼儿园"
          />
          <el-option
            value="TEACH"
            label="早教"
          />
        </el-select>
      </el-form-item>
      <el-form-item
        label="订金金额"
        prop="money"
      >
        <el-input v-model="deposit.money" />
      </el-form-item>
      <el-form-item
        label="支付方式"
        prop="paymentType"
      >
        <el-select v-model="deposit.paymentType">
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
          v-model="deposit.remark"
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

import { queryChildInfoForDisplay } from '@/api/newDaycare/childManage'
import { queryPaymentType } from '@/api/newDaycare/contract'
import baseMixin from '@/layout/mixin/baseMixin'

const validatorMoneny = (rule, value, cb) => {
  if (!value) {
    return cb(new Error('订金金额不能为空'))
  }
  if (!/^[0-9]\d*(\.\d+)?$/.test(value)) {
    return cb(new Error('订金金额不正确'))
  }

  if (value <= 0) {
    return cb(new Error('订金金额不正确'))
  }

  return cb()
}

export default {
  name: 'ChildDeposit',
  components: {},
  filters: {},
  mixins: [baseMixin],
  props: {
    childId: {
      type: [String, Number],
      required: true
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
          { required: true, message: '请输入订金金额', trigger: ['change', 'blur', 'input'] },
          { validator: validatorMoneny, trigger: ['change', 'blur', 'input'] }
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
      queryChildInfoForDisplay({ childId: this.childId }).then(res => {
        this.childInfo = res.data
      })
      queryPaymentType().then(res => {
        this.paymentTypes = this.convertDataToOptions(res.data, 'financePayTypeName', 'financePayTypeId')
      })
    },
    submit () {
      let data = null
      this.$refs.etmForm.$children[0].validate(valid => {
        if (valid) {
          data = this.deposit
        }
      })
      return data
    }
  }
}
</script>
<style lang="scss" scoped>
</style>
