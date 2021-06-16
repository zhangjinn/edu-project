<template>
  <div class="childCareSetting">
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
            <component
              :is="tab.component"
              v-if="tabsValue === tab.name"
            />
          </el-tab-pane>
        </etm-tabs>
      </div>
    </etm-layout-split>
  </div>
</template>
<script>

import timePeriod from './tabsItem/timePeriod'
import subjects from './tabsItem/subjects'
import tags from './tabsItem/tags'
export default {
  data () {
    return {
      tabsValue: 'timePeriod',
      tabsList: [
        {
          label: '日程时段',
          name: 'timePeriod',
          component: timePeriod
        },
        {
          label: '日程类目',
          name: 'subjects',
          component: subjects
        },
        {
          label: '标签',
          name: 'tags',
          component: tags
        }

      ]
    }
  },
  methods: {

  }
}
</script>

<style scoped lang="scss">
  .childCareSetting {
    //padding-top: 16px;

    .wrapper {
      padding-bottom: 16px;
      // &::v-deep .el-tabs {
      //   .el-tabs__header {
      //     margin-right: 24px;
      //   }
      //   .el-tabs__item {
      //     height: 44px;
      //     width: 164px;
      //     text-align: left;
      //     padding-left: 0;
      //     line-height: 44px;
      //   }
      // }
    }
  }
</style>
