<template>
  <div class="recipeEdit">
    <!--    <etm-main-body>-->
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
              @click="handleSearch"
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
                  :group="{ name: 'people', pull: 'clone', put: false }"
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
        <EtmWeeklyCalendar
          ref="xlsxTable"
          :table-data="tableData"
          :week-tag="false"
          :title-time="false"
          @handleAdd="handleAdd"
        >
          <template slot="toolLeft">
            <div class="tooLeft">
              <p v-if="range">
                {{ range }}
              </p>
            </div>
          </template>
          <template slot="toolRight">
            <div class="showIngredients">
              <el-checkbox
                v-model="checked"
                @change="changeCheckbox"
              >
                显示食材用量
              </el-checkbox>
            </div>
            <el-button
              slot="right"
              type="primary"
              @click="popVisibleRecommend = true"
            >
              选用推荐食谱
            </el-button>
            <!--              <el-button slot="right" type="primary" @click="handleCopy">复制周食谱</el-button>-->
            <el-button
              slot="right"
              plain
              class="exportBtn"
              @click="exportTable"
            >
              导出Excel
            </el-button>
          </template>
          <template v-slot:cell="data">
            <div
              v-if="!data.cellList"
              class="nonSchoolDay"
            >
              休
            </div>
            <draggable
              v-else
              class="dragArea list-group dragAreaCell"
              :list="data.cellList"
              :group="{ name: 'people', pull: false, put: true }"
              :sort="false"
              @change="changeLog($event, data.labelId, data.cellList, data.colProp, data.labelName)"
            >
              <div
                v-for="(item,index) in data.cellList"
                :key="index"
                class="list-group-item"
              >
                <EtmCell
                  :data="item"
                  :show-ingredients="checked"
                  @handleDelete="handleDelete(item, data.labelId, data.cellList, data.colProp, data.labelName)"
                />
              </div>
            </draggable>
          </template>
        </EtmWeeklyCalendar>
      </template>
    </etm-layout-split>

    <!--选择菜肴、复制周食谱弹框-->
    <etm-pop
      :visible="popVisibleEdit"
      pop="simple"
      :title="popTitle"
      confirm-btn="确定"
      cancel-btn="取消"
      @close="popVisibleEdit = false"
      @cancel="popVisibleEdit = false"
      @confirm="popConfirmEdit"
    >
      <div class="popContent">
        <chooseDishes
          v-if="popVisibleEdit && popType==='choose'"
          ref="childChooseDishesPopForm"
        />
        <copy
          v-if="popVisibleEdit && popType==='copy' && semesterId && weekId && weekName"
          ref="childCopyPopForm"
          :semester-id="semesterId"
          :week-id="weekId"
          :week-name="weekName"
        />
      </div>
    </etm-pop>

    <!--推荐周食谱弹框-->
    <etm-pop
      :visible="popVisibleRecommend"
      pop="big"
      title="推荐食谱"
      :show-confirm-btn="false"
      :show-cancel-btn="false"
      @close="popVisibleRecommend = false"
    >
      <div class="popRecommendContent">
        <recommendedRecipe
          v-if="popVisibleRecommend"
          :recipe-id="recipesId"
          @handleRecipeChange="handleRecipeChange"
        />
      </div>
    </etm-pop>
    <!--    </etm-main-body>-->
  </div>
</template>

<script>
import baseMixin from '@/layout/mixin/baseMixin'
import formValidate from '@/utils/rules'
import draggable from 'vuedraggable'
import { rgbToRgba } from '@/utils'
// import etmMainBody from '@/components/EtmMainBody'
import EtmWeeklyCalendar from '@/components/EtmWeeklyCalendar/index'
import EtmCell from './cell'
import copy from './copy'
import chooseDishes from './chooseDishes'
import recommendedRecipe from './recommendedRecipe'
import {
  postWeekRecipeCopy
} from '@/api/standardcare/recipesManage'

import {
  addCellFood,
  removeCellFood,
  queryGridRecipe,
  queryFoodClassificationList
} from '@/api/standardcare/listFeatures/recipesManage'

export default {
  name: 'EditClass',
  components: {
    draggable,
    EtmWeeklyCalendar,
    EtmCell,
    copy,
    chooseDishes,
    recommendedRecipe
  },
  mixins: [baseMixin],
  data () {
    return {
      formValidate,
      activeNames: [],
      checked: false,
      popVisibleEdit: false,
      popVisibleRecommend: false,

      popTitle: null,
      popType: null,
      tableData: {
        title: '餐次',
        content: []
      },
      dishesName: '',
      recipeLists: [],
      recipesId: '',
      range: '',

      labelId: null, // 纵坐标id
      labelName: null, // 纵坐标名称
      colProp: null, // 横坐标id
      cellList: null // 单元格内容

    }
  },

  // 监听,当路由发生变化的时候执行
  watch: {
    $route: {
      handler: function (val, oldVal) {
        if (val.name === 'standardcare_recipeDetail') {
          this.entrance()
        }
      },
      // 深度观察监听
      immediate: true,
      deep: true
    }
  },
  // created() {
  //   this.entrance()
  // },
  methods: {
    entrance () {
      this.recipesId = parseInt(this.$route.query.recipesId)
      this.range = this.$route.query.range
      this.getFoodClassificationData()
    },

    // 搜索菜肴
    handleSearch () {
      this.getFoodClassificationData('search')
    },

    // 拖拽
    changeLog (evt, labelId, cellList, colProp, labelName) {
      this.labelId = labelId
      this.labelName = labelName
      this.colProp = colProp

      const newIndex = evt.added.newIndex
      const element = evt.added.element
      let oldArr = null
      if (cellList) {
        oldArr = JSON.parse(JSON.stringify(cellList))
      } else {
        oldArr = cellList
      }

      let result = 0
      oldArr.map((val, index) => {
        if (index !== newIndex) {
          if (val.foodId === element.foodId) {
            result += 1
          }
        }
      })
      if (result > 0) {
        this.$message.error('不能重复添加')
        cellList.splice(newIndex, 1)
      } else {
        const param = {
          recipeId: this.recipesId,
          week: this.weekName(this.colProp),
          timeQuantumName: this.labelName,
          foodIdList: [element.foodId]
        }
        this.postRecipeItemData(param, newIndex, cellList)
      }
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

    // 是否显示食材
    changeCheckbox (val) {
      this.checked = val
    },

    // 获取菜肴列表并分类
    getFoodClassificationData (type) {
      queryFoodClassificationList({
        foodName: this.dishesName
      }).then((res) => {
        const { data } = res
        this.recipeLists = data.foodTypeList
        this.activeNames = []
        for (let i = 0; i < this.recipeLists.length; i++) {
          this.activeNames.push(i)
        }
        if (!type) {
          this.init()
        }
      })
    },

    // 获取周食谱
    init () {
      queryGridRecipe({
        recipesId: this.recipesId
      }).then((res) => {
        this.tableData.content = res.data
      })
    },

    // 复制周食谱
    handleCopy () {
      this.popType = 'copy'
      this.popTitle = '复制食谱'
      this.popVisibleEdit = true
    },

    // 删除周食谱项
    handleDelete (item, labelId, cellList, colProp, labelName) {
      this.$etmTip.init({
        type: 'error',
        title: '确认删除该数据？',
        content: '删除后将无法撤销，是否继续操作？',
        confirmBtn: '删除',
        cancelBtn: '取消',
        cancel: () => {
          this.$etmTip.close()
        },
        confirm: () => {
          this.labelId = labelId
          this.labelName = labelName
          this.cellList = cellList
          this.colProp = colProp
          const param = {
            recipeId: this.recipesId,
            week: this.weekName(this.colProp),
            timeQuantumName: this.labelName,
            foodName: item.foodName,
            foodTypeName: item.foodTypeName
          }
          removeCellFood(param).then((res) => {
            this.$etmTip.close()
            this.$message.success('已删除')
            this.init()
          }).catch(() => {
            this.$etmTip.close()
          })
        }
      })
      this.$etmTip.open()
    },

    // 添加周食谱项
    handleAdd (labelId, cellList, colProp, labelName) {
      this.popType = 'choose'
      this.popTitle = '添加菜肴'
      this.labelId = labelId
      this.labelName = labelName
      this.cellList = cellList
      this.colProp = colProp
      this.popVisibleEdit = true
    },

    weekName (week) {
      switch (week) {
        case 'MON':
          return 'MONDAY'
        case 'TUES':
          return 'TUESDAY'
        case 'WED':
          return 'WEDNESDAY'
        case 'THUR':
          return 'THURSDAY'
        case 'FRI':
          return 'FRIDAY'
        case 'SAT':
          return 'SATURDAY'
        default:
          return 'SUNDAY'
      }
    },

    // 弹窗确定
    popConfirmEdit () {
      let ref = null
      if (this.popType === 'choose') {
        ref = 'childChooseDishesPopForm'
        this.$refs[ref].$refs.form.$children[0].validate(valid => {
          if (valid) {
            const formData = this.$refs[ref].form
            const param = {
              recipeId: this.recipesId,
              week: this.weekName(this.colProp),
              timeQuantumName: this.labelName,
              foodIdList: formData.dish
            }
            this.postRecipeItemData(param)
          }
        })
      } else if (this.popType === 'copy') {
        ref = 'childCopyPopForm'
        this.$refs[ref].$refs.form.$children[0].validate(valid => {
          if (valid) {
            const formData = this.$refs[ref].form

            let gradeIdArr = this.gradeId.split(',')
            gradeIdArr = gradeIdArr.map(Number)

            const param = {
              sourceWeekId: formData.week,
              targetWeekId: parseInt(this.weekId),
              courseTermId: parseInt(this.semesterId),
              gradeIdList: gradeIdArr
            }

            const checkVal = this.checkRecipe()
            if (checkVal) {
              this.$etmTip.init({
                type: 'warn',
                title: '确认复制？',
                content: '复制后将覆盖已有食谱内容，是否继续操作？',
                confirmBtn: '复制',
                cancelBtn: '取消',
                cancel: () => {
                  this.$etmTip.close()
                },
                confirm: () => {
                  this.postWeekRecipeCopyData(param, 'etmTip')
                }
              })
              this.$etmTip.open()
            } else {
              this.postWeekRecipeCopyData(param)
            }
          }
        })
      }
    },

    // 添加食谱项
    postRecipeItemData (param, newIndex, cellList) {
      addCellFood(param).then((res) => {
        this.$message({
          message: '已添加',
          type: 'success'
        })

        this.popVisibleEdit = false
        this.init()
      }).catch(err => {
        console.error(err)
        this.$message.error('添加失败！')
        if (newIndex) {
          cellList.splice(newIndex, 1)
        }
      })
    },

    // 复制周食谱
    postWeekRecipeCopyData (param, type) {
      postWeekRecipeCopy(param).then((res) => {
        this.$message({
          message: '已复制',
          type: 'success'
        })
        if (type) {
          this.$etmTip.close()
        }
        this.popVisibleEdit = false
        this.init()
      }).catch(() => {
        if (type) {
          this.$etmTip.close()
        }
        this.popVisibleEdit = false
      })
    },

    handleRecipeChange () {
      this.popVisibleRecommend = false
      this.entrance()
    },

    // 查看当前食谱是否有内容
    checkRecipe () {
      const week = ['mon', 'tues', 'wed', 'thur', 'fri', 'sat', 'sun']
      for (const key in this.tableData.content) {
        for (const k in week) {
          const cellData = this.tableData.content[key].data[week[k]]
          if (cellData) {
            const len = cellData.length
            if (len > 0) {
              return len
            }
          }
        }
      }
      return false
    },

    // 导出食谱
    exportTable () {
      this.exportTableToExcel({
        ref: this.$refs.xlsxTable.$refs.weeklyCalendarTable.$el,
        name: `${this.range}食谱`,
        sheetName: this.range,
        opt: {
          formatter: (key, cell, v) => {
            if (v && typeof v === 'string') {
              if (key.replace(/[^0-9]/ig, '') === '1') {
                return v.replaceAll(' ', '\n')
              } else {
                return v.replaceAll('删除', '\n')
              }
            }
            return v
          }
        }
      })
    }

  }

}
</script>

<style scoped lang="scss">
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

.nonSchoolDay {
  color: #999;
  font-size: 14px;
  text-align: center;
}

.dragAreaCell {
  min-height: 45px;
}

.showIngredients {
  margin-right: 24px;
}

.exportBtn {
  margin-left: 8px !important;
}

</style>
