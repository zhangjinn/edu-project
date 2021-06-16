<template>
  <div class="el-button-demo-wrap">
    <high-code :code="code" :description="description">
      <el-button type="dashed">虚线按钮</el-button>
    </high-code>
    <params-table :table-data="attrTableData"/>
  </div>

</template>

<script>
import ParamsTable from "./base/ParamsTable";
import HighCode from "./base/highCode";

/**
 * el-button-demo create by Administrator
 * createTime 2020/10/23 15:58
 */
export default {
  name: 'el-button-demo',
  components: {HighCode, ParamsTable},
  filters: {},
  mixins: [],
  props: {},
  data() {
    return {
      attrTableData: [
        {
          param: 'type',
          description: '按钮类型，type=dashed为虚线样式的按钮，其他样式的按钮参考element',
          type: 'String',
          option: '',
          default: ''
        }
      ],
      code: `
        <el-button type="dashed">虚线按钮</el-button>
        `,
      description: '虚线按钮一般用于添加指定内容或上传文件'
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
.el-button-demo-wrap {
  button.el-button.el-button--dashed {
    padding: 8px 15px;
    background-color: #FAFAFA;
    border: 1px dashed #E0E0E0;

    &:hover {
      border-color: #ffac4d;
    }
  }
}
</style>
