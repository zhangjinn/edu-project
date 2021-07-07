<template>
  <div class="rule-wrap">
    <div class="btnBox">
      <el-button type="primary" @click="add">
        <span class="iconfont iconplus" />添加规则
      </el-button>
    </div>
    <etm-table :data="tableData" :columns="column">
      <el-table-column slot="right" label="结算类型">
        <template slot-scope="scoped">
          <span>{{ scoped.row.type === 'ATTENDANCE' ? '按出勤' : '按缺勤' }}</span>
        </template>
      </el-table-column>
      <el-table-column slot="right" label="结算规则" width="300">
        <template slot-scope="scoped">
          <span v-html="scoped.row.content" />
        </template>
      </el-table-column>
      <el-table-column slot="right" label="使用状态">
        <template slot-scope="scoped">
          <el-switch
            v-model="scoped.row.enable"
            @change="switchChange(scoped.row)"
          />
        </template>
      </el-table-column>
      <el-table-column slot="right" label="操作">
        <template slot-scope="scoped">
          <etm-text v-if="!scoped.row.enable" type="primary" @click="edit(scoped.row)">编辑</etm-text>
          <etm-text v-if="!scoped.row.enable" type="danger" @click="remove(scoped.row)">删除</etm-text>
          <span v-if="scoped.row.enable">--</span>
        </template>
      </el-table-column>
    </etm-table>
    <etm-pop
      v-if="showPop"
      :visible="showPop"
      pop="big"
      title="添加规则"
      confirm-btn="确定"
      cancel-btn="取消"
      @close="popClose"
      @confirm="popConfirm"
      @cancel="popClose"
    >
      <form-item ref="popForm" :form-data="formData" />
    </etm-pop>
    <etm-drawer
      :visible.sync="showDrawer"
      type="big"
    >
      <etm-layout-split>
        <etm-title title="编辑规则" :show-line="false" border size="big">
          <template slot="tool">
            <el-button plain size="mini" @click="closeDrawer">取消</el-button>
            <el-button type="primary" size="mini" @click="confirmDrawer">保存</el-button>
          </template>
        </etm-title>
        <form-item ref="drawerForm" :form-data="formData" />
      </etm-layout-split>
    </etm-drawer>
  </div>

</template>

<script>/**
 * rule create by Administrator
 * createTime 2020/9/8 18:53
 */

import {
  addRule,
  deleteRule,
  getRule,
  getRuleList,
  renewRule,
  renewRuleStatus
} from '@/api/guardcare/financeManage/attendanceSettleSetting'
import formItem from '../component/formItem'

export default {
  name: 'Rule',
  components: {
    formItem
  },
  filters: {},
  mixins: [],
  props: {},
  data() {
    return {
      tableData: [],
      column: [
        {
          label: '规则名称',
          prop: 'ruleName'
        },
        {
          label: '应用费用',
          prop: 'materialPriceName'
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
  created() {
  },
  mounted() {
    this.getData()
  },
  methods: {
    getData() {
      getRuleList().then(res => {
        this.tableData = res.data || []
      })
    },
    switchChange(row) {
      const param = {
        ruleId: row.ruleId,
        enable: row.enable
      }
      renewRuleStatus(param).then(() => {
        this.getData()
      })
    },
    add() {
      this.formData = {
        type: 'ATTENDANCE',
        attendanceRuleList: [
          {
            comparisonOperator: '',
            days: undefined,
            settlementOperation: '',
            money: undefined,
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
    popClose() {
      this.showPop = false
    },
    popConfirm() {
      this.$refs.popForm.$children[1].$children[0].validate(valid => {
        if (valid) {
          const param = {
            ruleName: this.formData.ruleName,
            materialPriceId: this.formData.materialPriceId,
            type: this.formData.type
          }
          if (this.formData.type === 'ABSENCE') { // 选择按缺勤天数
            param.absenceRuleList = this.formData.absenceRuleList
          } else { // 选择按出勤天数
            param.attendanceRuleList = this.formData.attendanceRuleList
          }
          addRule(param).then(() => {
            this.$message.success('考勤规则添加成功')
            this.showPop = false
            this.getData()
          })
        }
      })
    },
    edit(row) {
      this.ruleData = row
      this.getDetail()
    },
    getDetail() {
      getRule(this.ruleData.ruleId).then(res => {
        const data = res.data
        this.formData = {
          ruleName: data.ruleName,
          materialPriceId: data.materialPriceId,
          type: data.type,
          absenceRuleList: data.absenceRuleList,
          attendanceRuleList: data.attendanceRuleList
        }
        this.showDrawer = true
      })
    },
    closeDrawer() {
      this.showDrawer = false
    },
    confirmDrawer() { // 编辑规则进行保存
      this.$refs.drawerForm.$children[1].$children[0].validate(valid => {
        if (valid) {
          const param = {
            ruleName: this.formData.ruleName,
            materialPriceId: this.formData.materialPriceId,
            type: this.formData.type
          }
          if (this.formData.type === 'ABSENCE') { // 选择按缺勤天数
            param.absenceRuleList = this.formData.absenceRuleList
          } else { // 选择按出勤天数
            param.attendanceRuleList = this.formData.attendanceRuleList
          }
          renewRule(this.ruleData.ruleId, param).then(() => {
            this.$message.success('考勤规则修改成功')
            this.showDrawer = false
            this.getData()
          })
        }
      })
    },
    remove(row) { // 删除规则
      this.$etmTip.init({
        type: 'error',
        title: `确认删除？`,
        content: '删除后将无法撤销，是否继续操作？',
        confirmBtn: '确定',
        cancelBtn: '取消',
        confirm: () => {
          deleteRule(row.ruleId).then(() => {
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
.btnBox{
  padding-bottom: 16px;
  text-align: right;
  .iconplus{
    font-size: 14px;
  }
}
}
</style>
