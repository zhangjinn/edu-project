<template>
  <div id="smsCenter">
    <etm-main-body>
      <etm-layout-split>
        <div slot="header">
          <div class="customerTabItem">
            <etm-tabs
              v-model="activeName"
              :setting="true"
              @setting="setting"
            >
              <span slot="tool">
                <el-button
                  type="text"
                  @click="showPop = true"
                >余额查询</el-button>
              </span>
              <el-tab-pane
                label="短信记录"
                name="sms"
              >
                <etm-tool-bar
                  v-show="show"
                  v-model="formData"
                  @search="handleSearch"
                  @reset="reset"
                />
              </el-tab-pane>
            </etm-tabs>
          </div>
        </div>
        <div slot="body">
          <template v-if="activeName === 'sms'">
            <etm-table-page
              :columns="columns"
              :data="tableData"
              index-type="index"
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
                label="发送情况"
                width="120"
              >
                <template v-slot="scoped">
                  <etm-status :type="scoped.row.sendResult === '成功' ? 'active' : 'danger'">
                    {{ scoped.row.sendResult }}
                  </etm-status>
                </template>
              </el-table-column>
              <el-table-column
                slot="right"
                label="操作"
                width="80"
              >
                <template v-slot="scoped">
                  <template v-if="scoped.row.sendResult!=='成功'">
                    <etm-text
                      type="primary"
                      @click="handleSend(scoped.row.id)"
                    >
                      重发
                    </etm-text>
                  </template>
                </template>
              </el-table-column>
            </etm-table-page>
          </template>
        </div>
      </etm-layout-split>

      <etm-pop
        :visible="showPop"
        pop="simple"
        cancel-btn="取消"
        title="余额查询"
        @open="showPop = true"
        @close="showPop = false"
        @confirm="showPop = false"
        @cancel="showPop = false"
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

          <div class="protocol">
            * 用户必须完全同意 <span @click="intPop=true">《网络电话使用协议》</span>、<span @click="smsPop = true">《短信服务使用协议》</span>的所有服务条款。
          </div>
        </div>
      </etm-pop>
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
    </etm-main-body>
  </div>
</template>

<script>
/**
 * index create by Administrator
 * createTime 2020/8/27 10:03
 */
import { createCall, getAccount, queryEmployeeSelectByTabCode } from '@/api/newDaycare/yunCall'
import { createSms, querySearch, querySmsList, updateSms } from '@/api/newDaycare/yunSms'
import smsProtocol from '@/views/newDaycare/smsCenter/smsProtocol.vue'
import intPop from '@/views/newDaycare/smsCenter/intPop'
import calculation from './calculation'
import shenMsg from '@/views/newDaycare/smsCenter/shenMsg'
import baseMixin from '@/layout/mixin/baseMixin'
import { parseTime } from '@/utils'

export default {
  name: 'Sms',
  components: {
    calculation, shenMsg, smsProtocol, intPop
  },
  filters: {},
  mixins: [baseMixin],
  props: {},
  data () {
    return {
      showPop: false,
      intPop: false,
      shenMsg: false,
      smsPop: false,
      popLogVisible: false,
      basicInfo: {
        callTime: 0,
        messageNum: 0
      },
      columns: [
        {
          label: '发送全部号码',
          prop: 'allList',
          width: '200'
        },
        {
          label: '发送成功的号码',
          prop: 'successList',
          width: '200'
        },
        {
          label: '发送失败的号码',
          prop: 'failedList',
          width: '200'
        },
        {
          label: '短信类型',
          prop: 'templateType',
          width: '100px'
        },
        {
          label: '短信内容',
          prop: 'content'
        },
        {
          label: '计费条数',
          prop: 'billingCount',
          width: '130',
          sortable: true,
          sortBy: 'billingCount'
        },
        {
          label: '发送时间',
          prop: 'sendTime',
          width: '200',
          sortable: true,
          sortBy: 'sendTime'
        },
        {
          label: '发送人',
          prop: 'senderName',
          width: '100px'
        }
      ],
      tableData: {
        content: []
      },
      activeName: 'sms',
      show: true,
      pageInfo: {
        pageNum: 1,
        pageSize: 10
      },
      formData: [
        {
          label: '收件人号码',
          type: 'input',
          prop: 'telephone',
          value: '',
          props: {
            placeholder: '请输入收件人号码'
          }
        },
        {
          label: '短信类型',
          type: 'select',
          prop: 'templateType',
          value: null,
          props: {
            placeholder: '请选择短信类型'
          },
          options: [
            {
              label: '自定义',
              value: 'CUSTOM'
            }, {
              label: '系统',
              value: 'SYSTEM'
            }
          ]
        },
        {
          label: '发送时间',
          type: 'date',
          prop: 'maxCallDuration',
          value: null,
          props: {
            type: 'daterange',
            startPlaceholder: '年/月/日',
            endPlaceholder: '年/月/日'
          }
        },
        {
          label: '发送情况',
          type: 'select',
          prop: 'sendResult',
          value: null,
          props: {
            placeholder: '请选择'
          },
          options: [
            {
              label: '成功',
              value: 'SUCCESS'
            }, {
              label: '失败',
              value: 'FAILED'
            },
            {
              label: '余额不足',
              value: 'INSUFFICIENT_BALANCE'
            }
          ]
        },
        {
          label: '发送人',
          type: 'select',
          prop: 'senderId',
          value: null,
          props: {
            placeholder: '请选择发送人'
          },
          options: [
            {
              label: '云杉',
              value: '1'
            }, {
              label: '大数',
              value: '2'
            }
          ]
        }
      ]
    }
  },
  computed: {},
  watch: {},
  created () {
    this.getAccountData()
    this.getWorkers()
    this.getMsgItem()
    this.getSmsStatus()
    this.init()
  },
  mounted () {
  },
  methods: {
    currentChange (pageNum, pageSize) {
      this.pageInfo = {
        pageNum, pageSize
      }
      this.init()
    },
    setting () {
      this.$router.push({ path: '/newdaycare_smsCenterSetting' })
    },
    init () {
      const telephone = this.getObjectByProp('telephone', this.formData).value
      const templateType = this.getObjectByProp('templateType', this.formData).value
      const sendResult = this.getObjectByProp('sendResult', this.formData).value
      const senderId = this.getObjectByProp('senderId', this.formData).value
      const maxCallDuration = this.getObjectByProp('maxCallDuration', this.formData).value
      // maxCallDuration[0] = (maxCallDuration && maxCallDuration[0] + '00:00:01') || null
      // maxCallDuration[1] = (maxCallDuration && maxCallDuration[0] + '00:00:01') || null
      querySmsList({
        telephone: (telephone) || null,
        templateType: (templateType) || null,
        minSendTime: (maxCallDuration && maxCallDuration[0] + ' 00:00:01') || null,
        maxSendTime: (maxCallDuration && maxCallDuration[1] + ' 23:59:59') || null,
        sendResult: (sendResult) || null,
        senderId: (senderId) || null,
        pageNum: this.pageInfo.pageNum,
        pageSize: this.pageInfo.pageSize
      }).then(res => {
        // console.log(res.data)
        this.tableData = res.data
        this.tableData.content.forEach(item => {
          item.smsType = null
          item.smsResult = null
          item.sendTime = parseTime(item.sendTime, '{y}-{m}-{d} {h}:{i}:{s}')
          // if (item.templateType === 'CUSTOM') {
          //   item.smsType = '自定义'
          // } else {
          //   item.smsType = '系统'
          // }
          // if (item.sendResult === 'SUCCESS') {
          //   item.smsResult = '成功'
          // } else if (item.sendResult === 'FAILED') {
          //   item.smsResult = '失败 '
          // } else {
          //   item.smsResult = '余额不足 '
          // }
        })
      })
    },
    handleSearch () {
      this.pageInfo.pageNum = 1
      this.init()
    },
    reset () {
    },
    getAccountData () {
      getAccount().then((res) => {
        const { data } = res
        this.basicInfo.callTime = Math.floor(data.callTime / 60)
        this.basicInfo.messageNum = data.messageNum
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
    balancePopClose () {
      this.shenMsg = false
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
        this.$set(this.formData[4], 'options', itemSearch)
      })
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
    getMsgItem () {
      const param = {
        name: 'SmsTemplateType'
      }
      querySearch(param).then(res => {
        // console.log(res)
        const data = res.data
        data.forEach(item => {
          item.label = item.name
        })
        this.$set(this.formData[1], 'options', data)
      })
    },
    getSmsStatus () {
      const param = {
        name: 'SmsSendResult'
      }
      querySearch(param).then(res => {
        // console.log(res)
        const data = res.data
        data.forEach(item => {
          item.label = item.name
        })
        this.$set(this.formData[3], 'options', data)
      })
    },
    handleSend (id) {
      updateSms({ id: id }).then(res => {
        this.$message.success('发送成功')
        this.init()
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
