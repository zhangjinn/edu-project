<template>
  <div class="index-wrap">
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
import checkType from '@/views/newDaycare/bodyCheck/setting/checkType'
import oddType from '@/views/newDaycare/bodyCheck/setting/oddType'
import oddSure from '@/views/newDaycare/bodyCheck/setting/oddSure'
import baseMixin from '@/layout/mixin/baseMixin'

/**
 * index create by Administrator
 * createTime 2020/09/18 11:41
 */
export default {
  name: 'Index',
  components: {},
  filters: {},
  mixins: [baseMixin],
  props: {},
  data() {
    return {
      tabsValue: 'checkType',
      tabsList: [
        {
          label: '检查类型',
          name: 'checkType',
          component: checkType,
          authId: 'daycare.bodyCheckType.setting'
        },
        {
          label: '常见病状类型',
          name: 'oddType',
          component: oddType,
          authId: 'daycare.unhealthyType.setting'
        },
        {
          label: '异常确认设置',
          name: 'oddSure',
          component: oddSure,
          authId: 'daycare.unhealthyConfirm.setting'
        }
      ]
    }
  },
  computed: {},
  watch: {},
  created() {
  },
  mounted() {
  },
  methods: {}
}
</script>
<style lang="scss" scoped>
.index-wrap {
  padding-top: 16px;

  .wrapper {
    padding-bottom: 16px;
  }
}
</style>
