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

import clazz from './tabsItem/clazz'

export default {
  data () {
    return {
      tabsValue: 'range',
      tabsList: [
        {
          label: '餐次设置',
          name: 'meals',
          component: clazz
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

  }
}
</style>
