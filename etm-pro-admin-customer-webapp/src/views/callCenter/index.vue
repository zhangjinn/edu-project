<template>
  <div class="callCenterMainContent">
    <etm-layout-split>
      <template slot="header">
        <etm-tabs
          v-model="activeName"
          @tab-click="tabChange"
        >
          <el-button
            slot="tool"
            type="text"
            @click="popOpen"
          >
            余额查询
          </el-button>
          <el-tab-pane
            label="通话记录"
            name="callRecords"
          >
            <etm-tool-bar
              v-show="show"
              v-model="formData1"
              @search="search('call-records', formData1)"
              @reset="reset"
            >
              <el-form-item label="通话时长:">
                <el-input
                  v-model="searchCondition1.startCallTime"
                  placeholder="请输入时长"
                />
                -
                <el-input
                  v-model="searchCondition1.endCallTime"
                  placeholder="请输入时长"
                />
                秒
              </el-form-item>
            </etm-tool-bar>
          </el-tab-pane>
          <el-tab-pane
            label="呼叫设置"
            name="callSettings"
          >
            <etm-tool-bar
              v-show="show"
              v-model="formData2"
              @search="search('call-center', formData2)"
              @reset="reset"
            />
          </el-tab-pane>
        </etm-tabs>
      </template>
      <template slot="body">
        <etm-table-page
          :data="tableData"
          :columns="columns"
          @currentChange="currentChange"
        >
          <template v-if="activeName==='callRecords'">
            <el-table-column
              slot="right"
              label="操作"
            >
              <template v-slot="scoped">
                <etm-text
                  type="primary"
                  @click="handlePlay(scoped.row)"
                >
                  播放
                </etm-text>
                <etm-text
                  type="primary"
                  @click="handleDownload(scoped.row)"
                >
                  下载
                </etm-text>
              </template>
            </el-table-column>
          </template>
          <template v-else>
            <el-table-column
              slot="right"
              label="账号状态"
              width="100"
            >
              <template v-slot="scoped">
                <etm-status
                  v-if="scoped.row.enable"
                  type="primary"
                >
                  {{ scoped.row.enumEnable }}
                </etm-status>
                <etm-status
                  v-else
                  type="danger"
                >
                  {{ scoped.row.enumEnable }}
                </etm-status>
              </template>
            </el-table-column>
            <el-table-column
              slot="right"
              label="显示号码"
              width="120"
            >
              <template v-slot="scoped">
                <span>{{ scoped.row.showPhone }}</span>
              </template>
            </el-table-column>
            <el-table-column
              slot="right"
              label="操作"
            >
              <template v-slot="scoped">
                <!--                <etm-text v-if="scoped.row.open" type="primary" @click="handleDisable(scoped.row,scoped.$index)">禁用</etm-text>-->
                <!--                <etm-text v-else type="primary" @click="handleOpen(scoped.row,scoped.$index)">开通</etm-text>-->
                <etm-text
                  type="primary"
                  @click="handleEdit(scoped.row,scoped.$index)"
                >
                  编辑
                </etm-text>
              </template>
            </el-table-column>
          </template>
        </etm-table-page>
      </template>
    </etm-layout-split>

    <!--通话余额弹框-->
    <etm-pop
      :visible="popVisible"
      title="通话余额"
      confirm-btn="确定"
      cancel-btn="取消"
      @close="popVisible = false"
      @cancel="popVisible = false"
      @confirm="popVisible = false"
    >
      <div class="popContent">
        <ul>
          <li>
            <etm-field-label label="剩余通话时长">
              {{ callTime }}分钟
            </etm-field-label>
          </li>
        </ul>
        <div class="protocol">
          用户必须完全同意 <span @click="protocol">《网络电话使用协议》</span>的所有服务条款。
        </div>
      </div>
    </etm-pop>

    <!--协议弹框-->
    <etm-pop
      :visible="popVisibleProtocol"
      pop="complex"
      title="网络电话使用协议"
      confirm-btn="确定"
      @close="popVisibleProtocol = false"
      @cancel="popVisibleProtocol = false"
      @confirm="popVisibleProtocol = false"
    >
      <div class="popContent">
        <telephone-agreement />
      </div>
    </etm-pop>

    <!--编辑-->
    <etm-pop
      :visible="popVisibleEdit"
      pop="simple"
      title="编辑"
      confirm-btn="确定"
      cancel-btn="取消"
      @close="popVisibleEdit=false"
      @cancel="popVisibleEdit=false"
      @confirm="popConfirmEdit"
    >
      <etm-form
        v-if="popVisibleEdit"
        ref="form"
        :model="popForm"
        type="dialog"
      >
        <el-form-item
          label="显示号码"
          prop="popPhoneNum"
          :rules="formValidate.phoneRule()"
        >
          <el-input
            ref="popInput"
            v-model="popForm.popPhoneNum"
            placeholder="请输入手机号码"
          />
        </el-form-item>
      </etm-form>
    </etm-pop>
  </div>
</template>

<script>
// import saveAs from 'file-saver'
import formValidate from '@/utils/rules'
import { validPhoneNumber } from '@/utils/validate.js'
import telephoneAgreement from './telephoneAgreement'

import { getCurrentOrganizationId } from '@/utils/auth'
import baseMixin from '@/layout/mixin/baseMixin'
import { parseTime } from '@/utils'
import {
  getCallRecord,
  getEmployeeAll,
  getCallSetting,
  postCallSetting,
  getPositionName,
  postDownSrcRecord,
  getAccount
} from '@/api/customer2'
const FileSaver = require('file-saver')
export default {
  name: 'Index',
  components: {
    telephoneAgreement
  },
  mixins: [baseMixin],
  data () {
    return {
      formValidate,
      show: true,
      popVisible: false,
      popVisibleProtocol: false,
      popVisibleEdit: false,
      activeName: 'callRecords',
      popPhoneRow: '',

      popPhoneIndex: '',
      popForm: {
        popPhoneNum: ''
      },
      formData1: [
        {
          label: '通话时间',
          type: 'date',
          prop: 'data',
          value: null,
          props: {
            type: 'daterange',
            'range-separator': '-',
            'start-placeholder': '开始日期',
            'end-placeholder': '结束日期'
          }
        },
        {
          label: '电话号码',
          type: 'input',
          prop: 'telephone',
          value: null,
          props: {
            placeholder: '请输入电话号码'
          }
        },
        {
          label: '操作人',
          type: 'select',
          prop: 'operator',
          value: null,
          props: {
            placeholder: '请选择操作人'
          },
          options: []
        }
      ],
      formData2: [
        {
          label: '登录账号',
          type: 'input',
          prop: 'loginAccount',
          value: null,
          props: {
            placeholder: '请输入登录账号'
          }
        },
        {
          label: '姓名',
          type: 'input',
          prop: 'name',
          value: null,
          props: {
            placeholder: '请输入姓名'
          }
        },
        {
          label: '岗位权限',
          type: 'select',
          prop: 'positionAuthority',
          value: null,
          props: {
            placeholder: '请选择岗位权限'
          },
          options: []
        },
        {
          label: '账号状态',
          type: 'select',
          prop: 'accountStatus',
          value: null,
          props: {
            placeholder: '请选择账号状态'
          },
          options: [
            {
              label: '使用中',
              value: true
            },
            {
              label: '已禁用',
              value: false
            }
          ]
        }
      ],
      pageSize: 10,
      pageNum: 1,

      // 表格数据
      tableData: {
        content: []
      },
      columns1: [ // 表格的列表头传值
        {
          label: '序号',
          type: 'index',
          width: '55',
          align: 'left'
        },
        {
          label: '电话号码',
          prop: 'phone',
          align: 'left'
        },
        {
          label: '呼叫类型',
          prop: 'enumCallType',
          align: 'left'
        },
        {
          label: '通话时间',
          prop: 'startTime',
          align: 'left'
        },
        {
          label: '通话时长(秒)',
          prop: 'callTime',
          align: 'left'
        },
        {
          label: '操作人',
          prop: 'operator',
          align: 'left'
        }
      ],
      columns2: [ // 表格的列表头传值
        {
          label: '序号',
          type: 'index',
          width: '55',
          align: 'left'
        },
        {
          label: '登录账号',
          prop: 'accountNo',
          align: 'left'
        },
        {
          label: '姓名',
          prop: 'name',
          align: 'left'
        },
        {
          label: '组织',
          prop: 'organization',
          align: 'left'
        },
        {
          label: '所属部门',
          prop: 'department',
          align: 'left'
        },
        {
          label: '岗位权限',
          prop: 'position',
          align: 'left'
        }
      ],
      searchCondition1: {
        callStartDate: null,
        callEndDate: null,
        startCallTime: null,
        endCallTime: null,
        phone: null,
        operator: null
      },
      searchCondition2: {
        accountNo: null,
        name: null,
        positionId: null,
        enable: null
      },
      music: null,
      callTime: null // 账户剩余通话时长，单位分钟
    }
  },
  computed: {
    columns () {
      if (this.activeName === 'callRecords') {
        return this.columns1
      } else if (this.activeName === 'callSettings') {
        return this.columns2
      } else {
        return []
      }
    }
  },
  created () {
    this.getEmployeeAllData()
    this.getTableData()
  },
  methods: {
    tabChange () {
      if (this.activeName === 'callRecords') {
        this.getEmployeeAllData()
      } else {
        this.getPositionNameData()
      }
      this.pageNum = 1
      this.getTableData()
    },

    // 获取岗位权限
    getPositionNameData () {
      const id = getCurrentOrganizationId()
      getPositionName(id).then((res) => {
        const { data } = res
        this.formData2[2].options = this.convertDataToOptions(data, 'name', 'id')
      })
    },

    // 获取市场人员
    getEmployeeAllData () {
      getEmployeeAll().then((res) => {
        const { data } = res
        this.formData1[2].options = this.convertDataToOptions(data, 'name', 'id')
      })
    },

    // 搜索
    search (ref, formData) {
      const obj = {}
      formData.forEach(item => {
        obj[item.prop] = item.value
      })
      if (this.activeName === 'callRecords') {
        if (obj.data && obj.data.length > 0) {
          this.searchCondition1.callStartDate = obj.data[0]
          this.searchCondition1.callEndDate = obj.data[1]
        } else {
          this.searchCondition1.callStartDate = null
          this.searchCondition1.callEndDate = null
        }
        if (!this.searchCondition1.startCallTime) {
          this.searchCondition1.startCallTime = null
        }
        if (!this.searchCondition1.endCallTime) {
          this.searchCondition1.endCallTime = null
        }

        this.searchCondition1.phone = obj.telephone
        this.searchCondition1.operator = obj.operator
      } else {
        this.searchCondition2.accountNo = obj.loginAccount
        this.searchCondition2.name = obj.name
        this.searchCondition2.positionId = obj.positionAuthority
        this.searchCondition2.enable = obj.accountStatus
      }

      this.pageNum = 1
      this.getTableData()
    },

    // 重置
    reset () {
      if (this.activeName === 'callRecords') {
        this.formData1.forEach((item) => {
          item.value = null
        })
        this.searchCondition1.callStartDate = null
        this.searchCondition1.callEndDate = null
        this.searchCondition1.startCallTime = null
        this.searchCondition1.endCallTime = null
        this.searchCondition1.phone = null
        this.searchCondition1.operator = null
      } else {
        this.searchCondition2.accountNo = null
        this.searchCondition2.name = null
        this.searchCondition2.positionId = null
        this.searchCondition2.enable = null
      }

      this.pageNum = 1
      this.getTableData()
    },

    // 获取表格数据
    getTableData () {
      if (this.activeName === 'callRecords') {
        const param1 = {
          callStartDate: this.searchCondition1.callStartDate,
          callEndDate: this.searchCondition1.callEndDate,
          startCallTime: this.searchCondition1.startCallTime,
          endCallTime: this.searchCondition1.endCallTime,
          phone: this.searchCondition1.phone,
          operator: this.searchCondition1.operator,
          pageNum: this.pageNum,
          pageSize: this.pageSize
        }
        getCallRecord(param1).then((res) => {
          const { data } = res
          this.tableData = data
          this.tableData.content.forEach((item) => {
            item.enumCallType = item.callType === 'CALL_OUT' ? '呼出' : '呼入'
            item.startTime = item.startTime ? parseTime(item.startTime) : item.startTime
          })
        })
      } else {
        const param2 = {
          accountNo: this.searchCondition2.accountNo,
          name: this.searchCondition2.name,
          positionId: this.searchCondition2.positionId,
          enable: this.searchCondition2.enable,
          pageNum: this.pageNum,
          pageSize: this.pageSize
        }
        getCallSetting(param2).then((res) => {
          const { data } = res
          this.tableData = data
          this.tableData.content.forEach((item) => {
            item.enumEnable = item.enable ? '使用中' : '已禁用'
          })
        })
      }
    },

    // 打开新窗口播放（备用）
    handlePlay1 (row) {
      const a = document.createElement('a')
      a.setAttribute('href', row.recordUrl)
      a.setAttribute('target', '_blank')
      a.setAttribute('id', 'startTelMedicine')
      // 防止反复添加
      if (document.getElementById('startTelMedicine')) {
        document.body.removeChild(document.getElementById('startTelMedicine'))
      }
      document.body.appendChild(a)
      a.click()
    },

    // 播放
    handlePlay (row) {
      let url = null
      if (this.music) {
        this.music.pause()
      }
      if (!row.recordUrl) {
        const param = {
          downSrcRecordUrl: row.downSrcRecordUrl
        }
        postDownSrcRecord(param).then((res) => {
          const { data } = res
          url = data.recordUrl
          this.music = new Audio(url)
          this.music.play()
        })
      } else {
        url = row.recordUrl
        this.music = new Audio(url)
        this.music.play()
      }
    },

    // 下载
    handleDownload (row) {
      let url = null
      if (!row.recordUrl) {
        const param = {
          downSrcRecordUrl: row.downSrcRecordUrl
        }
        postDownSrcRecord(param).then((res) => {
          const { data } = res
          url = data.recordUrl
          FileSaver.saveAs(url, row.phone)
        })
      } else {
        url = row.recordUrl
        FileSaver.saveAs(url, row.phone)
      }
    },

    // 呼叫状态改变
    postCallSettingData (row, index, type) {
      let phoneNum = row.showPhone
      let settingId = row.settingId
      if (type === 'change') {
        phoneNum = this.popForm.popPhoneNum
      }
      if (!phoneNum || phoneNum === '--') {
        phoneNum = ''
      }
      if (!settingId || settingId === '--') {
        settingId = null
      }

      const param = {
        showPhone: phoneNum,
        employeeId: row.employeeId,
        open: true,
        settingId: settingId
      }
      postCallSetting(param).then((res) => {
        const { data } = res
        if (!row.settingId) {
          this.tableData.content[index].settingId = data.settingId
        }
        if (type === 'change') {
          this.getTableData()
        }
        if (type === 'open') {
          this.$alert('开通成功！请设置显示号码。', '提示', {
            confirmButtonText: '确定'
          })
        } else if (type === 'disable') {
          this.$alert('禁用成功。', '提示', {
            confirmButtonText: '确定'
          })
        }
      })
    },

    // 显示号码改变编辑确定
    popConfirmEdit () {
      console.log("this.$refs['form']:::")
      console.log(this.$refs.form.$children[0])
      this.$refs.form.$children[0].validate(valid => {
        if (valid) {
          this.postCallSettingData(this.popPhoneRow, this.popPhoneIndex, 'change')
          this.popVisibleEdit = false
        }
      })

      // if (this.popPhoneRow) {
      //   const tel = validPhoneNumber(this.popPhoneRow)
      //   if (tel) {
      //     this.postCallSettingData(this.popPhoneRow, this.popPhoneIndex, 'change')
      //   } else {
      //     // console.log(e.target)
      //     // e.target.focus()
      //     // console.log(this.$refs.popInput)
      //     // this.$refs.popInput
      //     // this.$message.error('号码格式错误，请重新填写！')
      //   }
      // } else {
      //   this.postCallSettingData(this.popPhoneRow)
      // }
    },
    // 显示号码改变
    statusBlur (e) {
      if (this.popPhoneRow) {
        const tel = validPhoneNumber(this.popPhoneRow)
        if (tel) {
          this.postCallSettingData(this.popPhoneRow, this.popPhoneIndex, 'change')
        } else {
          console.log(e.target)
          e.target.focus()
          this.$message.error('号码格式错误，请重新填写！')
        }
      } else {
        this.postCallSettingData(this.popPhoneRow)
      }
    },
    // 编辑
    handleEdit (row, index) {
      this.popPhoneRow = row
      this.popPhoneIndex = index
      this.popForm.popPhoneNum = JSON.parse(JSON.stringify(row.showPhone))
      if (this.popForm.popPhoneNum === '--') {
        this.popForm.popPhoneNum = ''
      }
      this.popVisibleEdit = true
    },
    // 开通
    handleOpen (row, index) {
      row.open = true
      this.postCallSettingData(row, index, 'open')
    },
    // 禁用
    handleDisable (row, index) {
      row.open = false
      this.postCallSettingData(row, index, 'disable')
    },
    // 分页触发事件
    currentChange (num, size) {
      this.pageNum = num
      this.pageSize = size
      this.getTableData()
    },
    popOpen () {
      getAccount().then((res) => {
        const { data } = res
        this.callTime = Math.floor(data.callTime / 60)
      })
      this.popVisible = true
    },
    protocol () {
      this.popVisibleProtocol = true
    }

  }
}
</script>

<style scoped lang="scss">
.popContent {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  min-height: 115px;

  .protocol {
    color: $color-info;

    span {
      @include etm-color();
      cursor: pointer;
    }
  }
}
</style>
