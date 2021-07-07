<template>
  <div class="index-wrap">
    <etm-main-body>
      <etm-layout-split>
        <div class="wrapper">
          <etm-tabs v-model="tabsValue" tab-position="left" :show-toggle="false">
            <el-tab-pane :label="tabsList.label" :name="tabsList.name">
              <setting />
            </el-tab-pane>
          </etm-tabs>
        </div>
      </etm-layout-split>
    </etm-main-body>
  </div>

</template>

<script>
import setting from '@/views/newDaycare/attendanceCare/setting/setting'

/**
 * index create by Administrator
 * createTime 2020/08/31 17:32
 */
export default {
  name: 'Index',
  components: {
    setting
  },
  filters: {},
  mixins: [],
  props: {},
  data() {
    return {
      tabsValue: 'label',
      tabsList: {
        label: '托育请假规则',
        name: 'label',
        component: setting
      }
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
.index-wrap {
  ::v-deep .el-tabs {
    padding-bottom: 16px;
  }
}
</style>
