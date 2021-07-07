<template>
  <div class="loginButton">
    <el-button :loading="loading" type="primary" @click.native.prevent="login">{{ $t('login.loginBtnText') }}</el-button>
  </div>
</template>

<script>
export default {
  name: 'LoginButton',
  components: {},
  props: ['form'],
  data() {
    return {
      loading: this.$store.state.login.loading
    }
  },
  computed: {
    showRegBtn() {
      return this.$store.state.login.loginType === 'account'
    },
    loginType() {
      return this.$store.state.login.loginType
    }
  },
  methods: {
    login() {
      const form = this.form[this.loginType]
      let p
      form.$refs.loginForm.validate(valid => {
        if (valid) {
          this.$store.commit('login/SET_LOADING', true)
          if (this.loginType === 'account') {
            p = this.$store.dispatch('user/login', form.loginForm)
          } else {
            if (!this.$parent.$refs.phone.checked) return this.$message.warning('请先同意服务协议')
            p = this.$store.dispatch('user/messageLogin', form.loginForm)
          }
          p.then(data => {
            this.$router.push({ path: '/' })
            this.$store.commit('login/SET_LOADING', false)
            setTimeout(() => {
              form.resetForm()
            }, 500)
          }).catch(() => {
            this.$store.commit('login/SET_LOADING', false)
          })
        } else {
          this.$message.error('登录失败！请输入正确的信息')
          return false
        }
      })
    }
  }
}
</script>

<style lang="scss">
  .loginButton {
    display: flex;
    justify-content: center;
    margin: 0 auto;
    .el-button {
      width: 300px;
      height: 40px;
      padding: 0!important;
      font-size: 14px;
      border: 0;
      border-radius: 4px!important;
    }
  }
</style>
