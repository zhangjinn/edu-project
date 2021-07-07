<template>
  <div class="childCareSetting">
    <etm-layout-split>
      <div class="wrapper">
        <etm-tabs v-model="tabsValue" tab-position="left" :show-toggle="false">
          <el-tab-pane v-for="(tab, index) in tabsList" :key="index" :label="tab.label" :name="tab.name">
            <component :is="tab.component" />
          </el-tab-pane>
        </etm-tabs>
      </div>
    </etm-layout-split>
  </div>
</template>
<script>

import material from './tabsItem/material'
import price from './tabsItem/price'

export default {
  data() {
    return {
      tabsValue: 'material',
      tabsList: [
        {
          label: '物品类型',
          name: 'material',
          component: material
        },
        {
          label: '费用类型',
          name: 'price',
          component: price
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
