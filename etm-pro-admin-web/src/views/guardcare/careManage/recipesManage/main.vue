<template>
  <div class="main-wrap">
    <etm-layout-split>
      <template slot="header">
        <etm-tabs ref="tabs" v-model="activeName" :setting="hasAuthOfBool('guardcare.recipes.setting')" @setting="setting" @tab-click="tabChange">
          <el-tab-pane
            v-if="hasAuth('guardcare.recipes.queryBatch', 'tabs', 'activeName')"
            label="每周食谱"
            name="tab1"
          >
            <etm-tool-bar
              v-show="show"
              v-model="formData1"
              @search="search('tab1',formData1)"
              @reset="reset('tab1',formData1)"
            />
          </el-tab-pane>
          <el-tab-pane
            v-if="hasAuth('guardcare.food.queryBatch', 'tabs', 'activeName')"
            label="菜肴库"
            name="tab2"
          >
            <etm-tool-bar
              v-show="show"
              v-model="formData2"
              @search="search('tab2',formData2)"
              @reset="reset('tab2',formData2)"
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
        />
      </template>
    </etm-layout-split>

  </div>
</template>

<script>
import baseMixin from '@/layout/mixin/baseMixin'

import materialTable from './firstTable/firstTable'
import priceTable from './secondTable/secondTable'
import { getSemesterSetting, getSemesterWeekSetting } from '@/api/guardcare/edu/scheduleManage'
import { getGrade } from '@/api/guardcare/edu/gradeManage'
import { getFoodType } from '@/api/guardcare/careManage/recipesManage'

export default {
  name: 'Index',
  components: {
    materialTable,
    priceTable
  },
  mixins: [baseMixin],
  data() {
    return {
      activeName: 'tab1',
      show: true,
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
            placeholder: '请选择课年级'
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
            placeholder: '请选择课学期'
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
            placeholder: '请选择课周次'
          },
          options: []
        }
      ],
      formData2: [
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
  created() {
    this.getGradeList()
    this.getSemesterSettingData()
  },
  activated() {
    if (this.$store.state.guardcareDashboard.pageEntry === 'addRecipes') {
      this.activeName = 'tab1'
      this.$nextTick(() => {
        this.$refs.tab1.handleAdd()
        this.$store.commit('guardcareDashboard/SET_PAGEENTRY', null)
      })
    } else if (this.$store.state.guardcareDashboard.pageEntry === 'addDishes') {
      this.activeName = 'tab2'
      this.$nextTick(() => {
        this.$refs.tab2.handleAdd()
        this.$store.commit('guardcareDashboard/SET_PAGEENTRY', null)
      })
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.tabChange()
    })
  },
  methods: {
    setting() {
      this.$router.push({ path: '/guardcareSettings/recipesManageSetting' })
    },
    toggle(val) {
      this.show = val
    },
    search(ref, formData) {
      this.$refs[ref].formData = formData
      this.$refs[ref].reset()
    },
    tabChange() {
      if (this.activeName === 'tab1') {
        this.reset('tab1', this.formData1)
      } else if (this.activeName === 'tab2') {
        this.getFoodTypeData()
        this.reset('tab2', this.formData2)
      }
    },
    reset(ref, formData) {
      formData.forEach((item, index) => {
        item.value = null
      })
      if (this.activeName === 'tab1') {
        this.initSemester()
      }

      setTimeout(() => {
        this.$refs[ref].formData = formData
        this.$refs[ref].reset()
      }, 300)
    },

    // 获取年级列表
    async getGradeList() {
      const param = {
        paged: false
      }
      await getGrade(param).then((res) => {
        this.formData1[0].options = this.convertDataToOptions(res.data, 'name', 'id')
      })
    },

    // 学期
    getSemesterSettingData() {
      getSemesterSetting().then(res => {
        const semester = []
        res.data.forEach(v => {
          semester.push({
            label: `${v.name}`,
            value: v.id
          })
        })
        this.formData1[1].options = semester
        this.initSemester()
      }).catch(err => {
        console.error(err)
      })
    },

    // 初始化学期
    initSemester() {
      if (this.formData1[1].options.length > 0) {
        this.formData1[1].value = this.formData1[1].options[0].value
        this.formData1[1].default = this.formData1[1].options[0].value
        this.formData1[1].name = this.formData1[1].options[0].label
        this.$store.commit('guardcareRecipesManage/set_semester_id', this.formData1[1].value)
        this.changeSemester(this.formData1[1].value)
      }
    },

    // 周次
    getWeekData(id) {
      const param = {
        courseTermId: id
      }
      getSemesterWeekSetting(param).then((res) => {
        if (res.data) {
          this.formData1[2].options = this.convertDataToOptions(res.data, 'name', 'id')
        }
      })
    },

    // 学期改变
    changeSemester(id) {
      this.$store.commit('guardcareRecipesManage/set_semester_id', id)
      this.formData1[2].value = null
      this.getWeekData(id)
    },

    // 菜肴类型
    getFoodTypeData() {
      if (this.formData2[1].options.length > 0) {
        return
      }
      getFoodType().then(res => {
        if (res.data) {
          this.formData2[1].options = this.convertDataToOptions(res.data, 'foodTypeName', 'foodTypeId')
        }
      })
    }

  }
}
</script>

<style scoped>

</style>
