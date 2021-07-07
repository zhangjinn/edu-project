<template>
  <div class="wechatLogin">
    <div v-if="showInput" class="container">
      <p class="textLeft">手机号码绑定</p>
      <div class="inputBox textLeft">
        <van-cell-group :border="false">
          <van-field
            v-model="phone"
            type="tel"
            input-align="left"
            placeholder="请输入手机号码"
            :class="active === 1 ? 'focusBorder' : ''"
            @focus="addClass(1)"
            @blur="removeClass"
          />
          <van-field
            v-model="picCode"
            class="codeCell"
            input-align="left"
            placeholder="请输入图片验证码"
            :class="active === 2 ? 'focusBorder' : ''"
            @focus="addClass(2)"
            @blur="removeClass"
          >
            <van-button
              slot="button"
              size="small"
              tag="span"
              class="codeBtn"
              @click.stop="pictureCaptcha()"
            >
              <img :src="imgCaptcha">
            </van-button>
          </van-field>
          <van-field
            v-model="captcha"
            input-align="left"
            placeholder="请输入验证码"
            :class="active === 3 ? 'focusBorder' : ''"
            @focus="addClass(3)"
            @blur="removeClass"
          >
            <van-button
              v-if="sendType === 0"
              slot="button"
              size="small"
              tag="span"
              class="verifyBtn"
              :disabled="verifyDisabled"
              @click="sendMsg"
            >发送验证码
            </van-button>
            <van-button
              v-else-if="sendType === 1"
              slot="button"
              size="small"
              tag="span"
              class="verifyBtn disBtn"
            >发送中 {{ countdown }}s
            </van-button>
            <van-button
              v-else
              slot="button"
              size="small"
              tag="span"
              class="verifyBtn"
              :disabled="verifyDisabled"
              @click="sendMsg"
            >重新发送
            </van-button>
          </van-field>
        </van-cell-group>
      </div>
      <div class="btn" @click="submitLogin">
        <control-Btn text="立即绑定" type="primary" :disabled="disabled" />
      </div>
    </div>
  </div>
</template>

<script>
import { getImgCaptcha, getSmsCaptcha, weChatAuth, authLogin } from '../../../../service/base/login'
import controlBtn from '../../../../components/common/controlBtn'
import { judgePhone, replaceSpace } from '../../../../js/rules'
import {
  getToken,
  setExpiresIn,
  setLoginInfo,
  setOrganization,
  setOrganizationId,
  setPhone,
  setToken,
  setTokenTime
} from '../../../../js/localStore'
import { getMenuList } from '@/js/menu'

export default {
  name: 'CaptchaLogin',
  components: {
    controlBtn
  },
  data() {
    return {
      sendType: 0,
      countdown: 60,
      picCode: '',
      phone: '',
      captcha: '',
      imgCaptcha: '',
      imgCaptchaToken: '',
      active: 0,
      showInput: false
    }
  },
  computed: {
    verifyDisabled() {
      return !this.phone || !this.picCode
    },
    disabled() {
      return !this.phone || !this.captcha || !this.picCode
    }
  },
  watch: {
    captcha() {
      if (this.captcha.length > 6) {
        this.captcha = this.captcha.substring(0, 6)
      }
    }
  },
  created() {
    this.judgeToken()
  },
  methods: {
    judgeToken() {
      const token = getToken()
      const tempAccount = localStorage.getItem('tempAccount')
      if (token && tempAccount) {
        this.showInput = true
        this.pictureCaptcha()
      } else if (token) {
        getMenuList()
      } else {
        this.verify()
      }
    },
    verify() {
      const login = localStorage.getItem('login') || null
      const code = this.getCode(location.href)
      if (login && code) {
        localStorage.removeItem('login')
        this.login(code)
      } else {
        this.redirect()
      }
    },
    login(code) {
      const param = {
        code: code,
        type: 'WECHAT'
      }
      authLogin(param).then(res => {
        const data = res.data.data
        setToken(data.token)
        if (data.tempAccount) {
          localStorage.setItem('tempAccount', data.tempAccount)
          this.showInput = true
          this.pictureCaptcha()
        } else {
          setPhone(data.telephone)
          setLoginInfo(data.account)
          setOrganization(data.organizationList)
          setOrganizationId(data.currentOrganizationId)
          setExpiresIn(data.expiresIn)
          setTokenTime(new Date())
          localStorage.removeItem('tempAccount')
          if (!data.hasPassword) {
            this.$router.replace({
              path: '/setPassword'
            })
          } else {
            getMenuList()
          }
        }
      })
    },
    redirect() {
      const { href } = location
      const host = href
      weChatAuth({
        oAuthType: 'WECHAT',
        redirectUrl: host
      }).then(res => {
        localStorage.setItem('login', '1')
        setTimeout(() => {
          location.replace(res.data.data)
        }, 1000)
      })
    },
    getQueryVariable(variable) {
      if (!location.href.includes(variable)) {
        return null
      }
      const query = decodeURIComponent(location.href).split('#')[1].split('?')[1]
      const vars = query.split('&')
      for (let i = 0; i < vars.length; i++) {
        const pair = vars[i].split('=')
        if (pair[0] === variable) {
          return pair[1]
        }
      }
      return false
    },
    getCode(url) {
      if (url.includes('code')) {
        const str = url.split('?')[1]
        const arr = str.split('&')
        for (let i = 0; i < arr.length; i++) {
          if (arr[i].includes('code')) {
            return arr[i].split('=')[1]
          }
        }
      }
      return null
    },
    addClass(i) {
      this.active = i
    },
    removeClass() {
      this.active = 0
      this.phone = replaceSpace(this.phone)
      this.picCode = replaceSpace(this.picCode)
      this.captcha = replaceSpace(this.captcha)
    },
    // 图片验证码
    pictureCaptcha() {
      getImgCaptcha().then(res => {
        this.imgCaptchaToken = res.headers.token
        return 'data:image/png;base64,' + btoa(
          new Uint8Array(res.data).reduce((data, byte) => data + String.fromCharCode(byte), '')
        )
      }).then(data => {
        this.imgCaptcha = data
      })
    },
    sendMsg() {
      if (!this.verifyDisabled) {
        if (!judgePhone(this.phone)) {
          this.$toast({
            message: '手机号格式错误',
            duration: 1000,
            icon: 'icon iconfont iconwrong'
          })
        } else {
          this.getCaptchaByPhone()
        }
      }
    },
    // 倒计时
    countDownSendMsgTime() {
      const _this = this
      _this.sendType = 1
      const time = window.setInterval(function() {
        if (_this.countdown > 0) {
          _this.countdown -= 1
          _this.sessionTime -= 1
        } else if (_this.countdown === 0) {
          _this.sendType = 2
          _this.countdown = 60
          window.clearInterval(time)
        }
      }, 1000)
    },
    getCaptchaByPhone() {
      const param = {
        type: 'BUSINESS_REGISTER',
        captcha: this.picCode,
        token: this.imgCaptchaToken
      }
      getSmsCaptcha(this.phone, param).then(data => {
        const expireTime = data.data.data
        setTimeout(() => {
          this.$toast({
            message: '验证码已发送,' + expireTime / 60 + '分钟内有效',
            duration: 1000
          })
          this.countDownSendMsgTime()
        }, 50)
      })
    },
    submitLogin() {
      if (!this.disabled) {
        if (!judgePhone(this.phone)) {
          this.$toast({
            message: '手机号格式错误',
            duration: 1000,
            icon: 'icon iconfont iconwrong'
          })
        } else {
          const param = {
            type: 'WECHAT',
            telephone: this.phone,
            smsCaptcha: this.captcha
          }
          authLogin(param).then(res => {
            const data = res.data.data
            setToken(data.token)
            setPhone(data.telephone)
            setLoginInfo(data.account)
            setOrganization(data.organizationList)
            setOrganizationId(data.currentOrganizationId)
            setExpiresIn(data.expiresIn)
            setTokenTime(new Date())
            localStorage.removeItem('tempAccount')
            setTimeout(() => {
              this.$toast({
                message: '登录成功',
                duration: 1000,
                icon: 'icon iconfont iconsuccess'
              })
            }, 50)
            setTimeout(() => {
              if (!data.hasPassword) {
                this.$router.replace({
                  path: '/setPassword'
                })
              } else {
                getMenuList()
              }
            }, 1000)
          })
        }
      }
    }
  }
}
</script>

<style scoped lang="scss">

.wechatLogin {
  position: relative;
  min-height: 100vh;
  background-color: $white;

  img {
    height: auto;
  }

  .container {
    padding: 50px 35px;

    p {
      font-size: 23px;
      font-weight: 600;
    }

    .inputBox {
      margin: 40px 0;

      .van-cell {
        padding: 25px 0 15px;
      }

      .codeCell {
        .van-field__button {
          height: 24px;
        }

        .codeBtn {
          padding: 0;
          @include wh(88px, 24px);
          border: none;

          .van-button__text {
            display: inline-block;
            height: 24px;
          }
        }
      }

      .verifyBtn {
        @include wh(85px, 24px);
        @include border-radius(12px);
        line-height: 24px;
        font-size: 13px;
        color: $theme;
        border: none;

        &.disBtn {
          color: $white;
          background-color: $text-e;
          border-color: $text-e;
        }
      }

      .van-icon {
        font-size: 24px;
        color: $theme;
      }

    }

    .btn {
      margin: 0 auto;
    }
  }

}
</style>
