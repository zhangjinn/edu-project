<template>
  <div class="staffOn-table-wrap">
    <etm-table-page
      :data="tableData"
      :columns="columns"
      @currentChange="currentChange"
    >
      <etm-table-tool-bar slot="tool">
        <etm-table-digit :data="storeDetailTipData" />
        <div slot="right">
          <el-button
            type="primary"
            @click="handleAdd"
          >
            <i class="el-icon-plus" />&nbsp;&nbsp;添加员工档案
          </el-button>
          <el-button
            type="primary"
            @click="updateOrg"
          >
            &nbsp;从组织架构同步
          </el-button>
        </div>
      </etm-table-tool-bar>
      <template slot="left">
        <el-table-column
          prop="photo"
          label="员工照片"
          width="130px"
          fixed
          show-overflow-tooltip
        >
          <template v-slot="scoped">
            <img
              v-if="scoped.row.avatar && scoped.row.avatar!== '--'"
              style="border-radius: 4px;
  height: 100px;
  width: 100px;"
              :src="scoped.row.avatar"
            >
            <img
              v-else
              style="border-radius: 4px;
  height: 100px;
  width: 100px;"
              src="@/assets/images/newDaycare/photo.png"
            >
          </template>
        </el-table-column>
        <el-table-column
          slot="left"
          label="员工姓名"
        >
          <template v-slot="scoped">
            <etm-text
              type="primary"
              @click="handleDetail(scoped.row.employeeRecordId)"
            >
              {{ scoped.row.employeeRecordName }}
            </etm-text>
          </template>
        </el-table-column>
      </template>
      <template slot="right">
        <el-table-column label="操作">
          <template v-slot="scoped">
            <etm-text
              type="primary"
              @click="handleEdit(scoped.row.employeeRecordId, true)"
            >
              编辑
            </etm-text>
            <etm-text
              type="danger"
              @click="handleResign(scoped.row)"
            >
              离职
            </etm-text>
            <etm-text
              type="danger"
              @click="handleRemove(scoped.row.employeeRecordId)"
            >
              删除
            </etm-text>
          </template>
        </el-table-column>
      </template>
    </etm-table-page>

    <etm-pop
      :visible="isShowAddPopup"
      pop="big"
      title="添加员工档案"
      confirm-btn="确定"
      cancel-btn="取消"
      @close="popCloseAdd"
      @cancel="popCloseAdd"
      @confirm="popConfirmAdd"
    >
      <add
        v-if="isShowAddPopup"
        ref="add"
      />
    </etm-pop>

    <etm-drawer
      :visible.sync="isShowEditPopup"
      type="big"
    >
      <etm-layout-split line>
        <etm-title
          :title="drawerTitle"
          border
          size="big"
        >
          <template
            v-if="isShowEditPopup && drawerType==='edit'"
            slot="tool"
          >
            <el-button
              plain
              size="mini"
              @click="popCloseEdit"
            >
              取消
            </el-button>
            <el-button
              type="primary"
              size="mini"
              @click="popConfirmEdit"
            >
              保存
            </el-button>
          </template>
          <template
            v-if="isShowEditPopup && drawerType==='detail'"
            slot="tool"
          >
            <el-button
              plain
              size="mini"
              @click="handleEdit"
            >
              编辑
            </el-button>
          </template>
        </etm-title>
        <div class="drawerBody">
          <detail
            v-if="isShowEditPopup && drawerType==='detail'"
            :employee-record-id="employeeRecordId"
            :employee-detail-data="employeeDetailData"
          />
          <edit
            v-else
            ref="edit"
            :type="drawerType"
            :employee-record-id="employeeRecordId"
            :employee-detail-data="employeeDetailData"
          />
        </div>
      </etm-layout-split>
    </etm-drawer>

    <etm-pop
      pop="simple"
      :visible.sync="isShowResignPopup"
      title="离职"
      @cancel="cancelResign"
      @close="cancelResign"
      @confirm="handleConfirmResign"
    >
      <resign
        ref="resign"
        :resign-data="resignData"
      />
    </etm-pop>
  </div>
</template>

<script>
/**
 * staffOn-table create by Administrator
 * createTime 2021/1/28 10:27
 */
// import EtmTableDigit from '@/components/EtmTableDigit'
import edit from './drawer/edit'
import detail from './drawer/detail'
import add from './popup/add'
import resign from '@/views/newDaycare/listDataManage/staffFile/components/popup/resign'
import { queryStaffList, queryStaffDetail, createStaff, removeStaff, updateStaff, updateStaffResign, updateOrganization, queryStaffAverage } from '@/api/newDaycare/staffFile'
import { parseTime } from '@/utils'
import StaffMixin from '../staffMixin'
import baseMixin from '@/layout/mixin/baseMixin'
import { uploadFile } from '@/api/base'
import { queryAreaInfoByAreaId } from '@/api/base/base'
import { validPhoneNumber } from '@/utils/validate'
export default {
  name: 'StaffOnTable',
  components: {
    // EtmTableDigit,
    edit,
    detail,
    add,
    resign
  },
  filters: {},
  mixins: [StaffMixin, baseMixin],
  props: {
    storeDetailTipData: {
      type: Array,
      default: () => {
        return []
      }
    }
  },
  data () {
    return {
      drawerPath: false,
      isShowAddPopup: false,
      isShowEditPopup: false,
      isShowResignPopup: false,
      drawerType: 'edit',
      drawerTitle: '员工详情',
      formData: [],
      search: {},
      pageInfo: {
        pageNum: 1,
        pageSize: 10
        // paged: true
      },
      tableData: {
        content: []
      },
      columns: [
        {
          label: '性别',
          prop: 'gender'
        },
        {
          label: '年龄',
          prop: 'age'
        },
        {
          label: '岗位',
          prop: 'positionName'
        },
        {
          label: '学历',
          prop: 'education'
        },
        {
          label: '入职时间',
          prop: 'entryTime'
        },
        {
          label: '入职时长',
          prop: 'entryDay'
        },
        {
          label: '户口所在地',
          prop: 'areaCode'
        },
        {
          label: '手机号码',
          prop: 'telephone'
        }
      ],
      eductionEnum: {
        primary_school: '小学',
        junior_high_school: '初中',
        high_school: '高中',
        technical_secondary_school: '中专',
        college: '大专',
        undergraduate: '本科',
        graduate_student: '研究生',
        doctoral: '博士',
        postdoctoral: '博士后'
      },
      employeeDetailData: {},
      resignData: {},
      employeeRecordId: undefined,
      digitalData: [
        { digit: 1, text: '员工总数' },
        { digit: 1, text: '平均年龄' },
        { digit: 1, text: '员工在职时长' }
      ]
    }
  },
  computed: {},
  watch: {},
  created () {
  },
  mounted () {
    this.init()
  },
  methods: {
    async init () {
      const params = Object.assign({
        resignStatus: false, // 在职状态
        employeeName: this.getValueByProp('employeeName', this.formData) ? this.getValueByProp('employeeName', this.formData) : '',
        telephone: this.getValueByProp('telephone', this.formData) ? this.getValueByProp('telephone', this.formData) : '',
        positionId: this.getValueByProp('positionId', this.formData) ? this.getValueByProp('positionId', this.formData) : ''
      }, this.pageInfo)
      // console.log(params, 'params55555')
      await queryStaffList(params).then(res => {
        this.tableData = res.data
        const result = res.data.content
        result.forEach(async (cur, index) => {
          result[index].gender = cur.gender === null ? '--' : cur.gender === 'MALE' ? '男' : '女'
          result[index].entryTime = cur.entryTime && parseTime(cur.entryTime, '{y}-{m}-{d}')
          result[index].entryDay = cur.entryDay === null ? '--' : cur.entryDay
          result[index].education = this.eductionEnum[cur.education]
          if (cur.areaCode) {
            await queryAreaInfoByAreaId({ areaId: cur.areaCode }).then(area => {
              result[index].areaCode = area.data.provinceName + '-' + area.data.cityName + '-' + area.data.countyName
              // console.log(result[index].areaCode, '111')
            })
          } else {
            result[index].areaCode = '--'
          }
          // console.log(result, 'reslt')
        })
      })
      await queryStaffAverage({ resignStatus: false }).then(res => {
        this.digitalData[0].digit = res.data.employeeCount
        this.digitalData[1].digit = res.data.avgAge
        this.digitalData[2].digit = res.data.avgPosition
        // console.log(res, 'res.data')
      })
      this.$emit('update', this.digitalData)
    },
    updateDigitalData () {

    },
    currentChange (pageNum, pageSize) {
      this.pageInfo = {
        pageNum,
        pageSize
      }
      this.init(this.search)
    },
    // 添加员工档案
    handleAdd () {
      this.isShowAddPopup = true
    },
    // 编辑
    handleEdit (employeeRecordId, drawerPath = false) {
      this.drawerPath = drawerPath
      this.isShowEditPopup = true
      this.drawerType = 'edit'
      this.drawerTitle = '编辑员工详情'
      queryStaffDetail({ employeeRecordId }).then(res => {
        this.employeeDetailData = this.reduceStaffEditData(res.data)
      })
    },
    reduceStaffEditData (data) {
      return {
        ...data,
        birthday: data.birthday && (parseTime(data.birthday) + '' || new Date()),
        contractStartTime: (data.contractStartTime && data.contractStartTime && parseTime(data.contractStartTime)) + '' || new Date(),
        contractEndTime: (data.contractEndTime && data.contractEndTime && parseTime(data.contractEndTime) + '') || new Date(),
        entryTime: (data.entryTime && data.entryTime && parseTime(data.entryTime) + '') || new Date(),
        annex: data.annex || []
      }
    },
    // 离职
    handleResign (resignData) {
      this.isShowResignPopup = true
      const { employeeRecordId, employeeRecordName } = resignData
      this.resignData = { employeeRecordId, employeeRecordName }
      // console.log(this.resignData, 'data')
    },
    // 确认离职
    async handleConfirmResign () {
      const data = this.$refs.resign.resignData
      const params = {
        employeeRecordId: data.employeeRecordId,
        resignId: data.headquartersSettingId,
        remarks: data.remarks
      }
      if (!params.resignId) {
        this.$message.error('请填写必要选项离职原因')
        return
      }
      // console.log(params, 'params')
      await updateStaffResign(params).then(res => {
        if (res.code === 0) {
          this.$message.success('操作成功')
        }
      })
      this.isShowResignPopup = false
      this.init()
    },
    // 取消离职操作
    cancelResign () {
      this.isShowResignPopup = false
    },
    // 删除
    handleRemove (employeeRecordId) {
      this.$etmTip.init({
        type: 'warn',
        title: '确认要删除员工档案?',
        content: '删除员工档案，不会影响组织架构中的员工设置',
        confirmBtn: '确定',
        cancelBtn: '取消',
        confirm: async () => {
          await removeStaff({ employeeRecordId }).then(res => {
            this.$message.success('操作成功')
          })
          this.init()
          this.$etmTip.close()
        },
        cancel: () => {
          this.$etmTip.close()
        }
      })
      this.$etmTip.open()
    },
    // 确认添加员工
    async popConfirmAdd () {
      // console.log(, 'valid')
      this.$refs.add.$children[0].validate(async validate => {
        if (validate) {
          const params = this.$refs.add.addForm
          if (params.avatar) {
            const file = params.avatar
            await uploadFile(file, 'newdaycare/staffFile/add', 'image').then(res => {
              params.avatar = res.data.key
            })
          }

          if (params.annex) {
            const annex = []
            const fileLoad = params.annex.map(cur => {
              return new Promise(resolve => {
                uploadFile(cur, '/newdaycare/staffFile/add', 'file', 'QINIU_NOT_CALLBACK', {}, { noLoadding: true }).then(res => {
                  resolve({ ...res.data, name: cur.name })
                })
              })
            })

            await Promise.all(fileLoad).then(files => {
              files.forEach(cur => {
                annex.push({
                  name: cur.name,
                  url: cur.key
                })
              })
            })
            // console.log(annex, 'annex')
            params.annex = annex
          }

          await createStaff(params).then(res => {
            // console.log(res, '新增员工')
            this.$message.success('操作成功')
          })

          this.isShowAddPopup = false
          this.init()
        }
      })
    },
    // 取消添加员工
    popCloseAdd () {
      this.isShowAddPopup = false
    },
    // 确认编辑员工
    async popConfirmEdit () {
      const data = this.$refs.edit.employeeDetailData
      // console.log(data, '编辑data')
      if (!validPhoneNumber(data.telephone)) {
        this.$message.error('手机号码格式错误')
        return
      }
      if (data.avatar) {
        const file = data.avatar
        await uploadFile(file, 'newdaycare/staffFile/edit', 'image').then(res => {
          data.avatar = res.data.key
        })
      }

      if (data.annex) {
        const annex = []
        const fileLoad = data.annex.map(cur => {
          return new Promise(resolve => {
            uploadFile(cur, '/newdaycare/staffFile/edit', 'file', 'QINIU_NOT_CALLBACK', {}, { noLoadding: true }).then(res => {
              resolve({ ...res.data, name: cur.name })
            })
          })
        })

        await Promise.all(fileLoad).then(files => {
          files.forEach(cur => {
            annex.push({
              name: cur.name,
              url: cur.key
            })
          })
        })
        // console.log(annex, 'annex')
        data.annex = annex
      }
      const params = {
        ...data,
        avatar: data.avatar,
        birthday: data.birthday && new Date(data.birthday).getTime(),
        entryTime: data.entryTime && new Date(data.entryTime).getTime(),
        contractStartTime: data.contractStartTime && new Date(data.contractStartTime).getTime(),
        contractEndTime: data.contractEndTime && new Date(data.contractEndTime).getTime(),
        annex: data.annex
      }
      // console.log(params, 'params')
      await updateStaff(params).then(res => {
        this.$message.success('更新成功')
      })
      // this.isShowEditPopup = false
      this.drawerType = 'detail'
      this.init()
    },
    popCloseEdit () {
      if (this.drawerPath) {
        this.isShowEditPopup = false
        return
      }
      this.drawerType = 'detail'
    },
    // 详情处理
    async handleDetail (employeeRecordId, drawerPath = false) {
      this.drawerPath = false
      await queryStaffDetail({ employeeRecordId }).then(res => {
        this.employeeDetailData = this.reduceStaffEditData(res.data)
        // console.log(this.employeeDetailData, 'employDetailData')
      })
      this.isShowEditPopup = true
      this.drawerType = 'detail'
      this.drawerTitle = '员工详情'
    },
    // 组织架构同步
    async updateOrg () {
      await updateOrganization().then(res => {
        this.$message.success('更新成功')
      })
      this.init()
    }
  }
}
</script>
<style lang="scss" scoped>
</style>
