<template>
  <ul class="ItemCard">
    <li>
      <div class="leftWrap">
        <div v-if="itemData.avatar" class="avatar">
          <img :src="itemData.avatar" :alt="itemData.name">
        </div>
        <div v-else class="circle">
          <span>
            {{ itemData.name ? itemData.name.slice(-2) : '未知' }}
          </span>
        </div>
      </div>
      <div class="rightWrap">
        <div class="content">
          <p>
            {{ itemData.name || '未知' }}
            <span :class="itemData.isLeave ? 'absent' : 'attend'">{{ itemData.isLeave ? '离园' : '在园' }}</span>
          </p>
          <span>{{ itemData.age || '未知' }}</span>
        </div>
        <div v-if="itemData.times !== undefined" class="times">
          <p><b>{{ itemData.times }}</b>次</p>
          <span>当天饮水</span>
        </div>
        <div v-if="itemData.btns" :class="['btns', 'clearfix', {disabled: itemData.isLeave}]">
          <span class="btn" @click.stop="toSet">
            记饮水
          </span>
          <span class="btn special" />
        </div>
      </div>
    </li>
    <li v-if="itemData.lastTime" class="timer">
      <div>距离上次饮水：{{ gapTime || '未知' }}</div>
    </li>
  </ul>
</template>

<script>
import transferDate from '../../../../js/date'

export default {
  name: 'ItemCard',
  props: {
    itemData: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  data() {
    return {
      gapTimer: null,
      gapTime: '00:00:00'
    }
  },
  created() {
    // 开启计时器
    this.setTimer()
  },
  beforeDestroy() {
    clearInterval(this.gapTimer)
    this.gapTimer = null
  },
  methods: {
    toSet() {
      if (this.itemData.isLeave) return
      const { name, age, avatar, customerId, isLeave } = this.itemData
      this.$router.push({
        path: 'drinkSet',
        query: {
          name,
          age,
          avatar,
          customerId,
          isLeave
        }
      })
    },
    setTimer() {
      if (this.gapTimer) return
      this.gapTimer = setInterval(() => {
        const now = Date.now()
        if (this.itemData.lastTime) {
          const time = transferDate().gap(now - this.itemData.lastTime)
          this.gapTime = `${time.hours}:${time.miniutes}:${time.seconds}`
        }
      }, 1000)
    }
  }
}
</script>

<style lang="scss" scoped>
    @import '../../../../assets/style/mixin';

    .ItemCard {
        background-color: $white;
        box-shadow: 0px 3px 5px 0px rgba(34, 34, 34, 0.06);

        li {
            height: 72px;
            display: flex;

            .leftWrap {
                width: 62.5px;

                .avatar {
                    @include wh(35px, 35px);
                    margin: 17px auto 0;

                    img {
                        @include round(35px);
                    }
                }

                .circle {
                    margin: 17px auto 0;
                    @include round(35px);
                    background-color: $theme;

                    span {
                        line-height: 35px;
                        font-size: 13px;
                        color: $white;
                    }
                }
            }

            .rightWrap {
                display: flex;
                width: calc(100% - 74.5px);

                .content {
                    text-align: left;
                    width: 90px;

                    p {
                        font-size: 15px;
                        color: $text-2;
                        margin-top: 13.5px;

                        span {
                            display: inline-block;
                            padding: 0 4px;
                            line-height: 18.5px;
                            border-radius: 2px;
                            text-align: center;
                            margin-right: 5px;
                            font-size: 11px;
                            &.sleep {
                              color: #438FFC;
                              background-color: rgba(66, 144, 252, .12);
                            }
                            &.attend {
                              color: $green;
                              background-color: $greenLight;
                            }
                            &.absent {
                              color: $red;
                              background-color: $redLight;
                            }
                        }
                    }

                    span {
                        font-size: 13px;
                        color: $text-9;
                    }
                }

                .times {
                    margin: 0 0px 0 27px;
                    font-size: 13px;

                    p {
                        margin-top: 13.5px;
                    }

                    b {
                        font-size: 17px;
                    }

                    span {
                        color: $text-9;
                    }
                }

                .btns {
                    padding: 20px 0 15px;
                    &.disabled {
                      opacity: .7;
                    }
                    .btn {
                        float: right;
                        width: 60px;
                        height: 32px;
                        line-height: 29px;
                        text-align: center;
                        border-radius: 3px;
                        border: 1px solid $theme;
                        font-size: 13px;
                        color: $white;
                        background-color: $theme;

                        &.special {
                            visibility: hidden;
                            margin-right: 10px;
                            color: $theme;
                            background-color: $white;
                        }
                    }
                }
            }
        }

        .timer {
            height: auto;
            padding: 0 12px 15px;

            & > div {
                width: 100%;
                height: 37px;
                line-height: 37px;
                font-size: 14px;
                color: $theme;
                background-color: rgba(251, 160, 71, .12);
                border-radius: 3px;
            }
        }
    }
</style>
