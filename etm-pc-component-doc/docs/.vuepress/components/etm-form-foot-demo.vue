<template>
    <div class="etm-form-demo-wrap">

        <high-code :code="code" :description="description">
            <etm-form type="dialog">
                <el-form-item label="dialog">
                    <el-input v-model="value"></el-input>
                </el-form-item>
            </etm-form>
            <etm-form-foot @save="save" @canvel="cancel"></etm-form-foot>
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
          param: 'save',
          description: 'form的保存事件',
          type: 'Function',
          option: '-',
          default: '-'
        },
        {
          param: 'cancel',
          description: 'form的取消事件',
          type: 'Function',
          option: '-',
          default: '-'
        },
      ],
      code: `
        <etm-form type="dialog">
            <el-form-item label="dialog">
                <el-input v-model="value"/>
            </el-form-item>
        </etm-form>
        <etm-form-foot @save="save" @canvel="cancel"/>
      `,
      description: `该组件依赖etm-form, 否则不会根据etm-form的labelWidth来设置margin-left`
    }
  },
  computed: {},
  watch: {},
  created() {
  },
  mounted() {
  },
  methods: {
    save(e) {
      console.log(e);
    },
    cancel(e) {
      console.log(e);
    }
  }
}
</script>
<style lang="scss" scoped>
    .etm-form-demo-wrap {

    }
</style>
