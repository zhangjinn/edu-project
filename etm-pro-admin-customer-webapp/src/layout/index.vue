<template>
  <div
    :class="classObj"
    class="app-wrapper"
  >
    <div
      v-if="device==='mobile'&&sidebar.opened"
      class="drawer-bg"
      @click="handleClickOutside"
    />
    <sidebar class="sidebar-container" />
    <div class="main-container">
      <!-- 表头置顶表格在页面切换时候滚动到顶部的锚点 -->
      <div class="_scrollTop" />
      <div class="header">
        <navbar
          :un-read-count="unReadCount"
          @isRead="getMsgNum"
        />
        <tags-view />
      </div>
      <app-main v-show="!isMicro" />
      <div
        v-show="isMicro"
        id="appContainer"
      />
      <!--      <app-main />-->
      <!--      <div id="appContainer" />-->
    </div>
    <!--      新消息提示弹窗-->
    <div
      v-if="showNotification"
      class="notificationBox"
    >
      <div class="title">
        消息通知
        <span class="more">{{ number > 0 ? '(还有' + number + '条消息未读)' : '' }}</span>
      </div>
      <div class="mainMsg">
        {{ messageTxt }}
      </div>
      <div class="btn">
        <el-button
          class="btnDefault"
          @click="closeNot"
        >
          忽略
        </el-button>
        <el-button
          type="primary"
          @click="readMsg"
        >
          知道了
        </el-button>
      </div>
    </div>
    <etm-pop
      :visible="pop"
      title="设置账号密码"
      confirm-btn="确定"
      :element-attributes="{'show-close': false}"
      :show-cancel-btn="false"
      @open="handlePopOpen"
      @close="handlePopClose"
      @confirm="handlePopConfirm"
    >
      <etm-form
        ref="form"
        :model="form"
        :rules="rules"
        type="dialog"
      >
        <el-form-item label="用户账号">
          <el-input
            v-model="accountNumber"
            disabled
          />
        </el-form-item>
        <el-form-item label="用户姓名">
          <el-input
            v-model="accountName"
            disabled
          />
        </el-form-item>
        <el-form-item
          label="设置密码"
          prop="password"
        >
          <el-input
            v-model.trim="form.password"
            placeholder="请输入密码"
            show-password
          />
        </el-form-item>
        <el-form-item
          label="再次输入"
          prop="passwordAgain"
        >
          <el-input
            v-model.trim="form.passwordAgain"
            placeholder="请再次输入密码"
            show-password
          />
        </el-form-item>
      </etm-form>
    </etm-pop>
  </div>
</template>

<script>
import { Navbar, Sidebar, AppMain } from './components'
import ResizeMixin from './mixin/ResizeHandler'
import TagsView from '../components/TagsView'
import { putMessageState, getMessageNum } from '../api/message'
import { getAccount, getOrganization, getPhone, setFirstLogin } from '../utils/auth'
import { activation } from '@/api/user'

export default {
  name: 'Layout',
  components: {
    Navbar,
    Sidebar,
    AppMain,
    TagsView
  },
  mixins: [ResizeMixin],
  data () {
    const _this = this
    return {
      isMicro: false,
      showNotification: false,
      number: 0,
      websocket: undefined,
      organizationId: '',
      accountId: '',
      unReadCount: 0,
      messageTxt: '',
      messageId: '',
      count: 0,
      accountNumber: getPhone(),
      accountName: getAccount().name,
      form: {
        password: '',
        passwordAgain: ''
      },
      rules: {
        password: [
          { required: true, message: '密码不能为空', trigger: 'blur' }
        ],
        passwordAgain: [
          {
            validator: function (rule, value, callback) {
              if (value === _this.form.password) {
                callback()
              } else {
                callback(new Error('两次输入密码不一致！'))
              }
            },
            trigger: 'blur',
            required: true
          }
        ]
      }
    }
  },
  computed: {
    sidebar () {
      return this.$store.state.app.sidebar
    },
    device () {
      return this.$store.state.app.device
    },
    fixedHeader () {
      return this.$store.state.settings.fixedHeader
    },
    classObj () {
      return {
        hideSidebar: !this.sidebar.opened,
        openSidebar: this.sidebar.opened,
        withoutAnimation: this.sidebar.withoutAnimation,
        mobile: this.device === 'mobile'
      }
    },
    pop () {
      return this.$store.state.login.firstLogin
    }
  },
  watch: {
    $route: {
      handler () {
        this.changeRouter()
      },
      immediate: true,
      deep: true
    },
    pop: {
      handler () {
        this.accountNumber = getPhone()
        this.accountName = getAccount().name
      },
      immediate: true
    }
  },
  created () {
    const organization = getOrganization()
    const user = getAccount()
    this.organizationId = organization[0].organizationId
    this.accountId = user.id
    // this.getMsgNum()
    // this.initWebsocket()
  },
  destroyed () {
    this.websocket.close()
  },
  methods: {
    changeRouter () {
      const micros = ['/opc', '/daycare', '/guardcare', '/newdaycare', '/sacc', '/standardcare', '/neuroo', '/customer']
      this.isMicro = micros.some(path => location.pathname.startsWith(path))
    },
    getMsgNum () {
      const param = {
        state: 'UN_READ'
      }
      getMessageNum(param).then(res => {
        this.unReadCount = res.data
        this.number = this.unReadCount - 1
      })
    },
    closeNot () {
      this.showNotification = false
    },
    readMsg () {
      this.showNotification = false
      const arr = []
      arr.push(this.messageId)
      const param = {
        messageIds: arr,
        state: 'READ'
      }
      putMessageState(param).then(() => {
        this.getMsgNum()
      })
    },
    handleClickOutside () {
      this.$store.dispatch('app/closeSideBar', { withoutAnimation: false })
    },
    // webSocket消息实时通信
    initWebsocket () {
      let baseURL = ''
      if (process.env.NODE_ENV === 'production') {
        /* 第二层if，根据.env文件中的VUE_APP_FLAG判断是生产环境还是测试环境 */
        if (process.env.VUE_APP_FLAG === 'pro') {
          // production 生产环境
          baseURL = 'ws://api.etmprov.etmcn.com' // 路径
        } else {
          // test 测试环境
          baseURL = 'ws://api.etmprot.etmcn.com' // 路径
        }
      } else {
        // dev 开发环境
        baseURL = 'ws://api.etmprov.etmcn.com' // 路径
      }
      const _this = this
      this.websocket = new WebSocket(baseURL + '/push/websocket/' + this.accountId)
      this.websocket.onopen = function () {
        _this.onSocketOpen()
      }
      this.websocket.onmessage = function (evt) {
        _this.onSocketMessage(evt)
      }
      this.websocket.onerror = function () {
        _this.onSocketError()
      }
      this.websocket.onclose = function () {
        _this.onSocketClose()
      }
    },
    onSocketMessage (evt) {
      const data = JSON.parse(evt.data)
      const type = data.type
      if (!type) {
        console.log('获取信息')
        this.showNotification = true
        this.messageTxt = data.content
        this.messageId = data.messageId
        this.getMsgNum()
      }
    },
    onSocketError () {
      console.log('连接失败')
    },
    onSocketOpen () {
      console.log('连接成功')
      setInterval(() => {
        this.count++
      }, 1000)
      const param = {
        enterpriseId: this.organizationId + ''
      }
      this.websocket.send(JSON.stringify(param))
    },
    onSocketClose () {
      console.log(this.count, '连接断开')
    },
    handlePopOpen () {
      this.$store.commit('login/SET_FIRSTLOGIN', true)
    },
    handlePopClose () {
      this.$store.commit('login/SET_FIRSTLOGIN', false)
    },
    handlePopConfirm () {
      this.$refs.form.$children[0].validate(valid => {
        if (valid) {
          // TODO: 调用接口，设置密码
          activation({
            password: this.form.password,
            passwordTwice: this.form.passwordAgain
          }).then(res => {
            this.$message({
              type: 'success',
              message: '设置密码成功'
            })
            setFirstLogin(false)
            this.handlePopClose()
            // eslint-disable-next-line handle-callback-err
          }).catch(err => {
            this.$message.error('设置密码失败，请重试')
          })
        } else {
          this.$message({
            type: 'warning',
            message: '设置密码有误，请再次确认'
          })
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../styles/mixin';
@import '../styles/variables';

.app-wrapper {
  @include clearfix;
  @include c-color-text-regular();
  background-color: #f0f2f5;
  height: 100%;
  padding: 0;
  position: relative;
  width: 100%;

  &.mobile.openSidebar {
    position: fixed;
    top: 0;
  }
}

.drawer-bg {
  background: #000;
  height: 100%;
  opacity: 0.3;
  position: absolute;
  top: 0;
  width: 100%;
  z-index: 999;
}

.header {
  position: fixed;
  transition: 0.28s;
  width: calc(100vw - 190px);
  z-index: 10;
}

.fixed-header {
  position: fixed;
  right: 0;
  top: 0;
  transition: width 0.28s;
  width: calc(100% - #{$sideBarWidth});
  z-index: 9;
}

.hideSidebar .header {
  width: calc(100% - 64px);
}

.hideSidebar.mobile .header,
.openSidebar.mobile .header {
  width: 100%;
}

.mobile .fixed-header {
  width: 100%;
}

.notificationBox {
  @include bgc-white();
  @include bc-border-color-base();
  border-radius: 4px;
  border-style: solid;
  border-width: 1px;
  bottom: 24px;

  box-shadow: -1px 2px 9px 1px rgba(114, 114, 114, 0.05);
  font-size: 14px;
  padding: 16px;
  position: fixed;
  right: 24px;
  width: 357px;
  z-index: 99999;

  .title {
    @include c-color-text-primary();
    font-weight: bold;

    .more {
      color: $color-warning;
      font-weight: 400;
    }
  }

  .mainMsg {
    @include c-color-text-regular();
    padding: 24px 0;
  }

  .btn {
    margin-top: 12px;
    text-align: right;

    .el-button + .el-button {
      margin-left: 6px;
    }

    .btnDefault {
      @include c-color-text-regular();
      @include bc-border-color-base();
      @include bgc-transparent();

      &:hover {
        @include c-theme-color-one();
        @include bc-theme-color();
      }
    }
  }
}

.head {
  @include bc-border-color-base();
  border-bottom-style: solid;
  border-bottom-width: 1px;
}

.el-input.is-disabled {
  ::v-deep .el-input__inner {
    border: 0;
  }
}

.el-form-item__error {
  left: 84px;
}
</style>
