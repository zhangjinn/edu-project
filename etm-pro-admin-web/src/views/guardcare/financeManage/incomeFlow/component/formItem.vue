<template>
  <div class="formItem-wrap">
    <etm-form :model="formData" :rules="rule" type="dialog">
      <el-form-item label="收入项目" prop="incomeStatementName">
        <el-select v-model="formData.incomeStatementName" placeholder="请选择收入项目">
          <el-option v-for="(list, index) in typeList" :key="index" :value="list.statementTypeName" :label="list.statementTypeName" />
        </el-select>
      </el-form-item>
      <el-form-item label="收入金额" prop="amount">
        <el-input-number
          v-model="formData.amount"
          :min="0"
          placeholder="请输入收入金额"
        />
      </el-form-item>
      <el-form-item label="支付方式" prop="paymentType">
        <el-select v-model="formData.paymentType" placeholder="请选择支付方式">
          <el-option v-for="(list, index) in paymentTypeList" :key="index" :value="list.value" :label="list.label" />
        </el-select>
      </el-form-item>
      <el-form-item label="到账日期" prop="incomeTime">
        <el-date-picker
          v-model="formData.incomeTime"
          :default-value="defaultDate"
          type="date"
          placeholder="请选择到账日期"
        />
      </el-form-item>
      <el-form-item label="备注">
        <el-input v-model="formData.mark" type="textarea" placeholder="请输入备注内容" />
      </el-form-item>
    </etm-form>
  </div>

</template>

<script>/**
 * form create by Administrator
 * createTime 2020/9/8 15:38
 */

import { getStatementItemList } from '@/api/guardcare/financeManage/incomeCostSetting'

export default {
  name: 'FormItem',
  components: {},
  filters: {},
  mixins: [],
  props: {
    formData: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  data() {
    return {
      defaultDate: new Date(),
      rule: {
        incomeStatementName: [{ required: true, message: '收入项目不能为空', trigger: 'change' }],
        amount: [{ required: true, message: '收入金额不能为空', trigger: 'blur' }],
        paymentType: [{ required: true, message: '支付方式不能为空', trigger: 'change' }],
        incomeTime: [{ required: true, message: '到账日期不能为空', trigger: 'change' }]
      },
      typeList: [],
      paymentTypeList: [ // WECHAT :微信 ALIPAY :支付宝 CASH :现金 ONLINE_BANKING :网银
        {
          label: '微信',
          value: 'WECHAT'
        },
        {
          label: '支付宝',
          value: 'ALIPAY'
        },
        {
          label: '现金',
          value: 'CASH'
        },
        {
          label: '网银',
          value: 'ONLINE_BANKING'
        }
      ]
    }
  },
  computed: {},
  watch: {},
  created() {
  },
  mounted() {
    this.getType()
  },
  methods: {
    getType() {
      const param = {
        type: 'INCOME'
      }
      getStatementItemList(param).then(res => {
        this.typeList = res.data
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.formItem-wrap {
  .el-input-number{
    ::v-deep input {
      padding: 0 10px;
      text-align: left;
    }
    ::v-deep .el-input-number__increase {
      display: none;
    }

    ::v-deep .el-input-number__decrease {
      display: none;
    }
  }
}
</style>
