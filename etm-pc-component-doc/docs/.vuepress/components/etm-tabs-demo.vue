<template>
    <div class="etm-form-demo-wrap">

        <high-code :code="code" :description="description">
            <etm-tabs v-model="tab1" :setting="false" :show-toggle="false">
                <el-tab-pane label="tab1" name="tab1">
                    <etm-tool-bar v-model="FormData"></etm-tool-bar>
                </el-tab-pane>
                <el-tab-pane label="tab2" name="tab2">
                    <div v-show="tab1 === 'tab2'">tab2</div>
                </el-tab-pane>
            </etm-tabs>

            <etm-hr></etm-hr>

            <etm-tabs setting v-model="tab1">
                <el-tab-pane label="tab1">
                    tab1
                </el-tab-pane>
                <el-tab-pane label="tab2">
                    tab2
                </el-tab-pane>
            </etm-tabs>
        </high-code>
        <params-table :table-data="tableData"/>
    </div>

</template>

<script>
import ParamsTable from "./base/ParamsTable";
import HighCode from "./base/highCode";
import EtmHr from "./base/etm-hr";

/**
 * etm-form-demo create by haijinsha
 * createTime 2020/6/29 13:01
 */
export default {
  name: 'etm-form-demo',
  components: {EtmHr, HighCode, ParamsTable},
  filters: {},
  mixins: [],
  props: {},
  data() {
    return {
      value: '',
      tab1: 'tab1',
      tab2: 'tab1',
      FormData: [
        {
          type: 'input',
          label: '姓名',
          value: ''
        },
        {
          type: 'select',
          value: '',
          label: '性别'
        }
      ],
      tableData: [
        {
          param: 'setting',
          description: '显示应用设置按钮',
          type: 'Boolean',
          option: `true/false`,
          default: `false`
        },
        {
          param: 'settingText',
          description: '应用设置的文字',
          type: 'String',
          option: `String`,
          default: '应用设置'
        },
        {
          param: 'openText',
          description: '展开筛选的文字',
          type: 'String',
          option: `String`,
          default: '展开筛选'
        },
        {
          param: 'closeText',
          description: '收起筛选的文字',
          type: 'String',
          option: `String`,
          default: '收起筛选'
        },
        {
          param: 'showToggle',
          description: '显示展开收起按钮',
          type: 'Boolean',
          option: `true/false`,
          default: 'true'
        },
        {
          param: 'toggle',
          description: '切换时的事件',
          type: 'Function',
          option: `Function`,
          default: '-'
        },
        {
          param: 'setting',
          description: '应用设置的事件',
          type: 'Function',
          option: `Function`,
          default: '-'
        }
      ],
      code: `
        <etm-tabs v-model="tab1" :setting="false" :show-toggle="false">
                <el-tab-pane label="tab1" name="tab1">
                    <etm-tool-bar v-model="FormData"/>
                </el-tab-pane>
                <el-tab-pane label="tab2" name="tab2">
                    <div v-show="tab1 === 'tab2'">tab2</div>
                </el-tab-pane>
            </etm-tabs>

            <etm-tabs setting v-model="tab1">
                <el-tab-pane label="tab1">
                    tab1
                </el-tab-pane>
                <el-tab-pane label="tab2">
                    tab2
                </el-tab-pane>
            </etm-tabs>
      `,
      description: '',
      data: []
    }
  },
  computed: {},
  watch: {},
  created() {
  },
  mounted() {
  },
  methods: {}
}
</script>
<style lang="scss" scoped>
    .etm-form-demo-wrap {

    }
</style>
