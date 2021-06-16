<template>
  <div class="healthCheckSetting">
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
import check from './tabsItem/checkType'
import illness from './tabsItem/illnessType'
import confirm from './tabsItem/confirm'
export default {
  data () {
    return {
      tabsValue: 'check',
      tabsList: [
        {
          label: '检查类型',
          name: 'check',
          component: check
        },
        {
          label: '常见病状类型',
          name: 'illness',
          component: illness
        },
        {
          label: '异常确认设置',
          name: 'confirm',
          component: confirm
        }
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
.healthCheckSetting {
  padding-top: 16px;

  .wrapper {
    padding-bottom: 16px;
  }
}
</style>
