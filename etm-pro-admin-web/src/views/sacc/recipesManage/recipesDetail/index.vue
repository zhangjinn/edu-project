<template>
  <div class="recipesDetail">
    <etm-layout-split>
      <div class="recipesControl">
        <div class="recipesTime">
          <span>
            <etm-label>{{ $t('recipeManagement.detailRecipeTime') }}</etm-label>{{ weekNumber }}
          </span>
          <span>
            <etm-label>{{ $t('recipeManagement.detailClass') }}</etm-label>{{ clazzName }}
          </span>
        </div>
        <el-checkbox v-model="checked" :label="$t('recipeManagement.showIngredients')" />
      </div>
      <div class="tableItem">
        <recipes-table
          :table-data="tableData"
          :date-arr="dateArr"
          :show-desc="checked"
          :edit-cell="handleCellEdit"
          :delete-issue="handleIssueDelete"
        />

      </div>
    </etm-layout-split>

    <!--菜肴弹框-->
    <etm-pop
      :visible="handlePop"
      pop="simple"
      :title="$t('recipeManagement.popTitleUpdateDishes')"
      :confirm-btn="$t('base.confirmButtonText')"
      :cancel-btn="$t('base.cancelButtonText')"
      @close="handleClose"
      @confirm="handleConfirm"
      @cancel="handleCancel"
    >
      <div>
        <add-dishes v-if="handlePop" ref="childForm" :form-data="formDataPop" :show-lists="true" />
      </div>
    </etm-pop>
  </div>
</template>

<script>
const dayArr = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']
import { getSelectedRecipesRow } from '@/utils/auth'
import etmPop from '@/layout/main/EtmPop'
import addDishes from '../addDishes/index'
import recipesTable from './recipesTable'
import etmLabel from '@/components/EtmLabel'
import { getWeekRecipeTimeQuantum, getWeekRecipeDetail, postDayRecipe } from '@/api/recipes'
export default {
  name: 'Index',
  components: {
    etmPop,
    addDishes,
    recipesTable,
    etmLabel
  },
  data() {
    return {

      checked: false,
      handlePop: false,
      // 新增菜肴弹框form
      formDataPop: {
        name: '',
        selectedDishes: []
      },
      clazzName: '',
      weekNumber: '',
      tableData: [],
      dateArr: [], // 表格头部数据
      weekRecipeId: '', // 周食谱id
      weekData: [], // 一周的时间
      dayDate: '', // 选择的日期
      timeQuantumId: '' // 餐段id
    }
  },
  created() {
    this.weekRecipeId = getSelectedRecipesRow()
    this.getWeekRecipeData()
  },
  methods: {
    // 获取周食谱菜肴列表
    async getWeekRecipeData() {
      const weekRecipeTimeQuantum = await getWeekRecipeTimeQuantum(this.weekRecipeId)
      this.tableData = []
      this.weekData = []
      this.dateArr = []
      const result1 = weekRecipeTimeQuantum.data
      result1.forEach((val, index) => {
        this.tableData.push({
          timeQuantumName: val.timeQuantumName,
          timeQuantumId: val.timeQuantumId
        })
      })

      const weekRecipeData = await getWeekRecipeDetail(this.weekRecipeId)
      const { data: { clazzName, weekNumber, dayRecipeVoList }} = weekRecipeData
      this.clazzName = clazzName
      this.weekNumber = weekNumber

      dayRecipeVoList.forEach((day, index) => {
        this.weekData.push(day.date)
        const date = new Date(day.date)
        const m = ('0' + (date.getMonth() + 1)).slice(-2)
        const d = ('0' + date.getDate()).slice(-2)
        this.dateArr.push(`${m}.${d}`) // 处理表格横向的日期显示

        day.weekRecipeTimeQuantumVoList.forEach((time, i) => {
          this.tableData[i][dayArr[index]] = time.foodVOList
        })
      })
    },

    handleCellEdit(scope) {
      let dishes = []
      if (scope.row[dayArr[scope.column.index]]) {
        dishes = scope.row[dayArr[scope.column.index]]
      }
      this.formDataPop = {
        name: '',
        selectedDishes: dishes
      }
      const columnIndex = scope.column.index
      this.timeQuantumId = scope.row.timeQuantumId
      this.dayDate = this.weekData[columnIndex]
      this.handlePop = true
    },
    handleIssueDelete(scope, index) {
      const columnIndex = scope.column.index
      this.timeQuantumId = scope.row.timeQuantumId
      this.dayDate = this.weekData[columnIndex]
      const allLists = JSON.parse(JSON.stringify(scope.row[dayArr[scope.column.index]]))
      const commitLists = []
      const foodNames = []
      const descriptions = []
      allLists.forEach((val, i) => {
        if (index !== i) {
          commitLists.push(val)
        }
      })
      commitLists.forEach((val, index) => {
        foodNames.push(val.foodName)
        descriptions.push(val.description)
      })
      this.postDayRecipeData(foodNames, descriptions)
    },

    handleClose() {
      this.handlePop = false
    },
    // 确定tag
    handleConfirm() {
      this.$refs['childForm'].$refs['ruleForm'].$children[0].validate(valid => {
        if (valid) {
          console.log('验证完成')
          const foodNames = []
          const descriptions = []
          if (this.formDataPop.selectedDishes.length > 0) {
            this.formDataPop.selectedDishes.forEach((val) => {
              foodNames.push(val.foodName)
              descriptions.push(val.description)
            })
          }

          this.postDayRecipeData(foodNames, descriptions)
        }
      })
    },
    handleCancel() {
      this.handlePop = false
    },
    // 新增周食谱，食谱项
    postDayRecipeData(foodNames, descriptions) {
      const param = {}
      param.weekRecipeId = this.weekRecipeId
      param.date = this.dayDate
      param.timeQuantumId = this.timeQuantumId
      param.foodNames = foodNames
      param.descriptions = descriptions
      postDayRecipe(param).then((res) => {
        this.$message({
          type: 'success',
          message: this.$t('recipeManagement.successfullyUpdatedRecipeItem')
        })
        this.getWeekRecipeData()
        this.handlePop = false
      })
    }

  }
}
</script>

<style scoped lang="scss">
.recipesDetail{
  .recipesControl{
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-bottom: 16px;

    .recipesTime{
      @include c_text_color();
      margin-right: 18px;
      span:last-child{
        margin-left: 10px;
      }
    }
  }

  .tableItem{
    padding-bottom: 16px;
  }
}
</style>
