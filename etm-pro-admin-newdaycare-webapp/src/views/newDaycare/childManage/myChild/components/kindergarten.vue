<template>
  <div class="kindergarten-wrap">
    <etm-drawer
      type="big"
      :visible.sync="isShow"
    >
      <etm-layout-split>
        <div>
          <etm-title
            :show-line="false"
            border
          >
            入园审核
            <template slot="tool">
              <el-button
                plain
                size="mini"
                @click="hide"
              >
                取消
              </el-button>
              <el-button
                type="primary"
                size="mini"
                @click="confirm"
              >
                保存
              </el-button>
            </template>
          </etm-title>
          <etm-form
            ref="form"
            type="dialog"
            :model="form"
          >
            <etm-title>基本信息</etm-title>
            <el-row>
              <el-col :span="12">
                <el-form-item
                  label="幼儿姓名"
                  prop="childName"
                  :rules="formValidate.nullValueRule(true, '请输入幼儿姓名')"
                >
                  <el-input v-model="form.childName" />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item
                  label="性别"
                  prop="gender"
                  :rules="formValidate.nullValueRule(true, '请选择性别')"
                >
                  <el-select v-model="form.gender">
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
            <el-form-item
              label="出生日期"
              prop="birthday"
              :rules="formValidate.nullValueRule(true, '请选择出生日期')"
            >
              <el-date-picker
                v-model="form.birthday"
                value-format="yyyy-MM-dd"
              />
            </el-form-item>
            <el-form-item
              label="现住地"
              prop="currentAreaCode"
            >
              <etm-address
                v-model="form.currentAreaCode"
                :area-id="form.currentAreaCode"
              />
            </el-form-item>
            <el-form-item
              label="详细地址"
              prop="currentAddress"
            >
              <el-input
                v-model="form.currentAddress"
                placeholder="请输入详细地址"
              />
            </el-form-item>

            <etm-title>入园信息</etm-title>

            <el-form-item
              label="联系人"
              required
            >
              <div
                v-for="(item, index) in form.relationshipList"
                :key="index"
                class="contacts"
              >
                <el-row v-if="index !== 0">
                  <el-col :span="5">
                    <el-form-item
                      :prop="`relationshipList.${index}.relationshipId`"
                      :rules="formValidate.nullValueRule(true, '请选择称呼', ['change', 'blur'])"
                    >
                      <el-select v-model="item.relationshipId">
                        <el-option
                          v-for="(i, k) in relationship"
                          :key="k"
                          :label="i.relationshipName"
                          :value="i.relationshipId"
                        />
                      </el-select>
                    </el-form-item>
                  </el-col>
                  <el-col :span="6">
                    <el-form-item
                      :prop="`relationshipList.${index}.parentName`"
                      :rules="formValidate.nullValueRule(true, '请输入联系人姓名')"
                    >
                      <el-input
                        v-model="item.parentName"
                        placeholder="输入联系人姓名"
                      />
                    </el-form-item>
                  </el-col>
                  <el-col :span="6">
                    <el-form-item
                      :prop="`relationshipList.${index}.telephone`"
                      :rules="formValidate.nullValueRule(true, '请输入联系人号码')"
                    >
                      <el-input
                        v-model="item.telephone"
                        placeholder="输入手机号码"
                        @input="checkoutPhone($event, index)"
                      />
                    </el-form-item>
                  </el-col>
                  <el-col :span="6">
                    <el-form-item :prop="`relationshipList.${index}.attendanceCardNumber`">
                      <el-input
                        v-model="item.attendanceCardNumber"
                        placeholder="接送卡号"
                      />
                    </el-form-item>
                  </el-col>
                  <el-col :span="1">
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
                  </el-col>
                </el-row>
                <el-row
                  v-else
                  class="row-first"
                >
                  <el-col :span="8">
                    <el-form-item
                      :prop="`relationshipList.${index}.relationshipId`"
                      :rules="formValidate.nullValueRule(true, '请选择称呼', ['change', 'blur'])"
                    >
                      <el-select v-model="item.relationshipId">
                        <el-option
                          v-for="(i, k) in relationship"
                          :key="k"
                          :label="i.relationshipName"
                          :value="i.relationshipId"
                        />
                      </el-select>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item
                      :prop="`relationshipList.${index}.parentName`"
                      :rules="formValidate.nullValueRule(true, '请输入联系人姓名')"
                    >
                      <el-input
                        v-model="item.parentName"
                        placeholder="输入联系人姓名"
                      />
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item
                      :prop="`relationshipList.${index}.telephone`"
                      :rules="formValidate.nullValueRule(true, '请输入联系人号码')"
                    >
                      <el-input
                        v-model="item.telephone"
                        placeholder="输入手机号码"
                        @input="checkoutPhone($event, index)"
                      />
                    </el-form-item>
                  </el-col>
                  <el-col :span="15">
                    <el-form-item
                      :prop="`relationshipList.${index}.certificateNumber`"
                      :rules="{trigger: ['blur'], validator:validatorId}"
                    >
                      <el-input
                        v-model="item.certificateNumber"
                        placeholder="请输入联系人的身份证号码"
                      />
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item :prop="`relationshipList.${index}.attendanceCardNumber`">
                      <el-input
                        v-model="item.attendanceCardNumber"
                        placeholder="接送卡号"
                      />
                    </el-form-item>
                  </el-col>
                  <el-col :span="1">
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
                  </el-col>
                </el-row>
              </div>
            </el-form-item>
            <el-form-item label="户口地">
              <etm-address
                v-model="form.householdRegisterAreaCode"
                :area-id="form.householdRegisterAreaCode"
              />
            </el-form-item>
            <el-form-item
              prop="enrollmentTime"
              :rules="formValidate.nullValueRule(true, '请选择入托日期')"
            >
              <div slot="label">
                入托日期
                <el-tooltip
                  popper-class="stepTips"
                  placement="right"
                >
                  <i class="iconfont iconquestion-circle" />
                  <div
                    slot="content"
                  >
                    入托当日即开始计算考勤，<br>
                    请如实填写，有了考勤记录<br>
                    后不能修改。
                  </div>
                </el-tooltip>
              </div>
              <el-date-picker
                v-model="form.enrollmentTime"
                value-format="yyyy-MM-dd"
              />
            </el-form-item>
            <el-form-item
              label="报读班级"
              required
            >
              <el-row>
                <el-col :span="12">
                  <el-form-item
                    prop="gradeId"
                    :rules="formValidate.nullValueRule(true, '请选择年级', ['blur', 'change'])"
                  >
                    <el-select
                      v-model="form.gradeId"
                      @change="gradeChange"
                    >
                      <el-option
                        v-for="(item, index) in clazzLists"
                        :key="index"
                        :label="item.name"
                        :value="item.id"
                      />
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item
                    prop="clazzId"
                    :rules="formValidate.nullValueRule(true, '请选择班级', ['blur', 'change'])"
                  >
                    <el-select v-model="form.clazzId">
                      <template v-if="form.gradeId !== null">
                        <el-option
                          v-for="(item, index) in clazzLists2"
                          :key="index"
                          :label="item.name"
                          :value="item.id"
                        />
                      </template>
                    </el-select>
                  </el-form-item>
                </el-col>
              </el-row>
            </el-form-item>
            <el-form-item>
              <div
                slot="label"
                class="diyLabel"
              >
                人脸照片
                <el-tooltip
                  popper-class="stepTips"
                  placement="right"
                >
                  <i class="iconfont iconquestion-circle" />
                  <div
                    slot="content"
                  >
                    图片尺寸为640*480左右 <br>
                    图片中只有一个人像<br>
                    图片中人像端正<br>
                    图片中人像占图片30%以上，面部区域像素不低于128x128<br>
                    图片大小不超过400K<br>
                    确保同一人员注册照均为本人
                  </div>
                </el-tooltip>
              </div>
              <etm-upload-image
                :resource-name="'newDaycare/childManage/face'"
                :preview-src-list="previewSrcLists"
                :preview-src-key="previewSrcKey"
                :limit-size="0.4"
                :limit-number="3"
                @getImgList="faceImgList"
              />
            </el-form-item>
            <etm-title
              show-toggle
              open-text="展开更多"
              close-text="收起更多"
              @toggle="toggle"
            >
              更多信息
            </etm-title>
            <el-form-item
              label="国籍/地区"
              prop="nationality"
            >
              <el-select v-model="form.nationality">
                <el-option
                  v-for="(item, index) in nationList"
                  :key="index"
                  :label="item.zh"
                  :value="item.zh"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="幼儿证件">
              <el-row>
                <el-col :span="12">
                  <el-form-item prop="certificateType">
                    <el-select
                      v-model="form.certificateType"
                      placeholder="请选择证件类型"
                    >
                      <el-option
                        label="身份证"
                        value="ID_CARD"
                      />
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item prop="certificateNumber">
                    <el-input
                      v-model="form.certificateNumber"
                      placeholder="请输入证件号码"
                    />
                  </el-form-item>
                </el-col>
              </el-row>
            </el-form-item>
            <div v-if="more">
              <el-form-item
                label="留守儿童"
                prop="isLeftBehindChildren"
              >
                <el-radio-group v-model="form.isLeftBehindChildren">
                  <el-radio :label="true">
                    是
                  </el-radio>
                  <el-radio :label="false">
                    否
                  </el-radio>
                </el-radio-group>
              </el-form-item>
              <el-form-item
                label="血型"
                prop="bloodType"
                placeholder="请选择"
              >
                <el-select v-model="form.bloodType">
                  <el-option
                    label="A型"
                    value="A"
                  />
                  <el-option
                    label="B型"
                    value="B"
                  />
                  <el-option
                    label="AB型"
                    value="AB"
                  />
                  <el-option
                    label="RH型阳性"
                    value="RH_A"
                  />
                  <el-option
                    label="RH型阴性"
                    value="RH_B"
                  />
                  <el-option
                    label="O型"
                    value="O"
                  />
                  <el-option
                    label="其他"
                    value="OTHER"
                  />
                </el-select>
              </el-form-item>
              <el-form-item
                label="健康状态"
                prop="healthCondition"
              >
                <el-select
                  v-model="form.healthCondition"
                  placeholder="请选择"
                >
                  <el-option
                    label="健康"
                    value="HEALTH"
                  />
                  <el-option
                    label="一般"
                    value="ORDINARY"
                  />
                  <el-option
                    label="患病"
                    value="SICK"
                  />
                </el-select>
              </el-form-item>
              <el-form-item
                label="曾患疾病"
                prop="onceSick"
              >
                <el-select
                  v-model="form.onceSick"
                  placeholder="请选择"
                >
                  <el-option
                    v-for="(item, index) in sickList"
                    :key="index"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </el-form-item>
              <el-form-item
                label="食物过敏"
                prop="foodAllergyInfo"
              >
                <el-input
                  v-model="form.foodAllergyInfo"
                  placeholder="请输入过敏情况"
                />
              </el-form-item>
              <el-form-item
                label="药物过敏"
                prop="drugAllergyInfo"
              >
                <el-input
                  v-model="form.drugAllergyInfo"
                  placeholder="请输入过敏情况"
                />
              </el-form-item>
              <el-form-item
                label="疫苗接种"
                prop="isCompleteVaccination"
              >
                <el-radio-group v-model="form.isCompleteVaccination">
                  <el-radio :label="true">
                    已完成
                  </el-radio>
                  <el-radio :label="false">
                    未完成
                  </el-radio>
                </el-radio-group>
              </el-form-item>
              <el-form-item
                label="自己吃饭"
                prop="isEatByYourself"
              >
                <el-radio-group v-model="form.isEatByYourself">
                  <el-radio :label="true">
                    是
                  </el-radio>
                  <el-radio :label="false">
                    否
                  </el-radio>
                </el-radio-group>
              </el-form-item>
              <el-form-item label="上传图片">
                <etm-upload-image
                  :resource-name="'newdaycare_childManage'"
                  :preview-src-list="form.srcList"
                  :preview-src-key="form.previewSrcKey"
                  @getImgList="getImgList"
                />
              </el-form-item>
              <el-form-item
                label="备注"
                prop="remarks"
              >
                <el-input
                  v-model="form.remarks"
                  placeholder="输入备注内容"
                  type="textarea"
                  :rows="4"
                  :maxlength="200"
                />
              </el-form-item>
            </div>
          </etm-form>
        </div>
      </etm-layout-split>
    </etm-drawer>
  </div>
</template>

<script>
import formValidate from '@/utils/rules'
import EtmUploadImage from '@/components/EtmUploadImg/index'
import EtmAddress from '@/views/base/org/EtmAddress'
import {
  queryGradeList,
  queryClazzAllLists,
  createKindergarten,
  queryChildAdmission
} from '@/api/newDaycare/childManage'
import {
  queryChildRelationship
} from '@/api/newDaycare/childManageSetting'
import nationList from '@/utils/nation'
import { parseTime } from '@/utils'
import { checkIDCard } from '@/utils/validate'
export default {
  name: 'Kindergarten',
  components: {
    EtmAddress,
    EtmUploadImage
  },
  props: {
    prop: {
      type: Object,
      default () {
        return {}
      }
    }
  },
  data () {
    const validatorId = (rule, value, cb) => {
      if (value && !checkIDCard(value)) {
        return cb(new Error('身份证号码不正确'))
      }

      return cb()
    }

    return {
      nationList,
      formValidate,
      validatorId,
      previewSrcLists: [],
      previewSrcKey: [],
      isShow: false,
      more: true,
      clazzLists: [],
      clazzLists2: [],
      relationship: [],
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
      form: {
        sourceChildId: null,
        imgList: [],
        previewSrcKey: [],
        srcList: [],
        gradeId: null,
        clazzId: null,
        isLeftBehindChildren: null,
        childName: null,
        faceImageList: [],
        bloodType: null,
        healthCondition: null,
        onceSick: null,
        foodAllergyInfo: null,
        drugAllergyInfo: null,
        isCompleteVaccination: null,
        isEatByYourself: null,
        imageList: [],
        remarks: null,
        nationality: null,
        certificateType: null,
        certificateNumber: null,
        currentAreaCode: null,
        currentAddress: null,
        householdRegisterAreaCode: null,
        birthday: null,
        gender: null,
        enrollmentTime: null,
        relationshipList: [{
          kinshipId: null,
          relationshipId: null,
          parentName: null,
          certificateNumber: null,
          telephone: null,
          attendanceCardNumber: null
        }],
        avatar: null
      }
    }
  },
  watch: {
    isShow: {
      handler (n) {
        if (n) {
          this.reset()
          this.init()
        }
      }
    }
  },
  created () {
  },
  methods: {
    faceImgList (val, key) {
      this.previewSrcLists = val
      this.previewSrcKey = key
    },
    init () {
      queryGradeList({ paged: false }).then(res => {
        this.clazzLists = res.data
      })

      queryChildRelationship().then(res => {
        this.relationship = res.data
      })
      queryChildAdmission({ childId: this.prop.id }).then(res => {
        const { childName, childId, enrollmentTime, birthday, nationality, currentAddress, avatar, addressCoding, gender, contactList } = res.data

        this.form.childName = childName
        this.form.sourceChildId = childId
        this.form.birthday = birthday ? parseTime(birthday, '{y}-{m}-{d}') : null
        this.form.avatar = avatar
        this.form.currentAreaCode = addressCoding
        this.form.currentAddress = currentAddress
        this.nationality = nationality
        this.enrollmentTime = enrollmentTime
        this.form.gender = gender
        const relationshipList = (contactList || []).map(cur => {
          return {
            kinshipId: cur.kinshipId,
            relationshipId: cur.relationshipId,
            parentName: cur.parentName,
            certificateNumber: cur.certificateNumber || null,
            telephone: cur.telephone,
            attendanceCardNumber: cur.cardNumber
          }
        })
        this.form.relationshipList = relationshipList.length ? relationshipList : [{
          kinshipId: null,
          relationshipId: null,
          parentName: null,
          certificateNumber: null,
          telephone: null,
          attendanceCardNumber: null
        }]
      })
    },
    gradeChange (e) {
      console.log(e)
      this.form.clazzId = null
      queryClazzAllLists({
        gradeId: this.form.gradeId,
        paged: false
      }).then(res => {
        this.clazzLists2 = res.data
      })
    },
    addContact () {
      this.form.relationshipList.push({
        kinshipId: null,
        relationshipId: null,
        parentName: null,
        certificateNumber: null,
        telephone: null,
        attendanceCardNumber: null
      })
    },
    removeContact (index) {
      this.form.relationshipList.splice(index, 1)
    },
    getImgList (val, key) {
      const resultImg = key.map(cur => {
        return {
          name: cur,
          url: cur
        }
      })

      this.form.imageList = resultImg
      this.form.srcList = val
      this.form.previewSrcKey = key

      // this.change()
    },
    checkoutPhone (e, index) {
      if (e.indexOf(1) !== 0) {
        this.form.relationshipList[index].telephone = ''
      } else if (/^\d{12,}$/.test(e)) {
        this.form.relationshipList[index].telephone = (`${e}`).substr(0, 11)
      } else {
        this.form.relationshipList[index].telephone = e.replace(/[^\d]+/, '')
      }
    },
    toggle (e) {
      this.more = !this.more
    },
    show () {
      this.isShow = true
    },
    hide () {
      this.isShow = false
      this.reset()
    },
    reset () {
      if (this.$refs.form) {
        this.$refs.form.$children[0].resetFields()
      }
      this.form = {
        sourceChildId: null,
        imgList: [],
        previewSrcKey: [],
        srcList: [],
        gradeId: null,
        clazzId: null,
        isLeftBehindChildren: null,
        childName: null,
        bloodType: null,
        healthCondition: null,
        onceSick: null,
        foodAllergyInfo: null,
        faceImageList: [],
        drugAllergyInfo: null,
        isCompleteVaccination: null,
        isEatByYourself: null,
        imageList: [],
        remarks: null,
        nationality: null,
        certificateType: null,
        certificateNumber: null,
        currentAreaCode: null,
        currentAddress: null,
        householdRegisterAreaCode: null,
        birthday: null,
        gender: null,
        enrollmentTime: null,
        relationshipList: [{
          kinshipId: null,
          relationshipId: null,
          parentName: null,
          certificateNumber: null,
          telephone: null,
          attendanceCardNumber: null
        }],
        avatar: null
      }
    },
    confirm () {
      this.$refs.form.$children[0].validate(valid => {
        if (valid) {
          // console.log(this.form)
          this.form.faceImageList = this.previewSrcKey.map(cur => {
            return {
              name: 'face',
              url: cur
            }
          })
          createKindergarten(this.form).then(res => {
            this.$message.success('入园成功')
            this.$emit('success')
            this.hide()
          })
        }
      })
    }
  }
}
</script>

<style scoped lang="scss">
.kindergarten-wrap {
  ::v-deep {
    .el-form-item {
      label {
        > div {
          display: inline-block;
        }
      }
    }

    .el-row {
      > .el-col-12 {
        width: calc(50% - 8px);

        &:last-child {
          margin-left: 16px;
        }
      }
    }

    .contacts {
      margin-bottom: 12px;

      .el-row {
        display: flex;
        flex-wrap: wrap;

        &.row-first {
          .el-col {
            flex: unset;
            margin-right: 8px;

            &.el-col-8 {
              width: calc(33.3333333% - 6px);

              &:nth-of-type(3) {
                margin-right: 0;
              }

              &:nth-of-type(1),
              &:nth-of-type(2),
              &:nth-of-type(3) {
                margin-bottom: 8px;
              }
            }

            &.el-col-15 {
              width: calc(66.66% - 40px);
            }

            &:last-child {
              flex: unset;
              margin-right: 0;
              text-align: center;
              width: 30px;
            }
          }
        }

        .el-col {
          flex: 1;
          margin-right: 8px;

          &:last-child {
            flex: unset;
            margin-right: 0;
            text-align: center;
            width: 30px;
          }
        }
      }
    }

  }
}
</style>
