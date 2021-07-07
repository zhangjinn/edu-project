<template>
  <div class="mainContent">
    <div class="recipesMainContent">
      <etm-layout-split>
        <div slot="header">
          <etm-tabs v-model="activeName" @tab-click="tabChange" @toggle="toggle">
            <el-tab-pane :label="$t('recipeManagement.tabTitleRecipeSettings')" name="SP">
              <etm-tool-bar v-show="show" v-model="formDataSP" @search="handleSearch" @reset="reset" />
            </el-tab-pane>
            <el-tab-pane :label="$t('recipeManagement.tabTitleDishesLibrary')" name="CY">
              <etm-tool-bar v-show="show" v-model="formDataCY" @search="handleSearch" @reset="reset" />
            </el-tab-pane>
          </etm-tabs>
        </div>
        <div slot="body">
          <etm-table-page
            :data="tableData"
            :columns="columns"
            @currentChange="currentChange"
          >
            <etm-table-tool-bar slot="tool">
              <div slot="right">
                <el-button v-if="activeName==='SP'" type="primary" icon="el-icon-plus" @click="handleAddRecipes('add')">{{ $t('recipeManagement.tableToolBarNewRecipe') }}</el-button>
                <el-button v-else type="primary" icon="el-icon-plus" @click="handleAddDishes">{{ $t('recipeManagement.tableToolBarNewDishes') }}</el-button>
              </div>
            </etm-table-tool-bar>
            <el-table-column slot="right" :label="$t('recipeManagement.tableTitleHandle')">
              <template v-if="activeName==='SP'" v-slot="scoped">
                <etm-text type="primary" @click="handleCheckRecipes(scoped.row,'edit')">{{ $t('recipeManagement.tableHandleModify') }}</etm-text>
                <etm-text type="primary" @click="handleCopyRecipes(scoped.row)">{{ $t('recipeManagement.tableHandleCopy') }}</etm-text>
              </template>
              <template v-else v-slot="scoped">
                <etm-text type="primary" @click="handleEditDishes(scoped.row)">{{ $t('recipeManagement.tableHandleModify') }}</etm-text>
                <etm-text type="danger" @click="handleDeleteDishes(scoped.row)">{{ $t('recipeManagement.tableHandleDelete') }}</etm-text>
              </template>
            </el-table-column>
          </etm-table-page>
        </div>
      </etm-layout-split>

    </div>

    <!--菜肴弹框-->
    <etm-pop
      :visible="handlePop"
      pop="simple"
      :title="popTitle"
      :confirm-btn="$t('base.confirmButtonText')"
      :cancel-btn="$t('base.cancelButtonText')"
      @close="handleClose"
      @confirm="handleConfirm"
      @cancel="handleCancel"
    >
      <div>
        <add-recipes v-if="handlePop && activeName==='SP'" ref="childForm" :form-data="formDataPop" />
        <add-dishes v-if="handlePop && activeName==='CY'" ref="childForm" :form-data="formDataPop" />
      </div>
    </etm-pop>
  </div>
</template>

<script>

import etmPop from '@/layout/main/EtmPop'
import addDishes from '../addDishes/index'
import addRecipes from '../addRecipes/index'
import { getWeekRecipeList, getFoodList, postFoodList, getFoodDetail, putFoodList, deleteFoodList, getWeekRecipesRepeat, postCopyRecipe, postWeekRecipe } from '@/api/recipes.js'
import { parseTime } from '@/utils'
export default {
  name: 'Index',
  components: {
    etmPop,
    addDishes,
    addRecipes
  },
  data() {
    return {
      show: true,
      activeName: 'SP',
      handlePop: false,
      popTitle: this.$t('recipeManagement.popTitleAddRecipe'),

      // 食谱搜索类型数据
      formDataSP: [
        {
          label: this.$t('recipeManagement.queryLabelRecipeTime'),
          type: 'date',
          prop: 'recipesTime',
          value: '',
          props: {
            type: 'week',
            format: this.$t('recipeManagement.weekDateFormat'),
            placeholder: this.$t('recipeManagement.queryRecipeTimePlaceHolderText'),
            'picker-options': { 'firstDayOfWeek': 1 }
          }
        }
      ],
      // 菜肴搜索类型数据
      formDataCY: [
        {
          label: this.$t('recipeManagement.queryLabelDishName'),
          type: 'input',
          prop: 'dishesName',
          value: '',
          props: {
            placeholder: this.$t('recipeManagement.queryDishNamePlaceHolderText')
          }
        }
      ],
      tableData: {
        content: []
      },
      spColumns: [ // 食谱--表格的列表头传值
        {
          label: this.$t('recipeManagement.tableTitleRecipeApplicationDate'),
          prop: 'weekNumber',
          align: 'left'
        },
        {
          label: this.$t('recipeManagement.tableTitleClass'),
          prop: 'clazzName',
          align: 'left'
        },
        {
          label: this.$t('recipeManagement.tableTitleUpdated'),
          prop: 'updateTime',
          align: 'left'
        }
      ],
      cyColumns: [ // 菜肴--表格的列表头传值
        {
          label: this.$t('recipeManagement.tableTitleDishName'),
          prop: 'foodName',
          align: 'left'
        },
        {
          label: this.$t('recipeManagement.tableTitleIngredientsAndDosage'),
          prop: 'description',
          align: 'left'
        }
      ],
      // 表格的列表头传值
      columns: [],
      // 新增食谱或菜肴弹框form
      formDataPop: {},

      foodId: '', // 菜肴id
      recipesId: '', // 菜肴id
      // 分页
      weekNumber: '', // 搜索食谱周时间
      foodName: '', // 搜索菜肴名称
      pageNum: 1,
      pageSize: 10
    }
  },
  created() {
    this.columns = this.spColumns
    this.getTableData()
  },
  methods: {

    // 筛选折叠
    toggle(val) {
      this.show = val
    },
    // 食谱设置、菜肴库tab切换
    tabChange(val) {
      this.activeName = val.name
      if (this.activeName === 'SP') {
        this.columns = this.spColumns
      } else {
        this.columns = this.cyColumns
      }
      this.pageNum = 1
      this.getTableData()
    },
    // 食谱搜索查询
    handleSearch(e) {
      let formData = []
      const obj = {}
      if (this.activeName === 'SP') {
        formData = this.formDataSP
      } else {
        formData = this.formDataCY
      }
      formData = formData.map(item => {
        obj[item.prop] = item.value
        return obj
      })
      if (this.activeName === 'SP') {
        const time = formData[0].recipesTime
        if (time) {
          this.weekNumber = this.getWeekStartAndEnd(time)
        }
      } else {
        const name = formData[0].dishesName
        if (name) {
          this.foodName = name
        }
      }
      this.pageNum = 1
      this.getTableData()
    },
    // 食谱搜索重置
    reset() {
      let formData = []
      if (this.activeName === 'SP') {
        formData = this.formDataSP
        this.weekNumber = ''
      } else {
        formData = this.formDataCY
        this.foodName = ''
      }
      formData.forEach(item => {
        item.value = ''
      })
      this.pageNum = 1
      this.getTableData()
    },

    // 获取列表
    getTableData() {
      const param = {
        pageNum: this.pageNum,
        pageSize: this.pageSize
      }
      if (this.activeName === 'SP') {
        param.weekNumber = this.weekNumber
        this.getWeekRecipeListData(param)
      } else {
        param.foodName = this.foodName
        this.getFoodList(param)
      }
    },
    // 食谱列表
    getWeekRecipeListData(param) {
      getWeekRecipeList(param).then((res) => {
        const result = res.data
        this.tableData = result
        this.tableData.content.forEach((val) => {
          val.updateTime = val.updateTime ? parseTime(val.updateTime) : ''
        })
      })
    },
    // 菜肴列表
    getFoodList(param) {
      getFoodList(param).then((res) => {
        const result = res.data
        this.tableData = result
      })
    },

    // 页码改变时触发事件
    currentChange(num, size) {
      this.pageNum = num
      this.pageSize = size
      this.getTableData()
    },
    // 添加食谱
    handleAddRecipes(type) {
      this.recipesId = ''
      this.popTitle = this.$t('recipeManagement.popTitleAddRecipe')
      this.formDataPop = {
        class: '',
        data: '',
        multiple: false
      }
      this.$store.dispatch('recipes/setRecipesType', type)
      this.handlePop = true
    },
    // 删除食谱
    handleDeleteRecipes() {

    },
    // 查看食谱
    handleCheckRecipes(row, type) {
      this.$store.dispatch('recipes/setRecipesType', type)
      this.$store.dispatch('recipes/setSelectedRecipesRow', row.recipeId)
      this.$emit('switch', { target: 'recipesDetail', index: 0 })
    },
    // 复制食谱
    handleCopyRecipes(row) {
      this.recipesId = row.recipeId
      this.popTitle = this.$t('recipeManagement.popTitleCopyRecipe')
      this.formDataPop = {
        class: [],
        data: '',
        multiple: true
      }
      this.handlePop = true
    },
    // 新增菜肴
    handleAddDishes() {
      this.foodId = ''
      this.popTitle = this.$t('recipeManagement.popTitleNewDishes')
      this.formDataPop = {
        name: '',
        desc: ''
      }
      this.handlePop = true
    },
    // 删除菜肴
    handleDeleteDishes(row) {
      this.foodId = row.foodId
      this.$confirm(this.$t('base.messageDeletePrompt'), this.$t('base.promptText'), {
        confirmButtonText: this.$t('base.confirmButtonText'),
        cancelButtonText: this.$t('base.cancelButtonText'),
        type: 'warning'
      }).then(() => {
        deleteFoodList(this.foodId).then((res) => {
          this.$message({
            type: 'success',
            message: this.$t('base.messageDeletedText')
          })
          this.getTableData()
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: this.$t('base.messageUndeletedText')
        })
      })
    },
    // 修改菜肴
    handleEditDishes(row) {
      this.foodId = row.foodId
      this.popTitle = this.$t('recipeManagement.popTitleModifyDishes')
      const param = {
        id: this.foodId
      }
      getFoodDetail(param, this.foodId).then((res) => {
        const { data } = res
        this.formDataPop = {
          name: data.foodName,
          desc: data.description
        }
        this.handlePop = true
      })
    },

    handleClose() {
      this.handlePop = false
    },
    // 确定tag
    handleConfirm() {
      this.$refs['childForm'].$refs['ruleForm'].$children[0].validate(valid => {
        if (valid) {
          const param = {}
          if (this.activeName === 'SP') {
            if (this.recipesId) { // 复制食谱
              param.clazzIds = this.formDataPop.class
              param.weekNumber = this.getWeekStartAndEnd(this.formDataPop.data)
            } else { // 新增食谱
              param.clazzIds = [this.formDataPop.class]
              param.weekNumber = this.getWeekStartAndEnd(this.formDataPop.data)
            }
            this.getWeekRecipesRepeatData(param)
          } else {
            param.foodName = this.formDataPop.name
            param.description = this.formDataPop.desc
            if (this.foodId) { // 修改菜肴
              this.putFoodListData(param, this.foodId)
            } else { // 新增菜肴
              this.postFoodListData(param)
            }
          }
        }
      })
    },
    handleCancel() {
      this.handlePop = false
    },
    // 新增食谱时查询班级是否已经存在食谱
    getWeekRecipesRepeatData(param) {
      getWeekRecipesRepeat(param).then((res) => {
        const { data } = res
        if (data.length === 0) {
          if (this.recipesId) { // 复制食谱
            param.weekRecipeId = this.recipesId
            param.startDate = this.getWeekStartAndEnd(this.formDataPop.data, 'start')
            param.endDate = this.getWeekStartAndEnd(this.formDataPop.data, 'end')
            this.postCopyRecipeData(param)
          } else { // 新增食谱
            const p = {}
            p.clazzId = this.formDataPop.class
            p.weekNumber = this.getWeekStartAndEnd(this.formDataPop.data)
            p.startDate = this.getWeekStartAndEnd(this.formDataPop.data, 'start')
            p.endDate = this.getWeekStartAndEnd(this.formDataPop.data, 'end')
            postWeekRecipe(p).then((res) => {
              const result = res.data
              this.$store.dispatch('recipes/setSelectedRecipesRow', result.weekRecipeId)
              this.$emit('switch', { target: 'recipesDetail', index: 0 })
            })
          }
        } else {
          let repeatClass = ''
          data.forEach((val, index) => {
            if (index === data.length - 1) {
              repeatClass += val.className
            } else {
              repeatClass += val.className + '、'
            }
          })
          this.$message({
            type: 'warning',
            message: `${repeatClass}${this.$t('recipeManagement.repeatClassReminder')}`
          })
        }
      })
    },
    // 复制食谱
    postCopyRecipeData(param) {
      postCopyRecipe(param).then((res) => {
        this.$message({
          type: 'success',
          message: this.$t('recipeManagement.copySuccessful')
        })
        this.handlePop = false
        this.getTableData()
      })
    },
    // 新增菜肴
    postFoodListData(param) {
      postFoodList(param).then((res) => {
        this.$message({
          type: 'success',
          message: this.$t('recipeManagement.successfullyAddedDishes')
        })
        this.handlePop = false
        this.getTableData()
      })
    },
    // 更新菜肴
    putFoodListData(param, foodId) {
      putFoodList(param, foodId).then((res) => {
        this.$message({
          type: 'success',
          message: this.$t('recipeManagement.successfullyUpdatedDishes')
        })
        this.handlePop = false
        this.getTableData()
      })
    },

    // 获取指定日期的那一周的开始、结束日期
    getWeekStartAndEnd(val, weekTime) {
      let now = ''
      if (val) {
        now = new Date(val) // 日期
      } else {
        now = new Date() // 日期
      }
      const nowDayOfWeek = now.getDay() // 本周的第几天
      const nowDay = now.getDate() // 当前日
      const nowMonth = now.getMonth() // 当前月
      // const nowYear = now.getYear() // 获取当前年份(2位)
      const nowFullYear = now.getFullYear() // 获取完整的年份(4位)
      const weekStart = this.getWeekStartDate(nowFullYear, nowMonth, nowDay, nowDayOfWeek, weekTime)
      const weekEnd = this.getWeekEndDate(nowFullYear, nowMonth, nowDay, nowDayOfWeek, weekTime)
      const yearWeek = this.getYearWeek(nowFullYear, nowMonth + 1, nowDay)
      const weekFormat = nowFullYear + '第' + yearWeek + '周' + weekStart + '-' + weekEnd
      if (!weekTime) {
        return weekFormat
      } else {
        if (weekTime === 'start') {
          return weekStart
        } else if (weekTime === 'end') {
          return weekEnd
        }
      }
    },

    // 获得某一周的开始日期
    getWeekStartDate(nowYear, nowMonth, nowDay, nowDayOfWeek, weekTime) {
      const weekStartDate = new Date(nowYear, nowMonth, nowDay - nowDayOfWeek + 1)
      return this.formatDate(weekStartDate, weekTime)
    },

    // 获得某一周的结束日期
    getWeekEndDate(nowYear, nowMonth, nowDay, nowDayOfWeek, weekTime) {
      const weekEndDate = new Date(nowYear, nowMonth, nowDay + (7 - nowDayOfWeek))
      return this.formatDate(weekEndDate, weekTime)
    },
    // 取当前时间是本年第几周
    getYearWeek(year, month, date) {
      // dateNow是当前日期
      // dateFirst是当年第一天
      // dataNumber是当前日期是今年第多少天
      // 用dataNumber + 当前年的第一天的周差距的和在除以7就是本年第几周

      const dateNow = new Date(year, parseInt(month) - 1, date)
      const dateFirst = new Date(year, 0, 1)
      const dataNumber = Math.round((dateNow.valueOf() - dateFirst.valueOf()) / 86400000)
      let dataWeek = Math.ceil((dataNumber + ((dateFirst.getDay() + 1) - 1)) / 7)
      if (dataWeek < 10) {
        dataWeek = '0' + dataWeek
      }
      return dataWeek
    },
    // 日期格式化
    formatDate(date, weekTime) {
      const myyear = date.getFullYear()
      let mymonth = date.getMonth() + 1
      let myweekday = date.getDate()
      if (mymonth < 10) {
        mymonth = '0' + mymonth
      }
      if (myweekday < 10) {
        myweekday = '0' + myweekday
      }
      if (!weekTime) {
        return mymonth + '月' + myweekday + '日'
      } else {
        return myyear + '-' + mymonth + '-' + myweekday
      }
    }

  }
}
</script>

<style scoped lang="scss">
.mainContent{

  .recipesMainContent{
    display: flex;
    flex-direction: column;
    height: 100%;
    overflow: hidden;

  }
}
</style>
