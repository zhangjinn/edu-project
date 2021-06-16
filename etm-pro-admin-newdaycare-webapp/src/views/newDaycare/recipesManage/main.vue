<template>
  <div class="main-wrap">
    <etm-layout-split>
      <template slot="header">
        <etm-tabs
          ref="tabs"
          v-model="activeName"
          :setting="hasAuthOfBool('daycare.recipes.setting')"
          @setting="setting"
          @tab-click="tabChange"
        >
          <el-tab-pane
            v-if="hasAuth(
              'daycare.recipes.queryBatch',
              'tabs',
              'activeName')"
            label="周食谱"
            name="tab1"
          >
            <etm-tool-bar
              v-show="show"
              v-model="formData1"
              @reset="reset('tab1',formData1)"
              @search="search('tab1',formData1)"
            />
          </el-tab-pane>
          <el-tab-pane
            v-if="hasAuth(
              'daycare.food.queryBatch',
              'tabs',
              'activeName')"
            label="菜肴库"
            name="tab2"
          >
            <etm-tool-bar
              v-show="show"
              v-model="formData2"
              @reset="reset('tab2',formData2)"
              @search="search('tab2',formData2)"
            />
          </el-tab-pane>
        </etm-tabs>
      </template>
      <template slot="body">
        <material-table
          v-if="activeName==='tab1'"
          ref="tab1"
        />
        <price-table
          v-if="activeName==='tab2'"
          ref="tab2"
          :option="formData2[0].options"
        />
      </template>
    </etm-layout-split>
  </div>
</template>

<script>
import baseMixin from '@/layout/mixin/baseMixin'
import materialTable from './firstTable/firstTable'
import priceTable from './secondTable/secondTable'
import { queryDaycareFoodTypeList, queryDaycareGenerationList } from '@/api/newDaycare/recipesManage'

export default {
  name: 'Index',
  components: {
    materialTable,
    priceTable
  },
  mixins: [baseMixin],
  data () {
    return {
      activeName: 'tab1',
      show: true,
      formData1: [
        {
          label: '日期',
          type: 'date',
          prop: 'week',
          value: '',
          props: {
            type: 'week',
            // format: this.$t('recipeManagement.weekDateFormat'),
            // placeholder: this.$t('recipeManagement.queryRecipeTimePlaceHolderText'),
            // 'picker-options': { 'firstDayOfWeek': 1 }
            format: 'yyyy-MM月-第WW周',
            placeholder: '请选择周数',
            'picker-options': { firstDayOfWeek: 1 }
          }
        },
        {
          label: '适用年龄段',
          type: 'select',
          prop: 'generationId',
          value: null,
          props: {
            filterable: true,
            placeholder: '请选择适用年龄段'
          },
          options: []
        }
      ],
      formData2: [
        {
          label: '类型',
          type: 'select',
          prop: 'typeId',
          value: null,
          props: {
            placeholder: '请选择菜肴类型'
          },
          options: []
        },
        {
          label: '菜肴名称',
          type: 'input',
          prop: 'foodName',
          value: null,
          props: {
            placeholder: '请输入菜肴名称'
          }
        }
      ]
    }
  },
  // watch: {
  //
  // },
  created () {
    this.getGenerationList()
  },
  mounted () {
    this.$nextTick(() => {
      this.tabChange()
    })
  },
  methods: {
    setting () {
      this.$router.push({ name: 'recipeSetting' })
    },
    toggle (val) {
      this.show = val
    },
    search (ref, formData) {
      console.log('refref', ref, formData)
      this.$refs[ref].formData = formData
      this.$refs[ref].reset()
    },
    tabChange () {
      if (this.activeName === 'tab1') {
        this.reset('tab1', this.formData1)
      } else if (this.activeName === 'tab2') {
        this.getFoodTypeData()
        this.reset('tab2', this.formData2)
      }
    },
    reset (ref, formData) {
      formData.forEach((item) => {
        item.value = null
      })
      // if (this.activeName === 'tab1') {
      //   this.initSemester()
      // }

      setTimeout(() => {
        this.$refs[ref].formData = formData
        this.$refs[ref].reset()
      }, 300)
    },

    // 适用年龄段
    getGenerationList () {
      queryDaycareGenerationList().then(res => {
        const data = []
        res.data.forEach(v => {
          // data.push({
          //   label: `${v.startAge}至${v.endAge}`,
          //   value: `${v.startAge}_${v.endAge}`
          // })
          data.push({
            label: v.generationName,
            value: v.generationId
          })
        })
        this.formData1[1].options = data
      })
    },

    // 菜肴类型
    getFoodTypeData () {
      if (this.formData2[0].options.length > 0) return
      queryDaycareFoodTypeList().then(res => {
        if (res.data) {
          this.formData2[0].options = this.convertDataToOptions(res.data, 'foodTypeName', 'foodTypeId')
        }
      })
    }
  }
}
</script>

<style scoped>

</style>
