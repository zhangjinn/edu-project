<template>
  <div class="customerSetting">
    <etm-layout-split>
      <div class="wrapper">
        <etm-tabs
          ref="tabs"
          v-model="tabsValue"
          tab-position="left"
          :show-toggle="false"
        >
          <template v-for="(tab, index) in tabsList">
            <el-tab-pane
              :key="index"
              :label="tab.label"
              :name="tab.name"
            >
              <component :is="tab.component" />
            </el-tab-pane>
          </template>
        </etm-tabs>
      </div>
    </etm-layout-split>
  </div>
</template>

<script>
import customerField from './tabsItem/customerField'
// import followSetting from './tabsItem/followSetting'
import infoHideSetting from './tabsItem/infoHideSetting'
import customerTag from './tabsItem/customerTag'
import customerStatus from './tabsItem/customerStatus'
import call from './tabsItem/call'
import source from './tabsItem/source'
import importance from './tabsItem/importance'
import saleStage from './tabsItem/saleStage'
import followMethod from './tabsItem/followMethod'
import followTemplate from './tabsItem/followTemplate'
import followRules from './tabsItem/followRules'
import recoverRules from './tabsItem/recoverRules'

export default {
  data () {
    return {
      tabsValue: 'infoHideSetting',
      tabsList: [
        {
          label: '客户字段设置',
          name: 'customerField',
          component: customerField
        },
        // {
        //   label: '跟进设置',
        //   name: 'followSetting',
        //   component: followSetting
        // },
        {
          label: '信息隐藏设置',
          name: 'infoHideSetting',
          component: infoHideSetting
        },
        {
          label: '客户标签',
          name: 'customerTag',
          component: customerTag
        },
        {
          label: '客户状态',
          name: 'customerStatus',
          component: customerStatus
        },
        {
          label: '联系人称呼',
          name: 'call',
          component: call
        },
        {
          label: '来源',
          name: 'source',
          component: source
        },
        {
          label: '重要程度',
          name: 'importance',
          component: importance
        },
        {
          label: '销售阶段',
          name: 'saleStage',
          component: saleStage
        },
        {
          label: '跟进方式',
          name: 'followMethod',
          component: followMethod
        },
        {
          label: '跟进内容模板',
          name: 'followTemplate',
          component: followTemplate
        },
        {
          label: '跟进规则',
          name: 'followRules',
          component: followRules
        },
        {
          label: '自动回收客户规则',
          name: 'recoverRules',
          component: recoverRules
        }
      ]
    }
  }
}
</script>

<style lang="scss" scoped>
.customerSetting {
  //padding-top: 16px;
  .wrapper {
    padding-bottom: 16px;
  }
}
</style>
