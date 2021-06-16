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
        label="订金单号"
        width="190"
      >
        <template v-slot="{row}">
          <etm-text
            type="primary"
            @click="link(row)"
          >
            {{ row.orderNo }}
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
        <template
          v-slot="{row}"
        >
          <etm-text type="normal">
            {{ row.personPhone }}
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
import { createEarnest, updateRecord } from '@/api/newDaycare/collectionRecord'
import baseMixin from '@/layout/mixin/baseMixin'
import { parseTime } from '@/utils'
export default {
  name: 'Tabs',
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
          label: '订金单号',
          type: 'input',
          prop: 'orderNumber',
          value: '',
          props: {
            placeholder: '请输入订金单号'
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
        { label: '联系人姓名', prop: 'personName' },
        { label: '订金状态', prop: 'status' },
        { label: '订金金额（元）', prop: 'money' },
        { label: '支付方式', prop: 'paymentName' },
        { label: '关联单号', prop: 'oddNumbers' },
        { label: '收费日期', prop: 'dateCharge' },
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
    // console.log(this.collectionRecordId)
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
      createEarnest({ orderNumber, phone, childName }).then(res => {
        this.tableData = res.data
        this.tableData.forEach(v => {
          v.status = v.status === 'USED' ? '已使用' : '未使用'
          v.dateCharge = (v.dateCharge && parseTime(v.dateCharge, '{y}-{m}-{d}')) || null
        })
      })
    },
    link (row) {
      updateRecord({ collectionRecordId: this.collectionRecordId, orderId: row.earnestMoneyId, orderNumber: row.orderNo, payOrderType: 'DEPOSIT' }).then(() => {
        this.$message.success('操作成功')
        this.$emit('update', {})
      })
    }
  }
}
</script>
<style lang="scss" scoped>
</style>
