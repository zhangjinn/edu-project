<template>
  <div class="tabs-wrap">
    <etm-tool-bar
      v-model="formData"
      @search="handleSearch"
    />
    <etm-table
      :columns="columns"
      :data="tableData"
      index
    >
      <el-table-column
        slot="left"
        fixed="left"
        label="合同单号"
        width="190"
      >
        <template v-slot="{row}">
          <etm-text
            type="primary"
            @click="link(row)"
          >
            {{ row.contractNo }}
          </etm-text>
        </template>
      </el-table-column>
      <el-table-column
        slot="left"
        fixed="left"
        label="学员姓名"
      >
        <template v-slot="{row}">
          <etm-text type="normal">
            {{ row.childName }}
          </etm-text>
        </template>
      </el-table-column>
      <el-table-column
        slot="left"
        fixed="left"
        label="联系人手机号"
        width="150"
      >
        <template v-slot="{row}">
          <etm-text type="normal">
            {{ row.contactPhoneNumber }}
          </etm-text>
        </template>
      </el-table-column>
    </etm-table>
  </div>
</template>

<script>
/**
 * tabs create by Administrator
 * createTime 2021/3/10/010 10:02
 */
// import { createContract, updateRecord } from '@/api/newDaycare/collectionRecord'
import { createContract, updateRecord } from '@/api/newDaycare/collectionRecord'
// import { parseTime } from '@/utils'
import baseMixin from '@/layout/mixin/baseMixin'
import { parseTime } from '@/utils'
export default {
  name: 'TeachCare',
  components: {},
  filters: {},
  mixins: [baseMixin],
  props: {
    collectionRecordId: {
      type: Number,
      default: null
    }
  },
  data () {
    return {
      formData: [
        {
          label: '合同单号',
          type: 'input',
          prop: 'orderNumber',
          value: '',
          props: {
            placeholder: '请输入合同单号'
          }
        },
        {
          label: '学员姓名',
          type: 'input',
          prop: 'childName',
          value: '',
          props: {
            placeholder: '请输入学员姓名'
          }
        },
        {
          label: '联系人手机号',
          type: 'input',
          prop: 'phone',
          value: '',
          props: {
            placeholder: '请输入联系人手机号'
          }
        }
      ],
      columns: [
        { label: '联系人姓名', prop: 'contactPhoneName' },
        { label: '合同状态', prop: 'contractStatusEnum' },
        { label: '合同类型', prop: 'contractType' },
        { label: '购买项目', prop: 'purchaseItemNames' },
        { label: '应收金额（元）', prop: 'receivable' },
        { label: '实收金额（元）', prop: 'paid' },
        { label: '实退金额（元）', prop: 'refund' },
        { label: '支付方式', prop: 'paymentName' },
        { label: '业绩所属人', prop: 'mainPerformanceName' },
        { label: '业绩次所属人', prop: 'secondaryPerformanceName' },
        { label: '签约日期', prop: 'date' },
        { label: '有效期', prop: 'endTime' },
        { label: '审核人', prop: 'toExamineName' },
        { label: '审核时间', prop: 'toExamineDate' },
        { label: '经办人', prop: 'currentEmployeeName' },
        { label: '经办时间', prop: 'createDateTime' }
      ],
      tableData: []
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
    handleSearch () {
      this.init()
    },
    init () {
      const orderNumber = this.getObjectByProp('orderNumber', this.formData).value || null
      const phone = this.getObjectByProp('phone', this.formData).value || null
      const childName = this.getObjectByProp('childName', this.formData).value || null
      createContract({ orderNumber, phone, childName }).then(res => {
        this.tableData = res.data
        const statusEnum = {
          UNDER_REVIEW: '待审核',
          NORMAL: '正常',
          AUDIT_FAILED: '审核未通过',
          REFUND: '退费',
          TO_VOID: '作废',
          BE_OVERDUE: '过期'
        }
        const contractType = {
          NEW_SIGNING: '新签约',
          TRANSFER_COURSE: '转课',
          RENEWAL: '续约'
        }
        this.tableData.forEach(v => {
          v.endTime = ((v.validBeginTime && v.validEndTime) && (parseTime(v.validBeginTime, '{y}-{m}-{d}') + ' 至 ' + parseTime(v.validEndTime, '{y}-{m}-{d}'))) || null
          v.createDateTime = (v.createDateTime && parseTime(v.createDateTime, '{y}-{m}-{d}')) || null
          v.toExamineDate = (v.toExamineDate && parseTime(v.toExamineDate, '{y}-{m}-{d}')) || null
          v.date = (v.date && parseTime(v.date, '{y}-{m}-{d}')) || null
          v.contractStatusEnum = statusEnum[v.contractStatusEnum]
          v.contractType = contractType[v.contractType]
        })
      })
    },
    link (row) {
      updateRecord({ collectionRecordId: this.collectionRecordId, orderId: row.tcContractId, orderNumber: row.contractNo, payOrderType: 'TEACH_ORDER' }).then(() => {
        this.$message.success('操作成功')
        this.$emit('update', {})
      })
    }
  }
}
</script>
<style lang="scss" scoped>
</style>
