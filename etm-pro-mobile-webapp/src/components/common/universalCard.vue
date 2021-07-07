<template>
  <div class="universalCard textLeft" :class="type">
    <div class="list" :class="multiple ? 'shortLine' : ''">
      <div v-if="multiple" class="multiple left">
        <van-checkbox :name="index" icon-size="0.42667rem" @click.stop="select(index)" />
      </div>
      <div class="avatarBox left">
        <template v-if="icon && hasImg">
          <van-loading v-if="imgLoad" type="spinner" size="24px" />
          <img :src="icon" @load="imgLoad = false" @error="hasImg = false">
        </template>
        <div v-else class="noImg textCenter">{{ getIconTxt(name) }}</div>
      </div>
      <div v-if="searchValue" class="cardMsg left">
        <p class="van-ellipsis" :class="content ? '' : 'simple'">
          <span>{{ getText(name,1) }}</span>
          <span class="mark">{{ getText(name,2) }}</span>
          <span>{{ getText(name,3) }}</span>
        </p>
        <p class="van-ellipsis">
          <span>{{ getText(content,1) }}</span>
          <span class="mark">{{ getText(content,2) }}</span>
          <span>{{ getText(content,3) }}</span>
        </p>
      </div>
      <div v-else class="cardMsg left">
        <p class="van-ellipsis" :class="content ? '' : 'simple'">{{ name }}</p>
        <p class="van-ellipsis" :class="noCotent ? 'labelColor' : ''">{{ content }}</p>
      </div>
      <div class="van-ellipsis rightArea right">
        <slot />
      </div>
    </div>
  </div>
</template>

<script>

export default {
  name: 'UniversalCard',
  // type为类型
  // icon为卡片左侧图片，包含头像和图标
  // name为中间上部分内容
  // content为中间下部分内容
  // multiple为true时，表示卡片开启多选状态
  // index为下标或id，操作时有用
  // searchValue为搜索时的关键字
  // noCotent用来判断content是否置灰
  props: {
    type: {
      type: String,
      default() {
        return null
      }
    },
    icon: {
      type: String,
      default() {
        return null
      }
    },
    name: {
      type: String,
      default() {
        return null
      }
    },
    content: {
      type: String,
      default() {
        return null
      }
    },
    multiple: {
      type: Boolean,
      default() {
        return false
      }
    },
    index: {
      type: Number,
      default() {
        return null
      }
    },
    searchValue: {
      type: String,
      default() {
        return null
      }
    },
    noCotent: {
      type: Boolean,
      default() {
        return false
      }
    }
  },
  data() {
    return {
      hasImg: true,
      imgLoad: true
    }
  },
  methods: {
    getIconTxt(name) {
      if (this.type !== 'organization') {
        if (name.length > 2) {
          return name.substring(name.length - 2)
        } else {
          return name
        }
      }
    },
    getText(text, step) {
      if (text) {
        if (text.indexOf(this.searchValue) === -1) {
          if (step === 1) {
            return text
          } else {
            return ''
          }
        } else {
          const index = text.indexOf(this.searchValue)
          if (step === 1) {
            return text.substring(0, index)
          } else if (step === 2) {
            return this.searchValue
          } else if (step === 3) {
            return text.substring(index).replace(this.searchValue, '')
          }
        }
      } else {
        return ''
      }
    },
    select(index) {
      this.$emit('select', index)
    }
  }
}
</script>

<style lang="scss" scoped>

    .universalCard {
        padding: 0 12px;
        background-color: $white;

        &:not(:last-child) {
            .list {
                position: relative;

                &::after {
                    display: inline-block;
                    position: absolute;
                    bottom: 1px;
                    right: 0;
                    content: '';
                    width: calc(100% - 50px);
                    height: 1px;
                    background-color: $text-e;
                }

                &.shortLine {
                    &::after {
                        width: calc(100% - 75px);
                    }
                }
            }
        }

        .list {
            padding: 15px 0;
            overflow: hidden;

            .multiple {
                margin-right: 12px;
                padding: 9px 0;
            }

            .avatarBox {
                position: relative;
                @include round(38px);
                overflow: hidden;

                .van-loading {
                    position: absolute;
                    top: 7px;
                    left: 7px;
                }

                .noImg {
                    @include wh(100%, 100%);
                    line-height: 38px;
                    color: $white;
                    font-size: 13px;
                    background-color: $theme;
                }
            }

            .cardMsg {
                margin-left: 9px;
                max-width: 180px;

                p {
                    line-height: 19px;

                    &.simple {
                        line-height: 38px;
                    }
                }

                p:first-child {
                    font-size: 15px;
                }

                p:last-child {
                    font-size: 13px;
                    color: $text-6;
                }

                .mark {
                    color: $theme;
                }
            }

            .rightArea {
                max-width: 160px;
                font-size: 13px;
                color: $text-6;
                line-height: 38px;
            }
        }

        &.organization {
            .avatarBox {
                .noImg {
                    background-color: $text-d;
                }
            }

            .rightArea {
                padding-top: 9px;
                font-size: 12px;
            }

        }
    }
</style>
