<template>
  <div class="recordListWrap">
    <ul>
      <li v-for="(record, index) in listData" :key="index">
        <div class="wrap">
          <div class="leftWrap">
            <div v-if="record.avatar" class="avatar">
              <img :src="record.avatar" :alt="record.name">
            </div>
            <div v-else class="circle">
              <span>
                {{ record.name ? record.name.slice(-2) : '未知' }}
              </span>
            </div>
          </div>
          <div class="rightWrap" @click.stop="toDetail(record)">
            <div class="content info">
              <p>
                {{ record.name || '未知' }}
                <span :class="record.isLeave ? 'absent' : 'attend'">{{ record.isLeave ? '离园' : '在园' }}</span>
              </p>
              <span>{{ record.age || '未知' }}</span>
            </div>
            <div class="content last">
              <p>{{ record.last || '未知' }}</p>
              <span>上次记录</span>
            </div>
            <i class="border" />
            <div class="content time">
              <p :class="{warn: record.time === '超过一天'}">{{ record.time || '未知' }}</p>
              <span>间隔时长</span>
            </div>
          </div>
        </div>
        <div :class="['btns', 'clearfix', {disabled: record.isLeave}]">
          <span class="btn" @click.stop="toMilk(record)">
            记喂奶
          </span>
          <span class="btn special" @click.stop="toFood(record)">
            记餐食
          </span>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  props: {
    listData: {
      type: Array,
      default() {
        return []
      }
    }
  },
  methods: {
    toMilk(baby) {
      if (baby.isLeave) return
      const { name, age, avatar, customerId } = baby
      this.$router.push({
        path: 'milkRecord',
        query: {
          name,
          age,
          avatar,
          customerId
        }
      })
    },
    toFood(baby) {
      if (baby.isLeave) return
      const { name, age, avatar, customerId } = baby
      this.$router.push({
        path: 'foodRecord',
        query: {
          name,
          age,
          avatar,
          customerId
        }
      })
    },
    toDetail(baby) {
      const { name, age, avatar, customerId, isLeave } = baby
      this.$router.push({
        path: 'dietDetail',
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

    .clearfix:after {
        content: '';
        display: block;
        clear: both;
    }

    .recordListWrap {
        height: calc(100vh - 98px);
        overflow-y: auto;

        li {
            .wrap {
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

                        &.info {
                            width: 108px;
                        }

                        &.last {
                            width: 82px;

                            p {
                                margin-left: 6px;
                            }
                        }

                        &.time {
                            margin-left: 28px;

                            .warn {
                                color: $red;
                            }
                        }
                    }

                    .border {
                        width: 1px;
                        height: 20px;
                        background-color: $text-e;
                        margin-top: 22px;
                    }
                }
            }

            .btns {
                margin: 0 12px 0 62.5px;
                padding: 15px 0;
                border-bottom: 1px solid $text-e;
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
                        margin-right: 10px;
                        color: $theme;
                        background-color: $white;
                    }
                }
            }
        }
    }
</style>
