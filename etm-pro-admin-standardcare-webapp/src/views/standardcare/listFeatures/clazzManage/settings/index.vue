<template>
  <!--  班级设置-->
  <div class="classSetting">
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
import clazzSet from '@/views/standardcare/listFeatures/clazzManage/settings/clazzSet'
/**
 * index create by Administrator
 * createTime 2020/12/8 14:51
 */
export default {
  name: 'ClazzSetting',
  components: {},
  filters: {},
  mixins: [],
  props: {},
  data () {
    return {
      tabsValue: 'clazzSetting',
      tabsList: [
        {
          label: '班级设置',
          name: 'clazzSetting',
          component: clazzSet
        }
      ]
    }
  },
  computed: {},
  watch: {},
  created () {
  },
  mounted () {
    this.init()
  },
  methods: {
    init () {
    }
  }
}
</script>
<style lang="scss" scoped>
</style>
