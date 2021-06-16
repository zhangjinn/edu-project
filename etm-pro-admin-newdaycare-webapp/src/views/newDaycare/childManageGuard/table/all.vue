<template>
  <div class="all-wrap">
    <etm-table-page
      :columns="columns"
      :data="tableData"
      index
      @currentChange="currentChange"
    >
      <el-table-column
        slot="left"
        label="幼儿姓名"
        fixed="left"
        width="120"
      >
        <template slot-scope="scoped">
          <a @click="showDetail(scoped.row)">{{ scoped.row.childName }}</a>
        </template>
      </el-table-column>
      <el-table-column
        slot="left"
        label="性别"
        width="90"
      >
        <template slot-scope="scoped">
          <span>{{ transferGender(scoped.row.gender) }}</span>
        </template>
      </el-table-column>
      <el-table-column
        slot="right"
        label="入托日期"
        width="150"
      >
        <template slot-scope="scoped">
          <span>{{ transferDate(scoped.row.enrollmentTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column
        slot="right"
        label="状态"
        width="120"
      >
        <template slot-scope="scoped">
          <span>{{ transferStatus(scoped.row.status) }}</span>
        </template>
      </el-table-column>
      <el-table-column
        slot="right"
        label="退园时间"
        width="150"
      >
        <template slot-scope="scoped">
          <span>{{ transferDate(scoped.row.leavingDate) }}</span>
        </template>
      </el-table-column>
      <el-table-column
        slot="right"
        label="退园原因"
        width="120"
      >
        <template slot-scope="scoped">
          <span>{{ transferReason(scoped.row.outReason) }}</span>
        </template>
      </el-table-column>
      <el-table-column
        slot="right"
        label="操作"
        fixed="right"
        width="240"
      >
        <template slot-scope="scoped">
          <etm-text
            v-if="scoped.row.status === 'PREPARATORY_STUDENT'"
            type="primary"
            @click="aduit(scoped.row)"
          >
            入园审核
          </etm-text>
          <etm-text
            v-if="scoped.row.status === 'IN'"
            type="primary"
            @click="showParent(scoped.row)"
          >
            家长管理
          </etm-text>
          <!--          <etm-text-->
          <!--            v-if="scoped.row.status === 'IN'"-->
          <!--            type="primary"-->
          <!--            @click="edit(scoped.row)"-->
          <!--          >-->
          <!--            编辑-->
          <!--          </etm-text>-->
          <etm-text
            v-if="scoped.row.status === 'IN'"
            type="primary"
            @click="adjust(scoped.row)"
          >
            调班
          </etm-text>
          <etm-text
            v-if="scoped.row.status === 'IN'"
            type="primary"
            @click="leave(scoped.row)"
          >
            退园
          </etm-text>
          <etm-text
            v-if="scoped.row.status === 'OUT'"
            type="primary"
            @click="enterAgain(scoped.row)"
          >
            重新入园
          </etm-text>
        </template>
      </el-table-column>
    </etm-table-page>
    <etm-pop
      v-if="popVisible"
      :visible="popVisible"
      :title="popTitle"
      pop="simple"
      confirm-btn="确定"
      cancel-btn="取消"
      @close="handlePopClose"
      @confirm="handlePopConfirm"
      @cancel="handlePopCancel"
    >
      <div class="pop">
        <etm-form
          ref="popForm"
          :model="popForm"
          :rules="popRule"
          type="dialog"
        >
          <el-form-item label="已选幼儿">
            {{ popChildData.childName }}
          </el-form-item>
          <template v-if="popTitle === '调班'">
            <el-form-item label="原班级">
              {{ popChildData.clazzName }}
            </el-form-item>
            <el-form-item
              label="调班后班级"
              prop="clazzValue"
            >
              <etm-clazz-cascader @change="getClazz" />
            </el-form-item>
          </template>
          <template v-else-if="popTitle === '退园'">
            <el-form-item
              label="退园原因"
              prop="outReason"
            >
              <el-select
                v-model="popForm.outReason"
                placeholder="请选择退园原因"
              >
                <el-option
                  v-for="(reason, i) in reasonList"
                  :key="i"
                  :label="reason.label"
                  :value="reason.value"
                />
              </el-select>
            </el-form-item>
            <div class="leaveTips">
              1. 退园后，该幼儿将会被移除本幼儿园，家长不能查看班级及幼儿园的信息。
            </div>
            <div class="leaveTips">
              2. 如果幼儿信息录错，请在【在园宝贝】信息后点击“编辑”。
            </div>
          </template>
          <template v-else-if="popTitle === '重新入园'">
            <el-form-item
              label="选择班级"
              prop="clazzValue"
            >
              <etm-clazz-cascader @change="getClazz" />
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
                v-model="popForm.enrollmentTime"
                type="date"
                placeholder="请选择入托日期"
                :clearable="false"
              />
            </el-form-item>
          </template>
        </etm-form>
      </div>
    </etm-pop>
    <etm-drawer
      :visible.sync="showDrawer"
      :type="drawerType"
      @close="closeDrawer"
    >
      <div v-if="drawerPage === 'aduit'">
        <etm-layout-split>
          <etm-title
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
      <detail
        v-if="drawerPage === 'edit' || drawerPage === 'detail' || drawerPage === 'leaveDetail'"
        :child-id="childId"
        :drawer-page="drawerPage"
        @finish="finishDrawer"
        @change="changeType"
        @close="closeDrawer"
      />
      <parent-drawer
        v-else-if="drawerPage === 'parent'"
        :child-id="childId"
        :child-name="childName"
      />
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
import detail from '../component/childDetail'
import parentDrawer from '../component/parentDrawer'
import EtmClazzCascader from '@/views/newDaycare/childManageGuard/EtmClazzCascader'
import childForm from '../component/childForm'
import preparatoryDetail from '@/views/newDaycare/childManageGuard/component/preparatoryDetail'
import {
  queryAllGuardChild,
  queryChildById,
  updateChildAdmission,
  updateChildClazz,
  updateChildDeparture,
  updateChildEnrollmentAudit
} from '@/api/newDaycare/childManageGuard'

/**
 * all create by Administrator
 * createTime 2021/3/10 18:24
 */
export default {
  name: 'All',
  components: {
    detail,
    parentDrawer,
    EtmClazzCascader,
    childForm,
    preparatoryDetail
  },
  filters: {},
  mixins: [],
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
      columns: [
        {
          label: '家长姓名',
          prop: 'parentName'
        },
        {
          label: '联系电话',
          prop: 'telephone'
        },
        {
          label: '班级',
          prop: 'clazzName'
        }
      ],
      pageNum: 1,
      pageSize: 10,
      tableData: {
        content: []
      },
      popVisible: false,
      popTitle: '',
      popForm: {},
      popChildData: {},
      popRule: {
        clazzValue: [{
          required: true,
          trigger: 'change',
          validator: (rule, value, callback) => {
            if (!value || !value.length) {
              callback(new Error('班级不能为空'))
            } else {
              callback()
            }
          }
        }],
        outReason: [{ required: true, message: '退园原因不能为空', trigger: 'change' }]
      },
      reasonList: [
        {
          label: '毕业退园',
          value: 'GRADUATION'
        },
        {
          label: '转校退园',
          value: 'TRANSFER'
        },
        {
          label: '其他原因',
          value: 'OTHER'
        }
      ],
      outReason: '',
      showDrawer: false,
      drawerType: 'small',
      childId: null,
      childName: '',
      drawerPage: '',
      aduitData: {},
      childInfo: {}
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
    getClazz (value) {
      this.popForm.clazzValue = value
    },
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
      queryAllGuardChild(param).then(res => {
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
    transferReason (data) {
      switch (data) {
        case 'GRADUATION':
          return '毕业退园'
        case 'TRANSFER':
          return '转校退园'
        case 'OTHER':
          return '其他原因'
        default:
          return data
      }
    },
    transferDate (date) {
      if (!isNaN(date)) {
        return parseTime(date, '{y}-{m}-{d}')
      } else {
        return date
      }
    },
    transferStatus (status) {
      switch (status) {
        case 'IN':
          return '在园'
        case 'OUT':
          return '退园'
        case 'PREPARATORY_STUDENT':
          return '预备生'
        default:
          return status
      }
    },
    showDetail (row) {
      this.childId = row.childId
      if (row.status === 'IN') {
        this.drawerType = 'big'
        this.drawerPage = 'detail'
        this.showDrawer = true
      } else if (row.status === 'OUT') {
        this.drawerType = 'big'
        this.drawerPage = 'leaveDetail'
        this.showDrawer = true
      } else {
        this.drawerType = 'small'
        this.drawerPage = 'preparatoryDetail'
        this.showDrawer = true
      }
    },
    finishDrawer () {
      this.getList()
    },
    changeType (type) {
      this.drawerPage = type
    },
    closeDrawer () {
      this.drawerType = ''
      this.drawerPage = ''
      this.showDrawer = false
    },
    aduit (row) {
      queryChildById({ childId: row.childId }).then(res => {
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
        this.drawerType = 'big'
        this.drawerPage = 'aduit'
        this.showDrawer = true
      })
    },
    showParent (row) {
      this.childId = row.childId
      this.childName = row.childName
      this.drawerType = 'small'
      this.drawerPage = 'parent'
      this.showDrawer = true
    },
    edit (row) {
      this.childId = row.childId
      this.drawerType = 'big'
      this.drawerPage = 'edit'
      this.showDrawer = true
    },
    adjust (row) {
      this.popTitle = '调班'
      this.popForm = {
        clazzValue: []
      }
      this.popChildData = row
      this.popVisible = true
    },
    leave (row) {
      this.popTitle = '退园'
      this.popForm = {}
      this.popChildData = row
      this.popVisible = true
    },
    enterAgain (row) {
      this.popTitle = '重新入园'
      this.popForm = {
        clazzValue: []
      }
      this.popChildData = row
      this.popVisible = true
    },
    handlePopClose () {
      this.popTitle = ''
      this.popVisible = false
    },
    handlePopConfirm () {
      this.$refs.popForm.$children[0].validate(valid => {
        if (valid) {
          if (this.popTitle === '退园') {
            const param = {
              childIdList: [],
              outReason: this.popForm.outReason
            }
            param.childIdList.push(this.popChildData.childId)
            updateChildDeparture(param).then(() => {
              this.$message.success('退园成功')
              this.popVisible = false
              this.getList()
            })
          } else if (this.popTitle === '调班') {
            const param = {
              childIdList: [],
              clazzId: this.popForm.clazzValue[1]
            }
            param.childIdList.push(this.popChildData.childId)
            updateChildClazz(param).then(() => {
              this.$message.success('调班成功')
              this.popVisible = false
              this.getList()
            })
          } else if (this.popTitle === '重新入园') {
            const param = {
              childIdList: [],
              clazzId: this.popForm.clazzValue[1],
              enrollmentTime: parseTime(this.popForm.enrollmentTime, '{y}-{m}-{d}')
            }
            param.childIdList.push(this.popChildData.childId)
            updateChildAdmission(param).then(() => {
              this.$message.success('入园成功')
              this.popVisible = false
              this.getList()
            })
          }
        }
      })
    },
    handlePopCancel () {
      this.popTitle = ''
      this.popVisible = false
    },
    saveChild () { // 入园审核
      this.$refs.childForm.$refs.form.$children[0].validate(valid => {
        if (valid) {
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
    }
  }
}
</script>
<style lang="scss" scoped>
.all-wrap {
  /*style*/
}
</style>
