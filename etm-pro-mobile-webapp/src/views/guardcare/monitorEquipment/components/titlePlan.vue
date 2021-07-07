<template>
  <div class="title-wrap" :class="['align-' + textAlign]" :style="sty">
    <div class="tool-left">
      <van-icon name="arrow-left" style="font-size: 14px" @click="goBack" />
    </div>
    <div class="tool-content">
      <slot />
    </div>
    <div class="tool-right">
      <slot name="tools" />
    </div>
  </div>

</template>

<script>
/**
 * title create by Administrator
 * createTime 2020/10/23 15:34
 */
export default {
  name: 'Title',
  components: {},
  filters: {},
  mixins: [],
  props: {
    textAlign: {
      type: String,
      default: 'center'
    },
    sty: {
      type: Object,
      default() {
        return {
          color: '#222',
          background: '#fff'
        }
      }
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
    goBack() {
      this.$router.go(-1)
    }
  }
}
</script>
<style lang="scss" scoped>
.title-wrap {
  height: 34px !important;
  overflow: hidden;
  display: flex;
  font-size: 13px;
  align-items: center;
  justify-content: space-between;

  &.align-left {
    .tool-left {
      width: auto;
    }

    .tool-content {
      margin-left: 12px;
      text-align: left;
    }
  }

  .tool-left {
    padding-left: 12px;
    width: 26%;
    text-align: left;
  }

  .tool-right {
    padding-right: 12px;
    width: 26%;
    display: flex;
    align-items: center;
    justify-content: flex-end;

    & > * {
      display: block;
      margin-left: 12px;
    }
  }

  .tool-content {
    flex: 1;
  }
}
</style>
