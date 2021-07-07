<template>
  <div class="monthStatistics">
    <div class="monthCount">
      <div class="moreGrade">
        <van-swipe class="my-swipe" :loop="false" indicator-color="#10C2C4">
          <van-swipe-item v-for="ind in getCount(monthData)" :key="ind">
            <van-row :class="monthData.length > 4 ? 'rowBox' : 'less'">
              <template v-if="!onlyOne">
                <van-col
                  v-for="(item, i) in filter(monthData, ind)"
                  :key="i"
                  :span="12"
                >
                  <div class="circleBox" @click="toMonthDetail(item.courseId)">
                    <div class="innerBox">
                      <van-circle
                        v-model="item.probability"
                        :rate="Math.ceil(item.probability)"
                        :color="Math.ceil(item.probability)"
                        layer-color="#EEEEEE"
                        :stroke-width="75"
                        :size="'3.2rem'"
                      />
                      <div class="countBox">
                        <p
                          class="count"
                          :class="
                            item.probability < 50 ? 'errorColor' : 'mainColor'
                          "
                        >
                          {{ Math.ceil(item.probability) }}%
                        </p>
                        <p class="text">出勤率</p>
                      </div>
                    </div>
                    <p class="text">{{ item.courseName }}</p>
                  </div>
                </van-col>
              </template>
              <template v-else>
                <van-col
                  v-for="(item, i) in filter(monthData, ind)"
                  :key="i"
                  :span="24"
                >
                  <div class="circleBox" @click="toMonthDetail(item.courseId)">
                    <div class="innerBox">
                      <van-circle
                        v-model="item.probability"
                        :rate="item.probability"
                        :color="circleColor(item.probability)"
                        layer-color="#EEEEEE"
                        :stroke-width="90"
                        :size="'5.6rem'"
                      />
                      <div class="countBox onlyOne">
                        <p
                          class="count"
                          :class="
                            item.probability < 50 ? 'errorColor' : 'mainColor'
                          "
                        >
                          {{ item.probability }}%
                        </p>
                        <p class="text">出勤率</p>
                      </div>
                    </div>
                    <div class="clazzName">{{ item.courseName }}</div>
                  </div>
                </van-col>
              </template>
            </van-row>
          </van-swipe-item>
        </van-swipe>
      </div>
      <div v-if="!monthData.length" class="noData">
        <no-content message="暂无数据~" type="none" />
      </div>
    </div>
  </div>
</template>

<script>
import noContent from '../../../../components/common/noContent'

export default {
  name: 'MonthStatistics',
  components: {
    noContent
  },
  props: {
    monthData: {
      type: Array,
      default() {
        return []
      }
    },
    onlyOne: {
      type: Boolean,
      default() {
        return false
      }
    },
    month: {
      type: String,
      default() {
        return null
      }
    }
  },
  methods: {
    filter(data, i) {
      // 数据筛选：取第i个的4个数据循环渲染
      const list = data.slice((i - 1) * 4, i * 4).map(v => {
        v.probability = Math.ceil(v.probability)
        return v
      })
      return list
    },
    getCount(data) {
      // 4的倍数往上取整，4个数据为一组
      return Math.ceil(data.length / 4)
    },
    circleColor(rate) {
      if (rate === 0) {
        return '#EEEEEE'
      } else if (rate > 50) {
        return '#10C2C4'
      } else {
        return '#F53939'
      }
    },
    // 到月统计明细
    toMonthDetail(courseId) {
      console.log('mmmmm', courseId)
      this.$router.push({
        path: '/daycare_teach_statisticsMonth',
        query: {
          courseId: courseId,
          month: this.month
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.monthStatistics {
  .monthCount {
    padding: 12px;

    .moreGrade {
      &:not(:first-child) {
        padding-top: 20px;
        border-top: 0.5px solid $text-e;
      }
    }

    .title {
      position: relative;
      font-size: 15px;
      line-height: 1;
      text-indent: 8px;

      &::before {
        display: inline-block;
        position: absolute;
        top: 0;
        left: 0;
        content: "";
        width: 2px;
        height: 15px;
        background-color: $theme;
      }
    }

    .rowBox {
      padding: 12px 0 36px;
    }

    .less {
      padding: 12px 0 24px;
    }

    .circleBox {
      padding: 12px;

      .innerBox {
        position: relative;

        .countBox {
          position: absolute;
          top: 0;
          bottom: 0;
          right: 0;
          left: 0;
          margin: auto;
          width: 80px;
          height: 42px;

          &.onlyOne {
            width: 120px;
            height: 60px;

            .count {
              font-size: 36px;
              line-height: 36px;
            }

            .text {
              margin-top: 10px;
              font-size: 14px;
              line-height: 14px;
            }
          }

          .count {
            font-size: 24px;
            line-height: 24px;
          }

          .text {
            margin-top: 6px;
            font-size: 12px;
            line-height: 12px;
            color: $text-5;
          }
        }
      }

      .clazzName {
        margin-top: 20px;
        font-size: 17px;
      }
    }
  }
}
</style>
