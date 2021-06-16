<template>
  <etm-main-body>
    <etm-layout-split>
      <template slot="left">
        <div class="recipe-collapse">
          <el-input
            v-model="dishesName"
            placeholder="请输入搜索内容"
            @blur="handleSearch"
          >
            <span
              slot="suffix"
              style="cursor: pointer;"
              class="el-input__icon el-icon-search"
              @click="handleSearch"
            />
          </el-input>
          <el-collapse
            v-if="recipeLists.length>0"
            v-model="activeNames"
          >
            <div
              v-for="(it, index) in recipeLists"
              :key="index"
            >
              <el-collapse-item
                v-if="it.listFoodVOS.length>0"
                :name="index"
              >
                <template slot="title">
                  {{ it.foodTypeName }}
                </template>
                <draggable
                  class="dragArea list-group"
                  :list="it.listFoodVOS"
                  :group="{ name: 'people', pull: 'clone', put: false }"
                  :sort="false"
                  :clone="cloneDog"
                >
                  <div
                    v-for="item in it.listFoodVOS"
                    :key="item.foodId"
                    class="list-group-item"
                    :style="{color:it.color, background:bgColor(it.color) }"
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
          :date="startDate"
          :week-tag="false"
          :title-time="false"
          @handleAdd="handleAdd"
          @handleUpDate="upDate"
        >
          <template slot="toolLeft">
            <div class="tooLeft">
              <p v-if="weekName">
                {{ weekName }}
              </p>
              <p v-if="generationName">
                {{ generationName }}
              </p>
              <!--              <p v-if="startAge && endAge">{{ startAge + '岁至' + endAge + '岁' }} </p>-->
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
              @click="handleEcommendRecipe"
            >
              使用推荐食谱
            </el-button>
            <el-button
              slot="right"
              plain
              @click="handleCopy"
            >
              复制周食谱
            </el-button>
            <!--            <el-button slot="right" type="primary">导出Excel</el-button>-->
            <el-button
              slot="right"
              plain
              @click="exportTable"
            >
              导出Excel
            </el-button>
          </template>

          <!--表格-->
          <template v-slot:cell="data">
            <draggable
              class="dragArea list-group dragAreaCell"
              :list="data.cellList"
              :group="{ name: 'people', pull: false, put: true }"
              :sort="false"
              @change="changeLog($event, data.labelId, data.cellList, data.colProp)"
            >
              <div
                v-for="(item,index) in data.cellList"
                :key="index"
                class="list-group-item"
              >
                <EtmCell
                  :data="item"
                  :auth-delete="hasAuthOfBool('daycare.recipes.remove')"
                  :show-ingredients="checked"
                  @handleDelete="handleDelete(item, data.labelId, data.cellList, data.colProp)"
                />
              </div>
            </draggable>
          </template>
        </EtmWeeklyCalendar>
      </template>
    </etm-layout-split>

    <!--添加弹框-->
    <etm-pop
      v-if="popVisibleEdit"
      :visible="popVisibleEdit"
      pop="complex"
      :title="popTitle"
      confirm-btn="确定"
      cancel-btn="取消"
      @close="popCloseEdit"
      @cancel="popCloseEdit"
      @confirm="popConfirmEdit"
    >
      <div class="popContent">
        <chooseDishes
          v-if="popVisibleEdit && popType==='choose'"
          ref="childChooseDishesPopForm"
        />
        <copy
          v-if="popVisibleEdit && popType==='copy'"
          ref="childCopyPopForm"
        />
      </div>
    </etm-pop>

    <!--推荐食谱-->
    <etm-pop
      v-if="popVisibleEcommendRecipe"
      :visible="popVisibleEcommendRecipe"
      pop="big"
      title="推荐周食谱"
      confirm-btn="确定"
      cancel-btn="取消"
      @close="popVisibleEcommendRecipe = false"
      @cancel="popVisibleEcommendRecipe = false"
      @confirm="popVisibleEcommendRecipe = false"
    >
      <div class="popContent">
        <EcommendRecipe
          v-if="popVisibleEcommendRecipe"
          :week-recipe-id="weekRecipeId"
          :generation-name="generationName"
          @handleRecipeChange="popVisibleEcommendRecipe = false;entrance()"
        />
      </div>
    </etm-pop>
  </etm-main-body>
</template>

<script>
import baseMixin from '@/layout/mixin/baseMixin'
import formValidate from '@/utils/rules'
import draggable from 'vuedraggable'
import { rgbToRgba } from '@/utils'
// import etmMainBody from '@/layout/main/EtmMainBody'
import EtmWeeklyCalendar from '@/views/newDaycare/recipesManage/components/EtmWeeklyCalendar/index'
import EtmCell from './cell'
import copy from './copy'
import EcommendRecipe from './recommendedRecipe'
import chooseDishes from './chooseDishes'
import {
  queryDaycareFoodTypeAndFood,
  queryDaycareWeekRecipe,
  createDaycareRecipeItem,
  removeDaycareRecipeItem,
  copyDaycareWeekRecipe,
  checkDaycareWeekRecipe
} from '@/api/newDaycare/recipesManage'

export default {
  name: 'EditClass',
  components: {
    draggable,
    // etmMainBody,
    EtmWeeklyCalendar,
    EtmCell,
    copy,
    EcommendRecipe,
    chooseDishes
  },
  mixins: [baseMixin],
  data () {
    return {
      formValidate,
      activeNames: [],
      checked: false,
      popVisibleEdit: false,
      popVisibleEcommendRecipe: false,
      popTitle: null,
      popType: null,
      tableData: {
        title: '餐次',
        content: []
      },
      weekRecipeId: '',
      weekId: '',
      weekName: '',
      recipeLists: [],
      dishesName: '',
      // startAge: '',
      // endAge: '',
      generationId: '',
      generationName: '',
      labelId: null, // 纵坐标id
      colProp: null, // 横坐标id
      cellList: null // 单元格内容

    }
  },

  // 监听,当路由发生变化的时候执行
  watch: {
    $route: {
      handler: function (val) {
        if (val.name === 'recipeEdit') {
          this.entrance()
        }
      },
      // 深度观察监听
      deep: true
    }
  },
  created () {
    this.entrance()
  },
  methods: {
    entrance () {
      this.weekRecipeId = this.$route.query.weekRecipeId
      // this.startAge = this.$route.query.startAge
      // this.endAge = this.$route.query.endAge
      this.generationId = this.$route.query.generationId
      this.generationName = this.$route.query.generationName
      this.weekName = this.$route.query.weekName
      this.startDate = this.$route.query.startDate
      this.endDate = this.$route.query.endDate
      this.getFoodClassificationData()
    },

    // 搜索菜肴
    handleSearch () {
      this.getFoodClassificationData('search')
    },

    // 获取菜肴列表并分类
    getFoodClassificationData () {
      queryDaycareFoodTypeAndFood(this.dishesName).then((res) => {
        const { data } = res
        this.recipeLists = data
        this.activeNames = []
        for (let i = 0; i < this.recipeLists.length; i++) {
          this.activeNames.push(i)
          this.recipeLists[i].listFoodVOS = this.recipeLists[i].listFoodVOS.map(v => {
            v.color = this.recipeLists[i].color
            return v
          })
        }
        this.init()
      })
    },

    // 拖拽
    changeLog (evt, labelId, cellList, colProp) {
      // console.log('拖拽', evt, labelId, cellList, colProp)

      this.labelId = labelId
      this.colProp = colProp

      const newIndex = evt.added.newIndex
      const element = evt.added.element
      const oldArr = JSON.parse(JSON.stringify(cellList))
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
          weekRecipeId: this.weekRecipeId,
          date: this.colProp,
          label: this.labelId,
          foodIdList: [element.foodId]
        }
        this.postRecipeItemData(param, newIndex, cellList)
      }
    },

    // 拖拽克隆数据
    cloneDog (val) {
      // console.log('拖拽克隆数据', val)
      return val
    },

    // 根据颜色设置背景色
    bgColor (color) {
      if (!color) return
      return rgbToRgba(color, 0.1)
    },

    // 切换上下周
    upDate (val) {
      // console.log(val)
    },

    // 是否显示食材
    changeCheckbox (val) {
      this.checked = val
    },

    // 获取周食谱
    init () {
      const id = this.weekRecipeId
      queryDaycareWeekRecipe(id).then((res) => {
        // console.log(res)
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
    handleDelete (item, labelId, cellList, colProp) {
      // console.log('删除周食谱项', item)
      this.labelId = labelId
      this.cellList = cellList
      this.colProp = colProp
      removeDaycareRecipeItem(item.recipeItemFoodId).then(() => {
        this.$message.success('已删除')
        this.init()
      })
      // this.$etmTip.init({
      //   type: 'error',
      //   title: `确认删除该数据？`,
      //   content: `删除后将无法撤销，是否继续操作？`,
      //   confirmBtn: '删除',
      //   cancelBtn: '取消',
      //   cancel: () => {
      //     this.$etmTip.close()
      //   },
      //   confirm: () => {
      //     this.labelId = labelId
      //     this.cellList = cellList
      //     this.colProp = colProp
      //     removeDaycareRecipeItem(item.recipeItemFoodId).then(() => {
      //       this.$etmTip.close()
      //       this.$message.success('已删除')
      //       this.init()
      //     }).catch(() => {
      //       this.$etmTip.close()
      //     })
      //   }
      // })
      // this.$etmTip.open()
    },

    // 添加周食谱项
    handleAdd (labelId, cellList, colProp) {
      this.popType = 'choose'
      this.popTitle = '添加菜肴'
      this.labelId = labelId
      this.cellList = cellList
      this.colProp = colProp
      // console.log(labelId, colProp)
      this.popVisibleEdit = true
    },

    // 弹窗关闭
    popCloseEdit () {
      this.popVisibleEdit = false
    },

    // 弹窗确定
    popConfirmEdit () {
      let ref = null
      if (this.popType === 'choose') {
        ref = 'childChooseDishesPopForm'
        this.$refs[ref].$refs.form.$children[0].validate(valid => {
          if (valid) {
            const formData = this.$refs[ref].form
            let result = 0
            this.cellList.map((val) => {
              if (val.foodId === formData.dish) {
                result += 1
              }
            })

            if (result > 0) {
              this.$message.error('不能重复添加')
              this.popVisibleEdit = false
            } else {
              const param = {
                weekRecipeId: this.weekRecipeId,
                date: this.colProp,
                label: this.labelId,
                foodIdList: formData.dish
              }
              this.postRecipeItemData(param)
            }
          }
        })
      } else if (this.popType === 'copy') {
        ref = 'childCopyPopForm'
        this.$refs[ref].$refs.form.$children[0].validate(valid => {
          if (valid) {
            const formData = this.$refs[ref].form
            const param = {
              weekRecipeId: this.weekRecipeId,
              weekName: formData.weekName,
              startDate: formData.startDate,
              endDate: formData.endDate,
              // startAge: formData.startAge,
              // endAge: formData.endAge,
              generationId: formData.generationId,
              remarks: formData.remarks
            }
            checkDaycareWeekRecipe(param).then(res => {
              // 复制周食谱
              if (res.data) {
                this.$etmTip.init({
                  type: 'warn',
                  title: '选择的周已经存在食谱',
                  content: '选择的周已经存在食谱，是否覆盖？',
                  confirmBtn: '覆盖',
                  cancelBtn: '取消',
                  cancel: () => {
                    this.$etmTip.close()
                  },
                  confirm: () => {
                    this.handleCopyWeekRecipe(param)
                    this.$etmTip.close()
                  }
                })
                this.$etmTip.open()
              } else {
                this.handleCopyWeekRecipe(param)
              }
            })
          }
        })
      }
    },

    // 添加食谱项
    postRecipeItemData (param, newIndex, cellList) {
      createDaycareRecipeItem(param).then(() => {
        this.$message({
          message: '已添加',
          type: 'success'
        })
        this.popVisibleEdit = false
        this.init()
      }).catch(err => {
        console.log(err)
        this.$message.error('添加失败！')
        if (newIndex) {
          cellList.splice(newIndex, 1)
        }
      })
    },
    handleCopyWeekRecipe (param) {
      copyDaycareWeekRecipe(param).then(() => {
        this.$message({
          message: '已复制',
          type: 'success'
        })
        this.popVisibleEdit = false
        this.init()
      })
    },
    // 推荐食谱
    handleEcommendRecipe () {
      this.popVisibleEcommendRecipe = true
    },
    exportTable () {
      // console.log('ref', this.$refs.xlsxTable.$children[4].$el)
      this.exportTableToExcel({
        ref: this.$refs.xlsxTable.$children[4].$el,
        name: '周食谱',
        sheetName: this.weekName,
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
  /* Firefox */
  /*stylelint不允许重复的属性*/
  /*overflow: -moz-hidden-unscrollable;*/
  overflow: -moz-scrollbars-none;

  ::v-deep.el-collapse {
    border-top: 0;
    height: calc(100vh - 170px);
    /* IE10+ */
    -ms-overflow-style: none;
    overflow-y: auto;
    /* Firefox */
    scrollbar-width: none;
    /* Chrome && safari */
    &::-webkit-scrollbar {
      display: none;
    }

    .el-collapse-item__header {
      border-bottom: 1px solid #ebeef5;
    }

    .el-collapse-item__wrap {
      border-bottom: 0;
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

.showIngredients {
  margin-right: 24px;
}
</style>
