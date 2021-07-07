<template>
  <div class="phones">
    <el-form ref="editForm" :rules="rules" :model="phoneForm" label-width="100px" label-position="right">
      <el-form-item label="用户账号：">
        <span>{{ phone }}</span>
      </el-form-item>
      <el-form-item label="用户姓名：">
        <span>{{ accountName }}</span>
      </el-form-item>
      <el-form-item label="设置密码" prop="password">
        <el-input v-model="phoneForm.password" placeholder="请设置密码" name="password" />
      </el-form-item>
      <el-form-item label="再次输入" prop="passwordTwice">
        <el-input v-model="phoneForm.passwordTwice" placeholder="请选择再次输入" name="passwordTwice" />
      </el-form-item>
    </el-form>
  </div>

</template>

<script>
import { getAccount, getPhone } from '../../../utils/auth'

export default {
  name: 'SetPassword',
  data() {
    const validatePass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入密码'))
      } else {
        if (this.phoneForm.passwordTwice !== '') {
          this.$refs.editForm.validateField('passwordTwice')
        }
        callback()
      }
    }
    const validatePass2 = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'))
      } else if (value !== this.phoneForm.password) {
        callback(new Error('两次输入密码不一致!'))
      } else {
        callback()
      }
    }
    return {
      phoneForm: {
        password: '',
        passwordTwice: ''
      },
      phone: '',
      rules: {
        password: [
          { validator: validatePass, trigger: 'blur' }
        ],
        passwordTwice: [
          { validator: validatePass2, trigger: 'blur' }
        ]
      },
      accountName: ''
    }
  },
  computed: {
    loginType() {
      return this.$store.state.login.loginType
    }
  },
  watch: {
    phoneForm: {
      handler: function(val) {
        const params = {
          phone: this.phone,
          password: val
        }
        this.$store.commit('login/SET_PASSWORD', params)
      },
      deep: true
    }
  },

  created() {
    this.phone = getPhone()
    this.accountName = getAccount().name
  }

}
</script>

<style lang="scss">

  .verifyImg {
    position: absolute;
    width: 120px;
    top: 50%;
    transform: translateY(-50%);
    left: 210px;
  }

  .countTime {
    margin-right: 20px;
  }

  .dialog-footer {
    position: absolute;
    right: 24px;
    bottom: 24px;
  }
</style>
