<template>
  <div class="EtmQuickPanel-wrap">
    <div
      class="menu"
      @click="$emit('click', itemData)"
    >
      <div class="iconBox">
        <span :class="'iconfont ' + itemData.config.icon" />
      </div>
      <div class="menuText">{{ itemData.name }}</div>
    </div>
  </div>

</template>

<script>
/**
 * EtmQuickPanel create by haijinsha
 * createTime 2020/9/25 15:14
 */
export default {
  name: 'EtmQuickPanel',
  components: {},
  filters: {},
  mixins: [],
  props: {
    data: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      itemData: {
        config: {},
        name: ''
      }
    }
  },
  computed: {},
  watch: {},
  created() {
  },
  mounted() {
    this.init()
  },
  methods: {
    init() {
      this.itemData = Object.assign({}, this.data)
      try {
        this.itemData.config = JSON.parse(this.itemData.config)
      } catch (e) {
        console.error('配置解析出错', e)
      }
    }
  }
}
</script>
<style lang="scss" scoped>
  .EtmQuickPanel-wrap {
    text-align: center;

    width: 132px;

    .menu {
      padding: 0 10px;
      cursor: pointer;

      &:not(:first-child) {
        margin-left: 20px;
      }

      &:hover {
        .iconBox {
          // border: 1px solid transparent;
          // @include bgc_main_12_color();
        }

        .menuText {
          @include c_main_color();
        }

      }

      .iconBox {
        margin: 0 auto;
        width: 40px;
        height: 40px;
        text-align: center;
        line-height: 38px;
        // border: 1px solid $divide-color;
        // border-radius: 50%;
        .iconfont {
          @include c_main_color();
          font-size: 22px;
        }
      }

      .menuText {
        margin-top: 10px;
        height: 14px;
        line-height: 14px;
      }
    }
  }
</style>
