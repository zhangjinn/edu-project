<template>
  <div class="recordListWrap">
    <ul>
      <li v-for="(baby, index) in listData" :key="index">
        <div class="leftWrap">
          <div v-if="baby.avatar" class="avatar">
            <img :src="baby.avatar" :alt="baby.name">
          </div>
          <div v-else class="circle">
            <span>
              {{ baby.name ? baby.name.slice(-2) : '未知' }}
            </span>
          </div>
        </div>
        <div class="rightWrap">
          <div class="content" @click="toDetail(baby)">
            <p>
              {{ baby.name || '未知' }}
              <span :class="baby.isLeave ? 'absent' : 'attend'">{{ baby.isLeave ? '离园' : '在园' }}</span>
              <span v-if="baby.state === 'SLEEPING'" class="sleep">睡眠中</span>
            </p>
            <span>{{ baby.age || '未知' }}</span>
          </div>
          <div :class="['button', baby.state, {disabled: baby.isLeave}]" @click.stop="switchState(baby)">
            {{ baby.state === 'AWAKE' ? '开始睡眠' : '结束睡眠' }}
          </div>
        </div>
      </li>
    </ul>
    <van-action-sheet v-model="showMenu" title="结束睡眠" :close-on-click-overlay="false" get-container="#app">
      <div class="endMenu">
        <p>请选择{{ selectedBabyName }}宝宝的睡眠质量</p>
        <van-radio-group v-model="quality">
          <van-cell-group :border="false">
            <van-cell
              v-for="(option, index) in qualityOption"
              :key="index"
              :title="option.name"
              clickable
              @click.stop="quality = option.value"
            >
              <template #right-icon>
                <van-radio :name="option.value" />
              </template>
            </van-cell>
          </van-cell-group>
        </van-radio-group>
        <div class="confirmBtn" @click.stop="endSleep">
          <div>确定</div>
        </div>
      </div>
    </van-action-sheet>
  </div>
</template>

<script>
import { Dialog } from 'vant'
import transferDate from '../../../../js/date'
import { startSleep, endSleep, getEnumByName } from '../../../../service/sacc/sleepRecord'

export default {
  name: 'RecordList',
  props: {
    listData: {
      type: Array,
      default() {
        return []
      }
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      showMenu: false,
      selectedBabyName: '',
      quality: '',
      qualityOption: [],
      selectedBabyId: undefined
    }
  },
  created() {
    getEnumByName('SleepingQuality').then(res => {
      const { data } = res.data
      this.qualityOption = data
    })
  },
  methods: {
    getTimeStr() {
      const time = transferDate()
      return `${time.year}-${time.month}-${time.date} ${time.hours}:${time.miniutes}:${time.seconds}`
    },
    switchState(baby) {
      if (baby.isLeave) return
      this.selectedBabyName = baby.name
      const { customerId } = baby
      const startTime = this.getTimeStr()
      if (baby.state === 'AWAKE') {
        Dialog.confirm({
          title: `宝宝${this.selectedBabyName}是否开始睡眠？`
        })
          .then(() => {
            // on confirm
            startSleep({ customerId, startTime }).then(res => {
              this.$toast({
                message: '状态更新成功',
                icon: 'icon iconfont iconsuccess'
              })
              this.$emit('refresh')
            })
          })
          .catch(() => {
            // on cancel
          })
      }
      if (baby.state === 'SLEEPING') {
        this.showMenu = true
        this.selectedBabyId = customerId
      }
    },
    endSleep() {
      const endTime = this.getTimeStr()
      endSleep({ customerId: this.selectedBabyId, quality: this.quality, endTime }).then(res => {
        this.$toast({
          message: '状态更新成功',
          icon: 'icon iconfont iconsuccess'
        })
        this.showMenu = false
        this.$emit('refresh')
      })
    },
    toDetail(baby) {
      if (this.disabled) return
      const { customerId, state, name, age, avatar, isLeave } = baby
      this.$router.push({
        path: 'sleepDetail',
        query: {
          customerId,
          state,
          name,
          age,
          avatar,
          isLeave
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
    @import '../../../../assets/style/mixin';

    .recordListWrap {
        height: calc(100vh - 98px);
        overflow-y: auto;

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
                border-bottom: 1px solid $text-e;

                .content {
                    width: calc(100% - 70px);
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

                .button {
                    width: 70px;
                    height: 30px;
                    line-height: 29px;
                    margin-top: 20.5px;
                    border-radius: 3px;
                    border: 1px solid $theme;
                    font-size: 13px;
                    text-align: center;

                    &.SLEEPING {
                        color: $theme;
                        background-color: $white;
                    }

                    &.AWAKE {
                        color: $white;
                        background-color: $theme;
                    }

                    &.disabled {
                        opacity: .7;
                    }
                }
            }
        }
    }

    .van-popup {
        .van-action-sheet__header {
            text-align: left;
            text-indent: 16px;
        }

        .endMenu {
            position: relative;
            height: 432px;

            p {
                color: $text-2;
                font-size: 15px;
                text-align: left;
                text-indent: 16px;
                line-height: 32px;
            }

            .van-cell-group {
                .van-cell {
                    line-height: 28px;
                }

                & /deep/ .van-radio__icon--checked .van-icon-success {
                    background-color: $theme;
                    border-color: $theme;
                }
            }

            .confirmBtn {
                position: fixed;
                bottom: 0;
                left: 0;
                height: 64px;
                width: 100%;
                border-top: 1px solid $text-e;

                & > div {
                    height: 44px;
                    width: 351px;
                    margin: 10px auto;
                    background-color: $theme;
                    border-radius: 3px;
                    text-align: center;
                    color: $white;
                    line-height: 44px;
                }
            }
        }
    }
</style>
