<template>
  <div class="choice-wrap">
    <etm-table-page :data="tableData2">
      <etm-table-tool-bar slot="tool">
        <search-field @query="query" />
      </etm-table-tool-bar>

      <el-table-column
        label="学员姓名"
        solt="left"
        width="120"
        fixed="left"
      />
      <el-table-column
        label="联系人姓名"
        solt="left"
        width="120"
        fixed="left"
      />
      <el-table-column
        label="联系人电话"
        solt="left"
        width="120"
      />
      <el-table-column
        label="性别"
        solt="left"
        width="120"
      />
      <el-table-column
        label="年龄"
        solt="left"
        width="120"
      />
      <el-table-column
        label="跟进阶段"
        solt="left"
        width="120"
      />
      <el-table-column
        label="学员状态"
        solt="left"
        width="120"
      />
      <el-table-column
        label="学员来源"
        solt="left"
        width="120"
      />
      <el-table-column
        label="跟进人员"
        solt="left"
        width="120"
      />
      <el-table-column
        label="操作"
        solt="right"
        width="120"
        fixed="right"
      >
        <el-button type="text">
          选择
        </el-button>
      </el-table-column>
    </etm-table-page>
  </div>
</template>

<script>
/**
 * choice create by Administrator
 * createTime 2020/9/1 16:56
 */
import SearchField from '@/views/newDaycare/childManage/myChild/components/searchField'

export default {
  name: 'Choice',
  components: {
    SearchField
  },
  filters: {},
  mixins: [],
  props: {},
  data () {
    return {
      tableData2: {
        content: [{}]
      }
    }
  },
  computed: {},
  watch: {},
  created () {
  },
  mounted () {
  },
  methods: {}
}
</script>
<style lang="scss" scoped>
</style>
