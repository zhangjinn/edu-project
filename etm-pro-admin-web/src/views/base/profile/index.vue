<template>
  <div class="profiles">
    <structure-a>
      <slot>
        <div class="container">
          <etm-title>个人中心</etm-title>
          <etm-form
            ref="ruleForm"
            label-width="300px"
            style="padding-top: 24px"
            :model="userInfo"
            :rules="rules"
          >
            <el-form-item label="头像：">
              <etm-upload-avatar
                v-model="userInfo.avatar"
                :resource-name="'basic/account'"
                media-type="image"
                @success="success"
              />
            </el-form-item>
            <el-form-item label="用户账号：">
              <el-input v-model="userInfo.telephone" disabled />
            </el-form-item>
            <el-form-item label="用户姓名：" prop="accountName">
              <el-input v-model="userInfo.accountName" />
            </el-form-item>
            <el-form-item label="企业：">
              <el-input v-model="userInfo.organizationName" disabled />
            </el-form-item>
            <!--<el-form-item label="角色：">-->
            <!--  <el-input v-model="userInfo.roleNames" disabled />-->
            <!--</el-form-item>-->
            <el-form-item label="岗位：">
              <el-input v-model="userInfo.postNames" disabled />
            </el-form-item>
            <el-form-item label="修改密码">
              <el-radio v-model="isEdit" label="1">是</el-radio>
              <el-radio v-model="isEdit" label="0">否</el-radio>
            </el-form-item>
            <el-form-item v-if="isEdit === '1'" label="旧密码" prop="oldPass">
              <el-input v-model="userInfo.oldPass" type="password" placeholder="请输入旧密码" />
            </el-form-item>
            <el-form-item v-if="isEdit === '1'" label="设置密码" prop="pass">
              <el-input v-model="userInfo.pass" type="password" placeholder="请输入新密码" />
            </el-form-item>
            <el-form-item v-if="isEdit === '1'" label="重复密码" prop="checkPass">
              <el-input v-model="userInfo.checkPass" type="password" placeholder="再次输入新密码" />
            </el-form-item>
            <el-form-item v-if="isEdit === '1'" label="" prop="" style="display: flex;justify-content: flex-end;text-align: end">
              <el-button type="text" @click="visible = true">忘记密码，通过短信验证重新设置 ></el-button>
            </el-form-item>
            <!--<el-form-item>-->
            <!--  <el-button class="etm-button-plain" @click="$router.push('/')">取消</el-button>-->
            <!--  <el-button @click="save">保存</el-button>-->
            <!--</el-form-item>-->
          </etm-form>
          <etm-form-foot @save="save" @cancel="cancel" />
        </div>
      </slot>
    </structure-a>
    <etm-pop
      type="simple"
      :visible="visible"
      title="通过短信重设密码"
      class="profiles-pop"
      @cancel="visible = false"
      @close="visible = false"
      @confirm="handleConfirm"
    >
      <etm-form ref="resetPass" :model="pass" :rules="passRule" type="dialog">
        <el-form-item prop="phone" label="手机号码">
          <el-input v-model="pass.phone" />
        </el-form-item>

        <el-form-item prop="captcha" label="验证码">
          <div style="display:flex;">
            <el-input v-model="pass.captcha" />
            <img
              :src="pass.captchaSrc"
              class="picture"
              style="width: 100px;
                    height: 32px;
                    margin-left: 9px;
                    border-radius: 4px;
                    cursor: pointer;"
              alt="验证码"
              @click.stop="getCaptcha()"
            >
          </div>
        </el-form-item>

        <el-form-item prop="verificationCode" label="动态验证码" class="code">
          <el-input v-model="pass.verificationCode" />
          <el-button style="min-width: 100px;max-width: 100px;margin-left: 8px;" :disabled="isDisabled" @click="sendMsg">{{ timeText }}</el-button>
        </el-form-item>

        <el-form-item prop="newPassword" label="设置新密码">
          <el-input v-model="pass.newPassword" type="password" />
        </el-form-item>

        <el-form-item prop="confirmPassword" label="重复新密码">
          <el-input v-model="pass.confirmPassword" type="password" />
        </el-form-item>

      </etm-form>
    </etm-pop>
  </div>

</template>

<script>
import structureA from '../../../layout/main/structureA'
import { getUserInfo, queryPhoneVerifyCodeOfResetPassword, updatePassword, updateResetPassword, updateUserInfo } from '@/api/user'
import EtmTitle from '@/layout/main/EtmTitle/src/EtmTitle'
import EtmUploadAvatar from '@/components/EtmUploadAvatar/index'
import axios from 'axios'

const URL = process.env.VUE_APP_BASE_API
export default {
  name: 'Profile',
  components: {
    EtmTitle,
    EtmUploadAvatar,
    structureA
  },
  data() {
    var validatePass = (rule, value, callback) => {
      if (value === '' || (value && value.length < 6)) {
        callback(new Error('请输入密码, 至少输入6位'))
      } else {
        if (this.userInfo.pass !== '') {
          this.$refs.ruleForm.$children[0].validateField('checkPass')
        }
        callback()
      }
    }
    var validatePass2 = (rule, value, callback) => {
      if (value === '' || (value && value.length < 6)) {
        callback(new Error('请输入密码, 至少输入6位'))
      } else if (value !== this.userInfo.pass) {
        callback(new Error('两次输入密码不一致!'))
      } else {
        callback()
      }
    }
    const _this = this
    return {
      showClose: false,
      editProfileVisible: false,
      isEdit: '0',
      userInfo: {
        avatar: '',
        oldPass: '',
        pass: '',
        checkPass: ''
      },
      roles: '',
      rolesName: '',
      useInfo: {
        accountName: '',
        password: '',
        organizationName: '',
        roles: '',
        icon: '',
        name: '',
        fkRoles: ''
      },
      rules: {
        name: [
          { required: true, message: '输入框内容不能为空，请重新输入', trigger: 'blur' }
        ],
        pass: [
          { required: true, message: '密码不能为空，请重新输入', trigger: 'blur' },
          { validator: validatePass }
        ],
        checkPass: [
          { required: true, message: '密码不能为空，请重新输入', trigger: 'blur' },
          { validator: validatePass2 }
        ],
        accountName: { required: true, message: '请填写用户姓名', trigger: 'blur' }
      },
      visible: false,
      pass: {
        phone: '',
        verificationCode: '',
        newPassword: '',
        confirmPassword: '',
        captcha: '',
        captchaSrc: '',
        token: ''
      },
      passRule: {
        phone: [
          {
            required: true,
            message: '手机号格式错误', trigger: ['change', 'blur'], validator(rule, value, cb) {
              const result = /^1\d{10}$/.test(value)
              _this.isDisabled = true
              if (result) {
                _this.isPhone = true
                if (_this.isPhone && _this.isCaptcha) {
                  _this.isDisabled = false
                }
                return cb()
              } else {
                return cb(new Error('手机号格式错误'))
              }
            }
          }
        ],
        captcha: {
          required: true, message: '请输入验证码', trigger: ['change', 'blur'], validator(rule, value, cb) {
            _this.isDisabled = true
            if (value) {
              _this.isCaptcha = true
              if (_this.isPhone && _this.isCaptcha) {
                _this.isDisabled = false
              }
              cb()
            } else {
              _this.isCaptcha = false
              cb(new Error('请输入验证码'))
            }
          }
        },
        verificationCode: { required: true, message: '动态验证码错误', trigger: ['blur', 'change'] },
        newPassword: [
          {
            required: true, trigger: ['blur', 'change'],
            validator(rule, value, cb) {
              if (value.length < 6) {
                return cb(new Error('密码不足六位'))
              } else {
                return cb()
              }
            }
          }
        ],
        confirmPassword: [
          { required: true, message: '两次输入密码不一致', trigger: ['blur', 'change'] },
          {
            trigger: ['blur', 'change'], validator(rule, value, cb) {
              if (value !== _this.pass.newPassword) {
                return cb(new Error('两次输入密码不一致'))
              } else {
                return cb()
              }
            }
          }
        ]
      },
      timeText: '发送验证码',
      isDisabled: true,
      isPhone: false,
      isCaptcha: false
    }
  },
  created() {

  },
  mounted() {
    this.init()
    this.getCaptcha()
  },
  methods: {
    getCaptcha() {
      axios({
        method: 'get',
        url: URL + '/basic/auth/captcha',
        responseType: 'arraybuffer',
        headers: {
          'etm-terminal-platform': 'PC'
        }
      }).then(response => {
        this.pass.captchaSrc = 'data:image/jpeg;base64,' + btoa(
          new Uint8Array(response.data).reduce((data, byte) => data + String.fromCharCode(byte), '')
        )
        this.pass.token = response.headers.token
      }).catch(error => {
        this.$message.error('获取图片验证码失败')
        console.log(error)
      })
    },
    init() {
      getUserInfo().then(res => {
        console.log(res)
        this.userInfo = res.data
        this.userInfo.postNames = this.userInfo.postNames.toString()
        this.userInfo.roleNames = this.userInfo.roleNames.toString()
      })
    },
    save() {
      this.$refs.ruleForm.$children[0].validate(valid => {
        if (valid) {
          updateUserInfo({
            avatar: this.userInfo.avatar,
            accountName: this.userInfo.accountName
          }).then(res => {
            this.$store.commit('user/SET_AVATAR', res.data.icon)
            if (this.userInfo.checkPass) {
              updatePassword({
                oldPassword: this.userInfo.oldPass,
                newPassword: this.userInfo.pass,
                newPasswordTwice: this.userInfo.checkPass
              }).then(res => {
                console.log(res)
                this.$message.success('更新个人信息成功')
              })
            } else {
              this.$message.success('更新个人信息成功')
            }
          })
        }
      })
    },
    cancel() {
      this.$router.push('/')
    },
    success(hash, key) {
      this.userInfo.avatar = key
    },
    beforeRemove(file, fileList) {
      return this.$confirm(`确定移除 ${file.name}？`)
    },
    edit() {
      this.editProfileVisible = true
    },
    cancelEdit() {
      this.editProfileVisible = false
    },
    submitEdit() {
      this.getUser()
      this.editProfileVisible = false
    },
    handleChange() {
      this.hideUpload = this.fileList.length >= this.limitCount
    },
    uploadSuccess(hash) {
      console.log(hash)
    },
    handleConfirm() {
      this.$refs['resetPass'].$children[0].validate(valid => {
        if (!valid) {
          this.$message.error('信息不完整')
        }
        const { phone, verificationCode: code, newPassword } = this.pass
        updateResetPassword({ telephone: phone, smsCaptcha: code, newPassword }).then(res => {
          this.$message.success('操作成功')
          this.visible = false
        })
      })
    },
    checkPhoneVerify() {
      let result = null
      this.$refs['resetPass'] && this.$refs['resetPass'].$children[0].validateField('phone', valid => {
        result = valid
      })
      return result
    },
    sendMsg(e) {
      if (this.checkPhoneVerify()) {
        return this.$message.error('手机号码不正确')
      }
      if (!this.pass.captcha) {
        return this.$message.error('请输入验证码')
      }
      this.isDisabled = true
      let count = 60
      if (this.timeText !== '发送验证码') {
        return
      }
      const timer = setInterval(() => {
        this.timeText = count + '秒'
        if (count < 1) {
          this.timeText = '发送验证码'
          clearInterval(timer)
          this.isDisabled = false
        }
        count--
      }, 1000)
      const { phone, captcha, token } = this.pass
      queryPhoneVerifyCodeOfResetPassword({ phone, captcha, token }).then(res => {
        this.$message.success('发送成功')
      }).catch(() => {
        this.getCaptcha()
      })
    }
  }
}
</script>

<style scoped lang="scss">
  @import "~@/styles/variables";
  @import "~@/styles/mixin";

  .profiles {
    margin-top: 16px;

    .container {
      height: 100%;
      position: relative;
      display: flex;
      flex-direction: column;
      //justify-content: space-between;

      .title {
        padding: 0 0 16px 12px;

        .lineBefore {
          position: relative;
          margin-right: 12px;
          font-size: 14px;
          font-weight: 700;

          &::before {
            content: '';
            display: inline-block;
            position: absolute;
            left: -18px;
            top: 4px;
            width: 12px;
            height: 12px;
            border-radius: 50%;
            @include bgc_themeColor();
          }
        }

        .el-icon-edit-outline {
          cursor: pointer;
        }
      }

      .btnGroup {
        position: absolute;
        top: 12px;
        right: 24px;
      }

      .profileMsg {
        @include clearfix();

        .leftMsg, .rightMsg {
          display: inline-block;
          width: 400px;

          & > > > .el-form-item__content {
            line-height: 1;
          }

          .perMsg {
            padding: 0 0 28px 22px;
            font-size: 14px;

            .name {
              display: inline-block;
              width: 90px;
              text-align: right;
              @include c_colorTextRegular();
            }

            .data {
            }
          }

          .imgs {
            width: 40px;
            height: 40px;
            border-radius: 50%;
          }
        }

        .el-input {
          width: 200px;

          & > > > .el-input__inner {
            color: #333;
            background-color: #fff;
          }

          &.is-disabled > > > .el-input__inner {
            cursor: default;
          }

          &.selectOpen > > > .el-input__inner {
            cursor: pointer;
          }

          &.selectOpen > > > .el-input__icon {
            cursor: pointer;
          }
        }
      }
    }

    .el-icon-arrow-left {
      cursor: pointer;
    }
  }
</style>

<style lang="scss">
  .profiles-pop {
    .code .el-form-item__content {
      display: flex;
    }
  }
</style>
