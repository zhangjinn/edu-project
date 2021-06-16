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
            v-model="form.keyValue"
            @change="fieldChange(form, index, $event)"
          >
            <el-option
              v-for="(field) of formsFields"
              :key="field.value"
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
              v-for="(item) of form.operationList"
              :key="item.operation"
              :label="item.label"
              :value="item.operation"
            />
          </el-select>
        </el-form-item>

        <el-form-item v-if="form.operationValue !== 'IS_NULL' && form.operationValue !== 'IS_NOT_NULL'">
          <!--枚举: INPUT,RADIO,CHECKBOX,SELECT,DATE_PICKER-->
          <template v-if="form.controlType === 'INPUT_BOX'">
            <el-input v-model="form.value" />
          </template>
          <template v-if="form.controlType === 'SELECT_BOX'">
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
          <template v-if="form.controlType === 'DATE'">
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
          </template>
          <template v-if="form.controlType === 'CHECKBOX'">
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
          </template>

          <!--          <template v-if="form.controlType === 'AREA_BOX'">-->
          <!--            <el-select v-model="form.value" filterable>-->
          <!--              <el-option v-for="(option) of form.optionList" :key="option.value" multiple :label="option.key" :value="option.value" />-->
          <!--            </el-select>-->
          <!--          </template>-->
          <template v-if="form.controlType === 'CASCADE_SELECT_BOX'">
            <el-select
              v-model="form.value"
              filterable
            >
              <el-option
                v-for="(option) of form.optionList"
                :key="option.value"
                multiple
                :label="option.key"
                :value="option.value"
              />
            </el-select>
          </template>

          <template v-if="form.controlType === 'AREA_BOX'">
            <!--            <el-select v-model="form.value" filterable>-->
            <!--              <el-option v-for="(option) of form.optionList" :key="option.value" multiple :label="option.key" :value="option.value" />-->
            <!--            </el-select>-->
            <div style="min-width:280px">
              <etm-address
                v-model="form.value"
                :area-id="form.value"
                @provinceChange="change($event, 'province', index)"
                @cityChange="change($event, 'city', index)"
                @areaChange="change($event, 'region', index)"
              />
            </div>
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
        v-if="showButton"
        style="margin-bottom: 16px;display: block"
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
// import { queryFields } from '@/api/daycare/childManage'
import EtmAddress from '@/views/base/org/EtmAddress'
import {
  queryCoutomerFields
} from '@/api/customer'

/**
 * searchField create by haijinsha
 * createTime 2020/8/26 11:26
 */
export default {
  name: 'SearchField',
  components: {
    EtmAddress
  },
  filters: {},
  mixins: [],
  props: {
    category: {
      type: String,
      required: true
    },
    showButton: {
      type: Boolean,
      default: true
    },
    pool: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      address: {},
      // 可选字段下拉
      formsFields: [],
      columns_system: {
        avatar: '客户头像',
        name: '客户名称',
        birthday: '出生日期',
        mark: '标签',
        province: '地区',
        telephone: '客户电话',
        state: '状态',
        contactRelationship: '联系人关系',
        contactTelephone: '联系人电话',
        gender: '性别',
        contactName: '联系人姓名',
        importantLevel: '重要程度',
        abandoner: '放弃人',
        source: '来源',
        lastFollowTime: '最后跟进时间',
        marketer: '市场人员',
        counselor: '跟进人员',
        nextFollowTime: '下次跟进时间',
        salesStage: '销售阶段',
        age: '年龄'
      },
      op: {
        AND: '并且',
        OR: '或者',
        IS: '等于',
        NOT: '不等于',
        LIKE: '包含',
        NOTLIKE: '不包含',
        GE: '大于',
        LE: '小于'
      },
      forms: [
        {
          // 字段枚举
          keyValue: '',
          field: null,
          key: null,
          // 操作符下拉
          operationList: [],
          // 操作符值
          operationValue: '',
          // 控件类型
          controlType: 'INPUT_BOX',
          // 控件值
          value: null
        }
      ],
      fields: []
    }
  },
  computed: {},
  watch: {},
  created () {
  },
  mounted () {
    // queryFields({ category: this.category }).then(res => {
    //   this.fields = res.data.fieldList
    //   this.formsFields = this.fields.map(item => {
    //     return {
    //       label: item.label,
    //       value: item.field
    //     }
    //   })
    //   this.$emit('change', res.data.quickList)
    // })

    queryCoutomerFields().then(res => {
      let hasProvince = true
      const result = []
      res.data.forEach(cur => {
        if (cur.field === 'province' && hasProvince) {
          result.push(cur)
          hasProvince = false
        } else if (cur.field !== 'province') {
          result.push(cur)
        }
      })

      this.formsFields = result.map((item, index) => {
        const key = item.field ? 'field__' : 'key__'
        result[index].keyValue = key + (item.field || item.key)
        return {
          label: item.name || this.columns_system[item.field],
          value: key + (item.field || item.key)
        }
      })

      this.fields = result
    })
  },
  methods: {
    change (e, add, index) {
      if (this.address[index]) {
        this.address[index][add] = e
      } else {
        this.address[index] = {
          province: null,
          area: null,
          region: null
        }

        this.address[index][add] = e
      }
    },
    addForms () {
      this.forms.push({ controlType: 'INPUT_BOX', keyValue: '', operationValue: '', key: null, operationList: [], field: null, value: null })
    },
    removeForms (index) {
      this.forms.splice(index, 1)
    },
    fieldChange (item, index, e) {
      const current = this.fields.filter(i => i.keyValue === e)[0]
      const keyValue = e.split('__')
      item.controlType = current.controlType
      this.forms[index][keyValue[0]] = keyValue[1]
      const operationList = current.op.map(cur => {
        return {
          label: this.op[cur],
          operation: cur
        }
      })
      item.operationList = operationList
      item.optionList = (current.options || []).map(cur => {
        return {
          key: cur.id,
          value: cur.label
        }
      })
      item.value = ''
      item.operationValue = operationList.length && operationList[0].operation

      return item
    },
    query () {
      const tempArr = []
      this.forms.forEach((item, index) => {
        (item.field || item.key) && tempArr.push({ ...item, index })
      })

      const result = []
      tempArr.forEach(item => {
        if (item.field === 'province') {
          Object.keys(this.address[item.index] || {}).forEach(cur => {
            if (this.address[item.index][cur]) {
              result.push({
                field: cur,
                op: item.operationValue,
                val: this.address[item.index][cur]
              })
            }
          })
        } else {
          if (item.value) {
            result.push({
              field: item.field || null,
              key: item.key || null,
              op: item.operationValue,
              val: item.value || null
            })
          }
        }
      })
      this.$emit('query', result)

      return result
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
    display: flex;
    align-items: flex-start;

    .title {
      white-space: nowrap;
      padding-top: 6px;
      margin-right: 8px;
      color: $color-title;
    }

    ::v-deep {
      .EtmForm-wrap {
        flex: 1;

        .el-form-item {
          width: 50%;
        }

        .el-form-content {
          .el-form-item__content {
            display: flex;
            align-items: center;

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
