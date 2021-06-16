<template>
  <div class="index-wrap">
    <etm-main-body>
      <etm-layout-split>
        <div slot="header">
          <etm-tabs
            v-model="activeName"
            setting
            @setting="setting"
          >
            <el-tab-pane
              label="收入流水"
              name="income"
            >
              <etm-tool-bar
                v-model="formData"
                @search="handleSearch"
                @reset="handleReset"
              />
            </el-tab-pane>
          </etm-tabs>
        </div>
        <div slot="body">
          <etm-table-page
            v-fixedHead
            :columns="columns"
            :data="tableData"
            :cell-class-name="cellClassNameMethod"
            selection
            @currentChange="currentChange"
          >
            <etm-table-tool-bar slot="tool">
              <div slot="right">
                <el-button
                  type="primary"
                  @click="noteDown"
                >
                  <i class="el-icon-plus" /> 记一笔
                </el-button>

                <el-button
                  plain
                  @click="exportExcel"
                >
                  导出Excel
                </el-button>
              </div>
            </etm-table-tool-bar>
            <el-table-column
              prop="type"
              label="收入类型"
              fixed="left"
              width="120"
            />
            <el-table-column
              prop="incomeExpenditureTypeName"
              label="收入科目"
              fixed="left"
              width="120"
            />

            <el-table-column
              prop="reconciliationStatus"
              label="对账状态"
              fixed="left"
              width="120"
            >
              <template slot-scope="scoped">
                <etm-status :type="scoped.row.reconciliationStatus==='已对账' ? 'primary' : 'inactive'">
                  {{ scoped.row.reconciliationStatus }}
                </etm-status>
              </template>
            </el-table-column>

            <el-table-column
              prop="amountOfPayout"
              label="收入金额(元)"
              fixed="left"
              width="140"
              align="right"
              sortable
              sort-by="amountOfPayout"
            >
              <template slot-scope="scoped">
                <span>{{ scoped.row.amountOfPayout.toFixed(2) }}</span>
              </template>
            </el-table-column>
            <el-table-column
              label="关联单号"
              fixed="left"
              width="200"
            >
              <template slot-scope="scoped">
                <div v-if="scoped.row.associatedSingleNumber === '--'">
                  {{ scoped.row.associatedSingleNumber }}
                </div>
                <etm-text
                  v-else
                  @click="trigger(scoped, {name : whatComponent(scoped.row.sourceType), arguments : {edit:false, id : scoped.row.cacContractId, contractType : scoped.row.contractType, contractStatusEnum : scoped.row.contractStatusEnum}})"
                >
                  {{ scoped.row.associatedSingleNumber }}
                </etm-text>
              </template>
            </el-table-column>
            <el-table-column
              label="操作"
              width="200"
              fixed="right"
            >
              <template v-slot="{row}">
                <div
                  v-if="showOperation(row) === 1"
                  slot="tool"
                >
                  <etm-text @click="handleRecon(row)">
                    对账
                  </etm-text>
                </div>
                <div
                  v-else-if="showOperation(row) === 2"
                  slot="tool"
                >
                  <etm-text @click="handleRecon(row)">
                    对账
                  </etm-text>
                  <etm-text @click="handleEdit(row)">
                    编辑
                  </etm-text>
                  <etm-text
                    type="danger"
                    @click="handleDel(row)"
                  >
                    删除
                  </etm-text>
                </div>
                <div
                  v-else
                  slot="tool"
                >
                  <etm-text
                    type="primary"
                    @click="handleUnRecon(row)"
                  >
                    撤销对账
                  </etm-text>
                </div>
              </template>
            </el-table-column>
          </etm-table-page>
        </div>
      </etm-layout-split>
      <!-- 点击编辑弹出侧拉卡-->
      <etm-drawer
        :visible.sync="showSide"
        type="small"
      >
        <etm-layout-split>
          <etm-title
            border
            size="big"
          >
            编辑收入
            <template slot="tool">
              <el-button
                plain
                size="mini"
                @click="drawerCancel"
              >
                取消
              </el-button>
              <el-button
                type="primary"
                size="mini"
                @click="drawerSave"
              >
                保存
              </el-button>
            </template>
          </etm-title>
          <etm-form
            ref="sideFormRef"
            type="dialog"
            :model="sideForm"
          >
            <el-form-item
              prop="incomeTypeSide"
              label="收入科目"
              :rules="[{required: true, message: '请选择支出科目'}]"
            >
              <el-select
                v-model="sideForm.incomeTypeSide"
                placeholder="请选择收入科目"
              >
                <el-option
                  v-for="item in sideForm.incomeTypeSideList"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
            <el-form-item
              prop="type"
              label="业务类型"
              :rules="[{required: true, message: '请选择业务类型'}]"
            >
              <el-select
                v-model="sideForm.type"
                placeholder="请选择业务类型"
              >
                <el-option
                  v-for="item in businessTypeList"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
            <el-form-item
              prop="reconMoneySide"
              label="收入金额"
              :rules="[formValidate.nullValueRule(true, '请输入收入金额'), formValidate.isNumberRule()]"
            >
              <el-input
                v-model="sideForm.reconMoneySide"
                placeholder="请输入收入金额"
              />
            </el-form-item>
            <el-form-item
              prop="modePaySide"
              label="支付方式"
              required
            >
              <el-select
                v-model="sideForm.modePaySide"
                placeholder="请选择支付方式"
              >
                <el-option
                  v-for="item in sideForm.modePaySideList"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
            <el-form-item
              prop="remarkSide"
              label="备注"
            >
              <el-input
                v-model="sideForm.remarkSide"
                type="textarea"
                placeholder="请输入备注"
                :rows="3"
                maxlength="200"
                :show-word-limit="true"
              />
            </el-form-item>
          </etm-form>
        </etm-layout-split>
      </etm-drawer>
      <!-- 记一笔-->
      <etm-pop
        :visible="showPop"
        pop="complex"
        title="记一笔"
        confirm-btn="确定"
        cancel-btn="取消"
        @close="closePop"
        @confirm="handleConfirm"
        @cancel="handleCancel"
      >
        <etm-form
          ref="popFormRef"
          type="dialog"
          :model="popForm"
        >
          <el-form-item
            label="收入科目"
            prop="incomeTypePop"
            :rules="[{required: true, message: '请选择收入类型'}]"
          >
            <el-select
              v-model="popForm.incomeTypePop"
              placeholder="请选择收入科目"
            >
              <el-option
                v-for="item in popForm.incomeTypePopList"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item
            prop="type"
            label="业务类型"
            :rules="[{required: true, message: '请选择业务类型'}]"
          >
            <el-select
              v-model="popForm.type"
              placeholder="请选择业务类型"
            >
              <el-option
                v-for="item in businessTypeList"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item
            prop="incomeMoneyPop"
            label="收入金额"
            :rules="[formValidate.nullValueRule(true, '请输入收入金额'), formValidate.isNumberRule()]"
          >
            <el-input
              v-model="popForm.incomeMoneyPop"
              placeholder="请输入收入金额"
            />
          </el-form-item>
          <el-form-item
            label="支付方式"
            prop="modePayPop"
            :rules="[{required: true, message: '请选择支付方式'}]"
          >
            <el-select
              v-model="popForm.modePayPop"
              placeholder="请选择支付方式"
            >
              <el-option
                v-for="item in popForm.modePayPopList"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item
            label="到账日期"
            prop="intoDatePop"
            :rules="[{required: true, message: '请选择到账日期'}]"
          >
            <el-date-picker
              v-model="popForm.intoDatePop"
              type="date"
              placeholder="选择日期"
            />
          </el-form-item>
          <el-form-item label="备注">
            <el-input
              v-model="popForm.textareaPop"
              type="textarea"
              placeholder="请输入备注"
              :rows="3"
              maxlength="200"
              :show-word-limit="true"
            />
          </el-form-item>
        </etm-form>
      </etm-pop>
      <!-- 合同详情 嵌套模板-->
      <component
        :is="popComponent[popType]"
        v-if="popType"
        ref="component"
        :prop="componentData"
      />
      <!-- 订金详情-->
      <etm-drawer
        :visible.sync="showDepositDrawer"
        @before-close="beforeClose"
      >
        <deposit :row="row" />
      </etm-drawer>
      <!--云视频订单详情-->
      <etm-drawer
        :visible.sync="showSideOrderDetail"
      >
        <etm-layout-split>
          <etm-title
            :show-line="true"
            border
          >
            详情
          </etm-title>
          <etm-field-label
            label="订单编号"
            type="left"
          >
            {{ orderDetail.orderNo }}
          </etm-field-label>
          <etm-field-label
            label="联系人姓名"
            type="left"
          >
            {{ orderDetail.contactName }}
          </etm-field-label>
          <etm-field-label
            label="联系人电话"
            type="left"
          >
            {{ orderDetail.contactPhone }}
          </etm-field-label>
          <etm-field-label
            label="学员姓名"
            type="left"
          >
            {{ orderDetail.childName }}
          </etm-field-label>
          <etm-field-label
            label="购买时长"
            type="left"
          >
            {{ orderDetail.buyTime }}
          </etm-field-label>
          <etm-field-label
            label="支付金额"
            type="left"
          >
            {{ orderDetail.payAmount }}
          </etm-field-label>
          <etm-field-label
            label="支付日期"
            type="left"
          >
            {{ orderDetail.payDate }}
          </etm-field-label>
          <etm-field-label
            label="到期日期"
            type="left"
          >
            {{ orderDetail.expireDate }}
          </etm-field-label>
        </etm-layout-split>
      </etm-drawer>
      <etm-drawer
        :visible.sync="showDrawer"
        :type="drawerType"
      >
        <etm-layout-split>
          <order-drawer
            v-if="guardCareOrder==='order'&&showDrawer"
            :order-data="orderData"
          />
          <video-drawer
            v-else-if="guardCareOrder==='video'&&showDrawer"
            :video-data="videoData"
          />
        </etm-layout-split>
      </etm-drawer>
    </etm-main-body>
  </div>
</template>

<script>
/**
 * index create by Administrator
 * createTime 2020/9/8 16:33
 */
import orderDrawer from './components/orderDrawer'
import videoDrawer from './components/videoDrawer'
import {
  queryIncomeAndExpenditureFlow,
  queryIncomeOrExpenditureType,
  reconciliation,
  financePayType,
  addIncomeAndExpensesFlow,
  delIncomeAndExpensesFlow,
  queryEditIncomeAndExpensesFlow,
  downExcel,
  getDeviceOrderByCode,
  getOrderByCode, updateIncomeAndExpensesFlow
} from '@/api/newDaycare/incomeFlow'
import { queryCloudVideoOrderDetail } from '@/api/newDaycare/cloudVideoOrder'
import { parseTime } from '@/utils'
import baseMixin from '@/layout/mixin/baseMixin'
import cacChargeDetail from './components/careContract/chargeDetail'
import tcChargeDetail from './components/teachContract/chargeDetail'
// import cacChargeDetail from '@/views/daycare/contract/careContract/components/chargeDetail/'
// import tcChargeDetail from '@/views/daycare/contract/teachContract/components/chargeDetail/'
import deposit from './components/deposit'
import { downloadFileForUrl } from '@/utils/file'
import formValidate from '@/utils/rules'

export default {
  name: 'Index',
  components: {
    cacChargeDetail,
    tcChargeDetail,
    deposit,
    orderDrawer,
    videoDrawer
  },
  filters: {},
  mixins: [baseMixin],
  props: {},
  data () {
    return {
      formValidate,
      search: {},
      popComponent: {
        cacChargeDetail: cacChargeDetail,
        tcChargeDetail: tcChargeDetail
      },
      activeName: 'income',
      formData: [
        {
          label: '收入类型',
          type: 'select',
          prop: 'type',
          value: '',
          props: {
            placeholder: '请输入收入类型'
          },
          options: [
            {
              label: '记一笔',
              value: true
            },
            {
              label: '系统生成',
              value: false
            }
          ]
        },
        {
          label: '收入科目',
          type: 'input',
          value: '',
          prop: 'subjectName',
          props: {
            placeholder: '请输入收入科目'
          }
        },
        {
          label: '对账状态',
          type: 'select',
          value: '',
          prop: 'reconciliationStatus',
          props: {
            placeholder: '请选择对账状态'
          },
          options: [
            {
              label: '未对账',
              value: 'UNRECONCILED'
            }, {
              label: '已对账',
              value: 'RECONCILED'
            }
          ]
        },
        {
          label: '到账日期',
          type: 'date',
          value: [],
          prop: 'payOutDate',
          props: {
            type: 'daterange',
            startPlaceholder: '年/月',
            endPlaceholder: '年/月'
          }
        },
        {
          label: '经办人',
          type: 'input',
          value: '',
          prop: 'createName',
          props: {
            placeholder: '请输入经办人姓名'
          }
        },
        {
          label: '经办时间',
          type: 'date',
          value: [],
          prop: 'manageDate',
          props: {
            type: 'daterange',
            startPlaceholder: '年/月',
            endPlaceholder: '年/月'
          }
        }
      ],
      incomeExpenditureTypeName: '',
      reconciliationStatus: '',
      amountOfPayout: '',
      associatedSingleNumber: '',
      columns: [
        {
          label: '支付方式',
          prop: 'payTypeName',
          width: '120'
        }, {
          label: '到账日期',
          prop: 'payOutDate',
          width: '120',
          sortable: true,
          sortBy: 'payOutDate'
        }, {
          label: '经办人',
          prop: 'createName',
          width: '120'
        }, {
          label: '经办时间',
          prop: 'manageDate',
          width: '120',
          sortable: true,
          sortBy: 'manageDate'
        }, {
          label: '对账人员',
          prop: 'reconciliationName',
          width: '120'
        }, {
          label: '对账时间',
          prop: 'reconciliationDate',
          width: '120',
          sortable: true,
          sortBy: 'reconciliationDate'
        }, {
          label: '备注',
          prop: 'remarks'
        }
      ],
      tableData: {
        pageNum: 1,
        pageSize: 10,
        totalElements: 888,
        totalPages: 22,
        content: []
      },
      showPop: false,
      popForm: {
        incomeTypePop: '',
        incomeTypePopList: [],
        incomeMoneyPop: '',
        modePayPop: '',
        modePayPopList: [],
        intoDatePop: '',
        textareaPop: '',
        type: ''
      },
      showSide: false,
      currentId: '',
      sideForm: {
        incomeTypeSideList: [],
        modePaySideList: [],
        incomeTypeSide: '',
        reconMoneySide: '',
        modePaySide: '',
        remarkSide: '',
        type: ''
      },
      showContractDrawer: false,
      showDepositDrawer: false,
      row: '',
      popType: '',
      componentData: {},
      pageInfo: {
        pageNum: 1,
        pageSize: 10
      },
      showSideOrderDetail: false,
      orderDetail: {},
      showDrawer: false,
      drawerType: 'small',
      orderData: {},
      videoData: {},
      guardCareOrder: '',
      businessTypeList: [
        {
          label: '幼儿园',
          value: 'TODDLER'
        },
        {
          label: '托育园',
          value: 'CARE'
        },
        {
          label: '早教',
          value: 'TEACH'
        }
      ]
    }
  },
  computed: {
    whatComponent () {
      return (sourceType) => {
        // console.log(sourceType)
        if (sourceType === 'TEACH') {
          return 'tcChargeDetail'
        } else {
          return 'cacChargeDetail'
        }
      }
    }
  },
  watch: {},
  created () {
  },
  mounted () {
    this.init()
  },
  methods: {
    cellClassNameMethod ({ row, column, columnIndex }) {
      if (columnIndex === 3) { // 状态栏
        if (row.reconciliationStatus === '未对账') {
          return 'enabled'
        }
        if (row.reconciliationStatus === '已对账') {
          return 'disabled'
        }
      }
    },
    init () {
      const result = Object.assign({
        incomeOrExpensesType: 'INCOME',
        type: null,
        subjectName: null,
        reconciliationStatus: null,
        startPayOutDate: null,
        endPayOutDate: null,
        createName: null,
        startManageDate: null,
        endManageDate: null,
        pageNum: null,
        pageSize: null
      }, this.search, this.pageInfo)
      // 初始化表格数据
      queryIncomeAndExpenditureFlow(result).then(res => {
        this.tableData = res.data
        this.tableData.content.forEach(item => {
          if (item.reconciliationStatus === 'RECONCILED') {
            item.reconciliationStatus = '已对账'
          } else {
            item.reconciliationStatus = '未对账'
          }
          item.payOutDate = item.payOutDate && parseTime(item.payOutDate, '{y}-{m}-{d}')
          item.manageDate = item.manageDate && parseTime(item.manageDate, '{y}-{m}-{d}')
          item.reconciliationDate = item.reconciliationDate && parseTime(item.reconciliationDate, '{y}-{m}-{d}')
          item.type = item.type ? '记一笔' : '系统生成'
        })
      })
      // 初始化收入类型
      queryIncomeOrExpenditureType({
        type: 'INCOME'
      }).then(res => {
        const options = []
        res.data.forEach(item => {
          options.push({
            label: item.incomeAndExpenditureTypeName,
            value: item.incomeAndExpenditureTypeId
          })
        })
        this.sideForm.incomeTypeSideList = this.popForm.incomeTypePopList = options
      })
    },
    currentChange (pageNum, pageSize) {
      this.pageInfo = {
        pageNum,
        pageSize
      }
      this.init()
    },
    handleFollow (row) {
    },
    // 对账
    handleRecon (row) {
      this.$etmTip.init({
        type: 'warn',
        title: '确认核对此收入？',
        content: `收入金额（元）${row.amountOfPayout.toFixed(2)}`,
        confirmBtn: '确定',
        cancelBtn: '取消',
        confirm: () => {
          const incomeAndExpensesFlowId = row.id
          reconciliation({
            incomeAndExpensesFlowId
          }).then(res => {
            if (res.message === '成功') {
              this.$etmTip.close()
              this.$message({
                message: '已对账',
                type: 'success'
              })
              this.init()
            }
          })
        },
        cancel: () => {
          this.$etmTip.close()
          this.$message({
            type: 'info',
            message: '取消对账'
          })
        }
      })
      this.$etmTip.open()
    },
    // 撤销对账
    handleUnRecon (row) {
      this.$etmTip.init({
        type: 'warn',
        title: '确认撤销对账？',
        content: '',
        confirmBtn: '确定',
        cancelBtn: '取消',
        confirm: () => {
          const incomeAndExpensesFlowId = row.id
          reconciliation({
            incomeAndExpensesFlowId
          }).then(res => {
            if (res.message === '成功') {
              this.$etmTip.close()
              this.$message({
                message: '撤销对账成功',
                type: 'success'
              })
              this.init()
            }
          })
        },
        cancel: () => {
          this.$etmTip.close()
          this.$message({
            type: 'info',
            message: '取消操作'
          })
        }
      })
      this.$etmTip.open()
    },
    // 编辑
    handleEdit (row) {
      this.currentId = row.id
      financePayType().then(res => {
        const modePaySideList = []
        res.data.forEach(item => {
          modePaySideList.push({
            label: item.financePayTypeName,
            value: item.financePayTypeId
          })
        })
        this.sideForm.modePaySideList = modePaySideList
      })
      queryEditIncomeAndExpensesFlow({
        incomeAndExpensesFlowId: this.currentId
      }).then(res => {
        this.sideForm.incomeTypeSide = res.data.incomeExpenditureTypeId
        this.sideForm.reconMoneySide = res.data.amountOfPayout
        this.sideForm.modePaySide = res.data.payTypeId
        this.sideForm.remarkSide = res.data.remarks
        this.sideForm.type = res.data.type
        let testIncomeTypeSide = ''
        this.sideForm.incomeTypeSideList.forEach(item => {
          if (item.value === this.sideForm.incomeTypeSide) {
            testIncomeTypeSide = this.sideForm.incomeTypeSide
          }
        })
        this.sideForm.incomeTypeSide = testIncomeTypeSide
      })
      this.showSide = true
    },
    // 删除
    handleDel (row) {
      if (row.reconciliationStatus === 'RECONCILED') {
        this.$message({
          type: 'info',
          message: '已对账的订单不可删除'
        })
      } else {
        this.$etmTip.init({
          type: 'warn',
          title: '确认删除？',
          content: '',
          confirmBtn: '确认',
          cancelBtn: '取消',
          confirm: () => {
            this.$etmTip.close()
            delIncomeAndExpensesFlow({
              incomeAndExpensesFlowId: row.id
            }).then(res => {
              if (res.message === '成功') {
                this.$message({
                  type: 'success',
                  message: '删除成功'
                })
                this.init()
              } else {
                this.$message({
                  type: 'error',
                  message: '删除失败'
                })
              }
            })
          },
          cancel: () => {
            this.$message({
              type: 'info',
              message: '取消操作'
            })
            this.$etmTip.close()
          }
        })
        this.$etmTip.open()
      }
    },
    drawerCancel () {
      this.$refs.sideFormRef.$children[0].resetFields()
      this.$message({
        type: 'info',
        message: '取消操作'
      })
      this.showSide = false
    },
    drawerSave () {
      this.$refs.sideFormRef.$children[0].validate(valid => {
        if (valid) {
          const incomeAndExpensesFlowId = this.currentId
          const incomeExpenditureTypeId = this.sideForm.incomeTypeSide
          const amountOfPayout = this.sideForm.reconMoneySide
          const payTypeId = this.sideForm.modePaySide
          const remarks = this.sideForm.remarkSide
          const type = this.sideForm.type
          updateIncomeAndExpensesFlow({
            incomeAndExpensesFlowId,
            incomeExpenditureTypeId,
            amountOfPayout,
            payTypeId,
            remarks,
            type
          }).then(res => {
            if (res.message === '成功') {
              this.$message({
                type: 'success',
                message: '修改成功'
              })
              this.init()
            } else {
              this.$message({
                type: 'error',
                message: '修改失败'
              })
            }
          })
          this.showSide = false
        } else {
          this.$message({
            type: 'error',
            message: '验证失败，请检查输入的内容是否符合要求'
          })
        }
      })
    },
    // 收入流水设置
    setting () {
      this.$router.push('/newdaycare_incomeFlowSetting')
    },
    // 查询事件
    handleSearch () {
      const incomeOrExpensesType = 'INCOME'
      // const incomeExpenditureTypeId = this.getObjectByProp('incomeExpenditureTypeName', this.formData).value
      const type = this.getObjectByProp('type', this.formData).value
      const subjectName = this.getObjectByProp('subjectName', this.formData).value
      const reconciliationStatus = this.getObjectByProp('reconciliationStatus', this.formData).value
      const payOutDate = this.getObjectByProp('payOutDate', this.formData).value
      const [startPayOutDate, endPayOutDate] = payOutDate ? [...payOutDate] : [...[]]
      const createName = this.getObjectByProp('createName', this.formData).value
      const manageDate = this.getObjectByProp('manageDate', this.formData).value
      const [startManageDate, endManageDate] = manageDate ? [...manageDate] : [...[]]
      this.pageInfo = {
        pageNum: 1,
        pageSize: 10
      }
      this.search = {
        incomeOrExpensesType,
        type,
        subjectName,
        reconciliationStatus,
        payOutDate,
        startPayOutDate,
        endPayOutDate,
        startManageDate,
        endManageDate,
        createName,
        manageDate
      }
      this.init()
    },
    handleReset () {
      this.search = {}
      this.pageInfo = {
        pageNum: 1,
        pageSize: 10
      }
      // this.init()
    },
    // 记一笔
    noteDown () {
      // this.formData.forEach(item => {
      //   if (item.prop === 'incomeExpenditureTypeName') {
      //     this.incomeTypePopList = item.options
      //   }
      // })
      financePayType().then(res => {
        const modePayPopList = []
        res.data.forEach(item => {
          modePayPopList.push({
            label: item.financePayTypeName,
            value: item.financePayTypeId
          })
        })
        this.popForm.modePayPopList = modePayPopList
      })
      this.showPop = true
    },
    // 记一笔确定
    handleConfirm () {
      this.$refs.popFormRef.$children[0].validate(valid => {
        if (!valid) {
          this.$message({
            type: 'error',
            message: '操作失败，请检查是否符合输入要求'
          })
        } else {
          const obj = {
            incomeExpenditureTypeId: this.popForm.incomeTypePop,
            amountOfPayout: this.popForm.incomeMoneyPop,
            payTypeId: this.popForm.modePayPop,
            payOutDate: parseTime(this.popForm.intoDatePop, '{y}-{m}-{d}'),
            remarks: this.popForm.textareaPop,
            sourceType: 'MAKE_A_NOTE',
            incomeOrExpensesType: 'INCOME',
            type: this.popForm.type
          }
          // const incomeExpenditureTypeId = this.popForm.incomeTypePop
          // const amountOfPayout = this.popForm.incomeMoneyPop
          // const associatedSingleNumber =
          // const payTypeId = this.popForm.modePayPop
          // const payOutDate = this.popForm.intoDatePop
          // const remarks = this.popForm.textareaPop
          // const sourceType = 'MAKE_A_NOTE'
          // const incomeOrExpensesType = 'INCOME'
          // console.log(obj)
          addIncomeAndExpensesFlow(obj).then(res => {
            if (res.message === '成功') {
              this.$message({
                type: 'success',
                message: '记一笔成功'
              })
              this.init()
            }
          })
          this.showPop = false
        }
      })
    },
    // 记一笔取消
    handleCancel () {
      this.$message({
        type: 'info',
        message: '取消记一笔操作'
      })
      this.showPop = false
    },
    // 关闭弹窗重置数据
    closePop () {
      // this.showPop = false
      // this.popForm.incomeTypePop = ''
      // this.popForm.incomeTypePopList = []
      // this.popForm.incomeMoneyPop = ''
      // this.popForm.modePayPop = ''
      // this.popForm.modePayPopList = []
      // this.popForm.intoDatePop = ''
      this.popForm.textareaPop = ''
      this.$refs.popFormRef.$children[0].resetFields()
      this.showPop = false
    },
    // 导出excel
    exportExcel () {
      const incomeOrExpensesType = 'INCOME'
      // const incomeExpenditureTypeId = this.getObjectByProp('incomeExpenditureTypeName', this.formData).value
      const type = this.getObjectByProp('type', this.formData).value
      const subjectName = this.getObjectByProp('subjectName', this.formData).value
      const reconciliationStatus = this.getObjectByProp('reconciliationStatus', this.formData).value
      const payOutDate = this.getObjectByProp('payOutDate', this.formData).value
      const [startPayOutDate, endPayOutDate] = payOutDate ? [...payOutDate] : [...[]]
      const createName = this.getObjectByProp('createName', this.formData).value
      const manageDate = this.getObjectByProp('manageDate', this.formData).value
      const [startManageDate, endManageDate] = manageDate ? [...manageDate] : [...[]]
      downExcel({
        type,
        subjectName,
        reconciliationStatus,
        startPayOutDate,
        endPayOutDate,
        createName,
        startManageDate,
        endManageDate,
        incomeOrExpensesType
      }).then(res => {
        downloadFileForUrl(res)
      })
    },
    // 显示操作状态
    showOperation (row) {
      if (row.reconciliationStatus === '未对账' && row.sourceType !== 'MAKE_A_NOTE') { // 显示对账
        return 1
      } else if (row.reconciliationStatus === '未对账' && row.sourceType === 'MAKE_A_NOTE') { // 显示对账，编辑，删除
        return 2
      } else { // 显示撤销对账
        return 3
      }
    },
    trigger (scoped, arg) {
      if (scoped.row.sourceType === 'DEPOSIT') {
        this.row = scoped.row
        this.showDepositDrawer = true
      } else if (scoped.row.sourceType === 'CLOUD_VIDEO_SERVICE') {
        this.showSideOrderDetail = !this.showSideOrderDetail
        queryCloudVideoOrderDetail({ cameraOrderId: scoped.row.sourceId }).then(res => {
          if (res.message === '成功') {
            this.orderDetail = res.data
            this.orderDetail.payDate = parseTime(this.orderDetail.payDate, '{y}-{m}-{d}')
            this.orderDetail.expireDate = parseTime(this.orderDetail.expireDate, '{y}-{m}-{d}')
          }
        })
      } else if (scoped.row.sourceType === 'KINDERGARTEN_CLOUD_VIDEO') {
        this.drawerType = 'small'
        getDeviceOrderByCode(scoped.row.associatedSingleNumber).then(res => {
          this.videoData = res.data
          this.showDrawer = true
          this.guardCareOrder = 'video'
        })
      } else {
        const row = scoped.row
        // 早教
        if (row.sourceType === 'TEACH') {
          this.popType = arg.name
          this.componentData = {
            edit: false,
            id: row.sourceId
            // contractType: res.data.contractType,
            // contractStatusEnum: res.data.contractStatusEnum
          }
          //
          this.$nextTick(() => {
            this.$refs.component.triggerShow()
          })
        } else if (row.sourceType === 'CARE') { // 托育
          this.popType = arg.name
          this.componentData = {
            edit: false,
            id: row.sourceId
            // contractType: res.data.contractType,
            // contractStatusEnum: res.data.contractStatusEnum
          }
          //
          this.$nextTick(() => {
            this.$refs.component.triggerShow()
          })
        } else if (row.sourceType === 'KINDERGARTEN') {
          this.drawerType = 'big'
          getOrderByCode(scoped.row.associatedSingleNumber).then(res => {
            this.orderData = res.data
            this.showDrawer = true
            this.guardCareOrder = 'order'
          })
        }
      }
    },
    beforeClose () {
      this.row = ''
    }
  }
}
</script>
<style lang="scss" scoped>
.index-wrap {
  .iconplus {
    font-size: 14px;
  }
}
</style>
