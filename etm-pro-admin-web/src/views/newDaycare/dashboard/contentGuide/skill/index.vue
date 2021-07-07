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

import RightContent from '@/views/newDaycare/dashboard/contentGuide/component/rightContent'

/**
 * index create by Administrator
 * createTime 2020/9/8 15:28
 */
export default {
  name: 'Index',
  components: {
    RightContent
  },
  filters: {},
  mixins: [],
  props: {},
  data() {
    return {}
  },
  computed: {},
  watch: {},
  created() {
  },
  mounted() {
  },
  methods: {}
}
</script>
<style lang="scss" scoped>
  .index-wrap {
    .title {
      padding: 16px 0;
      font-size: 16px;
      @include c_title_color();
      font-weight: bold;
    }

    .subTitle {
      @include c_secondary_color();

      span {
        margin-right: 16px;
      }
    }

    .headerFileImg {
      padding: 16px 0;
      text-align: center;
    }

    .colBox {
      position: relative;
      padding: 0 20px;
      margin-bottom: 16px;
      height: 60px;
      line-height: 60px;
      font-size: 16px;
      @include c_white();
      border-radius: 4px;
      cursor: pointer;

      &:hover {
        opacity: 0.8;
      }

      .bgImg {
        position: absolute;
        left: 0;
        bottom: 0;
        width: 100%;

        img {
          display: block;
          width: 100%;
        }
      }

      .iconImg {
        position: absolute;
        right: 16px;
        bottom: 0;
        width: 48px;

        img {
          display: block;
          width: 100%;
        }
      }

      &.allowance {
        background: linear-gradient(to right, #81BFFF, #55A8FD);
      }

      &.skill {
        background: linear-gradient(to right, #FFCF74, #FFBC3C);
      }

      &.recipe {
        background: linear-gradient(to right, #77E99C, #4DD87A);
      }

      &.policy {
        background: linear-gradient(to right, #B0A4EF, #8F7EE5);
      }
    }
  }
</style>
