<template>
  <div class="rule-wrap">
    <div class="btnBox">
      <el-button
        type="primary"
        @click="add"
      >
        <span class="iconfont iconplus" />添加收费科目
      </el-button>
    </div>
    <etm-table
      :data="tableData"
      :columns="column"
    >
      <el-table-column
        slot="right"
        label="结算规则"
        width="360"
      >
        <template slot-scope="scoped">
          <span v-html="scoped.row.ruleContent" />
        </template>
      </el-table-column>
      <el-table-column
        slot="right"
        label="使用状态"
        min-width="120"
      >
        <template slot-scope="scoped">
          <el-switch
            v-model="scoped.row.enable"
            @change="switchChange(scoped.row)"
          />
        </template>
      </el-table-column>
      <el-table-column
        slot="right"
        label="操作"
        min-width="120"
      >
        <template slot-scope="scoped">
          <etm-text
            v-if="!scoped.row.enable"
            type="primary"
            @click="edit(scoped.row)"
          >
            编辑
          </etm-text>
          <etm-text
            v-if="!scoped.row.enable"
            type="danger"
            @click="remove(scoped.row)"
          >
            删除
          </etm-text>
          <span v-if="scoped.row.enable">--</span>
        </template>
      </el-table-column>
    </etm-table>
    <etm-pop
      v-if="showPop"
      :visible="showPop"
      pop="big"
      title="添加收费科目"
      confirm-btn="确定"
      cancel-btn="取消"
      @close="popClose"
      @confirm="popConfirm"
      @cancel="popClose"
    >
      <form-item
        ref="popForm"
        :form-data="formData"
      />
    </etm-pop>
    <etm-drawer
      :visible.sync="showDrawer"
      type="big"
    >
      <etm-layout-split>
        <etm-title
          title="编辑收费科目"
          :show-line="false"
          border
          size="big"
        >
          <template slot="tool">
            <el-button
              plain
              size="mini"
              @click="closeDrawer"
            >
              取消
            </el-button>
            <el-button
              type="primary"
              size="mini"
              @click="confirmDrawer"
            >
              保存
            </el-button>
          </template>
        </etm-title>
        <form-item
          ref="drawerForm"
          :form-data="formData"
        />
      </etm-layout-split>
    </etm-drawer>
  </div>
</template>

<script>/**
 * rule create by Administrator
 * createTime 2020/9/8 18:53
 */

import formItem from './formItem'
import {
  createGuardPrice,
  queryGuardPriceById,
  queryGuardPriceList,
  removeGuardPrice,
  updateGuardPrice, updateGuardPriceEnable
} from '@/api/newDaycare/priceGuard'

export default {
  name: 'Rule',
  components: {
    formItem
  },
  filters: {},
  mixins: [],
  props: {},
  data () {
    return {
      tableData: [],
      column: [
        {
          label: '收费科目',
          prop: 'materialPriceName'
        },
        {
          label: '科目性质',
          prop: 'property'
        },
        {
          label: '规则名称',
          prop: 'ruleName'
        },
        {
          label: '结算类型',
          prop: 'ruleType'
        }
      ],
      showPop: false,
      formData: {},
      showDrawer: false,
      ruleData: {}
    }
  },
  computed: {},
  watch: {},
  created () {
  },
  mounted () {
    this.getData()
  },
  methods: {
    getData () {
      const param = {
        paged: false
      }
      queryGuardPriceList(param).then(res => {
        const data = res.data
        data.forEach(item => {
          item.property = item.property === 'once' ? '一次性' : '周期性'
          item.ruleType = item.ruleType === 'ATTENDANCE' ? '按出勤' : item.ruleType === 'ABSENCE' ? '按缺勤' : item.ruleType
        })
        this.tableData = data
      })
    },
    switchChange (row) {
      const param = {
        materialPriceId: row.materialPriceId,
        enable: row.enable
      }
      updateGuardPriceEnable(param).then(() => {
        this.getData()
      })
    },
    add () {
      this.formData = {
        property: 'once',
        ruleType: 'ATTENDANCE',
        attendanceRuleList: [
          {
            comparisonOperator: '',
            days: undefined,
            settlementOperation: '',
            percentage: undefined
          }
        ],
        absenceRuleList: [
          {
            comparisonOperator: '',
            days: undefined,
            settlementOperation: '',
            price: undefined
          }
        ]
      }
      this.showPop = true
    },
    popClose () {
      this.showPop = false
    },
    popConfirm () {
      this.$refs.popForm.$refs.form.$children[0].validate(valid => {
        if (valid) {
          const param = {
            materialPriceName: this.formData.materialPriceName,
            property: this.formData.property,
            enable: false
          }
          if (this.formData.property === 'cycle') {
            param.attendanceSettlementRule = {
              ruleName: this.formData.ruleName,
              type: this.formData.ruleType
            }
            if (this.formData.ruleType === 'ABSENCE') { // 选择按缺勤天数
              param.attendanceSettlementRule.absenceRuleList = this.formData.absenceRuleList
            } else { // 选择按出勤天数
              param.attendanceSettlementRule.attendanceRuleList = this.formData.attendanceRuleList
            }
          }
          createGuardPrice(param).then(() => {
            this.$message.success('收费科目添加成功')
            this.showPop = false
            this.getData()
          })
        }
      })
    },
    edit (row) {
      this.ruleData = row
      this.getDetail()
    },
    getDetail () {
      queryGuardPriceById({ materialPriceId: this.ruleData.materialPriceId }).then(res => {
        const data = res.data
        const formData = {
          materialPriceId: data.materialPriceId,
          materialPriceName: data.materialPriceName,
          property: data.property
        }
        if (data.property === 'cycle') {
          formData.ruleName = data.attendanceSettlementRule.ruleName
          formData.ruleType = data.attendanceSettlementRule.type
          formData.absenceRuleList = data.attendanceSettlementRule.absenceRuleList
          formData.attendanceRuleList = data.attendanceSettlementRule.attendanceRuleList
          if (data.attendanceSettlementRule.type === 'ATTENDANCE') {
            formData.absenceRuleList = [{
              comparisonOperator: '',
              days: undefined,
              settlementOperation: '',
              price: undefined
            }]
          } else {
            formData.attendanceRuleList = [{
              comparisonOperator: '',
              days: undefined,
              settlementOperation: '',
              percentage: undefined
            }]
          }
        } else {
          formData.ruleType = 'ATTENDANCE'
          formData.attendanceRuleList = [
            {
              comparisonOperator: '',
              days: undefined,
              settlementOperation: '',
              percentage: undefined
            }
          ]
          formData.absenceRuleList = [
            {
              comparisonOperator: '',
              days: undefined,
              settlementOperation: '',
              price: undefined
            }
          ]
        }
        this.formData = formData
        this.showDrawer = true
      })
    },
    closeDrawer () {
      this.showDrawer = false
    },
    confirmDrawer () { // 编辑规则进行保存
      this.$refs.drawerForm.$refs.form.$children[0].validate(valid => {
        if (valid) {
          const param = {
            materialPriceId: this.formData.materialPriceId,
            materialPriceName: this.formData.materialPriceName,
            property: this.formData.property,
            enable: false
          }
          if (this.formData.property === 'cycle') {
            param.attendanceSettlementRule = {
              ruleName: this.formData.ruleName,
              type: this.formData.ruleType
            }
            if (this.formData.ruleType === 'ABSENCE') { // 选择按缺勤天数
              param.attendanceSettlementRule.absenceRuleList = this.formData.absenceRuleList
            } else { // 选择按出勤天数
              param.attendanceSettlementRule.attendanceRuleList = this.formData.attendanceRuleList
            }
          }
          updateGuardPrice(param).then(() => {
            this.$message.success('收费项目修改成功')
            this.showDrawer = false
            this.getData()
          })
        }
      })
    },
    remove (row) { // 删除规则
      this.$etmTip.init({
        type: 'error',
        title: '确认删除？',
        content: '删除后将无法撤销，是否继续操作？',
        confirmBtn: '确定',
        cancelBtn: '取消',
        confirm: () => {
          removeGuardPrice({ materialPriceId: row.materialPriceId }).then(() => {
            this.$message.success('删除成功')
            this.$etmTip.close()
            this.getData()
          })
        },
        cancel: () => {
          this.$etmTip.close()
        }
      })
      this.$etmTip.open()
    }
  }
}
</script>
<style lang="scss" scoped>
.rule-wrap {
  .btnBox {
    padding-bottom: 16px;
    text-align: right;

    .iconplus {
      font-size: 14px;
    }
  }
}
</style>
