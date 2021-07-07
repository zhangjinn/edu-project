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
      <el-dropdown v-else @command="handleCommand">
        <span class="el-dropdown-link">
          {{ organizationName }}<i class="el-icon-arrow-down el-icon--right" />
        </span>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item v-for="(item,index) of multiOrg" :key="index" :command="item.organizationId">
            {{ item.organizationName }}
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
      <!--&lt;!&ndash;      解决方案弹窗&ndash;&gt;-->
      <!--<el-popover-->
      <!--  placement="top-start"-->
      <!--  width="910"-->
      <!--  trigger="hover"-->
      <!--  class="solution-popover"-->
      <!--  popper-class="solutions-popper"-->
      <!--  :append-to-body="false"-->
      <!--&gt;-->
      <!--  <el-button slot="reference" type="primary" class="solutions-button">-->
      <!--    <img src="../../assets/images/solutions/solution-icon.png" class="icon" alt=""><span class="text">解决方案</span>-->
      <!--  </el-button>-->
      <!--  <solution-item :solutions="solutions" />-->
      <!--</el-popover>-->
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
            <el-dropdown :key="index" style="margin-left: 20px;" @command="changeRoute">
              <span class="el-dropdown-link">
                <i :class="['iconfont', item.iconCode]" /><span>{{ item.displayName }}</span><i class="el-icon-arrow-down el-icon--right" />
              </span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item v-for="(child,i) of item.childList" :key="i" :command="'/' +child.uri">
                  {{ child.displayName }}
                </el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </template>
        </template>

        <el-popover
          v-if="isDisableMobile"
          placement="bottom"
          trigger="hover"
          width="240"
        >
          <div style="display: flex;align-items:center;justify-content:center;flex-direction: column;margin-top: 8px;">
            <h3 style="color: #222;font-size: 14px;">扫描下方二维码登录移动端</h3>
            <div style="margin-top: 16px;color: #999;font-size: 12px;">-请使用微信扫一扫-</div>
            <div>
              <vue-qr :size="180" :text="weChatUrl" :margin="12" />
            </div>
          </div>
          <span slot="reference" class="phone"><i class="iconfont iconyidongduan" />移动端</span>
        </el-popover>
      </div>

      <el-dropdown class="avatar-container">
        <div class="avatar-wrapper">
          <el-avatar icon="iconfont iconmorentouxiang" class="user-avatar" :src="avatar" />
          <span class="username">{{ username }}</span>
          <i class="el-icon-arrow-down" />
        </div>
        <el-dropdown-menu slot="dropdown" class="user-dropdown">
          <el-dropdown-item class="user-dropdown-item">
            <span style="display:block;" @click="toProfile()">个人中心</span>
          </el-dropdown-item>
          <el-dropdown-item>
            <span style="display:block;" @click="serve">服务支持</span>
          </el-dropdown-item>
          <el-dropdown-item>
            <span style="display:block;" @click="$router.push({name: 'paymentCenter'})">充值中心</span>
          </el-dropdown-item>
          <el-dropdown-item v-if="isDisableTheme">
            <span style="display:block;" @click="showTheme = true">切换主题</span>
          </el-dropdown-item>
          <el-dropdown-item>
            <span style="display:block;color: red" @click="logout">退出登录</span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
    <etm-pop
      :visible="isDialog"
      pop="complex"
      :title="'服务支持'"
      border="false"
      :show-confirm-btn="false"
      :show-cancel-btn="false"
      :append-to-body="true"
      class="serverPopup"
      @close="isDialog=false"
      @cancel="isDialog=false"
      @confirm="isDialog=false"
    >
      <div class="serverContent">
        <img :src="contactUS" alt="">
      </div>
      <!--<div class="serverPopup">-->
      <!--  <div class="content">-->
      <!--    <span class="iconfont iconkefudianhua1" />-->
      <!--    <div class="conText">-->
      <!--      尊敬的客户您好！您的一对一客服已在线上。-->
      <!--    </div>-->
      <!--    <div class="numBer">-->
      <!--      400-0313-400-->
      <!--    </div>-->
      <!--  </div>-->
      <!--  <div class="content">-->
      <!--    <span class="iconfont iconkefudianhua1" />-->
      <!--    <div class="conText">-->
      <!--      尊敬的客户您好！您的一对一客服已在线上。-->
      <!--    </div>-->
      <!--    <div class="numBer">-->
      <!--      400-0313-400-->
      <!--    </div>-->
      <!--  </div>-->
      <!--</div>-->
    </etm-pop>

    <switchSkin v-if="showTheme" ref="theme" @close="close" @confirm="confirm" />

  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Hamburger from '@/components/Hamburger'
// import Breadcrumb from '@/components/Breadcrumb'
import { putMessageState } from '@/api/message'
import { getAccount, getCurrentOrganizationObject, getOrganization, setCurrentOrganizationId } from '@/utils/auth'
import { getMySolutionByTerminalType } from '@/api/auth'
import { changeCurrentOrg } from '@/api/customer'
import store from '@/store'
import switchSkin from '@/layout/components/switchSkin/index'
import vueQr from 'vue-qr'
import { basicURL } from '@/router'
import { queryEmployeeConfig, updateEmployeeConfig } from '@/api/base/employee'
import baseMixin from '@/layout/mixin/baseMixin'
import { isDisableMobile, isDisableTheme } from '@/auth'
// import SolutionItem from '@/layout/components/SolutionItem'

export default {
  name: 'NavBar',
  components: {
    // SolutionItem,
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
  data() {
    return {
      isDisableMobile: isDisableMobile(),
      isDisableTheme: isDisableTheme(),
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
      basics: [],
      contactUS: '',
      solutions: []
    }
  },
  computed: {
    ...mapGetters([
      'sidebar',
      'avatar'
    ]),
    showHamburger() {
      return this.$store.state.settings.hamburger
    },
    username() {
      return localStorage.getItem('phone')
      // if (Array.isArray(document.cookie.match(/phone=(\d+)/))) {
      //   const name = document.cookie.match(/phone=(\d+)/)[1]
      //   return name || '用户您好'
      // } else {
      //   return '用户您好'
      // }
    },
    multiOrg() {
      return JSON.parse(localStorage.getItem('organizations'))
    }
  },
  watch: {
    unReadCount() {
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
  created() {
    const organization = this.orgList = getOrganization()
    const user = getAccount()
    this.organizationId = organization[0].belongCompanyId
    this.accountId = user.id
    this.avatarSrc = user.icon
    if (this.unReadCount === 0) {
      this.getUnreadNoti()
      this.getReadNoti()
    }
    // 获取解决方案
    this.solutions = [
      [
        {
          name: '早教管家',
          desc: '2020.02.23到期',
          state: '',
          avatar: require('../../assets/images/solutions/zaojiao.png')
        },
        {
          name: '早托一体化',
          desc: '2020.02.23到期',
          state: 'NEW',
          avatar: require('../../assets/images/solutions/zaotuo.png')
        },
        {
          name: 'AI探客',
          desc: 'XXXXXXXXXXXX',
          state: '',
          avatar: require('../../assets/images/solutions/tanke.png')
        },
        {
          name: '招生管家',
          desc: 'XXXXXXXXXXXXXXXX',
          state: 'HOT',
          avatar: require('../../assets/images/solutions/zhaosheng.png')
        }
      ],
      [
        {
          name: '幼儿园管家',
          desc: 'XXXXXXXXXX',
          state: '',
          avatar: require('../../assets/images/solutions/youeryuan.png')
        },
        {
          name: '幼托一体化',
          desc: 'XXXXXXXXXX',
          state: 'NEW',
          avatar: require('../../assets/images/solutions/youtuo.png')
        },
        {
          name: 'AI碰客',
          desc: 'XXXXXXXXXXX',
          state: 'NEW',
          avatar: require('../../assets/images/solutions/pengke.png')
        },
        {
          name: '婴幼儿成长观测',
          desc: 'XXXXXXXXXXXXX',
          state: '',
          avatar: require('../../assets/images/solutions/guanci.png')
        }
      ],
      [
        {
          name: '托育管家',
          desc: 'XXXXXXXXXX',
          state: '',
          avatar: require('../../assets/images/solutions/tuoyu.png')
        },
        {
          name: '早幼一体化',
          desc: 'XXXXXXXXXX',
          state: 'NEW',
          avatar: require('../../assets/images/solutions/zaoyou.png')
        },
        {
          name: 'AI选址',
          desc: 'XXXXXXXX',
          state: '',
          avatar: require('../../assets/images/solutions/xuanzhi.png')
        }
      ]
    ]
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
    init() {
      const hostConfig = JSON.parse(JSON.parse(localStorage.getItem('hostConfig')).config)
      this.contactUS = hostConfig.bpcContactUs
      queryEmployeeConfig().then(res => {
        const _this = this
        this.$nextTick(() => {
          toggleClass(document.documentElement, res.data.theme)
          function toggleClass(element, className) {
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
    close() {
      this.showTheme = false
    },
    confirm() {
      this.showTheme = false
      updateEmployeeConfig({ theme: this.$refs.theme.value }).then(res => {
        console.log('res: ', res)
      })
    },
    getOrganizationName() {
      this.organizationName = getCurrentOrganizationObject().organizationName
    },
    handleCommand(organizationId) {
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
    closeAllTags() {
      this.$store.dispatch('tagsView/delAllVisitedViews')
    },
    load() {
      if (this.isReaded === 0) {
        this.unPageNum++
        this.getUnreadNoti()
      } else {
        this.pageNum++
        this.getReadNoti()
      }
    },
    getUnreadNoti() {
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
    getReadNoti() {
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
    readMsg(i, id) {
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
    toggleSideBar() {
      this.$store.dispatch('app/toggleSideBar')
    },
    logout() {
      this.$etmTip.init({
        type: 'warn',
        title: `退出登录`,
        content: `此操作将登出当前账号，是否继续？`,
        confirmBtn: '退出',
        cancelBtn: '取消',
        cancel: () => {
          this.$etmTip.close()
        },
        confirm: async() => {
          await this.$store.dispatch('user/logout')
          // this.$router.push(`/login?redirect=${_this.$route.fullPath}`)
          location.reload()
        }
      })
      this.$etmTip.open()
    },
    toProfile() {
      this.$router.push('/profile')
    },
    account() {
      this.$router.push('/account')
    },
    serve() {
      this.isDialog = true
    },
    changeRoute(url) {
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
    height: 52px;
    overflow: hidden;
    position: relative;
    @include bgc_white();
    padding: 0 16px 0 14px;

    /* .iconfont {
       font-size: 18px;
       vertical-align: middle;
       margin-right: 5px;
       @include c_text_color();
     }*/

    .hamburger-container {
      display: flex;
      line-height: 52px;
      height: 100%;
      float: left;
      cursor: pointer;
      transition: background .3s;
      -webkit-tap-highlight-color: transparent;

      & ::v-deep i.iconfont.hamburger {
        width: 20px;
      }
    }

    .breadcrumb-container {
      float: left;
    }

    .left-menu {
      float: left;
      height: 100%;
      /*line-height: 50px;*/
      display: flex;
      align-items: center;
      margin-left: 10px;
      .el-dropdown-link{
        cursor: pointer;
      }
      .solution-popover {
        height: 20px;
        width: 100px;
        margin-left: 14px;
        .solutions-button {
          height: 20px;
          width: 100px;
          padding: 0;
          background: #24B8C0;
          border-radius: 10px;
          font-size: 14px;
          color: #FFFFFF;
          .icon {
            width: 13px;
            height: 14px;
            background: #24B8C0;
            margin-right: 6px;
          }
        }
        & ::v-deep .solutions-popper {
          padding: 0;
          border: 0;
        }
      }

    }

    .right-menu {
      float: right;
      height: 100%;
      /*line-height: 50px;*/
      display: flex;
      align-items: center;

      .phone {
        margin-left: 20px;
        cursor: pointer;
        &:hover {
          i {
            @include etm-color;
          }
          @include etm-color;
        }
      }

      &:focus {
        outline: none;
      }

      .menu-left {
        position: relative;
        float: left;
        margin-right: 28px;

      &::after {
        display: inline-block;
        position: absolute;
        top: 6px;
        right: -14px;
        content: '';
        width: 1px;
        height: 14px;
        @include bgc_disabled_color();
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
            position: absolute;
            top: -5px;
            left: 7px;
            width: 16px;
            height: 16px;
            font-size: $comment-fontSize;
            @include c_white();
            text-align: center;
            line-height: 16px;
            border-radius: 50%;
            @include bgc_error_color();
          }
        }

        span {
          font-size: 14px;
          @include c_text_color();
        }

        i {
          font-size: 16px;
          @include c_text_color();
        }

        ::v-deep a {
          line-height: 21px;
          margin-left: 20px;
        }
      }

      .right-menu-item {
        display: inline-block;
        padding: 0 8px;
        height: 100%;
        font-size: 18px;
        vertical-align: text-bottom;

        &.hover-effect {
          cursor: pointer;
          transition: background .3s;

          &:hover {
            background: rgba(0, 0, 0, .025)
          }
        }
      }

      .user-avatar {
        width: 24px;
        height: 24px;
        line-height: 24px;
        vertical-align: middle;
        background-color: #fff;

        > ::v-deep i.iconmorentouxiang {
          font-size: 24px;
          vertical-align: baseline;
          width: 24px;
          height: 24px;
          line-height: 24px;
          color: #C1C4CC;
        }
      }

      .avatar-container {
        .avatar-wrapper {
          position: relative;
          cursor: pointer;
          ::v-deep .el-avatar>img {
            width: 100%;
          }
          .user-avatar {
            width: 24px;
            height: 24px;
            line-height: 24px;
            vertical-align: middle;

            > i.iconmorentouxiang {
              font-size: 25px !important;
              vertical-align: baseline !important;
              width: 25px !important;
              height: 25px !important;
              line-height: 25px !important;
            }
          }

          .username {
            font-size: $text-fontSize;
            @include c_text_color();
            vertical-align: middle;
            /*margin-left: 8px;*/
            margin-right: 3px;
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
      margin: 16px 0;
      font-size: $title-fontSize;
    }

    .iconkefudianhua1 {
      font-size: 80px;
      width: 80px;
      @include etm-color();
    }
    .serverPopup{
      display: flex;
    }
  }
  .serverPopup {
    ::v-deep .el-dialog .el-dialog__header {
      text-align: center !important;
      border: none !important;
      height: 130px !important;
      color:white!important;
      @include bgc_main_color();
    }
    ::v-deep .el-dialog .el-dialog__header .el-dialog__title{
      font-size: 16px!important;
      font-weight: bold!important;
      color: #FFFFFF!important;
      position: relative!important;
      top: 12px!important;
    }

    ::v-deep .el-dialog .el-dialog__header .el-dialog__close{
      color:white!important;
    }
    ::v-deep .el-dialog .el-dialog__header .el-dialog__close:hover{
      color:red!important;
    }
    .serverContent{
      display: flex;
      position: absolute;
      top: 90px;
      width: 100%;
      justify-content: space-evenly;
      left: 1px;
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

