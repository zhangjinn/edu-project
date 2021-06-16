<template>
    <div class="etm-form-demo-wrap">

        <high-code :code="code" :description="description">
            <etm-form type="dialog">
                <el-form-item label="dialog">
                    <el-input v-model="value"></el-input>
                </el-form-item>
            </etm-form>

            <etm-form type="small">
                <el-form-item label="small">
                    <el-input v-model="value"></el-input>
                </el-form-item>
            </etm-form>

            <etm-form type="big">
                <el-form-item label="big">
                    <el-input v-model="value"></el-input>
                </el-form-item>
            </etm-form>
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
          description: 'form的类型,用于不同场景',
          type: 'String',
          option: 'dialog,small,big',
          default: 'big'
        },
        {
          param: 'ele原生属性',
          description: '全部兼容',
          type: '-',
          option: '-',
          default: '-'
        }
      ],
      code: `
      <etm-form type="dialog">
            <el-form-item label="dialog">
                <el-input v-model="value"/>
            </el-form-item>
        </etm-form>

        <etm-form type="small">
            <el-form-item label="small">
                <el-input v-model="value"/>
            </el-form-item>
        </etm-form>

        <etm-form type="big">
            <el-form-item label="big">
                <el-input v-model="value"/>
            </el-form-item>
        </etm-form>
      `,
      description: '一般配合etm-form-foot组件使用'
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
