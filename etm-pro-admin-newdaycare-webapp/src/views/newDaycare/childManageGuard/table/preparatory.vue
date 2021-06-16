<template>
  <div class="preparatory-wrap">
    <etm-table-page
      :data="tableData"
      :columns="columns"
      index
      @currentChange="currentChange"
    >
      <etm-table-tool-bar slot="tool">
        <div slot="right">
          <el-button
            slot="right"
            type="primary"
            @click="add"
          >
            <span class="iconfont iconplus" />添加预备生
          </el-button>
        </div>
      </etm-table-tool-bar>
      <el-table-column
        slot="left"
        label="幼儿姓名"
        fixed="left"
      >
        <template slot-scope="scoped">
          <a @click="showDetail(scoped.row)">{{ scoped.row.childName }}</a>
        </template>
      </el-table-column>
      <el-table-column
        slot="left"
        label="性别"
      >
        <template slot-scope="scoped">
          <span>{{ transferGender(scoped.row.gender) }}</span>
        </template>
      </el-table-column>
      <el-table-column
        slot="right"
        label="登记日期"
      >
        <template slot-scope="scoped">
          <span>{{ transferDate(scoped.row.createTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column
        slot="right"
        label="操作"
        width="200"
      >
        <template slot-scope="scoped">
          <etm-text
            type="primary"
            @click="aduit(scoped.row)"
          >
            入园审核
          </etm-text>
        </template>
      </el-table-column>
    </etm-table-page>
    <etm-pop
      pop="complex"
      title="添加预备生"
      :visible="showPop"
      @cancel="showPop = false"
      @close="showPop = false"
      @confirm="addChildConfirm"
    >
      <preparatory-form
        ref="preparatoryForm"
        :form-data="formData"
      />
    </etm-pop>
    <etm-drawer
      :visible.sync="showDrawer"
      :type="drawerType"
    >
      <div
        v-if="drawerPage === 'aduit'"
        class="auditDrawer"
      >
        <etm-layout-split>
          <etm-title
            :show-line="false"
            border
            size="big"
          >
            入园审核
            <template slot="tool">
              <el-button
                plain
                size="mini"
                @click="closeDrawer"
              >
                取消
              </el-button>
              <el-button
                type="primary"
                size="mini"
                @click="saveChild"
              >
                保存
              </el-button>
            </template>
          </etm-title>
          <child-form
            v-if="showDrawer"
            ref="childForm"
            :form-data="aduitData"
          />
        </etm-layout-split>
      </div>
      <preparatory-detail
        v-else-if="drawerPage === 'preparatoryDetail' || drawerPage === 'preparatoryEdit'"
        :child-id="childId"
        :drawer-page="drawerPage"
        @finish="finishDrawer"
        @change="changeType"
        @close="closeDrawer"
      />
    </etm-drawer>
  </div>
</template>

<script>
import { parseTime } from '@/utils'
import baseMixin from '@/layout/mixin/baseMixin'
import {
  createGuardPreparatory, queryChildById,
  queryGuardPreparetoryList,
  updateChildEnrollmentAudit
} from '@/api/newDaycare/childManageGuard'
import preparatoryForm from '@/views/newDaycare/childManageGuard/component/preparatoryForm'
import preparatoryDetail from '@/views/newDaycare/childManageGuard/component/preparatoryDetail'
import childForm from '@/views/newDaycare/childManageGuard/component/childForm'

/**
 * preparatory create by Administrator
 * createTime 2021/3/10 18:25
 */
export default {
  name: 'Preparatory',
  components: {
    preparatoryForm,
    preparatoryDetail,
    childForm
  },
  filters: {},
  mixins: [baseMixin],
  props: {
    searchInfo: {
      type: Object,
      default () {
        return {}
      }
    }
  },
  data () {
    return {
      pageNum: 1,
      pageSize: 10,
      tableData: {
        content: []
      },
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
      showPop: false,
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
        liveArea: {
          province: '',
          city: '',
          county: ''
        },
        birthArea: {
          province: '',
          city: '',
          county: ''
        }
      },
      showDrawer: false,
      drawerType: 'small',
      childId: '',
      drawerPage: '',
      childInfo: {},
      aduitData: {
        contactList: [ // 联系人
          {
            relationship: '',
            name: '',
            telephone: '',
            attendanceCardNumber: '',
            certificateNumber: ''
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
  computed: {},
  watch: {
    searchInfo: {
      handler () {
        this.pageNum = 1
        this.getList()
      },
      deep: true
    }
  },
  created () {
  },
  mounted () {
    this.getList()
  },
  methods: {
    currentChange (pageNum, pageSize) {
      this.pageNum = pageNum
      this.pageSize = pageSize
      this.getList()
    },
    getList () {
      const param = {}
      param.pageNum = this.pageNum
      param.pageSize = this.pageSize
      for (const i in this.searchInfo) {
        param[i] = this.searchInfo[i]
      }
      queryGuardPreparetoryList(param).then(res => {
        this.tableData = res.data
      })
    },
    transferGender (data) {
      switch (data) {
        case 'MALE':
          return '男'
        case 'FEMALE':
          return '女'
        default:
          return data
      }
    },
    transferDate (date) {
      if (!date) return
      return parseTime(date, '{y}-{m}-{d}')
    },
    showDetail (row) {
      this.childId = row.childId
      this.drawerType = 'small'
      this.drawerPage = 'preparatoryDetail'
      this.showDrawer = true
    },
    finishDrawer () {
      this.getList()
    },
    changeType (type) {
      this.drawerPage = type
    },
    closeDrawer () {
      this.showDrawer = false
    },
    aduit (row) {
      queryChildById({ childId: row.childId }).then(res => {
        this.drawerType = 'big'
        this.drawerPage = 'aduit'
        this.showDrawer = true
        this.childInfo = res.data
        this.aduitData = {
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
        if (this.childInfo.imageList) {
          this.childInfo.imageList.forEach(item => {
            this.aduitData.previewSrcKey.push(item.url)
            this.aduitData.previewSrcLists.push(item.url)
          })
        }
        if (this.childInfo.onceSick) { // 曾患疾病
          this.aduitData.onceSick = this.childInfo.onceSick.split(',')
        }
      })
    },
    saveChild () {
      this.$refs.childForm.$children[0].$children[0].validate(valid => {
        if (valid) {
          console.log(this.aduitData.clazz)
          const param = {
            childId: this.childInfo.childId,
            childName: this.aduitData.childName, // 孩子姓名
            gender: this.aduitData.gender, // 孩子性别
            birthday: parseTime(this.aduitData.birthday, '{y}-{m}-{d}'), // 孩子生日
            enrollmentTime: parseTime(this.aduitData.enrollmentTime, '{y}-{m}-{d}'), // 入托日期
            clazzId: this.aduitData.clazz.clazzId, // 孩子班级id
            contactList: this.aduitData.contactList, // 孩子联系人列表
            nationality: this.aduitData.nationality, // 孩子国籍
            certificateType: this.aduitData.certificateType, // 孩子证件类型
            certificateNumber: this.aduitData.certificateNumber, // 孩子证件号码
            currentAreaCode: this.aduitData.liveArea.county, // 孩子现住地区县code
            currentAddress: this.aduitData.currentAddress, // 孩子详细地址
            householdRegisterAreaCode: this.aduitData.birthArea.county, // 孩子户籍地区县code
            isLeftBehindChildren: this.aduitData.isLeftBehindChildren, // 留守儿童
            bloodType: this.aduitData.bloodType, // 孩子血型
            healthCondition: this.aduitData.healthCondition, // 孩子健康状况
            foodAllergyInfo: this.aduitData.foodAllergyInfo, // 孩子食物过敏情况
            drugAllergyInfo: this.aduitData.drugAllergyInfo, // 孩子药物过敏情况
            isCompleteVaccination: this.aduitData.isCompleteVaccination, // 疫苗接种
            isEatByYourself: this.aduitData.isEatByYourself, // 自己吃饭
            remarks: this.aduitData.remarks // 备注
          }
          if (this.aduitData.certificateNumber && this.aduitData.certificateNumber.length !== 15 && this.aduitData.certificateNumber.length !== 18) {
            this.$message.warning('幼儿身份证号格式应为15位或18位')
            return
          }
          if (this.aduitData.contactList[0].certificateNumber && this.aduitData.contactList[0].certificateNumber.length !== 15 && this.aduitData.contactList[0].certificateNumber.length !== 18) {
            this.$message.warning('联系人身份证号格式应为15位或18位')
            return
          }
          if (this.aduitData.previewSrcKey.length) {
            param.imageList = []
            this.aduitData.previewSrcKey.forEach(item => {
              const arr = item.split('/')
              const data = {
                name: arr[arr.length - 1],
                url: item
              }
              param.imageList.push(data)
            })
          }
          if (this.aduitData.faceImageSrcKey.length) { // 上传的人脸图片
            param.faceImageList = []
            this.aduitData.faceImageSrcKey.forEach(item => {
              const arr = item.split('/')
              const data = {
                name: arr[arr.length - 1],
                url: item
              }
              param.faceImageList.push(data)
            })
          }
          if (this.aduitData.onceSick && this.aduitData.onceSick.length) {
            param.onceSick = this.aduitData.onceSick.join(',')
          }
          updateChildEnrollmentAudit(param).then(() => {
            this.$message.success('审核成功')
            this.showDrawer = false
            this.getList()
          })
        }
      })
    },
    add () {
      this.formData = {
        contactList: [
          {
            relationship: '',
            name: '',
            telephone: '',
            attendanceCardNumber: '',
            certificateNumber: ''
          }
        ],
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
        dateCharge: new Date()
      }
      this.showPop = true
    },
    addChildConfirm () {
      this.$refs.preparatoryForm.$refs.form.$children[0].validate(valid => {
        if (valid) {
          const param = {
            childName: this.formData.childName, // 孩子姓名
            gender: this.formData.gender, // 孩子性别
            birthday: parseTime(this.formData.birthday, '{y}-{m}-{d}'), // 孩子生日
            currentAreaCode: this.formData.liveArea.county, // 孩子现住地区县code
            currentAddress: this.formData.currentAddress, // 孩子详细地址
            householdRegisterAreaCode: this.formData.birthArea.county, // 孩子户籍地区县code
            contactList: this.formData.contactList, // 孩子联系人列表
            earnestMoney: {
              money: this.formData.money,
              paymentType: this.formData.paymentType,
              remark: this.formData.remark,
              dateCharge: parseTime(this.formData.dateCharge, '{y}-{m}-{d}')
            }
          }
          createGuardPreparatory(param).then(() => {
            this.$message.success('预备生添加成功')
            this.showPop = false
            this.getList()
          })
        }
      })
    }
  }
}
</script>
<style lang="scss" scoped>
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
}
</style>
