<template>
  <div class="childCareSetting">
    <etm-layout-split>
      <div class="wrapper">
        <etm-tabs v-model="tabsValue" :show-toggle="false" tab-position="left">
          <el-tab-pane v-for="(tab, index) in tabsList" :key="index" :label="tab.label" :name="tab.name">
            <component :is="tab.component" v-if="tabsValue === tab.name" />
          </el-tab-pane>
        </etm-tabs>
      </div>
    </etm-layout-split>
  </div>
</template>
<script>

import worker from './worker'
import parents from './parents'
import servicePackage from './servicePackage'

export default {
  data() {
    return {
      tabsValue: 'Employee',
      tabsList: [
        {
          label: '教职工开放时段',
          name: 'Employee',
          component: worker
        },
        {
          label: '家长开放时段',
          name: 'Parent',
          component: parents
        },
        {
          label: '服务套餐',
          name: 'ServicePackage',
          component: servicePackage
        }
      ]
    }
  },
  methods: {}
}
</script>

<style lang="scss" scoped>
.childCareSetting {
  padding-top: 16px;

  .wrapper {
    padding-bottom: 16px;
  }
}
</style>
