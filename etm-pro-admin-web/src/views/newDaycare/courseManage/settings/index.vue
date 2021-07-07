<template>
  <div class="courseManageSetting">
    <etm-layout-split>
      <div class="wrapper">
        <etm-tabs ref="tabs" v-model="tabsValue" tab-position="left" :show-toggle="false">
          <template v-for="(tab, index) in tabsList">
            <el-tab-pane v-if="hasAuth(tab.authId, 'tabs', 'tabsValue')" :key="index" :label="tab.label" :name="tab.name">
              <component :is="tab.component" v-if="tabsValue === tab.name" />
            </el-tab-pane>
          </template>

        </etm-tabs>
      </div>
    </etm-layout-split>
  </div>
</template>
<script>
import early from './early'
// import nurse from './nurse'
// import timeSlot from './timeSlot'
import baseMixin from '@/layout/mixin/baseMixin'
export default {
  mixins: [baseMixin],
  data() {
    return {
      tabsValue: 'early',
      tabsList: [
        {
          label: '早教课类型',
          name: 'early',
          authId: 'daycare.courseTeach.setting',
          component: early
        }
        // {
        //   label: '托育类型',
        //   name: 'nurse',
        //   authId: 'daycare.courseCare.setting',
        //   component: nurse
        // },
        // {
        //   label: '托育年龄段',
        //   name: 'timeSlot',
        //   authId: 'daycare.courseCare.setting',
        //   component: timeSlot
        // }
      ]
    }
  },
  computed: {
  },
  methods: {
  }
}
</script>

<style scoped lang="scss">
.courseManageSetting {
  padding-top: 16px;
  .wrapper {
    padding-bottom: 16px;
  }
}
</style>
