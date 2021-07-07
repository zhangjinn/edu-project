<template>
  <div class="formItem-wrap">
    <etm-form :model="formData" :rules="rule" type="dialog">
      <el-form-item label="支出类型" prop="outcomeStatementName">
        <el-select v-model="formData.outcomeStatementName" placeholder="请选择支出类型">
          <el-option v-for="(list, index) in typeList" :key="index" :value="list.statementTypeName" :label="list.statementTypeName" />
        </el-select>
      </el-form-item>
      <el-form-item label="支出金额" prop="amount">
        <el-input-number
          v-model="formData.amount"
          :min="0"
          placeholder="请输入支出金额"
        />
      </el-form-item>
      <el-form-item label="支付方式" prop="paymentType">
        <el-select v-model="formData.paymentType" placeholder="请选择支付方式">
          <el-option v-for="(list, index) in paymentTypeList" :key="index" :value="list.value" :label="list.label" />
        </el-select>
      </el-form-item>
      <el-form-item label="出账日期" prop="outcomeTime">
        <el-date-picker
          v-model="formData.outcomeTime"
          type="datetime"
          :default-value="defaultDate"
          placeholder="请选择出账日期"
        />
      </el-form-item>
      <el-form-item label="备注">
        <el-input v-model="formData.mark" type="textarea" placeholder="请输入备注内容" />
      </el-form-item>
    </etm-form>
  </div>

</template>

<script>
import { getStatementItemList } from '@/api/guardcare/financeManage/incomeCostSetting'

/**
 * form create by Administrator
 * createTime 2020/9/8 15:38
 */
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
        outcomeStatementName: [{ required: true, message: '支出类型不能为空', trigger: 'change' }],
        amount: [{ required: true, message: '支出金额不能为空', trigger: 'blur' }],
        paymentType: [{ required: true, message: '支付方式不能为空', trigger: 'change' }],
        outcomeTime: [{ required: true, message: '出账日期不能为空', trigger: 'change' }]
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
        type: 'OUTCOME'
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
