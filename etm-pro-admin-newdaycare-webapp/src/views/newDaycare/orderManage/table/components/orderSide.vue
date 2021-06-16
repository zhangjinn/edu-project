<template>
  <div class="orderSide-wrap">
    <etm-layout-split>
      <div class="auditBox">
        <etm-title
          :show-line="false"
          border
          size="big"
        >
          账单详情
          <template slot="tool">
            <el-button
              v-if="editShow && drawerType === 'detail'"
              plain
              size="mini"
              @click="edit"
            >
              编辑
            </el-button>
            <el-button
              v-if="drawerType === 'audit'"
              plain
              size="mini"
              @click="reject"
            >
              不通过
            </el-button>
            <el-button
              v-if="drawerType === 'audit'"
              type="primary"
              size="mini"
              @click="pass"
            >
              通过
            </el-button>
            <el-button
              v-if="drawerType === 'edit'"
              plain
              size="mini"
              @click="cancel"
            >
              取消
            </el-button>
            <el-button
              v-if="drawerType === 'edit'"
              type="primary"
              size="mini"
              @click="save"
            >
              保存
            </el-button>
          </template>
        </etm-title>
        <div class="warnText">
          <el-alert
            type="warning"
            :closable="false"
          >
            请仔细核对信息，避免信息填写有误
          </el-alert>
        </div>
        <el-row>
          <el-col :span="8">
            <etm-field-label label="收费名称">
              {{ orderBunchData.orderBunchName }}
            </etm-field-label>
          </el-col>
          <el-col :span="8">
            <etm-field-label label="收费方式">
              {{ transferChargeType(orderBunchData.chargeType) }}
            </etm-field-label>
          </el-col>
          <el-col :span="8">
            <etm-field-label label="收费时段">
              {{ transferChargeTime(orderBunchData) }}
            </etm-field-label>
          </el-col>
          <el-col :span="8">
            <etm-field-label label="发送类型">
              {{ transferType(orderBunchData.type) }}
            </etm-field-label>
          </el-col>
          <el-col :span="8">
            <etm-field-label label="收费对象">
              {{ transferTarget(orderBunchData.sendTargetList) }}
            </etm-field-label>
          </el-col>
          <el-col :span="8">
            <etm-field-label label="使用订金">
              {{ orderBunchData.usingDeposit ? '是' : '否' }}
            </etm-field-label>
          </el-col>
          <el-col :span="8">
            <etm-field-label label="通知家长">
              {{ orderBunchData.noticeParent ? '是' : '否' }}
            </etm-field-label>
          </el-col>
          <el-col :span="8">
            <etm-field-label label="制单日期">
              {{ transferDate(orderBunchData.createTime) }}
            </etm-field-label>
          </el-col>
          <el-col :span="8">
            <etm-field-label label="制单人">
              {{ orderBunchData.createBy }}
            </etm-field-label>
          </el-col>
          <el-col :span="8">
            <etm-field-label label="审核日期">
              {{ transferDate(orderBunchData.auditTime) }}
            </etm-field-label>
          </el-col>
          <el-col :span="8">
            <etm-field-label label="审核人">
              {{ orderBunchData.auditBy || '--' }}
            </etm-field-label>
          </el-col>
        </el-row>
        <etm-title>收费项目</etm-title>
        <etm-table
          :data="orderBunchData.orderBunchItemList"
          :border="false"
          :stripe="false"
        >
          <el-table-column
            slot="left"
            label="项目名称"
          >
            <template slot-scope="scoped">
              <div class="itemName">
                <div class="itemImg">
                  <img src="../../../../../assets/images/etm-logo.png">
                </div>
                <div class="totalName">
                  {{ scoped.row.orderBunchItemName }}
                </div>
              </div>
            </template>
          </el-table-column>
          <el-table-column
            slot="left"
            label="单价"
          >
            <template slot-scope="scoped">
              <div class="actual">
                实收：¥ {{ formatMoney(scoped.row.actualUnitAmount) }}
              </div>
              <div class="origin">
                应收：¥ {{ formatMoney(scoped.row.unitAmount) }}
              </div>
            </template>
          </el-table-column>
          <el-table-column
            slot="left"
            label="数量"
            prop="number"
          />
          <el-table-column
            slot="left"
            label="小计"
          >
            <template slot-scope="scoped">
              <div class="actual">
                实收：¥ {{ formatMoney(scoped.row.actualAmount) }}
              </div>
              <div class="origin">
                应收：¥ {{ formatMoney(scoped.row.totalAmount) }}
              </div>
            </template>
          </el-table-column>
        </etm-table>
        <etm-title
          :border="false"
          class="noPadding"
        >
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
                    <etm-field-label label="姓名">
                      {{ item.childName }}
                    </etm-field-label>
                  </el-col>
                  <el-col :span="7">
                    <etm-field-label label="账单编号">
                      {{ item.code }}
                    </etm-field-label>
                  </el-col>
                  <el-col :span="4">
                    <etm-field-label label="应收总价">
                      ¥ {{ formatMoney(item.totalAmount) }}
                    </etm-field-label>
                  </el-col>
                  <el-col :span="3">
                    <etm-field-label label="订金">
                      ¥ {{ formatMoney(item.depositAmount) }}
                    </etm-field-label>
                  </el-col>
                  <el-col :span="4">
                    <etm-field-label label="实收总价">
                      <span class="main">¥ {{ formatMoney(item.actualAmount) }}</span>
                    </etm-field-label>
                  </el-col>
                  <el-col
                    :span="2"
                    class="slideUp"
                  >
                    <span
                      v-if="activeNames.includes(index)"
                      @click="packUp(index)"
                    >收起<i
                      class="el-icon-arrow-up"
                    /></span>
                    <span
                      v-else
                      @click="openUp(index)"
                    >展开<i class="el-icon-arrow-down" /></span>
                  </el-col>
                </el-row>
              </div>
              <el-collapse-item :name="index">
                <div class="rowBox">
                  <div class="row rowTitle">
                    <div
                      class="col colHeader"
                      style="width: 26%;"
                    >
                      项目名称
                    </div>
                    <div
                      class="col colHeader"
                      style="width: 18%;"
                    >
                      单价
                    </div>
                    <div
                      class="col colHeader"
                      style="width: 21%;"
                    >
                      数量/月份
                    </div>
                    <div
                      class="col colHeader"
                      style="width: 28%;"
                    >
                      小计
                    </div>
                    <div
                      class="col colHeader"
                      style="width: 7%;"
                    />
                  </div>
                  <div
                    v-if="item.orderItemList.length"
                    class="rowBody"
                  >
                    <div
                      v-for="(orderItem, ind) in item.orderItemList"
                      :key="ind"
                      class="itemColumn"
                    >
                      <div class="row column">
                        <div
                          class="col colItem"
                          style="width: 26%;"
                        >
                          <div class="itemImg">
                            <img src="../../../../../assets/images/etm-logo.png">
                          </div>
                          <div class="name">
                            {{ orderItem.orderItemName }}
                          </div>
                        </div>
                        <div
                          class="col colItem"
                          style="width: 18%;"
                        >
                          <div v-if="orderItem.orderItemItemList && orderItem.orderItemItemList.length === 1">
                            <div class="actual">
                              实收：¥ {{ formatMoney(orderItem.orderItemItemList[0].actualUnitAmount) }}
                            </div>
                            <div class="origin">
                              应收：¥ {{ formatMoney(orderItem.orderItemItemList[0].unitAmount) }}
                            </div>
                          </div>
                          <div v-else-if="!orderItem.orderItemItemList || !orderItem.orderItemItemList.length">
                            <div class="actual">
                              实收：¥ {{ formatMoney(orderItem.actualUnitAmount) }}
                            </div>
                            <div class="origin">
                              应收：¥ {{ formatMoney(orderItem.unitAmount) }}
                            </div>
                          </div>
                        </div>
                        <div
                          class="col colItem"
                          style="width: 21%;"
                        >
                          <span v-if="orderItem.orderItemItemList && orderItem.orderItemItemList.length === 1">{{ transferMonth(orderItem.orderItemItemList[0].month) }}</span>
                          <span v-else-if="!orderItem.orderItemItemList || !orderItem.orderItemItemList.length">{{ orderItem.number }}</span>
                        </div>
                        <div
                          class="col colItem"
                          style="width: 28%;"
                        >
                          <div>
                            <template v-if="drawerType === 'edit'">
                              <div
                                v-if="orderItem.orderItemItemList && orderItem.orderItemItemList.length === 1"
                                class="actualInput"
                              >
                                实收：¥
                                <el-input-number
                                  v-model="orderItem.orderItemItemList[0].actualAmount"
                                  controls-position="right"
                                  :min="0"
                                  @change="changChildTotal($event, 0, ind, index)"
                                />
                              </div>
                              <div v-else-if="orderItem.orderItemItemList && orderItem.orderItemItemList.length > 1">
                                实收：¥ {{ formatMoney(orderItem.actualAmount) }}
                              </div>
                              <div
                                v-else
                                class="actualInput"
                              >
                                实收：¥
                                <el-input-number
                                  v-model="orderItem.actualAmount"
                                  controls-position="right"
                                  :min="0"
                                  @change="changeTotal($event, ind, index)"
                                />
                              </div>
                            </template>
                            <div
                              v-else
                              class="actual"
                            >
                              实收：¥ {{ formatMoney(orderItem.actualAmount) }}
                            </div>
                            <div class="origin">
                              应收：¥ {{ formatMoney(orderItem.totalAmount) }}
                            </div>
                          </div>
                        </div>
                        <div
                          class="col colItem"
                          style="width: 7%;"
                        >
                          <etm-text
                            v-if="drawerType === 'edit'"
                            type="danger"
                            @click="removeItem(ind, index)"
                          >
                            删除
                          </etm-text>
                        </div>
                      </div>
                      <template v-if="orderItem.orderItemItemList && orderItem.orderItemItemList.length > 1">
                        <div
                          v-for="(orderItemItem, i) in orderItem.orderItemItemList"
                          :key="i"
                          class="row childColumn"
                        >
                          <div
                            class="col colItem"
                            style="width: 26%;"
                          />
                          <div
                            class="col colItem"
                            style="width: 18%;"
                          >
                            <div>
                              <div class="actual">
                                实收：¥ {{ formatMoney(orderItemItem.actualUnitAmount) }}
                              </div>
                              <div class="origin">
                                应收：¥ {{ formatMoney(orderItemItem.unitAmount) }}
                              </div>
                            </div>
                          </div>
                          <div
                            class="col colItem"
                            style="width: 21%;"
                          >
                            {{ transferMonth(orderItemItem.month) }}
                          </div>
                          <div
                            class="col colItem"
                            style="width: 28%;"
                          >
                            <div>
                              <div
                                v-if="drawerType === 'edit'"
                                class="actualInput"
                              >
                                实收：¥
                                <el-input-number
                                  v-model="orderItemItem.actualAmount"
                                  controls-position="right"
                                  :min="0"
                                  @change="changChildTotal($event, i, ind, index)"
                                />
                              </div>
                              <div
                                v-else
                                class="actual"
                              >
                                实收：¥ {{ formatMoney(orderItemItem.actualAmount) }}
                              </div>
                              <div class="origin">
                                应收：¥ {{ formatMoney(orderItemItem.totalAmount) }}
                              </div>
                            </div>
                          </div>
                          <div
                            class="col colItem"
                            style="width: 7%;"
                          />
                        </div>
                      </template>
                    </div>
                  </div>
                  <div v-else>
                    <etm-empty />
                  </div>
                </div>
              </el-collapse-item>
            </div>
          </el-collapse>
          <div
            v-if="orderBunchData.orderList && orderBunchData.orderList.length === searchResult.length"
            class="noData"
          >
            <img src="../../../../../assets/images/guardcare/img-fygl.png">
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
      <etm-form
        ref="form"
        :model="formData"
        :rules="rule"
        type="dialog"
      >
        <el-form-item
          label="不通过原因"
          prop="rejectMessage"
        >
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
  updateOrderBunchAudit,
  queryOrderBunchById,
  updateOrderBunch
} from '@/api/newDaycare/orderManage'
import { parseTime } from '@/utils'

export default {
  name: 'OrderSide',
  components: {},
  filters: {},
  mixins: [],
  props: {
    orderBunchId: {
      type: Number,
      default () {
        return null
      }
    },
    drawerType: { // 显示内容状态：编辑、详情、审核
      type: String,
      default () {
        return null
      }
    }
  },
  data () {
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
    orderBunchId () {
      this.searchValue = ''
      this.getDetail()
    }
  },
  created () {
  },
  mounted () {
    this.getDetail()
  },
  methods: {
    getDetail () {
      queryOrderBunchById({ orderBunchId: this.orderBunchId }).then(res => {
        this.orderBunchData = res.data
        if (this.orderBunchData.status === 'UN_AUDIT' || this.orderBunchData.status === 'REJECT') {
          this.editShow = true
        } else {
          this.editShow = false
        }
      })
    },
    transferChargeType (chargeType) {
      switch (chargeType) {
        case 'PER_MONTH':
          return '按月'
        case 'PER_TERM':
          return '按学期'
        default:
          return chargeType
      }
    },
    transferChargeTime (data) {
      if (data.chargeType === 'PER_MONTH') {
        return this.transferDate(data.chargeRangeStart, 'month') + '至' + this.transferDate(data.chargeRangeEnd, 'month')
      } else if (data.chargeType === 'PER_TERM') {
        return data.termName
      } else {
        return '--'
      }
    },
    transferType (type) {
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
    transferDate (date, type) { // 日期转换
      if (!date) {
        return date || '--'
      } else if (type === 'month') {
        return parseTime(date, '{y}-{m}')
      } else {
        return parseTime(date, '{y}-{m}-{d}')
      }
    },
    transferTarget (data) { // 接收对象处理
      if (!Array.isArray(data)) {
        return data
      } else {
        return data.join(',')
      }
    },
    reject () { // 审核不通过原因填写弹窗
      this.formData = {}
      this.showPop = true
    },
    handlePopClose () {
      this.showPop = false
    },
    handlePopConfirm () { // 审核不通过提交
      this.$refs.form.$children[0].validate(valid => {
        if (valid) {
          const param = {
            orderBunchId: this.orderBunchId,
            pass: false,
            rejectMessage: this.formData.rejectMessage
          }
          updateOrderBunchAudit(param).then(() => {
            this.$message.success('审核成功')
            this.showPop = false
            this.$emit('close')
            this.$emit('finish')
          })
        }
      })
    },
    handlePopCancel () {
      this.showPop = false
    },
    pass () { // 审核通过提交
      const param = {
        orderBunchId: this.orderBunchId,
        pass: true
      }
      updateOrderBunchAudit(param).then(() => {
        this.$message.success('审核成功')
        this.$emit('close')
        this.$emit('finish')
      })
    },
    edit () {
      this.editClick = true
      this.$emit('change', 'edit')
    },
    cancel () {
      if (this.editClick) {
        this.editClick = false
        this.$emit('change', 'detail')
      } else {
        this.$emit('close')
      }
    },
    changeTotal (value, tableIndex, index) { // 编辑时修改实收小计
      const item = this.orderBunchData.orderList[index].orderItemList[tableIndex]
      const total = item.actualUnitAmount * item.number
      const amount = this.orderBunchData.orderList[index].actualAmount - total
      // 计算实收小计改变的幼儿的实收总价
      this.orderBunchData.orderList[index].actualAmount = Number((value + amount).toFixed(2))
      // 计算实收小计改变的列的实收单价
      const actualPrice = value / this.orderBunchData.orderList[index].orderItemList[tableIndex].number
      this.orderBunchData.orderList[index].orderItemList[tableIndex].actualUnitAmount = Number(actualPrice.toFixed(2))
    },
    // 修改实收小计：index为第几个账单，ind为账单里的第几项数据，i为周期性费用里的第几小项
    changChildTotal (value, i, ind, index) {
      const childItem = this.orderBunchData.orderList[index].orderItemList[ind].orderItemItemList[i] // 改变的那一小列数据
      const item = this.orderBunchData.orderList[index].orderItemList[ind] // 改变的那一列所属的一大列数据
      const childAmount = item.actualAmount - childItem.actualUnitAmount // 大列小计 - 小列旧的实收单价
      const amount = this.orderBunchData.orderList[index].actualAmount - this.orderBunchData.orderList[index].orderItemList[ind].actualAmount // 改变的幼儿的实收总价 - 旧的改变的项目的实收小计
      this.orderBunchData.orderList[index].orderItemList[ind].orderItemItemList[i].actualUnitAmount = value // 改变的小列的实收单价修改
      this.orderBunchData.orderList[index].orderItemList[ind].actualAmount = Number((value + childAmount).toFixed(2)) // 改变的大列的实收小计修改
      // 计算实收小计改变的幼儿的实收总价
      this.orderBunchData.orderList[index].actualAmount = Number((value + childAmount + amount).toFixed(2))
    },
    removeItem (tableIndex, index) { // 编辑时删除收费项目
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
          if (this.orderBunchData.orderList[index].orderItemList.length === 1) {
            this.$message.warning('当前项目不可删除')
          } else {
            // 计算删除收费项目的幼儿的实收总价
            const item = this.orderBunchData.orderList[index].orderItemList[tableIndex]
            const total = item.unitAmount * item.number // 删除项的应收小计 = 应收单价 * 数量
            const amount = this.orderBunchData.orderList[index].totalAmount - total // 应收总价 = 原应收总价 - 删除项的应收小计
            const actualTotal = item.actualUnitAmount * item.number // 删除项的实收小计 = 实收单价 * 数量
            const actualAmount = this.orderBunchData.orderList[index].actualAmount - actualTotal // 实收总价 = 原实收总价 - 删除项的实收小计
            this.orderBunchData.orderList[index].totalAmount = Number(amount.toFixed(2)) // 保留两位小数
            this.orderBunchData.orderList[index].actualAmount = Number(actualAmount.toFixed(2)) // 保留两位小数
            this.orderBunchData.orderList[index].orderItemList.splice(tableIndex, 1) // 数据去掉删除项
          }
          this.$etmTip.close()
        }
      })
      this.$etmTip.open()
    },
    save () { // 保存编辑
      this.orderBunchData.orderList = this.orderBunchData.orderList.filter(list => list.orderItemList.length > 0)
      const param = {
        orderBunchId: this.orderBunchId,
        orderList: this.orderBunchData.orderList
      }
      updateOrderBunch(param).then(() => {
        this.$message.success('编辑成功')
        this.getDetail()
        // if (this.editClick) {
        //   this.editClick = false
        //   this.$emit('change', 'detail')
        //   this.$emit('finish')
        // } else {
        //   this.$emit('close')
        //   this.$emit('finish')
        // }
        this.editClick = false
        this.$emit('change', 'detail')
        this.$emit('finish')
      })
    },
    searchOrder () {
      this.searchResult = []
      this.orderBunchData.orderList.forEach((item, index) => {
        if (this.searchValue && item.childName && !item.childName.includes(this.searchValue)) {
          this.searchResult.push(index)
        }
      })
    },
    packUp (index) {
      this.activeNames.splice(this.activeNames.indexOf(index), 1)
    },
    openUp (index) {
      this.activeNames.push(index)
    },
    transferMonth (time) {
      if (time) {
        return parseTime(time, '{y}-{m}')
      } else {
        return time
      }
    },
    formatMoney (money) {
      if (!isNaN(money)) {
        return money.toFixed(2)
      } else {
        return money
      }
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
        @include bgc_divide_color();
        border-radius: 2px;
        height: 54px;
        margin-right: 15px;
        padding-top: 11px;
        text-align: center;
        width: 100px;

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

    .rowBox {
      font-size: 14px;

      .row,
      .col {
        align-items: center;
        display: flex;
        justify-content: center;
        padding: 0 10px;
      }

      .rowTitle {
        background: #fafafa;

        .colHeader {
          color: #9a9a9a;
          height: 42px;
        }
      }

      .rowBody {
        .itemColumn {
          border-bottom: 1px solid #eee;
          border-top: 1px solid #eee;

          &:not(:first-child) {
            margin-top: 16px;
          }

          .column {
            padding: 16px 0;
          }

          .childColumn {
            border-top: 1px dashed #eee;
            padding: 16px 0;
          }

          .colItem {
            .itemImg {
              @include bgc_divide_color();
              border-radius: 2px;
              height: 54px;
              margin-right: 15px;
              padding-top: 11px;
              text-align: center;
              width: 100px;

              img {
                width: 32px;
              }
            }

            .name {
              flex: 1 1 0%;
              text-align: left;
            }

            .actual {
              height: 14px;
              line-height: 14px;
            }

            .actualInput {
              height: 32px;
              line-height: 32px;

              ::v-deep input {
                padding: 0 12px;
                width: 100px;
              }

              ::v-deep .el-input-number__increase {
                display: none;
              }

              ::v-deep .el-input-number__decrease {
                display: none;
              }
            }

            .origin {
              @include c_secondary_color();
              height: 14px;
              line-height: 14px;
              margin-top: 16px;
            }
          }
        }
      }
    }

    .orderList {
      padding-bottom: 24px;

      ::v-deep .el-collapse {
        border: 0;

        .el-collapse-item {
          border-top: 1px solid #ebeef5;

          .el-collapse-item__header {
            display: none;
          }

          .el-collapse-item__content {
            padding-bottom: 0;
          }

          .el-collapse-item__wrap {
            border: 0;
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
            @include etm-color();
            font-weight: bold;
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
        @include c_secondary_color();
        margin-top: 16px;
      }
    }
  }
}
</style>
