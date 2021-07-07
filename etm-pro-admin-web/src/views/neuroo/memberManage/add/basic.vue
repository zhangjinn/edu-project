<template>
  <div class="basic">
    <etm-form ref="basicForm" :rules="rules" :model="basicForm">
      <el-form-item :label="$t('memberManage.basicFormLabelIcon') + ':'" prop="icon">
        <div class="avatar">
          <el-avatar icon="el-icon-user-solid" :src="basicForm.icon" />
          <div class="changeAvatar">
            <el-upload
              :show-file-list="false"
              :http-request="upLoadAvatar"
              :before-upload="beforeAvatarUpload"
              :action="''"
            >
              <span>修改头像</span>
            </el-upload>
            <p>{{ $t('memberManage.supportedImageType') }}</p>
          </div>
        </div>
      </el-form-item>
      <el-form-item :label="$t('memberManage.basicFormLabelName') + ':'" prop="name">
        <el-input v-model="basicForm.name" :placeholder="$t('memberManage.basicFormNamePlaceHolderText')" />
      </el-form-item>
      <el-form-item :label="$t('memberManage.basicFormLabelContacts') + ':'" prop="contacts">
        <div v-for="(item, index) in basicForm.contacts" :key="index" class="contact">
          <el-select v-model="item.contactTypeId" :placeholder="$t('memberManage.basicFormContactPlaceHolderText')">
            <el-option v-for="(caller, i) in content" :key="i" :label="caller.value" :value="caller.id" />
          </el-select>
          <el-input v-model="item.name" :placeholder="$t('memberManage.basicFormNamePlaceHolderText')" />
          <el-input v-model="item.phone" :placeholder="$t('memberManage.basicFormPhonePlaceHolderText')" />
          <EtmFontIcon :name="index === 0 ? 'plus' : 'minus'" @click.native.stop="handleContact(index)" />
        </div>
      </el-form-item>
      <el-form-item :label="$t('memberManage.basicFormLabelBirthday') + ':'" prop="birthday">
        <el-date-picker
          v-model="basicForm.birthday"
          value-format="yyyy-MM-dd"
          type="date"
          :placeholder="$t('memberManage.basicFormBirthdayPlaceHolderText')"
          :picker-options="{ disabledDate: disabledDateFunc}"
        />
      </el-form-item>

      <el-form-item label="归属省市区:" prop="district">
        <div class="contact">
          <el-select v-model="basicForm.district.province" placeholder="请选择省份">
            <el-option label="广东省" value="GD" />
            <el-option label="广西省" value="GX" />
          </el-select>
          <el-select v-model="basicForm.district.city" placeholder="请选择城市">
            <el-option label="广州市" value="GZ" />
            <el-option label="湛江市" value="ZJ" />
          </el-select>
          <el-select v-model="basicForm.district.area" placeholder="请选择区域">
            <el-option label="天河区" value="TH" />
            <el-option label="海珠区" value="HZ" />
          </el-select>
        </div>
      </el-form-item>

      <el-form-item :label="$t('memberManage.basicFormLabelAddress') + ':'">
        <el-input v-model="basicForm.address" :placeholder="$t('memberManage.basicFormAddressPlaceHolderText')" />
      </el-form-item>
      <el-form-item :label="$t('memberManage.basicFormLabelGender') + ':'" prop="gender">
        <el-radio-group v-model="basicForm.gender">
          <el-radio label="MALE">{{ $t('memberManage.basicFormGenderMale') }}</el-radio>
          <el-radio label="FEMALE">{{ $t('memberManage.basicFormGenderFemale') }}</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="备注:" prop="remark">
        <el-input v-model="basicForm.remark" style="width: 560px;" placeholder="无" type="textarea" />
      </el-form-item>
      <!-- <el-form-item
        v-for="(item, index) in formItems"
        :key="index"
        :label="item.name + ':'"
        :rules="item.mandatory ? rules : null"
      >
        <el-input v-if="item.controlType === 'INPUT_BOX'" v-model="basicForm.attributes[item.attributeId]" :placeholder="$t('memberManage.pleaseEnterText') + item.name" />
        <el-date-picker v-if="item.controlType === 'DATE'" v-model="basicForm.attributes[item.attributeId]" value-format="yyyy-MM-dd" type="date" :placeholder="$t('memberManage.pleaseEnterText') + item.name" />
        <el-radio-group v-if="item.controlType === 'RADIO'" v-model="basicForm.attributes[item.attributeId]">
          <el-radio v-for="(select, i) in item.options" v-show="item.options" :key="i" :label="select" />
        </el-radio-group>
        <el-select v-if="item.controlType === 'SELECT_BOX'" v-model="basicForm.attributes[item.attributeId]" :placeholder="$t('memberManage.pleaseEnterText') + item.name">
          <el-option v-for="(select, i) in item.options" v-show="item.options" :key="i" :label="select" :value="select" />
        </el-select>
        <el-checkbox-group v-if="item.controlType === 'CHECKBOX'" v-model="basicForm.attributes[item.attributeId]">
          <el-checkbox v-for="(select, i) in item.options" v-show="item.options" :key="i" :label="select" :value="select" />
        </el-checkbox-group>
      </el-form-item> -->
    </etm-form>
  </div>
</template>
<script>
import { getAttribute } from '@/api/sacc'
import { uploadFile, getUploadFilePrefix } from '@/api/base'
import EtmFontIcon from '@/components/EtmFontIcon/index'

export default {
  components: {
    EtmFontIcon
  },
  props: {
    // eslint-disable-next-line vue/require-default-prop
    content: {
      type: Array
    },
    modify: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  data() {
    const _this = this
    return {
      basicForm: {
        name: '', // 会员姓名
        contacts: [ // 保存联系人信息
          {
            contactTypeId: undefined,
            name: '',
            phone: ''
          }
        ],
        district: {
          province: '',
          city: '',
          area: ''
        },
        birthday: '', // 出生日期
        address: '', // 家庭地址
        gender: undefined, // 性别
        attributes: {}, // 保存自定义字段的信息
        icon: '', // 头像
        remark: ''
      },
      rules: {
        name: [
          { required: true, message: _this.$t('memberManage.basicFormNamePlaceHolderText'), trigger: 'blur' }
        ],
        gender: [
          { required: true, message: _this.$t('memberManage.basicFormGenderPlaceHolderText'), trigger: 'blur' }
        ],
        // icon: [
        //   { required: true, message: '请上传头像', trigger: 'blur' }
        // ],
        birthday: [
          { required: true, message: _this.$t('memberManage.basicFormBirthdayPlaceHolderText'), trigger: 'blur' }
        ],
        contacts: [
          { required: true, trigger: 'blur', validator: function(rule, value, callback) {
            value.forEach(v => {
              // eslint-disable-next-line no-empty
              if (v.contactTypeId && v.name && v.phone) {
                if (!/^1\d{10}$/.test(v.phone.trim())) {
                  callback(new Error(_this.$t('memberManage.completePhoneTip')))
                }
              } else {
                callback(new Error(_this.$t('memberManage.completeContactTip')))
              }
            })
            callback()
          } }
        ],
        district: [
          { required: true, trigger: 'blur', validator: function(rule, value, callback) {
            if (value.province && value.city && value.area) {
              callback()
            } else {
              callback(new Error('请完整填写信息'))
            }
          } }
        ],
        default: [
          { required: true, message: _this.$t('memberManage.requiredItemText'), trigger: 'blur' }
        ]
      },
      formItems: [],
      prefix: ''
    }
  },
  watch: {
    basicForm: {
      handler() {
        this.$refs.basicForm.$children[0].validate(valid => {
          this.$store.commit('memberManageNeuroo/SET_BASIC', valid)
          this.$refs.basicForm.$children[0].clearValidate()
        })
      },
      deep: true
    },
    modify: {
      handler(v) {
        const { attributes, contacts } = v
        this.basicForm.contacts = contacts
        attributes.forEach(v => {
          if (v.entityType === 'BASIC') {
            if (v.fieldName === 'birthday') {
              const date = new Date(v.dateValue)
              const year = date.getFullYear() + ''
              const month = ('0' + (date.getMonth() + 1 + '')).slice(-2)
              const day = ('0' + (date.getDate() + '')).slice(-2)
              this.basicForm[v.fieldName] = `${year}-${month}-${day}`
            } else {
              this.basicForm[v.fieldName] = v.textValue
            }
          }
          if (v.entityType === 'EAV') {
            this.basicForm.attributes[v.attributeId] = v.textValue
          }
        })
      },
      immediate: true
    }
  },
  created() {
    getAttribute().then(res => {
      const { data } = res
      this.formItems = data.filter(v => {
        return v.entityType === 'EAV'
      })
    // eslint-disable-next-line handle-callback-err
    }).catch(err => {
      this.$message.error(this.$t('memberManage.getFormContentFailTip'))
    })
    getUploadFilePrefix().then(res => {
      this.prefix = res
    }).catch(err => {
      console.log(err)
    })
  },
  methods: {
    handleContact(i) {
      if (i) {
        // 删除当前联系人
        this.basicForm.contacts.splice(i, 1)
      } else {
        // 添加一个联系人
        this.basicForm.contacts.push({
          contactTypeId: undefined,
          name: '',
          phone: ''
        })
      }
    },
    beforeAvatarUpload(file) {
      const isJPG = file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'image/gif'
      const isLt2M = file.size / 1024 / 1024 < 2
      if (!isJPG) {
        this.$message.error(this.$t('memberManage.avatarImageTypeTip'))
      }
      if (!isLt2M) {
        this.$message.error(this.$t('memberManage.avatarImageSizeTip'))
      }
      return isJPG && isLt2M
    },
    upLoadAvatar(object) {
      const file = object.file
      const fileName = 'memberManageNeuroo'
      uploadFile(file, fileName, 'avatar').then(res => {
        this.basicForm.icon = this.prefix + res.data.key
        this.$message({
          type: 'success',
          message: this.$t('memberManage.uploadAvatarSuccessTip')
        })
      }).catch(err => {
        this.$message.error(this.$t('memberManage.uploadAvatarFailTip'))
        console.log(err)
      })
    },
    disabledDateFunc(time) {
      return time.getTime() >= Date.now()
    }
  }
}
</script>

<style scoped lang="scss">
.basic {
  & >>> .el-input__inner {
    height: 34px;
    line-height: 34px;
  }
  & >>> .el-form-item {
    margin-bottom: 24px;
  }
  height: calc(100vh - 234px);
  overflow-y: auto;
  & >>> .el-input {
    width: 560px!important;
  }
  .avatar {
    display: flex;
    & >>> .el-avatar {
      img {
        width: 100%;
      }
    }
    .changeAvatar {
      margin-left: 16px;
      span {
        display: inline-block;
        cursor: pointer;
        width: 85px;
        height: 34px;
        line-height: 34px;
        text-align: center;
        font-size: 14px;
        border-radius: 2px;
        border: 1px dashed;
        @include bc_control_color();
        @include c_title_color();
      }
      p {
        font-size: 12px;
        @include c_text_color();
        line-height: 1;
      }
    }
  }
  .contact {
    font-size: 0;
    & >>> .el-input {
      width: 176px!important;
      margin-right: 16px;
    }
    & >>> .el-input+.el-input {
      margin-left: 0;
    }
    i {
      font-size: 12px;
      cursor: pointer;
    }
  }
  & >>> .el-textarea__inner {
    padding: 5px 10px;
  }
}
</style>
