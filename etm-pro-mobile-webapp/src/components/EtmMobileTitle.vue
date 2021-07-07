<template>
  <div class="EtmMobileTitle-wrap">
    <div class="title">
      <div class="titleLeft">
        <span v-show="back" class="iconfont iconleft" @click="reback" />
        <slot name="left" />
      </div>
      <div class="titleText">
        <slot />
      </div>
      <div class="titleRight">
        <slot name="right" />
      </div>
    </div>
  </div>

</template>

<script>
/**
 * EtmMobileTitle create by Administrator
 * createTime 2020/11/20 11:09
 */
export default {
  name: 'EtmMobileTitle',
  components: {},
  filters: {},
  mixins: [],
  props: {
    back: {
      type: Boolean,
      default: true
    },
    type: {
      type: String,
      default: 'primary'
    }
  },
  data() {
    return {}
  },
  computed: {},
  watch: {},
  created() {
  },
  mounted() {
  },
  methods: {
    reback() {
      this.$emit('reback')
    }
  }
}
</script>
<style lang="scss" scoped>
.EtmMobileTitle-wrap {
  .title {
    position: relative;
    background-color: $theme;

    &.default {
      background-color: $white;

      .iconleft {
        color: $text-5;
      }

      .titleText {
        color: $text-2;
      }

      .titleRight {
        color: $text-5;
      }
    }

    .titleLeft {
      display: flex;
      position: absolute;
      top: 0;
      left: 12px;
      height: 34px;
      line-height: 34px;

      .iconleft {
        font-size: 14px;
        color: $white;
      }
    }

    .titleText {
      height: 34px;
      line-height: 34px;
      font-size: 14px;
      color: $white;
    }

    .titleRight {
      position: absolute;
      top: 0;
      right: 12px;
      height: 34px;
      line-height: 34px;
      font-size: 14px;
      color: $white;
    }
  }
}
</style>
