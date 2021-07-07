<template>
  <div class="account">
    <el-form
      ref="loginForm"
      :model="loginForm"
      :rules="loginRules"
      auto-complete="on"
      label-position="left"
    >

      <el-form-item prop="telephone">
        <el-input
          ref="phone"
          v-model="loginForm.telephone"
          :placeholder="$t('login.accountLoginAccountPlaceHolderText')"
          name="phone"
          type="text"
          tabindex="1"
          auto-complete="on"
          @keyup.native.enter="$emit('submit')"
        >
          <i slot="prefix" class="iconfont iconshoujiduan" />
        </el-input>
      </el-form-item>

      <el-form-item prop="password">
        <el-input
          key="password"
          ref="password"
          v-model="loginForm.password"
          type="password"
          :placeholder="$t('login.accountLoginPasswordPlaceHolderText')"
          name="password"
          tabindex="2"
          auto-complete="on"
          @keyup.native.enter="$emit('submit')"
        >
          <i slot="prefix" class="iconfont iconlock" />
        </el-input>
      </el-form-item>
      <el-form-item>
        <el-checkbox v-model="checked">记住密码</el-checkbox>
      </el-form-item>
    </el-form>

  </div>
</template>

<script>
import { validPhoneNumber } from '@/utils/validate'

export default {
  name: 'Account',
  data() {
    const validateUsername = (rule, value, callback) => {
      if (!validPhoneNumber(value)) {
        callback(new Error(this.$t('login.accountLoginAccountWarnText')))
      } else {
        callback()
      }
    }
    const validatePassword = (rule, value, callback) => {
      if (value.length < 6) {
        callback(new Error(this.$t('login.accountLoginPasswordWarnText')))
      } else {
        callback()
      }
    }
    return {
      loginForm: {
        telephone: '',
        password: '',
        type: 'PASSWORD'
      },
      loginRules: {
        telephone: [{ required: true, trigger: 'blur', validator: validateUsername }],
        password: [{ required: true, trigger: 'change', validator: validatePassword }]
      },
      checked: true
    }
  },
  methods: {
    resetForm() {
      this.loginForm = {
        telephone: '',
        password: '',
        type: 'PASSWORD'
      }
    }
  }
}
</script>

<style scoped lang="scss">
 /* input:-internal-autofill-previewed,
  input:-internal-autofill-selected {
    transition: background-color 5000s ease-in-out 0s !important;
  }*/
  .account {
    height: 270px;
    padding-top: 40px;
   /* input:-internal-autofill-selected {
      background-color: $white!important;
    }*/
    .loginTextTip{
      font-size:16px;
      font-weight:400;
      color: #555555;
      i{
        margin-right: 10px;
      }
    }
    & >>> .el-form {
      margin-bottom: 20px;
    }
    & >>> .el-form-item {
      margin-top: 0;
      margin-bottom: 24px;
    }
    & >>> .el-form-item__content {
      display: flex;
      width: 300px;
      margin: 0 auto;
      flex-direction: column;
    }
    & >>> .el-input {
      width: 300px;
      .el-input__inner {
        padding-left: 40px;
        border-radius: 4px;
      }
    }
    & >>> .el-form-item__error {
      // left: 12px;
    }
    & >>> .el-input__inner {
      line-height: 40px!important;
      height: 40px!important;
    }
    & >>> .el-checkbox {
      line-height: 1;
      @include c_secondary_color();
    }
    .iconfont {
      @include c_secondary_color();
      line-height: 40px;
    }
  }
</style>
