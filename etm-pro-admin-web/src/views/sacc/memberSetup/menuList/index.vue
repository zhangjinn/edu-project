<template>
  <div class="menuList">
    <el-collapse v-model="activeMenu">
      <el-collapse-item name="menu">
        <template slot="title">
          <i class="el-icon-caret-bottom" />
          <span>应用设置</span>
        </template>
        <el-button
          v-for="item in menu"
          :key="item.tag"
          type="text"
          :class="{active: activeBtn === item.tag}"
          @click="handleSwitch(item.tag)"
        >
          {{ item.title }}
        </el-button>
      </el-collapse-item>
    </el-collapse>
  </div>
</template>

<script>
export default {
  name: 'MenuList',
  data() {
    return {
      activeMenu: ['menu']
    }
  },
  computed: {
    activeBtn() {
      return this.$store.state.memberSetup.setting
    },
    menu() {
      return this.$store.state.memberSetup.menu
    }
  },
  watch: {
    activeBtn(val) {
      this.$router.push(`${this.$route.path}?setting=${val}`)
    },
    $route: {
      handler(route) {
        this.$store.commit('memberSetup/SET_SETTING', route.query.setting || 'custom')
      },
      immediate: true
    }
  },
  methods: {
    handleSwitch(setting) {
      this.$store.commit('memberSetup/SET_SETTING', setting)
    }
  }
}
</script>

<style lang="scss">
  @import "~@/styles/mixin.scss";
  @import "~@/styles/variables.scss";
  .menuList {
    @include wh(100%, 100%);
    @include border-radius(4px);
    @include bgc_white();
    padding-top: 3px;
    .el-collapse {
      margin: 0 auto;
      border: 0;
      .el-button {
        padding: 9px 0 9px 40px;
        span {
          @include c_colorTextRegular();
          &:hover {
            @include c_themeColor();
          }
        }
      }
      .el-button+.el-button {
        margin-left: 0;
      }
      .el-collapse-item__header, .el-collapse-item__wrap {
        border-bottom: 0;
      }
      .el-icon-caret-bottom {
        color: $color-text-secondary!important;
        margin: 0 8px 0 18px;
      }
      .el-collapse-item__header {
        span {
          font-weight: bold;
          font-size: 14px;
        }
      }
      .el-collapse-item__arrow {
        display: none;
      }
      .el-collapse-item__content {
        display: flex;
        flex-direction: column;
        align-items: center;
      }
      .el-button {
        display: block;
        width: 100%;
        line-height: 0.5;
        padding-left: 40px;
        text-align: left;
        &.active {
          background-color: transparent;
          border-radius: 0;
          span {
            @include c_themeColorOne();
          }
        }
      }
    }

  }
</style>
