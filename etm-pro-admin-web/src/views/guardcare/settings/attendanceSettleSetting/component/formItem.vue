<template>
  <div class="formItem-wrap">
    <div class="alertBox">
      <el-alert
        title="若幼儿当月出勤天数无法匹配所设的结算规则时，默认退该费用金额的100%，若结算金额需调整，可在考勤结算时，修改应结算金额。"
        type="warning"
        :closable="false"
      />
    </div>
    <etm-form :model="formData" :rules="rule" type="dialog">
      <el-form-item label="规则名称" prop="ruleName">
        <el-input v-model="formData.ruleName" placeholder="请输入规则名称(最多可输入10个字)" />
      </el-form-item>
      <el-form-item label="应用费用" prop="materialPriceId">
        <el-select v-model="formData.materialPriceId" @change="changeMaterialPrice">
          <el-option
            v-for="(materialPrice, index) in materialPriceList"
            :key="index"
            :label="materialPrice.materialPriceName"
            :value="materialPrice.materialPriceId"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="结算类型" prop="type">
        <el-radio-group v-model="formData.type">
          <el-radio label="ATTENDANCE">按出勤天数</el-radio>
          <el-radio label="ABSENCE">按缺勤天数</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item v-if="formData.type === 'ATTENDANCE'" required>
        <span slot="label">
          <el-tooltip effect="light" popper-class="stepTips" :visible-arrow="false" placement="bottom-start">
            <span>结算规则<i class="iconfont iconquestion-circle" /></span>
            <div slot="content" class="tipsContent">
              <div class="title">若有多条规则，按顺序匹配</div>
              <div class="text">1、若第1条规则匹配，就不再匹配其他规则。</div>
              <div class="text">2、若第1条规则不匹配，继续匹配第2条，若第2条规则匹配，不再匹配其他规则，以此类推。</div>
              <div class="text">3、若当月出勤天数或缺勤天数无法匹配所设的结算规则时，默认匹配最后一条规则。</div>
            </div>
          </el-tooltip>
        </span>
        <div class="ruleBox">
          <div v-for="(list, index) in formData.attendanceRuleList" :key="index" class="ruleList">
            <span class="first">出勤</span>
            <el-form-item :prop="'attendanceRuleList.'+ index +'.comparisonOperator'" :rules="rule.comparisonOperator">
              <el-select v-model="list.comparisonOperator" class="bigSelect">
                <el-option
                  v-for="(comparison, i) in attComparisonList"
                  :key="i"
                  :label="comparison.label"
                  :value="comparison.value"
                />
              </el-select>
            </el-form-item>
            <el-form-item :prop="'attendanceRuleList.'+ index +'.days'" :rules="rule.days">
              <el-input-number v-model="list.days" :min="0" placeholder="请输入天数" />
            </el-form-item>
            <span>天时，</span>
            <el-form-item
              :prop="'attendanceRuleList.'+ index +'.settlementOperation'"
              :rules="rule.settlementOperation"
            >
              <el-select v-model="list.settlementOperation">
                <el-option
                  v-for="(settlement, i) in attSettlementList"
                  :key="i"
                  :label="settlement.label"
                  :value="settlement.value"
                />
              </el-select>
            </el-form-item>
            <template v-if="list.settlementOperation === 'REFUND'">
              <el-form-item :prop="'attendanceRuleList.'+ index +'.money'" :rules="rule.money">
                <el-input-number v-model="list.money" :min="0" placeholder="费用金额" @change="changeMoney" />
              </el-form-item>
              <span>的</span>
              <el-form-item :prop="'attendanceRuleList.'+ index +'.percentage'" :rules="rule.percentage">
                <el-input-number v-model="list.percentage" :min="0" placeholder="输入百分比" />
              </el-form-item>
              <span class="last">%</span>
            </template>
            <i v-if="index === 0" class="iconfont iconplus" @click="add('attendance')" />
            <i v-else class="iconfont iconminus" @click="reduce('attendance', index)" />
          </div>
        </div>
      </el-form-item>
      <el-form-item v-else-if="formData.type === 'ABSENCE'" required>
        <span slot="label">
          <el-tooltip effect="light" popper-class="stepTips" :visible-arrow="false" placement="bottom-start">
            <span>结算规则<i class="iconfont iconquestion-circle" /></span>
            <div slot="content" class="tipsContent">
              <div class="title">若有多条规则，按顺序匹配</div>
              <div class="text">1、若第1条规则匹配，就不再匹配其他规则。</div>
              <div class="text">2、若第1条规则不匹配，继续匹配第2条，若第2条规则匹配，不再匹配其他规则，以此类推。</div>
              <div class="text">3、若当月出勤天数或缺勤天数无法匹配所设的结算规则时，默认匹配最后一条规则。</div>
            </div>
          </el-tooltip>
        </span>
        <div class="ruleBox">
          <div v-for="(list, index) in formData.absenceRuleList" :key="index" class="ruleList">
            <span class="first">缺勤</span>
            <el-form-item :prop="'absenceRuleList.'+ index +'.comparisonOperator'" :rules="rule.comparisonOperator">
              <el-select v-model="list.comparisonOperator" class="bigSelect">
                <el-option
                  v-for="(comparison, i) in abComparisonList"
                  :key="i"
                  :label="comparison.label"
                  :value="comparison.value"
                />
              </el-select>
            </el-form-item>
            <el-form-item :prop="'absenceRuleList.'+ index +'.days'" :rules="rule.days">
              <el-input-number v-model="list.days" :min="0" placeholder="请输入天数" />
            </el-form-item>
            <span>天时，</span>
            <el-form-item :prop="'absenceRuleList.'+ index +'.settlementOperation'" :rules="rule.settlementOperation">
              <el-select v-model="list.settlementOperation">
                <el-option
                  v-for="(settlement, i) in abSettlementList"
                  :key="i"
                  :label="settlement.label"
                  :value="settlement.value"
                />
              </el-select>
            </el-form-item>
            <template v-if="list.settlementOperation === 'REFUND'">
              <span>缺勤天数</span>
              <span>乘</span>
              <el-form-item :prop="'absenceRuleList.'+ index +'.price'" :rules="rule.price">
                <el-input-number v-model="list.price" :min="0" placeholder="输入金额" />
              </el-form-item>
            </template>
            <i v-if="index === 0" class="iconfont iconplus" @click="add('absence')" />
            <i v-else class="iconfont iconminus" @click="reduce('absence', index)" />
          </div>
        </div>
      </el-form-item>
    </etm-form>
  </div>

</template>

<script>/**
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
      default() {
        return {}
      }
    }
  },
  data() {
    return {
      materialPriceList: [],
      rule: {
        ruleName: [{
          required: true, trigger: 'blur', validator: (rule, value, callback) => {
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
        comparisonOperator: [{ required: true, message: '比较运算符不能为空', trigger: 'change' }],
        days: [{ required: true, message: '天数不能为空', trigger: 'blur' }],
        settlementOperation: [{ required: true, message: '结算选择不能为空', trigger: 'change' }],
        money: [{ required: true, message: '费用金额不能为空', trigger: 'blur' }],
        percentage: [{ required: true, message: '百分比不能为空', trigger: 'blur' }],
        price: [{ required: true, message: '费用金额不能为空', trigger: 'blur' }]
      },
      attComparisonList: [
        {
          label: '小于或等于',
          value: 'LESS_THAN_OR_EQUAL_TO'
        },
        {
          label: '大于或等于',
          value: 'GREATER_THAN_OR_EQUALS_TO'
        }
      ],
      attSettlementList: [
        {
          label: '退',
          value: 'REFUND'
        },
        {
          label: '不退',
          value: 'NOT_REFUND'
        }
      ],
      abComparisonList: [
        {
          label: '小于',
          value: 'LESS_THAN'
        },
        {
          label: '大于',
          value: 'GREATER_THAN'
        },
        {
          label: '等于',
          value: 'EQUALS_TO'
        }
      ],
      abSettlementList: [
        {
          label: '退',
          value: 'REFUND'
        },
        {
          label: '不退',
          value: 'NOT_REFUND'
        },
        {
          label: '顺延',
          value: 'POSTPONE'
        }
      ]
    }
  },
  computed: {},
  watch: {},
  created() {
  },
  mounted() {
    this.getMaterialPrice()
  },
  methods: {
    getMaterialPrice() {
      const param = {
        enable: true,
        property: 'cycle',
        paged: false
      }
      getMaterialPriceList(param).then(res => {
        this.materialPriceList = res.data
      })
    },
    changeMaterialPrice(value) { // 改变费用，退费金额也改
      this.materialPriceList.forEach(item => {
        if (value === item.materialPriceId) {
          this.formData.attendanceRuleList.forEach((list, index) => {
            this.formData.attendanceRuleList[index].money = item.sellPrice
          })
        }
      })
    },
    changeMoney(value) { // 改变退费金额，每列规则的金额也跟着改变
      this.formData.attendanceRuleList.forEach((item, index) => {
        this.formData.attendanceRuleList[index].money = value
      })
    },
    add(type) { // 新增一列规则
      if (type === 'attendance') {
        const data = {
          comparisonOperator: '',
          days: undefined,
          settlementOperation: '',
          money: undefined,
          percentage: undefined
        }
        if (this.formData.attendanceRuleList[0].money) {
          data.money = this.formData.attendanceRuleList[0].money
        }
        this.formData.attendanceRuleList.push(data)
      } else if (type === 'absence') {
        const data = {
          comparisonOperator: '',
          days: undefined,
          settlementOperation: '',
          price: undefined
        }
        this.formData.absenceRuleList.push(data)
      }
    },
    reduce(type, index) { // 删除一列规则
      if (type === 'attendance') {
        this.formData.attendanceRuleList.splice(index, 1)
      } else if (type === 'absence') {
        this.formData.absenceRuleList.splice(index, 1)
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.formItem-wrap {
  .alertBox {
    padding-bottom: 16px;
  }

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

  .ruleBox {
    .ruleList {
      display: flex;
      position: relative;
      padding-bottom: 24px;

      span {
        margin-right: 8px;

        &.first {
          margin-left: 0;
        }

        &.last {
          margin-right: 0;
        }

        &.textOne {
          display: inline-block;
          width: 56px;
          text-align: right;
        }

        &.textTwo {
          display: inline-block;
          width: 120px;
          text-align: center;
        }
      }

      .el-select {
        margin-right: 8px;
        width: 100px !important;

        &.bigSelect {
          width: 120px !important;
        }
      }

      .el-input-number {
        margin-right: 8px;
        width: 100px !important;
      }

      .iconfont {
        position: absolute;
        top: 0;
        right: -30px;
        cursor: pointer;

        &.iconplus {
          @include c_main_color();
        }

        &.iconminus {
          @include c_error_color();
        }
      }
    }
  }

  .iconquestion-circle {
    cursor: pointer;
  }
}

.tipsContent {
  padding: 6px;
  width: 360px;

  .text {
    margin-top: 8px;
    @include c_secondary_color();
  }
}
</style>
