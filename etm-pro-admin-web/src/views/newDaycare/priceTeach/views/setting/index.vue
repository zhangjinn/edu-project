<template>
  <div class="index-wrap">
    <etm-layout-split>
      <div class="wrapper">
        <etm-tabs v-model="tabsValue" tab-position="left" :show-toggle="false">
          <el-tab-pane :label="tabsList.label" :name="tabsList.name">
            <setting />
          </el-tab-pane>
        </etm-tabs>
      </div>
    </etm-layout-split>
  </div>

</template>

<script>
// import lable from '@/views/daycare/childManage/settings/tabsItem/label'
import setting from '@/views/newDaycare/priceTeach/views/setting/setting'
/**
 * index create by Administrator
 * createTime 2020/08/31 17:32
 */
export default {
  name: 'Index',
  components: {
    setting
  },
  filters: {},
  mixins: [],
  props: {},
  data() {
    return {
      tabsValue: 'label',
      tabsList: {
        label: '物品类型',
        name: 'label',
        component: setting
      }
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
