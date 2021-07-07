<template>
  <div class="EtmToolBar-wrap">
    <el-form inline class="clearfix">
      <el-form-item v-for="(item,index) of formData" :key="index">
        <!--输入框-->
        <template v-if="item.type === 'input'">
          <span class="label">{{ item.label }}</span>
          <el-input v-model="item.value" v-bind="{...item.props}" v-on="{...item.events}" @change="change" />
        </template>

        <!--下拉框-->
        <template v-if="item.type === 'select'">
          <span class="label">{{ item.label }}</span>
          <el-select v-model="item.value" v-bind="{...item.props}" v-on="{...item.events}" @change="change">
            <el-option v-for="(option, i) of item.options" :key="i" :label="option.label" :value="option.value" />
          </el-select>
        </template>

        <!--日期-->
        <template v-if="item.type === 'date'">
          <span class="label">{{ item.label }}</span>
          <el-date-picker v-model="item.value" value-format="yyyy-MM-dd" v-bind="{...item.props}" v-on="{...item.events}" @change="change" />
        </template>

        <!--时间-->
        <template v-if="item.type === 'time'">
          <span class="label">{{ item.label }}</span>
          <el-time-select v-model="item.value" value-format="HH:mm:ss" v-bind="{...item.props}" v-on="{...item.events}" @change="change" />
        </template>

      </el-form-item>

      <el-form-item>
        <slot />
      </el-form-item>

      <el-form-item>
        <slot name="right" />
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
/**
   *  2020/4/15 16:23
   *  haijinsha
   */
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
            input: (e) => {
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
  },
  methods: {
    handleData() {
      return this.formData.map(item => {
        console.log('---------')
        return { [item.prop]: item.value }
      })
    },
    change(e) {
      this.$emit('search', { ...this.handleData() })
    }
  }
}
</script>

<style lang="scss" scoped>
  .EtmToolBar-wrap {
    padding: 16px 24px;

    & /deep/ .el-input, .el-select, .el-date-editor {
      width: 280px;
    }

    & /deep/ .el-form-item {
      margin-bottom: 0;
      margin-right: 24px;

      &:last-child {
        float: right;
        margin-right: 0;
      }
    }

    .label {
      margin-right: 10px;
    }
  }
</style>
