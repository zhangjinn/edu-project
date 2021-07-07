<template>
  <div class="index-wrap">
    <etm-layout-split>
      <div slot="header">
        <etm-tabs v-model="activeName" setting @toggle="toggle" @setting="setting">
          <el-tab-pane label="晨午检统计" name="bodyCheckTotal">
            <etm-tool-bar v-show="show" v-model="formData1" @search="search('body-check-total', formData1)" />
          </el-tab-pane>
          <el-tab-pane label="异常统计" name="abnormalTotal">
            <etm-tool-bar v-show="show" v-model="formData2" @search="search('abnormal-total',formData2)" />
          </el-tab-pane>
          <el-tab-pane label="个人检测记录" name="personalTotal">
            <etm-tool-bar v-show="show" v-model="formData3" @search="search('personal-total', formData3)" />
          </el-tab-pane>
        </etm-tabs>
      </div>
      <div slot="body">
        <keep-alive>
          <body-check-total v-if="activeName === 'bodyCheckTotal'" ref="body-check-total" />
          <abnormal-total v-if="activeName === 'abnormalTotal'" ref="abnormal-total" />
          <personal-total v-if="activeName === 'personalTotal'" ref="personal-total" />
        </keep-alive>

      </div>
    </etm-layout-split>

  </div>
</template>

<script>
import baseMixin from '@/layout/mixin/baseMixin'
import BodyCheckTotal from '@/views/sacc/bodyCheck/components/bodyCheckTotal'
import AbnormalTotal from '@/views/sacc/bodyCheck/components/abnormalTotal'
import PersonalTotal from '@/views/sacc/bodyCheck/components/personalTotal'
import { getEnumKeyByValue } from '@/enums'
import { parseTime } from '@/utils'
import { queryClazzSelect } from '@/api/clazz'

/**
 *  2020/4/17 10:10
 *  haijinsha
 */
export default {
  name: 'Index',
  components: { PersonalTotal, AbnormalTotal, BodyCheckTotal },
  filters: {},
  mixins: [baseMixin],
  props: {},
  data() {
    return {
      tableHeight1: '',
      tableHeight2: '',
      tableHeight3: '',
      activeName: 'bodyCheckTotal',
      show: true,
      formData1: [
        {
          label: '检测日期',
          type: 'date',
          prop: 'date',
          value: '',
          default: parseTime(new Date(), '{y}-{m}-{d}'),
          props: {
            placeholder: '请选择检测时间',
            valueFormat: 'yyyy-MM-dd',
            clearable: false
          }
        },
        {
          label: '检测类型',
          type: 'select',
          prop: 'checkType',
          value: '',
          default: getEnumKeyByValue('晨检'),
          props: {
            placeholder: '请选择检测类型'
          },
          options: [
            {
              label: '晨检',
              value: getEnumKeyByValue('晨检')
            },
            {
              label: '午检',
              value: getEnumKeyByValue('午检')
            }
          ]
        }
      ],
      formData2: [
        {
          label: '检测日期',
          type: 'date',
          prop: 'date',
          value: '',
          default: [parseTime(new Date(), '{y}-{m}-{d}'), parseTime(new Date(), '{y}-{m}-{d}')],
          props: {
            rangeSeparator: '-',
            startPlaceholder: '开始日期',
            endPlaceholder: '结束日期',
            type: 'daterange',
            valueFormat: 'yyyy-MM-dd',
            clearable: false
          }
        },
        {
          label: '检测类型',
          type: 'select',
          prop: 'checkType',
          value: '',
          default: getEnumKeyByValue('晨检'),
          props: {
            placeholder: '请选择检测类型'
          },
          options: [
            {
              label: '晨检',
              value: getEnumKeyByValue('晨检')
            },
            {
              label: '午检',
              value: getEnumKeyByValue('午检')
            }
          ]
        }
      ],
      // 个人检测记录
      formData3: [
        {
          label: '会员姓名',
          type: 'input',
          prop: 'customerName',
          value: '',
          props: {
            placeholder: '请输入会员姓名'
          }
        },
        {
          label: '班级',
          type: 'select',
          prop: 'clazzId',
          value: '',
          props: {
            placeholder: '请选择班级'
          },
          options: []
        },
        {
          label: '检测日期',
          type: 'date',
          prop: 'date',
          value: '',
          default: [parseTime(new Date(), '{y}-{m}-{d}'), parseTime(new Date(), '{y}-{m}-{d}')],
          props: {
            type: 'daterange',
            rangeSeparator: '-',
            startPlaceholder: '开始日期',
            endPlaceholder: '结束日期',
            valueFormat: 'yyyy-MM-dd',
            clearable: false
          }
        }
      ]
    }
  },
  computed: {},
  watch: {},
  created() {
  },
  mounted() {
    queryClazzSelect().then(res => {
      this.getObjectByProp('clazzId', this.formData3).options = res.data.map(item => {
        return {
          value: item.clazzId,
          label: item.clazzName
        }
      })
    })
  },
  methods: {
    search(ref, fromData) {
      this.$refs[ref].formData = fromData
      this.$refs[ref].init()
    },
    toggle(val) {
      this.show = val
    },
    setting() {
      this.$parent.handleSwitch('setting')
    }
  }
}
</script>

<style lang="scss" scoped>
  .index-wrap {
    .block {
      height: 24px;
      width: 100%;
      @include bgc_bg_color();
    }
  }
</style>

