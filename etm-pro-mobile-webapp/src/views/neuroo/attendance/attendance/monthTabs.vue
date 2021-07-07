<template>
  <div class="monthStatistics">
    <div class="monthCount">
      <div v-for="(item, index) in monthData" :key="index" class="moreSchool">
        <div class="title textLeft">{{ item.schoolName }}</div>
        <van-swipe class="my-swipe" :loop="false" indicator-color="#10C2C4">
          <van-swipe-item v-for="ind in getCount(item.clazzStatistics)" :key="ind">
            <van-row :class="item.clazzStatistics.length > 4 ? 'rowBox' : 'less'">
              <template v-if="!onlyOne">
                <van-col v-for="(data, i) in filter(item.clazzStatistics, ind)" :key="i" :span="12">
                  <div class="circleBox" @click="toMonthDetail(item.schoolId, data.clazzId)">
                    <div class="innerBox">
                      <van-circle
                        v-model="data.attendanceRate"
                        :rate="data.attendanceRate"
                        :color="circleColor(data.attendanceRate)"
                        layer-color="#EEEEEE"
                        :stroke-width="75"
                        :size="'3.2rem'"
                      />
                      <div class="countBox">
                        <p
                          class="count"
                          :class="data.attendanceRate < 50 ? 'errorColor' : 'mainColor'"
                        >
                          {{ Math.ceil(data.attendanceRate) }}%
                        </p>
                        <p class="text">出勤率</p>
                      </div>
                    </div>
                    <p class="text">{{ data.clazzName }}</p>
                  </div>
                </van-col>
              </template>
              <template v-else>
                <van-col v-for="(data, i) in filter(item.clazzStatistics, ind)" :key="i" :span="24">
                  <div class="circleBox" @click="toMonthDetail(item.schoolId, data.clazzId)">
                    <div class="innerBox">
                      <van-circle
                        v-model="data.attendanceRate"
                        :rate="data.attendanceRate"
                        :color="circleColor(data.attendanceRate)"
                        layer-color="#EEEEEE"
                        :stroke-width="90"
                        :size="'5.6rem'"
                      />
                      <div class="countBox onlyOne">
                        <p
                          class="count"
                          :class="data.attendanceRate < 50 ? 'errorColor' : 'mainColor'"
                        >
                          {{ data.attendanceRate }}%
                        </p>
                        <p class="text">出勤率</p>
                      </div>
                    </div>
                    <div class="clazzName">{{ data.clazzName }}</div>
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
      const list = data.slice((i - 1) * 4, i * 4)
      return list
    },
    getCount(data) {
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
    toMonthDetail(schoolId, clazzId) {
      this.$router.push({
        path: '/statisticsMonth_neuroo',
        query: {
          school: schoolId,
          clazz: clazzId,
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

            .moreSchool {
                &:not(:first-child) {
                    padding-top: 20px;
                    border-top: .5px solid $text-e;
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
                    content: '';
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
