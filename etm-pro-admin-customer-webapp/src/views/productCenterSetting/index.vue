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

import type from './tabsItem/type'

export default {
  data () {
    return {
      tabsValue: 'type',
      tabsList: [
        {
          label: '产品类型',
          name: 'type',
          component: type
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
