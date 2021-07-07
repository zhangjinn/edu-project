<template>
  <div class="menuList">
    <el-collapse v-model="activeMenu">
      <el-collapse-item name="menu">
        <template slot="title">
          <i class="el-icon-caret-bottom" />
          <span>应用设置</span>
        </template>
        <el-button type="text" :class="{active: settingState === 'member'}" @click.stop="switchState('member')">
          会员字段
        </el-button>
        <el-button type="text" :class="{active: settingState === 'contact'}" @click.stop="switchState('contact')">
          联系人称呼
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
    settingState() {
      return this.$store.state.memberManageV2.settingState
    }
  },
  methods: {
    switchState(state) {
      this.$store.commit('memberManageV2/SET_SETTINGSTATE', state)
    }
  }
}
</script>

<style scoped lang="scss">
.menuList {
  padding-top: 3px;
  & >>> .el-collapse-item__wrap {
    border-bottom: none;
  }
  & >>> .el-collapse-item__header {
    border-bottom: none;
  }
  & >>> .el-collapse-item__arrow {
    display: none;
  }
  & >>> .el-collapse {
    margin: 0 auto;
    border: 0;
    .el-button {
      padding: 9px 0 9px 40px;
      span {
        @include c_text_color();
        &:hover {
          @include c_main_color();
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
          @include c_main_color();
        }
      }
    }
  }
}
</style>
