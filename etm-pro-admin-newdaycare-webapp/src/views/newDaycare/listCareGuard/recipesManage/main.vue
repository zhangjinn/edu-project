<template>
  <div class="main-wrap">
    <etm-layout-split>
      <template slot="header">
        <etm-tabs
          ref="tabs"
          v-model="activeName"
          :setting="hasAuthOfBool('guardcare.recipes.setting')"
          @setting="setting"
          @tab-click="tabChange"
        >
          <el-tab-pane
            v-if="hasAuth('guardcare.recipes.queryBatch', 'tabs', 'activeName')"
            label="幼儿食谱"
            name="tab1"
          >
            <etm-tool-bar
              v-model="formData1"
              @search="search('tab1',formData1)"
              @reset="reset('tab1',formData1)"
            />
          </el-tab-pane>

          <el-tab-pane
            label="食材库"
            name="tab2"
          >
            <etm-tool-bar
              v-model="formData2"
              @search="search('tab2',formData2)"
              @reset="reset('tab2',formData2)"
            />
          </el-tab-pane>

          <el-tab-pane
            v-if="hasAuth('guardcare.food.queryBatch', 'tabs', 'activeName')"
            label="菜肴库"
            name="tab3"
          >
            <etm-tool-bar
              v-model="formData3"
              @search="search('tab3',formData3)"
              @reset="reset('tab3',formData3)"
            />
          </el-tab-pane>
        </etm-tabs>
      </template>
      <template slot="body">
        <first-table
          v-if="activeName==='tab1'"
          ref="tab1"
        />
        <ingredients-library-table
          v-if="activeName==='tab2'"
          ref="tab2"
        />
        <second-table
          v-if="activeName==='tab3'"
          ref="tab3"
        />
      </template>
    </etm-layout-split>
  </div>
</template>

<script>
import baseMixin from '@/layout/mixin/baseMixin'

import firstTable from './firstTable/firstTable'
import secondTable from './secondTable/secondTable'
import ingredientsLibraryTable from './ingredientsLibraryTable'
import { getSemesterSetting, getSemesterWeekSetting } from '@/api/newDaycare/listEduGuardScheduleManage'
import { getGrade } from '@/api/newDaycare/listEduGuardGradeManage'
import { getFoodType, queryIngredientsType } from '@/api/newDaycare/recipesGuardManage'

export default {
  name: 'Index',
  components: {
    firstTable,
    secondTable,
    ingredientsLibraryTable
  },
  mixins: [baseMixin],
  data () {
    return {
      activeName: 'tab1',
      formData1: [
        {
          label: '年级',
          type: 'select',
          prop: 'grade',
          value: null,
          default: null,
          name: null,
          props: {
            filterable: true,
            placeholder: '请选择年级'
          },
          options: []
        },
        {
          label: '学期',
          type: 'select',
          prop: 'semester',
          value: null,
          default: null,
          name: null,
          props: {
            filterable: true,
            placeholder: '请选择学期'
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
        }
      ],
      formData2: [
        {
          label: '食材名称',
          type: 'input',
          prop: 'name',
          value: null,
          props: {
            placeholder: '请输入食材名称'
          }
        },
        {
          label: '食材类型',
          type: 'select',
          prop: 'type',
          value: null,
          props: {
            placeholder: '请选择食材类型'
          },
          options: []
        }
      ],
      formData3: [
        {
          label: '菜肴名称',
          type: 'input',
          prop: 'name',
          value: null,
          props: {
            placeholder: '请输入菜肴名称'
          }
        },
        {
          label: '菜肴类型',
          type: 'select',
          prop: 'type',
          value: null,
          props: {
            placeholder: '请选择菜肴类型'
          },
          options: []
        }
      ]

    }
  },
  created () {
    this.tabChange()
  },
  activated () {
    if (this.$store.state.guardcareDashboard.pageEntry === 'addRecipes') {
      this.activeName = 'tab1'
      this.$nextTick(() => {
        this.$refs.tab1.handleAdd()
        this.$store.commit('guardcareDashboard/SET_PAGEENTRY', null)
      })
    } else if (this.$store.state.guardcareDashboard.pageEntry === 'addDishes') {
      this.activeName = 'tab3'
      this.$nextTick(() => {
        this.$refs.tab3.handleAdd()
        this.$store.commit('guardcareDashboard/SET_PAGEENTRY', null)
      })
    }
  },

  methods: {

    setting () {
      this.$router.push({ name: 'recipesGuardSetting' })
    },

    async tabChange () {
      if (this.activeName === 'tab1') {
        this.getGradeList()
        await this.getSemesterSettingData()
        this.search('tab1', this.formData1)
      } else if (this.activeName === 'tab2') {
        this.getIngredientsTypeData()
        this.search('tab2', this.formData2)
      } else if (this.activeName === 'tab3') {
        this.getFoodTypeData()
        this.search('tab3', this.formData3)
      }
    },

    search (ref, formData) {
      const that = this
      this.$nextTick(() => {
        that.$refs[ref].formData = formData
        that.$refs[ref].reset()
      })
    },

    async reset (ref, formData) {
      formData.forEach((item, index) => {
        item.value = null
      })
      if (this.activeName === 'tab1') {
        await this.getSemesterSettingData()
      }
      this.search(ref, formData)
    },

    // 获取年级列表
    getGradeList () {
      const param = {
        paged: false,
        noLoadding: true
      }
      getGrade(param).then((res) => {
        this.formData1[0].options = this.convertDataToOptions(res.data, 'name', 'id')
      })
    },

    // 学期
    async getSemesterSettingData () {
      await getSemesterSetting({
        noLoadding: true
      }).then(res => {
        const options = this.convertDataToOptions(res.data, 'name', 'id')
        const currentSemester = res.data.filter(val => val.currentTerm)

        this.formData1[1].options = options
        if (this.formData1[1].options.length > 0) {
          if (currentSemester.length > 0) {
            this.formData1[1].value = currentSemester[0].id
            this.formData1[1].default = currentSemester[0].id
            this.formData1[1].name = currentSemester[0].name
          } else {
            this.formData1[1].value = this.formData1[1].options[0].value
            this.formData1[1].default = this.formData1[1].options[0].value
            this.formData1[1].name = this.formData1[1].options[0].label
          }
        }
      }).catch(err => {
        console.error(err)
      })
      await this.changeSemester(this.formData1[1].value)
    },

    // 学期改变设置周次
    async changeSemester (id) {
      this.formData1[2].value = null
      const param = {
        courseTermId: id,
        noLoadding: true
      }
      await getSemesterWeekSetting(param).then((res) => {
        if (res.data) {
          this.formData1[2].options = this.convertDataToOptions(res.data, 'name', 'id')
        }
      })
    },

    // 食材类型
    getIngredientsTypeData () {
      queryIngredientsType().then(res => {
        if (res.data) {
          this.formData2[1].options = this.convertDataToOptions(res.data, 'name', 'id')
        }
      })
    },

    // 菜肴类型
    getFoodTypeData () {
      getFoodType().then(res => {
        if (res.data) {
          this.formData3[1].options = this.convertDataToOptions(res.data, 'foodTypeName', 'foodTypeId')
        }
      })
    }

  }
}
</script>

<style scoped>

</style>
