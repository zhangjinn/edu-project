<template>
  <div class="index-wrap">
    <etm-main-body>
      <etm-layout-split>
        <div class="wrapper">
          <etm-tabs
            v-model="tabsValue"
            tab-position="left"
            :show-toggle="false"
          >
            <el-tab-pane
              v-for="(tab, index) in tabsList"
              :key="index"
              :label="tab.label"
              :name="tab.name"
            >
              <component :is="tab.component" />
            </el-tab-pane>
          </etm-tabs>
        </div>
      </etm-layout-split>
    </etm-main-body>
  </div>
</template>

<script>
import rule from './tabsItem/rule'
import time from './tabsItem/time'

/**
 * index create by Administrator
 * createTime 2020/9/8 15:28
 */
export default {
  name: 'Index',
  components: {},
  filters: {},
  mixins: [],
  props: {},
  data () {
    return {
      tabsValue: 'rule',
      tabsList: [
        {
          label: '日程时段',
          name: 'rule',
          component: rule
        },
        {
          label: '节假日',
          name: 'time',
          component: time
        }
      ]
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
.index-wrap {
  ::v-deep .el-tabs {
    padding-bottom: 16px;
  }
}
</style>
