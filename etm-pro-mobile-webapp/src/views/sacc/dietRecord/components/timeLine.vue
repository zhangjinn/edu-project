<template>
  <div class="timeLineWrap">
    <h5>膳食记录</h5>
    <div class="recordsWrapper">
      <div
        v-for="(time, index) in timeData"
        v-show="timeData.length"
        :key="index"
        class="record"
      >
        <h6>{{ time.date || '未知时间' }}</h6>
        <ul>
          <li v-for="(record, rindex) in time.recordVOList" :key="rindex">
            <div class="time top">
              <i class="dot" />
              <span>{{ handleTime(record.eatTime).time }}</span>
              <span :class="record.type">{{ record.type === 'MEAL' ? '记餐食' : '记喂奶' }}</span>
              <span class="date">{{ handleTime(record.eatTime).date }}</span>
            </div>
            <div class="wrap">
              <div class="content">
                <template v-if="record.type === 'MEAL'">
                  <p v-if="record.eatTimeQuantum">餐段：{{ record.eatTimeQuantum || '未知' }}</p>
                  <p v-if="record.eatRecipe.length">食谱：{{ record.eatRecipe.join(" ") }}</p>
                  <p v-if="record.eatQuantity">食量：{{ quantityObj[record.eatQuantity] }}</p>
                </template>
                <template v-if="record.type === 'MILK'">
                  <p v-if="record.milkType">喂奶类型：{{ milkObj[record.milkType] }}</p>
                  <p v-if="record.milkQuantity">喂养量：{{ record.milkQuantity }}ml(毫升)</p>
                </template>
                <p v-if="record.remarks">备注：{{ record.remarks }}</p>
                <div v-if="record.addressArray.length" class="pictures">
                  <van-image
                    v-for="(picture, pindex) in record.addressArray"
                    :key="pindex"
                    :src="picture.url"
                    @click.stop="preview(picture.url)"
                  >
                    <template v-slot:loading>
                      <van-loading type="spinner" size="20" />
                    </template>
                  </van-image>
                </div>
              </div>
            </div>
          </li>
        </ul>
      </div>
      <noContent v-show="!timeData.length" type="list" message="没有数据噢" />
    </div>
  </div>
</template>

<script>
import noContent from '../../../../components/common/noContent'
import { ImagePreview } from 'vant'
import transferDate from '../../../../js/date'

export default {
  name: 'TimeLine',
  components: {
    noContent
  },
  props: {
    timeData: {
      type: Array,
      default() {
        return []
      }
    }
  },
  data() {
    return {
      quantityObj: {
        'NO_EAT': '没吃',
        'SMALL': '较少',
        'NORMAL': '正常',
        'MORE': '较多'
      },
      milkObj: {
        'BREASTMILK': '母乳',
        'FORMULAMILK': '配方奶'
      }
    }
  },
  methods: {
    preview(url) {
      ImagePreview([url])
    },
    handleTime(timestamp) {
      const time = transferDate(timestamp)
      return {
        date: `${time.year}-${time.month}-${time.date}`,
        time: `${time.hours}:${time.miniutes}`
      }
    }
  }
}
</script>

<style lang="scss" scoped>

    .timeLineWrap {
        text-align: left;
        padding: 0 12px;

        .recordsWrapper {
            height: calc(100vh - 184px);
            overflow-y: auto;
        }

        h5 {
            font-weight: normal;
            font-size: 17px;
            margin: 20px 0;
        }

        .record {
            h6 {
                font-size: 16px;
                font-weight: normal;
                line-height: 1;
                margin: 10px 0;
            }

            ul {
                li {
                    position: relative;

                    &:not(:first-child) {
                        &::before {
                            content: '';
                            display: block;
                            position: absolute;
                            top: 0;
                            left: 2px;
                            height: 20px;
                            width: 1px;
                            background-color: $theme;
                        }
                    }

                    .time {
                        position: relative;

                        .dot {
                            display: inline-block;
                            position: relative;
                            top: -1px;
                            vertical-align: middle;
                            width: 6px;
                            height: 6px;
                            margin-right: 13.5px;
                            border-radius: 50%;
                            background-color: $theme;
                        }

                        span {
                            font-size: 15px;
                        }

                        .MEAL, .MILK {
                            display: inline-block;
                            position: relative;
                            top: -1px;
                            width: 40px;
                            height: 19px;
                            line-height: 19px;
                            font-size: 11px;
                            background-color: rgba(66, 144, 252, .12);
                            color: #438FFC;
                            text-align: center;
                            margin-left: 6px;
                        }

                        .MILK {
                            color: $theme;
                            background-color: rgba(251, 160, 71, .12);
                        }

                        .date {
                            float: right;
                            color: $text-5;
                            font-size: 13px;
                        }

                        &.top {
                            top: 9px;
                        }
                    }

                    .wrap {
                        padding: 22px 0 0;
                        margin-left: 2px;
                        border-left: 1px solid $theme;

                        .content {
                            border-radius: 3px;
                            background-color: $bg-9;
                            margin-left: 17px;
                            padding: 8px 0 8px 14.5px;

                            p {
                                font-size: 14px;
                                line-height: 29px;

                                i {
                                    font-size: 14px;
                                    margin-right: 12px;

                                    &.iconshuimian1 {
                                        font-size: 13px;
                                    }
                                }

                                span {
                                    color: $theme;

                                    &.warn {
                                        color: $red;
                                    }
                                }
                            }

                            .pictures {
                                .van-image {
                                    width: 70px;
                                    height: 70px;
                                    border-radius: 2px;
                                    margin-right: 7px;
                                }
                            }
                        }
                    }
                }
            }
        }
    }
</style>
