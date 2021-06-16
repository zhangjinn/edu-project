<template>
  <div>
    <template v-if="recommendedRecipeData.length > 0">
      <div
        v-for="(recipe, index) in recommendedRecipeData"
        :key="index"
        class="pop-recommend-item"
      >
        <div class="nav">
          <div class="nav-left">
            <span
              v-for="(category, ii) in recipe.suitableAge"
              :key="ii"
            >
              {{ category }}
              <span v-if="ii < recipe.suitableAge.length-1">, </span>
            </span>
          </div>
          <div
            v-show="recipe.weekRecipeList.length >= 3"
            class="nav-right"
          >
            <i
              class="iconfont iconleft-circle"
              :class="{'noClick':!recipe.showLeftIcon}"
              @click="handleMoveLeft(index)"
            />
            <i
              class="iconfont iconright-circle"
              :class="{'noClick':!recipe.showRightIcon}"
              @click="handleMoveRight(index)"
            />
          </div>
        </div>
        <div class="recipe-classify-scroll">
          <ul class="recipe-classify-wrapper">
            <li
              v-for="(item, idx) in recipe.weekRecipeList"
              :key="idx"
              :class="`recipe-classifys-item-${index}`"
              @click="handleRecipeDetail(item.id)"
            >
              <div class="recipe-classify-wrapper-item">
                <div class="recipe-icon">
                  <span class="iconfont iconshipu" />
                </div>
                <div class="recipe-detail">
                  <div class="name">
                    {{ item.name }}
                  </div>
                  <div class="num">
                    已使用：{{ item.useCount }}
                  </div>
                  <div class="tag">
                    <el-tag
                      v-for="(tag, i) in item.tag"
                      :key="i"
                    >
                      {{ tag }}
                    </el-tag>
                  </div>
                </div>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </template>

    <etm-pop
      :visible="popVisibleRecommendRecipeDetail"
      pop="big"
      title="食谱详情"
      :append-to-body="true"
      :show-confirm-btn="false"
      :show-cancel-btn="false"
      @close="popVisibleRecommendRecipeDetail = false"
    >
      <div class="popRecommendRecipeDetailContent">
        <div class="popRecipeDetailNav">
          <div class="popRecipeDetailNavLeft">
            <div class="type">
              <span
                v-for="(category, ii) in currentRecipeData.suitableAge"
                :key="ii"
              >
                {{ category }}
                <span v-if="ii < currentRecipeData.suitableAge.length-1">, </span>
              </span>
            </div>
            <div class="name">
              {{ currentRecipeData.name }}
            </div>
            <div class="num">
              已使用：{{ currentRecipeData.useCount }}
            </div>
            <div class="tag">
              <el-tag
                v-for="(tag, i) in currentRecipeData.tag"
                :key="i"
              >
                {{ tag }}
              </el-tag>
            </div>
          </div>
          <div class="popRecipeDetailNavRight">
            <el-button
              type="primary"
              @click="handleSelectedRecipe"
            >
              选择该食谱
            </el-button>
          </div>
        </div>
        <div class="popRecipeDetailWrapper">
          <div class="left-icon">
            <i
              class="iconfont iconleft-circle"
              :class="{'noClick':!showDetailLeftIcon}"
              @click="handleDetailMoveLeft"
            />
          </div>
          <div class="recipeDetail">
            <etm-weekly-calendar
              :table-data="currentRecipeData.tableData"
              :week-tag="false"
              :title-time="false"
              :add="false"
            >
              <template v-slot:cell="data">
                <div
                  v-if="!data.cellList"
                  class="nonSchoolDay"
                >
                  休
                </div>
                <template v-else>
                  <div
                    v-for="(item,index) in data.cellList"
                    :key="index"
                    class="list-group-item"
                  >
                    <etm-cell
                      :data="item"
                    />
                  </div>
                </template>
              </template>
            </etm-weekly-calendar>
          </div>
          <div class="right-icon">
            <i
              class="iconfont iconright-circle"
              :class="{'noClick':!showDetailRightIcon}"
              @click="handleDetailMoveRight"
            />
          </div>
        </div>
      </div>
    </etm-pop>
  </div>
</template>

<script>
import EtmWeeklyCalendar from './components/EtmWeeklyCalendar/index'
import EtmCell from './recommendedRecipeCell'
import { queryWeekRecipe, queryWeekRecipeDetail } from '@/api/base/base'
import { checkRecommendedRecipes, putRecommendedRecipes } from '@/api/newDaycare/recipesGuardManage'
export default {
  name: 'RecommendedRecipe',
  components: {
    EtmWeeklyCalendar,
    EtmCell
  },
  props: {
    weekRecipeId: {
      type: [Number, String],
      default: null
    }
  },
  data () {
    return {
      popVisibleRecommendRecipeDetail: false,
      showDetailLeftIcon: true,
      showDetailRightIcon: true,
      currentRecipeData: {
        tableData: {
          title: '餐次',
          content: []
        },
        name: '',
        suitableAge: [],
        tag: [],
        useCount: 0
      },
      currentRecipeIndex: 0,
      carouselRecipeIds: [],
      recommendedRecipeData: []

    }
  },
  created () {
    this.init()
  },

  methods: {
    init () {
      queryWeekRecipe().then((res) => {
        const result = res.data
        this.recommendedRecipeData = []
        this.carouselRecipeIds = []
        result.map((val, index) => {
          val.weekRecipeList.map((v, i) => {
            this.carouselRecipeIds.push(v.id)
          })
          const obj = {
            suitableAge: val.suitableAge, // 周食谱类别名称
            weekRecipeList: val.weekRecipeList, // 周食谱列表
            showLeftIcon: false, // 是否显示左箭头
            showRightIcon: true, // 是否显示右箭头
            maxClickNum: true, // 最大点击次数
            lastLeft: 0, // 上次滑动距离
            clickNum: 0 // 点击次数
          }
          this.recommendedRecipeData.push(obj) // 周食谱类别名称
        })
      })
    },

    // 点击右箭头（左侧滚动）
    handleMoveRight (index) {
      const classify = this.recommendedRecipeData[index]
      if (!classify.showRightIcon) return

      // 记录到最后一个元素出现在可视区域时，点击次数的最大值。
      classify.maxClickNum = classify.weekRecipeList.length - 2

      // 如果点击次数小于数组长度-1时，执行左滑动效果。
      if (classify.clickNum < classify.maxClickNum) {
        classify.showLeftIcon = true
        // 获取当前元素宽度
        const width = 370 + 24

        // 公示：滚动距离（元素的magin-left值） = 负的它自己的长度 + 上一次滑动的距离
        document.getElementsByClassName('recipe-classify-wrapper')[index].style.marginLeft = `${-width + classify.lastLeft}px`
        classify.lastLeft = -width + classify.lastLeft
        // 点击次数+1
        classify.clickNum += 1

        if (classify.clickNum === classify.maxClickNum) {
          classify.showRightIcon = false
        }
      }
    },

    // 点击左箭头（右侧滚动）
    handleMoveLeft (index) {
      const classify = this.recommendedRecipeData[index]
      if (!classify.showLeftIcon) return

      if (classify.clickNum > 0) {
        classify.showRightIcon = true
        // 获取当前元素宽度
        const width = 370 + 24
        // 公示：滚动距离（元素的magin-left值） = 它自己的长度 + 上一次滑动的距离
        document.getElementsByClassName('recipe-classify-wrapper')[index].style.marginLeft = `${classify.lastLeft + width}px`
        classify.lastLeft = width + classify.lastLeft
        // 点击次数-1
        classify.clickNum--
        // 如果点击次数小于最大点击次数，说明最后一个元素已经不在可是区域内了，显示右箭头
        if (classify.clickNum === 0) {
          classify.showLeftIcon = false
        }
      }
    },

    // 食谱详情
    handleRecipeDetail (id) {
      const indexOfId = (this.carouselRecipeIds || []).findIndex((item) => item === id)
      this.currentRecipeIndex = indexOfId
      this.showDetailRightIcon = true
      this.showDetailLeftIcon = true
      this.queryWeekRecipeDetailData(id)
      if (this.currentRecipeIndex === this.carouselRecipeIds.length - 1) {
        this.showDetailRightIcon = false
      }
      if (this.currentRecipeIndex === 0) {
        this.showDetailLeftIcon = false
      }
      this.popVisibleRecommendRecipeDetail = true
    },

    // 获取当前选中食谱详情
    queryWeekRecipeDetailData (id) {
      queryWeekRecipeDetail(id).then((res) => {
        const result = res.data
        this.currentRecipeData.tableData.content = result.mealSectionList
        this.currentRecipeData.name = result.name
        this.currentRecipeData.suitableAge = result.suitableAge
        this.currentRecipeData.tag = result.tag
        this.currentRecipeData.useCount = result.useCount
      })
    },

    // 详情页点击右箭头
    handleDetailMoveRight () {
      if (!this.showDetailRightIcon) return
      if (this.currentRecipeIndex < this.carouselRecipeIds.length - 1) {
        this.showDetailLeftIcon = true
        this.currentRecipeIndex++
        if (this.currentRecipeIndex === this.carouselRecipeIds.length - 1) {
          this.showDetailRightIcon = false
        }
        this.queryWeekRecipeDetailData(this.carouselRecipeIds[this.currentRecipeIndex])
      }
    },

    // 详情页点击左箭头
    handleDetailMoveLeft () {
      if (!this.showDetailLeftIcon) return
      if (this.currentRecipeIndex > 0) {
        this.showDetailRightIcon = true
        this.currentRecipeIndex--
        if (this.currentRecipeIndex === 0) {
          this.showDetailLeftIcon = false
        }
        this.queryWeekRecipeDetailData(this.carouselRecipeIds[this.currentRecipeIndex])
      }
    },

    // 确定导入当前食谱
    handleSelectedRecipe () {
      const param = {
        recommendedRecipesId: this.carouselRecipeIds[this.currentRecipeIndex],
        weekRecipesId: this.weekRecipeId
      }
      checkRecommendedRecipes(param).then((res) => {
        const result = res.data
        if (result) {
          let tip = ''
          if (result.result === 'OK') {
            putRecommendedRecipes(param).then((res) => {
              this.$message.success('已选用')
              this.$emit('handleRecipeChange')
            })
          } else if (result.result === 'EXISTING_CONTENT') {
            tip = '当前周已有内容，选择后内容将会被覆盖，是否继续操作?'
            this.recipeCheck(param, tip)
          } else if (result.result === 'EXISTING_DIFFERENCES') {
            tip = '模板餐次与系统已有餐次不一致，选择后内容将会被覆盖，是否继续操作?'
            this.recipeCheck(param, tip)
          } else if (result.result === 'EXISTING_CONTENT_AND_EXISTING_DIFFERENCES') {
            tip = '当前周已有内容, 并且模板餐次与系统已有餐次不一致，选择后内容将会被覆盖，是否继续操作?'
            this.recipeCheck(param, tip)
          }
        }
      })
    },

    // 校验推荐食谱
    recipeCheck (param, tip) {
      this.$etmTip.init({
        type: 'error',
        title: '确认选择当前食谱？',
        content: tip,
        confirmBtn: '选择',
        cancelBtn: '取消',
        cancel: () => {
          this.$etmTip.close()
        },
        confirm: () => {
          putRecommendedRecipes(param).then((res) => {
            this.$etmTip.close()
            this.$message.success('已选用')
            this.$emit('handleRecipeChange')
          }).catch(() => {
            this.$etmTip.close()
          })
        }
      })
      this.$etmTip.open()
    }

  }
}
</script>

<style scoped lang="scss">
.noClick {
  opacity: 0.3;
}

.pop-recommend-item {
  margin-bottom: 32px;

  .nav {
    align-items: center;
    display: flex;
    justify-content: space-between;
    margin-bottom: 24px;

    .nav-left {
      color: $color-text;
      font-size: 16px;
      font-weight: bold;
    }

    i {
      color: #999;
      cursor: pointer;
      font-size: 20px;
    }
  }

  .recipe-classify-scroll {
    overflow-x: hidden;
    transition: all 0.3s;

    ul {
      transition: all 0.3s;
      white-space: nowrap;

      li {
        border: 1px solid #dfdfdf;
        border-radius: 4px;
        cursor: pointer;
        display: inline-block;
        padding: 24px 0 18px 18px;
        width: 370px;

        &:not(:first-child) {
          margin-left: 24px;
        }

        .recipe-classify-wrapper-item {
          display: flex;

          .recipe-icon {
            width: 48px;

            .iconshipu {
              @include etm-color();
              font-size: 32px;
            }
          }

          .recipe-detail {
            .name {
              color: #212121;
              font-size: 14px;
              margin-bottom: 12px;
              overflow: hidden;
              text-overflow: ellipsis;
              white-space: nowrap;
              width: 250px;
            }

            .num {
              color: $color-secondary;
              font-size: 12px;
              margin-bottom: 16px;
            }

            ::v-deep .el-tag + .el-tag {
              margin-left: 8px;
            }
          }
        }

        &:hover {
          @include etm-bdc();

          .recipe-classify-wrapper-item {
            .recipe-detail {
              .name {
                @include etm-color();
              }
            }
          }

        }
      }
    }
  }

}

.popRecommendRecipeDetailContent {
  .popRecipeDetailNav {
    display: flex;
    justify-content: space-between;

    .type {
      color: $color-title;
      font-size: 16px;
      margin-bottom: 7px;
    }

    .name {
      color: $color-title;
      font-size: 14px;
      margin-bottom: 4px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      width: 250px;
    }

    .num {
      color: $color-secondary;
      font-size: 12px;
      margin-bottom: 4px;
    }

    ::v-deep .el-tag + .el-tag {
      margin-left: 8px;
    }
  }

  .popRecipeDetailWrapper {
    display: flex;

    i {
      cursor: pointer;
      font-size: 22px;
    }

    .left-icon {
      margin-top: 150px;
      text-align: left;
      width: 40px;
    }

    .recipeDetail {
      flex: 1;
    }

    .right-icon {
      margin-top: 150px;
      text-align: right;
      width: 40px;
    }

  }
}
</style>
