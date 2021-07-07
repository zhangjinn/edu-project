<template>
  <div class="index-wrap">
    <etm-mobile-title @reback="reback">修改密码</etm-mobile-title>
    <div class="rowInfo">
      <div class="info">
        <van-cell-group :border="false">
          <van-field
            v-model="oldPassword"
            input-align="left"
            type="password"
            clearable
            label="原密码"
            placeholder="请输入原密码"
            :class="active === 1 ? 'focusBorder' : ''"
            @focus="addClass(1)"
            @blur="removeClass"
          />
        </van-cell-group>
      </div>
      <div class="info">
        <van-cell-group :border="false">
          <van-field
            v-model="newPassword"
            input-align="left"
            type="password"
            label="新密码"
            placeholder="请输入新密码"
            :class="active === 2 ? 'focusBorder' : ''"
            @focus="addClass(2)"
            @blur="removeClass"
          />
          <van-field
            v-model="newPasswordTwice"
            input-align="left"
            type="password"
            label="确认新密码"
            placeholder="请再次输入新密码"
            :class="active === 3 ? 'focusBorder' : ''"
            @focus="addClass(3)"
            @blur="removeClass"
          />
        </van-cell-group>
      </div>
    </div>
    <div v-show="hidshow" class="bottomFixed">
      <div class="bottomBtn van-hairline--top">
        <div class="btn" @click="changePass">
          <control-btn text="保存" type="primary" :disabled="disabled" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { putPerPass } from '../../../../service/base/mine'
import controlBtn from '../../../../components/common/controlBtn'
import { replaceSpace } from '../../../../js/rules'
import EtmMobileTitle from '@/components/EtmMobileTitle'

export default {
  name: 'ChangePassword',
  components: {
    EtmMobileTitle,
    controlBtn
  },
  data() {
    return {
      oldPassword: '',
      newPassword: '',
      newPasswordTwice: '',
      active: 0
    }
  },
  computed: {
    hidshow() {
      return this.$store.state.show.showBottom
    },
    disabled() {
      return !this.oldPassword || !this.newPassword || !this.newPasswordTwice
    }
  },
  methods: {
    addClass(i) {
      this.active = i
    },
    removeClass() {
      this.active = 0
      this.oldPassword = replaceSpace(this.oldPassword)
      this.newPassword = replaceSpace(this.newPassword)
      this.newPasswordTwice = replaceSpace(this.newPasswordTwice)
    },
    changePass() {
      if (this.disabled) return
      if (this.newPassword.length < 6) {
        return this.$toast({
          message: '密码不能少于6位',
          duration: 1000,
          icon: 'icon iconfont iconwarning'
        })
      }
      const param = {
        oldPassword: this.oldPassword,
        newPassword: this.newPassword,
        newPasswordTwice: this.newPasswordTwice
      }
      putPerPass(param).then(() => {
        setTimeout(() => {
          this.$toast({
            message: '修改成功，请重新登录！',
            duration: 1000,
            icon: 'icon iconfont iconsuccess'
          })
        }, 50)
        if (localStorage.getItem('platform') === 'wechat') {
          this.$router.back(-1)
        } else {
          localStorage.clear()
          setTimeout(() => {
            this.$router.replace({
              path: '/passwordLogin'
            })
          }, 1000)
        }
      })
    },
    reback() {
      this.$router.back(-1)
    }
  }
}
</script>

<style lang="scss" scoped>
.index-wrap {
  .rowInfo {
    .van-cell {
      padding: 20px 0;
    }

    .info {
      padding: 0 12px;
      background-color: $white;
      @include border-radius(5px);
      overflow: hidden;

      & + .info {
        margin-top: 12px;
      }
    }
  }

  .bottomFixed {
    .bottomBtn {
      bottom: 0;
      background-color: transparent;
    }
  }
}
</style>
