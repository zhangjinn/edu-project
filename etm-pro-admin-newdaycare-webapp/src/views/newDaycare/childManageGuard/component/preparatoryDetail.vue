<template>
  <div class="childPreparatoryDetail-wrap">
    <etm-layout-split>
      <etm-title
        border
        size="big"
      >
        预备生详情
        <template slot="tool">
          <el-button
            v-if="drawerPage === 'preparatoryDetail'"
            plain
            size="mini"
            @click="editChild"
          >
            编辑
          </el-button>
          <el-button
            v-if="drawerPage === 'preparatoryEdit'"
            plain
            size="mini"
            @click="cancel"
          >
            取消
          </el-button>
          <el-button
            v-if="drawerPage === 'preparatoryEdit'"
            type="primary"
            size="mini"
            @click="saveChild"
          >
            保存
          </el-button>
        </template>
      </etm-title>
      <div
        v-if="drawerPage === 'preparatoryDetail'"
        class="detailMessage"
      >
        <div class="avatar">
          <div class="img">
            <img
              v-if="childInfo.avatar"
              :src="childInfo.avatar"
            >
            <span
              v-else
              class="iconfont iconmorentouxiang"
            />
          </div>
          <div class="name">
            <span>{{ childInfo.childName }}</span>
            <span class="icon">
              <img
                v-if="childInfo.gender === 'MALE'"
                src="../../../../assets/images/guardcare/man.png"
              >
              <img
                v-if="childInfo.gender === 'FEMALE'"
                src="../../../../assets/images/guardcare/woman.png"
              >
            </span>
          </div>
        </div>
        <etm-title>基本信息</etm-title>
        <etm-field-label
          type="left"
          label="生日"
        >
          {{ transferDate(childInfo.birthday) }}
        </etm-field-label>
        <etm-field-label
          type="left"
          label="现住地"
        >
          {{ getArea(childInfo.currentArea) }}
        </etm-field-label>
        <etm-field-label
          type="left"
          label="详细地址"
        >
          {{ childInfo.currentAddress || '--' }}
        </etm-field-label>
        <etm-field-label
          type="left"
          label="户口地"
        >
          {{ getArea(childInfo.householdRegisterArea) }}
        </etm-field-label>
        <div
          v-for="(item,index) in childInfo.contactList"
          :key="index"
        >
          <etm-field-label
            type="left"
            :label="'联系人' + (index + 1)"
          >
            {{ item.name }}（{{ transferRelation(item.relationship) }}）- {{ item.telephone }}
          </etm-field-label>
          <etm-field-label
            type="left"
            label="接送卡号"
          >
            {{ item.attendanceCardNumber || '--' }}
          </etm-field-label>
          <etm-field-label
            v-if="index === 0"
            type="left"
            label="身份证号"
          >
            {{ item.certificateNumber || '--' }}
          </etm-field-label>
        </div>
      </div>
      <etm-form
        v-else-if="drawerPage === 'preparatoryEdit'"
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
      </etm-form>
      <etm-title>订金信息</etm-title>
      <etm-field-label
        type="left"
        label="订单号"
      >
        {{ childInfo.childEarnestMoney.orderNo }}
      </etm-field-label>
      <etm-field-label
        type="left"
        label="收费日期"
      >
        {{ transferDate(childInfo.childEarnestMoney.dateCharge) }}
      </etm-field-label>
      <etm-field-label
        type="left"
        label="订金金额（元）"
      >
        {{ formatMoney(childInfo.childEarnestMoney.money) }}
      </etm-field-label>
      <etm-field-label
        type="left"
        label="支付方式"
      >
        {{ payType[childInfo.childEarnestMoney.paymentId] }}
      </etm-field-label>
      <etm-field-label
        type="left"
        label="备注"
      >
        {{ childInfo.childEarnestMoney.remark || '--' }}
      </etm-field-label>
    </etm-layout-split>
  </div>
</template>

<script>
import { parseTime } from '@/utils'
import { queryPayType } from '@/api/newDaycare/contract'
import { validPhoneNumber } from '@/utils/validate'
import { getAreaByCode } from '@/api/area'
import { queryGuardPreparatoryById, updateGuardPreparatory } from '@/api/newDaycare/childManageGuard'

/**
 * childPreparatoryDetail create by Administrator
 * createTime 2021/3/11 16:16
 */
export default {
  name: 'ChildPreparatoryDetail',
  components: {},
  filters: {},
  mixins: [],
  props: {
    childId: {
      type: Number,
      default () {
        return null
      }
    },
    drawerPage: {
      type: String,
      default () {
        return null
      }
    }
  },
  data () {
    return {
      childInfo: {
        childEarnestMoney: {}
      },
      editClick: false,
      formData: {
        liveArea: {},
        birthArea: {}
      },
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
        }]
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
      payType: {}
    }
  },
  computed: {},
  watch: {
    childId () {
      this.getDetail()
    },
    drawerPage () {
      if (this.drawerPage === 'preparatoryEdit') {
        if (this.formData.liveArea.province) {
          this.getCity(this.formData.liveArea.province, 'live')
        }
        if (this.formData.liveArea.city) {
          this.getCounty(this.formData.liveArea.city, 'live')
        }
        if (this.formData.birthArea.province) {
          this.getCity(this.formData.birthArea.province, 'birth')
        }
        if (this.formData.birthArea.city) {
          this.getCounty(this.formData.birthArea.city, 'birth')
        }
      }
    }
  },
  created () {
  },
  mounted () {
    this.getPayType()
    this.getProvince()
  },
  methods: {
    getPayType () {
      queryPayType().then(res => {
        const _result = {}

        res.data.forEach(cur => {
          _result[cur.financePayTypeId] = cur.financePayTypeName
        })

        this.payType = _result
        this.getDetail()
      })
    },
    getDetail () {
      queryGuardPreparatoryById({ childId: this.childId }).then(res => {
        this.childInfo = res.data
        this.formData = {
          avatar: this.childInfo.avatar, // 孩子头像
          childName: this.childInfo.childName, // 孩子姓名
          gender: this.childInfo.gender, // 孩子性别
          birthday: this.childInfo.birthday, // 孩子生日
          contactList: this.childInfo.contactList, // 孩子联系人列表
          liveArea: { // 孩子现住地省市区
            province: this.childInfo.currentArea.provinceCode,
            city: this.childInfo.currentArea.cityCode,
            county: this.childInfo.currentArea.countyCode
          },
          currentAddress: this.childInfo.currentAddress, // 孩子详细地址
          birthArea: { // 孩子户籍所在地省市区
            province: this.childInfo.householdRegisterArea.provinceCode,
            city: this.childInfo.householdRegisterArea.cityCode,
            county: this.childInfo.householdRegisterArea.countyCode
          }
        }
        if (this.drawerPage === 'preparatoryEdit') {
          if (this.formData.liveArea.province) {
            this.getCity(this.formData.liveArea.province, 'live')
          }
          if (this.formData.liveArea.city) {
            this.getCounty(this.formData.liveArea.city, 'live')
          }
          if (this.formData.birthArea.province) {
            this.getCity(this.formData.birthArea.province, 'birth')
          }
          if (this.formData.birthArea.city) {
            this.getCounty(this.formData.birthArea.city, 'birth')
          }
        }
      })
    },
    editChild () {
      this.editClick = true
      this.$emit('change', 'preparatoryEdit')
    },
    cancel () {
      if (this.editClick) {
        this.editClick = false
        this.$emit('change', 'preparatoryDetail')
      } else {
        this.$emit('close')
      }
    },
    saveChild () {
      this.$refs.form.$children[0].validate(valid => {
        if (valid) {
          const param = {
            childId: this.childId,
            childName: this.formData.childName, // 孩子姓名
            gender: this.formData.gender, // 孩子性别
            birthday: parseTime(this.formData.birthday, '{y}-{m}-{d}'), // 孩子生日
            currentAreaCode: this.formData.liveArea.county, // 孩子现住地区县code
            currentAddress: this.formData.currentAddress, // 孩子详细地址
            householdRegisterAreaCode: this.formData.birthArea.county, // 孩子户籍地区县code
            contactList: this.formData.contactList // 孩子联系人列表
          }
          updateGuardPreparatory(param).then(() => {
            this.$message.success('预备生修改成功')
            this.editClick = false
            this.$emit('change', 'preparatoryDetail')
            this.$emit('finish')
            this.getDetail()
          })
        }
      })
    },
    transferRelation (relation) {
      // MOTHER :妈妈 FATHER :爸爸 GRANDFATHER :爷爷 GRANDMOTHER :奶奶 GRANDPA :外公 GRANDMA :外婆 OTHER :其他
      switch (relation) {
        case 'MOTHER':
          return '妈妈'
        case 'FATHER':
          return '爸爸'
        case 'GRANDFATHER':
          return '爷爷'
        case 'GRANDMOTHER':
          return '奶奶'
        case 'GRANDPA':
          return '外公'
        case 'GRANDMA':
          return '外婆'
        case 'OTHER':
          return '其他'
        default:
          return relation
      }
    },
    // 地址拼接
    getArea (area) {
      if (!area || !area.provinceName) {
        return '--'
      } else {
        return area.provinceName + area.cityName + area.countyName
      }
    },
    formatMoney (money) {
      if (money && !isNaN(money)) {
        return money.toFixed(2)
      } else {
        return money || '--'
      }
    },
    transferDate (date) {
      if (!date) {
        return '--'
      } else {
        return parseTime(date, '{y}-{m}-{d}')
      }
    },
    getProvince () {
      getAreaByCode().then(res => {
        this.provinceList = res.data
      })
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
    }
  }
}
</script>
<style lang="scss" scoped>
.childPreparatoryDetail-wrap {
  .avatar {
    display: flex;
    padding-bottom: 16px;

    .img {
      border-radius: 50%;
      display: flex;
      height: 48px;
      overflow: hidden;
      width: 48px;

      img {
        height: 100%;
        object-fit: cover;
        width: 100%;
      }

      .iconfont {
        @include c_disabled_color();
        font-size: 48px;
        height: 48px;
        line-height: 48px;
        width: 48px;
      }
    }

    .name {
      display: flex;
      margin-left: 16px;

      span {
        @include c_title_color();
        display: inline-block;
        font-size: 16px;
        font-weight: bold;
        height: 48px;
        line-height: 48px;
        margin-right: 4px;
      }

      .icon {
        width: 16px;

        img {
          width: 100%;
        }
      }

      .clazz {
        margin-top: 6px;
      }
    }
  }

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
        margin-top: 24px;
      }

      .el-form-item {
        margin-bottom: 16px;
        width: 100%;
      }

      .lastItem {
        margin-bottom: 0;
      }

      .cardItem {
        margin-bottom: 0;
        margin-top: 16px;
      }

      .addContact {
        bottom: 0;
        height: 32px;
        position: absolute;
        right: -24px;

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
}
</style>
