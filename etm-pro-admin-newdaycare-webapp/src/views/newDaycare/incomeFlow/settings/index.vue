<template>
  <div class="incomeFlowSetting-wrap">
    <etm-main-body>
      <etm-layout-split>
        <div class="wrap">
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
    </etm-main-body>
  </div>
</template>

<script>
/**
 * index create by 油麦菜
 * createTime 2020/9/14 11:42
 */
import type from './type'
import pay from './pay'
export default {
  name: 'Index',
  components: {},
  filters: {},
  mixins: [],
  props: {},
  data () {
    return {
      tabsValue: 'type',
      tabsList: [
        {
          label: '收支类型',
          name: 'type',
          component: type
        }, {
          label: '支付方式',
          name: 'pay',
          component: pay
        }
      ]
    }
  },
  created () {},
  mounted () {},
  methods: {}
}
</script>
<style lang="scss" scoped>
.incomeFlowSetting-wrap {
  .wrap {
    padding-bottom: 16px;
  }
}
</style>
