<template>
    <div class="etm-form-demo-wrap">
        <high-code :code="code" :description="description">
          <etm-field-label label="姓名">张三</etm-field-label>
          <etm-field-label type="left" label="花名">李四</etm-field-label>
          <etm-field-label type="right" label="小名" :separator="true">王五</etm-field-label>
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

      tableData: [
        {
          param: 'label',
          description: '文本关联的label文字',
          type: 'String',
          option: '--',
          default: '--'
        },
        {
          param: 'type',
          description: '文本对其方式',
          type: 'String',
          option: 'normal/left/right',
          default: 'normal'
          }
      ],
      code: `
        <etm-field-label label="姓名">张三</etm-field-label>
        <etm-field-label type="left" label="花名">李四</etm-field-label>
        <etm-field-label type="right" label="小名">王五</etm-field-label>
      `,
      description: '一般用于行文本或区块文本布局'
    }
  },
  computed: {},
  watch: {},
  created() {
  },
  mounted() {
  },
  methods: {
      change(val) {
        console.log(val)
      }
  }
}
</script>
<style lang="scss" scoped>
    .etm-form-demo-wrap {

    }
</style>
