<template>
  <div class="passwordLogin">
    <div class="container">
      <p class="textLeft">欢迎登录</p>
      <div class="inputBox textLeft">
        <van-cell-group :border="false">
          <van-field
            v-model="phone"
            type="tel"
            input-align="left"
            placeholder="请输入手机号"
            :class="active === 1 ? 'focusBorder' : ''"
            @focus="addClass(1)"
            @blur="removeClass"
          />

          <van-field
            v-model="password"
            type="password"
            input-align="left"
            placeholder="请输入密码"
            :class="active === 2 ? 'focusBorder' : ''"
            @focus="addClass(2)"
            @blur="removeClass"
          />
        </van-cell-group>
      </div>
      <div class="btn" @click="login">
        <control-Btn text="登录" type="primary" :disabled="disabled" />
      </div>
      <div class="capLogin textLeft"><span @click="toCapLogin">短信验证登录</span></div>
    </div>
  </div>
</template>

<script>
import controlBtn from '../../../../components/common/controlBtn'
import { login } from '../../../../service/base/login'
import {
  setExpiresIn,
  setLoginInfo,
  setOrganization,
  setOrganizationId,
  setPhone,
  setToken,
  setTokenTime
} from '../../../../js/localStore'
import { judgePhone, replaceSpace } from '../../../../js/rules'
import { getMenuList } from '@/js/menu'

export default {
  name: 'PasswordLogin',
  components: {
    controlBtn
  },
  data() {
    return {
      phone: '',
      password: '',
      active: 0
    }
  },
  computed: {
    disabled() {
      return !this.phone || !this.password
    }
  },
  methods: {
    toCapLogin() {
      this.$router.replace({
        path: '/captchaLogin'
      })
    },
    addClass(i) {
      this.active = i
    },
    removeClass() {
      this.active = 0
      this.phone = replaceSpace(this.phone)
      this.password = replaceSpace(this.password)
    },
    login() {
      if (this.disabled) return
      if (!judgePhone(this.phone)) {
        this.$toast({
          message: '手机号格式错误',
          duration: 1000,
          icon: 'icon iconfont iconwrong'
        })
        return
      }
      const param = {
        telephone: this.phone,
        password: this.password,
        type: 'PASSWORD'
      }
      login(param).then(res => {
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
</script>

<style lang="scss">

.passwordLogin {
  min-height: 100vh;
  background-color: $white;

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

    }

    .btn {
      margin: 0 auto;
    }

    .capLogin {
      margin-top: 12px;
      color: $text-5;
      font-size: 13px;
    }
  }

}
</style>
