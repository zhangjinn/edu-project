<template>
  <div class="addChildForm-wrap">
    <etm-pop
      :visible="isShow"
      title="添加客户"
      pop="big"
      cancel-btn="取消"
      @cancel="cancel"
      @close="cancel"
      @confirm="confirm"
    >
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
        <el-row>
          <el-col :span="12">
            <el-form-item
              label="客户名称"
              prop="name"
            >
              <el-input v-model="childForm.name" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item
              label="手机号码"
              prop="telephone"
              required
              :rules="{trigger: ['blur'], validator:validatorPhone}"
            >
              <el-input v-model="childForm.telephone" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item
              label="出生日期"
              prop="birthday"
            >
              <el-date-picker
                v-model="childForm.birthday"
                type="date"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
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
          </el-col>
        </el-row>
        <el-form-item label="所属地区">
          <etm-address
            v-model="childForm.areaCode"
            :area-id="childForm.areaCode"
            @change="areaChange"
          />
        </el-form-item>
        <el-form-item label="详细地址">
          <el-input
            v-model="childForm.address"
            placeholder="请输入详细地址"
          />
        </el-form-item>

        <etm-title>附加信息</etm-title>

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
        <el-row>
          <el-col :span="12">
            <el-form-item
              label="微信号码"
              prop="wechat"
            >
              <el-input
                v-model="childForm.wechat"
                placeholder="请输入微信号"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item
              label="QQ号码"
              prop="qq"
            >
              <el-input
                v-model="childForm.qq"
                placeholder="请输入QQ号"
              />
            </el-form-item>
          </el-col>
        </el-row>

        <etm-title>跟进信息</etm-title>
        <el-row>
          <el-col :span="12">
            <el-form-item
              label="跟进人员"
              prop="counselor"
            >
              <el-select v-model="childForm.counselor">
                <el-option
                  v-for="(item, index) in allUser"
                  :key="index"
                  :label="item.name"
                  :value="item.id"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
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
          </el-col>

          <el-col :span="12">
            <el-form-item
              label="客户状态"
              prop="state"
            >
              <el-select v-model="childForm.state">
                <el-option
                  v-for="(item, index) in settingType[type === 'UNSOLD' ? 'NOT_DEAL_STATE' : 'DEAL_STATE']"
                  :key="index"
                  :label="item.label"
                  :value="item.label"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
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
          </el-col>

          <el-col :span="12">
            <el-form-item
              label="客户来源"
              prop="source"
            >
              <!--              <el-select v-model="childForm.source">-->
              <!--                <el-option v-for="(item, index) in settingType['SOURCE']" :key="index" :label="item.label" :value="item.label" />-->
              <!--              </el-select>-->
              <el-cascader
                v-model="childForm.source"
                :options="settingType['SOURCE']"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
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
          </el-col>

          <el-col
            v-for="(item, index) in childForm.customFields"
            :key="item.dictValueId"
            :span="12"
          >
            <el-form-item
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
          </el-col>
        </el-row>
      </etm-form>
    </etm-pop>
  </div>
</template>

<script>
import {
  createCustomer,
  querySettingType,
  queryCustomerFields
} from '@/api/customer'

import formValidate from '@/utils/rules'
import { uploadFile } from '@/api/base'
import { validPhoneNumber } from '@/utils/validate'
import EtmAddress from '@/views/base/org/EtmAddress'
import baseMixin from '@/layout/mixin/baseMixin'
import { queryEmployeeSelectAll } from '@/api/employee'
import { getEmployee } from '../../common'

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
    type: {
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
      isShow: false,
      customerFields: [],
      currContactsId: 1,
      relationMap: {},
      allUser: [],
      uploadFile: uploadFile,
      validatorPhone: validatorPhone,
      // validatorCard: validatorCard,
      settingType: {
        MARK: [], // 标签
        RELATIONSHIP: [], // 联系人称呼
        SOURCE: [], // 来源
        IMPORTANT_LEVEL: [], // 重要程度
        NOT_DEAL_STATE: [],
        DEAL_STATE: [] // 客户状态
        // 'SALES_STAGE': [], // 销售阶段
        // 'FOLLOW_WAY': [] // 跟进方式
      },
      childForm: {
        birthday: null,
        qq: '',
        address: '',
        gender: null,
        city: '',
        customFields: [],
        areaCode: null,
        wechat: '',
        importantLevel: '',
        telephone: '',
        avatar: '',
        source: [],
        currentOrganizationId: '',
        marketer: '',
        counselor: '',
        currentEmployeeId: '',
        province: '',
        name: '',
        state: '',
        region: '',
        contacts: [{
          contactTelephone: null,
          contactName: '',
          contactRelationship: null
        }],
        mark: ''
      },
      childRules: {
        name: [
          { required: true, message: '请输入学员姓名', trigger: 'blur' }
        ]
      }
    }
  },
  computed: {},
  watch: {
    isShow: {
      handler (n) {
        if (n) {
          this.init()
        }
      }
    }
  },
  created () {
    queryEmployeeSelectAll().then(res => {
      this.allUser = res.data
    })
  },
  mounted () {

  },
  methods: {
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
    cancel () {
      this.hide()
    },
    confirm () {
      this.$refs.etmForm.$children[0].validate(valid => {
        if (valid) {
          const contacts = this.childForm.contacts.filter(cur => {
            return cur.contactTelephone && cur.contactName && cur.contactRelationship
          })

          const result = Object.assign({}, this.childForm)
          result.source = result.source || []
          result.contacts = contacts
          result.mark = (result.mark || []).join(',')
          result.deal = this.type === 'DEAL'
          result.source = result.source.length ? result.source[1] : null

          createCustomer(result).then(res => {
            this.$nextTick(() => {
              this.$message.success('客户添加成功')
              this.hide()
              this.$emit('success', {})
            })
          })
        }
      })
    },
    init () {
      this.getSettingType()
      this.childForm.counselor = getEmployee().employeeId
      queryCustomerFields().then(res => {
        const result = []
        const data = (res.data || [])

        data.forEach(cur => {
          result.push({
            controlType: cur.controlType,
            description: cur.description,
            dictTypeId: cur.id,
            mandatory: cur.mandatory,
            key: cur.key,
            name: cur.name,
            options: cur.options,
            value: null
          })
        })
        this.childForm.customFields = result
      })
    },
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
    show () {
      this.isShow = true
    },
    hide () {
      this.isShow = false
      this.childForm = {
        birthday: null,
        qq: '',
        address: '',
        gender: null,
        areaCode: null,
        city: '',
        customFields: [],
        wechat: '',
        importantLevel: '',
        telephone: '',
        avatar: '',
        source: [],
        currentOrganizationId: '',
        marketer: '',
        counselor: '',
        currentEmployeeId: '',
        province: '',
        name: '',
        state: '',
        region: '',
        contacts: [{
          contactTelephone: null,
          contactName: '',
          contactRelationship: null
        }],
        mark: ''
      }
      this.$refs.etmForm.$children[0].resetFields()
    },

    uploadSuccess (hash, url) {
      this.childForm.avatar = url
    }
  }
}
</script>
<style lang="scss" scoped>

::v-deep{
  .el-row{
    .el-col{
      width: calc(50% - 8px);

      &:nth-of-type(even){
        margin-left: 16px;
      }
    }
  }

  .contact {
    display: flex;
    flex-wrap: wrap;
    align-items: center;

       > .el-form-item {
        width: 31%;
        margin-bottom: 0;

      }

      > div:not(:last-child) {
        margin-right: 10px;
      }

  }
}

.addChildForm-wrap {

}
</style>
