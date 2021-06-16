<template>
  <div class="navbar">
    <hamburger
      v-if="showHamburger"
      :is-active="sidebar.opened"
      class="hamburger-container"
      @toggleClick="toggleSideBar"
    />
    <div class="left-menu">
      <!--<span>{{ orgList[0].organizationName }}</span>-->
      <span v-if="multiOrg.length <= 1">{{ organizationName }}</span>
      <el-dropdown
        v-else
        @command="handleCommand"
      >
        <span class="el-dropdown-link">
          {{ organizationName }}<i class="el-icon-arrow-down el-icon--right" />
        </span>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item
            v-for="(item,index) of multiOrg"
            :key="index"
            :command="item.organizationId"
          >
            {{ item.organizationName }}
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
    <div class="right-menu">
      <div class="menu-left">
        <template v-for="(item,index) of basics">
          <router-link
            v-if="item.type === 'MENU'"
            :key="item.uri"
            :to="{ path: '/'+item.uri }"
          >
            <i :class="['iconfont', item.iconCode]" /><span>{{ item.displayName }}</span>
          </router-link>
          <template v-else-if="item.type === 'FOLDER'">
            <el-dropdown
              :key="index"
              style="margin-left: 20px;"
              @command="changeRoute"
            >
              <span class="el-dropdown-link">
                <i :class="['iconfont', item.iconCode]" /><span>{{ item.displayName }}</span><i class="el-icon-arrow-down el-icon--right" />
              </span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item
                  v-for="(child,i) of item.childList"
                  :key="i"
                  :command="'/' +child.uri"
                >
                  {{ child.displayName }}
                </el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </template>
        </template>

        <el-popover
          placement="bottom"
          trigger="hover"
          width="240"
        >
          <div
            style="align-items: center;
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin-top: 8px;"
          >
            <h3
              style="color: #222;
  font-size: 14px;"
            >
              扫描下方二维码登录移动端
            </h3>
            <div
              style="color: #999;
  font-size: 12px;
  margin-top: 16px;"
            >
              -请使用微信扫一扫-
            </div>
            <div>
              <vue-qr
                :size="150"
                :text="weChatUrl"
              />
            </div>
          </div>
          <span
            slot="reference"
            class="phone"
          ><i class="iconfont iconyidongduan" />移动端</span>
        </el-popover>
      </div>

      <el-dropdown class="avatar-container">
        <div class="avatar-wrapper">
          <el-avatar
            icon="iconfont iconmorentouxiang"
            class="user-avatar"
            :src="avatar"
          />
          <span class="username">{{ username }}</span>
          <i class="el-icon-arrow-down" />
        </div>
        <el-dropdown-menu
          slot="dropdown"
          class="user-dropdown"
        >
          <el-dropdown-item class="user-dropdown-item">
            <span
              style="display: block;"
              @click="toProfile()"
            >个人中心</span>
          </el-dropdown-item>
          <el-dropdown-item>
            <span
              style="display: block;"
              @click="serve"
            >服务支持</span>
          </el-dropdown-item>
          <el-dropdown-item>
            <span
              style="display: block;"
              @click="$router.push({name: 'paymentCenter'})"
            >充值中心</span>
          </el-dropdown-item>
          <el-dropdown-item>
            <span
              style="display: block;"
              @click="showTheme = true"
            >切换主题</span>
          </el-dropdown-item>
          <el-dropdown-item>
            <span
              style="color: #f00;
  display: block;"
              @click="logout"
            >退出登录</span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
    <etm-pop
      :visible="isDialog"
      pop="complex"
      :title="'服务支持'"
      :btn-text="'确认'"
      :append-to-body="true"
      @close="isDialog=false"
      @cancel="isDialog=false"
      @confirm="isDialog=false"
    >
      <div class="content">
        <span class="iconfont iconkefudianhua1" />
        <div class="conText">
          尊敬的客户您好！您的一对一客服已在线上。
        </div>
        <div class="numBer">
          400-0313-400
        </div>
      </div>
    </etm-pop>

    <switchSkin
      v-if="showTheme"
      ref="theme"
      @close="close"
    />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Hamburger from '@/components/Hamburger'
// import Breadcrumb from '@/components/Breadcrumb'
import { putMessageState } from '../../api/message'
import { getAccount, getCurrentOrganizationObject, getOrganization, setCurrentOrganizationId } from '@/utils/auth'
import { getMySolutionByTerminalType } from '@/api/auth'
import { changeCurrentOrg } from '@/api/customer'
import store from '@/store'
import switchSkin from '@/layout/components/switchSkin/index'
import vueQr from 'vue-qr'
import { basicURL } from '@/router'
import { queryEmployeeConfig, updateEmployeeConfig } from '@/api/base/employee'
import baseMixin from '@/layout/mixin/baseMixin'

export default {
  name: 'NavBar',
  components: {
    Hamburger,
    switchSkin,
    // NoContent,
    vueQr
  },
  mixins: [baseMixin],
  props: {
    unReadCount: {
      type: [Number, String],
      default: ''
    }
  },
  data () {
    return {
      basicURL: basicURL,
      showTheme: false,
      organizationName: '',
      isDialog: false,
      visible: false,
      isReaded: 0,
      readList: [],
      unReadList: [],
      organizationId: '',
      accountId: '',
      pageSize: 10,
      unPageNum: 1,
      noMoreUnRead: false,
      pageNum: 1,
      noMoreRead: false,
      noMore: false,
      orgList: [],
      routerLinkArr: [],
      basics: []
    }
  },
  computed: {
    ...mapGetters([
      'sidebar',
      'avatar'
    ]),
    showHamburger () {
      return this.$store.state.settings.hamburger
    },
    username () {
      return localStorage.getItem('phone')
      // if (Array.isArray(document.cookie.match(/phone=(\d+)/))) {
      //   const name = document.cookie.match(/phone=(\d+)/)[1]
      //   return name || '用户您好'
      // } else {
      //   return '用户您好'
      // }
    },
    multiOrg () {
      return JSON.parse(localStorage.getItem('organizations'))
    }
  },
  watch: {
    unReadCount () {
      this.unPageNum = 1
      this.noMoreUnRead = false
      this.unReadList = []
      this.getUnreadNoti()
      this.pageNum = 1
      this.noMoreRead = false
      this.readList = []
      this.getReadNoti()
    }
  },
  created () {
    const organization = this.orgList = getOrganization()
    const user = getAccount()
    this.organizationId = organization[0].belongCompanyId
    this.accountId = user.id
    this.avatarSrc = user.icon
    if (this.unReadCount === 0) {
      this.getUnreadNoti()
      this.getReadNoti()
    }

    // 根据权限渲染右上角的菜单按钮
    const cacheSolution = JSON.parse(localStorage.getItem('CACHESOLUTION'))
    if (cacheSolution) {
      cacheSolution.forEach(v => {
        if (v.type === 'BASIC') {
          this.basics = v.resourceList
          // v.resourceList.forEach(resource => {
          //   if (resource.type === 'MENU') {
          //     resource.url = '/basic/' + resource.url
          //     this.routerLinkArr.push(resource)
          //   }
          // })
        }
      })
    } else {
      getMySolutionByTerminalType('PC').then(res => {
        const { solutionList } = res.data
        solutionList.forEach(v => {
          if (v.type === 'BASIC') {
            this.basics = v.resourceList
            // v.resourceList.forEach(resource => {
            //   if (resource.type === 'MENU') {
            //     resource.url = '/basic/' + resource.url
            //     this.routerLinkArr.push(resource)
            //   }
            // })
          }
        })
      }).catch(err => {
        console.log(err)
      })
    }

    this.getOrganizationName()
    // const organization = this.orgList = getOrganization()
    // const user = getAccount()
    // this.organizationId = organization[0].belongCompanyId
    // this.accountId = user.id
    // this.avatarSrc = user.icon
    // if (this.unReadCount === 0) {
    //   this.getUnreadNoti()
    //   this.getReadNoti()
    // }
    this.init()
  },
  methods: {
    init () {
      queryEmployeeConfig().then(res => {
        const _this = this
        this.$nextTick(() => {
          toggleClass(document.documentElement, res.data.theme)
          function toggleClass (element, className) {
            if (!element || !className) {
              return
            }
            element.className = className
            const hostConfig = JSON.parse(localStorage.getItem('hostConfig'))
            hostConfig.themeName = className
            _this.$store.dispatch('base/setThemeName', hostConfig.themeName)
            localStorage.setItem('hostConfig', JSON.stringify(hostConfig))
          }
        })
      })
    },
    close () {
      this.showTheme = false
      updateEmployeeConfig({ theme: this.$refs.theme.value }).then(res => {
        console.log('res: ', res)
      })
    },
    getOrganizationName () {
      this.organizationName = getCurrentOrganizationObject().organizationName
    },
    handleCommand (organizationId) {
      console.log(organizationId)

      // this.loginInfo.forEach((val) => {
      //   if (val.organizationId === command) {
      //     this.title = val.organizationName
      //   }
      // })
      setCurrentOrganizationId(organizationId)
      this.getOrganizationName()

      changeCurrentOrg({ organizationId }).then(res => {
        console.log(res)
        this.closeAllTags()
        store.commit('login/SET_HASROUTES', false)
        localStorage.removeItem('CACHESOLUTION')
        localStorage.removeItem('routeTable')
        localStorage.removeItem('routeGroup')
        window.location.href = '/'
      })
    },

    // 关闭所有标签
    closeAllTags () {
      this.$store.dispatch('tagsView/delAllVisitedViews')
    },
    load () {
      if (this.isReaded === 0) {
        this.unPageNum++
        this.getUnreadNoti()
      } else {
        this.pageNum++
        this.getReadNoti()
      }
    },
    getUnreadNoti () {
      // const param = {
      //   pageSize: this.pageSize,
      //   pageNum: this.unPageNum,
      //   state: 'UN_READ',
      //   accountId: this.accountId,
      //   enterpriseId: this.organizationId
      // }
      // getMessageList(param).then(res => {
      //   const list = res.data.content
      //   if (this.unPageNum === 1) {
      //     this.unReadList = []
      //   }
      //   list.forEach(item => {
      //     item.createTime = parseTime(item.createTime, '{y}-{m}-{d} {h}:{i}:{s}')
      //     this.unReadList.push(item)
      //   })
      //   if (list.length < this.pageSize) {
      //     this.noMoreUnRead = true
      //   }
      // })
    },
    getReadNoti () {
      // const param = {
      //   pageSize: this.pageSize,
      //   pageNum: this.pageNum,
      //   state: 'READ',
      //   accountId: this.accountId,
      //   enterpriseId: this.organizationId
      // }
      // getMessageList(param).then(res => {
      //   const list = res.data.content
      //   if (this.pageNum === 1) {
      //     this.readList = []
      //   }
      //   list.forEach(item => {
      //     item.createTime = parseTime(item.createTime, '{y}-{m}-{d} {h}:{i}:{s}')
      //     this.readList.push(item)
      //   })
      //   if (list.length < this.pageSize) {
      //     this.noMoreRead = true
      //   }
      // })
    },
    readMsg (i, id) {
      const arr = []
      arr.push(id)
      const param = {
        messageIds: arr,
        state: 'READ'
      }
      putMessageState(param).then(() => {
        this.$emit('isRead')
      })
    },
    toggleSideBar () {
      this.$store.dispatch('app/toggleSideBar')
    },
    logout () {
      this.$etmTip.init({
        type: 'warn',
        title: '退出登录',
        content: '此操作将登出当前账号，是否继续？',
        confirmBtn: '退出',
        cancelBtn: '取消',
        cancel: () => {
          this.$etmTip.close()
        },
        confirm: async () => {
          await this.$store.dispatch('user/logout')
          // this.$router.push(`/login?redirect=${_this.$route.fullPath}`)
          location.reload()
        }
      })
      this.$etmTip.open()
    },
    toProfile () {
      this.$router.push('/profile')
    },
    account () {
      this.$router.push('/account')
    },
    serve () {
      this.isDialog = true
    },
    changeRoute (url) {
      const path = `${url}`
      console.log('path: ', path)
      this.$router.push({ path })
    }
  }
}
</script>

<style lang="scss" scoped>
/*@import "~@/styles/variables";*/
/*@import "~@/styles/mixin.scss";*/

.navbar {
  @include bgc-white();
  height: 52px;
  overflow: hidden;
  padding: 0 16px;
  position: relative;

  /* .iconfont {
     font-size: 18px;
     vertical-align: middle;
     margin-right: 5px;
     @include c_text_color();
   }*/

  .hamburger-container {
    cursor: pointer;
    display: flex;
    float: left;
    height: 100%;
    line-height: 52px;
    -webkit-tap-highlight-color: transparent;
    transition: background 0.3s;

    ::v-deep {
      .iconfont.hamburger {
        width: 20px;
      }
    }
  }

  .breadcrumb-container {
    float: left;
  }

  .left-menu {
    align-items: center;
    /*line-height: 50px;*/
    display: flex;
    float: left;
    height: 100%;
    margin-left: 10px;

    .el-dropdown-link {
      cursor: pointer;
    }
  }

  .right-menu {
    align-items: center;
    /*line-height: 50px;*/
    display: flex;
    float: right;
    height: 100%;

    .phone {
      cursor: pointer;
      margin-left: 20px;

      &:hover {
        @include etm-color;

        i {
          @include etm-color;
        }
      }
    }

    &:focus {
      outline: none;
    }

    .menu-left {
      float: left;
      margin-right: 28px;
      position: relative;

      &::after {
        @include bgc-disabled-color();
        content: '';
        display: inline-block;
        height: 14px;
        position: absolute;
        right: -14px;
        top: 4px;
        width: 1px;
      }

      > a:hover {
        > i {
          @include c-main_color();
        }

        > span {
          @include c-main_color();
        }
      }

      .messageTab {
        position: relative;

        .count {
          @include c-white();
          @include bgc-error-color();
          border-radius: 50%;
          font-size: $comment-fontSize;
          height: 16px;
          left: 7px;
          line-height: 16px;
          position: absolute;
          text-align: center;
          top: -5px;
          width: 16px;
        }
      }

      span,
      i {
        @include c_text_color();
        font-size: 14px;
      }

      & ::v-deep  a {
        line-height: 21px;
        margin-left: 20px;
      }
    }

    .right-menu-item {
      display: inline-block;
      font-size: 18px;
      height: 100%;
      padding: 0 8px;
      vertical-align: text-bottom;

      &.hover-effect {
        cursor: pointer;
        transition: background 0.3s;

        &:hover {
          background: rgba(0, 0, 0, 0.025);
        }
      }
    }

    .user-avatar {
      background-color: #fff;
      height: 24px;
      line-height: 24px;
      vertical-align: middle;
      width: 24px;

      > ::v-deep {
        .iconmorentouxiang {
          color: #c1c4cc;
          font-size: 24px;
          height: 24px;
          line-height: 24px;
          vertical-align: baseline;
          width: 24px;
        }
      }
    }

    .avatar-container {
      .avatar-wrapper {
        cursor: pointer;
        position: relative;

        ::v-deep .el-avatar>img {
          width: 100%;
        }

        .user-avatar {
          height: 24px;
          line-height: 24px;
          vertical-align: middle;
          width: 24px;

          > .iconmorentouxiang {
            font-size: 25px !important;
            height: 25px !important;
            line-height: 25px !important;
            vertical-align: baseline !important;
            width: 25px !important;
          }
        }

        .username {
          @include c_text_color();
          font-size: $text-fontSize;
          /*margin-left: 8px;*/
          margin-right: 3px;
          vertical-align: middle;
        }

        .el-icon-caret-bottom {
          color: #666;
          vertical-align: middle;
        }

      }
    }
  }
}

.content {
  text-align: center;

  .numBer {
    font-size: 36px;
  }

  .conText {
    font-size: $title-fontSize;
    margin: 16px 0;
  }

  .iconkefudianhua1 {
    @include etm-color();
    font-size: 80px;
    width: 80px;
  }

}

/*@font-face {*/
/*  font-family: 'iconfont';  !* project id 1689282 *!*/
/*  src: url('//at.alicdn.com/t/font_1689282_s7vtl5zhqm.eot');*/
/*  src: url('//at.alicdn.com/t/font_1689282_s7vtl5zhqm.eot?#iefix') format('embedded-opentype'),*/
/*  url('//at.alicdn.com/t/font_1689282_s7vtl5zhqm.woff2') format('woff2'),*/
/*  url('//at.alicdn.com/t/font_1689282_s7vtl5zhqm.woff') format('woff'),*/
/*  url('//at.alicdn.com/t/font_1689282_s7vtl5zhqm.ttf') format('truetype'),*/
/*  url('//at.alicdn.com/t/font_1689282_s7vtl5zhqm.svg#iconfont') format('svg');*/
/*}*/
</style>
