<template>
  <div class="formItem-wrap">
    <etm-form
      ref="form"
      :model="formData"
      :rules="rule"
      type="dialog"
    >
      <el-form-item
        label="收费科目"
        prop="materialPriceName"
      >
        <el-input
          v-model="formData.materialPriceName"
          v-focus
          placeholder="请输入收费科目(最多可输入10个字)"
        />
      </el-form-item>
      <el-form-item
        label="科目性质"
        prop="property"
      >
        <el-radio-group
          v-model="formData.property"
          @change="clearValidate"
        >
          <el-radio label="once">
            一次性
          </el-radio>
          <el-radio label="cycle">
            周期性
          </el-radio>
        </el-radio-group>
      </el-form-item>
      <template v-if="formData.property === 'cycle'">
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
          label="结算类型"
          prop="ruleType"
        >
          <el-radio-group
            v-model="formData.ruleType"
            @change="clearValidate"
          >
            <el-radio label="ATTENDANCE">
              按出勤天数
            </el-radio>
            <el-radio label="ABSENCE">
              按缺勤天数
            </el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item
          v-if="formData.ruleType === 'ATTENDANCE'"
          required
        >
          <span slot="label">
            <el-tooltip
              effect="light"
              popper-class="stepTips"
              :visible-arrow="false"
              placement="bottom-start"
            >
              <span>结算规则<i class="iconfont iconquestion-circle" /></span>
              <div
                slot="content"
                class="tipsContent"
              >
                <div class="title">若有多条规则，按顺序匹配</div>
                <div class="text">1、若第1条规则匹配，就不再匹配其他规则。</div>
                <div class="text">2、若第1条规则不匹配，继续匹配第2条，若第2条规则匹配，不再匹配其他规则，以此类推。</div>
                <div class="text">3、若当月出勤天数或缺勤天数无法匹配所设的结算规则时，默认匹配最后一条规则。</div>
              </div>
            </el-tooltip>
          </span>
          <div class="ruleBox">
            <div
              v-for="(list, index) in formData.attendanceRuleList"
              :key="index"
              class="ruleList"
            >
              <span class="first">出勤</span>
              <el-form-item
                :prop="'attendanceRuleList.'+ index +'.comparisonOperator'"
                :rules="rule.comparisonOperator"
              >
                <el-select
                  v-model="list.comparisonOperator"
                  class="bigSelect"
                >
                  <el-option
                    v-for="(comparison, i) in attComparisonList"
                    :key="i"
                    :label="comparison.label"
                    :value="comparison.value"
                  />
                </el-select>
              </el-form-item>
              <el-form-item
                :prop="'attendanceRuleList.'+ index +'.days'"
                :rules="rule.days"
              >
                <el-input-number
                  v-model="list.days"
                  :min="0"
                  placeholder="请输入天数"
                />
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
                <span>月收费</span>
                <span>的</span>
                <el-form-item
                  :prop="'attendanceRuleList.'+ index +'.percentage'"
                  :rules="rule.percentage"
                >
                  <el-input-number
                    v-model="list.percentage"
                    :min="0"
                    placeholder="输入百分比"
                  />
                </el-form-item>
                <span class="last">%</span>
              </template>
              <i
                v-if="index === 0"
                class="iconfont iconplus"
                @click="add('attendance')"
              />
              <i
                v-else
                class="iconfont iconminus"
                @click="reduce('attendance', index)"
              />
            </div>
          </div>
        </el-form-item>
        <el-form-item
          v-else-if="formData.ruleType === 'ABSENCE'"
          required
        >
          <span slot="label">
            <el-tooltip
              effect="light"
              popper-class="stepTips"
              :visible-arrow="false"
              placement="bottom-start"
            >
              <span>结算规则<i class="iconfont iconquestion-circle" /></span>
              <div
                slot="content"
                class="tipsContent"
              >
                <div class="title">若有多条规则，按顺序匹配</div>
                <div class="text">1、若第1条规则匹配，就不再匹配其他规则。</div>
                <div class="text">2、若第1条规则不匹配，继续匹配第2条，若第2条规则匹配，不再匹配其他规则，以此类推。</div>
                <div class="text">3、若当月出勤天数或缺勤天数无法匹配所设的结算规则时，默认匹配最后一条规则。</div>
              </div>
            </el-tooltip>
          </span>
          <div class="ruleBox">
            <div
              v-for="(list, index) in formData.absenceRuleList"
              :key="index"
              class="ruleList"
            >
              <span class="first">缺勤</span>
              <el-form-item
                :prop="'absenceRuleList.'+ index +'.comparisonOperator'"
                :rules="rule.comparisonOperator"
              >
                <el-select
                  v-model="list.comparisonOperator"
                  class="bigSelect"
                >
                  <el-option
                    v-for="(comparison, i) in abComparisonList"
                    :key="i"
                    :label="comparison.label"
                    :value="comparison.value"
                  />
                </el-select>
              </el-form-item>
              <el-form-item
                :prop="'absenceRuleList.'+ index +'.days'"
                :rules="rule.days"
              >
                <el-input-number
                  v-model="list.days"
                  :min="0"
                  placeholder="请输入天数"
                />
              </el-form-item>
              <span>天时，</span>
              <el-form-item
                :prop="'absenceRuleList.'+ index +'.settlementOperation'"
                :rules="rule.settlementOperation"
              >
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
                <el-form-item
                  :prop="'absenceRuleList.'+ index +'.price'"
                  :rules="rule.price"
                >
                  <el-input-number
                    v-model="list.price"
                    :min="0"
                    placeholder="输入金额"
                  />
                </el-form-item>
              </template>
              <i
                v-if="index === 0"
                class="iconfont iconplus"
                @click="add('absence')"
              />
              <i
                v-else
                class="iconfont iconminus"
                @click="reduce('absence', index)"
              />
            </div>
          </div>
        </el-form-item>
      </template>
    </etm-form>
  </div>
</template>

<script>
/**
 * formItem create by Administrator
 * createTime 2020/9/9 17:11
 */

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
      rule: {
        materialPriceName: [{
          required: true,
          trigger: 'blur',
          validator: (rule, value, callback) => {
            if (!value) {
              callback(new Error('收费科目不能为空'))
            } else if (value.length > 10) {
              callback(new Error('收费科目长度不能超过10个字'))
            } else {
              callback()
            }
          }
        }],
        property: [{ required: true, message: '科目性质不能为空', trigger: 'change' }],
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
        ruleType: [{ required: true, message: '结算类型不能为空', trigger: 'change' }],
        comparisonOperator: [{ required: true, message: '比较运算符不能为空', trigger: 'change' }],
        days: [{ required: true, message: '天数不能为空', trigger: 'blur' }],
        settlementOperation: [{ required: true, message: '结算选择不能为空', trigger: 'change' }],
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
          label: '退费',
          value: 'REFUND'
        },
        {
          label: '不退费',
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
          label: '退费',
          value: 'REFUND'
        },
        {
          label: '不退费',
          value: 'NOT_REFUND'
        }
      ]
    }
  },
  computed: {},
  created () {
  },
  mounted () {

  },
  methods: {
    add (type) { // 新增一列规则
      if (type === 'attendance') {
        const data = {
          comparisonOperator: '',
          days: undefined,
          settlementOperation: '',
          percentage: undefined
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
    reduce (type, index) { // 删除一列规则
      if (type === 'attendance') {
        this.formData.attendanceRuleList.splice(index, 1)
      } else if (type === 'absence') {
        this.formData.absenceRuleList.splice(index, 1)
      }
    },
    clearValidate () {
      this.$refs.form.$children[0].clearValidate()
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

  .ruleBox {
    .ruleList {
      display: flex;
      padding-bottom: 24px;
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

  .iconquestion-circle {
    cursor: pointer;
  }
}

.tipsContent {
  padding: 6px;
  width: 360px;

  .text {
    @include c_secondary_color();
    margin-top: 8px;
  }
}
</style>
