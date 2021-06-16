<template>
  <div class="setting-wrap">
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
/**
 * setting create by Administrator
 * createTime 2021/1/15 13:37
 */
// import rule from './tabsItem/rule'
import time from './tabsItem/time'
export default {
  name: 'Setting',
  components: {},
  filters: {},
  mixins: [],
  props: {},
  data () {
    return {
      tabsValue: 'time',
      tabsList: [
        // {
        //   label: '结算规则',
        //   name: 'rule',
        //   component: rule
        // },
        {
          label: '考勤时间设置',
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
.setting-wrap {
  .wrapper {
    padding-bottom: 16px;
  }
}
</style>
