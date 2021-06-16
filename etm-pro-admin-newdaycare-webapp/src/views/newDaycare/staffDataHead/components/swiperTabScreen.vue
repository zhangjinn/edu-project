<template>
  <div
    class="swiperTabScreen-wrap"
    :class="{'clearPadding':tabList.length < 6}"
  >
    <div
      v-if="tabList.length >= 8"
      class="leftIcon"
      @click="handleOffset(true)"
    >
      <i
        class="iconfont iconleft-circle"
        :class="{ disabled:leftDisabled}"
      />
    </div>
    <div
      ref="tabScreen"
      class="tabScreen"
      :class="{ 'expandWidth':tabList.length >= 6 ,'clearPadding':tabList.length < 6}"
      @scroll="handleScroll"
    >
      <span
        v-for="(item,index) in tabList"
        :key="index"
        class="tabScreenItem"
        :class="{ 'isActive': checkActive(item) }"
        @click="tabClick(item)"
      >
        {{ item.name }}
      </span>
    </div>
    <div
      v-if="tabList.length >= 8"
      class="rightIcon"

      @click="handleOffset(false)"
    >
      <i
        :class="{ disabled:rightDisabled}"
        class="iconfont iconright-circle"
      />
    </div>
  </div>
</template>

<script>
/**
 * swiperTabScreen create by Administrator
 * createTime 2021/3/15 19:38
 */
export default {
  name: 'SwiperTabScreen',
  components: {},
  filters: {},
  mixins: [],
  model: {
    prop: 'selectValue',
    event: 'change'
  },
  props: {
    selectValue: {
      type: null,
      required: true
    },
    tabList: {
      type: Array,
      defalut: () => {
        return []
      }
    },
    offset: {
      type: Number,
      default: () => {
        return 40
      }
    }
  },
  data () {
    return {
      scroll: null,
      leftDisabled: true,
      rightDisabled: false
    }
  },
  computed: {},
  watch: {},
  created () {
  },
  mounted () {
  },
  methods: {
    checkActive (item) {
      return this.selectValue === item.value
    },
    tabClick (item) {
      // input是v-model绑定 change是调用事件
      this.$emit('input', item.value)
      this.$emit('change', item.value)
    },
    handleOffset (isLeft) {
      if (isLeft) {
        this.$refs.tabScreen.scrollLeft = this.$refs.tabScreen.scrollLeft - this.offset
        return
      }
      this.$refs.tabScreen.scrollLeft = this.$refs.tabScreen.scrollLeft + this.offset
    },
    handleScroll (e) {
      const { offsetWidth, scrollWidth, scrollLeft } = this.$refs.tabScreen
      if (scrollLeft === 0) {
        this.leftDisabled = true
        this.rightDisabled = false
      } else if (scrollLeft === (scrollWidth - offsetWidth)) {
        this.leftDisabled = false
        this.rightDisabled = true
      } else {
        this.leftDisabled = false
        this.rightDisabled = false
      }
    }
  }
}
</script>
<style lang="scss" scoped>
  .disabled {
    cursor: not-allowed;
    opacity: 0.5;
  }

  .clearPadding {
    margin-left: 0 !important;
    padding-left: 0 !important;
  }

  .swiperTabScreen-wrap {
    align-items: center;
    display: flex;
    margin-bottom: 12px;
    margin-left: 18px;
    max-width: 560px;
    position: relative;
    .tabScreen::-webkit-scrollbar {display: none;}

    .leftIcon {
      background: rgba(255, 255, 255, 0.8);
      left: -32px;
      position: absolute;
      text-align: center;
      width: 50px;
      z-index: 999;

      &:hover {
        @include etm-color;
      }
    }

    .rightIcon {
      background: rgba(255, 255, 255, 0.8);
      position: absolute;
      right: -61px;
      text-align: center;
      width: 61px;

      &:hover {
        @include etm-color;
      }
    }

    .tabScreen {
      display: flex;
      left: 5px;
      overflow-x: scroll;
      overflow-y: hidden;
      padding-left: 13px;
      position: relative;
      white-space: nowrap;

      .tabScreenItem:first-child {
        margin-left: 0;
      }

      .tabScreenItem {
        border-radius: 6px;
        height: 29px;
        line-height: 20px;
        margin-left: 6px;
        padding: 5px 8px;

        &:hover {
          cursor: pointer;
        }
      }

      .isActive {
        @include etm-color;
        @include etm-bgc-rgba(0.1);
      }
    }

    .expandWidth {
      width: 560px;
    }
  }

</style>
