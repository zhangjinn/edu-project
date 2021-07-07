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
            </p>
            <span>{{ baby.age || '未知' }}</span>
          </div>
          <div class="record" @click="toDetail(baby)">
            <p>{{ baby.emotion || '未知' }}</p>
            <span>上次记录</span>
          </div>
          <div :class="['button', 'start', {disabled: baby.isLeave}]" @click.stop="toSet(baby)">
            更换情绪
          </div>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
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
      quality: ''
    }
  },
  methods: {
    toSet(baby) {
      if (baby.isLeave) return
      const { name, age, avatar, customerId, isLeave } = baby
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
    },
    toDetail(baby) {
      const { name, age, avatar, customerId, isLeave } = baby
      this.$router.push({
        path: 'emotionDetail',
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

                .content, .record {
                    width: 96px;
                    text-align: left;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                    overflow: hidden;

                    p {
                        text-overflow: ellipsis;
                        white-space: nowrap;
                        overflow: hidden;
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

                .button {
                    width: 70px;
                    height: 30px;
                    line-height: 29px;
                    margin: 20.5px 0 0 38px;
                    border-radius: 3px;
                    border: 1px solid $theme;
                    font-size: 13px;
                    text-align: center;
                    &.disabled {
                      opacity: .7;
                    }
                    &.start {
                        color: $white;
                        background-color: $theme;
                    }
                }
            }
        }
    }
</style>
