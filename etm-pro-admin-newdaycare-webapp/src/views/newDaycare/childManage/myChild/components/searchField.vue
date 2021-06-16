<template>
  <div class="searchField-wrap">
    <span class="title">筛选条件:</span>
    <etm-form
      inline
      type="dialog"
    >
      <el-form-item
        v-for="(form, index) of forms"
        :key="index"
        :label="form.label"
        class="el-form-content"
      >
        <el-form-item>
          <el-select
            v-model="form.field"
            @change="fieldChange(form, index)"
          >
            <el-option
              v-for="(field) of formsFields"
              :key="field.label"
              :label="field.label"
              :value="field.value"
            />
          </el-select>
        </el-form-item>

        <el-form-item>
          <el-select
            v-model="form.operationValue"
            @change="$forceUpdate()"
          >
            <el-option
              v-for="(op) of form.operationList"
              :key="op.operation"
              :label="op.label"
              :value="op.operation"
            />
          </el-select>
        </el-form-item>
        <el-form-item v-if="form.operationValue !== 'IS_NULL' && form.operationValue !== 'IS_NOT_NULL'">
          <!--枚举: INPUT,RADIO,CHECKBOX,SELECT,DATE_PICKER-->
          <template v-if="form.controlType === 'INPUT'">
            <el-input v-model="form.value" />
          </template>
          <template v-if="form.controlType === 'SELECT'">
            <el-select
              v-model="form.value"
              filterable
            >
              <el-option
                v-for="(option) of form.optionList"
                :key="option.value"
                :label="option.value"
                :value="option.key"
              />
            </el-select>
          </template>
          <template v-if="form.controlType === 'DATE_PICKER'">
            <el-date-picker
              v-model="form.value"
              type="date"
              value-format="yyyy-MM-dd"
            />
          </template>
          <template v-if="form.controlType === 'RADIO'">
            <el-select
              v-model="form.value"
              filterable
            >
              <el-option
                v-for="(option) of form.optionList"
                :key="option.key"
                :label="option.value"
                :value="option.key"
              />
            </el-select>
            <!--<el-radio-group v-model="form.value">-->
            <!--  <el-radio label="单选" />-->
            <!--</el-radio-group>-->
          </template>
          <template v-if="form.controlType === 'CHECKBOX'">
            <el-select
              v-model="form.value"
              filterable
            >
              <el-option
                v-for="(option) of form.optionList"
                :key="option.value"
                :label="option.key"
                :value="option.value"
                multiple
              />
            </el-select>
            <!--<el-checkbox-group v-model="form.value">-->
            <!--  <el-checkbox label="多选" />-->
            <!--</el-checkbox-group>-->
          </template>

          <template v-if="form.controlType === 'CASCADE_SELECT'">
            <el-cascader
              :options="form.optionList"
              :props="cascadeProps"
              :show-all-levels="false"
              @change="handleCascaderChange($event ,form)"
            />
          </template>
        </el-form-item>

        <etm-font-icon
          v-if="index === 0"
          name="plus"
          @click.native="addForms"
        />
        <etm-font-icon
          v-else
          name="minus"
          @click.native="removeForms(index)"
        />
      </el-form-item>
      <el-form-item
        style="display: block;
  margin-bottom: 16px;"
      >
        <div class="btn-box">
          <el-button
            type="primary"
            @click="query"
          >
            查询
          </el-button>
          <el-button
            plain
            @click="reset"
          >
            重置
          </el-button>
        </div>
      </el-form-item>
    </etm-form>
  </div>
</template>

<script>
import { queryFields } from '@/api/newDaycare/childManage'

/**
 * searchField create by haijinsha
 * createTime 2020/8/26 11:26
 */
export default {
  name: 'SearchField',
  components: {},
  filters: {},
  mixins: [],
  props: {
    category: {
      type: String,
      required: true
    }
  },
  data () {
    return {
      // 可选字段下拉
      formsFields: [],
      forms: [
        {
          // 字段枚举
          field: '',
          // 操作符下拉
          operationList: [],
          // 操作符值
          operationValue: '',
          // 控件类型
          controlType: 'INPUT',
          // 控件值
          value: null
        }
      ],
      fields: [],
      // 级联配置
      cascadeProps: {
        checkStrictly: true,
        emitPath: false,
        value: 'key',
        label: 'value',
        children: 'childList'
      }
    }
  },
  computed: {},
  watch: {},
  created () {
  },
  mounted () {
    queryFields({ category: this.category }).then(res => {
      this.fields = res.data.fieldList
      this.formsFields = this.fields.map(item => {
        return {
          label: item.label,
          value: item.field
        }
      })
      this.$emit('change', res.data.quickList)
    })
  },
  methods: {
    addForms () {
      this.forms.push({ controlType: 'INPUT', operationValue: '', operationList: [], field: '', value: null })
    },
    removeForms (index) {
      this.forms.splice(index, 1)
    },
    fieldChange (item, index) {
      const { operationList, controlType, optionList } = this.fields.find(field => field.field === item.field)
      item.operationList = operationList
      item.controlType = controlType

      item.optionList = optionList
      item.value = null
      item.operationValue = operationList.length && operationList[0].operation

      /**
       * @param {object} item.childList
       */
      function re (item) {
        if (item.childList.length) {
          for (const childListElement of item.childList) {
            re(childListElement)
          }
        } else {
          item.childList = null
        }
        return item
      }
      if (item.controlType === 'CASCADE_SELECT') {
        item.optionList = item.optionList.map(item => {
          return re(item)
          // if (item.childList.length === 0) {
          //   item.childList = null
          // } else {
          //   item.childList.forEach(it => {
          //     if (it.childList.length === 0) {
          //       it.childList = null
          //     }
          //   })
          // }
          // return item
        })
      }
      return item
    },
    handleCascaderChange (value, form) {
      form.value = value
    },
    query () {
      const tempArr = []
      this.forms.forEach(item => {
        item.field && tempArr.push(item)
      })
      const result = tempArr.map(item => {
        return {
          field: item.field,
          operation: item.operationValue,
          value: item.value || null
        }
      })
      this.$emit('query', result)
    },
    reset () {
      this.forms = []
      this.addForms()
      this.$emit('reset')
    }
  }
}
</script>
<style lang="scss" scoped>
  .searchField-wrap {
    align-items: flex-start;
    display: flex;

    .title {
      color: $color-title;
      margin-right: 8px;
      padding-top: 6px;
      white-space: nowrap;
    }

    ::v-deep {
      .EtmForm-wrap {
        flex: 1;

        .el-form-item {
          width: 50%;
        }

        .el-form-content {
          .el-form-item__content {
            align-items: center;
            display: flex;

            > * {
              flex: auto;
            }
          }
        }
      }

      .btn-box {
        font-size: 0;

        .el-button:last-child {
          margin-left: 16px;
        }
      }
    }
  }
</style>
