<template>
  <div class="basic">
    <etm-form ref="basicForm" :rules="rules" :model="basicForm">
      <el-form-item :label="$t('memberManage.basicFormLabelIcon') + ':'" prop="icon">
        <div class="avatar">
          <etm-upload-avatar
            v-model="basicForm.icon"
            :resource-name="'memberManageV2'"
            media-type="image"
            @success="success"
          />
        </div>
      </el-form-item>
      <el-form-item label="会员姓名（中文）:" prop="name">
        <el-input v-model="basicForm.name" placeholder="请输入中文名" />
      </el-form-item>
      <el-form-item label="会员姓名（英文）:">
        <el-input v-model="basicForm.englishName" placeholder="请输入英文名" />
      </el-form-item>
      <el-form-item :label="$t('memberManage.basicFormLabelGender') + ':'" prop="gender">
        <el-radio-group v-model="basicForm.gender">
          <el-radio label="MALE">{{ $t('memberManage.basicFormGenderMale') }}</el-radio>
          <el-radio label="FEMALE">{{ $t('memberManage.basicFormGenderFemale') }}</el-radio>
        </el-radio-group>
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
      <el-form-item :label="$t('memberManage.basicFormLabelContacts') + ':'" prop="contacts">
        <div v-for="(item, index) in basicForm.contacts" :key="index" class="contact">
          <el-select v-model="item.contactTypeId" :placeholder="$t('memberManage.basicFormContactPlaceHolderText')">
            <el-option v-for="(c, cindex) in contactsList" :key="cindex" :label="c.value" :value="c.id" />
          </el-select>
          <el-input v-model="item.name" :placeholder="$t('memberManage.basicFormNamePlaceHolderText')" />
          <el-input v-model="item.phone" :placeholder="$t('memberManage.basicFormPhonePlaceHolderText')" />
          <EtmFontIcon :name="index === 0 ? 'plus' : 'minus'" @click.native.stop="handleContact(index)" />
          <etm-text @click.stop="switchReceiver(index)">{{ item.isReceiver ? '取消接送人' : '设为接送人' }}</etm-text>
        </div>
      </el-form-item>

      <el-form-item label="地区:" prop="district">
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

      <el-form-item label="详细地址:">
        <el-input v-model="basicForm.address" placeholder="请输入详细地址" />
      </el-form-item>

      <el-form-item label="班级:">
        <el-select v-model="basicForm.clazzId" placeholder="请选择班级">
          <el-option v-for="(clazz, index) in classList" :key="index" :label="clazz.clazzName" :value="clazz.clazzId" />
        </el-select>
      </el-form-item>

    </etm-form>
  </div>
</template>
<script>
import { getUploadFilePrefix } from '@/api/base'
import { queryAreaListByCode } from '@/api/base/base'
import { getClassList, getContactType } from '@/api/memberManageV2'
import EtmFontIcon from '@/components/EtmFontIcon/index'
import EtmUploadAvatar from '@/components/EtmUploadAvatar'

export default {
  components: {
    EtmFontIcon,
    EtmUploadAvatar
  },
  props: {
    // eslint-disable-next-line vue/require-default-prop
    content: {
      type: Array
    },
    modify: {
      type: Object,
      required: true
    }
  },
  data() {
    const _this = this
    return {
      basicForm: {
        name: '',
        englishName: '',
        contacts: [
          {
            contactTypeId: undefined,
            name: '',
            phone: ''
          }
        ],
        birthday: '',
        address: '',
        gender: undefined,
        icon: '',
        submitIcon: '',
        district: {
          province: '',
          city: '',
          area: ''
        },
        clazzId: ''
      },
      rules: {
        name: [
          { required: true, message: _this.$t('memberManage.basicFormNamePlaceHolderText') }
        ],
        gender: [
          { required: true, message: _this.$t('memberManage.basicFormGenderPlaceHolderText') }
        ],
        birthday: [
          { required: true, message: _this.$t('memberManage.basicFormBirthdayPlaceHolderText') }
        ],
        contacts: [
          { required: true, validator: function(rule, value, callback) {
            Array.isArray(value) && value.forEach(v => {
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
          { required: true, message: _this.$t('memberManage.requiredItemText') }
        ]
      },
      prefix: '',
      provinceList: [],
      cityList: [],
      areaList: [],
      classList: [],
      contactsList: []
    }
  },
  computed: {
    formMethod() {
      return this.$store.state.memberManageV2.method
    }
  },
  watch: {
    basicForm: {
      handler() {
        this.$refs.basicForm.$children[0].validate(valid => {
          this.$store.commit('memberManageV2/SET_BASIC', valid)
          this.$refs.basicForm.$children[0].clearValidate()
        })
      },
      deep: true
    },
    modify: {
      handler(v) {
        if (this.$store.state.memberManageV2.method === 'modify') {
          if (v.area === null) v.area = {}
          this.basicForm = {
            name: v.name,
            englishName: v.englishName,
            contacts: v.contactList,
            birthday: new Date(v.birthday),
            address: v.address,
            gender: v.gender,
            icon: v.icon,
            district: {
              province: v.area.provinceCode || '',
              city: v.area.cityCode || '',
              area: v.area.countyCode || ''
            },
            clazzId: v.clazzId
          }
          if (this.formMethod === 'modify') {
            if (!this.basicForm.district.province) {
              queryAreaListByCode({}).then(res => {
                this.provinceList = res.data
                this.cityList = []
                this.areaList = []
              }).catch(err => {
                console.log(err)
              })
            } else {
              Promise.all([
                queryAreaListByCode({}),
                queryAreaListByCode({ code: this.basicForm.district.province }),
                queryAreaListByCode({ code: this.basicForm.district.city })
              ]).then(arr => {
                this.provinceList = arr[0].data
                this.cityList = arr[1].data
                this.areaList = arr[2].data
              }).catch(err => {
                console.log(err)
              })
            }
          }
        }
      },
      immediate: true
    }
  },
  created() {
    getClassList().then(res => {
      this.classList = res.data
    }).catch(err => {
      console.log(err)
    })

    getContactType('CONTACTS').then(res => {
      this.contactsList = res.data
    }).catch(err => {
      console.log(err)
    })

    // 获取上传头像地址前缀
    getUploadFilePrefix().then(res => {
      this.prefix = res
    }).catch(err => {
      console.log(err)
    })

    // 获取省市区列表内容
    if (this.formMethod === 'add') {
      queryAreaListByCode({}).then(res => {
        this.provinceList = res.data
      }).catch(err => {
        console.log(err)
      })
    }
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
      this.basicForm.icon = url
      this.basicForm.submitIcon = key
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
      queryAreaListByCode({ code: p }).then(res => {
        this.cityList = res.data
      }).catch(err => {
        console.log(err)
      })
    },
    changeCity(c) {
      if (!c) return
      this.basicForm.district.area = ''
      this.areaList = []
      queryAreaListByCode({ code: c }).then(res => {
        this.areaList = res.data
      }).catch(err => {
        console.log(err)
      })
    },
    switchReceiver(index) {
      const { contacts } = this.basicForm
      if (contacts[index].isReceiver) {
        // 取消接送人(至少有一个接送人)
        let showTip = true
        for (let i = 0; i < contacts.length; i++) {
          if (contacts[i].isReceiver && i !== index) {
            showTip = false
            break
          }
        }
        if (showTip) {
          return this.$message.warning('最少保留一个接送人')
        }
      }
      contacts[index].isReceiver = !contacts[index].isReceiver
    }
  }
}
</script>

<style scoped lang="scss">
.basic {
  & >>> .el-form {
    width: 100%!important;
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
  & >>> .EtmText-wrap {
    margin-left: 9px;
    @include c_main_color();
  }
}
</style>
