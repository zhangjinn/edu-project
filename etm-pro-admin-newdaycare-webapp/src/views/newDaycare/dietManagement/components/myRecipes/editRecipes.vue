<template>
  <div class="editRecipes-wrap">
    <!--<etm-main-body>-->
    <etm-layout-split>
      <template slot="left">
        <div class="recipe-collapse">
          <el-input
            v-model="dishesName"
            placeholder="请输入搜索内容"
            @keyup.enter.native="handleSearch"
          >
            <span
              slot="suffix"
              class="el-input__icon el-icon-search"
            />
          </el-input>

          <el-collapse
            v-if="recipeLists.length>0"
            v-model="activeNames"
          >
            <div
              v-for="(recipeList, index) in recipeLists"
              :key="index"
            >
              <el-collapse-item
                v-if="recipeList.foodList.length>0"
                :name="index"
              >
                <template slot="title">
                  {{ recipeList.foodTypeName }}
                </template>
                <draggable
                  class="dragArea list-group"
                  :list="recipeList.foodList"
                  :group="{ name: 'recipe', pull: 'clone', put: false }"
                  :sort="false"
                  :clone="cloneDog"
                >
                  <div
                    v-for="item in recipeList.foodList"
                    :key="item.foodId"
                    class="list-group-item"
                    :style="{color:recipeList.color, background:bgColor(recipeList.color) }"
                  >
                    {{ item.foodName }}
                  </div>
                </draggable>
              </el-collapse-item>
            </div>
          </el-collapse>
        </div>
      </template>

      <template slot="right">
        <!--<EtmWeeklyCalendar-->
        <!--  ref="xlsxTable"-->
        <!--  :table-data="tableData"-->
        <!--  :week-tag="false"-->
        <!--  :title-time="false"-->
        <!--  @handleAdd="handleAdd"-->
        <!--  @handleUpDate="upDate"-->
        <!--&gt;-->
        <!--  &lt;!&ndash;组件左侧&ndash;&gt;-->
        <!--  <template slot="toolLeft">-->
        <!--    <div class="tooLeft">-->
        <!--      <p v-if="gradeName">{{ gradeName }}</p>-->
        <!--      <p v-if="weekName">{{ weekName }} </p>-->
        <!--    </div>-->
        <!--  </template>-->

        <!--  &lt;!&ndash;组件右侧&ndash;&gt;-->
        <!--  <template slot="toolRight">-->
        <!--    <el-button slot="right" type="primary" @click="handleAnalysis">营养分析</el-button>-->
        <!--  </template>-->
        <!--</EtmWeeklyCalendar>-->
        <EtmRecipesCalendar
          :table-data="tableData"
          @handleAdd="handleAdd"
          @handleUpdate="upDate"
        >
          <template slot="recipeTitle">
            <span>食谱编辑</span>
          </template>

          <template slot="toolLeft">
            <span>2020-01-18至2020-01-18  第x周</span>
          </template>

          <template slot="toolRight">
            <etm-text>《中国孕期、哺乳期妇女和0-6岁儿童膳食指南》</etm-text>
            <el-button
              slot="right"
              type="primary"
              @click="handleAnalysis"
            >
              营养分析
            </el-button>
          </template>

          <template v-slot:cell="data">
            <draggable
              class="dragArea list-group dragAreaCell"
              :list="data.cellList"
              :group="{ name: 'recipe', pull: false, put: true }"
              :sort="false"
              @change="draggleFood($event, data.labelId, data.cellList, data.colProp)"
            >
              <div
                v-for="(item,index) in data.cellList"
                :key="index"
                class="list-group-item"
              >
                <EtmCell
                  :data="item"
                  :show-ingredients="checked"
                  @handleDelete="handleDelete(item, data.labelId, data.cellList, data.colProp)"
                />
              </div>
            </draggable>
          </template>
        </EtmRecipesCalendar>
      </template>
    </etm-layout-split>

    <etm-pop
      :visible="isShowEditPopup"
      pop="complex"
      title="添加菜肴"
      confirm-btn="确定"
      cancel-btn="取消"
      @close="cancelEditPopup"
      @cancel="cancelEditPopup"
      @confirm="confirmEditPopup"
    >
      <chooseDishes
        v-if="isShowEditPopup"
        ref="childChooseDishesPopForm"
      />
    </etm-pop>
    <!--</etm-main-body>-->
  </div>
</template>

<script>
// import EtmMainBody from '@/views/sacc/schedule/components/EtmMainBody/src/EtmMainBody'
import { getFoodClassification, getWeekRecipeItem } from '@/api/newDaycare/recipesGuardManage'
// import EtmWeeklyCalendar from '../EtmWeeklyCalendar/index'
import EtmRecipesCalendar from '../EtmRecipesCalendar/index'
import { rgbToRgba } from '@/utils'
import draggable from 'vuedraggable'
import chooseDishes from './components/chooseDishes'
import EtmCell from '../EtmCell/cell'
/**
 * editRecipes create by Administrator
 * createTime 2021/3/11 16:55
 */
export default {
  name: 'EditRecipes',
  components: { draggable, chooseDishes, EtmRecipesCalendar, EtmCell },
  filters: {},
  mixins: [],
  props: {},
  data () {
    return {
      dishesName: '', // 搜索的菜肴名
      isShowEditPopup: false, // 添加菜肴弹窗flag
      recipeLists: [], // 菜肴数组
      activeNames: [], // collapse激活数组
      weekRecipeId: '', // 周食谱id
      tableData: { // 食谱数据
        title: '餐次',
        content: []
      }
    }
  },
  computed: {},
  watch: {},
  created () {
    this.entrance()
  },
  mounted () {
    this.init()
  },
  methods: {
    entrance () {
      this.weekRecipeId = 25
      this.semesterId = 5
      this.weekId = 192
      this.weekName = '2021-02-15至2021-02-21 第3周'
      this.gradeId = 7
      this.gradeName = '滴滴年级'
      // this.weekRecipeId = this.$route.query.weekRecipeId
      // this.semesterId = this.$route.query.semesterId
      // this.weekId = this.$route.query.weekId
      // this.weekName = this.$route.query.weekName
      // this.gradeId = this.$route.query.gradeId
      // this.gradeName = this.$route.query.gradeName

      this.getFoodClassificationData()
    },
    init () {
      const id = this.weekRecipeId
      getWeekRecipeItem(id).then((res) => {
        this.tableData.content = res.data
        console.log(this.tableData, 'tableData')
      })
    },
    handleSearch () {
      this.getFoodClassificationData('search')
    },
    // 拖拽
    draggleFood (evt, labelId, cellList, colProp) {
      console.log('cahngeLost')
      // this.labelId = labelId
      // this.colProp = colProp
      //
      // const newIndex = evt.added.newIndex
      // const element = evt.added.element
      // let oldArr = null
      // if (cellList) {
      //   oldArr = JSON.parse(JSON.stringify(cellList))
      // } else {
      //   oldArr = cellList
      // }
      //
      // let result = 0
      // oldArr.map((val, index) => {
      //   if (index !== newIndex) {
      //     if (val.foodId === element.foodId) {
      //       result += 1
      //     }
      //   }
      // })
      // if (result > 0) {
      //   this.$message.error('不能重复添加')
      //   cellList.splice(newIndex, 1)
      // } else {
      //   const param = {
      //     weekRecipeId: this.weekRecipeId,
      //     week: this.colProp,
      //     timeQuantumId: this.labelId,
      //     foodIdList: [element.foodId]
      //   }
      //   this.postRecipeItemData(param, newIndex, cellList)
      // }
    },
    handleDelete () {},
    // 获取菜肴列表分类
    getFoodClassificationData (type) {
      const params = {
        foodName: this.dishesName
      }
      getFoodClassification(params).then(res => {
        const { data } = res
        this.recipeLists = data.foodTypeList
        this.activeNames = []
        console.log(this.recipeLists, 'list')
        // 通过activeName激活collpase
        for (let i = 0; i < this.recipeLists.length; i++) {
          this.activeNames.push(i)
        }

        // 不是搜索那么就初始化
        if (!type) {
          this.init()
        }
      })
    },

    // 拖拽克隆数据
    cloneDog (val) {
      return val
    },
    // 根据颜色设置背景色
    bgColor (color) {
      if (!color) return
      return rgbToRgba(color, 0.1)
    },
    // 添加周食谱项
    handleAdd (labelId, cellList, colProp) {
      this.popType = 'choose'
      this.popTitle = '添加菜肴'
      this.labelId = labelId
      this.cellList = cellList
      this.colProp = colProp
      this.isShowEditPopup = true
    },
    upDate () {},
    // 营养分析
    handleAnalysis () {},

    // 取消添加菜肴弹窗
    cancelEditPopup () {
      this.isShowEditPopup = false
    },

    confirmEditPopup () {
      this.isShowEditPopup = false
    }
  }
}
</script>
<style lang="scss" scoped>
  .editRecipes-wrap {
    margin-top: 16px;
  }

  .recipe-collapse {
    ::v-deep .el-collapse {
      border-top: 0;

      .el-collapse-item__header {
        border-bottom: 0;
      }

      .el-collapse-item__wrap {
        @include bc_divide_color();
        border-bottom: 0;
        border-top: 1px solid;
      }

      .list-group-item {
        border-radius: 2px;
        cursor: move;
        margin-top: 8px;
        padding: 0 8px;
      }
    }
  }

  .dragAreaCell {
    min-height: 45px;
  }
</style>
