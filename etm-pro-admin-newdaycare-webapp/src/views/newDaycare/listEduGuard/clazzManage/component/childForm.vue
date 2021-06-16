<template>
  <div class="form">
    <etm-form
      ref="form"
      :model="formData"
      :rules="rule"
      type="dialog"
    >
      <etm-title>基本信息</etm-title>
      <el-form-item
        v-show="formType === 'edit'"
        label="头像"
      >
        <etm-upload-avatar
          v-model="formData.avatar"
          :resource-name="'newdaycare/childManageGuard'"
          media-type="image"
          @success="success"
        />
      </el-form-item>
      <el-form-item
        label="幼儿姓名"
        prop="childName"
      >
        <el-input
          v-model="formData.childName"
          placeholder="请输入幼儿姓名"
          @blur="verifyChild"
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
      <etm-title>入园信息</etm-title>
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
            :class="formType"
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
                :disabled="disabledInput[index]"
                @blur="verifyChild"
              />
            </el-form-item>
            <el-form-item
              :prop="'contactList.'+ index +'.telephone'"
              :rules="rule.telephone"
            >
              <el-input
                v-model="item.telephone"
                placeholder="手机号码"
                @change="checkPhone($event, index)"
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
      <el-form-item prop="enrollmentTime">
        <span slot="label">
          <el-tooltip
            effect="light"
            popper-class="stepTips"
            :visible-arrow="false"
            placement="bottom-start"
          >
            <span>入托日期<i class="iconfont iconquestion-circle" /></span>
            <div
              slot="content"
              style="color: #999;"
            >
              入托当日即开始计算考勤，<br>
              请如实填写，有了考勤记录<br>
              后不能修改。
            </div>
          </el-tooltip>
        </span>
        <el-date-picker
          v-model="formData.enrollmentTime"
          type="date"
          placeholder="请选择入托日期"
          :clearable="false"
          :disabled="disabledTime"
        />
      </el-form-item>
      <el-form-item
        label="入读班级"
        prop="clazz"
      >
        <div class="multipleForm clazz">
          <el-select
            v-model="formData.clazz.gradeId"
            placeholder="请选择年级"
            @change="getClazz($event, 'change')"
          >
            <el-option
              v-for="(grade, i) in gradeList"
              :key="i"
              :label="grade.name"
              :value="grade.id"
            />
          </el-select>
          <el-select
            v-model="formData.clazz.clazzId"
            placeholder="请选择班级"
          >
            <el-option
              v-for="(clazz, i) in clazzList"
              :key="i"
              :label="clazz.name"
              :value="clazz.id"
            />
          </el-select>
        </div>
      </el-form-item>
      <el-form-item>
        <span slot="label">
          <el-tooltip
            effect="light"
            popper-class="stepTips"
            :visible-arrow="false"
            placement="bottom-start"
          >
            <span>人脸照片<i class="iconfont iconquestion-circle" /></span>
            <div
              slot="content"
              style="color: #999;"
            >
              1、用于录入人脸识别设备；<br>
              2、小于400k；<br>
              3、面部区域像素不低于128X128，面部大小占照片1/3以上；<br>
              4、确保所有注册照为同一人员，否则无法成功注册。
            </div>
          </el-tooltip>
        </span>
        <etm-upload-img
          resource-name="newDaycare/childManageGuard"
          :preview-src-list="formData.faceImageSrcLists"
          :preview-src-key="formData.faceImageSrcKey"
          :limit-number="1"
          :limit-size="1"
          limit-type="JPG"
          @getImgList="getFaceImgList"
        />
      </el-form-item>
    </etm-form>
    <etm-title
      show-toggle
      open-text="展开更多"
      close-text="收起更多"
      @toggle="toggle"
    >
      更多信息
    </etm-title>
    <el-collapse v-model="collapseActive">
      <el-collapse-item name="1">
        <etm-form
          :model="formData"
          type="dialog"
        >
          <el-form-item label="国籍/地区">
            <el-select
              v-model="formData.nationality"
              filterable
            >
              <el-option
                v-for="(nation, i) in nationList"
                :key="i"
                :label="nation.zh"
                :value="nation.zh"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="幼儿证件">
            <div class="multipleForm twoForm">
              <el-select
                v-model="formData.certificateType"
                placeholder="请选择证件类型"
              >
                <el-option
                  v-for="(cardType, i) in cardTypeList"
                  :key="i"
                  :label="cardType.label"
                  :value="cardType.value"
                />
              </el-select>
              <el-input
                v-model="formData.certificateNumber"
                placeholder="请输入证件号码"
              />
            </div>
          </el-form-item>
          <el-form-item label="留守儿童">
            <el-radio-group v-model="formData.isLeftBehindChildren">
              <el-radio :label="true">
                是
              </el-radio>
              <el-radio :label="false">
                否
              </el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="血型">
            <el-select
              v-model="formData.bloodType"
              placeholder="请选择血型"
            >
              <el-option
                v-for="(blood, i) in bloodList"
                :key="i"
                :label="blood.label"
                :value="blood.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="健康状况">
            <el-select
              v-model="formData.healthCondition"
              placeholder="请选择健康状况"
            >
              <el-option
                v-for="(health, i) in healthList"
                :key="i"
                :label="health.label"
                :value="health.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="曾患疾病">
            <el-select
              v-model="formData.onceSick"
              multiple
              placeholder="请选择疾病状况"
              @change="$forceUpdate()"
            >
              <el-option
                v-for="(sick, i) in sickList"
                :key="i"
                :label="sick.label"
                :value="sick.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="食物过敏">
            <el-input
              v-model="formData.foodAllergyInfo"
              placeholder="请输入食物过敏情况"
            />
          </el-form-item>
          <el-form-item label="药物过敏">
            <el-input
              v-model="formData.drugAllergyInfo"
              placeholder="请输入药物过敏情况"
            />
          </el-form-item>
          <el-form-item label="疫苗接种">
            <el-radio-group v-model="formData.isCompleteVaccination">
              <el-radio :label="true">
                已完成
              </el-radio>
              <el-radio :label="false">
                未完成
              </el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="自己吃饭">
            <el-radio-group v-model="formData.isEatByYourself">
              <el-radio :label="true">
                是
              </el-radio>
              <el-radio :label="false">
                否
              </el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="上传图片">
            <etm-upload-img
              resource-name="newDaycare/childManageGuard"
              :preview-src-list="formData.previewSrcLists"
              :preview-src-key="formData.previewSrcKey"
              :text="''"
              :limit="9"
              @getImgList="getImgList"
            />
          </el-form-item>
          <el-form-item label="备注">
            <el-input
              v-model="formData.remarks"
              placeholder="请输入备注内容"
              class="remark"
              type="textarea"
              :autosize="{ minRows: 3}"
              maxlength="200"
              show-word-limit
            />
          </el-form-item>
        </etm-form>
      </el-collapse-item>
    </el-collapse>
  </div>
</template>

<script>
import EtmUploadImg from '@/components/EtmUploadImg'
import { validPhoneNumber } from '@/utils/validate'
import { getAreaByCode } from '@/api/area'
// import { checkChildRepeat, checkParentPhone, getClazzList, getGradeList } from '@/api/guardcare/childManage/childManage'
import { checkChildRepeat, checkParentPhone } from '@/api/newDaycare/listEduGuardChildManage'
import { getGrade } from '@/api/newDaycare/listEduGuardGradeManage'
import { getClazz } from '@/api/newDaycare/listEduGuardClazzManage'

import EtmUploadAvatar from '@/components/EtmUploadAvatar/index'
import nationList from '@/utils/nation'

export default {
  components: {
    EtmUploadImg,
    EtmUploadAvatar
  },
  props: {
    formData: {
      type: Object,
      default () {
        return {}
      }
    },
    formType: {
      type: String,
      default () {
        return ''
      }
    },
    disabledTime: {
      type: Boolean,
      default () {
        return false
      }
    }
  },
  data () {
    return {
      rule: { // 表单验证规则
        childName: [{ required: true, message: '孩子姓名不能为空', trigger: 'blur' }],
        gender: [{ required: true, message: '性别不能为空', trigger: 'change' }],
        birthday: [{ required: true, message: '出生日期不能为空', trigger: 'change' }],
        enrollmentTime: [{ required: true, message: '入托日期不能为空', trigger: 'change' }],
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
        clazz: [{
          required: true,
          trigger: 'change',
          validator: (rule, value, callback) => {
            if (!value.gradeId) {
              callback(new Error('年级不能为空'))
            } else if (!value.clazzId) {
              callback(new Error('班级不能为空'))
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
      collapseActive: '1', // 更多信息展开隐藏
      nationList, // 国籍列表
      cardTypeList: [ // 证件类型列表
        {
          label: '身份证',
          value: 'ID_CARD'
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
      gradeList: [], // 年级列表
      gradeId: '',
      clazzList: [], // 班级列表
      bloodList: [ // 血型列表
        {
          label: 'A型',
          value: 'A'
        },
        {
          label: 'B型',
          value: 'B'
        },
        {
          label: 'AB型',
          value: 'AB'
        },
        {
          label: 'RH型阳性',
          value: 'RH_A'
        },
        {
          label: 'RH型阴性',
          value: 'RH_B'
        },
        {
          label: 'O型',
          value: 'O'
        },
        {
          label: '其他血型',
          value: 'OTHER'
        }
      ],
      healthList: [ // 健康状况列表
        {
          label: '健康',
          value: 'HEALTH'
        },
        {
          label: '一般',
          value: 'ORDINARY'
        },
        {
          label: '患病',
          value: 'SICK'
        }
      ],
      sickList: [ // 曾患疾病列表
        {
          label: '水痘',
          value: '水痘'
        },
        {
          label: '皮肤病',
          value: '皮肤病'
        },
        {
          label: '肝炎',
          value: '肝炎'
        },
        {
          label: '哮喘',
          value: '哮喘'
        },
        {
          label: '胃病',
          value: '胃病'
        },
        {
          label: '骨折',
          value: '骨折'
        },
        {
          label: '肾病',
          value: '肾病'
        },
        {
          label: '腮腺炎',
          value: '腮腺炎'
        },
        {
          label: '癫痫病',
          value: '癫痫病'
        },
        {
          label: '风疹',
          value: '风疹'
        },
        {
          label: '贫血',
          value: '贫血'
        },
        {
          label: '其他疾病',
          value: '其他疾病'
        },
        {
          label: '无',
          value: '无'
        }
      ],
      childRepeat: false,
      oldPhoneNumber: [],
      disabledInput: []
    }
  },
  watch: {
    childRepeat () {
      this.$emit('repeat', this.childRepeat)
    },
    formData: {
      handler () {
        if (this.formData.clazz.gradeId) {
          this.getClazz(this.formData.clazz.gradeId)
        }
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
        if (this.formData.contactList && this.formData.contactList.length) {
          this.oldPhoneNumber = []
          this.formData.contactList.forEach(item => {
            this.oldPhoneNumber.push(item.telephone)
            this.disabledInput.push(false)
          })
        }
      },
      immediate: true
    }
  },
  mounted () {
    this.getProvince()
    this.getGrade()
  },
  methods: {
    toggle (val) {
      if (val) {
        this.collapseActive = '1'
      } else {
        this.collapseActive = ''
      }
    },
    getProvince () {
      getAreaByCode().then(res => {
        this.provinceList = res.data
      })
    },
    getGrade () { // 获取年级
      const param = {
        paged: false
      }
      getGrade(param).then(res => {
        this.gradeList = res.data
      })
    },
    getClazz (id, type) { // 根据年级获取班级
      if (this.gradeId !== id) {
        this.gradeId = id
        if (type === 'change') {
          this.clazzList = []
          this.formData.clazz.clazzId = ''
        }
        const param = {
          gradeId: id,
          paged: false
        }
        getClazz(param).then(res => {
          this.clazzList = res.data
        })
      }
    },
    success (hash, key) {
      this.formData.avatar = key
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
      this.disabledInput.push(false)
    },
    removeContact (index) { // 删除联系人
      this.formData.contactList.splice(index, 1)
      this.disabledInput.splice(index, 1)
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
    getFaceImgList (val, key) { // 获取图片
      this.formData.faceImageSrcLists = val
      this.formData.faceImageSrcKey = key
    },
    getImgList (val, key) { // 获取图片
      this.formData.previewSrcLists = val
      this.formData.previewSrcKey = key
    },
    checkPhone (value, index) {
      if (!this.oldPhoneNumber.includes(value) && validPhoneNumber(value)) {
        const param = {
          phone: value
        }
        checkParentPhone(param).then(res => {
          const data = res.data
          if (data && data.childNameList && data.childNameList.length) {
            let str = ''
            data.childNameList.forEach((item, index) => {
              if (index > 0) {
                str += '，' + item
              } else {
                str += item
              }
            })
            const html = value + '已绑定' + str + '，是否确认为同家庭？'
            this.$etmTip.init({
              type: 'warn',
              title: '确认',
              html,
              confirmBtn: '确定',
              cancelBtn: '取消',
              cancel: () => {
                // this.formData.contactList[index].telephone = null
                this.$etmTip.close()
              },
              confirm: () => {
                this.formData.contactList[index].name = data.parentName
                this.disabledInput[index] = true
                this.verifyChild()
                this.$etmTip.close()
              }
            })
            this.$etmTip.open()
          } else {
            this.disabledInput[index] = false
          }
        })
      }
    },
    transferRelation (relation) {
      switch (relation) {
        case 'FATHER':
          return '爸爸'
        case 'MOTHER':
          return '妈妈'
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
    verifyChild () {
      if (this.formType === 'add' && this.formData.childName) {
        const param = {
          childName: this.formData.childName,
          contactList: []
        }
        for (let i = 0; i < this.formData.contactList.length; i++) {
          if (!this.formData.contactList[i].relationship) {
            return
          } else if (!this.formData.contactList[i].name) {
            return
          } else if (!this.formData.contactList[i].telephone) {
            return
          } else if (!validPhoneNumber(this.formData.contactList[i].telephone)) {
            return
          } else {
            const data = {
              name: this.formData.contactList[i].name,
              telephone: this.formData.contactList[i].telephone
            }
            param.contactList.push(data)
          }
        }
        checkChildRepeat(param).then(res => {
          this.childRepeat = res.data.repeat
          if (this.childRepeat) {
            this.$message.warning('幼儿已存在，不能重复添加')
          }
        })
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.form {
  .multipleForm {
    display: flex;
    justify-content: space-between;

    .el-select,
    .el-input {
      width: 32%;
    }

    &.clazz {
      justify-content: flex-start;

      .el-select + .el-select {
        margin-left: 2%;
      }
    }

    &.contact {
      flex-wrap: wrap;
      position: relative;

      &:not(:first-child) {
        margin-top: 16px;
      }

      &.edit {
        flex-wrap: wrap;

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
        }

        .addContact {
          bottom: 0;
          height: 32px;
          right: -24px;
          top: auto;
        }
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

    &.twoForm {
      .el-select,
      .el-input {
        width: 49%;
      }
    }
  }

  ::v-deep .el-collapse {
    border: 0;

    .el-collapse-item__header {
      display: none;
    }

    .el-collapse-item__wrap {
      border: 0;

      .el-collapse-item__content {
        padding: 0;
      }
    }
  }

  .remark {
    ::v-deep textarea {
      padding-bottom: 36px;
    }
  }
}

.contactTip {
  b {
    @include c_secondary_color();
    line-height: 24px;
  }

  div {
    @include c_secondary_color();
    line-height: 21px;
  }
}
</style>
