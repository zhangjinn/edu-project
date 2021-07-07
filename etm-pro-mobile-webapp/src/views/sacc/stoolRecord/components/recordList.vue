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
              <p class="warn">{{ record.time || '未知' }}</p>
              <span>间隔时长</span>
            </div>
          </div>
        </div>
        <div :class="['btns', 'clearfix', {disabled: record.isLeave}]">
          <div class="detail">
            记录详情：<span :class="record.detail.state === '不正常态' ? 'warn' : ''">{{ record.detail.state || '未知' }}</span>/<span>{{ record.detail.color || '未知' }}</span>/<span>{{ record.detail.quantity || '未知' }}</span>
          </div>
          <span class="btn" @click.stop="toSet(record)">
            记便便
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
    toSet(baby) {
      if (baby.isLeave) return
      const { name, age, avatar, customerId, isLeave } = baby
      this.$router.push({
        path: 'stoolSet',
        query: {
          name,
          age,
          avatar,
          customerId,
          isLeave
        }
      })
    },
    toDetail(baby) {
      const { name, age, avatar, customerId, isLeave } = baby
      this.$router.push({
        path: 'stoolDetail',
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
                            width: 122px;
                        }

                        &.last {
                            width: 82px;

                            p {
                                margin-left: 6px;
                            }
                        }

                        &.time {
                            margin-left: 30px;

                            p {
                                font-size: 13px;

                                &.warn {
                                    color: $red;
                                }
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
                .detail {
                    float: left;
                    text-align: left;
                    height: 34px;
                    width: calc(100vw - 150px);
                    text-overflow: ellipsis;
                    overflow: hidden;
                    white-space: nowrap;
                    line-height: 34px;
                    font-size: 14px;
                    text-indent: 10px;
                    background-color: $bg-9;

                    .warn {
                        color: $red;
                    }
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
                }
            }
        }
    }
</style>
