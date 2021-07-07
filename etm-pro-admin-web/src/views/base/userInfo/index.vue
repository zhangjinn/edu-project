<template>
  <div class="index-wrap">
    <etm-layout-split>
      <etm-tabs v-model="currentTab" :setting="false" :show-toggle="false" tab-position="left">
        <el-tab-pane label="个人信息" name="userInfo">
          <etm-title>个人信息</etm-title>
          <etm-form type="dialog">
            <el-form-item label="头像">
              <etm-upload-avatar
                v-model="userInfo.avatar"
                :resource-name="'basic/userInfo'"
                media-type="image"
                @success="handleUploadAvatar"
              />
            </el-form-item>
            <el-form-item label="姓名">
              <el-input v-model="userInfo.accountName" style="width: 200px;" />
            </el-form-item>
            <el-form-item label="性别">
              <el-radio v-model="userInfo.gender" label="MALE">男</el-radio>
              <el-radio v-model="userInfo.gender" label="FEMALE">女</el-radio>
            </el-form-item>

            <el-form-item label="" type="left">
              <el-button type="primary" @click="handleUpdateUserInfo">更新个人信息</el-button>
            </el-form-item>
          </etm-form>

        </el-tab-pane>
        <el-tab-pane label="账户设置" name="account">
          <etm-title>账户设置</etm-title>
          <div class="user-info--item">
            <div class="item--img">
              <svg aria-hidden="true" class="icon">
                <use xlink:href="#iconshoujihaoma" />
              </svg>
            </div>
            <div class="item--content">
              <div class="item--content__description">手机号码 {{ userInfo.telephone }}</div>
              <div class="item--content__action">
                <span @click="resetPhone.visible = true">修改手机号</span>
              </div>
            </div>
          </div>
          <div class="user-info--item">
            <div class="item--img">
              <svg aria-hidden="true" class="icon">
                <use xlink:href="#iconweixinbangding" />
              </svg>
            </div>
            <div class="item--content">
              <div class="item--content__description">绑定微信</div>
              <div class="item--content__action">
                <span v-if="!userInfo.hasWechat" @click="handleBindWechat">马上绑定</span>
                <template v-else>
                  <span class="wechatNickname">{{ userInfo.wechatNickname }}</span>
                  <etm-text type="danger" @click="handleBindWechat">解绑</etm-text>
                </template>
              </div>
            </div>
          </div>

          <div class="user-info--item">
            <div class="item--img">
              <svg aria-hidden="true" class="icon">
                <use xlink:href="#iconzhanghaomima" />
              </svg>
            </div>
            <div class="item--content">
              <div class="item--content__description">账号密码</div>
              <div class="item--content__action">
                <span @click="updatePass.visible = true">修改密码</span>
              </div>
            </div>
          </div>
        </el-tab-pane>
        <el-tab-pane label="所属企业" name="enterprise">
          <etm-title>所属企业</etm-title>
          <div class="enterprise--box">
            <div v-for="(item,index) of enterprises" :key="index" class="enterprise--item">
              <div v-if="item.isCurrentEnterprise" class="active">
                当前企业
              </div>
              <div :class="['item--img', item.isCurrentEnterprise ? 'activeEnterprise': '']">
                <el-avatar v-if="item.enterpriseLogo" class="etm-avatar" :size="48" :src="item.enterpriseLogo" />

                <span v-else class="iconfont icondangqianqiye" />
              </div>
              <!--              <div>-->
              <!--                <span v-else style="display:flex; align-items: center; width:40px; height: 40px;">-->
              <!--                  <i style="font-size: 40px; color: #C1C4CC;" class="iconfont iconmorentouxiang" />-->
              <!--                </span>-->
              <!--              </div>-->

              <div class="item--content">
                <div class="name"> {{ item.enterpriseName | ellipsis }}</div>
                <div class="teacher">
                  {{ item.employeeName }}
                  <span class="edit iconfont iconedit1" @click="handleEdit(item)" />
                </div>
                <div class="department">所属部门 : {{ item.departmentName }}</div>
                <div class="position">岗位权限 : {{ item.positionNameList }}</div>
              </div>
            </div>
          </div>
        </el-tab-pane>
      </etm-tabs>
    </etm-layout-split>

    <!--修改昵称-->
    <etm-pop
      :visible="currentEnterprise.visible"
      cancel-btn="取消"
      confirm-btn="确定"
      pop="simple"
      title="修改昵称"
      @cancel="currentEnterprise.visible = false"
      @close="currentEnterprise.visible = false"
      @confirm="handleUpdateEnterprise"
    >
      <etm-form ref="etmForm" :model="currentEnterprise" type="dialog">
        <el-form-item label="昵称" required>
          <el-input v-model="currentEnterprise.employeeName" />
        </el-form-item>
      </etm-form>
    </etm-pop>

    <!--修改密码-->
    <etm-pop
      :visible="updatePass.visible"
      class="profiles-pop"
      title="修改密码"
      type="simple"
      @cancel="updatePass.visible = false"
      @close="updatePass.visible = false"
      @confirm="handleUpdatePass"
    >
      <etm-form ref="updatePass" :model="updatePass" :rules="resetPassRule" type="dialog">
        <el-form-item label="旧密码" prop="password">
          <el-input v-model="updatePass.password" type="password" />
        </el-form-item>

        <el-form-item label="设置新密码" prop="newPassword">
          <el-input v-model="updatePass.newPassword" type="password" />
        </el-form-item>

        <el-form-item label="重复新密码" prop="confirmPassword">
          <el-input v-model="updatePass.confirmPassword" type="password" />
        </el-form-item>
        <el-form-item label="" prop="">
          <div style="display: flex;justify-content: flex-end">
            <etm-text style="margin-right: 0;" type="primary" @click="updatePass.visible = false, pass.visible = true">忘记密码</etm-text>
          </div>
        </el-form-item>
      </etm-form>
    </etm-pop>

    <!--重置密码-->
    <etm-pop
      v-if="pass.visible"
      :visible="pass.visible"
      class="profiles-pop"
      title="通过短信重设密码"
      type="simple"
      @cancel="pass.visible = false"
      @close="pass.visible = false"
      @confirm="handleConfirm"
    >
      <etm-form ref="resetPass" :model="pass" :rules="passRule" type="dialog">
        <el-form-item label="手机号码" prop="phone">
          <el-input v-model="pass.phone" />
        </el-form-item>

        <el-form-item label="验证码" prop="captcha">
          <div style="display:flex;">
            <el-input v-model="pass.captcha" />
            <img
              :src="pass.captchaSrc"
              alt="验证码"
              class="picture"
              style="width: 100px;
                    height: 32px;
                    margin-left: 9px;
                    border-radius: 4px;
                    cursor: pointer;"
              @click.stop="getCaptcha()"
            >
          </div>
        </el-form-item>

        <el-form-item class="code" label="动态验证码" prop="verificationCode">
          <el-input v-model="pass.verificationCode" />
          <el-button :disabled="isDisabled" style="min-width: 100px;max-width: 100px;margin-left: 8px;" @click="sendMsg">{{ timeText }}</el-button>
        </el-form-item>

        <el-form-item label="设置新密码" prop="newPassword">
          <el-input v-model="pass.newPassword" type="password" />
        </el-form-item>

        <el-form-item label="重复新密码" prop="confirmPassword">
          <el-input v-model="pass.confirmPassword" type="password" />
        </el-form-item>

      </etm-form>
    </etm-pop>

    <!--重置手机号码-->
    <etm-pop
      v-if="resetPhone.visible"
      :visible="resetPhone.visible"
      class="profiles-pop"
      title="重置手机号码"
      pop="complex"
      @cancel="resetPhone.visible = false"
      @close="resetPhone.visible = false"
      @confirm="handleUpdatePhone"
    >
      <etm-form ref="resetPhone" :model="resetPhone" :rules="resetPhoneRules" type="dialog">
        <el-form-item label="当前手机号码" prop="phone">
          <span>{{ userInfo.telephone }}</span>
        </el-form-item>

        <el-form-item label="登录密码" prop="password">
          <el-input v-model="resetPhone.password" type="password" />
        </el-form-item>

        <el-form-item label="手机号码" prop="telephone">
          <el-input v-model="resetPhone.telephone" />
        </el-form-item>

        <el-form-item label="验证码" prop="captcha">
          <div style="display:flex;">
            <el-input v-model="resetPhone.captcha" />
            <img
              :src="resetPhone.captchaSrc"
              alt="验证码"
              class="picture"
              style="width: 100px;
                    height: 32px;
                    margin-left: 9px;
                    border-radius: 4px;
                    cursor: pointer;"
              @click.stop="getCaptcha()"
            >
          </div>
        </el-form-item>

        <el-form-item class="code" label="动态验证码" prop="smsCaptcha">
          <el-input v-model="resetPhone.smsCaptcha" />
          <el-button :disabled="resetPhone.isDisabled" style="min-width: 100px;max-width: 100px;margin-left: 8px;" @click="sendMsgForResetPhone">
            {{ resetPhone.timeText }}
          </el-button>
        </el-form-item>

      </etm-form>
    </etm-pop>

    <!--绑定微信-->
    <etm-pop
      :show-cancel-btn="false"
      :show-confirm-btn="false"
      :visible="bindWechat.visible"
      pop="complex"
      title="绑定微信"
      @cancel="bindWechat.visible = false"
      @close="bindWechat.visible = false"
      @confirm="bindWechat.visible = false"
    >
      <div id="wechat_container" style="text-align:center;" />
    </etm-pop>
  </div>

</template>

<script>
import EtmUploadAvatar from '@/components/EtmUploadAvatar/index'
import {
  queryCurrentUserEnterprise,
  queryCurrentUserInfo,
  updateBindWechat,
  updateCurrentEnterpriseInfo,
  updateCurrentUserInfo,
  updateUnbindWechat,
  updateUserPhone
} from '@/api/base/userInfo'
import { queryPhoneVerifyCodeOfResetPassword, updatePassword, updateResetPassword } from '@/api/user'
import { validPhoneNumber } from '@/utils/validate'
import axios from 'axios'
import { queryWechatLoginInfo } from '@/api/base/login'

/**
 * index create by haijinsha
 * createTime 2020/12/9 17:38
 */
const URL = process.env.VUE_APP_BASE_API
export default {
  name: 'Index',
  components: { EtmUploadAvatar },
  filters: {},
  mixins: [],
  props: {},
  data() {
    const _this = this
    return {
      currentTab: 'userInfo',
      userInfo: {
        gender: 'MALE',
        avatar: '',
        telephone: '',
        wechatNickname: '',
        accountName: '',
        hasWechat: false
      },
      enterprises: [],
      currentEnterprise: {
        visible: false
      },
      pass: {
        visible: false,
        phone: '',
        verificationCode: '',
        newPassword: '',
        confirmPassword: '',
        captcha: '',
        captchaSrc: '',
        token: ''
      },
      updatePass: {
        visible: false,
        password: '',
        newPassword: '',
        confirmPassword: ''
      },
      resetPassRule: {
        password: { required: true, message: '请输入旧密码', min: 6, trigger: ['blur', 'change'] },
        newPassword: { required: true, message: '请输入新密码', min: 6, trigger: ['blur', 'change'] },
        confirmPassword: {
          required: true, min: 6, trigger: ['blur', 'change'], validator(rule, value, cb) {
            if (value !== _this.updatePass.newPassword) {
              return cb(new Error('两次密码不一致'))
            }
            cb()
          }
        }
      },
      passRule: {
        phone: [
          {
            required: true,
            min: 11, max: 11,
            message: '手机号格式错误', trigger: ['change', 'blur'], validator(rule, value, cb) {
              const result = validPhoneNumber(value)
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
      isCaptcha: false,
      resetPhone: {
        visible: false,
        password: '',
        telephone: '',
        captchaSrc: '',
        smsCaptcha: '',
        isDisabled: true,
        isPhone: false,
        isCaptcha: false,
        timeText: '发送验证码'
      },
      resetPhoneRules: {
        password: { required: true, message: '密码必填' },
        telephone: {
          required: true,
          message: '手机号格式错误', trigger: ['change', 'blur'], validator(rule, value, cb) {
            const result = validPhoneNumber(value)
            _this.resetPhone.isDisabled = true
            if (result) {
              if (_this.resetPhone.timeText === '发送验证码') {
                _this.resetPhone.isDisabled = false
              }
              return cb()
            } else {
              return cb(new Error('手机号格式错误'))
            }
          }
        },
        captcha: { required: true, message: '验证码必填' },
        smsCaptcha: { required: true, message: '动态验证码必填' }
      },
      bindWechat: {
        visible: false
      }
    }
  },
  computed: {},
  watch: {
    '$route.query': {
      handler() {
        if (this.$route.query.code) {
          updateBindWechat({ code: this.$route.query.code }).then(res => {
            this.bindWechat.visible = false
            this.$router.push({ query: {}})
            queryCurrentUserInfo().then(res => {
              this.userInfo = Object.assign({}, res.data)
            })
          })
        }
      },
      deep: true,
      immediate: true
    }
  },
  created() {
  },
  mounted() {
    this.init()
    this.getCaptcha()
  },
  methods: {
    queryParams(param) {
      const href = location.href.split('?')[1]
      if (href) {
        let params = href.split('&')
        params = params.map(item => {
          return {
            key: item.split('=')[0],
            value: item.split('=')[1]
          }
        })
        return params.find(item => item.key === param).value
      }
      return null
    },
    init() {
      queryCurrentUserInfo().then(res => {
        this.userInfo = Object.assign({}, res.data)
      })
      const currentEnterpriseId = localStorage.getItem('currentOrganizationId')
      queryCurrentUserEnterprise().then(res => {
        this.enterprises = res.data.employeeList.map(item => {
          item.positionNameList = item.positionNameList.join()
          item.isCurrentEnterprise = item.enterpriseId === Number(currentEnterpriseId)
          return item
        })
      })
    },
    handleUploadAvatar(hash, key) {
      this.userInfo.avatar = key
    },
    handleUpdateUserInfo() {
      updateCurrentUserInfo(this.userInfo).then(res => {
        queryCurrentUserInfo().then(res => {
          this.userInfo = Object.assign({}, res.data)
          this.$store.commit('user/SET_AVATAR', this.userInfo.avatar)
          this.$message.success('更新成功')
        })
      })
    },
    handleEdit(item) {
      console.log(item)
      this.currentEnterprise.visible = true
      this.currentEnterprise = Object.assign({}, this.currentEnterprise, item)
    },
    handleUpdateEnterprise() {
      this.$refs.etmForm.$children[0].validate(valid => {
        if (valid) {
          const { employeeId, employeeName: name } = this.currentEnterprise
          updateCurrentEnterpriseInfo({ employeeId, name }).then(res => {
            this.currentEnterprise.visible = false
            this.init()
            this.$message.success('更新成功')
          })
        } else {
          this.$message.error('请输入正确的信息')
        }
      })
    },
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
        this.resetPhone.captchaSrc = 'data:image/jpeg;base64,' + btoa(
          new Uint8Array(response.data).reduce((data, byte) => data + String.fromCharCode(byte), '')
        )
        this.pass.token = response.headers.token
        this.resetPhone.token = response.headers.token
      }).catch(error => {
        this.$message.error('获取图片验证码失败')
        console.log(error)
      })
    },
    handleConfirm() {
      this.$refs['resetPass'].$children[0].validate(valid => {
        if (!valid) {
          return this.$message.error('信息不完整')
        }
        const { phone, verificationCode: code, newPassword } = this.pass
        updateResetPassword({ telephone: phone, smsCaptcha: code, newPassword }).then(res => {
          this.$message.success('操作成功')
          this.pass.visible = false
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
    sendMsg(type) {
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
    },
    sendMsgForResetPhone() {
      if (!validPhoneNumber(this.resetPhone.telephone)) {
        return this.$message.error('手机号码不正确')
      }
      if (!this.resetPhone.captcha) {
        return this.$message.error('请输入验证码')
      }
      this.resetPhone.isDisabled = true
      let count = 60
      if (this.resetPhone.timeText !== '发送验证码') {
        return
      }
      const timer = setInterval(() => {
        this.resetPhone.timeText = count + '秒'
        if (count < 1) {
          this.resetPhone.timeText = '发送验证码'
          clearInterval(timer)
          this.resetPhone.isDisabled = false
        }
        count--
      }, 1000)
      const { telephone: phone, captcha, token } = this.resetPhone
      queryPhoneVerifyCodeOfResetPassword({ phone, captcha, token, type: 'CHANGE_TELEPHONE' }).then(res => {
        this.$message.success('发送成功')
      }).catch(() => {
        this.getCaptcha()
      })
    },
    handleUpdatePhone() {
      this.$refs['resetPhone'].$children[0].validate(valid => {
        if (!valid) {
          this.$message.error('信息不完整')
        }
        const { telephone, smsCaptcha, password } = this.resetPhone
        updateUserPhone({ telephone, smsCaptcha, password }).then(res => {
          this.$message.success('操作成功')
          this.resetPhone.visible = false
          this.init()
        })
      })
    },
    handleUpdatePass() {
      this.$refs['updatePass'].$children[0].validate(valid => {
        if (valid) {
          const { password: oldPassword, newPassword, confirmPassword: newPasswordTwice } = this.updatePass
          updatePassword({ oldPassword, newPassword, newPasswordTwice }).then(res => {
            this.$message.success('更新成功')
            this.updatePass.visible = false
          })
        }
      })
    },
    handleBindWechat() {
      if (this.userInfo.hasWechat) {
        this.$etmTip.init({
          type: 'warn',
          title: `解绑微信`,
          content: `此操作将解绑当前账号，是否继续？`,
          confirmBtn: '解绑',
          cancelBtn: '取消',
          cancel: () => {
            this.$etmTip.close()
          },
          confirm: async() => {
            updateUnbindWechat().then(() => {
              this.$etmTip.close()
              queryCurrentUserInfo().then(res => {
                this.userInfo = Object.assign({}, res.data)
              })
            })
          }
        })
        this.$etmTip.open()
        return
      }
      this.bindWechat.visible = true
      queryWechatLoginInfo({ oAuthType: 'WECHAT' }).then(async res => {
        // eslint-disable-next-line no-undef
        this.WechatInstance = await new WxLogin({
          self_redirect: false,
          id: 'wechat_container',
          appid: res.data.appId,
          scope: res.data.scope,
          redirect_uri: res.data.redirectUrl,
          state: encodeURIComponent(location.origin + location.pathname),
          style: '',
          href: 'https://qiniu.etmcn.com/wechatCss.css'
        })
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.index-wrap {
  background-color: $white;
  margin-top: 24px;
  padding-bottom: 24px;
  /deep/.etm-avatar img{
    width: 100%;
  }
  .title {
    font-size: 16px;
    font-weight: bold;
    padding-bottom: 16px;
  }

  .user-info--item {
    display: flex;
    align-items: center;
    padding-bottom: 16px;

    &:not(:first-child) {
      padding-top: 16px;
    }

    &:not(:last-child) {
      border-bottom: 1px solid $divide-color;
    }

    .item--img {
    }

    .item--content {
      margin-left: 16px;
      font-size: 14px;
      flex: 1;
      display: flex;
      flex-direction: column;
      justify-content: center;

      &__description {
        color: $text-color;
      }

      &__action {
        display: inline-block;
        margin-top: 8px;
        @include etm-color();

        & > * {
          cursor: pointer;
        }

        .wechatNickname {
          border-radius: 4px;
          display: inline-block;
          padding: 4px 8px;
          color: $text-color;
          background-color: $divide-color;
        }
      }
    }
  }

  .enterprise--box {
    display: flex;
    align-items: center;
    justify-content: flex-start;
    flex-wrap: wrap;

    .enterprise--item {
      position: relative;
      float: left;
      width: 320px;
      height: 166px;
      display: flex;
      padding: 24px 16px;
      margin-right: 16px;
      margin-bottom: 16px;
      border: 1px solid #EEEEEE;
      box-shadow: 0px 2px 10px 0px rgba(211, 220, 244, 0.2);
      border-radius: 10px;
      background: url("../../../assets/images/userInfo/enterprise.png") no-repeat bottom right;

      .active {
        position: absolute;
        right: 0;
        top: 14px;
        width: 73px;
        height: 28px;
        display: flex;
        align-items: center;
        justify-content: space-evenly;
        color: $white;
        border-radius: 14px 0px 0px 14px;
        @include etm-bgc();
      }

      .item--img {
        width: 48px;
        height: 48px;
        display: flex;
        align-items: center;
        justify-content: center;

        > span {
          width: auto;
          font-size: 48px;
          color: #C1C4CE;
        }

        &.activeEnterprise {
          > span {
            width: auto;
            font-size: 48px;
            @include etm-color();
          }
        }
      }

      .item--content {
        margin-left: 8px;
        flex: 1;

        .name {
          font-size: 16px;
        }

        .teacher {
          .edit {
            cursor: pointer;

            &:hover {
              @include etm-color();
            }
          }
        }

        div:not(first-child){
          margin-top: 8px;
        }
      }
    }

  }

}
</style>

<style>
.code .el-form-item__content {
  display: flex;
}
</style>
