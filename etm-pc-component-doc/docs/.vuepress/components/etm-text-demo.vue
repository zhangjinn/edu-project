<template>
    <div class="etm-form-demo-wrap">

        <high-code :code="code" :description="description">
            <etm-text type="normal">普通</etm-text>
            <etm-text type="primary">详情</etm-text>
            <etm-text type="danger">删除</etm-text>
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
      tableData: [
        {
          param: 'type',
          description: '显示文字按钮的颜色',
          type: 'String',
          option: `normal/primary/danger`,
          default: `normal`
        }
      ],
      code: `
        <etm-text type="normal">普通</etm-text>
        <etm-text type="primary">详情</etm-text>
        <etm-text type="danger">删除</etm-text>
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
