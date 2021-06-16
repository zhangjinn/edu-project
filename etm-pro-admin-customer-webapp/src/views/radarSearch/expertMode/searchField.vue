<template>
  <div class="searchField-wrap">
    <div class="precondition">
      <span class="title">快速搜索:</span>
      <div class="tag-content">
        <el-tag
          v-for="tag in presetScanConditionsOptions"
          :id="tag.value"
          :key="tag.value"
          :class="{'active':presetScanConditions===tag.value}"
          closable
          @click="presetScanConditionsChange(tag.value)"
          @close="removeDomain(tag)"
        >
          {{ tag.label }}
        </el-tag>
      </div>
    </div>

    <div class="scanCondition">
      <span class="title">扫描条件:</span>
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
              :disabled="index===0"
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
              @change="operationChange(form, index, $event)"
            >
              <el-option
                v-for="(item) of form.operationList"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>

          <el-form-item>
            <el-select
              v-model="form.controlValue"
              @change="controlChange(form, index, $event)"
            >
              <el-option
                v-for="(item) of form.controlList"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
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
          style="margin-bottom: 16px;display: block"
        >
          <div class="btn-box">
            <el-button
              type="primary"
              @click="query"
            >
              扫描客户画像
            </el-button>
            <el-button
              plain
              @click="save"
            >
              保存并扫描
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

    <!--保存预设扫描条件弹框-->
    <etm-pop
      :visible="popAddVisible"
      pop="simple"
      title="保存搜索条件"
      confirm-btn="确定"
      cancel-btn="取消"
      @close="popAddVisible = false"
      @cancel="popAddVisible = false"
      @confirm="popAddConfirm"
    >
      <div class="popContent">
        <etm-form
          ref="addPresetScanConditionsForm"
          :model="addPresetScanConditionsForm"
          type="dialog"
        >
          <el-form-item
            label="条件名称"
            prop="name"
            :rules="formValidate.nullValueRule(true,'请输入条件名称')"
          >
            <el-input
              v-model="addPresetScanConditionsForm.name"
              maxlength="12"
              placeholder="请输入条件名称"
            />
          </el-form-item>
        </etm-form>
      </div>
    </etm-pop>
  </div>
</template>

<script>
import formValidate from '@/utils/rules'
import {
  expertScanProperties
} from '../data'

import {
  saveQueryCondition,
  queryQueryCondition,
  removeQueryCondition
} from '@/api/radarSearch'
import baseMixin from '@/layout/mixin/baseMixin'
import { queryAreaListByCode } from '@/api/base/base'

export default {
  name: 'SearchField',
  filters: {},
  mixins: [baseMixin],
  props: {
    cityCode: {
      type: [String, Number],
      default () {
        return ''
      }
    }
  },
  data () {
    return {
      formValidate,
      popVisible: false,
      popAddVisible: false,
      // 全部的预设扫描条件列表
      presetScanConditionsList: {},
      presetScanConditions: '',
      presetScanConditionsOptions: [],

      addPresetScanConditionsForm: {
        name: ''
      },

      // 第一列可选字段下拉
      formsFields: [],
      forms: [
        {
          // 第一列字段枚举
          keyValue: '地理属性',
          key: 'areaParam',

          // 第二列下拉列表
          operationList: [],
          // 第二列字段枚举
          operationValue: '距离范围',
          operationKey: 'distance',

          // 第三列下拉列表
          controlList: [],
          // 第三列字段枚举
          controlValue: 'SAME_CITY',
          controlLabel: '同城'
        }
      ],
      queryCondition: {}
    }
  },
  watch: {
    cityCode: {
      handler (cityCode) {
        cityCode && this.reverseArea(cityCode)
      },
      immediate: true
    }
  },
  created () {
    this.formsFields = expertScanProperties.map((val) => {
      return {
        value: val.value,
        label: val.label
      }
    })
    this.initScanCondition()
    this.queryQueryConditionData()
  },
  mounted () {

  },
  methods: {
    initScanCondition () {
      this.presetScanConditions = ''
      this.forms[0].operationList = expertScanProperties.filter(item => item.value === this.forms[0].keyValue)[0].children
      this.forms[0].controlList = this.forms[0].operationList.filter(item => item.value === this.forms[0].operationValue)[0].children
    },
    reverseArea (cityCode) {
      queryAreaListByCode({ code: cityCode }).then(res => {
        const area = this.convertDataToOptions(res.data, 'name', 'code')
        expertScanProperties[0].children[1].children = area
      })
    },
    addForms () {
      this.forms.push(
        {
          keyValue: '',
          key: '',
          operationList: [],
          operationValue: '',
          operationKey: '',
          controlList: [],
          controlValue: '',
          controlLabel: ''
        }
      )
    },

    removeForms (index) {
      this.forms.splice(index, 1)
    },

    fieldChange (item, index, e) {
      item.operationList = []
      item.operationValue = ''
      item.controlList = []
      item.controlValue = ''
      item.controlLabel = ''

      expertScanProperties.forEach((val) => {
        if (item.keyValue === val.value) {
          item.operationList = val.children
          item.key = val.key
        }
      })

      return item
    },

    operationChange (item, index, e) {
      item.controlList = []
      item.controlValue = ''
      item.controlLabel = ''
      expertScanProperties.forEach((val) => {
        if (item.keyValue === val.value) {
          val.children.forEach((v) => {
            if (item.operationValue === v.value) {
              item.controlList = v.children
              if (v.key) {
                item.operationKey = v.key
              }
            }
          })
        }
      })
      return item
    },

    controlChange (item, index, e) {
      item.controlList.forEach((val) => {
        if (item.controlValue === val.value) {
          item.controlLabel = val.label
        }
      })
      return item
    },

    queryQueryConditionData () {
      queryQueryCondition().then((res) => {
        this.presetScanConditionsList = res.data
        this.presetScanConditionsOptions = this.convertDataToOptions(res.data, 'name', 'id')
      })
    },

    presetScanConditionsChange (id) {
      this.presetScanConditions = id
      this.presetScanConditionsList.forEach((val) => {
        if (this.presetScanConditions === val.id) {
          const queryCondition = val.queryCondition
          const areaParam = []
          const userParam = []
          const appType = []
          const consumption = []
          const flightTag = []

          if (queryCondition.userParam) {
            queryCondition.userParam.map((v) => {
              userParam.push(Fn1(v, '用户属性', 'userParam'))
            })
          }
          if (queryCondition.areaParam) {
            queryCondition.areaParam.map((v) => {
              areaParam.push(Fn1(v, '地理属性', 'areaParam'))
            })
          }
          if (queryCondition.appType) {
            queryCondition.appType.map((v) => {
              appType.push(Fn2(v, 'APP使用属性', 'appType', 'secondAppType'))
            })
          }
          if (queryCondition.consumption) {
            queryCondition.consumption.map((v) => {
              consumption.push(Fn2(v, '消费属性', 'consumption', 'secondConsumption'))
            })
          }
          if (queryCondition.flightTag) {
            queryCondition.flightTag.map((v) => {
              flightTag.push(Fn2(v, '出行属性', 'flightTag', 'secondFlightTag'))
            })
          }
          this.forms = [...areaParam, ...userParam, ...appType, ...consumption, ...flightTag]
        }
      })

      function Fn1 (v, keyValue, key) {
        const keyNameArrAll = Object.keys(v)
        let keyName = ''
        keyNameArrAll.forEach((vv) => {
          if (v[vv]) {
            keyName = vv
          }
        })

        const obj = {}
        obj.keyValue = keyValue
        obj.key = key
        obj.operationList = expertScanProperties.filter(item => item.value === obj.keyValue)[0].children
        obj.operationValue = obj.operationList.filter(item => item.key === keyName)[0].value
        obj.operationKey = obj.operationList.filter(item => item.key === keyName)[0].key
        obj.controlList = obj.operationList.filter(item => item.key === keyName)[0].children
        obj.controlValue = obj.controlList.filter(item => item.value === v[keyName])[0].value
        obj.controlLabel = obj.controlList.filter(item => item.value === v[keyName])[0].label
        return obj
      }

      function Fn2 (v, keyValue, key, controlKey) {
        const obj = {}
        obj.keyValue = keyValue
        obj.key = key
        obj.operationList = expertScanProperties.filter(item => item.value === obj.keyValue)[0].children
        obj.operationValue = v[key]
        obj.operationKey = ''
        obj.controlList = obj.operationList.filter(item => item.value === v[key])[0].children
        obj.controlValue = v[controlKey]
        obj.controlLabel = v[controlKey]
        return obj
      }
    },

    parameterFormat () {
      const areaParam = []
      const userParam = []
      const appType = []
      const consumption = []
      const flightTag = []

      this.forms.forEach((val) => {
        if (val.keyValue && val.operationValue && val.controlValue) {
          if (val.key === 'userParam') {
            const obj = {}
            obj[val.operationKey] = val.controlValue
            userParam.push(obj)
          }
          if (val.key === 'areaParam') {
            const obj = {}
            obj[val.operationKey] = val.controlValue
            areaParam.push(obj)
          }
          if (val.key === 'appType') {
            const obj = {}
            obj.appType = val.operationValue
            obj.secondAppType = val.controlValue
            appType.push(obj)
          }
          if (val.key === 'consumption') {
            const obj = {}
            obj.consumption = val.operationValue
            obj.secondConsumption = val.controlValue
            consumption.push(obj)
          }
          if (val.key === 'flightTag') {
            const obj = {}
            obj.flightTag = val.operationValue
            obj.secondFlightTag = val.controlValue
            flightTag.push(obj)
          }
        }
      })
      const queryCondition = {
        areaParam,
        userParam,
        appType,
        consumption,
        flightTag
      }

      return queryCondition
    },
    query () {
      this.queryCondition = this.parameterFormat()
      this.$emit('query', this.queryCondition)
    },
    save () {
      this.queryCondition = this.parameterFormat()
      this.popAddVisible = true
    },

    reset () {
      this.forms = [
        {
          keyValue: '地理属性',
          key: 'areaParam',
          operationList: [],
          operationValue: '距离范围',
          operationKey: 'distance',
          controlList: [],
          controlValue: 'SAME_CITY',
          controlLabel: '同城'
        }
      ]
      this.initScanCondition()
      this.$emit('reset')
    },

    removeDomain (domain) {
      this.$etmTip.init({
        type: 'error',
        title: '确认删除该数据？',
        content: '删除后将无法撤销，是否继续操作？',
        confirmBtn: '删除',
        cancelBtn: '取消',
        cancel: () => {
          this.$etmTip.close()
        },
        confirm: () => {
          removeQueryCondition({
            id: domain.id
          }).then((res) => {
            this.$etmTip.close()
            this.$message.success('已删除')
            const index = this.presetScanConditionsOptions.indexOf(domain)
            if (index !== -1) {
              this.presetScanConditionsOptions.splice(index, 1)
            }
            this.queryQueryConditionData()
          }).catch(() => {
            this.$etmTip.close()
          })
        }
      })
      this.$etmTip.open()
    },

    // 保存弹窗确定
    popAddConfirm () {
      this.$refs.addPresetScanConditionsForm.$children[0].validate((valid) => {
        if (valid) {
          const formData = this.addPresetScanConditionsForm
          const param = {
            name: formData.name,
            queryCondition: this.queryCondition
          }
          saveQueryCondition(param).then((res) => {
            this.popAddVisible = false
            this.addPresetScanConditionsForm.name = ''
            this.presetScanConditions = ''
            this.$message({
              message: '已保存',
              type: 'success'
            })
            this.queryQueryConditionData()
            this.query()
          })
        }
      })
    }
  }
}
</script>
<style lang="scss" scoped>
  .searchField-wrap {

    .precondition{
      display: flex;
      align-items: baseline;
      margin-bottom: 24px;

      span{
        margin-right: 8px;
      }

      i{
        display: flex;
        align-items: center;
        justify-content: center;
        @include etm-color();
        font-size: 18px;
        cursor: pointer;
      }
    }

    .scanCondition{
      display: flex;
      align-items: flex-start;

      ::v-deep {
        .el-button+.el-button{
          margin-left: 16px;
        }

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

              .el-form-item{
                margin-bottom: 0 !important;
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

    .title {
      white-space: nowrap;
      margin-right: 8px;
      color: $color-title;
    }

    .tag-content{
      margin: -4px;

      ::v-deep .el-tag{
        border: none;
        font-size: 14px;
        font-weight: 400;
        color: #999999;
        background: rgba(#999999,0.12);
        border-radius: 2px;
        margin: 4px;
        cursor: pointer;

        &:hover, &.active{
          @include etm-color();
          @include etm-bgc-rgba();

          .el-icon-close{
            @include etm-color();

            &:hover{
              background: transparent;
              color: #F5222D;
            }
          }
        }

        .el-icon-close{
          font-size: 16px;
          color: #999999;

        }
      }
    }

  }

  .popContent{
    ::v-deep .el-form-item{

      .el-form-item__content{
        display: flex;
        align-items: center;
        margin-left: 0 !important;
      }

      i{
        margin-left: 8px;
      }

    }
  }
</style>
