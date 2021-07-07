<template>
  <div class="table">
    <etm-table-page
      :columns="columns"
      :data="tableData"
      index
      @currentChange="currentChange"
    >
      <etm-table-tool-bar slot="tool">
        <div slot="right">
          <el-button type="primary" @click="scan">扫码登记
          </el-button>
        </div>
      </etm-table-tool-bar>
      <el-table-column slot="left" label="幼儿姓名" prop="childName" />
      <el-table-column slot="left" label="性别">
        <template slot-scope="scoped">
          <span>{{ transferGender(scoped.row.gender) }}</span>
        </template>
      </el-table-column>
      <el-table-column slot="right" label="登记日期">
        <template slot-scope="scoped">
          <span>{{ transferDate(scoped.row.registrationDate) }}</span>
        </template>
      </el-table-column>
      <el-table-column slot="right" label="操作" width="200">
        <template slot-scope="scoped">
          <etm-text type="primary" @click="aduit(scoped.row)">入园审核
          </etm-text>
        </template>
      </el-table-column>
    </etm-table-page>
    <etm-drawer
      :visible.sync="showSide"
      type="big"
      @close="closeSide"
    >
      <div class="auditDrawer">
        <etm-layout-split>
          <etm-title :show-line="false" border size="big">入园审核
            <template slot="tool">
              <el-button plain size="mini" @click="closeSide">取消</el-button>
              <el-button type="primary" size="mini" @click="saveChild">保存</el-button>
            </template>
          </etm-title>
          <child-form ref="childForm" :form-data="formData" />
        </etm-layout-split>
      </div>
    </etm-drawer>
  </div>
</template>

<script>
import { parseTime } from '@/utils'
import childForm from '../component/childForm'
import {
  updateChildEnrollmentAudit,
  queryChildById,
  queryChildPendingList
} from '@/api/newDaycare/childManageGuard'

export default {
  components: {
    childForm
  },
  props: {
    searchInfo: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  data() {
    return {
      columns: [
        {
          label: '联系人姓名',
          prop: 'parentName'
        },
        {
          label: '联系电话',
          prop: 'telephone'
        }
      ],
      pageNum: 1,
      pageSize: 10,
      tableData: {
        content: []
      },
      showSide: false,
      childInfo: {},
      formData: {
        contactList: [ // 联系人
          {
            relationship: '',
            name: '',
            telephone: '',
            attendanceCardNumber: ''
          }
        ],
        clazz: { // 班级
          gradeId: '',
          clazzId: ''
        },
        liveArea: { // 现住地
          province: '',
          city: '',
          county: ''
        },
        birthArea: { // 户籍地
          province: '',
          city: '',
          county: ''
        },
        onceSick: [],
        previewSrcKey: [],
        previewSrcLists: []
      }
    }
  },
  watch: {
    searchInfo: {
      handler() {
        this.pageNum = 1
        this.getList()
      },
      deep: true
    }
  },
  mounted() {
    this.getList()
  },
  methods: {
    getList() {
      const param = {}
      param.pageNum = this.pageNum
      param.pageSize = this.pageSize
      for (const i in this.searchInfo) {
        param[i] = this.searchInfo[i]
      }
      queryChildPendingList(param).then(res => {
        this.tableData = res.data
      })
    },
    currentChange(pageNum, pageSize) {
      this.pageNum = pageNum
      this.pageSize = pageSize
      this.getList()
    },
    transferGender(data) {
      switch (data) {
        case 'MALE':
          return '男'
        case 'FEMALE':
          return '女'
        default:
          return data
      }
    },
    scan() {
      this.$router.push({
        path: '/newdaycare_childManageGuardcare/register'
      })
    },
    aduit(row) {
      queryChildById({ childId: row.childId }).then(res => {
        this.showSide = true
        this.childInfo = res.data
        this.formData = {
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
          previewSrcLists: [] // 图片上传显示列表
        }
        if (this.childInfo.imageList) {
          this.childInfo.imageList.forEach(item => {
            this.formData.previewSrcKey.push(item.url)
            this.formData.previewSrcLists.push(item.url)
          })
        }
        if (this.childInfo.onceSick) { // 曾患疾病
          this.formData.onceSick = this.childInfo.onceSick.split(',')
        }
      })
    },
    transferDate(date) {
      if (!date) return
      return parseTime(date, '{y}-{m}-{d}')
    },
    closeSide() {
      this.showSide = false
    },
    saveChild() { // 入园审核
      this.$refs.childForm.$children[0].$children[0].validate(valid => {
        if (valid) {
          const param = {
            childId: this.childInfo.childId,
            childName: this.formData.childName, // 孩子姓名
            gender: this.formData.gender, // 孩子性别
            birthday: parseTime(this.formData.birthday, '{y}-{m}-{d}'), // 孩子生日
            enrollmentTime: parseTime(this.formData.enrollmentTime, '{y}-{m}-{d}'), // 入托日期
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
            remarks: this.formData.remarks // 备注
          }
          if (this.formData.certificateNumber && this.formData.certificateNumber.length !== 15 && this.formData.certificateNumber.length !== 18) {
            this.$message.warning('身份证号格式错误')
            return
          }
          if (this.formData.previewSrcKey.length) {
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
          if (this.formData.onceSick && this.formData.onceSick.length) {
            param.onceSick = this.formData.onceSick.join(',')
          }
          updateChildEnrollmentAudit(param).then(() => {
            this.$message.success('审核成功')
            this.showSide = false
            this.getList()
          })
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.auditDrawer {
  max-height: 100vh;
  overflow-y: auto;
}
</style>
