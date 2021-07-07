<template>
  <div class="childCareSetting">
    <etm-layout-split>
      <div class="wrapper">
        <etm-tabs v-model="tabsValue" tab-position="left" :show-toggle="false">
          <el-tab-pane v-for="(tab, index) in tabsList" :key="index" :label="tab.label" :name="tab.name">
            <component :is="tab.component" v-if="tabsValue === tab.name" />
          </el-tab-pane>
        </etm-tabs>
      </div>
    </etm-layout-split>
  </div>
</template>
<script>

import timetable from './tabsItem/timetable'
import classTimetable from './tabsItem/classTimetable'
import semester from './tabsItem/semester'
import courseSubjects from './tabsItem/courseSubjects'
export default {
  data() {
    return {
      tabsValue: 'timetable',
      tabsList: [
        {
          label: '特色课表时段设置',
          name: 'timetable',
          component: timetable
        },
        {
          label: '班级课表时段设置',
          name: 'classTimetable',
          component: classTimetable
        },
        {
          label: '学期设置',
          name: 'semester',
          component: semester
        },
        {
          label: '课程科目设置',
          name: 'courseSubjects',
          component: courseSubjects
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
    padding-top: 16px;
    .wrapper {
      padding-bottom: 16px;
      // & >>> .el-tabs {
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
