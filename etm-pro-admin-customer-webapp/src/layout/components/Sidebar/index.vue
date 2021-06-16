<template>
  <div
    :class="{'has-logo':showLogo}"
    class="sidebarBg"
  >
    <logo
      v-if="showLogo"
      :collapse="isCollapse"
    />

    <el-scrollbar
      wrap-class="scrollbar-wrapper"
      :class="[isCollapse?'scrollbar-collapse':'scrollbar-noCollapse']"
    >
      <el-menu
        :default-active="activeMenu"
        :collapse="isCollapse"
        :unique-opened="false"
        :collapse-transition="false"
        mode="vertical"
      >
        <sidebar-item
          v-for="route in routes"
          :key="route.randomId"
          :is-collapse="isCollapse"
          :item="route"
          :base-path="route.uri"
          :title="route.path"
        />
      </el-menu>
    </el-scrollbar>
    <i
      v-if="!isCollapse"
      class="iconfont icon-beijingB"
    />
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
    routes () {
      // 侧边栏的内容是通过解决方案接口获取的
      return asyncRoutes.map(item => {
        item.randomId = Math.random() + ''
        return item
      })
    },
    activeMenu () {
      const route = this.$route
      const { meta, path } = route
      // if set path, the sidebar will highlight the path you set
      if (meta.activeMenu) {
        return meta.activeMenu
      }
      return path
    },
    showLogo () {
      return this.$store.state.settings.sidebarLogo
    },
    isCollapse () {
      return !this.sidebar.opened
    }
  }
}
</script>
<style lang="scss">
  @import '~@/styles/mixin';

  .sidebarBg {
    @include bgc-sidebar-bg-color();
    box-shadow: 4px 0 2px 0 rgba(196, 201, 215, 0.1);
    position: relative;

    .el-scrollbar {
      .el-menu {
        @include bgc-transparent();
        /*background-color: rgba(0,0,0,0.3);*/
        /*color: #eee;*/
        .el-submenu__title {
          //@include c-sidebar-text();
          /*color: #ccc;*/
        }

        .el-menu-item {
          /*color: #ccc;*/
          span:first-child {
            margin-left: 6px;
          }
        }
      }
    }

    .scrollbar-noCollapse {
      background: url('../../../assets/images/sideBgBottom.png') no-repeat right bottom;
      //.el-scrollbar__view{
      //padding-top: 20px;
      //}
    }
  }
</style>
