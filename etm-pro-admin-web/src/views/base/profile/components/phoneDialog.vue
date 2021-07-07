<template>
  <small-window
    :visible="drawers"
    :title="'手机验证'"
    @close="closeBtn"
    @btnClick="handelEdit('editForm')"
  >
    <div class="phones">
      <el-form ref="editForm" :rules="rules" :model="phoneForm" label-position="right" label-width="80px">
        <div class="leftMsg">
          <el-form-item label="手机号码">
            <el-input v-model="phoneForm.phone" disabled />
          </el-form-item>
          <el-form-item label="安全验证" prop="pictureCode">
            <el-input v-model="phoneForm.pictureCode" placeholder="请输入图片验证码" name="pictureCode" />
            <img v-if="picCode" :src="picCode" alt="图片验证码" class="verifyImg" @click.stop="refreshCaptcha">
          </el-form-item>
          <el-form-item label="验证码" prop="verifyCode">
            <el-input v-model="phoneForm.verifyCode" placeholder="请输入手机验证码" name="verifyCode" />
            <el-button v-if="!isClick" type="primary" @click="sendCode">获取验证码</el-button>
            <span v-else class="countTime">发送中({{ this.count }}s)</span>
          </el-form-item>
        </div>
      </el-form>
    </div>
  </small-window>

</template>

<script>
import { editPhoneVerifyCode, getCaptcha } from '@/api/user.js'
import smallWindow from '../../../../layout/main/smallWindow'

export default {
  name: 'PhoneDialog',
  components: {
    smallWindow
  },
  props: ['userInfo', 'drawers'],
  data() {
    return {
      phoneForm: {
        phone: this.userInfo.telephone,
        pictureCode: '',
        verifyCode: ''
      },
      picCode: undefined,
      isClick: false,
      timer: null, // 倒计时的计时器
      count: 60, // 倒计时秒数
      token: undefined,
      rules: {
        verifyCode: [
          { required: true, message: '验证码不能为空', trigger: 'blur' }
        ],
        pictureCode: [
          { required: true, message: '图片验证码不能为空', trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    this.getcaptcha()
  },
  methods: {
    getcaptcha() {
      getCaptcha().then(res => {
        this.picCode = 'data:image/png;base64,' + btoa(new Uint8Array(res.data).reduce((data, byte) => data + String.fromCharCode(byte), ''))
        this.token = res.headers.token
      }).catch(() => {
        this.$message.error('获取图片验证码失败')
      })
    },
    refreshCaptcha() {
      this.getcaptcha()
    },
    sendCode() {
      const params = {
        captcha: this.phoneForm.pictureCode,
        phone: this.phoneForm.phone,
        type: 'EDIT_PASSWORD',
        token: this.token
      }
      if (this.phoneForm.pictureCode) {
        editPhoneVerifyCode(this.phoneForm.phone, params).then(res => {
          this.isClick = true
          this.countDown()
        }).catch(() => {
          this.refreshCaptcha()
          this.loginForm.picturecode = ''
        })
      }
    },
    countDown() {
      if (this.timer) {
        this.timer = null
      }
      const that = this
      this.count = 60
      this.timer = setInterval(() => {
        if (that.count === 0) {
          clearInterval(that.timer)
          that.timer = null
          that.isClick = false
        }
        that.count--
      }, 1000)
    },
    closeBtn() {
      this.$emit('closeDialog')
    },
    handelEdit(editForm) {
      this.$refs[editForm].validate((valid) => {
        if (valid) {
          this.$emit('saveHandel', this.phoneForm.verifyCode)
        } else {
          return false
        }
      })
    }
  }

}
</script>

<style lang="scss">

  .verifyImg {
    position: absolute;
    width: 120px;
    top: 50%;
    transform: translateY(-50%);
    left: 204px;
  }
  .countTime {
      margin-right: 20px;
    }
  .dialog-footer {
    position: absolute;
    right: 24px;
    bottom:24px;
  }
</style>
