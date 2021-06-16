<template>
    <div class="etm-form-demo-wrap">

        <high-code :code="code" :description="description">
            <div class="block">
                <etm-layout-split>
                    <div slot="header">上部</div>
                    <div slot="body">下部</div>
                </etm-layout-split>
            </div>

            <div class="block">
                <etm-layout-split>
                    <div slot="left">左侧</div>
                    <div slot="right">右侧</div>
                </etm-layout-split>
            </div>

            <div class="block">
                <etm-layout-split>
                    <div>默认布局</div>
                </etm-layout-split>
            </div>
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
  name: 'etm-layout-split-demo',
  components: {HighCode, ParamsTable},
  filters: {},
  mixins: [],
  props: {},
  data() {
    return {
      value: '',
      tableData: [
        {
          param: 'slot',
          description: '左右布局',
          type: 'slot',
          option: 'left,right',
          default: ''
        },
        {
          param: 'slot',
          description: '上下布局',
          type: 'slot',
          option: 'header, body',
          default: ''
        },
        {
          param: 'slot',
          description: '默认布局',
          type: 'slot',
          option: '',
          default: ''
        },
        {
          param: 'style',
          description: 'slot为left 左侧的宽度, 默认最小为200px, 最大为50%',
          type: 'css Unit',
          option: 'px/%..',
          default: 'minWidth: 200px, maxWidth: 50%'
        }
      ],
      code: `
        <etm-layout-split>
            <div slot="header">上部</div>
            <div slot="body">下部</div>
        </etm-layout-split>

        <etm-layout-split>
            <div slot="left">左侧</div>
            <div slot="right">右侧</div>
        </etm-layout-split>

        <etm-layout-split>
            <div>默认布局</div>
        </etm-layout-split>
        `,
      description: '主要布局组件, 默认设置为padding: 16px 16px 0 16px, 要求插入到该组件里的子组件留一个padding-bottom:16px'
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

        .block {
            padding: 12px;
            margin-bottom: 24px;
            background-color: #cccccc;
        }
    }
</style>
