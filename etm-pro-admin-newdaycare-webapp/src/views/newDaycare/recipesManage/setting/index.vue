<template>
  <div class="childCareSetting">
    <etm-layout-split>
      <div class="wrapper">
        <etm-tabs
          ref="tabs"
          v-model="tabsValue"
          :show-toggle="false"
          tab-position="left"
        >
          <template v-for="(tab, index) in tabsList">
            <el-tab-pane
              v-if="hasAuth(tab.authId,'tabs','tabsValue')"
              :key="index"
              :label="tab.label"
              :name="tab.name"
            >
              <component :is="tab.component" />
            </el-tab-pane>
          </template>
          <!--          <el-tab-pane-->
          <!--            v-if="hasAuth('daycare.foodType.setting','tabs','tabsValue')"-->
          <!--            label="菜肴类型"-->
          <!--            name="dishes"-->
          <!--          >-->
          <!--            <dishes />-->
          <!--          </el-tab-pane>-->
          <!--          <el-tab-pane-->
          <!--            v-if="hasAuth('daycare.mealsTime.setting','tabs','tabsValue')"-->
          <!--            label="餐次设置"-->
          <!--            name="meals"-->
          <!--          >-->
          <!--            <meals />-->
          <!--          </el-tab-pane>-->
          <!--          <el-tab-pane-->
          <!--            v-if="hasAuth('daycare.recipesAges.setting','tabs','tabsValue')"-->
          <!--            label="食谱适用年龄段"-->
          <!--            name="generation"-->
          <!--          >-->
          <!--            <generation />-->
          <!--          </el-tab-pane>-->
        </etm-tabs>
      </div>
    </etm-layout-split>
  </div>
</template>
<script>

import dishes from './tabsItem/dishes'
import meals from './tabsItem/meals'
import generation from './tabsItem/generation'
import baseMixin from '@/layout/mixin/baseMixin'

export default {
  components: {
    dishes,
    meals,
    generation
  },
  mixins: [baseMixin],
  data () {
    return {
      tabsValue: 'dishes',
      tabsList: [
        {
          label: '菜肴类型',
          name: 'dishes',
          component: dishes,
          authId: 'daycare.foodType.setting'
        },
        {
          label: '餐次设置',
          name: 'meals',
          component: meals,
          authId: 'daycare.mealsTime.setting'
        }
        // {
        //   label: '食谱适用年龄段',
        //   name: 'generation',
        //   component: generation,
        //   authId: 'daycare.recipesAges.setting'
        // }
      ]
    }
  }
}
</script>

<style lang="scss" scoped>
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
