<template>
    <div class="etm-no-content-wrap">

        <high-code :code="code" :description="description">
            <etm-empty />
            <hr>
            <etm-empty empty-text="没得数据撒" />
        </high-code>
        <params-table :table-data="tableData"/>
    </div>

</template>

<script>
import ParamsTable from "./base/ParamsTable";
import HighCode from "./base/highCode";

/**
 * etm-no-content create by haijinsha
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
          param: 'emptyText',
          description: '空数据的描述文字',
          type: 'String',
          option: 'String',
          default: '暂无数据'
        },
        {
          param: 'image',
          description: '图片地址',
          type: 'String',
          option: '',
          default: '默认图'
        }
      ],
      code: `
        <etm-empty />

        <etm-empty empty-text="没得数据撒" />
        `,
      description: '主要用于表格/树等数据组件的占位图, 如无必要一般不建议更换图片, 如需更换占位图建议在组件库统一更换'
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
    .etm-no-content-wrap {

        .block {
            padding: 12px;
            margin-bottom: 24px;
            background-color: #cccccc;
        }
    }
</style>
