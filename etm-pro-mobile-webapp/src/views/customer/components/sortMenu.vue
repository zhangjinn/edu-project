<template>
  <div class="sortMenu">
    <div class="overlay" @click="closeSort">
      <div class="box" />
    </div>
    <div class="list">
      <div
        v-for="(item,index) in list"
        :key="index"
        class="listItem textLeft"
        @click="confirm(item,index)"
      >
        <div class="listName van-hairline--bottom" :class="activeIndex === index ? 'active' : ''">
          {{ item.name }}
          <span v-if="activeIndex === index" class="iconfont icondone right" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>

export default {
  name: 'SortMenu',
  props: {
    list: {
      type: Array,
      default() {
        return []
      }
    },
    sortIndex: {
      type: Number,
      default() {
        return null
      }
    }
  },
  data() {
    return {
      activeIndex: -1
    }
  },
  created() {
    this.activeIndex = this.sortIndex
  },
  methods: {
    confirm(item, index) {
      this.activeIndex = index
      this.$emit('getSortEmpList', item)
      this.closeSort()
    },
    closeSort() {
      this.$emit('closeSort', this.activeIndex)
    }
  }
}
</script>

<style lang="scss" scoped>

    .sortMenu {
        position: fixed;
        left: 0;
        top: 0;
        bottom: 0;
        right: 0;
        z-index: 110;

        .overlay {
            @include wh(100%, 100%);

            .box {
                position: absolute;
                top: 86px;
                left: 0;
                bottom: 0;
                right: 0;
                background-color: rgba(0, 0, 0, 0.7);
            }
        }

        .list {
            position: absolute;
            top: 86px;
            left: 0;
            width: 100%;
            background-color: $white;

            .listItem {
                padding: 0 12px;
                overflow: hidden;

                .listName {
                    padding: 15px 0;
                    font-size: 14px;
                    color: $text-6;

                    &.active {
                        color: $theme;
                    }

                    .iconfont {
                        font-size: 12px;
                        line-height: 19px;
                        color: $theme;
                    }
                }
            }
        }
    }

</style>
