<template>
  <div class="childCareSetting">
    <etm-layout-split>
      <div class="wrapper">
        <etm-tabs ref="tabs" v-model="tabsValue" tab-position="left" :show-toggle="false">
          <template v-for="(tab, index) in tabsList">
            <el-tab-pane
              v-if="hasAuth(tab.authId, 'tabs', 'tabsValue')"
              :key="index"
              :label="tab.label"
              :name="tab.name"
            >
              <component :is="tab.component" v-if="tabsValue === tab.name" />
            </el-tab-pane>
          </template>

        </etm-tabs>
      </div>
    </etm-layout-split>
  </div>
</template>
<script>
import profession from './tabItem/profession'
import position from './tabItem/position'
import resign from './tabItem/resign'
// import source from '../settings/tabsItem/source'
// import importance from '../settings/tabsItem/importance'
// import method from '../settings/tabsItem/method'
// import template from '../settings/tabsItem/template'
// import followRules from '../settings/tabsItem/followRules'
// import recoverRules from '../settings/tabsItem/recoverRules'
import baseMixin from '@/layout/mixin/baseMixin'

export default {
  mixins: [baseMixin],
  data() {
    return {
      tabsValue: 'label',
      tabsList: [
        {
          label: '职称设置',
          name: 'profession',
          component: profession,
          type: 'PROFESSION'
        },
        {
          label: '岗位设置',
          name: 'position',
          component: position,
          type: 'POSITION'
        },
        {
          label: '离职原因设置',
          name: 'resign',
          component: resign,
          type: 'RESIGN'
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
