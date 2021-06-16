<template>
  <div class="formItem-wrap">
    <etm-form
      :model="formData"
      :rules="rule"
      type="dialog"
    >
      <el-form-item
        label="规则名称"
        prop="ruleName"
      >
        <el-input
          v-model="formData.ruleName"
          placeholder="请输入规则名称(最多可输入10个字)"
        />
      </el-form-item>
      <el-form-item
        label="应用费用"
        prop="materialPriceId"
      >
        <el-select
          v-model="formData.materialPriceId"
          @change="changeMaterialPrice"
        >
          <el-option
            v-for="(materialPrice, index) in materialPriceList"
            :key="index"
            :label="materialPrice.materialPriceName"
            :value="materialPrice.materialPriceId"
          />
        </el-select>
      </el-form-item>
      <el-form-item
        label="结算类型"
        prop="type"
      >
        <el-radio-group v-model="formData.type">
          <el-radio label="ATTENDANCE">
            按出勤天数
          </el-radio>
          <el-radio label="ABSENCE">
            按缺勤天数
          </el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item
        v-if="formData.type === 'ATTENDANCE'"
        label="结算规则"
        prop="attendanceRuleList"
      >
        <div class="attendanceBox">
          <div
            v-for="(list, index) in formData.attendanceRuleList"
            :key="index"
            class="ruleList"
          >
            <template v-if="index === 0">
              <span class="first">出勤天数</span>
              <el-select
                v-model="list.comparisonOperator"
                class="bigSelect"
                @change="changeComparison"
              >
                <el-option
                  v-for="(comparison, i) in comparisonList"
                  :key="i"
                  :label="comparison.label"
                  :value="comparison.value"
                />
              </el-select>
            </template>
            <template v-else>
              <span class="textOne">或</span>
              <span class="textTwo">{{ comparisonText }}</span>
            </template>
            <el-input-number
              v-model="list.days"
              :min="0"
              placeholder="请输入天数"
              @change="changeDays($event, index)"
            />
            <span>天时，</span>
            <el-select
              v-model="list.settlementOperation"
              @change="changeSettlement($event, index)"
            >
              <el-option
                v-for="(settlement, i) in settlementList"
                :key="i"
                :label="settlement.label"
                :value="settlement.value"
              />
            </el-select>
            <template v-if="list.settlementOperation !== 'NOT_REFUND'">
              <el-input-number
                v-model="list.money"
                :min="0"
                placeholder="费用金额"
                @change="changeMoney"
              />
              <span>的</span>
              <el-input-number
                v-model="list.percentage"
                :min="0"
                placeholder="输入百分比"
              />
              <span class="last">%</span>
            </template>
            <i
              v-if="index === 0"
              class="iconfont iconplus"
              @click="add"
            />
            <i
              v-else
              class="iconfont iconminus"
              @click="reduce(index)"
            />
          </div>
        </div>
      </el-form-item>
      <el-form-item
        v-else-if="formData.type === 'ABSENCE'"
        label="结算规则"
        prop="absenceRule"
      >
        <div class="absenceBox">
          <el-input-number
            v-model="formData.absenceRule.price"
            :min="0"
            placeholder="请输入费用单价"
          /> 乘 缺勤天数
        </div>
      </el-form-item>
    </etm-form>
  </div>
</template>

<script>
/**
 * formItem create by Administrator
 * createTime 2020/9/9 17:11
 */

import { getMaterialPriceList } from '@/api/guardcare/financeManage/attendanceSettleSetting'

export default {
  name: 'FormItem',
  components: {},
  filters: {},
  mixins: [],
  props: {
    formData: {
      type: Object,
      default () {
        return {}
      }
    }
  },
  data () {
    return {
      materialPriceList: [],
      rule: {
        ruleName: [{
          required: true,
          trigger: 'blur',
          validator: (rule, value, callback) => {
            if (!value) {
              callback(new Error('规则名称不能为空'))
            } else if (value.length > 10) {
              callback(new Error('规则名称长度不能超过10个字'))
            } else {
              callback()
            }
          }
        }],
        materialPriceId: [{ required: true, message: '应用费用不能为空', trigger: 'change' }],
        type: [{ required: true, message: '结算类型不能为空', trigger: 'change' }],
        attendanceRuleList: [{
          required: true,
          trigger: 'blur',
          validator: (rule, value, callback) => {
            let flag = true
            value.forEach(item => {
              if (!item.comparisonOperator) {
                flag = false
                callback(new Error('比较运算符不能为空'))
              } else if (!item.days) {
                flag = false
                callback(new Error('天数不能为空'))
              } else if (!item.settlementOperation) {
                flag = false
                callback(new Error('结算选择不能为空'))
              } else if (item.settlementOperation === 'REFUND') {
                if (!item.money) {
                  flag = false
                  callback(new Error('费用金额不能为空'))
                } else if (!item.percentage) {
                  flag = false
                  callback(new Error('百分比不能为空'))
                }
              }
            })
            if (flag) {
              callback()
            }
          }
        }],
        absenceRule: [{
          required: true,
          trigger: 'blur',
          validator: (rule, value, callback) => {
            if (!value.price) {
              callback(new Error('费用单价不能为空'))
            } else {
              callback()
            }
          }
        }]
      },
      comparisonList: [
        {
          label: '大于',
          value: 'GREATER_THAN'
        },
        {
          label: '等于',
          value: 'EQUALS_TO'
        },
        {
          label: '大于或等于',
          value: 'GREATER_THAN_OR_EQUALS_TO'
        }
      ],
      settlementList: [
        {
          label: '退',
          value: 'REFUND'
        },
        {
          label: '不退',
          value: 'NOT_REFUND'
        }
      ],
      comparisonText: ''
    }
  },
  computed: {},
  watch: {},
  created () {
  },
  mounted () {
    this.comparisonList.forEach(item => {
      if (this.formData.attendanceRuleList[0].comparisonOperator === item.value) {
        this.comparisonText = item.label
      }
    })
    this.getMaterialPrice()
  },
  methods: {
    getMaterialPrice () {
      const param = {
        enable: true,
        property: 'cycle',
        paged: false
      }
      getMaterialPriceList(param).then(res => {
        this.materialPriceList = res.data
      })
    },
    changeMaterialPrice (value) { // 改变费用，退费金额也改
      this.materialPriceList.forEach(item => {
        if (value === item.materialPriceId) {
          this.formData.attendanceRuleList.forEach((list, index) => {
            this.formData.attendanceRuleList[index].money = item.sellPrice
          })
        }
      })
    },
    changeComparison (value) { // 改变比较运算符，每列规则也改
      this.comparisonList.forEach(item => {
        if (value === item.value) {
          this.comparisonText = item.label
        }
      })
      this.formData.attendanceRuleList.forEach((item, index) => {
        this.formData.attendanceRuleList[index].comparisonOperator = value
      })
    },
    changeDays (value, index) { // 改变天数，进行不退的天数判断，保证不退的天数是最多的
      this.formData.attendanceRuleList.forEach((item, i) => {
        if (this.formData.attendanceRuleList[index].settlementOperation === 'NOT_REFUND') {
          if (i !== index && value <= item.days) {
            this.$message.warning('该天数必须大于已填的天数')
            this.formData.attendanceRuleList[index].days = null
            const data = this.formData.attendanceRuleList[index]
            this.$nextTick(() => {
              this.formData.attendanceRuleList.splice(index, 1, data)
            })
          }
        } else {
          if (item.settlementOperation === 'NOT_REFUND' && value > item.days) {
            this.$message.warning('该天数必须小于不退规则的天数')
            this.formData.attendanceRuleList[index].days = null
            const data = this.formData.attendanceRuleList[index]
            this.$nextTick(() => {
              this.formData.attendanceRuleList.splice(index, 1, data)
            })
          }
        }
      })
      console.log(this.formData.attendanceRuleList)
    },
    changeSettlement (value, index) { // 改变结算，也进行不退的天数判断，保证不退的天数是最多的
      if (value === 'NOT_REFUND') {
        let flag = false
        this.formData.attendanceRuleList.forEach((item, i) => {
          if (i !== index && item.settlementOperation === 'NOT_REFUND') {
            this.$message.warning('不退只能选择一项')
            flag = true
            this.formData.attendanceRuleList[index].settlementOperation = 'REFUND'
          }
        })
        if (!flag) {
          this.formData.attendanceRuleList.forEach((item, i) => {
            if (!this.formData.attendanceRuleList[index].days) {
              return
            }
            if (i !== index && item.days >= this.formData.attendanceRuleList[index].days) {
              this.$message.warning('该天数必须大于已填的天数')
              this.formData.attendanceRuleList[index].days = null
              const data = this.formData.attendanceRuleList[index]
              this.$nextTick(() => {
                this.formData.attendanceRuleList.splice(index, 1, data)
              })
            }
          })
        }
      }
    },
    changeMoney (value) { // 改变退费金额，每列规则的金额也跟着改变
      this.formData.attendanceRuleList.forEach((item, index) => {
        this.formData.attendanceRuleList[index].money = value
      })
    },
    add () { // 新增一列规则
      const data = {
        comparisonOperator: '',
        days: undefined,
        settlementOperation: '',
        money: undefined,
        percentage: undefined
      }
      if (this.formData.attendanceRuleList[0].comparisonOperator) {
        data.comparisonOperator = this.formData.attendanceRuleList[0].comparisonOperator
      }
      if (this.formData.attendanceRuleList[0].money) {
        data.money = this.formData.attendanceRuleList[0].money
      }
      this.formData.attendanceRuleList.push(data)
    },
    reduce (index) { // 删除一列规则
      this.formData.attendanceRuleList.splice(index, 1)
    }
  }
}
</script>
<style lang="scss" scoped>
.formItem-wrap {
  .el-input-number {
    margin-right: 4px;
    width: 240px;

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

  .attendanceBox {
    .ruleList {
      display: flex;
      padding-bottom: 16px;
      position: relative;

      span {
        margin-right: 8px;
      }

      .first {
        margin-left: 0;
      }

      .last {
        margin-right: 0;
      }

      .textOne {
        display: inline-block;
        text-align: right;
        width: 56px;
      }

      .textTwo {
        display: inline-block;
        text-align: center;
        width: 120px;
      }

      .el-select {
        margin-right: 8px;
        width: 100px;

        &.bigSelect {
          width: 120px;
        }
      }

      .el-input-number {
        margin-right: 8px;
        width: 108px;
      }

      .iconfont {
        cursor: pointer;
        position: absolute;
        right: -30px;
        top: 0;

        &.iconplus {
          @include etm-color();
        }

        &.iconminus {
          @include c_error_color();
        }
      }
    }
  }
}
</style>
