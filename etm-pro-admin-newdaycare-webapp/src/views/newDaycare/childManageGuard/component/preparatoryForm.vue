<template>
  <div class="childPreparatory-wrap">
    <etm-form
      ref="form"
      :model="formData"
      :rules="rule"
      type="dialog"
    >
      <etm-title>基本信息</etm-title>
      <el-form-item
        label="幼儿姓名"
        prop="childName"
      >
        <el-input
          v-model="formData.childName"
          placeholder="请输入幼儿姓名"
        />
      </el-form-item>
      <el-form-item
        label="性别"
        prop="gender"
      >
        <el-radio-group v-model="formData.gender">
          <el-radio label="MALE">
            男
          </el-radio>
          <el-radio label="FEMALE">
            女
          </el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item
        label="出生日期"
        prop="birthday"
      >
        <el-date-picker
          v-model="formData.birthday"
          type="date"
          placeholder="请选择出生日期"
          :picker-options="birthdayOptions"
          :clearable="false"
        />
      </el-form-item>
      <el-form-item label="现住地">
        <div class="multipleForm">
          <el-select
            v-model="formData.liveArea.province"
            placeholder="请选择省份"
            @change="getCity($event, 'live', 'change')"
          >
            <el-option
              v-for="(province, i) in provinceList"
              :key="i"
              :label="province.name"
              :value="province.code"
            />
          </el-select>
          <el-select
            v-model="formData.liveArea.city"
            placeholder="请选择市区"
            @change="getCounty($event, 'live', 'change')"
          >
            <el-option
              v-for="(city, i) in liveCityList"
              :key="i"
              :label="city.name"
              :value="city.code"
            />
          </el-select>
          <el-select
            v-model="formData.liveArea.county"
            placeholder="请选择县区"
          >
            <el-option
              v-for="(county, i) in liveCountyList"
              :key="i"
              :label="county.name"
              :value="county.code"
            />
          </el-select>
        </div>
      </el-form-item>
      <el-form-item label="详细地址">
        <el-input
          v-model="formData.currentAddress"
          placeholder="请输入详细地址"
        />
      </el-form-item>
      <el-form-item required>
        <span slot="label">
          <el-tooltip
            effect="light"
            popper-class="stepTips"
            :visible-arrow="false"
            placement="bottom-start"
          >
            <span>联系人<i class="iconfont iconquestion-circle" /></span>
            <div
              slot="content"
              class="contactTip"
            >
              <b>接送卡号输入方式一：</b>
              <div>1.将接送卡读卡器与电脑连接。</div>
              <div>2.将鼠标光标放置卡号输入框内。</div>
              <div>3.将接送卡在读卡器刷卡，卡号成功输入。</div>
              <b>接送卡号输入方式二：</b>
              <div>手动输入接送卡号</div>
            </div>
          </el-tooltip>
        </span>
        <div class="contactBox">
          <div
            v-for="(item, index) in formData.contactList"
            :key="index"
            class="multipleForm contact"
          >
            <el-form-item
              :prop="'contactList.'+ index +'.relationship'"
              :rules="rule.relationship"
            >
              <el-select
                v-model="item.relationship"
                placeholder="联系人关系"
              >
                <el-option
                  v-for="(list, i) in relationList"
                  :key="i"
                  :label="list.label"
                  :value="list.value"
                />
              </el-select>
            </el-form-item>
            <el-form-item
              :prop="'contactList.'+ index +'.name'"
              :rules="rule.name"
            >
              <el-input
                v-model="item.name"
                placeholder="联系人姓名"
              />
            </el-form-item>
            <el-form-item
              :prop="'contactList.'+ index +'.telephone'"
              :rules="rule.telephone"
            >
              <el-input
                v-model="item.telephone"
                placeholder="手机号码"
              />
            </el-form-item>
            <el-form-item class="lastItem">
              <el-input
                v-model="item.attendanceCardNumber"
                placeholder="接送卡号"
              />
            </el-form-item>
            <el-form-item
              v-if="index === 0"
              class="cardItem"
            >
              <el-input
                v-model="item.certificateNumber"
                placeholder="联系人身份证号码"
              />
            </el-form-item>
            <div class="addContact">
              <etm-font-icon
                v-if="index === 0"
                name="plus"
                @click.native="addContact()"
              />
              <etm-font-icon
                v-else
                name="minus"
                @click.native="removeContact(index)"
              />
            </div>
          </div>
        </div>
      </el-form-item>
      <el-form-item label="户口所在地">
        <div class="multipleForm">
          <el-select
            v-model="formData.birthArea.province"
            placeholder="请选择省份"
            @change="getCity($event, 'birth', 'change')"
          >
            <el-option
              v-for="(province, i) in provinceList"
              :key="i"
              :label="province.name"
              :value="province.code"
            />
          </el-select>
          <el-select
            v-model="formData.birthArea.city"
            placeholder="请选择市区"
            @change="getCounty($event, 'birth', 'change')"
          >
            <el-option
              v-for="(city, i) in birthCityList"
              :key="i"
              :label="city.name"
              :value="city.code"
            />
          </el-select>
          <el-select
            v-model="formData.birthArea.county"
            placeholder="请选择县区"
          >
            <el-option
              v-for="(county, i) in birthCountyList"
              :key="i"
              :label="county.name"
              :value="county.code"
            />
          </el-select>
        </div>
      </el-form-item>
      <etm-title>订金信息</etm-title>
      <el-form-item label="收费日期">
        <el-date-picker
          v-model="formData.dateCharge"
          type="date"
          placeholder="请选择收费日期"
          :clearable="false"
        />
      </el-form-item>
      <el-form-item
        label="订金金额"
        prop="money"
      >
        <el-input-number
          v-model="formData.money"
          :min="0"
          placeholder="请输入订金金额"
        />
      </el-form-item>
      <el-form-item
        label="支付方式"
        prop="paymentType"
      >
        <el-select v-model="formData.paymentType">
          <el-option
            v-for="(item, index) of paymentTypes"
            :key="index"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="备注">
        <el-input
          v-model="formData.remark"
          placeholder="请输入备注"
          :maxlength="200"
          type="textarea"
          :rows="4"
        />
      </el-form-item>
    </etm-form>
  </div>
</template>

<script>
import { validPhoneNumber } from '@/utils/validate'
import { getAreaByCode } from '@/api/area'
import { queryPaymentType } from '@/api/newDaycare/contract'
import baseMixin from '@/layout/mixin/baseMixin'

/**
 * childPreparatory create by Administrator
 * createTime 2021/3/11 10:56
 */
export default {
  name: 'ChildPreparatory',
  components: {},
  filters: {},
  mixins: [baseMixin],
  props: {
    formData: {
      type: Object,
      default () {
        return {}
      }
    }
  },
  data () {
    return {
      rule: { // 表单验证规则
        childName: [{ required: true, message: '孩子姓名不能为空', trigger: 'blur' }],
        gender: [{ required: true, message: '性别不能为空', trigger: 'change' }],
        birthday: [{ required: true, message: '出生日期不能为空', trigger: 'change' }],
        relationship: [{ required: true, message: '关系不能为空', trigger: 'change' }],
        name: [{ required: true, message: '姓名不能为空', trigger: 'blur' }],
        telephone: [{
          required: true,
          trigger: 'blur',
          validator: (rule, value, callback) => {
            if (!value) {
              callback(new Error('手机号码不能为空'))
            } else if (!validPhoneNumber(value)) {
              callback(new Error('手机号码格式错误'))
            } else {
              callback()
            }
          }
        }],
        money: [
          { required: true, message: '请输入订金金额', trigger: 'blur' }
        ],
        paymentType: { required: true, message: '请选择支付方式', trigger: 'change' }
      },
      birthdayOptions: { // 日期选择规则：禁选今日之后的日期
        disabledDate (time) {
          return time.getTime() > new Date().getTime()
        }
      },
      relationList: [ // 联系人称呼列表
        {
          label: '爸爸',
          value: 'FATHER'
        },
        {
          label: '妈妈',
          value: 'MOTHER'
        },
        {
          label: '爷爷',
          value: 'GRANDFATHER'
        },
        {
          label: '奶奶',
          value: 'GRANDMOTHER'
        },
        {
          label: '外公',
          value: 'GRANDPA'
        },
        {
          label: '外婆',
          value: 'GRANDMA'
        },
        {
          label: '其他',
          value: 'OTHER'
        }
      ],
      provinceList: [], // 省列表
      liveProvince: '',
      liveCityList: [], // 现住地市列表
      liveCity: '',
      liveCountyList: [], // 现住地区列表
      birthProvince: '',
      birthCityList: [], // 户口地市列表
      birthCity: '',
      birthCountyList: [], // 户口地区列表
      paymentTypes: []
    }
  },
  computed: {},
  watch: {},
  created () {
  },
  mounted () {
    this.getProvince()
    this.getPayment()
  },
  methods: {
    getProvince () {
      getAreaByCode().then(res => {
        this.provinceList = res.data
      })
    },
    getPayment () {
      queryPaymentType().then(res => {
        this.paymentTypes = this.convertDataToOptions(res.data, 'financePayTypeName', 'financePayTypeId')
      })
    },
    addContact () { // 增加联系人
      let flag = false
      // 判断联系人信息是否完善
      this.formData.contactList.forEach(item => {
        if (!item.relationship || !item.name || !item.telephone) {
          flag = true
        }
        if (!validPhoneNumber(item.telephone)) {
          flag = true
        }
      })
      if (flag) {
        this.$message.warning('请完善已有联系人')
        return
      }
      const contact = {
        relationship: '',
        name: '',
        telephone: '',
        attendanceCardNumber: '',
        certificateNumber: ''
      }
      this.formData.contactList.push(contact)
    },
    removeContact (index) { // 删除联系人
      this.formData.contactList.splice(index, 1)
    },
    getCity (value, type, load) { // 根据省获取市区列表
      if (type === 'live') {
        if (this.liveProvince !== value) {
          this.liveProvince = value
          if (load === 'change') {
            this.formData.liveArea.city = ''
            this.formData.liveArea.county = ''
            this.liveCountyList = []
          }
          const param = {
            code: value
          }
          getAreaByCode(param).then(res => {
            const data = res.data
            this.liveCityList = data
          })
        }
      } else {
        if (this.birthProvince !== value) {
          this.birthProvince = value
          if (load === 'change') {
            this.formData.birthArea.city = ''
            this.formData.birthArea.county = ''
            this.birthCountyList = []
          }
          const param = {
            code: value
          }
          getAreaByCode(param).then(res => {
            const data = res.data
            this.birthCityList = data
          })
        }
      }
    },
    getCounty (value, type, load) { // 根据市获取县区列表
      if (type === 'live') {
        if (this.liveCity !== value) {
          this.liveCity = value
          if (load === 'change') {
            this.formData.liveArea.county = ''
          }
          const param = {
            code: value
          }
          getAreaByCode(param).then(res => {
            const data = res.data
            this.liveCountyList = data
          })
        }
      } else {
        if (this.birthCity !== value) {
          this.birthCity = value
          if (load === 'change') {
            this.formData.birthArea.county = ''
          }
          const param = {
            code: value
          }
          getAreaByCode(param).then(res => {
            const data = res.data
            this.birthCountyList = data
          })
        }
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.childPreparatory-wrap {
  .multipleForm {
    display: flex;
    justify-content: space-between;

    .el-select,
    .el-input {
      width: 32%;
    }

    &.contact {
      flex-wrap: wrap;
      position: relative;

      &:not(:first-child) {
        margin-top: 16px;
      }

      .el-form-item {
        width: 23%;

        &.cardItem {
          margin-top: 16px;
          width: 100%;
        }
      }

      .addContact {
        position: absolute;
        right: -36px;
        top: 0;

        span {
          @include etm-color();
          cursor: pointer;

          &:hover {
            opacity: 0.8;
          }
        }

        .iconfont {
          font-weight: bold;
        }
      }
    }
  }

  .el-input-number {
    ::v-deep .el-input__inner {
      padding: 0 10px;
      text-align: left;
    }

    ::v-deep .el-input-number__decrease {
      display: none;
    }

    ::v-deep .el-input-number__increase {
      display: none;
    }
  }

  ::v-deep .el-textarea__inner {
    padding: 5px 10px;
  }
}
</style>
