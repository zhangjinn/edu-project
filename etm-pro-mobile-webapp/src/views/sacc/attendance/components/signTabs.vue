<template>
  <div class="classTabs textLeft van-hairline--bottom">
    <div v-if="clazzList.length" ref="slider" class="scrollBox">
      <span
        v-for="(item,index) in clazzList"
        :key="index"
        ref="item"
        class="clazzItem"
        :class="clazzIndex === index ? 'clazzActive' : ''"
        @click="changeClass(item,index)"
      >{{ item.clazzName }}</span>
    </div>
    <div v-else class="noClazz">
      班级为空
    </div>
  </div>
</template>

<script>
export default {
  name: 'SignTabs',
  props: {
    clazzList: {
      type: Array,
      default() {
        return []
      }
    }
  },
  data() {
    return {
      clazzIndex: 0
    }
  },
  methods: {
    changeClass(item, index) {
      this.clazzIndex = index
      const boxW = this.$refs.slider.offsetWidth
      const itemW = this.$refs.item[index].offsetWidth
      const left = this.$refs.item[index].offsetLeft
      this.$refs.slider.scrollLeft = left - 12 - boxW / 2 + itemW / 2
      this.$emit('change', item)
    }
  }
}
</script>

<style lang="scss" scoped>

    .classTabs {
        .scrollBox {
            padding: 8px 12px;
            white-space: nowrap;
            overflow-x: auto;

            .clazzItem {
                display: inline-block;
                font-size: 15px;
                line-height: 30px;
                color: $text-6;

                &.clazzActive {
                    position: relative;
                    font-size: 16px;
                    color: $text-2;

                    &::after {
                        display: inline-block;
                        position: absolute;
                        left: 0;
                        right: 0;
                        bottom: -8px;
                        z-index: 11;
                        content: '';
                        margin: 0 auto;
                        @include wh(30px, 2px);
                        background-color: $theme;
                    }
                }

                &:not(:first-child) {
                    margin-left: 30px;
                }
            }
        }

        .noClazz {
            padding: 8px 12px;
            font-size: 15px;
            line-height: 30px;
            color: $text-9;
        }
    }
</style>
