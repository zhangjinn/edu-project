<template>
  <div>

    <full-window
      :visible="editShow"
      :title="'修改信息'"
      @confirm="submitEdit"
      @cancel="cancelEdit"
    >
      <div class="profileCenter">
        <el-form ref="editForm" :rules="rules" :model="useInfo" label-position="right" label-width="80px">
          <el-row>
            <el-col :span="12" class="leftMsg">
              <el-form-item label="用户账号">
                <el-input v-model="useInfo.accountName" disabled />
              </el-form-item>
              <el-form-item label="账号密码">
                <el-input v-model="useInfo.password" type="password" />
              </el-form-item>
              <el-form-item label="企业">
                <el-input v-model="useInfo.organizationName" disabled />
              </el-form-item>
              <el-form-item label="角色">
                <el-input v-model="useInfo.roles" disabled />
              </el-form-item>
            </el-col>
            <el-col :span="12" class="rightMsg">
              <el-form-item label="头像">
                <el-upload
                  class="avatar-uploader"
                  :action="uploadUrl"
                  :http-request="upLoad"
                  :show-file-list="false"
                  :before-upload="beforeAvatarUpload"
                >
                  <img v-if="useInfo.icon" :src="useInfo.icon" class="avatar">
                  <i v-else class="el-icon-plus avatar-uploader-icon" />
                </el-upload>

              </el-form-item>
              <el-form-item label="用户姓名" prop="name">
                <el-input v-model="useInfo.name" />
              </el-form-item>
              <el-form-item label="岗位">
                <el-input v-model="useInfo.fkRoles" disabled />
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>
    </full-window>
    <phone-dialog v-if="drawers" :drawers="drawers" v-bind="$attrs" :user-info="user" v-on="$listeners" @closeDialog="closeDialog" @saveHandel="savePerson" />
  </div>
</template>

<script>
import phoneDialog from './phoneDialog'
import fullWindow from '../../../../layout/main/fullWindow'
import { savePersonId } from '@/api/user.js'
import { getAccount } from '@/utils/auth'

export default {
  name: 'ProfileForm',
  components: {
    phoneDialog,
    fullWindow
  },
  props: ['user', 'editShow'],
  data() {
    return {
      useInfo: {
        accountName: this.user.accountName,
        password: '',
        organizationName: this.user.organizationName,
        roles: this.user.roles,
        icon: this.user.icon,
        name: this.user.name,
        fkRoles: this.user.rolesName
      },
      commitIconUrl: '',
      uploadUrl: '',
      drawers: false,
      rules: {
        name: [
          { required: true, message: '输入框内容不能为空，请重新输入', trigger: 'blur' }
        ]
      }
    }
  },
  created() {
  },
  methods: {
    cancelEdit() {
      this.$emit('cancelEdit')
    },
    submitEdit() {
      if (this.useInfo.password !== '') {
        this.drawers = true
      } else {
        this.savePerson()
      }
    },
    closeDialog() {
      this.drawers = false
    },
    savePerson(verifyCode) {
      const account = getAccount().id
      let params
      if (verifyCode) {
        params = {
          accountName: this.useInfo.accountName,
          password: this.useInfo.password,
          icon: this.useInfo.icon,
          name: this.useInfo.name,
          captcha: verifyCode
        }
      } else {
        params = {
          accountName: this.useInfo.accountName,
          icon: this.useInfo.icon,
          name: this.useInfo.name
        }
      }

      savePersonId(account, params).then(res => {
        this.$message({
          message: '修改成功',
          type: 'success'
        })
        this.$emit('submitEdit')
      })
    },

    GetUrlRelativePath(iconUrl) {
      const url = iconUrl.toString()
      const arrUrl = url.split('//')

      const start = arrUrl[1].indexOf('/')
      let relUrl = arrUrl[1].substring(start)// stop省略，截取从start开始到结尾的所有字符

      if (relUrl.indexOf('?') !== -1) {
        relUrl = relUrl.split('?')[0]
      }
      return relUrl
    },
    /*
        * 上传头像
        * */
    async putStream(object) {
      try {
        // object-name可以自定义为文件名（例如file.txt）或目录（例如abc/test/file.txt）的形式，实现将文件上传至当前Bucket或Bucket下的指定目录。

        const file = object.file
        const date = Date.parse(new Date())
        const fileName = 'customer/' + date + '/' + file.name

        const result = await this.client.put(fileName, file)
        console.log(result)
        this.useInfo.icon = result.url
        this.commitIconUrl = this.GetUrlRelativePath(this.useInfo.icon)
        console.log(this.commitIconUrl)
      } catch (e) {
        console.log(e)
      }
    },

    upLoad(file) {
      this.putStream(file)
    },
    // 使用 before-upload 限制用户上传的图片格式和大小。
    beforeAvatarUpload(file) {
      const isJPG = file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'image/gif'
      const isLt2M = file.size / 1024 / 1024 < 2

      if (!isJPG) {
        this.$message.error('上传头像图片只能是 JPG/PNG/GIF 格式!')
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!')
      }
      return isJPG && isLt2M
    }
  }
}
</script>

<style lang="scss" scoped>
  .profileCenter {
    .leftMsg, .rightMsg {
      &>>>.el-form-item__content {
        line-height: 1;
      }
      .avatar-uploader {
        height: 40px;
        width: 100px;

        &>>>.el-upload {
          cursor: pointer;
          position: relative;
          overflow: hidden;
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: #ebeef5;
          .el-icon-plus {
            position: absolute;
            top: 34%;
            left: 48%;
            transform: translate(-50%);
          }
          img {
            width: 40px;
            height: 40px;
            border-radius: 50%;
          }
        }
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
</style>
