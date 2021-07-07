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
        <div class="times">
          <p><b>?</b>次</p>
          <span>当天饮水</span>
        </div>
        <div v-if="itemData.btns" :class="['btns', 'clearfix', {disabled: itemData.isLeave}]">
          <span class="btn" @click.stop="toSet">
            记情绪
          </span>
          <span class="btn special" />
        </div>
      </div>
    </li>
    <li v-if="itemData.timer" class="timer">
      <div>距离上次饮水：{{ itemData.timer || '未知' }}</div>
    </li>
  </ul>
</template>

<script>
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
  methods: {
    toSet() {
      if (this.itemData.isLeave) return
      const { name, age, avatar, customerId, isLeave } = this.itemData
      this.$router.push({
        path: 'emotionSet',
        query: {
          name,
          age,
          avatar,
          customerId,
          isLeave
        }
      })
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
                    width: 35px;
                    height: 35px;
                    margin: 17px auto 0;

                    img {
                        width: 100%;
                        height: 100%;
                        border-radius: 50%;
                    }
                }

                .circle {
                    width: 35px;
                    height: 35px;
                    border-radius: 50%;
                    background-color: $theme;
                    margin: 17px auto 0;

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
                    visibility: hidden;
                    margin: 0 27px 0 0px;
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
