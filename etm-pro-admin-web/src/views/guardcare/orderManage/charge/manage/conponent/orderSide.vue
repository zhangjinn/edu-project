<template>
  <div class="orderSide-wrap">
    <etm-layout-split>
      <div class="auditBox">
        <etm-title :show-line="false" border size="big">账单详情
          <template slot="tool">
            <el-button
              v-if="editShow && drawerType === 'detail'"
              v-has="{authId: 'guardcare.orderBunch.update'}"
              plain
              size="mini"
              @click="edit"
            >编辑
            </el-button>
            <el-button v-if="drawerType === 'audit'" plain size="mini" @click="reject">不通过</el-button>
            <el-button v-if="drawerType === 'audit'" type="primary" size="mini" @click="pass">通过</el-button>
            <el-button v-if="drawerType === 'edit'" plain size="mini" @click="cancel">取消</el-button>
            <el-button v-if="drawerType === 'edit'" type="primary" size="mini" @click="save">保存</el-button>
          </template>
        </etm-title>
        <div class="warnText">
          <el-alert type="warning" :closable="false">请仔细核对信息，避免信息填写有误</el-alert>
        </div>
        <el-row>
          <el-col :span="8">
            <etm-field-label label="收费名称">{{ orderBunchData.orderBunchName }}</etm-field-label>
          </el-col>
          <el-col :span="8">
            <etm-field-label label="使用订金">{{ orderBunchData.usingDeposit ? '是' : '否' }}</etm-field-label>
          </el-col>
          <el-col :span="8">
            <etm-field-label label="发送类型">{{ transferType(orderBunchData.type) }}</etm-field-label>
          </el-col>
          <el-col :span="8">
            <etm-field-label label="收费对象">
              {{ transferTarget(orderBunchData.sendTargetList) }}
            </etm-field-label>
          </el-col>
          <el-col :span="8">
            <etm-field-label label="制单日期">{{ transferDate(orderBunchData.createTime) }}</etm-field-label>
          </el-col>
          <el-col :span="8">
            <etm-field-label label="制单人">{{ orderBunchData.createBy }}</etm-field-label>
          </el-col>
          <el-col :span="8">
            <etm-field-label label="通知家长">{{ orderBunchData.noticeParent ? '是' : '否' }}</etm-field-label>
          </el-col>
          <el-col :span="8">
            <etm-field-label label="审核日期">{{
              transferDate(orderBunchData.auditTime) || '--'
            }}
            </etm-field-label>
          </el-col>
          <el-col :span="8">
            <etm-field-label label="审核人">{{ orderBunchData.auditBy || '--' }}</etm-field-label>
          </el-col>
        </el-row>
        <etm-title>收费项目</etm-title>
        <etm-table :data="orderBunchData.orderBunchItemList" :border="false" :stripe="false">
          <el-table-column slot="left" label="项目名称">
            <template slot-scope="scoped">
              <div class="itemName">
                <div class="itemImg">
                  <img src="../../../../../../assets/images/etm-logo.png">
                </div>
                <div class="totalName">{{ scoped.row.orderBunchItemName }}</div>
              </div>
            </template>
          </el-table-column>
          <el-table-column slot="left" label="单价">
            <template slot-scope="scoped">
              <div class="actual">实收：¥ {{ scoped.row.actualUnitAmount }}</div>
              <div class="origin">应收：¥ {{ scoped.row.unitAmount }}</div>
            </template>
          </el-table-column>
          <el-table-column slot="left" label="数量" prop="number" />
          <el-table-column slot="left" label="小计">
            <template slot-scope="scoped">
              <div class="actual">实收：¥ {{ scoped.row.actualAmount }}</div>
              <div class="origin">应收：¥ {{ scoped.row.totalAmount }}</div>
            </template>
          </el-table-column>
        </etm-table>
        <etm-title :border="false" class="noPadding">
          账单项目（{{ orderBunchData.orderList && orderBunchData.orderList.length }}人）
          <template slot="tool">
            <el-input
              v-model="searchValue"
              prefix-icon="el-icon-search"
              placeholder="请输入幼儿姓名搜索"
              @keyup.enter.native="searchOrder"
            />
          </template>
        </etm-title>
        <div class="orderList">
          <el-collapse v-model="activeNames">
            <div
              v-for="(item,index) in orderBunchData.orderList"
              :key="index"
              class="list"
              :class="searchResult.includes(index) ? 'isNone' : ''"
            >
              <div class="totalBox">
                <el-row class="total">
                  <el-col :span="4">
                    <etm-field-label label="姓名">{{ item.childName }}</etm-field-label>
                  </el-col>
                  <el-col :span="7">
                    <etm-field-label label="账单编号">{{ item.code }}</etm-field-label>
                  </el-col>
                  <el-col :span="4">
                    <etm-field-label label="应收总价">¥ {{ item.totalAmount }}</etm-field-label>
                  </el-col>
                  <el-col :span="3">
                    <etm-field-label label="订金">¥ {{ item.depositAmount }}</etm-field-label>
                  </el-col>
                  <el-col :span="4">
                    <etm-field-label label="实收总价">
                      <span class="main">¥ {{ item.actualAmount }}</span>
                    </etm-field-label>
                  </el-col>
                  <el-col :span="2" class="slideUp">
                    <span v-if="activeNames.includes(index)" @click="packUp(index)">收起<i
                      class="el-icon-arrow-up"
                    /></span>
                    <span v-else @click="openUp(index)">展开<i class="el-icon-arrow-down" /></span>
                  </el-col>
                </el-row>
              </div>
              <el-collapse-item :name="index">
                <etm-table :data="item.orderItemList" :border="false" :stripe="false" class="itemTable">
                  <el-table-column slot="left" label="项目名称">
                    <template slot-scope="scoped">
                      <div class="itemName">
                        <div class="itemImg">
                          <img src="../../../../../../assets/images/etm-logo.png">
                        </div>
                        <div class="name">{{ scoped.row.orderItemName }}</div>
                      </div>
                    </template>
                  </el-table-column>
                  <el-table-column slot="left" label="单价">
                    <template slot-scope="scoped">
                      <div class="actual">实收：¥ {{ scoped.row.actualUnitAmount }}</div>
                      <div class="origin">应收：¥ {{ scoped.row.unitAmount }}</div>
                    </template>
                  </el-table-column>
                  <el-table-column slot="left" label="数量" prop="number" />
                  <el-table-column slot="left" label="小计" width="240">
                    <template slot-scope="scoped">
                      <div v-if="drawerType === 'edit'" class="actualInput">实收：¥
                        <el-input-number
                          v-model="scoped.row.actualAmount"
                          controls-position="right"
                          :min="0"
                          :data-none="scoped"
                          @change="changeTotal($event, scoped.$index, index)"
                        />
                      </div>
                      <div v-else class="actual">实收：¥ {{ scoped.row.actualAmount }}</div>
                      <div class="origin">应收：¥ {{ scoped.row.totalAmount }}</div>
                    </template>
                  </el-table-column>
                  <el-table-column v-if="drawerType === 'edit'" slot="right" label="操作">
                    <template slot-scope="scoped">
                      <etm-text type="danger" @click="removeItem(scoped.$index, index)">删除</etm-text>
                    </template>
                  </el-table-column>
                </etm-table>
              </el-collapse-item>
            </div>
          </el-collapse>
          <div
            v-if="orderBunchData.orderList && orderBunchData.orderList.length === searchResult.length"
            class="noData"
          >
            <img src="../../../../../../assets/images/guardcare/img-fygl.png">
            <div>搜索结果为空~</div>
          </div>
        </div>
      </div>
    </etm-layout-split>
    <etm-pop
      :visible="showPop"
      pop="simple"
      title="不通过"
      confirm-btn="确定"
      cancel-btn="取消"
      @close="handlePopClose"
      @confirm="handlePopConfirm"
      @cancel="handlePopCancel"
    >
      <etm-form ref="form" :model="formData" :rules="rule" type="dialog">
        <el-form-item label="不通过原因" prop="rejectMessage">
          <el-input
            v-model="formData.rejectMessage"
            placeholder="请输入不通过原因"
            type="textarea"
            :autosize="{ minRows: 5}"
          />
        </el-form-item>
      </etm-form>
    </etm-pop>
  </div>

</template>

<script>/**
 * orderSide create by Administrator
 * createTime 2020/8/27 19:31
 */

import {
  auditOrderBunch,
  getOrderBunchDetail,
  renewOrderBunch
} from '@/api/guardcare/orderManage/charge'
import { parseTime } from '@/utils'

export default {
  name: 'OrderSide',
  components: {},
  filters: {},
  mixins: [],
  props: {
    orderBunchId: {
      type: Number,
      default() {
        return null
      }
    },
    drawerType: { // 显示内容状态：编辑、详情、审核
      type: String,
      default() {
        return null
      }
    }
  },
  data() {
    return {
      editShow: false,
      editClick: false,
      orderBunchData: {},
      showPop: false,
      formData: {},
      rule: {
        rejectMessage: [{ required: true, message: '不通过原因不能为空', trigger: 'blur' }]
      },
      activeNames: [0],
      searchValue: '',
      searchResult: []
    }
  },
  computed: {},
  watch: {
    orderBunchId() {
      this.searchValue = ''
      this.getDetail()
    }
  },
  created() {
  },
  mounted() {
    this.getDetail()
  },
  methods: {
    getDetail() {
      getOrderBunchDetail(this.orderBunchId).then(res => {
        this.orderBunchData = res.data
        if (this.orderBunchData.status === 'UN_AUDIT' || this.orderBunchData.status === 'REJECT') {
          this.editShow = true
        } else {
          this.editShow = false
        }
      })
    },
    transferType(type) {
      //  PER_GRADE :按年级 PER_CLAZZ :按班级 PER_CHILD :按幼儿
      switch (type) {
        case 'PER_GRADE':
          return '按年级'
        case 'PER_CLAZZ':
          return '按班级'
        case 'PER_CHILD':
          return '按幼儿'
        default:
          return type
      }
    },
    transferDate(date) { // 日期转换
      if (!date) {
        return date
      } else {
        return parseTime(date, '{y}-{m}-{d}')
      }
    },
    transferTarget(data) { // 接收对象处理
      if (!Array.isArray(data)) {
        return data
      } else {
        return data.join(',')
      }
    },
    reject() { // 审核不通过原因填写弹窗
      this.formData = {}
      this.showPop = true
    },
    handlePopClose() {
      this.showPop = false
    },
    handlePopConfirm() { // 审核不通过提交
      this.$refs.form.$children[0].validate(valid => {
        if (valid) {
          const param = {
            orderBunchId: this.orderBunchId,
            pass: false,
            rejectMessage: this.formData.rejectMessage
          }
          auditOrderBunch(param).then(() => {
            this.$message.success('审核成功')
            this.showPop = false
            this.$emit('close')
            this.$emit('finish')
          })
        }
      })
    },
    handlePopCancel() {
      this.showPop = false
    },
    pass() { // 审核通过提交
      const param = {
        orderBunchId: this.orderBunchId,
        pass: true
      }
      auditOrderBunch(param).then(() => {
        this.$message.success('审核成功')
        this.$emit('close')
        this.$emit('finish')
      })
    },
    edit() {
      this.editClick = true
      this.$emit('change', 'edit')
    },
    cancel() {
      if (this.editClick) {
        this.editClick = false
        this.$emit('change', 'detail')
      } else {
        this.$emit('close')
      }
    },
    changeTotal(value, tableIndex, index) { // 编辑时修改实收小计
      const item = this.orderBunchData.orderList[index].orderItemList[tableIndex]
      const total = item.actualUnitAmount * item.number
      const amount = this.orderBunchData.orderList[index].actualAmount - total
      // 计算实收小计改变的幼儿的实收总价
      this.orderBunchData.orderList[index].actualAmount = Number((value + amount).toFixed(2))
      // 计算实收小计改变的列的实收单价
      const actualPrice = value / this.orderBunchData.orderList[index].orderItemList[tableIndex].number
      this.orderBunchData.orderList[index].orderItemList[tableIndex].actualUnitAmount = Number(actualPrice.toFixed(2))
    },
    removeItem(tableIndex, index) { // 编辑时删除收费项目
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
          // 计算删除收费项目的幼儿的实收总价
          const item = this.orderBunchData.orderList[index].orderItemList[tableIndex]
          const total = item.unitAmount * item.number // 删除项的应收小计 = 应收单价 * 数量
          const amount = this.orderBunchData.orderList[index].totalAmount - total // 应收总价 = 原应收总价 - 删除项的应收小计
          const actualTotal = item.actualUnitAmount * item.number // 删除项的实收小计 = 实收单价 * 数量
          const actualAmount = this.orderBunchData.orderList[index].actualAmount - actualTotal // 实收总价 = 原实收总价 - 删除项的实收小计
          this.orderBunchData.orderList[index].totalAmount = Number(amount.toFixed(2)) // 保留两位小数
          this.orderBunchData.orderList[index].actualAmount = Number(actualAmount.toFixed(2)) // 保留两位小数
          this.orderBunchData.orderList[index].orderItemList.splice(tableIndex, 1) // 数据去掉删除项
          this.$etmTip.close()
        }
      })
      this.$etmTip.open()
    },
    save() { // 保存编辑
      const param = {
        orderList: this.orderBunchData.orderList
      }
      renewOrderBunch(this.orderBunchId, param).then(() => {
        this.$message.success('编辑成功')
        this.getDetail()
        if (this.editClick) {
          this.editClick = false
          this.$emit('change', 'detail')
          this.$emit('finish')
        } else {
          this.$emit('close')
          this.$emit('finish')
        }
      })
    },
    searchOrder() {
      this.searchResult = []
      this.orderBunchData.orderList.forEach((item, index) => {
        if (this.searchValue && item.childName && !item.childName.includes(this.searchValue)) {
          this.searchResult.push(index)
        }
      })
    },
    packUp(index) {
      this.activeNames.splice(this.activeNames.indexOf(index), 1)
    },
    openUp(index) {
      this.activeNames.push(index)
    }
  }
}
</script>
<style lang="scss" scoped>
.orderSide-wrap {

  .auditBox {
    .warnText {
      padding-bottom: 16px;
    }

    .noPadding {
      padding-bottom: 0;
    }

    .itemName {
      display: flex;

      .itemImg {
        margin-right: 15px;
        padding-top: 11px;
        width: 100px;
        height: 54px;
        text-align: center;
        border-radius: 2px;
        @include bgc_divide_color();

        img {
          width: 32px;
        }
      }

      .totalName {
        max-width: 180px;
      }

      .name {
        max-width: 120px;
      }
    }

    .actual {
      height: 14px;
      line-height: 14px;
    }

    .actualInput {
      height: 32px;
      line-height: 32px;

      ::v-deep .el-input-number__increase {
        display: none;
      }

      ::v-deep .el-input-number__decrease {
        display: none;
      }
    }

    .origin {
      margin-top: 16px;
      height: 14px;
      line-height: 14px;
      @include c_secondary_color();
    }

    .orderList {
      padding-bottom: 24px;

      ::v-deep .el-collapse {
        border: none;

        .el-collapse-item {
          border-top: 1px solid #ebeef5;

          .el-collapse-item__header {
            display: none;
          }

          .el-collapse-item__content {
            padding-bottom: 0;
          }

          .el-collapse-item__wrap {
            border: none;
          }

          .itemTable {
            padding-bottom: 0;
          }
        }
      }

      .list {
        &.isNone {
          display: none;
        }

        .totalBox {
          padding-top: 16px;

          .main {
            font-weight: bold;
            @include c_main_color();
          }

          .slideUp {
            text-align: right;

            span {
              cursor: pointer;

              &:hover {
                @include etm-color();
              }
            }

            .el-icon-arrow-up {
              font-size: 14px;
            }

            .el-icon-arrow-down {
              font-size: 14px;
            }
          }
        }
      }
    }

    .noData {
      margin: 48px 0;
      text-align: center;

      div {
        margin-top: 16px;
        @include c_secondary_color();
      }
    }
  }
}
</style>
