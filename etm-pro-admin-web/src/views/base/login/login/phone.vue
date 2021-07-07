<template>
  <div class="phoneLogin">
    <el-form
      ref="loginForm"
      :model="loginForm"
      :rules="loginRules"
      auto-complete="on"
      label-position="left"
    >

      <el-form-item prop="phonenumber">
        <el-input
          ref="phonenumber"
          v-model="loginForm.phonenumber"
          :placeholder="$t('login.messageLoginPhonePlaceHolderText')"
          name="phonenumber"
          type="text"
          auto-complete="on"
        >
          <i slot="prefix" class="iconfont iconshoujiduan" />
        </el-input>
      </el-form-item>

      <el-form-item class="df" prop="picturecode">
        <el-input
          key="picturecode"
          ref="picturecode"
          v-model="loginForm.picturecode"
          class="pictureInput"
          :placeholder="$t('login.messageLoginSecurityPlaceHolderText')"
          name="picturecode"
        >
          <i slot="prefix" class="iconfont iconsafetycertificate" />
        </el-input>
        <img :src="captcha" class="picture" alt="验证码" @click.stop="refreshCaptcha">

      </el-form-item>

      <el-form-item prop="verifycode">
        <el-input
          key="verifycode"
          ref="verifycode"
          v-model="loginForm.verifycode"
          class="verifyInput"
          type="text"
          :placeholder="$t('login.messageLoginValidatePlaceHolderText')"
          name="verifycode"
          @keyup.native.enter="$emit('submit')"
        >
          <i slot="prefix" class="iconfont iconmail" />
          <span slot="suffix" class="verify">
            <el-button v-if="!haveSent" id="verify" type="text" @click="getVerifyCode">{{ $t('login.getValidateCodeBtnText') }}</el-button>
            <span v-else class="countTime">{{ $t('login.waitValidateCodeBtnText') }}({{ count }}s)</span>
          </span>
        </el-input>
      </el-form-item>

      <el-form-item class="lastChild">
        <el-checkbox v-model="checked">我同意</el-checkbox><a @click.stop="pop = true">《软件许可及服务协议》</a>
      </el-form-item>
    </el-form>
    <etm-pop
      :visible="pop"
      pop="complex"
      title="软件许可及服务协议"
      confirm-btn="同意"
      cancel-btn="不同意"
      @open="handlePopOpen"
      @close="handlePopClose"
      @confirm="handlePopConfirm"
      @cancel="handlePopCancel"
    >
      <div class="agreement" v-html="agreement" />
    </etm-pop>
  </div>
</template>

<script>
import { validPhoneNumber } from '../../../../utils/validate'
import { getPhoneVerifyCode } from '../../../../api/user'
import EtmPop from '@/layout/main/EtmPop'
import agreement from '../agreement.js'
import axios from 'axios'
const URL = process.env.VUE_APP_BASE_API
export default {
  name: 'Phone',
  components: {
    EtmPop
  },
  data() {
    const validatePhoneNumber = (rule, value, callback) => {
      if (validPhoneNumber(value)) {
        callback()
      } else {
        callback(new Error(this.$t('login.messageLoginPhoneWarnText')))
      }
    }
    const validatePictureCode = (rule, value, callback) => {
      if (value) {
        callback()
      } else {
        callback(new Error(this.$t('login.messageLoginSecurityWarnText')))
      }
    }
    const validateVerifyCode = (rule, value, callback) => {
      if (value) {
        callback()
      } else {
        callback(new Error(this.$t('login.messageLoginValidateWarnText')))
      }
    }
    return {
      loginForm: {
        phonenumber: '',
        picturecode: '',
        verifycode: ''
      },
      loginRules: {
        phonenumber: [{ required: true, trigger: 'blur', validator: validatePhoneNumber }],
        picturecode: [{ required: true, trigger: 'blur', validator: validatePictureCode }],
        verifycode: [{ required: true, trigger: 'blur', validator: validateVerifyCode }]
      },
      captcha: undefined,
      token: undefined,
      haveSent: false,
      timer: null, // 倒计时的计时器
      count: 60, // 倒计时秒数
      checked: true,
      pop: false,
      agreement
    }
  },
  created() {
    this.getcaptcha()
  },
  methods: {
    getcaptcha() {
      axios({
        method: 'get',
        url: URL + '/basic/auth/captcha',
        responseType: 'arraybuffer',
        headers: {
          'etm-terminal-platform': 'PC'
        }
      }).then(response => {
        this.captcha = 'data:image/jpeg;base64,' + btoa(
          new Uint8Array(response.data).reduce((data, byte) => data + String.fromCharCode(byte), '')
        )
        this.token = response.headers.token
      }).catch(error => {
        this.$message.error('获取图片验证码失败')
        console.log(error)
      })
    },
    refreshCaptcha() {
      this.getcaptcha()
    },
    resetForm() {
      this.loginForm = {
        phonenumber: '',
        picturecode: '',
        verifycode: ''
      }
    },
    countDown() {
      if (this.timer) {
        this.timer = null
      }
      this.count = 60
      this.timer = setInterval(() => {
        if (this.count === 0) {
          clearInterval(this.timer)
          this.timer = null
          this.haveSent = false
        }
        this.count--
      }, 1000)
    },
    getVerifyCode() {
      if (this.loginForm.phonenumber && this.loginForm.picturecode) {
        getPhoneVerifyCode({ telephone: this.loginForm.phonenumber, captcha: this.loginForm.picturecode, token: this.token }).then(response => {
          this.haveSent = true
          this.countDown()
        }).catch(error => {
          console.log(error)
          this.refreshCaptcha()
          this.loginForm.picturecode = ''
        })
      } else {
        // 手机号码和图片验证码其中一个为空时提示
        this.$message.error('请输入手机号码和图片验证码')
      }
    },
    handlePopOpen() {
      this.pop = true
    },
    handlePopClose() {
      this.pop = false
    },
    handlePopConfirm() {
      this.checked = true
      this.handlePopClose()
    },
    handlePopCancel() {
      this.checked = false
      this.handlePopClose()
    }
  }
}
</script>

<style lang="scss" scoped>
  @import "src/styles/mixin";
  @import "src/styles/variables";
  input:-internal-autofill-previewed,
  input:-internal-autofill-selected {
    transition: background-color 5000s ease-in-out 0s !important;
  }
  .phoneLogin {
    height: 270px;
    padding-top: 40px;
    @include c_text_color();
    input::-internal-autofill-selected {
      background-color: $white!important;
    }
    .loginTextTip {
      font-size: 16px;
      @include c_text_color();
      font-weight: 400;
      i {
        margin-right: 10px;
      }
    }
    & >>> .el-form {
      .verifyInput {
        .countTime {
          margin-right: 20px;
        }
      }
    }
    & >>> .el-form-item {
      margin-bottom: 24px;
      .picture {
        width: 94px;
        height: 40px;
        margin-left: 9px;
        border-radius: 4px;
        cursor: pointer;
      }
      .title {
        display: inline-block;
        width: 28%;
      }
    }
    & >>> .lastChild {
      .el-form-item__content {
        line-height: 1;
      }
    }
    & >>> .el-form-item__content {
      width: 300px;
      margin: 0 auto;
    }
    & >>> .el-input {
      width: 300px;
    }
    .pictureInput {
      width: 198px;
      .el-input__suffix {
        padding-top: 3px;
      }
    }
    & >>> .el-form-item__error {
      // left: 5%;
    }
    & >>> .el-input__inner {
      height: 40px!important;
      line-height: 40px!important;
      padding-left: 40px;
      border-radius: 4px;
    }
    & >>> .el-checkbox {
      line-height: 1;
      @include c_secondary_color();
    }
    .iconfont {
      @include c_secondary_color();
      line-height: 40px;
    }
    .verify {
      line-height: 40px;
      margin-right: 5px;
      & >>> .el-button--text {
        @include c_main_color();
      }
    }
    .df >>> .el-form-item__content {
      display: flex;
    }
  }
  .agreement {
    & >>> p {
      text-indent: 2em;
    }
    & >>> strong {
      padding-left: 2em;
    }
  }
</style>
