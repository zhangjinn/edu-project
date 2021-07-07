<template>
  <div class="timeLine">
    <h5>睡眠记录</h5>
    <ul v-if="timeData.length" :class="{ awake: state === 'AWAKE' }">
      <li v-for="(record, index) in timeData" :key="index">
        <div class="time top">
          <i class="dot" />
          <span>{{ record.end || '未知时间' }} 睡眠结束</span>
        </div>
        <div class="wrap">
          <div class="content">
            <p>
              <i class="iconfont icontime-circle" />
              睡眠时长：{{ record.time || '未知' }}
            </p>
            <p>
              <i class="iconfont iconshuimian1" />
              睡眠质量：<span :class="{warn: record.quality === '不安稳'}">{{ record.quality || '未知' }}</span>
            </p>
          </div>
        </div>
        <div class="time bottom">
          <i class="dot" />
          <span>{{ record.start || '未知时间' }} 睡眠开始</span>
        </div>
      </li>
    </ul>
    <noContent v-else type="list" message="没有数据噢" />
  </div>
</template>

<script>
import noContent from '../../../../components/common/noContent'

export default {
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
      state: ''
    }
  },
  watch: {
    $route: {
      handler() {
        this.state = this.$route.query.state
      },
      immediate: true
    }
  }
}
</script>

<style lang="scss" scoped>

    .timeLine {
        background-color: $white;
        padding: 0 12px;

        h5 {
            font-size: 17px;
            // margin-top: 19px;
            margin: 15px 0;
            color: $text-2;
            font-weight: normal;
            text-align: left;
        }

        ul {
            text-align: left;
            height: calc(100vh - 252px);
            overflow-y: auto;

            &.awake {
                height: calc(100vh - 225px);
            }

            li {
                border-bottom: 1px solid $text-e;

                .time {
                    position: relative;

                    .dot {
                        display: inline-block;
                        vertical-align: middle;
                        width: 6px;
                        height: 6px;
                        margin-right: 13.5px;
                        border-radius: 50%;
                        background-color: $theme;
                    }

                    span {
                        vertical-align: middle;
                        font-size: 15px;
                    }

                    &.top {
                        top: 9px;
                    }

                    &.bottom {
                        top: -11px;
                    }
                }

                .wrap {
                    padding: 22px 0 19px;
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
                    }
                }
            }
        }
    }
</style>
