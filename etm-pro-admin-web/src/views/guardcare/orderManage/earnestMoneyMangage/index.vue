<template>
  <div class="depositManage">
    <etm-main-body>
      <etm-layout-split>
        <div slot="header">
          <etm-tabs v-model="activeName">
            <el-tab-pane label="订金管理" name="deposit">
              <etm-tool-bar v-model="formData" @search="handleSearch" @reset="reset" />
            </el-tab-pane>
          </etm-tabs>
        </div>
        <div slot="body">
          <etm-table-page
            :columns="columns"
            :data="tableData"
            index
            @currentChange="currentChange"
          >
            <etm-table-tool-bar slot="tool">
              <div slot="right">
                <el-button v-has="{authId: 'guardcare.earnestMoney.create'}" type="primary" @click="add">
                  <span class="iconfont iconplus" />添加订金
                </el-button>
              </div>
            </etm-table-tool-bar>
            <el-table-column slot="left" label="订金编号" width="150">
              <template slot-scope="scoped">
                <a @click="showDetail(scoped.row)">{{ scoped.row.code }}</a>
              </template>
            </el-table-column>
            <el-table-column slot="left" label="性别" width="90">
              <template slot-scope="scoped">
                <span>{{ transferGender(scoped.row.childGender) }}</span>
              </template>
            </el-table-column>
            <el-table-column slot="right" label="支付方式" prop="paymentType" width="90" />
            <el-table-column slot="right" label="收费日期" width="150">
              <template slot-scope="scoped">
                <span>{{ transferDate(scoped.row.paymentDate) }}</span>
              </template>
            </el-table-column>
            <el-table-column slot="right" label="使用状态" width="90">
              <template slot-scope="scoped">
                <span>{{ scoped.row.use ? '已使用' : '未使用' }}</span>
              </template>
            </el-table-column>
            <el-table-column slot="right" label="关联账单编号" width="150" prop="useOrderCode" />
            <el-table-column slot="right" fixed="right" label="操作" width="150">
              <template slot-scope="scoped">
                <etm-text
                  v-if="!scoped.row.use"
                  v-has="{authId: 'guardcare.earnestMoney.update'}"
                  type="primary"
                  @click="edit(scoped.row)"
                >编辑
                </etm-text>
                <etm-text v-has="{authId: 'guardcare.earnestMoney.remove'}" type="danger" @click="remove(scoped.row)">
                  删除
                </etm-text>
              </template>
            </el-table-column>
          </etm-table-page>
        </div>
      </etm-layout-split>
    </etm-main-body>
    <etm-pop
      v-if="showPop"
      :visible="showPop"
      :title="popTitle"
      pop="complex"
      confirm-btn="确定"
      cancel-btn="取消"
      @close="handlePopClose"
      @confirm="handlePopConfirm"
      @cancel="handlePopCancel"
    >
      <div class="form">
        <etm-form ref="form" :model="popData" :rules="rule" type="dialog">
          <el-form-item label="幼儿姓名" prop="childId" placeholder="请选择幼儿">
            <el-select v-model="popData.childId" filterable>
              <el-option
                v-for="(child, index) in childList"
                :key="index"
                :label="child.childName"
                :value="child.childId"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="订金金额（元）" prop="amount">
            <el-input-number v-model="popData.amount" controls-position="right" :min="0" placeholder="请输入订金金额" />
          </el-form-item>
          <el-form-item label="支付方式" prop="paymentType">
            <el-select v-model="popData.paymentType">
              <!--              WECHAT :微信 ALIPAY :支付宝 CASH :现金 ONLINE_BANKING :网银-->
              <el-option label="微信" value="WECHAT" />
              <el-option label="支付宝" value="ALIPAY" />
              <el-option label="现金" value="CASH" />
              <el-option label="网银" value="ONLINE_BANKING" />
            </el-select>
          </el-form-item>
          <el-form-item label="收费日期" prop="paymentDate">
            <el-date-picker v-model="popData.paymentDate" placeholder="请选择日期" />
          </el-form-item>
          <el-form-item label="备注">
            <el-input
              v-model="popData.remark"
              placeholder="请输入备注内容"
              type="textarea"
              :autosize="{ minRows: 3}"
              maxlength="100"
              show-word-limit
            />
          </el-form-item>
        </etm-form>
      </div>
    </etm-pop>
    <etm-drawer
      :visible.sync="showDrawer"
      type="small"
    >
      <detail
        v-if="showDrawer"
        :deposit-id="depositId"
        :drawer-type="drawerType"
        @finish="finishDrawer"
        @change="changeType"
        @close="closeDrawer"
      />
    </etm-drawer>
  </div>
</template>

<script>
import { addNewDeposit, deleteDeposit, getDepositList } from '@/api/guardcare/orderManage/depositManage'
import { parseTime } from '@/utils'
import { getChildList } from '@/api/guardcare/orderManage/charge'
import detail from './component/detail'

export default {
  components: {
    detail
  },
  data() {
    return {
      activeName: 'deposit',
      formData: [
        {
          label: '幼儿姓名',
          type: 'input',
          prop: 'childName',
          value: '',
          props: {
            placeholder: '请输入幼儿姓名'
          }
        },
        {
          label: '家长姓名',
          type: 'input',
          prop: 'parentName',
          value: '',
          props: {
            placeholder: '请输入联系人姓名'
          }
        },
        {
          label: '联系电话',
          type: 'input',
          prop: 'telephone',
          value: '',
          props: {
            placeholder: '请输入联系电话'
          }
        },
        {
          label: '收费日期',
          type: 'date',
          prop: 'date',
          value: '',
          props: {
            type: 'daterange',
            startPlaceholder: '开始日期',
            endPlaceholder: '结束日期'
          }
        }
      ],
      columns: [
        {
          label: '幼儿姓名',
          prop: 'childName'
        },
        {
          label: '家长姓名',
          prop: 'parentName'
        },
        {
          label: '联系电话',
          prop: 'phone',
          width: 120
        },
        {
          label: '订金金额（元）',
          prop: 'amount',
          align: 'right'
        }
      ],
      searchInfo: {},
      tableData: {
        content: []
      },
      pageNum: 1,
      pageSize: 10,
      showPop: false,
      childList: [],
      popTitle: '',
      popData: {},
      rule: {
        childId: [{ required: true, message: '幼儿不能为空', trigger: 'change' }],
        amount: [{ required: true, message: '金额不能为空', trigger: 'blur' }],
        paymentType: [{ required: true, message: '支付方式不能为空', trigger: 'change' }],
        paymentDate: [{ required: true, message: '支付日期不能为空', trigger: 'change' }]
      },
      showDrawer: false,
      depositId: null,
      drawerType: ''
    }
  },
  mounted() {
    this.getList()
    this.getChild()
  },
  activated() {
    if (this.$store.state.guardcareDashboard.pageEntry === 'addEarnestMoney') {
      this.$nextTick(() => {
        this.add()
        this.$store.commit('guardcareDashboard/SET_PAGEENTRY', null)
      })
    }
  },
  methods: {
    getList() { // 获取订金列表
      const param = {}
      param.pageNum = this.pageNum
      param.pageSize = this.pageSize
      for (const i in this.searchInfo) {
        param[i] = this.searchInfo[i]
      }
      getDepositList(param).then(res => {
        this.tableData = res.data
      })
    },
    handleSearch(value) { // 搜索
      const searchInfo = {}
      value.forEach(item => {
        if (item.prop === 'date') {
          searchInfo.paymentStartDate = item.value[0]
          searchInfo.paymentEndDate = item.value[1]
        } else {
          searchInfo[item.prop] = item.value
        }
      })
      this.pageNum = 1
      this.searchInfo = searchInfo
      this.getList()
    },
    reset() { // 重置
      this.searchInfo = {}
      this.pageNum = 1
      this.pageSize = 10
      this.getList()
    },
    currentChange(pageNum, pageSize) {
      this.pageNum = pageNum
      this.pageSize = pageSize
      this.getList()
    },
    transferGender(gender) {
      switch (gender) {
        case 'MALE':
          return '男 '
        case 'FEMALE':
          return '女'
        default:
          return gender
      }
    },
    transferDate(date) {
      if (isNaN(date)) {
        return date
      } else {
        return parseTime(date, '{y}-{m}-{d}')
      }
    },
    getChild() { // 获取在园幼儿
      getChildList().then(res => {
        this.childList = res.data
      })
    },
    add() { // 新增订金
      this.popData = {}
      this.popTitle = '添加订金'
      this.showPop = true
    },
    showDetail(row) { // 查看详情
      this.depositId = row.depositId
      this.drawerType = 'detail'
      this.showDrawer = true
    },
    edit(row) { // 编辑
      this.depositId = row.depositId
      this.drawerType = 'edit'
      this.showDrawer = true
    },
    finishDrawer() { // 重新加载数据
      this.getList()
    },
    changeType(type) { // 抽屉详情与编辑切换
      this.drawerType = type
    },
    closeDrawer() { // 关闭抽屉
      this.showDrawer = false
    },
    remove(row) { // 删除提示
      this.$etmTip.init({
        type: 'error',
        title: `确认删除该数据？`,
        content: `删除后将无法撤销，是否继续操作？`,
        confirmBtn: '删除',
        cancelBtn: '取消',
        cancel: () => {
          this.$etmTip.close()
        },
        confirm: () => {
          deleteDeposit(row.depositId).then(() => {
            this.$message.success('删除成功')
            this.$etmTip.close()
            this.getList()
          })
        }
      })
      this.$etmTip.open()
    },
    handlePopClose() {
      this.showPop = false
    },
    handlePopConfirm() { // 新增提交
      this.$refs.form.$children[0].validate(valid => {
        if (valid) {
          const param = {
            use: false,
            childId: this.popData.childId,
            amount: this.popData.amount,
            paymentDate: parseTime(this.popData.paymentDate, '{y}-{m}-{d}'),
            paymentType: this.popData.paymentType,
            remark: this.popData.remark
          }
          let num = this.tableData.totalElements + 1
          if (num > 999) {
            num = num - 999
          }
          let str = '000' + num
          str = str.substring(str.length - 3)
          const code = 'DJ' + parseTime(new Date(), '{y}{m}{d}') + str
          param.code = code
          addNewDeposit(param).then(() => {
            this.$message.success('订金新增成功')
            this.showPop = false
            this.getList()
          })
        }
      })
    },
    handlePopCancel() {
      this.showPop = false
    }
  }
}
</script>

<style lang="scss" scoped>
.depositManage {
  .iconplus {
    font-size: 14px;
  }
}

.form {
  ::v-deep .el-input-number {
    .el-input__inner {
      text-align: left;
    }

    .el-input-number__increase {
      display: none;
    }

    .el-input-number__decrease {
      display: none;
    }
  }
}
</style>
