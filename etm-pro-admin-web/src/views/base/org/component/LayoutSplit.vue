<template>
  <div class="LayoutSplit-wrap">
    <div class="left" :style="{maxWidth: width}">
      <slot name="left" />
    </div>

    <div class="right">
      <slot name="right" />
    </div>
  </div>

</template>

<script>
/**
 * LayoutSplit create by haijinsha
 * createTime 2020/7/6 10:53
 */
export default {
  name: 'LayoutSplit',
  components: {},
  filters: {},
  mixins: [],
  props: {
    width: {
      type: String,
      default: '490px'
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
  methods: {}
}
</script>
<style lang="scss" scoped>
  .LayoutSplit-wrap {
    width: 100%;
    height: 100%;
    display: flex;

    .left {
      min-width: 440px;
      background-color: #fff;
      overflow: auto;
    }

    .right {
      flex: 1;
      margin-left: 16px;
      background-color: #fff;
    }
  }
</style>
