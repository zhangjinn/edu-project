<template>
  <div class="detail-wrap">
    <etm-layout-split :left-styles="{minWidth: '500px',maxWidth: '500px'}">
      <div slot="left">
        <etm-tabs
          v-model="activeName"
          :show-toggle="false"
        >
          <el-tab-pane
            label="考勤记录"
            name="attendance"
          />
          <el-tab-pane
            label="请假记录"
            name="leave"
          />
          <el-tab-pane
            label="班级轨迹"
            name="clazz"
          />
        </etm-tabs>
        <attendance
          v-if="activeName === 'attendance'"
          :child-id="childId"
        />
        <leave
          v-if="activeName === 'leave'"
          :child-id="childId"
        />
        <clazz
          v-if="activeName === 'clazz'"
          :child-id="childId"
        />
      </div>
      <div
        slot="right"
        class="rightBox"
      >
        <etm-title
          border
          size="big"
        >
          幼儿详情
          <template slot="tool">
            <el-button
              v-if="drawerType === 'detail'"
              plain
              size="mini"
              @click="editChild"
            >
              编辑
            </el-button>
            <el-button
              v-if="drawerType === 'edit'"
              plain
              size="mini"
              @click="cancel"
            >
              取消
            </el-button>
            <el-button
              v-if="drawerType === 'edit'"
              type="primary"
              size="mini"
              @click="saveChild"
            >
              保存
            </el-button>
          </template>
        </etm-title>
        <div
          v-if="drawerType === 'detail' || drawerType === 'leaveDetail'"
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
              <div>
                <span>{{ childInfo.childName }}</span>
                <span class="icon">
                  <img
                    v-if="childInfo.gender === 'MALE'"
                    src="../../../../../assets/images/guardcare/man.png"
                  >
                  <img
                    v-if="childInfo.gender === 'FEMALE'"
                    src="../../../../../assets/images/guardcare/woman.png"
                  >
                </span>
              </div>
              <div class="clazz">
                {{ childInfo.clazzName }}
              </div>
            </div>
          </div>
          <etm-title>基本信息</etm-title>
          <div>
            <etm-field-label
              type="left"
              label="生日"
            >
              {{ transferDate(childInfo.birthday) }}
            </etm-field-label>
            <etm-field-label
              type="left"
              label="国籍/地区"
            >
              {{ childInfo.nationality || '--' }}
            </etm-field-label>
            <etm-field-label
              type="left"
              label="证件信息"
            >
              {{ transferCert(childInfo.certificateType) }} {{ childInfo.certificateNumber }}
              <template v-if="!childInfo.certificateType && !childInfo.certificateNumber">
                --
              </template>
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
          </div>
          <etm-title>入园信息</etm-title>
          <div>
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
            <etm-field-label
              type="left"
              label="户口地"
            >
              {{ getArea(childInfo.householdRegisterArea) }}
            </etm-field-label>
            <etm-field-label
              type="left"
              label="入托日期"
            >
              {{ transferDate(childInfo.enrollmentTime) }}
            </etm-field-label>
            <etm-field-label
              type="left"
              label="人脸照片"
            >
              <div class="imgbox faceImg">
                <template v-if="childInfo.faceImageList">
                  <div
                    v-for="(img, index) in childInfo.faceImageList"
                    :key="index"
                    class="img"
                  >
                    <el-image
                      style=" height: 100%;
  width: 100%;"
                      :src="img.url"
                      fit="cover"
                    />
                  </div>
                </template>
                <div
                  v-else
                  class="img"
                >
                  <el-image
                    style=" height: 100%;
  width: 100%;"
                    :src="defaultFace"
                    fit="cover"
                  />
                </div>
              </div>
            </etm-field-label>
          </div>
          <etm-title>更多信息</etm-title>
          <div>
            <etm-field-label
              type="left"
              label="留守儿童"
            >
              {{ childInfo.isLeftBehindChildren ? '是' : childInfo.isLeftBehindChildren === false ? '否' : '--' }}
            </etm-field-label>
            <etm-field-label
              type="left"
              label="血型"
            >
              {{ transferBlood(childInfo.bloodType) || '--' }}
            </etm-field-label>
            <etm-field-label
              type="left"
              label="健康状况"
            >
              {{ transferHealth(childInfo.healthCondition) || '--' }}
            </etm-field-label>
            <etm-field-label
              type="left"
              label="曾患疾病"
            >
              {{ childInfo.onceSick || '--' }}
            </etm-field-label>
            <etm-field-label
              type="left"
              label="食物过敏"
            >
              {{ childInfo.foodAllergyInfo || '--' }}
            </etm-field-label>
            <etm-field-label
              type="left"
              label="药物过敏"
            >
              {{ childInfo.drugAllergyInfo || '--' }}
            </etm-field-label>
            <etm-field-label
              type="left"
              label="疫苗接种"
            >
              {{ childInfo.isCompleteVaccination ? '是' : childInfo.isCompleteVaccination === false ? '否' : '--' }}
            </etm-field-label>
            <etm-field-label
              type="left"
              label="自己吃饭"
            >
              {{ childInfo.isEatByYourself ? '是' : childInfo.isEatByYourself === false ? '否' : '--' }}
            </etm-field-label>
            <etm-field-label
              type="left"
              label="备注"
            >
              {{ childInfo.remarks || '--' }}
            </etm-field-label>
            <div
              v-if="childInfo.imageList"
              class="imgbox"
            >
              <div
                v-for="(img, index) in childInfo.imageList"
                :key="index"
                class="img"
              >
                <el-image
                  style=" height: 100%;
  width: 100%;"
                  :src="img.url"
                  fit="cover"
                  :preview-src-list="imageList"
                />
              </div>
            </div>
          </div>
        </div>
        <child-form
          v-if="drawerType === 'edit'"
          ref="addForm"
          form-type="edit"
          :form-data="formData"
          :disabled-time="disabledTime"
        />
      </div>
    </etm-layout-split>
  </div>
</template>

<script>
/**
 * detail create by Administrator
 * createTime 2020/8/27 11:16
 */

// import { getAttendanceList, getChildDetail, renewChild } from '@/api/guardcare/childManage/childManage'

import { getAttendanceList, getChildDetail, renewChild } from '@/api/newDaycare/listEduGuardChildManage'
import { parseTime } from '@/utils'
import childForm from './childForm'
import attendance from '../tabs/attendance'
import leave from '../tabs/leave'
import clazz from '../tabs/clazz'

export default {
  name: 'Detail',
  components: {
    childForm,
    attendance,
    leave,
    clazz
  },
  filters: {},
  mixins: [],
  props: {
    childId: {
      type: Number,
      default () {
        return null
      }
    },
    drawerType: {
      type: String,
      default () {
        return null
      }
    }
  },
  data () {
    return {
      editClick: false,
      activeName: 'attendance',
      childInfo: {},
      formData: {
        contactList: [
          {
            relationship: '',
            name: '',
            telephone: '',
            attendanceCardNumber: '',
            certificateNumber: ''
          }
        ],
        clazz: {
          gradeId: '',
          clazzId: ''
        },
        liveArea: {
          province: '',
          city: '',
          county: ''
        },
        birthArea: {
          province: '',
          city: '',
          county: ''
        },
        onceSick: [],
        previewSrcKey: [],
        previewSrcLists: []
      },
      disabledTime: false,
      imageList: [],
      defaultFace: require('@/assets/images/defaultFace.png')
    }
  },
  computed: {},
  watch: {
    childId () {
      this.getDetail()
    }
  },
  created () {
    this.getDetail()
  },
  mounted () {
  },
  methods: {
    getDetail () {
      if (this.childId) {
        getChildDetail({ childId: this.childId }).then(res => {
          this.childInfo = res.data
          this.formData = {
            avatar: this.childInfo.avatar, // 孩子头像
            childName: this.childInfo.childName, // 孩子姓名
            gender: this.childInfo.gender, // 孩子性别
            birthday: this.childInfo.birthday, // 孩子生日
            enrollmentTime: this.childInfo.enrollmentTime, // 入托日期
            clazz: { // 孩子年级班级
              gradeId: this.childInfo.gradeId,
              clazzId: this.childInfo.clazzId
            },
            contactList: this.childInfo.contactList, // 孩子联系人列表
            nationality: this.childInfo.nationality, // 孩子国籍
            certificateType: this.childInfo.certificateType, // 孩子证件类型
            certificateNumber: this.childInfo.certificateNumber, // 孩子证件号码
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
            },
            isLeftBehindChildren: this.childInfo.isLeftBehindChildren, // 留守儿童
            bloodType: this.childInfo.bloodType, // 孩子血型
            healthCondition: this.childInfo.healthCondition, // 孩子健康状况
            foodAllergyInfo: this.childInfo.foodAllergyInfo, // 孩子食物过敏情况
            drugAllergyInfo: this.childInfo.drugAllergyInfo, // 孩子药物过敏情况
            isCompleteVaccination: this.childInfo.isCompleteVaccination, // 疫苗接种
            isEatByYourself: this.childInfo.isEatByYourself, // 自己吃饭
            remarks: this.childInfo.remarks, // 备注
            previewSrcKey: [], // 图片上传列表
            previewSrcLists: [], // 图片上传显示列表
            faceImageSrcKey: [], // 人脸照片上传列表
            faceImageSrcLists: [] // 人脸照片上传显示列表
          }
          this.imageList = []
          if (this.childInfo.imageList) {
            this.childInfo.imageList.forEach(item => {
              this.imageList.push(item.url)
              this.formData.previewSrcKey.push(item.url)
              this.formData.previewSrcLists.push(item.url)
            })
          }
          if (this.childInfo.faceImageList) {
            this.childInfo.faceImageList.forEach(item => {
              this.formData.faceImageSrcKey.push(item.url)
              this.formData.faceImageSrcLists.push(item.url)
            })
          }
          if (this.childInfo.onceSick) { // 曾患疾病
            this.formData.onceSick = this.childInfo.onceSick.split(',')
          }
        })
        getAttendanceList({ childId: this.childId }).then(res => {
          if (res.data && res.data.length) {
            this.disabledTime = true
          } else {
            this.disabledTime = false
          }
        })
      }
    },
    editChild () {
      this.editClick = true
      this.$emit('change', 'edit')
    },
    cancel () {
      if (this.editClick) {
        this.editClick = false
        this.$emit('change', 'detail')
      } else {
        this.$emit('close')
      }
    },
    saveChild () {
      this.$refs.addForm.$refs.form.$children[0].validate(valid => { // 表单验证
        if (valid) {
          const param = {
            avatar: this.formData.avatar, // 孩子头像
            childName: this.formData.childName, // 孩子姓名
            gender: this.formData.gender, // 孩子性别
            birthday: parseTime(this.formData.birthday, '{y}-{m}-{d}'), // 孩子生日
            enrollmentTime: parseTime(this.formData.enrollmentTime, '{y}-{m}-{d}'), // 孩子生日
            clazzId: this.formData.clazz.clazzId, // 孩子班级id
            contactList: this.formData.contactList, // 孩子联系人列表
            nationality: this.formData.nationality, // 孩子国籍
            certificateType: this.formData.certificateType, // 孩子证件类型
            certificateNumber: this.formData.certificateNumber, // 孩子证件号码
            currentAreaCode: this.formData.liveArea.county, // 孩子现住地区县code
            currentAddress: this.formData.currentAddress, // 孩子详细地址
            householdRegisterAreaCode: this.formData.birthArea.county, // 孩子户籍地区县code
            isLeftBehindChildren: this.formData.isLeftBehindChildren, // 留守儿童
            bloodType: this.formData.bloodType, // 孩子血型
            healthCondition: this.formData.healthCondition, // 孩子健康状况
            foodAllergyInfo: this.formData.foodAllergyInfo, // 孩子食物过敏情况
            drugAllergyInfo: this.formData.drugAllergyInfo, // 孩子药物过敏情况
            isCompleteVaccination: this.formData.isCompleteVaccination, // 疫苗接种
            isEatByYourself: this.formData.isEatByYourself, // 自己吃饭
            remarks: this.formData.remarks, // 备注
            childId: this.childInfo.childId // 注意这里
          }
          if (this.formData.certificateNumber && this.formData.certificateNumber.length !== 15 && this.formData.certificateNumber.length !== 18) {
            this.$message.warning('幼儿身份证号格式应为15位或18位')
            return
          }
          if (this.formData.contactList[0].certificateNumber && this.formData.contactList[0].certificateNumber.length !== 15 && this.formData.contactList[0].certificateNumber.length !== 18) {
            this.$message.warning('联系人身份证号格式应为15位或18位')
            return
          }
          if (this.formData.previewSrcKey.length) { // 上传的图片
            param.imageList = []
            this.formData.previewSrcKey.forEach(item => {
              const arr = item.split('/')
              const data = {
                name: arr[arr.length - 1],
                url: item
              }
              param.imageList.push(data)
            })
          }
          if (this.formData.faceImageSrcKey.length) { // 上传的人脸图片
            param.faceImageList = []
            this.formData.faceImageSrcKey.forEach(item => {
              const arr = item.split('/')
              const data = {
                name: arr[arr.length - 1],
                url: item
              }
              param.faceImageList.push(data)
            })
          }
          if (this.formData.onceSick && this.formData.onceSick.length) { // 曾患疾病
            param.onceSick = this.formData.onceSick.join(',')
          }
          renewChild(param).then(() => {
            this.$message.success('修改幼儿成功')
            this.getDetail()
            if (this.editClick) {
              this.editClick = false
              this.$emit('change', 'detail')
              this.$emit('finish')
            } else {
              this.$emit('finish')
              this.$emit('close')
            }
          })
        }
      })
    },
    transferDate (date) {
      if (!date) {
        return ''
      } else {
        return parseTime(date, '{y}-{m}-{d}')
      }
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
    transferCert (data) {
      switch (data) {
        case 'ID_CARD':
          return '身份证'
        default:
          return data
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
    transferBlood (blood) {
      // A :A型 B :B型 AB :AB型 RH_A :RH型阳性 RH_B :RH型阴性 O :O型 OTHER :其他血型
      switch (blood) {
        case 'A':
          return 'A型'
        case 'B':
          return 'B型'
        case 'AB':
          return 'AB型'
        case 'RH_A':
          return 'RH型阳性'
        case 'RH_B':
          return 'RH型阴性'
        case 'O':
          return 'O型'
        case 'OTHER':
          return '其他血型'
        default:
          return blood
      }
    },
    transferHealth (health) {
      // HEALTH :健康 ORDINARY :一般 SICK :患病
      switch (health) {
        case 'HEALTH':
          return '健康'
        case 'ORDINARY':
          return '一般'
        case 'SICK':
          return '患病'
        default:
          return health
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.detail-wrap {
  ::v-deep .EtmLayoutSplit-wrap {
    height: 100vh;

    .layout-left {
      margin-right: 8px;
    }
  }

  ::v-deep .el-timeline-item__node--normal {
    height: 7px;
    left: 1px;
    top: 5px;
    width: 7px;
  }

  ::v-deep .el-timeline-item__tail {
    top: 5px;
  }

  .rightBox {
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
        margin-left: 16px;

        span {
          @include c_title_color();
          display: inline-block;
          font-size: 16px;
          font-weight: bold;
          height: 16px;
          line-height: 16px;
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

    .imgbox {
      display: flex;
      flex-wrap: wrap;
      padding-bottom: 16px;

      &.faceImg {
        padding: 0;

        .img {
          margin: 0;
        }
      }

      .img {
        height: 80px;
        margin: 0 8px 8px 0;
        overflow: hidden;
        width: 80px;
      }
    }
  }
}
</style>
