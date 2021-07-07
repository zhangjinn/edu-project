<template>
  <div class="earnestMoney-wrap">
    <etm-layout-split>
      <div slot="header">
        <etm-tabs v-model="activeName">
          <el-tab-pane name="order" label="订金管理">
            <etm-tool-bar v-model="formData" @search="handleSearch" @reset="reset" />
          </el-tab-pane>
        </etm-tabs>
      </div>

      <div slot="body">
        <etm-table-page :data="tableData" index :columns="columns" @currentChange="currentChange">
          <el-table-column slot="left" label="定金单号" fixed="left" min-width="120">
            <template slot-scope="scoped">
              <el-button type="text" @click="changeEarnes(scoped.row.earnestMoneyId)">{{
                scoped.row.orderNo
              }}
              </el-button>
            </template>
          </el-table-column>

          <el-table-column slot="right" label="操作" width="120" fixed="right">
            <template slot-scope="scoped">
              <etm-text
                v-if="scoped.row.status === '未使用'"
                v-has="{authId: 'daycare.earnestMoney.update'}"
                type="primary"
                @click="changeEarnes(scoped.row.earnestMoneyId, true, true)"
              >编辑
              </etm-text>

              <etm-text v-if="scoped.row.status === '未使用'" v-has="{authId: 'daycare.earnestMoney.remove'}" type="danger" @click="deleteEarnes(scoped.row.earnestMoneyId)">删除
              </etm-text>
            </template>
          </el-table-column>
        </etm-table-page>
      </div>

      <etm-drawer
        :visible.sync="studentDrawer"
      >
        <etm-layout-split>
          <etm-title :show-line="false" border size="big">
            修改定金
            <template slot="tool">
              <template v-if="isEdit">
                <el-button plain size="mini" @click="cancel">取消</el-button>
                <el-button type="primary" size="mini" @click="save">保存</el-button>
              </template>
              <template v-else>
                <el-button v-if="earnestDetail.status" v-has="{authId: 'daycare.earnestMoney.update'}" plain size="mini" @click="edit">编辑</el-button>
              </template>

            </template>
          </etm-title>

          <template v-if="isEdit">
            <deposit ref="deposit" v-model="earnestDetail" :pay-type="payType" />
          </template>
          <template v-else>
            <div>
              <etm-field-label label="定金单号" type="left">{{ earnestDetail.orderNo }}</etm-field-label>
              <etm-field-label label="学员姓名" type="left">{{ earnestDetail.childName }}</etm-field-label>
              <etm-field-label label="业务类型" type="left">{{ type[earnestDetail.type] }}</etm-field-label>
              <etm-field-label label="定金金额" type="left">{{ earnestDetail.money }}</etm-field-label>
              <etm-field-label label="支付方式" type="left">{{ payType[earnestDetail.paymentId] }}</etm-field-label>
              <etm-field-label label="收费日期" type="left">{{ earnestDetail.dateCharge }}</etm-field-label>
              <etm-field-label label="定金状态" type="left">{{
                earnestDetail.status !== 'USED' ? '未使用' : '已使用'
              }}
              </etm-field-label>
              <etm-field-label label="登记人" type="left">{{ earnestDetail.createName }}</etm-field-label>
              <etm-field-label label="登记时间" type="left">{{ earnestDetail.crateTime }}</etm-field-label>
              <etm-field-label label="备注" type="left">{{ earnestDetail.remark }}</etm-field-label>
            </div>
          </template>

        </etm-layout-split>
      </etm-drawer>

    </etm-layout-split>

  </div>

</template>

<script>
/**
 * earnestMoney create by Administrator
 * createTime 2020/8/31 14:12
 */

// import SearchField from '@/views/daycare/childManage/myChild/components/searchField'
import Deposit from './components/deposit'
import baseMixin from '@/layout/mixin/baseMixin'
import { parseTime } from '@/utils'
import { deepClone } from '../common'
import {
  queryDepositList,
  queryDeposit,
  removeDeposit,
  updateDeposit,
  queryPayType
} from '@/api/newDaycare/contract'

export default {
  name: 'EarnestMoney',
  components: {
    // SearchField,
    Deposit
  },
  filters: {},
  mixins: [baseMixin],
  props: {},
  data() {
    return {
      drawerPath: false,
      isEdit: true,
      studentDrawer: false,
      activeName: 'order',
      showDeposit: false,
      showStudent: false,
      payType: [],
      searchKey: {},
      earnestDetail: {},
      earnestDetail2: {},
      tableData2: {
        content: [{}]
      },
      type: {
        TEACH: '早教',
        TODDLER: '幼儿园',
        CARE: '托育园'
      },
      tableData: {
        content: [{}]
      },
      pageInfo: {
        pageNum: 1,
        pageSize: 10,
        paged: true
      },
      // payType: {
      //   WECHAT: '微信',
      //   ALIPAY: '支付宝',
      //   CASH: '现金',
      //   BAND_CARD: '银行卡',
      //   NOT_USED: 'pos机'
      // },
      columns: [
        {
          label: '学员姓名',
          width: '120',
          prop: 'childName',
          fixed: 'left'
        }, {
          label: '联系人手机号',
          width: '120',
          prop: 'personPhone',
          fixed: 'left'
        }, {
          label: '联系人姓名',
          width: '120',
          prop: 'personName'
          // fixed: 'left'
        }, {
          label: '定金状态',
          width: '120',
          prop: 'status'
          // fixed: 'left'
        }, {
          label: '定金金额(元)',
          width: '120',
          prop: 'money',
          align: 'right'
          //  fixed: 'left'
        }, {
          label: '支付方式',
          width: '120',
          prop: 'paymentName'
          //  fixed: 'left'
        }, {
          label: '关联单号',
          width: '120',
          prop: 'oddNumbers'
          // fixed: 'left'
        }, {
          label: '收费日期',
          width: '120',
          prop: 'dateCharge'
          // fixed: 'left'
        }, {
          label: '经办人',
          width: '120',
          prop: 'currentEmployeeName'
          // fixed: 'left'
        }, {
          label: '经办时间',
          width: '120',
          prop: 'createTime'
          //  fixed: 'left'
        }
      ],
      formData: [
        {
          label: '学员姓名',
          type: 'input',
          value: '',
          prop: 'childName',
          props: {
            placeholder: '请输入学员姓名'
          }
        }, {
          label: '定金状态',
          type: 'select',
          prop: 'status',
          value: '',
          props: {
            placeholder: '请选择定金状态',
            clearable: true,
            filterable: true
          },
          options: [
            {
              label: '已使用',
              value: 'USED'
            }, {
              label: '未使用',
              value: 'NOT_USED'
            }
          ]
        }, {
          label: '登记时间',
          type: 'date',
          value: '',
          prop: 'time',
          props: {
            type: 'daterange',
            startPlaceholder: '年/月',
            endPlaceholder: '年/月'
          }
        }
      ]
    }
  },
  computed: {},
  watch: {},
  created() {
    this.init()
  },
  mounted() {
  },
  methods: {
    currentChange(pageNum, pageSize) {
      this.pageInfo = {
        pageNum,
        pageSize,
        paged: true
      }
      this.init(this.searchKey)
    },
    /* 打开合同详情 */
    changeEarnes(id, edit = false, drawerPath = false) {
      this.drawerPath = drawerPath
      this.isEdit = edit
      this.studentDrawer = true

      queryDeposit({ earnestMoneyId: id }).then(res => {
        res.data.dateCharge = parseTime(res.data.dateCharge, '{y}-{m}-{d}')
        // console.log(res.data)
        res.data.crateTime = parseTime(res.data.crateTime, '{y}-{m}-{d}')
        res.data.chargeDate = parseTime(res.data.dateCharge, '{y}-{m}-{d}')
        res.data.paymentType = `${res.data.paymentId}`

        this.earnestDetail = deepClone(res.data)
        this.earnestDetail2 = deepClone(res.data)
      })
    },
    /* 删除合同 */
    deleteEarnes(id) {
      this.$etmTip.init({
        type: 'warn',
        title: '确定要删除订单？',
        content: '',
        confirmBtn: '删除',
        cancelBtn: '取消',
        confirm: () => {
          removeDeposit({ earnestMoneyId: id }).then(res => {
            this.$message.success('删除成功')
            this.init(this.searchKey)
          })
          this.$etmTip.close()
        },
        cancel: () => {
          this.$etmTip.close()
        }
      })
      this.$etmTip.open()
    },
    init(search = {}) {
      const params = Object.assign({
        childName: null,
        status: null,
        createTime: '',
        updateTime: '',
        pageNum: 1,
        pageSize: 10,
        paged: true
      }, search, this.pageInfo)

      queryPayType().then(res => {
        const _result = {}

        res.data.forEach(cur => {
          _result[cur.financePayTypeId] = cur.financePayTypeName
        })

        this.payType = _result
      })

      queryDepositList(params).then(res => {
        this.tableData = res.data
        const result = res.data['content']
        result.forEach((cur, index) => {
          result[index].status = cur.status === 'NOT_USED' ? '未使用' : '已使用'
          result[index].paymentType = this.payType[cur.paymentType]
          result[index].createTime = parseTime(cur.createTime, '{y}-{m}-{d}')
          result[index].dateCharge = parseTime(cur.dateCharge, '{y}-{m}-{d}')
        })

        this.tableData['content'] = result
      })
    },
    handleSearch(event) {
      this.pageInfo.pageNum = 1

      const searchKey = {}
      event.forEach(cur => {
        if (cur.prop === 'time') {
          searchKey['createTime'] = cur.value[0]
          searchKey['updateTime'] = cur.value[1]
        } else {
          searchKey[cur.prop] = cur.value
        }
      })

      this.searchKey = searchKey
      this.$nextTick(() => {
        this.init(searchKey)
      })
    },
    reset() {
      this.searchKey = {}
      this.init()
    },
    cancel() {
      this.earnestDetail = this.earnestDetail2
      this.isEdit = false

      this.$refs['deposit'].$refs['form'].$children[0].resetFields()
      if (this.drawerPath) {
        this.studentDrawer = false
        return
      }
      this.isEdit = false
    },
    save() {
      this.isEdit = false
      // console.log(this.earnestDetail)

      this.$refs['deposit'].$refs['form'].$children[0].validate(valid => {
        if (valid) {
          this.earnestDetail.earnestMoneyId = this.earnestDetail.id
          updateDeposit(this.earnestDetail).then(res => {
            this.isEdit = false
            this.$message.success('修改成功')
            this.init(this.searchKey)
            this.$refs['deposit'].$refs['form'].$children[0].resetFields()
            this.earnestDetail2 = Object.assign({}, this.earnestDetail, res.data)
            this.earnestDetail = Object.assign({}, this.earnestDetail, res.data)
          })
        }
      })
    },
    edit() {
      this.drawerPath = false
      this.isEdit = true
    },
    query() {

    },

    // depositOpen() {
    //   this.showDeposit = true
    // },
    // depositClose() {
    //   this.showDeposit = false
    // },
    // depositConfirm() {
    //   this.showDeposit = false
    // },
    studentClose() {
      this.showStudent = false
    },
    studentOpen() {
      this.showStudent = true
    }
  }
}
</script>
<style lang="scss" scoped>
.earnestMoney-wrap {
  margin-top: 16px;
}
</style>
