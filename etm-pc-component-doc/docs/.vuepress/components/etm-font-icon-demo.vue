<template>
    <div class="etm-form-demo-wrap">
        <high-code :code="code" :description="description">
            <etm-font-icon name="plus"/>
            <br>
            <etm-font-icon name="minus"/>
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
      value: '',
      tableData: [
        {
          param: 'name',
          description: '用于添加删减的字体图标',
          type: 'String',
          option: 'plus, minus',
          default: 'plus'
        }
      ],
      code: `
        <etm-font-icon name="plus"/>
        <etm-font-icon name="minus"/>
      `,
      description: '一般用于表单动态添加删除的图标'
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
