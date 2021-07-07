<template>
  <div class="setPassword">
    <div class="rowInfo">
      <div class="msg">
        <span class="iconfont icongantan" />
        首次登录，请设置密码激活账号
      </div>
      <div class="Info">
        <van-cell-group :border="false">
          <van-field
            v-model="password"
            input-align="left"
            label="密码"
            placeholder="请输入密码"
            type="password"
            :class="active === 1 ? 'focusBorder' : ''"
            @focus="addClass(1)"
            @blur="removeClass"
          />
          <van-field
            v-model="passwordTwice"
            input-align="left"
            label="确认密码"
            placeholder="请再次输入密码"
            type="password"
            :class="active === 2 ? 'focusBorder' : ''"
            @focus="addClass(2)"
            @blur="removeClass"
          />
        </van-cell-group>
      </div>
    </div>
    <div v-show="hidshow" class="bottomFixed">
      <div class="bottomBtn notBottomBar van-hairline--top">
        <div class="btn" @click="setPass">
          <control-btn text="保存" type="primary" :disabled="disabled" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { addPassword } from '../../../../service/base/login'
import controlBtn from '../../../../components/common/controlBtn'
import { replaceSpace } from '../../../../js/rules'
import { getMenuList } from '@/js/menu'

export default {
  name: 'SetPassword',
  components: {
    controlBtn
  },
  data() {
    return {
      password: '',
      passwordTwice: '',
      active: 0
    }
  },
  computed: {
    hidshow() {
      return this.$store.state.show.showBottom
    },
    disabled() {
      return !this.password || !this.passwordTwice
    }
  },
  methods: {
    addClass(i) {
      this.active = i
    },
    removeClass() {
      this.active = 0
      this.password = replaceSpace(this.password)
      this.passwordTwice = replaceSpace(this.passwordTwice)
    },
    setPass() {
      if (this.disabled) return
      if (this.password.length < 6) {
        this.$toast({
          message: '密码不足六位',
          duration: 1000,
          icon: 'icon iconfont iconwarning'
        })
        return
      }
      if (this.password !== this.passwordTwice) {
        this.$toast({
          message: '两次输入密码不一致',
          duration: 1000,
          icon: 'icon iconfont iconwarning'
        })
        return
      }
      const param = {
        password: this.password,
        passwordTwice: this.passwordTwice
      }
      addPassword(param).then(() => {
        setTimeout(() => {
          this.$toast({
            message: '设置密码成功',
            duration: 1000,
            icon: 'icon iconfont iconsuccess'
          })
        }, 50)
        setTimeout(() => {
          getMenuList()
        }, 1000)
      })
    }
  }
}
</script>

<style lang="scss" scoped>

    .rowInfo {

        .van-cell {
            padding: 20px 0;
        }

        .msg {
            padding: 12px;
            text-align: left;
            font-size: 14px;
            color: $red;
            background-color: $white;

            .iconfont {
                font-size: 14px;
            }
        }

        .Info {
            margin-top: 12px;
            padding: 0 12px;
            background-color: $white;
            @include border-radius(5px);
            overflow: hidden;
        }
    }
</style>
