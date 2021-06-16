<template>
  <div
    class="sidebar-logo-container"
    :class="[collapse?'collapse':'noCollapse']"
  >
    <transition name="sidebarLogoFade">
      <router-link
        v-if="collapse"
        key="collapse"
        class="sidebar-logo-link"
        to="/"
      >
        <span
          v-if="getOrganizationLogo.organizationLogo"
          class="sidebar-logo-box sidebar-logo-box-small organization-logo-small"
        >
          <img
            class="sidebar-logo-small"
            :src="getOrganizationLogo.organizationLogo"
            alt="logo"
          >
        </span>
        <span
          v-else
          class="sidebar-logo-box sidebar-logo-box-small default-logo-small"
        >
          <img
            class="sidebar-logo-small"
            :src="defaultLogoSmall"
            alt="logo"
          >
        </span>
      </router-link>
      <router-link
        v-else
        key="expand"
        class="sidebar-logo-link"
        to="/"
      >
        <span
          v-if="getOrganizationLogo.organizationLogo"
          class="sidebar-logo-box sidebar-logo-box-big organization-logo-big"
        >
          <img
            class="sidebar-logo-big"
            :src="getOrganizationLogo.organizationLogo"
            alt="logo"
          >
        </span>
        <span
          v-else
          class="sidebar-logo-box sidebar-logo-box-big  default-logo-big"
        >
          <img
            class="sidebar-logo-big"
            :src="defaultLogoBig"
            alt="logo"
          >
        </span>
        <!--        <etm-logo />-->
      </router-link>
    </transition>
    <!--<div v-if="!collapse" class="sidebar-org-change">-->
    <!--  <div class="icon">-->
    <!--    <i class="iconfont icongongsi" />-->
    <!--  </div>-->
    <!--  <div class="title">-->
    <!--    {{ orgList[0].organizationName }}-->
    <!--  </div>-->
    <!--<el-dropdown @command="handleCommand">-->
    <!--  <el-button type="primary" class="el-dropdown-link">-->
    <!--    <i class="iconfont">&#xe65f;</i>-->
    <!--    <span class="orgname">{{ title }}</span>-->
    <!--    <i v-if="orgList.length>1" class="el-icon-caret-bottom" />-->
    <!--  </el-button>-->
    <!--  <el-dropdown-menu v-if="orgList.length>1" slot="dropdown">-->
    <!--    <el-dropdown-item-->
    <!--      v-for="org in orgList"-->
    <!--      :key="org.organizationId"-->
    <!--      :command="org.organizationId"-->
    <!--    >-->
    <!--      {{ org.organizationName }}-->
    <!--    </el-dropdown-item>-->
    <!--  </el-dropdown-menu>-->
    <!--  <el-dropdown-menu slot="dropdown" style="display: none;">-->
    <!--    <el-dropdown-item></el-dropdown-item>-->
    <!--  </el-dropdown-menu>-->

    <!--</el-dropdown>-->
    <!--</div>-->
    <!--<div v-else class="sidebar-org-change">-->
    <!--  <i class="iconfont">&#xe65f;</i>-->
    <!--</div>-->
  </div>
</template>

<script>
import { changeCurrentOrg, postAccountSetting } from '../../../api/customer'
import { getAccount, getCurrentOrganizationId, getCurrentOrganizationObject, getOrganization, setCurrentOrganizationId, getConfig } from '../../../utils/auth'
// import EtmLogo from '@/layout/components/Sidebar/EtmLogo'

export default {
  name: 'SidebarLogo',
  components: {
    // EtmLogo
  },
  props: {
    collapse: {
      type: Boolean,
      required: true
    }
  },
  data () {
    return {
      title: '这是机构名',
      loginInfo: [],
      countInfo: '',
      orgList: [],
      value: '',
      currentOrganizationId: '',
      defaultLogoBig: '',
      defaultLogoSmall: ''
    }
  },
  computed: {
    themeName () {
      return this.$store.state.base.themeName
    },
    config () {
      return getConfig()
    },
    getOrganizationLogo () {
      return getCurrentOrganizationObject()
    }

  },
  watch: {
    themeName (newName) {
      this.handleLogo(newName)
    },
    config: {
      handler (newName, oldName) {
        this.handleLogo(this.themeName)
      },
      immediate: true,
      deep: true
    }

  },

  created () {
    this.loginInfo = getOrganization()
    this.countInfo = getAccount()
    this.currentOrganizationId = getCurrentOrganizationId()
    this.orgList = this.loginInfo
    this.loginInfo.forEach((val) => {
      if (val.organizationId === this.currentOrganizationId) {
        this.title = val.organizationName
      }
    })
  },
  methods: {
    handleLogo (nVal) {
      if (nVal === 'etm-green' || nVal === 'etm-girlPink' || nVal === 'etm-lavenderPurple') {
        this.defaultLogoBig = this.config.bpcLogoLarge
        this.defaultLogoSmall = this.config.bpcLogoSmall
      } else {
        this.defaultLogoBig = this.config.bpcLogoLargeWhite
        this.defaultLogoSmall = this.config.bpcLogoSmallWhite
      }
    },
    handleCommand (command) {
      console.log(command)

      this.loginInfo.forEach((val) => {
        if (val.organizationId === command) {
          this.title = val.organizationName
        }
      })
      setCurrentOrganizationId(command)
      const org = {
        organizationId: command
      }
      const param = {
        page: '/index',
        platform: 'PC',
        accountId: this.countInfo.id,
        setting: JSON.stringify(org)
      }
      changeCurrentOrg({ organizationId: command }).then(res => {
        console.log(res)
      })
      postAccountSetting(param).then((res) => {
        console.log(res)
      })
      this.$store.dispatch('permission/generateRoutes')
      this.$router.push('/')
      this.closeAllTags()
    },

    // 关闭所有标签
    closeAllTags () {
      this.$store.dispatch('tagsView/delAllVisitedViews')
    }
  }
}
</script>

<style lang="scss" scoped>
@import '~@/styles/variables';
@import '~@/styles/mixin';
// .sidebarLogoFade-enter-active {
//   transition: opacity 1s;
// }

.sidebarLogoFade-enter,
.sidebarLogoFade-leave-to {
  opacity: 0;
}

.sidebar-logo-container {
  align-items: center;
  display: flex;
  justify-content: center;
  overflow: hidden;
  position: relative;
  width: 100%;

  .sidebar-org-change {
    align-items: center;
    color: $white;
    display: flex;
    /*font-size: 24px;*/
    font-size: 16px;
    height: 67px;
    padding-left: 24px;
    width: 100%;

    > .iconfont {
      @include c-white();
      font-size: 20px;
      margin-left: 22px;
    }

    .title {
      flex: 1;
      margin-left: 18px;
      overflow: hidden;
      padding-right: 10px;
      text-align: left;
      text-overflow: ellipsis;
      user-select: none;
      white-space: nowrap;
    }

    .el-button {
      @include bgc-transparent();
      border-color: $transparent;
      padding: 0 0 0 20px;

      .iconfont {
        font-size: 20px;
        margin-right: 15px;
      }

      .orgname {
        display: inline-block;
        font-size: $title-fontSize;
        margin-right: 16px;
        max-width: 104px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      .el-icon-caret-bottom {
        position: relative;
        top: -3px;
      }
    }
  }

  .sidebar-logo-link {
    height: 60px;
    width: 100%;

    .sidebar-logo-box {
      display: inline-block;
      //border-radius: 50%;
      overflow: hidden;

      img {
        @include wh(100%,100%);
      }
    }

    .sidebar-logo-box-small {
      //width: 24px;
      //height: 24px;
    }

    .sidebar-logo-box-big {
      //width: 60px;
      //height: 60px;
    }

    .organization-logo-small {
      border-radius: 50%;
      height: 30px;
      width: 30px;
    }

    .organization-logo-big {
      border-radius: 50%;
      height: 60px;
      width: 60px;
    }

    .default-logo-small {
      height: 24px;
    }

    .default-logo-big {
      height: 42px;
    }

  }

  &.noCollapse {
    height: 94px;
    //background: #ffffff url('../../../assets/images/sideBgTop.png') no-repeat;
    //background-size: 100% 100%;

  }

  &.collapse {
    height: 52px;

  }
}
@font-face {
  font-family: 'iconfont';  /* project id 1689282 */
  src: url('//at.alicdn.com/t/font_1689282_s7vtl5zhqm.eot');
  src: url('//at.alicdn.com/t/font_1689282_s7vtl5zhqm.eot?#iefix') format('embedded-opentype'),
    url('//at.alicdn.com/t/font_1689282_s7vtl5zhqm.woff2') format('woff2'),
    url('//at.alicdn.com/t/font_1689282_s7vtl5zhqm.woff') format('woff'),
    url('//at.alicdn.com/t/font_1689282_s7vtl5zhqm.ttf') format('truetype'),
    url('//at.alicdn.com/t/font_1689282_s7vtl5zhqm.svg#iconfont') format('svg');
}
</style>
