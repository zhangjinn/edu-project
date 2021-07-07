<template>
  <div class="tabs" :class="type">
    <div
      v-for="(item, index) in tabList"
      :key="index"
      :class="tabActive === index ? 'tab active' : 'tab'"
      @click="tabClick(index)"
    >{{ item }}
    </div>
  </div>
</template>

<script>
export default {
  name: 'Tabs',
  props: {
    tabList: {
      type: Array,
      default() {
        return []
      }
    },
    tabActive: {
      type: Number,
      default() {
        return 0
      }
    },
    type: {
      type: String,
      default() {
        return null
      }
    }
  },
  methods: {
    tabClick(index) {
      this.$emit('change', index)
    }
  }
}
</script>

<style lang="scss" scoped>

    .tabs {

        &.big {
            display: flex;

            .tab {
                flex: 1;
                text-align: center;
                font-size: 15px;
            }
        }

        .tab {
            display: inline-block;
            height: 50px;
            line-height: 50px;
            color: $text-6;
            font-size: 14px;
            text-align: left;

            &:not(:last-child) {
                margin-right: 24px;
            }

            &.active {
                position: relative;
                color: $theme;

                &::after {
                    display: inline-block;
                    position: absolute;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    content: '';
                    margin: 0 auto;
                    width: 30px;
                    height: 2px;
                    background-color: $theme;
                }
            }
        }
    }
</style>
