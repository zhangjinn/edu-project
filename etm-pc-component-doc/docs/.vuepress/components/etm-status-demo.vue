<template>
    <div class="etm-form-demo-wrap">

        <high-code :code="code" :description="description">
            <etm-status type="primary">主题色</etm-status>
            <br>
            <etm-status type="danger">危险</etm-status>
            <br>
            <etm-status type="active">启用</etm-status>
            <br>
            <etm-status type="inactive">禁用</etm-status>
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
          param: 'type',
          description: '用于字段不用状态时使用',
          type: 'String',
          option: 'primary, danger, active, inactive',
          default: 'active'
        }
      ],
      code: `
        <etm-status type="primary">主题色</etm-status>
        <br>
        <etm-status type="danger">危险</etm-status>
        <br>
        <etm-status type="active">启用</etm-status>
        <br>
        <etm-status type="inactive">禁用</etm-status>
      `,
      description: '一般用于表格中的列的状态使用'
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
