<template>
  <div class="courseTimeManageSetting">
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
import timetable from './tabsItem/timetable'

export default {
  name: 'Setting',
  data () {
    return {
      tabsValue: 'timetable',
      tabsList: [
        {
          label: '课程时段',
          name: 'timetable',
          component: timetable
        }
      ]
    }
  }
}
</script>

<style lang="scss" scoped>
.courseTimeManageSetting {
  margin-top: 16px;

  .wrap {
    margin-bottom: 16px;
  }
}
</style>
