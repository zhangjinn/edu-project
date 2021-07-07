<template>
  <div class="index-wrap">
    <etm-main-body>
      <etm-layout-split>
        <div class="wrapper">
          <etm-tabs v-model="tabsValue" tab-position="left" :show-toggle="false">
            <el-tab-pane v-for="(tab, index) in tabsList" :key="index" :label="tab.label" :name="tab.name">
              <component :is="tab.component" />
            </el-tab-pane>
          </etm-tabs>
        </div>
      </etm-layout-split>
    </etm-main-body>
  </div>

</template>

<script>
import incomeCostType from './tabsItem/incomeCostType'

/**
 * index create by Administrator
 * createTime 2020/9/8 15:09
 */
export default {
  name: 'Index',
  components: {},
  filters: {},
  mixins: [],
  props: {},
  data() {
    return {
      tabsValue: 'incomeCostType',
      tabsList: [
        {
          label: '收支项目',
          name: 'incomeCostType',
          component: incomeCostType
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
  .wrapper{
    padding-bottom: 16px;
  }
}
</style>
