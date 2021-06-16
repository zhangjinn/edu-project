<template>
  <div class="EtmToolBar-wrap">
    <el-form inline @submit.native.prevent>
      <el-form-item v-for="(item,index) of formData" :key="index">
        <!--输入框-->
        <template v-if="item.type === 'input'">
          <span class="label">{{ item.label }}:</span>
          <el-input v-model="item.value" v-bind="{...item.props}" v-on="{...item.events}" @change="change" />
        </template>

        <!--下拉框-->
        <template v-if="item.type === 'select'">
          <span class="label">{{ item.label }}:</span>
          <el-select v-model="item.value" v-bind="{...item.props}" v-on="{...item.events}" @change="change">
            <el-option v-for="(option, i) of item.options" :key="i" :label="option.label" :value="option.value" />
          </el-select>
        </template>

        <!--日期-->
        <template v-if="item.type === 'date'">
          <span class="label">{{ item.label }}:</span>
          <el-date-picker v-model="item.value" value-format="yyyy-MM-dd" v-bind="{...item.props}" v-on="{...item.events}" @change="change" />
        </template>

        <!--时间-->
        <template v-if="item.type === 'time'">
          <span class="label">{{ item.label }}:</span>
          <el-time-select v-model="item.value" value-format="HH:mm:ss" v-bind="{...item.props}" v-on="{...item.events}" @change="change" />
        </template>

      </el-form-item>

      <template v-if="$slots.default">
        <slot />
      </template>

      <el-form-item>
        <el-button type="primary" @click="search">{{ queryBtn }}</el-button>
        <el-button plain style="margin-left: 16px;" @click="reset">{{ resetBtn }}</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>/**
 *  2020/4/15 16:23
 *  haijinsha
 */
import { parseTime } from '../../utils/tool'

export default {
  name: 'EtmToolBar',
  filters: {},
  mixins: [],
  props: {
    value: {
      type: [Object, Array],
      default() {
        return {}
      }
    },
    queryBtn: {
      type: String,
      default: '查询'
    },
    resetBtn: {
      type: String,
      default: '重置'
    }
  },
  data() {
    return {
      formData: this.value,
      exampleData: [
        {
          label: '课程',
          type: 'input',
          value: '',
          props: {
            placeholder: '请输入课程名称'
          },
          events: {
            click: (e) => {
              alert(e)
            },
            input: () => {
              this.$message.success('1123123')
            }
          }
        },
        {
          label: '类型',
          type: 'select',
          value: '',
          options: [
            {
              label: '测试1',
              value: '1'
            },
            {
              label: '测试2',
              value: '1'
            }
          ]
        }
      ]
    }
  },
  computed: {},
  watch: {},
  created() {
  },
  mounted() {
    this.init()
  },
  methods: {
    init() {
      this.formData.forEach(item => {
        item.value = item.value || item.default
        if (item.props && item.props.type === 'daterange' && item.default) {
          if (item.default.length !== 2) {
            console.warn('日期范围需要两个日期参数 [Date1, Date2]')
          }
          item.props.rangeSeparator = item.props.rangeSeparator || '-'
          item.default = item.default || [new Date(), new Date()]
          item.value = [parseTime(item.default[0], '{y}-{m}-{d}'), parseTime(item.default[1], '{y}-{m}-{d}')]
        } else if (item.type === 'date' && item.default) {
          if (item.default.length !== 1) {
            console.warn('日期需要一个日期参数 [Date1]')
          }
          item.default = item.default || new Date()
          item.value = parseTime(item.default, '{y}-{m}-{d}')
        }
      })
    },
    handleData() {
      return this.formData.filter(item => {
        if (Array.isArray(item.value)) {
          return item.value.length > 0 ? { [item.prop]: item.value } : ''
        } else {
          return item.value ? { [item.prop]: item.value } : ''
        }
      })
    },
    change(e) {
      this.$emit('change', e)
    },
    search() {
      this.$emit('search', this.handleData())
    },
    reset() {
      this.$emit('reset')
      this.formData.forEach(item => {
        item.value = item.default
      })
    }
  }
}
</script>

<style lang="scss">
    @import "../../styles/src/etm/toolBar";
</style>
