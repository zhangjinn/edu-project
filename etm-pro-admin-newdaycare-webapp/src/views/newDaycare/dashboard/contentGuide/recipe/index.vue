<template>
  <div class="index-wrap">
    <etm-main-body>
      <etm-layout-split :left-styles="{minWidth: 'calc(100% - 256px)', maxWidth: 'calc(100% - 256px)'}">
        <div slot="left" />
        <div slot="right">
          <right-content />
        </div>
      </etm-layout-split>
    </etm-main-body>
  </div>
</template>

<script>
import rightContent from '@/views/newDaycare/dashboard/contentGuide/component/rightContent'

/**
 * index create by Administrator
 * createTime 2020/9/8 15:28
 */
export default {
  name: 'Index',
  components: {
    rightContent
  },
  filters: {},
  mixins: [],
  props: {},
  data () {
    return {}
  },
  computed: {},
  watch: {},
  created () {
  },
  mounted () {
  },
  methods: {}
}
</script>
<style lang="scss" scoped>
  .index-wrap {
    .colBox {
      @include c_white();
      border-radius: 4px;
      cursor: pointer;
      font-size: 16px;
      height: 60px;
      line-height: 60px;
      margin-bottom: 16px;
      padding: 0 20px;
      position: relative;

      &:hover {
        opacity: 0.8;
      }

      .bgImg {
        bottom: 0;
        left: 0;
        position: absolute;
        width: 100%;

        img {
          display: block;
          width: 100%;
        }
      }

      .iconImg {
        bottom: 0;
        position: absolute;
        right: 16px;
        width: 48px;

        img {
          display: block;
          width: 100%;
        }
      }

      &.allowance {
        background: linear-gradient(to right, #81bfff, #55a8fd);
      }

      &.skill {
        background: linear-gradient(to right, #ffcf74, #ffbc3c);
      }

      &.recipe {
        background: linear-gradient(to right, #77e99c, #4dd87a);
      }

      &.policy {
        background: linear-gradient(to right, #b0a4ef, #8f7ee5);
      }
    }
  }
</style>
