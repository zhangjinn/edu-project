<template>
  <div class="basic">
    <etm-form ref="basicForm" :rules="rules" :model="basicForm">
      <el-form-item :label="$t('memberManage.basicFormLabelIcon') + ':'" prop="avatar">
        <div class="avatar">
          <etm-upload-avatar
            v-model="basicForm.avatar"
            :resource-name="'memberManageNeuroo'"
            media-type="image"
            @success="success"
          />
        </div>
      </el-form-item>
      <el-form-item :label="$t('memberManage.basicFormLabelName') + ':'" prop="name">
        <el-input v-model="basicForm.name" :placeholder="$t('memberManage.basicFormNamePlaceHolderText')" />
      </el-form-item>
      <el-form-item :label="$t('memberManage.basicFormLabelContacts') + ':'" prop="contacts">
        <div v-for="(item, index) in basicForm.contacts" :key="index" class="contact">
          <el-select v-model="item.relationship" :placeholder="$t('memberManage.basicFormContactPlaceHolderText')">
            <el-option label="爸爸" value="爸爸" />
            <el-option label="妈妈" value="妈妈" />
          </el-select>
          <el-input v-model="item.name" :placeholder="$t('memberManage.basicFormNamePlaceHolderText')" />
          <el-input v-model="item.telephone" :placeholder="$t('memberManage.basicFormPhonePlaceHolderText')" />
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
          <el-select v-model="basicForm.district.province" placeholder="请选择省份" @change="changeProvince">
            <el-option v-for="(p, i) in provinceList" :key="i" :label="p.name" :value="p.code" />
          </el-select>
          <el-select v-model="basicForm.district.city" :disabled="!basicForm.district.province" placeholder="请选择城市" @change="changeCity">
            <el-option v-for="(c, i) in cityList" :key="i" :label="c.name" :value="c.code" />
          </el-select>
          <el-select v-model="basicForm.district.area" :disabled="!basicForm.district.province || !basicForm.district.city" placeholder="请选择区域">
            <el-option v-for="(a, i) in areaList" :key="i" :label="a.name" :value="a.code" />
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
    </etm-form>
  </div>
</template>
<script>
import { queryDistrictList } from '@/api/neuroo/memberManage'
import { getUploadFilePrefix } from '@/api/base'
import EtmFontIcon from '@/components/EtmFontIcon/index'
import EtmUploadAvatar from '@/components/EtmUploadAvatar'

export default {
  components: {
    EtmFontIcon,
    EtmUploadAvatar
  },
  props: {
    // eslint-disable-next-line vue/require-default-prop
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
            relationship: '',
            name: '',
            telephone: ''
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
        avatar: '', // 头像
        remark: ''
      },
      rules: {
        name: [
          { required: true, message: _this.$t('memberManage.basicFormNamePlaceHolderText') }
        ],
        birthday: [
          { required: true, message: _this.$t('memberManage.basicFormBirthdayPlaceHolderText') }
        ],
        contacts: [
          { required: true, validator: function(rule, value, callback) {
            value.forEach(v => {
              // eslint-disable-next-line no-empty
              if (v.relationship && v.name && v.telephone) {
                if (!/^1\d{10}$/.test(v.telephone.trim())) {
                  callback(new Error(_this.$t('memberManage.completePhoneTip')))
                }
              } else {
                callback(new Error(_this.$t('memberManage.completeContactTip')))
              }
            })
            callback()
          } }
        ],
        // district: [
        //   { required: true, validator: function(rule, value, callback) {
        //     if (value.province && value.city && value.area) {
        //       callback()
        //     } else {
        //       callback(new Error('请完整填写信息'))
        //     }
        //   } }
        // ],
        default: [
          { required: true, message: _this.$t('memberManage.requiredItemText'), trigger: 'blur' }
        ]
      },
      formItems: [],
      prefix: '',
      provinceList: [],
      cityList: [],
      areaList: []
    }
  },
  watch: {
    modify: {
      handler(v) {
        const { customerInfo, parentInfoList } = v
        if (!customerInfo && !parentInfoList) {
          return
        }
        this.basicForm = {
          name: customerInfo.name,
          contacts: [...parentInfoList],
          district: {
            province: customerInfo.provinceCode ? customerInfo.provinceCode + '' : '',
            city: customerInfo.cityCode ? customerInfo.cityCode + '' : '',
            area: customerInfo.areaCode ? customerInfo.areaCode + '' : ''
          },
          birthday: new Date(customerInfo.birthday),
          address: customerInfo.address,
          gender: customerInfo.gender,
          avatar: customerInfo.avatar,
          remark: customerInfo.remark
        }
        Promise.all([
          queryDistrictList(),
          queryDistrictList(customerInfo.provinceCode),
          queryDistrictList(customerInfo.cityCode)
        ]).then(arr => {
          this.provinceList = arr[0].data
          this.cityList = arr[1].data
          this.areaList = arr[2].data
        }).catch(err => {
          console.log(err)
        })
      },
      immediate: true
    }
  },
  created() {
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
    success(val, key, url) {
      this.basicForm.avatar = url
      this.basicForm.commitAvatar = key
    },
    disabledDateFunc(time) {
      return time.getTime() >= Date.now()
    },
    changeProvince(p) {
      if (!p) return
      this.basicForm.district.city = ''
      this.basicForm.district.area = ''
      this.cityList = []
      this.areaList = []
      queryDistrictList(p).then(res => {
        this.cityList = res.data
      }).catch(err => {
        console.log(err)
      })
    },
    changeCity(c) {
      if (!c) return
      this.basicForm.district.area = ''
      this.areaList = []
      queryDistrictList(c).then(res => {
        this.areaList = res.data
      }).catch(err => {
        console.log(err)
      })
    }
  }
}
</script>

<style scoped lang="scss">
.basic {
  /*height: calc(100vh - 234px);*/
  /*overflow-y: auto;*/
  & >>> .el-form {
    max-width: 100%!important;
  }
  & >>> .el-input__inner {
    height: 34px;
    line-height: 34px;
  }
  & >>> .el-form-item {
    margin-bottom: 24px;
  }

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
