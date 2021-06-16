<template>
    <div class="etm-form-demo-wrap">
        <high-code :code="code" :description="description">
          <etm-screen-tab v-model="value1" title="单选" :options="options" @change="change()" />
          <etm-screen-tab v-model="value2" title="多选" multiple :options="options" @change="change()" />
          <etm-screen-tab v-model="value3" title="多选(选择性禁用)" multiple :options="selectOptions" @change="change()" />
          <etm-screen-tab v-model="value4" title="多选(全部禁用快捷方式)" disabled multiple :options="options" @change="change()" />
        </high-code>
        <params-table :table-data="tableData"/>
    </div>
</template>

<script>
import ParamsTable from "./base/ParamsTable";
import HighCode from "./base/highCode";

/**
 * etm-form-demo create by haijinsha
 * createTime 2020/6/29 13:01
 */
export default {
  name: 'etm-form-demo',
  components: {HighCode, ParamsTable},
  filters: {},
  mixins: [],
  props: {},
  data() {
    return {
      value1: '',
      value2: [],
      value3: ['1'],
      value4: ['1'],
      options: [
        {
            name: '同区',
            value: 'SAME_DISTRICT'
        },
        {
            name: '同城',
            value: 'SAME_CITY'
        },
        {
            name: '1公里内',
            value: 'ONEKILOMETER'
        },
        {
            name: '3公里内',
            value: 'THREEKILOMETER'
        },
        {
            name: '5公里内',
            value: 'FIVEKILOMETER'
        }
      ],
      selectOptions: [
        {
          name: '同区',
          value: 'SAME_DISTRICT',
          disabled: true
        },
        {
          name: '同城',
          value: 'SAME_CITY',
          disabled: true
        },
        {
          name: '1公里内',
          value: 'ONEKILOMETER'
        },
        {
          name: '3公里内',
          value: 'THREEKILOMETER'
        },
        {
          name: '5公里内',
          value: 'FIVEKILOMETER'
        }
      ],
      tableData: [
        {
          param: 'v-model',
          description: '绑定值',
          type: 'Array/String/Number',
          option: '--',
          default: '--'
        },
        {
          param: 'options',
          description: '选项列表',
          type: 'Object[]',
          option: '[{name:选项名称, value:选项枚举, disabled:是否禁用(选择性禁用)}]',
          default: '--'
          },
          {
            param: 'title',
            description: '标题',
            type: 'String',
            option: '--',
            default: '--'
          },
          {
            param: 'multiple',
            description: '是否多选',
            type: 'Boolean',
            option: '--',
            default: 'false'
          },
          {
            param: 'disabled',
            description: '是否禁用(全部禁用)',
            type: 'Boolean',
            option: '--',
            default: 'false'
          },
          {
            param: 'change',
            description: '绑定值变化时触发的事件,回调值为选中枚举',
            type: 'Function',
            option: '--',
            default: '--'
          }
      ],
      code: `
        <etm-screen-tab v-model="value1" title="单选" :options="options" @change="change" />
        <etm-screen-tab v-model="value2" title="多选" multiple :options="options" @change="change" />
        <etm-screen-tab v-model="value3" title="多选(选择性禁用)" multiple :options="selectOptions" @change="change()" />
        <etm-screen-tab v-model="value4" title="多选(全部禁用快捷方式)" disabled multiple :options="options" @change="change()" />
      `,
      description: '一般用于快捷筛选，单选，多选'
    }
  },
  computed: {},
  watch: {},
  created() {
  },
  mounted() {
  },
  methods: {
      change(val) {
        console.log(val)
      }
  }
}
</script>
<style lang="scss" scoped>
    .etm-form-demo-wrap {

    }
</style>
