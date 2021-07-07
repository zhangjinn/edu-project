<template>
  <div :class="{'has-logo':showLogo}" class="sidebarBg">
    <div class="sidebarBgInner">
      <logo v-if="showLogo" :collapse="isCollapse" />

      <el-scrollbar wrap-class="scrollbar-wrapper" :class="[isCollapse?'scrollbar-collapse':'scrollbar-noCollapse']">
        <el-menu
          :default-active="activeMenu"
          :collapse="isCollapse"
          :unique-opened="false"
          :collapse-transition="false"
          mode="vertical"
        >
          <sidebar-item v-for="route in routes" :key="route.randomId" :is-collapse="isCollapse" :item="route" :base-path="route.uri" :title="route.path" />
        </el-menu>
      </el-scrollbar>
      <i v-if="!isCollapse" class="iconfont icon-beijingB" />
    </div>

  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Logo from './Logo'
import SidebarItem from './SidebarItem'
import { asyncRoutes } from '../../../../src/router/index'

export default {
  components: { SidebarItem, Logo },
  computed: {
    ...mapGetters([
      'sidebar'
    ]),
    routes() {
      // 侧边栏的内容是通过解决方案接口获取的
      return asyncRoutes.map(item => {
        item.randomId = Math.random() + ''
        return item
      })
    },
    activeMenu() {
      const route = this.$route
      const { meta, path } = route
      // if set path, the sidebar will highlight the path you set
      if (meta.activeMenu) {
        return meta.activeMenu
      }
      return path
    },
    showLogo() {
      return this.$store.state.settings.sidebarLogo
    },
    isCollapse() {
      return !this.sidebar.opened
    }
  }
}
</script>
<style lang="scss">
  @import "~@/styles/mixin.scss";

  .sidebarBg{
    position: relative;
    @include bgc_sidebarBg_color();
    box-shadow:4px 0 2px 0 rgba(196,201,215,0.1);

    .sidebarBgInner{
      width: 100%;
      height: 100%;
    }

    .el-scrollbar {

      .el-menu {
        @include bgc_transparent();

        .el-submenu__title {
          //@include c_sidebarText();
        }

        .el-menu-item {

          span:first-child {
            margin-left: 6px;
          }
        }
      }
    }

    .scrollbar-noCollapse{
      //@include etm-sidebar-background-bottom-img();
      //.el-scrollbar__view{
        //padding-top: 20px;
      //}
    }

  }

</style>
