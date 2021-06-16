<template>
    <div class="etm-no-content-wrap">

        <high-code :code="code" :description="description">
            <etm-title>标题带色块</etm-title>
            <etm-title title="标题带色块2"/>
            <etm-title :show-line="true">标题没有色块</etm-title>
            <etm-title :show-line="false" border>标题没有色块, 带边框</etm-title>
            <etm-title show-toggle open-text="open" close-text="close" @toggle="toggle">标题带切换</etm-title>
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
          param: 'title',
          description: '标题文字',
          type: 'String',
          option: 'String',
          default: ''
        },
        {
          param: 'border',
          description: '下边框, 设置为true时就不能显示色块',
          type: 'Boolean',
          option: '',
          default: 'false'
        },
        {
          param: 'showLine',
          description: '色块',
          type: 'Boolean',
          option: '',
          default: 'true'
        },
        {
          param: 'showToggle',
          description: '显示切换按钮',
          type: 'Boolean',
          option: '',
          default: 'false'
        },
        {
          param: 'openText',
          description: '展开的文字',
          type: 'String',
          option: '',
          default: '展开'
        },
        {
          param: 'closeText',
          description: '收起的文字',
          type: 'String',
          option: '',
          default: '收起'
        }
      ],
      code: `
        <etm-title>标题带色块</etm-title>
        <etm-title title="标题带色块2"/>
        <etm-title :show-line="true">标题没有色块</etm-title>
        <etm-title :show-line="false" border>标题没有色块, 带边框</etm-title>
        <etm-title show-toggle open-text="open" close-text="close" @toggle="toggle">标题带切换</etm-title>
        `,
      description: '带色块一般用于字段小标题, 带下边框线一般用于二级页面大标题的场景'
    }
  },
  computed: {},
  watch: {},
  created() {
  },
  mounted() {
  },
  methods: {
    toggle(val) {
      alert('hi: ' + val)
    }
  }
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
