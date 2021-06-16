<template>
  <div class="FieldLabel-wrap">
    <etm-layout-split>
      <etm-field-label label="姓名">张三</etm-field-label>
      <etm-field-label type="left" label="花名">李四</etm-field-label>
      <etm-field-label type="right" label="小名">王五</etm-field-label>
      <etm-field-label>
        <template slot="label">乳名 <i class="el-icon-edit"></i></template>
        赵六
      </etm-field-label>
    </etm-layout-split>
  </div>

</template>

<script>
/**
 * FieldLabel create by haijinsha
 * createTime 2020/9/9 15:31
 */
export default {
  name: 'FieldLabel',
  components: {},
  filters: {},
  mixins: [],
  props: {},
  data() {
    return {}
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
  .FieldLabel-wrap {

  }
</style>
