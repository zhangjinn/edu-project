<template>
  <div class="childCareSetting">
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
              v-if="hasAuth(tab.authId, 'tabs', 'tabsValue')"
              :key="index"
              :label="tab.label"
              :name="tab.name"
            >
              <component
                :is="tab.component"
                v-if="tabsValue === tab.name"
              />
            </el-tab-pane>
          </template>
        </etm-tabs>
      </div>
    </etm-layout-split>
  </div>
</template>
<script>
import label from '../settings/tabsItem/label'
import state from '../settings/tabsItem/state'
import call from '../settings/tabsItem/call'
import source from '../settings/tabsItem/source'
import importance from '../settings/tabsItem/importance'
import method from '../settings/tabsItem/method'
import template from '../settings/tabsItem/template'
import followRules from '../settings/tabsItem/followRules'
import recoverRules from '../settings/tabsItem/recoverRules'
import baseMixin from '@/layout/mixin/baseMixin'

export default {
  mixins: [baseMixin],
  data () {
    return {
      tabsValue: 'label',
      tabsList: [
        {
          label: '学员标签',
          name: 'label',
          component: label,
          authId: 'daycare.tagChild.setting'
        },
        {
          label: '学员状态',
          name: 'state',
          component: state,
          authId: 'daycare.statusChild.setting'
        },
        {
          label: '联系人称呼',
          name: 'call',
          component: call,
          authId: 'daycare.contactCall.setting'
        },
        {
          label: '学员来源',
          name: 'source',
          component: source,
          authId: 'daycare.sourceChild.setting'
        },
        {
          label: '学员重要程度',
          name: 'importance',
          component: importance,
          authId: 'daycare.importantChild.setting'
        },
        {
          label: '跟进方式',
          name: 'method',
          component: method,
          authId: 'daycare.followType.setting'
        },
        {
          label: '跟进内容模板',
          name: 'template',
          component: template,
          authId: 'daycare.followTemplate.setting'
        },
        {
          label: '跟进规则',
          name: 'followRules',
          component: followRules,
          authId: 'daycare.followRules.setting'
        },
        {
          label: '自动回收学员规则',
          name: 'recoverRules',
          component: recoverRules,
          authId: 'daycare.childRecycleRules.setting'
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
    // & ::v-deep .el-tabs {
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
