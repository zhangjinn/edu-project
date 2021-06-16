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
          <el-button
            slot="right"
            type="primary"
            @click="add"
          >
            <span class="iconfont iconplus" />添加幼儿
          </el-button>
          <el-dropdown slot="right">
            <el-button plain>
              更多操作<i class="el-icon-arrow-down el-icon--right" />
            </el-button>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item @click.native="importChild">
                导入幼儿信息
              </el-dropdown-item>
              <el-dropdown-item @click.native="toImportBatch">
                导入批次管理
              </el-dropdown-item>
              <el-dropdown-item
                @click.native="adjustBatch"
              >
                批量调班
              </el-dropdown-item>
              <el-dropdown-item @click.native="leaveBatch">
                批量退园
              </el-dropdown-item>
              <el-dropdown-item @click.native="exportChild">
                导出Excel
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
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
        label="入托日期"
        prop="enrollmentTime"
        sortable
        sort-by="enrollmentTime"
      >
        <template slot-scope="scoped">
          <span>{{ transferDate(scoped.row.enrollmentTime) }}</span>
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
            type="primary"
            @click="showParent(scoped.row)"
          >
            家长管理
          </etm-text>
          <!--          <etm-text-->
          <!--            type="primary"-->
          <!--            @click="edit(scoped.row)"-->
          <!--          >-->
          <!--            编辑-->
          <!--          </etm-text>-->
          <etm-text
            type="primary"
            @click="adjust(scoped.row)"
          >
            调班
          </etm-text>
          <etm-text
            type="primary"
            @click="leave(scoped.row)"
          >
            退园
          </etm-text>
          <!--          <etm-text type="danger" @click="remove(scoped.row)">删除</etm-text>-->
        </template>
      </el-table-column>
    </etm-table-page>
    <etm-pop
      v-if="smallPop"
      :visible="smallPop"
      :title="smallTitle"
      pop="simple"
      confirm-btn="确定"
      cancel-btn="取消"
      @close="smallPopClose"
      @confirm="smallPopConfirm"
      @cancel="smallPopCancel"
    >
      <div class="pop">
        <etm-form
          ref="smallForm"
          :model="smallForm"
          :rules="smallRule"
          type="dialog"
        >
          <el-form-item label="已选幼儿">
            {{ smallPopChild.childName }}
          </el-form-item>
          <template v-if="smallTitle === '调班'">
            <el-form-item label="原班级">
              {{ smallPopChild.clazzName }}
            </el-form-item>
            <el-form-item
              label="调班后班级"
              prop="clazzValue"
            >
              <etm-clazz-cascader @change="getClazz" />
            </el-form-item>
          </template>
          <template v-else-if="smallTitle === '退园'">
            <el-form-item
              label="退园原因"
              prop="outReason"
            >
              <el-select
                v-model="smallForm.outReason"
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
        </etm-form>
      </div>
    </etm-pop>
    <etm-pop
      v-if="addPop"
      :visible="addPop"
      :pop="popSize"
      :title="addTitle"
      confirm-btn="确定"
      cancel-btn="取消"
      @close="addPopClose"
      @confirm="addPopConfirm"
      @cancel="addPopCancel"
    >
      <batch-pop
        v-if="addTitle === '批量调班' || addTitle === '批量退园'"
        :batch-data="batchData"
        :type="batchType"
      />
      <child-form
        v-else-if="addTitle === '添加幼儿'"
        ref="addForm"
        form-type="add"
        :form-data="formData"
        @repeat="getRepeat"
      />
      <import-pop
        v-else-if="addTitle === '导入幼儿信息'"
        :form-data="importData"
      />
    </etm-pop>
    <etm-drawer
      :visible.sync="showDrawer"
      :type="drawerType"
      @close="closeDrawer"
    >
      <detail
        v-if="drawerPage === 'edit' || drawerPage === 'detail'"
        :child-id="childId"
        :drawer-page="drawerPage"
        @finish="finishDrawer"
        @change="changeType"
        @close="closeDrawer"
      />
      <parent-drawer
        v-else-if="showDrawer"
        :child-id="childId"
        :child-name="childName"
      />
    </etm-drawer>
  </div>
</template>

<script>
import { parseTime } from '@/utils'
import childForm from '../component/childForm'
import batchPop from '../component/batchPop'
import importPop from '../component/importPop'
import detail from '../component/childDetail'
import parentDrawer from '../component/parentDrawer'
import EtmClazzCascader from '@/views/newDaycare/childManageGuard/EtmClazzCascader'
import {
  queryChildInList,
  updateChildDeparture,
  updateChildClazz,
  createChild,
  removeChild,
  queryChildInExport,
  createChildImport
} from '@/api/newDaycare/childManageGuard'
import { downloadFileForUrl } from '@/utils/file'
import baseMixin from '@/layout/mixin/baseMixin'

export default {
  components: {
    batchPop,
    childForm,
    importPop,
    detail,
    parentDrawer,
    EtmClazzCascader
  },
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
      smallPop: false,
      smallTitle: '',
      smallForm: {},
      smallRule: {
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
      smallPopChild: {},
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
      addPop: false,
      addTitle: '',
      popSize: 'big',
      batchData: {
        value: [],
        clazz: null,
        outReason: null
      },
      batchType: '',
      formData: {},
      importData: {
        fileList: []
      },
      showDrawer: false,
      drawerType: 'small',
      childId: null,
      childName: '',
      drawerPage: '',
      childRepeat: false
    }
  },
  watch: {
    searchInfo: {
      handler () {
        this.pageNum = 1
        this.getList()
      },
      deep: true
    }
  },
  mounted () {
    this.getList()
  },
  methods: {
    getClazz (value) {
      this.smallForm.clazzValue = value
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
      queryChildInList(param).then(res => {
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
    add () { // 添加幼儿
      this.addTitle = '添加幼儿'
      this.popSize = 'complex'
      // 初始化表单数据
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
        clazz: {
          gradeId: '',
          clazzId: ''
        },
        nationality: '中国',
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
        previewSrcLists: [],
        faceImageSrcKey: [], // 人脸照片上传列表
        faceImageSrcLists: [] // 人脸照片上传显示列表
      }
      this.addPop = true
    },
    importChild () { // 导入
      this.addTitle = '导入幼儿信息'
      this.popSize = 'big'
      this.importData = {
        fileList: []
      }
      this.addPop = true
    },
    toImportBatch () { // 导入批次管理页面
      this.$router.push({
        name: 'newdaycare_childManageGuardcare_importManage'
      })
    },
    adjustBatch () { // 批量调班弹窗
      this.addTitle = '批量调班'
      this.popSize = 'complex'
      this.batchType = 'adjust'
      this.addPop = true
    },
    leaveBatch () { // 批量退园弹窗
      this.addTitle = '批量退园'
      this.popSize = 'complex'
      this.batchType = 'leave'
      this.addPop = true
    },
    exportChild () { // 导出表格
      const param = {
        paged: false
      }
      for (const i in this.searchInfo) {
        param[i] = this.searchInfo[i]
      }
      queryChildInExport(param).then(res => {
        downloadFileForUrl(res)
      })
    },
    showDetail (row) { // 幼儿详情
      this.showDrawer = true
      this.drawerType = 'big'
      this.childId = row.childId
      this.drawerPage = 'detail'
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
    edit (row) { // 表格内点击编辑
      this.showDrawer = true
      this.drawerType = 'big'
      this.childId = row.childId
      this.drawerPage = 'edit'
    },
    showParent (row) {
      this.showDrawer = true
      this.drawerType = 'small'
      this.childId = row.childId
      this.childName = row.childName
      this.drawerPage = 'parent'
    },
    adjust (row) { // 表格内点击调班
      this.smallTitle = '调班'
      this.smallPopChild = row
      this.smallForm = {
        clazzValue: []
      }
      this.smallPop = true
    },
    leave (row) { // 表格内点击退园
      this.smallTitle = '退园'
      this.smallPopChild = row
      this.smallForm = {
        outReason: ''
      }
      this.smallPop = true
    },
    remove (row) { // 删除幼儿
      this.$etmTip.init({
        type: 'error',
        title: '确认删除该数据？',
        content: '删除后将无法撤销，是否继续操作？',
        confirmBtn: '删除',
        cancelBtn: '取消',
        cancel: () => {
          this.$etmTip.close()
        },
        confirm: () => {
          removeChild({ childId: row.childId }).then(() => {
            this.$message.success('删除成功')
            this.$etmTip.close()
            this.getList()
          })
        }
      })
      this.$etmTip.open()
    },
    transferDate (date) {
      if (!date) return
      return parseTime(date, '{y}-{m}-{d}')
    },
    smallPopClose () { // 表格内退园、调班操作小弹窗关闭
      this.smallPop = false
    },
    smallPopConfirm () { // 表格内退园、调班操作小弹窗确认
      this.$refs.smallForm.$children[0].validate(valid => {
        if (valid) {
          if (this.smallTitle === '退园') {
            const param = {
              childIdList: [],
              outReason: this.smallForm.outReason
            }
            param.childIdList.push(this.smallPopChild.childId)
            updateChildDeparture(param).then(() => {
              this.$message.success('退园成功')
              this.smallPop = false
              this.getList()
            })
          } else if (this.smallTitle === '调班') {
            const param = {
              childIdList: [],
              clazzId: this.smallForm.clazzValue[1]
            }
            param.childIdList.push(this.smallPopChild.childId)
            updateChildClazz(param).then(() => {
              this.$message.success('调班成功')
              this.smallPop = false
              this.getList()
            })
          }
        }
      })
    },
    smallPopCancel () { // 表格内退园、调班操作小弹窗关闭
      this.smallPop = false
    },
    addPopClose () { // 添加幼儿大弹窗关闭
      this.addPop = false
    },
    addPopConfirm () { // 添加幼儿大弹窗确认
      if (this.addTitle === '添加幼儿') {
        this.$refs.addForm.$children[0].$children[0].validate(valid => { // 表单验证
          if (valid) {
            if (this.childRepeat) {
              this.$message.warning('幼儿已存在，不能重复添加')
            } else {
              const param = {
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
                remarks: this.formData.remarks // 备注
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
              createChild(param).then(() => {
                this.$message.success('添加幼儿成功')
                this.getList()
                this.addPop = false
              })
            }
          }
        })
      } else if (this.addTitle === '批量调班') {
        if (!this.batchData.value.length) { // 未选择幼儿
          this.$message.warning('请选择调班的幼儿')
        } else if (!this.batchData.clazz) { // 未选择班级
          this.$message.warning('请选择班级')
        } else { // 提交调班数据
          const param = {
            childIdList: [],
            clazzId: this.batchData.clazz[1]
          }
          this.batchData.value.forEach(item => {
            param.childIdList.push(item.childId)
          })
          updateChildClazz(param).then(() => {
            this.$message.success('调班成功')
            this.batchData = {}
            this.getList()
            this.addPop = false
          })
        }
      } else if (this.addTitle === '批量退园') {
        if (!this.batchData.value.length) { // 未选择幼儿
          this.$message.warning('请选择退园的幼儿')
        } else if (!this.batchData.outReason) { // 未选择退园原因
          this.$message.warning('请选择退园原因')
        } else { // 提交退园数据
          const param = {
            childIdList: [],
            outReason: this.batchData.outReason
          }
          this.batchData.value.forEach(item => {
            param.childIdList.push(item.childId)
          })
          updateChildDeparture(param).then(() => {
            this.$message.success('退园成功')
            this.getList()
            this.addPop = false
          })
        }
      } else if (this.addTitle === '导入幼儿信息') {
        if (!this.importData.fileList.length) {
          this.$message.warning('请选择文件')
        } else {
          createChildImport(this.importData.fileList[0]).then(res => {
            this.addPop = false
            this.getList()
            const data = res.data
            this.$etmTip.init({
              type: 'success',
              title: '幼儿信息导入完成',
              content: '导入成功数据' + data.successCount + '条，导入失败数据' + data.failedCount + '条。',
              confirmBtn: '查看详情',
              cancelBtn: '取消',
              cancel: () => {
                this.$etmTip.close()
              },
              confirm: () => {
                this.$etmTip.close()
                sessionStorage.setItem('checkBatch', data.batchId)
                this.$router.push({
                  name: 'newdaycare_childManageGuardcare_importManage'
                })
              }
            })
            this.$etmTip.open()
          })
        }
      }
    },
    addPopCancel () { // 大弹窗关闭
      this.addPop = false
    },
    getRepeat (val) {
      this.childRepeat = val
    }
  }
}
</script>

<style lang="scss" scoped>
.leaveTips {
  margin-bottom: 16px;
}

.iconplus {
  font-size: 14px;
}
</style>
