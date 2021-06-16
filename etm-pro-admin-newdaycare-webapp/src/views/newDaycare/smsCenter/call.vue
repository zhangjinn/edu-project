<template>
  <div class="call-wrap">
    <etm-main-body>
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
              label="人工通话记录"
              name="callRecords"
            >
              <etm-tool-bar
                v-show="true"
                v-model="formData"
                @search="handleSearch"
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
              name="callSetting"
            >
              <etm-tool-bar
                v-model="formData2"
                @search="handleSearch2"
              />
            </el-tab-pane>
          </etm-tabs>
        </template>

        <template
          v-if="activeName==='callRecords'"
          slot="body"
        >
          <etm-table-page
            :data="tableData"
            :columns="columns"
            border
            @currentChange="currentChange"
          >
            <etm-table-tool-bar slot="tool">
              <div slot="right">
                <el-button
                  type="primary"
                  @click="smsCall"
                >
                  打电话
                </el-button>
                <el-button
                  type="primary"
                  @click="shenMsg = true"
                >
                  发短信
                </el-button>
              </div>
            </etm-table-tool-bar>
            <el-table-column
              slot="right"
              label="操作"
              width="120"
            >
              <template v-slot="scoped">
                <template v-if="scoped.row.recordingUrl!=='0'">
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
              </template>
            </el-table-column>
          </etm-table-page>
        </template>
        <template
          v-else
          slot="body"
        >
          <etm-table-page
            :data="tableData2"
            :columns="columns2"
            border
            @currentChange="currentChange2"
          >
            <el-table-column
              slot="right"
              label="账号状态"
              width="120"
            >
              <template v-slot="scoped">
                <etm-status
                  v-if="scoped.row.enable"
                  type="primary"
                >
                  {{
                    scoped.row.enumEnable
                  }}
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
              width="220"
            >
              <template v-slot="scoped">
                <span>{{ scoped.row.showPhone }}</span>
              </template>
            </el-table-column>
            <el-table-column
              slot="right"
              label="呼叫功能"
              width="120"
            >
              <template v-slot="scoped">
                {{ scoped.row.openType }}
              </template>
            </el-table-column>
            <el-table-column
              slot="right"
              label="操作"
            >
              <template v-slot="scoped">
                <etm-text
                  v-if="!scoped.row.open"
                  @click="handleOpen(scoped.row)"
                >
                  开通
                </etm-text>
                <etm-text
                  v-if="scoped.row.open==='--'||scoped.row.open===true"
                  @click="handleEdit(scoped.row)"
                >
                  编辑
                </etm-text>
                <etm-text
                  v-if="scoped.row.open==='--'||scoped.row.open===true"
                  @click="handleClose(scoped.row)"
                >
                  关闭
                </etm-text>
              </template>
            </el-table-column>
          </etm-table-page>
        </template>
      </etm-layout-split>

      <etm-pop
        :visible="smsPop"
        title="短信服务使用协议"
        pop="complex"
        @confirm="smsPop = false"
        @cancel="smsPop = false"
        @close="smsPop = false"
      >
        <sms-protocol />
      </etm-pop>
      <etm-pop
        :visible="intPop"
        title="网络电话使用协议"
        pop="complex"
        @confirm="intPop = false"
        @cancel="intPop = false"
        @close="intPop = false"
      >
        <int-pop />
      </etm-pop>

      <!--通话余额弹框-->
      <etm-pop
        :visible="popVisible"
        :pop="popType"
        title="通话余额"
        confirm-btn="确定"
        cancel-btn="取消"
        @close="popClose"
        @cancel="popClose"
        @confirm="popConfirm"
      >
        <div class="popContent">
          <ul>
            <li>
              <span>剩余通话时长</span>
              <span class="iColor">{{ basicInfo.callTime }}</span>分钟
            </li>
            <li>
              <span>剩余短信数量</span>
              <span class="iColor">{{ basicInfo.messageNum }}</span>条
            </li>
          </ul>

          <div class="protocol down">
            * 用户必须完全同意 <span @click="intPop=true">《网络电话使用协议》</span>、<span @click="smsPop = true">《短信服务使用协议》</span>的所有服务条款。
          </div>
        </div>
      </etm-pop>

      <!--  发短信 -->
      <etm-pop
        :visible="shenMsg"
        title="发短信"
        confirm-btn="发送"
        cancel-btn="取消"
        @close="balancePopClose"
        @cancel="balancePopClose"
        @confirm="balancePopConfirm"
      >
        <shen-msg
          v-if="shenMsg"
          ref="childPopForm"
        />
      </etm-pop>

      <!--通话键盘-->
      <el-dialog
        :visible.sync="popLogVisible"
        append-to-body
      >
        <div class="popContent2">
          <calculation
            v-if="popLogVisible"
            @confirm="callConfirm"
          />
        </div>
      </el-dialog>
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
    </etm-main-body>
  </div>
</template>

<script>
import { createSms } from '@/api/newDaycare/yunSms'
import {
  createCall,
  getAccount,
  postDownSrcRecord,
  queryEmployeeSelectByTabCode,
  queryStudentCall,
  createCallSetting
} from '@/api/newDaycare/yunCall'
import calculation from './calculation'
import baseMixin from '@/layout/mixin/baseMixin'
import { parseTime } from '@/utils'
import smsProtocol from '@/views/newDaycare/smsCenter/smsProtocol'
import shenMsg from '@/views/newDaycare/smsCenter/shenMsg'
import intPop from '@/views/newDaycare/smsCenter/intPop'
import formValidate from '@/utils/rules'
/**
 * call create by Administrator
 * createTime 2020/8/27 18:09
 */
import { getCurrentOrganizationId } from '@/utils/auth'
import { getCallSetting, getPositionName } from '@/api/customer'

const FileSaver = require('file-saver')

export default {
  name: 'Call',
  components: {
    calculation, smsProtocol, shenMsg, intPop
  },
  filters: {},
  mixins: [baseMixin],
  props: {},
  data () {
    return {
      formValidate,
      popVisibleEdit: false,
      popForm: {
        popPhoneNum: '',
        employeeId: null,
        open: null,
        settingId: null
      },
      activeName: 'callRecords',
      popType: 'simple',
      searchInfo: {},
      smsPop: false,
      intPop: false,
      shenMsg: false,
      popVisible: false,
      popLogVisible: false,
      music: null,
      basicInfo: {
        callTime: 0,
        messageNum: 0
      },
      pageInfo: {
        pageNum: 1,
        pageSize: 10
      },
      pageInfo2: {
        pageNum: 1,
        pageSize: 10
      },
      searchCondition1: {
        startCallTime: null,
        endCallTime: null
      },
      tableData: {
        content: []
      },
      columns2: [
        {
          label: '手机号码',
          prop: 'accountNo'
        },
        {
          label: '员工昵称',
          prop: 'name'
        },
        {
          label: '所属部门',
          prop: 'organization'
        },
        {
          label: '岗位权限',
          prop: 'position'
        }
      ],
      tableData2: {
        content: []
      },
      columns: [ // 表格的列表头传值
        {
          label: '学员姓名',
          prop: 'childName',
          align: 'left'
        },
        {
          label: '电话号码',
          prop: 'callPhone',
          align: 'left'
        },
        {
          label: '通话时间',
          prop: 'callTime',
          align: 'left',
          width: '310'
        },
        {
          label: '通话时长',
          prop: 'callDuration',
          align: 'left',
          sortable: true,
          sortMethod (a, b) {
            const hourReg = /\d+(?=时)/
            const minuteReg = /\d+(?=分)/
            const secondReg = /\d+(?=秒)/

            const aHour = a.age.match(hourReg) ? +a.age.match(hourReg)[0] : 0
            const aMinute = a.age.match(minuteReg) ? +a.age.match(minuteReg)[0] : 0
            const aSecond = a.age.match(secondReg) ? +a.age.match(secondReg)[0] : 0

            const bHour = b.age.match(hourReg) ? +b.age.match(hourReg)[0] : 0
            const bMinute = b.age.match(minuteReg) ? +b.age.match(minuteReg)[0] : 0
            const bSecond = b.age.match(secondReg) ? +b.age.match(secondReg)[0] : 0

            return (aHour * 100 + aMinute * 10 + aSecond) - (bHour * 100 + bMinute * 10 + bSecond)
          }
        },
        {
          label: '操作人',
          prop: 'employeeName',
          align: 'left'
        }
      ],
      formData: [
        {
          label: '通话时间',
          type: 'date',
          prop: 'maxCallDuration',
          value: null,
          props: {
            type: 'daterange',
            'range-separator': '-',
            'start-placeholder': '开始日期',
            'end-placeholder': '结束日期'
          }
        },
        {
          label: '学员姓名',
          type: 'input',
          prop: 'childName',
          value: '',
          props: {
            placeholder: '请输入学员姓名'
          }
        },
        {
          label: '电话号码',
          type: 'input',
          prop: 'callPhone',
          value: null,
          props: {
            placeholder: '请输入电话号码'
          }
        },
        {
          label: '操作人',
          type: 'select',
          prop: 'employeeId',
          value: null,
          props: {
            placeholder: '请选择操作人'
          },
          options: []
        }
      ],
      formData2: [
        {
          label: '手机号码',
          type: 'input',
          prop: 'accountNo',
          value: null,
          props: {
            placeholder: '请输入手机号码'
          }
        },
        {
          label: '员工昵称',
          type: 'input',
          prop: 'name',
          value: null,
          props: {
            placeholder: '员工昵称'
          }
        },
        {
          label: '岗位权限',
          type: 'select',
          prop: 'positionId',
          value: null,
          props: {
            placeholder: '请选择岗位权限'
          },
          options: []
        },
        {
          label: '账号状态',
          type: 'select',
          prop: 'enable',
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
      ]
    }
  },
  computed: {},
  watch: {},
  created () {
    this.getWorkers()
    this.init()
    this.getAccountData()
  },
  mounted () {
  },
  methods: {
    // 获取岗位权限
    getPositionNameData () {
      const id = getCurrentOrganizationId()
      getPositionName(id).then((res) => {
        const { data } = res
        this.formData2[2].options = this.convertDataToOptions(data, 'name', 'id')
      })
    },
    handleSearch () {
      this.pageInfo.pageNum = 1
      this.init()
    },
    calcTimeLength (usedTime) {
      // const stime = Date.parse(new Date(faultDate))
      // const etime = Date.parse(new Date(completeTime))
      // const usedTime = etime - stime // 两个时间戳相差的毫秒数
      // const days = Math.floor(usedTime / (24 * 3600 * 1000))
      // 计算出小时数
      // const leave1 = usedTime % (24 * 3600 * 1000) // 计算天数后剩余的毫秒数
      // const hours = Math.floor(leave1 / (3600 * 1000))
      // // 计算相差分钟数
      // const leave2 = leave1 % (3600 * 1000) // 计算小时数后剩余的毫秒数
      // const minutes = Math.floor(leave2 / (60 * 1000))
      const hours = Math.floor(usedTime / 3600)
      const minutes = Math.floor((usedTime - hours * 3600) / 60)
      const second = usedTime % 60
      return hours + '时' + minutes + '分' + second + '秒'
    },
    tabChange () {
      if (this.activeName === 'callSetting') {
        this.getPositionNameData()
        this.getCallSetting()
      } else {
        this.init()
      }
    },
    getCallSetting () {
      const accountNo = this.getObjectByProp('accountNo', this.formData2).value
      const name = this.getObjectByProp('name', this.formData2).value
      const positionId = this.getObjectByProp('positionId', this.formData2).value
      const enable = this.getObjectByProp('enable', this.formData2).value
      const param2 = {
        accountNo: accountNo || null,
        name: name || null,
        positionId: positionId || null,
        enable: enable,
        pageNum: this.pageInfo2.pageNum,
        pageSize: this.pageInfo2.pageSize
      }
      // console.log(param2)
      getCallSetting(param2).then((res) => {
        const { data } = res
        this.tableData2 = data
        this.tableData2.content.forEach((item) => {
          item.enumEnable = item.enable ? '使用中' : '已禁用'
        })
        this.tableData2.content.forEach(v => {
          v.openType = (v.open === null || v.open) ? '已开通' : '已关闭'
        })
      })
    },
    init () {
      const getTime = this.getObjectByProp('maxCallDuration', this.formData).value
      const childName = this.getObjectByProp('childName', this.formData).value
      const callPhone = this.getObjectByProp('callPhone', this.callPhone).value
      const employeeId = this.getObjectByProp('employeeId', this.callPhone).value
      // console.log(employeeId)
      queryStudentCall({
        startDate: (getTime && getTime[0] + ' 00:00:00') || null,
        endDate: (getTime && getTime[1] + ' 23:59:59') || null,
        minCallDuration: this.searchCondition1.startCallTime,
        maxCallDuration: this.searchCondition1.endCallTime,
        childName: (childName) || null,
        callPhone: (callPhone) || null,
        employeeId: (employeeId) || null,
        pageNum: this.pageInfo.pageNum,
        pageSize: this.pageInfo.pageSize
      }).then(res => {
        this.tableData = res.data
        // console.log(res.data)
        this.tableData.content.forEach(item => {
          // console.log(item.startTime, typeof (item.startTime))
          item.callTime = ''
          if (item.startTime && item.startTime > 0) {
            item.startTime = parseTime(item.startTime, '{y}-{m}-{d} {h}:{i}:{s}')
            item.endTime = parseTime(item.endTime, '{y}-{m}-{d} {h}:{i}:{s}')
            item.callTime = item.startTime + ' 至 ' + item.endTime
          }
          if (!item.recordingUrl) {
            item.recordingUrl = '0'
          }
          // console.log(item.startTime, typeof (item.startTime))
          item.callDuration = this.calcTimeLength(item.callDuration)
        })
      })
    },
    popOpen () {
      this.popVisible = true
    },
    popClose () {
      this.popVisible = false
    },
    popConfirm () {
      this.popVisible = false
    },
    balancePopClose () {
      this.shenMsg = false
    },
    balancePopConfirm () {
      this.$refs.childPopForm.$refs.form.$children[0].validate(valid => {
        if (valid) {
          const formData = this.$refs.childPopForm.form
          const str = formData.stuPhone.replace(/，/g, ',').replace(/：/g, ':')
          const temp = str.split(/[\n,]/g)
          for (let i = 0; i < temp.length; i++) {
            if (temp[i] === '') {
              temp.splice(i, 1)
              // 删除数组索引位置应保持不变
              i--
            }
          }
          // console.log(temp)
          const sentPhone = []
          const failPhone = []
          let phoneTrue = true
          for (let i = 0; i < temp.length; i++) {
            if ((/^1[3456789]\d{9}$/.test(temp[i]))) {
              sentPhone.push(temp[i])
            } else {
              phoneTrue = false
              failPhone.push(temp[i])
            }
          }
          // console.log(sentPhone)
          if (phoneTrue) {
            createSms({ telephoneList: sentPhone, content: formData.details }).then(res => {
              this.$message.success('发送成功')
              this.shenMsg = false
              this.init()
            })
          } else {
            // this.$message.error('输入的号码有误')
            this.$etmTip.init({
              type: 'error',
              title: '输入的号码有误',
              // content: '有误号码为：' + failPhone,
              html: `<p>有误号码为</p><p style="word-wrap: break-word;word-break: break-all;">${failPhone}</p>`,
              confirmBtn: '确认',
              cancelBtn: '取消',
              confirm: () => {
                this.$etmTip.close()
              },
              cancel: () => {
                this.$etmTip.close()
              }
            })
            this.$etmTip.open()
          }
          // console.log('formData', formData)
        }
      })
    },
    smsCall () {
      this.popLogVisible = true
    },
    callConfirm (val) {
      // console.log(val)
      createCall({ telephone: val }).then(res => {
        // console.log(res)
        this.$message.success('操作成功')
      })
    },
    reset () {
      this.searchCondition1.startCallTime = null
      this.searchCondition1.endCallTime = null
    },
    currentChange (pageNum, pageSize) {
      this.pageInfo = {
        pageNum, pageSize
      }
      this.init()
    },
    currentChange2 (pageNum, pageSize) {
      this.pageInfo2 = {
        pageNum, pageSize
      }
      this.getCallSetting()
    },
    getWorkers () {
      queryEmployeeSelectByTabCode({ tagCode: null }).then(res => {
        // console.log(res)
        const itemSearch = []
        for (let i = 0; i < res.data.length; i++) {
          itemSearch.push({
            value: res.data[i].id,
            label: res.data[i].name
          })
        }
        this.$set(this.formData[3], 'options', itemSearch)
      })
    },
    // 播放
    handlePlay (row) {
      // console.log(row)
      let url = null
      if (this.music) {
        this.music.pause()
      }
      url = row.recordingUrl
      this.music = new Audio(url)
      this.music.play()
    },
    // 下载
    handleDownload (row) {
      let url = null
      if (!row.recordingUrl) {
        const param = {
          downSrcRecordUrl: row.recordingUrl
        }
        postDownSrcRecord(param).then((res) => {
          const { data } = res
          url = data.recordingUrl
          FileSaver.saveAs(url, row.phone)
        })
      } else {
        url = row.recordingUrl
        FileSaver.saveAs(url, row.phone)
      }
    },
    getAccountData () {
      getAccount().then((res) => {
        const { data } = res
        this.basicInfo.callTime = Math.floor(data.callTime / 60)
        this.basicInfo.messageNum = data.messageNum
      })
    },
    handleSearch2 () {
      this.pageInfo2.pageNum = 1
      this.getCallSetting()
    },
    handleOpen (row) {
      this.$etmTip.init({
        type: 'warn',
        title: '提示',
        content: '是否开通呼叫功能',
        confirmBtn: '确认',
        cancelBtn: '取消',
        confirm: () => {
          if (!row.settingId || row.settingId === '--') {
            row.settingId = null
          }
          if (!row.showPhone || row.showPhone === '--') {
            row.showPhone = null
          }
          // console.log(row)
          createCallSetting({
            employeeId: row.employeeId,
            open: true,
            settingId: row.settingId,
            showPhone: row.showPhone
          }).then(() => {
            this.$message({
              message: '开通成功',
              type: 'success'
            })
            this.$etmTip.close()
            this.getCallSetting()
          })
        },
        cancel: () => {
          this.$etmTip.close()
        }
      })
      this.$etmTip.open()
    },
    handleClose (row) {
      this.$etmTip.init({
        type: 'warn',
        title: '提示',
        content: '是否关闭呼叫功能',
        confirmBtn: '确认',
        cancelBtn: '取消',
        confirm: () => {
          if (!row.settingId || row.settingId === '--') {
            row.settingId = null
          }
          if (!row.showPhone || row.showPhone === '--') {
            row.showPhone = null
          }
          createCallSetting({
            employeeId: row.employeeId,
            open: false,
            settingId: row.settingId,
            showPhone: row.showPhone
          }).then(() => {
            this.$message({
              message: '关闭成功',
              type: 'success'
            })
            this.$etmTip.close()
            this.getCallSetting()
          })
        },
        cancel: () => {
          this.$etmTip.close()
        }
      })
      this.$etmTip.open()
    },
    handleEdit (row) {
      if (!row.settingId || row.settingId === '--') {
        row.settingId = null
      }
      if (!row.showPhone || row.showPhone === '--') {
        row.showPhone = null
      }
      this.popForm.popPhoneNum = row.showPhone
      this.popForm.settingId = row.settingId
      this.popForm.open = row.open
      this.popForm.employeeId = row.employeeId
      this.popVisibleEdit = true
    },
    popConfirmEdit () {
      this.$refs.form.$children[0].validate(valid => {
        if (valid) {
          if (this.popForm.open === '--') {
            this.popForm.open = true
          }
          createCallSetting({
            employeeId: this.popForm.employeeId,
            open: this.popForm.open,
            settingId: this.popForm.settingId,
            showPhone: this.popForm.popPhoneNum
          }).then(() => {
            this.$message({
              message: '编辑成功',
              type: 'success'
            })
            this.popVisibleEdit = false
            this.getCallSetting()
          })
        }
      })
    }
  }

}
</script>
<style lang="scss" scoped>

#search {
  margin-bottom: 16px;
}

.popContent {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  max-height: 200px;
  min-height: 130px;
  overflow-x: hidden;
  overflow-y: auto;

  li {
    line-height: 2;
  }

  .protocol {
    span {
      @include etm-color();
      cursor: pointer;
    }
  }

  .down {
    font-size: 12px;
  }
}

.popContent2 {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  max-height: 400px;
  min-height: 200px;
  overflow-x: hidden;
  overflow-y: auto;
}

::v-deep .el-dialog {
  width: 378px;
}

.iColor {
  @include etm-color();
  display: inline-block;
  font-size: 16px;
  font-weight: 600;
  margin-left: 16px;
}
</style>
