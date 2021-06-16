<template>
  <div class="main-wrap">
    <etm-layout-split>
      <template slot="header">
        <!--:setting="hasAuthOfBool('guardcare.recipes.setting')"-->
        <etm-tabs
          ref="tabs"
          v-model="activeName"
          @tab-click="tabChange"
        >
          <!--v-if="hasAuth('guardcare.recipes.queryBatch', 'tabs', 'activeName')"-->
          <el-tab-pane
            v-for="item in formData"
            :key="item.name"
            :label="item.label"
            :name="item.name"
          >
            <etm-tool-bar
              v-model="item.model"
              @search="search('tab1',item.model)"
              @reset="reset('tab1',item.model)"
            />
          </el-tab-pane>
        </etm-tabs>
      </template>

      <template slot="body">
        <my-recipes v-if="activeName === 'tab1'" />
        <recommended-recipe v-if="activeName === 'tab2'" />
        <meal-plan
          v-if="activeName === 'dietPlan'"
          :date="currentFormData.model[1].value"
        />
      </template>
    </etm-layout-split>
  </div>
</template>

<script>
/**
 * main create by Administrator
 * createTime 2021/3/11 15:28
 */
import myRecipes from './components/myRecipes/myRecipes'
import RecommendedRecipe from './components/recommendRecipes/index'
import mealPlan from '@/views/newDaycare/dietManagement/components/mealPlan/index'
import baseMixin from '@/layout/mixin/baseMixin'
export default {
  name: 'Main',
  components: { RecommendedRecipe, myRecipes, mealPlan },
  filters: {},
  mixins: [baseMixin],
  props: {},
  data () {
    return {
      activeName: 'tab1',
      formData: [
        {
          label: '我的食谱',
          name: 'tab1',
          model: [
            {
              label: '人群',
              type: 'select',
              prop: 'grade',
              value: null,
              default: null,
              name: null,
              props: {
                filterable: true,
                placeholder: '请选择人群'
              },
              options: []
            },
            {
              label: '年份',
              type: 'select',
              prop: 'semester',
              value: null,
              default: null,
              name: null,
              props: {
                filterable: true,
                placeholder: '请选择年份'
              },
              events: {
                change: this.changeSemester
              },
              options: []
            },
            {
              label: '周次',
              type: 'select',
              prop: 'week',
              value: null,
              props: {
                filterable: true,
                placeholder: '请选择周次'
              },
              options: []
            },
            {
              label: '食谱名称',
              type: 'input',
              prop: 'week',
              value: null,
              props: {
                placeholder: '请输入食谱名称'
              },
              options: []
            }
          ]
        },
        {
          label: '推荐食谱',
          name: 'tab2',
          model: [
            {
              label: '人群',
              type: 'select',
              prop: 'grade',
              value: null,
              default: null,
              name: null,
              props: {
                filterable: true,
                placeholder: '请选择人群'
              },
              options: []
            },
            {
              label: '年份',
              type: 'select',
              prop: 'semester',
              value: null,
              default: null,
              name: null,
              props: {
                filterable: true,
                placeholder: '请选择年份'
              },
              events: {
                change: this.changeSemester
              },
              options: []
            },
            {
              label: '食谱名称',
              type: 'input',
              prop: 'week',
              value: null,
              props: {
                placeholder: '请输入食谱名称'
              },
              options: []
            }
          ]
        },
        {
          label: '膳食计划',
          name: 'dietPlan',
          model: [
            {
              label: '人群',
              type: 'select',
              prop: 'grade',
              value: null,
              props: {
                placeholder: '请选择人群'
              },
              options: []
            },
            {
              label: '日期',
              type: 'date',
              value: '',
              prop: 'time',
              default: Date.now(),
              props: {
                type: 'month',
                placeholder: '请选择日期'
              }
            }
          ]
        }
      ],
      currentFormData: []
    }
  },
  computed: {},
  watch: {
    activeName: {
      handler (val) {
        this.currentFormData = this.formData.find(item => item.name === val)
      },
      immediate: true
    }
  },
  created () {
  },
  mounted () {
    this.init()
  },
  methods: {
    init () {
    },
    tabChange (e) {
      console.log(this.activeName, 'e')
    }
  }
}
</script>
<style lang="scss" scoped>
</style>
