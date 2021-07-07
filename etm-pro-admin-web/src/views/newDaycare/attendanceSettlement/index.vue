<template>
  <div class="index-wrap">
    <etm-main-body>
      <etm-layout-split>
        <div slot="header">
          <etm-tabs
            v-model="activeName"
            setting
            @setting="setting"
          >
            <el-tab-pane label="幼儿结算" name="settle">
              <etm-tool-bar v-model="formData" @search="handleSearch" @reset="reset">
                <el-form-item label="班级:">
                  <etm-clazz-cascader :clear="clear" @change="getClazz" />
                </el-form-item>
              </etm-tool-bar>
            </el-tab-pane>
          </etm-tabs>
        </div>
        <div slot="body">
          <etm-table-page
            v-fixedHead
            :data="tableData"
            :columns="column"
            :stripe="false"
            :span-method="objectSpanMethod"
            @selection-change="handleSelectionChange"
            @currentChange="currentChange"
          >
            <etm-table-tool-bar slot="tool">
              <el-alert
                title="温馨提示：当月的考勤结算在下个月1号生成。"
                type="warning"
                :closable="false"
              />
              <el-button
                slot="right"
                plain
                @click="batchSettle"
              >批量结算
              </el-button>
            </etm-table-tool-bar>
            <el-table-column slot="left" fixed="left" type="selection" width="60" :selectable="selectable" />
            <el-table-column slot="left" fixed="left" label="年级" prop="gradeName" width="120" />
            <el-table-column slot="left" fixed="left" label="班级" prop="clazzName" width="120" />
            <el-table-column slot="left" fixed="left" label="幼儿姓名" prop="childName" width="120" />
            <el-table-column slot="right" label="结算科目" width="120">
              <template slot-scope="scoped">
                <span>{{ scoped.row.settlementItem }}</span>
              </template>
            </el-table-column>
            <el-table-column slot="right" label="预收金额（元）" width="150" align="right">
              <template slot-scope="scoped">
                <span>{{ formatMoney(scoped.row.balance) }}</span>
              </template>
            </el-table-column>
            <el-table-column slot="right" label="结算规则" width="360">
              <template slot-scope="scoped">
                <div v-html="scoped.row.settlementRule" />
              </template>
            </el-table-column>
            <el-table-column slot="right" width="180" align="right">
              <template slot="header">
                应退金额（元）
                <el-tooltip
                  effect="light"
                  popper-class="stepTips"
                  content="由结算规则计算得到的退费金额"
                  :visible-arrow="false"
                  placement="top-end"
                >
                  <i class="iconfont iconquestion-circle" />
                </el-tooltip>
              </template>
              <template slot-scope="scoped">
                <span>{{ formatMoney(scoped.row.toBeSettledAmount) }}</span>
              </template>
            </el-table-column>
            <el-table-column slot="right" width="180" align="right">
              <template slot="header">
                结算可退金额（元）
                <el-tooltip
                  effect="light"
                  popper-class="stepTips"
                  content="通过结算得到的退费金额"
                  :visible-arrow="false"
                  placement="top-end"
                >
                  <i class="iconfont iconquestion-circle" />
                </el-tooltip>
              </template>
              <template slot-scope="scoped">
                <span>{{ formatMoney(scoped.row.actualSettlementAmount) }}</span>
                <span
                  v-if="scoped.row.status === 'UNSETTLED'"
                  class="iconfont iconedit-square"
                  @click="openPop(scoped.row)"
                />
              </template>
            </el-table-column>
            <el-table-column slot="right" width="180" align="right">
              <template slot="header">
                应消金额（元）
                <el-tooltip
                  effect="light"
                  popper-class="stepTips"
                  content="应消金额=预收金额-应退金额"
                  :visible-arrow="false"
                  placement="top-end"
                >
                  <i class="iconfont iconquestion-circle" />
                </el-tooltip>
              </template>
              <template slot-scope="scoped">
                {{ formatMoney(scoped.row.amountPayable) }}
              </template>
            </el-table-column>
            <el-table-column slot="right" width="180" align="right">
              <template slot="header">
                实消金额（元）
                <el-tooltip
                  effect="light"
                  popper-class="stepTips"
                  content="实消金额=预收金额-结算可退金额"
                  :visible-arrow="false"
                  placement="top-end"
                >
                  <i class="iconfont iconquestion-circle" />
                </el-tooltip>
              </template>
              <template slot-scope="scoped">
                {{ formatMoney(scoped.row.actualConsumptionAmount) }}
              </template>
            </el-table-column>
            <el-table-column slot="right" label="状态" width="120">
              <template slot-scope="scoped">
                <span>{{
                  scoped.row.status === 'SETTLED' ? '已结算' : scoped.row.status === 'UNSETTLED' ? '未结算' : '--'
                }}</span>
              </template>
            </el-table-column>
            <el-table-column slot="right" label="结算日期" width="180">
              <template slot-scope="scoped">
                <span>{{ transferDate(scoped.row.settlementTime) }}</span>
              </template>
            </el-table-column>
            <el-table-column slot="right" fixed="right" label="操作" width="120">
              <template slot-scope="scoped">
                <etm-text
                  v-if="scoped.row.status === 'UNSETTLED'"
                  type="primary"
                  @click="settle(scoped.row)"
                >结算
                </etm-text>
                <span v-else>--</span>
              </template>
            </el-table-column>
          </etm-table-page>
        </div>
      </etm-layout-split>
    </etm-main-body>
    <etm-pop
      v-if="showPop"
      :visible="showPop"
      pop="simple"
      title="编辑金额"
      confirm-btn="确定"
      cancel-btn="取消"
      @close="handlePopClose"
      @confirm="handlePopConfirm"
      @cancel="handlePopCancel"
    >
      <etm-form ref="form" :model="settleData" :rules="rule" type="dialog">
        <el-form-item label="结算金额（元）" prop="settleAmount">
          <el-input-number v-model="settleData.settleAmount" :min="0" placeholder="请输入实际结算金额" />
        </el-form-item>
      </etm-form>
    </etm-pop>
  </div>

</template>

<script>/**
 * index create by Administrator
 * createTime 2020/9/8 10:39
 */

import {
  querySettlementList,
  querySettlementStatus,
  updateSettlement,
  updateSettlementAmount
} from '@/api/newDaycare/attendanceSettlement'
import { parseTime } from '@/utils'
import EtmClazzCascader from '@/views/newDaycare/childManageGuard/EtmClazzCascader'

export default {
  name: 'Index',
  components: {
    EtmClazzCascader
  },
  filters: {},
  mixins: [],
  props: {},
  data() {
    return {
      activeName: 'settle',
      formData: [
        {
          label: '结算月份',
          type: 'date',
          prop: 'date',
          value: '',
          default: parseTime(new Date(new Date().getFullYear(), new Date().getMonth() - 1, 1), '{y}-{m}-{d}'),
          props: {
            type: 'month',
            clearable: false,
            placeholder: '请选择月份'
            // 'picker-options': {
            //   disabledDate(time) {
            //     return time.getTime() > new Date().getTime()
            //   }
            // }
          }
        },
        {
          label: '幼儿姓名',
          type: 'input',
          prop: 'childName',
          value: '',
          props: {
            placeholder: '请输入幼儿姓名'
          }
        },
        {
          label: '状态',
          type: 'select',
          prop: 'status',
          value: '',
          props: {
            placeholder: '请选择状态'
          },
          options: [
            {
              label: '全部',
              value: ''
            },
            {
              label: '未结算',
              value: 'UNSETTLED'
            },
            {
              label: '已结算',
              value: 'SETTLED'
            }
          ]
        }
      ],
      clazzValue: [],
      clear: false,
      searchInfo: {},
      tableData: {
        content: []
      },
      pageNum: 1,
      pageSize: 10,
      rowNum: [],
      column: [
        {
          label: '应出勤(天)',
          prop: 'shouldArriveDays'
        },
        {
          label: '已出勤(天)',
          prop: 'arrivedDays'
        },
        {
          label: '缺勤(天)',
          prop: 'absenceDays'
        },
        {
          label: '请假(天)',
          prop: 'requestForLeaveDays'
        }
      ],
      selectionValue: [],
      showPop: false,
      settleData: {},
      rule: {
        settleAmount: [{ required: true, message: '结算金额不能为空', trigger: 'blur' }]
      }
    }
  },
  computed: {},
  watch: {},
  created() {
  },
  mounted() {
    this.getList()
  },
  methods: {
    setting() {
      this.$router.push({
        path: '/newdaycare_attendanceSettle/setting'
      })
    },
    getClazz(value) {
      this.clazzValue = value
    },
    handleSearch(value) {
      const searchInfo = {}
      value.forEach(item => {
        if (item.prop === 'date') {
          searchInfo[item.prop] = parseTime(item.value, '{y}-{m}-{d}')
        } else {
          searchInfo[item.prop] = item.value
        }
      })
      if (this.clazzValue.length) {
        searchInfo.gradeId = this.clazzValue[0]
        searchInfo.clazzId = this.clazzValue[1]
      }
      this.pageNum = 1
      this.searchInfo = searchInfo
      this.getList()
    },
    reset() {
      this.pageNum = 1
      this.pageSize = 10
      this.clear = !this.clear
      this.clazzValue = []
      this.searchInfo = {}
      this.getList()
    },
    currentChange(pageNum, pageSize) {
      this.pageNum = pageNum
      this.pageSize = pageSize
      this.getList()
    },
    getList() {
      const param = {
        pageNum: this.pageNum,
        pageSize: this.pageSize,
        date: parseTime(new Date(new Date().getFullYear(), new Date().getMonth() - 1, 1), '{y}-{m}-{d}')
      }
      for (const i in this.searchInfo) {
        param[i] = this.searchInfo[i]
      }
      querySettlementList(param).then(res => {
        const tableData = JSON.parse(JSON.stringify(res.data))
        tableData.content = []
        this.rowNum = []
        if (res.data.content) {
          res.data.content.forEach(item => { // 拆分数据
            if (item.settlementRecordsList.length) {
              this.rowNum.push(item.settlementRecordsList.length) // 记录每项数据有几个子项，在进行表格合并时用到
              item.settlementRecordsList.forEach(list => { // 将每项数据里的子项抽出并形成新的一项数据
                const data = JSON.parse(JSON.stringify(item))
                for (const i in list) {
                  data[i] = list[i]
                }
                tableData.content.push(data)
              })
            } else {
              this.rowNum.push(1) // 记录每项数据有几个子项，在进行表格合并时用到
              const data = JSON.parse(JSON.stringify(item))
              data.recordId = null
              data.settlementItem = null
              data.settlementRule = null
              data.actualSettlementAmount = null
              data.status = null
              data.settlementTime = null
              data.balance = null
              data.toBeSettledAmount = null
              data.amountPayable = null
              data.actualConsumptionAmount = null
              tableData.content.push(data)
            }
          })
          this.tableData = tableData
        }
      })
    },
    transferDate(date) {
      if (isNaN(date)) {
        return date
      } else {
        return parseTime(date, '{y}-{m}-{d}')
      }
    },
    formatMoney(money) {
      if (!isNaN(money)) {
        return money.toFixed(2)
      } else {
        return money
      }
    },
    objectSpanMethod({ row, column, rowIndex, columnIndex }) { // 表格合并
      if (this.judgeColumnType(column.property)) {
        let num = 0
        let flag = false
        for (let i = 0; i < this.rowNum.length; i++) {
          if (rowIndex === this.addNum(i - 1)) {
            num = i
            flag = true
          }
        }
        if (flag) {
          return {
            rowspan: this.rowNum[num],
            colspan: 1
          }
        } else {
          return {
            rowspan: 0,
            colspan: 0
          }
        }
      }
    },
    judgeColumnType(type) { // 判断行是否合并
      if (type === 'gradeName' || type === 'clazzName' || type === 'childName' || type === 'shouldArriveDays' ||
        type === 'arrivedDays' || type === 'absenceDays' || type === 'requestForLeaveDays') {
        return true
      } else {
        return false
      }
    },
    addNum(index) { // 数组前index+1项之和
      if (index < 0) return 0
      let num = 0
      this.rowNum.forEach((item, ind) => {
        if (ind <= index) {
          num += item
        }
      })
      return num
    },
    selectable(row) {
      if (row.status === 'SETTLED') {
        return false
      } else {
        return true
      }
    },
    handleSelectionChange(value) {
      this.selectionValue = value
    },
    batchSettle() {
      if (!this.selectionValue.length) {
        this.$message.warning('请选择结算列表')
      } else {
        let flag = true
        for (let i = 0; i < this.selectionValue.length; i++) {
          const param = {
            recordId: this.selectionValue[i].recordId
          }
          querySettlementStatus(param).then(res => {
            if (!res.data.canSettlement) {
              flag = false
              this.showTips(this.selectionValue[i].childName, res.data.month)
            }
          })
          if (!flag) {
            return
          }
        }
        if (flag) {
          this.$etmTip.init({
            type: 'warn',
            title: `结算确认`,
            content: `确认进行结算操作？`,
            confirmBtn: '确定',
            cancelBtn: '取消',
            confirm: () => {
              const param = {
                recordIdList: []
              }
              this.selectionValue.forEach(item => {
                param.recordIdList.push(item.recordId)
              })
              updateSettlement(param).then(() => {
                this.$message.success('结算成功')
                this.$etmTip.close()
                this.getList()
              })
            },
            cancel: () => {
              this.$etmTip.close()
            }
          })
          this.$etmTip.open()
        }
      }
    },
    settle(row) {
      const param = {
        recordId: row.recordId
      }
      querySettlementStatus(param).then(res => {
        if (res.data.canSettlement) {
          this.$etmTip.init({
            type: 'warn',
            title: `结算确认`,
            content: `确认进行结算操作？`,
            confirmBtn: '确定',
            cancelBtn: '取消',
            confirm: () => {
              const param = {
                recordIdList: []
              }
              param.recordIdList.push(row.recordId)
              updateSettlement(param).then(() => {
                this.$message.success('结算成功')
                this.$etmTip.close()
                this.getList()
              })
            },
            cancel: () => {
              this.$etmTip.close()
            }
          })
          this.$etmTip.open()
        } else {
          this.showTips(row.childName, res.data.month)
        }
      })
    },
    showTips(name, date) {
      this.$etmTip.init({
        type: 'warn',
        title: `提示`,
        content: `${name}${date}月份的数据未结算，请先进行结算操作！`,
        confirmBtn: '知道了',
        confirm: () => {
          this.$etmTip.close()
        }
      })
      this.$etmTip.open()
    },
    openPop(row) {
      this.settleData = {
        recordId: row.recordId,
        settleAmount: row.actualSettlementAmount
      }
      this.showPop = true
    },
    handlePopClose() {
      this.showPop = false
    },
    handlePopConfirm() {
      this.$refs.form.$children[0].validate(valid => {
        if (valid) {
          const param = {
            recordId: this.settleData.recordId,
            amount: this.settleData.settleAmount
          }
          updateSettlementAmount(param).then(() => {
            this.$message.success('金额编辑成功')
            this.showPop = false
            this.getList()
          })
        }
      })
    },
    handlePopCancel() {
      this.showPop = false
    }
  }
}
</script>
<style lang="scss" scoped>
.index-wrap {
  .el-alert {
    padding: 0 16px;
  }

  .labelText {
    @include c_secondary_color();
  }

  .iconedit-square {
    @include c_secondary_color();
    cursor: pointer;

    &:hover {
      @include c_main_color();
    }
  }
}

.el-input-number {
  ::v-deep .el-input {
    .el-input__inner {
      padding: 0 10px;
      text-align: left;
    }
  }

  ::v-deep .el-input-number__increase {
    display: none;
  }

  ::v-deep .el-input-number__decrease {
    display: none;
  }
}
</style>
