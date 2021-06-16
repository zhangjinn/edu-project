<template>
  <div class="deposit-wrap">
    <etm-form
      ref="form"
      type="dialog"
      :model="data"
    >
      <el-form-item label="订金单号">
        {{ data.orderNo }}
      </el-form-item>
      <el-form-item label="学员姓名">
        {{ data.childName }}
      </el-form-item>
      <el-form-item
        label="收费日期"
        prop="dateCharge"
        :rules="formValidate.nullValueRule(true, '请选择收费日期')"
      >
        <el-date-picker
          v-model="data.dateCharge"
          type="date"
          placeholder="年/月/日"
          @change="change"
        />
      </el-form-item>
      <el-form-item
        label="订金金额"
        prop="money"
        :require="true"
        :rules="formValidate.nullValueRule(true, '请输入订金金额')"
      >
        <el-input
          v-model="data.money"
          type="text"
          oninput="value=value.replace(/[^\d^\.]/g,'')"
          placeholder="100"
          @blur="change"
        />
      </el-form-item>
      <el-form-item
        label="支付方式"
        prop="paymentType"
        :rules="formValidate.nullValueRule(true, '请输入收费方式')"
      >
        <el-select
          placeholder="请选择支付方式"
          :value="data.paymentType"
          @change="change"
        >
          <el-option
            v-for="(item, index) in payType"
            :key="index"
            :label="item"
            :value="index"
          />
        </el-select>
      </el-form-item>

      <el-form-item label="备注">
        <el-input
          v-model="data.remark"
          type="textarea"
          :rows="4"
          @blur="change"
        />
      </el-form-item>
    </etm-form>
  </div>
</template>

<script>
/**
 * deposit create by Administrator
 * createTime 2020/9/1 15:55
 */

import formValidate from '@/utils/rules'

export default {
  name: 'Deposit',
  components: {},
  filters: {},
  mixins: [],
  model: {
    prop: 'data',
    event: 'evt'
  },
  props: {
    data: {
      type: Object,
      default () {
        return {}
      }
    }
  },
  data () {
    return {
      formValidate,
      payType: {
        WECHAT: '微信',
        ALIPAY: '支付宝',
        CASH: '现金',
        BAND_CARD: '银行卡',
        NOT_USED: 'pos机'
      }
    }
  },
  computed: {},
  watch: {},
  created () {
  },
  mounted () {
  },
  methods: {
    change () {
      // this.$refs.form.$children[0].validate(valid => {

      this.$emit('evt', this.data)
    },
    choice () {
      this.$emit('choice')
    }
  }
}
</script>
<style lang="scss" scoped>
</style>
