<template>
  <div class="addChildForm-wrap">
    <etm-form
      ref="etmForm"
      type="dialog"
      :model="childForm"
      :rules="childRules"
    >
      <etm-title>基础信息</etm-title>
      <el-form-item label="头像">
        <etm-upload-avatar
          v-model="childForm.avatar"
          resource-name="customer/listCustomer/myCustomer/avatar"
          media-type="image"
          :upload-file="uploadFile"
          @success="uploadSuccess"
        />
      </el-form-item>
      <el-form-item
        label="客户名称"
        prop="name"
      >
        <el-input v-model="childForm.name" />
      </el-form-item>
      <el-form-item
        label="手机号码"
        prop="telephone"
      >
        <el-input v-model="childForm.telephone" />
      </el-form-item>
      <el-form-item
        label="客户性别"
        prop="gender"
      >
        <el-select v-model="childForm.gender">
          <el-option
            label="男"
            value="MALE"
          />
          <el-option
            label="女"
            value="FEMALE"
          />
        </el-select>
      </el-form-item>
      <el-form-item
        label="出生日期"
        prop="birthday"
      >
        <el-date-picker
          v-model="childForm.birthday"
          type="date"
          value-format="yyyy-MM-dd"
        />
      </el-form-item>
      <el-form-item
        label="所属地区"
        prop="areaCode"
      >
        <etm-address
          v-model="childForm.areaCode"
          :area-id="childForm.areaCode"
          @change="areaChange"
        />
      </el-form-item>
      <el-form-item
        label="详细地址"
        prop="address"
      >
        <el-input
          v-model="childForm.address"
          placeholder="请输入详细地址"
        />
      </el-form-item>

      <etm-title>附加信息</etm-title>
      <el-form-item
        label="微信号码"
        prop="wechat"
      >
        <el-input
          v-model="childForm.wechat"
          placeholder="请输入微信号"
        />
      </el-form-item>
      <el-form-item
        label="QQ号码"
        prop="qq"
      >
        <el-input
          v-model="childForm.qq"
          placeholder="请输入QQ号"
        />
      </el-form-item>
      <el-form-item
        label="联系人"
        prop="contacts"
      >
        <div
          v-for="(item, index) in childForm.contacts"
          :key="index"
          class="contact"
        >
          <el-form-item>
            <el-select v-model="childForm.contacts[index].contactRelationship">
              <el-option
                v-for="(item, index) in settingType['RELATIONSHIP']"
                :key="index"
                :label="item.label"
                :value="item.label"
              />
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-input
              v-model="childForm.contacts[index].contactName"
              placeholder="请输入联系人姓名"
            />
          </el-form-item>
          <el-form-item>
            <el-input
              v-model="childForm.contacts[index].contactTelephone"
              placeholder="请输入联系人电话号码"
              @input="checkoutPhone($event, index)"
            />
          </el-form-item>
          <etm-font-icon
            v-if="index === 0"
            style="margin-bottom: 16px;"
            name="plus"
            @click.native="addContact"
          />
          <etm-font-icon
            v-else
            style="margin-bottom: 16px;"
            name="minus"
            @click.native="removeContact(index)"
          />
        </div>
      </el-form-item>

      <etm-title>跟进信息</etm-title>

      <el-form-item
        label="跟进人员"
        prop="counselor"
      >
        <!--        <el-select v-model="childForm.counselor">-->
        <!--          <el-option v-for="(item, index) in allUser" :key="index" :label="item.name" :value="item.id" />-->
        <!--        </el-select>-->
        {{ childForm.counselor }}
      </el-form-item>
      <el-form-item
        label="市场人员"
        prop="marketer"
      >
        <el-select v-model="childForm.marketer">
          <el-option
            v-for="(item, index) in allUser"
            :key="index"
            :label="item.name"
            :value="item.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item
        label="客户状态"
        prop="state"
      >
        <el-select v-model="childForm.state">
          <el-option
            v-for="(item, index) in settingType[childType === 'UNSOLD' ? 'NOT_DEAL_STATE' : 'DEAL_STATE']"
            :key="index"
            :label="item.label"
            :value="item.label"
          />
        </el-select>
      </el-form-item>
      <el-form-item
        label="重要程度"
        prop="importantLevel"
      >
        <el-select v-model="childForm.importantLevel">
          <el-option
            v-for="(item, index) in settingType['IMPORTANT_LEVEL']"
            :key="index"
            :label="item.label"
            :value="item.label"
          />
        </el-select>
      </el-form-item>
      <el-form-item
        label="客户来源"
        prop="source"
      >
        <!--        <el-select v-model="childForm.source">-->
        <!--          <el-option v-for="(item, index) in settingType['SOURCE']" :key="index" :label="item.label" :value="item.label" />-->
        <!--        </el-select>-->
        <el-cascader
          v-model="childForm.source"
          :options="settingType['SOURCE']"
        />
      </el-form-item>
      <el-form-item
        label="标签"
        prop="mark"
      >
        <el-select
          v-model="childForm.mark"
          multiple
        >
          <el-option
            v-for="(item, index) in settingType['MARK']"
            :key="index"
            :label="item.label"
            :value="item.label"
          />
        </el-select>
      </el-form-item>

      <el-form-item
        v-for="(item, index) in childForm.customFields"
        :key="item.dictValueId"
        :label="item.name"
        :prop="`customFields.${index}.value`"
        :rules="formValidate.nullValueRule(item.mandatory, item.description)"
      >
        <el-input
          v-if="item.controlType === 'INPUT_BOX'"
          v-model="item.value"
        />

        <el-date-picker
          v-else-if="item.controlType === 'DATE'"
          v-model="item.value"
          value-format="yyyy-MM-dd"
        />

        <el-select
          v-else
          v-model="item.value"
        >
          <el-option
            v-for="(i, k) in item.options"
            :key="k"
            :label="i.label"
            :value="i.label"
          />
        </el-select>
      </el-form-item>
    </etm-form>
  </div>
</template>

<script>
import { uploadFile } from '@/api/base'
import { validPhoneNumber } from '@/utils/validate'
import EtmAddress from '@/views/base/org/EtmAddress'
import baseMixin from '@/layout/mixin/baseMixin'
import {
  // createCustomer,
  querySettingType,
  queryCustomerDetail,
  updateCustomer, queryCustomerFields
} from '@/api/customer'
import { queryEmployeeSelectAll } from '@/api/employee'
import { parseTime } from '@/utils'
import formValidate from '@/utils/rules'
export default {
  name: 'AddChildForm',
  components: { EtmAddress },
  filters: {},
  mixins: [baseMixin],
  props: {
    childId: {
      type: [String, Number],
      default: ''
    },
    childType: {
      type: String,
      default: ''
    },
    edit: {
      type: Boolean,
      default: false
    }
  },
  data () {
    const validatorPhone = (rule, value, cb) => {
      if (!value) {
        return cb(new Error('手机号码不能为空'))
      }
      if (!validPhoneNumber(value)) {
        return cb(new Error('手机号码不正确'))
      }
      return cb()
    }

    return {
      formValidate,
      childForm: {
        address: '',
        avatar: '',
        birthday: null,
        city: '',
        contacts: [{
          contactTelephone: null,
          contactName: '',
          contactRelationship: null
        }],
        counselor: '',
        customFields: [],
        gender: null,
        importantLevel: '',
        mark: '',
        marketer: '',
        marketerId: '',
        name: '',
        province: '',
        qq: '',
        region: '',
        source: '',
        state: '',
        telephone: '',
        wechat: ''
      },
      settingType: {
        MARK: [], // 标签
        RELATIONSHIP: [], // 联系人称呼
        SOURCE: [], // 来源
        IMPORTANT_LEVEL: [], // 重要程度
        DEAL_STATE: [], // 客户状态
        NOT_DEAL_STATE: []
      },
      allUser: [],
      userCardType: [],
      currContactsId: 1,
      relationMap: {},
      uploadFile: uploadFile,
      validatorPhone: validatorPhone,

      childRules: {
        name: [
          { required: true, message: '请输入学员姓名', trigger: 'blur' }
        ]
      }
    }
  },
  computed: {},
  watch: {},
  created () {
    queryEmployeeSelectAll().then(res => {
      this.allUser = res.data
    })
  },
  mounted () {
    this.init()
    this.getSettingType()
  },
  methods: {
    getSettingType () {
      const allSetting = Object.keys(this.settingType).map(cur => {
        return new Promise(resolve => {
          querySettingType(cur).then(res => {
            resolve({ name: cur, list: res.data.options || [] })
          })
        })
      })

      Promise.all(allSetting).then(res => {
        res.forEach(cur => {
          if (cur.name === 'SOURCE') {
            const source = []
            cur.list.forEach(cur => {
              const result = {
                children: [],
                value: cur.id,
                label: cur.label
              }
              result.children = cur.child.map(c => {
                return {
                  value: c.id,
                  label: c.label
                }
              })
              source.push(result)
            })
            this.settingType[cur.name] = source
          } else {
            this.settingType[cur.name] = cur.list
          }
        })
      })
    },
    init () {
      if (!this.childId) {
        return false
      }
      queryCustomerDetail(this.childId).then(res => {
        queryCustomerFields().then(r => {
          const custom = {}
          res.data.customFields.forEach(cur => {
            custom[cur.key] = cur
          })

          const customFields = r.data.map(cur => {
            cur.dictValueId = custom[cur.key].dictValueId
            cur.value = custom[cur.key].value
            cur.dictTypeId = cur.id

            return cur
          })

          const result = res.data
          result.mark = result.mark ? result.mark.split(',') : []
          result.birthday = result.birthday ? parseTime(result.birthday, '{y}-{m}-{d}') : ''
          result.areaCode = result.region
          result.marketer = result.marketerId
          result.contacts = result.contacts.length ? result.contacts : [{
            contactTelephone: null,
            contactName: '',
            contactRelationship: null
          }]

          result.customFields = customFields
          this.$set(this, 'childForm', result)
        })
      })
    },

    relationChange (event, index) {
      console.log(event, index)
    },
    uploadSuccess (hash, url) {
      this.childForm.avatar = url
    },
    areaChange (e) {
      this.childForm.province = e.province
      this.childForm.city = e.city
      this.childForm.region = e.area
    },
    checkoutPhone (e, index) {
      if (e.indexOf(1) !== 0) {
        this.childForm.contacts[index].contactTelephone = ''
      } else if (/^\d{12,}$/.test(e)) {
        this.childForm.contacts[index].contactTelephone = (`${e}`).substr(0, 11)
      } else {
        this.childForm.contacts[index].contactTelephone = e.replace(/[^\d]+/, '')
      }
    },

    removeContact (index) {
      this.childForm.contacts.splice(index, 1)
    },
    addContact () {
      this.childForm.contacts.push({
        contactTelephone: null,
        contactName: '',
        contactRelationship: null
      })
    },
    submit () {
      return new Promise(resolve => {
        this.$refs.etmForm.$children[0].validate(valid => {
          if (valid) {
            const contacts = this.childForm.contacts.filter(cur => {
              return cur.contactTelephone && cur.contactName && cur.contactRelationship
            })

            const result = Object.assign({}, this.childForm)
            result.source = result.source || []
            result.contacts = contacts
            result.mark = result.mark.join(',')
            result.id = this.childId
            result.gender = result.gender || null
            result.source = result.source.length ? result.source[1] : null

            const params = Object.assign({}, result)
            delete params.counselor

            updateCustomer(params).then(res => {
              // this.$message.success('客户添加成功')
              // this.hide()
              // this.$emit('success', {})
              resolve()
            })
          }
        })
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.addChildForm-wrap {
  .contact {
    display: flex;
    flex-wrap: wrap;

    &:not(:last-child) {
      margin-bottom: 16px;
    }

    ::v-deep {
      > .el-form-item {
        flex: auto;
        width: 100px;
        margin-bottom: 16px !important;

      }

      > * {
        margin-right: 8px;
      }

      .EtmFontIcon-wrap {
        display: flex;
        align-items: center;
        margin-left: 8px;
      }
    }
  }
}
</style>
