<template>
  <div class="enrollDetail">
    <etm-layout-split>
      <div class="scrollBox">
        <etm-title class="title">报名详情</etm-title>
        <div class="message">
          <div class="stateLogo">
            <img v-if="detailState === 'REJECT'" src="../../../../assets/images/noPass.png">
            <img v-else-if="detailState === 'UNAUDIT'" src="../../../../assets/images/approving.png">
            <img v-else-if="detailState === 'PASS'" src="../../../../assets/images/passed.png">
          </div>
          <etm-title :border="false" :show-line="false">基础信息</etm-title>
          <div class="messageBox paddingBox">
            <div class="basicBox">
              <el-row>
                <el-col v-for="(item, index) in basicList" :key="index" :span="8" class="basicCol">
                  <span class="label">{{ item.label }}:</span>
                  <span>{{ item.value }}</span>
                </el-col>
              </el-row>
            </div>
          </div>
          <etm-title :border="false" :show-line="false">课程信息</etm-title>
          <div class="messageBox">
            <div class="courseBox">
              <div class="tableTitle">课程套餐:</div>
              <etm-table class="msgTable" :data="orderData.carePackageList" border>
                <el-table-column
                  prop="orderCarePackageName"
                  label="套餐名称"
                />
                <el-table-column
                  prop="duration"
                  label="套餐时长（月）"
                />
                <el-table-column
                  prop="freeDuration"
                  label="赠送时长（天）"
                />
                <el-table-column
                  prop="price"
                  label="套餐价格（元）"
                />
              </etm-table>
              <div class="tableTitle">餐费:</div>
              <etm-table class="msgTable" :data="orderData.mealsPriceList" border>
                <el-table-column
                  prop="mealsName"
                  label="套餐名称"
                />
                <el-table-column
                  prop="duration"
                  label="天数（天）"
                />
                <el-table-column
                  prop="price"
                  label="套餐单价（元）"
                />
                <el-table-column
                  prop="amount"
                  label="套餐总价（元）"
                />
                <el-table-column
                  prop="actualAmount"
                  label="套餐实收（元）"
                />
              </etm-table>
              <div class="tableTitle">材料物品（{{ orderData.sellMaterial ? '售卖' : '赠送' }}）:</div>
              <etm-table :data="orderData.materialList" border>
                <el-table-column
                  prop="serial"
                  label="物品编号"
                />
                <el-table-column
                  prop="orderMaterialName"
                  label="物品名称"
                />
                <el-table-column
                  label="物品类型"
                >
                  <template slot-scope="scoped">
                    {{ getMaterialType(scoped.row.materialType) }}
                  </template>
                </el-table-column>
                <el-table-column
                  label="物品数量"
                >
                  <template slot-scope="scoped">
                    {{ scoped.row.numbers }}
                    {{ scoped.row.unit }}
                  </template>
                </el-table-column>
                <el-table-column
                  prop="sellPrice"
                  label="销售价格（元）"
                />
              </etm-table>
            </div>
          </div>
          <etm-title :border="false" :show-line="false">更多信息</etm-title>
          <div class="messageBox">
            <div class="moreMsgBox">
              <el-row>
                <el-col :span="8" class="basicCol">
                  <div class="name">
                    <span class="label">业绩所属人:</span>
                    <span>{{ orderData.ownerName }}</span>
                  </div>
                  <div class="rate">
                    <span class="label">业绩占比(%):</span>
                    <span>{{ orderData.ownerPerformance }}</span>
                  </div>
                </el-col>
                <el-col v-for="(item, index) in orderData.otherOwner" :key="index" :span="8" class="basicCol">
                  <div class="name">
                    <span class="label">次业绩所属人:</span>
                    <span>{{ item.name }}</span>
                  </div>
                  <div class="rate">
                    <span class="label">业绩占比(%):</span>
                    <span>{{ item.performance }}</span>
                  </div>
                </el-col>
              </el-row>
              <div v-if="orderData.mark" class="basicCol">
                <span class="label">备注:</span>
                <span>{{ orderData.mark }}</span>
              </div>
              <div v-if="orderData.extraAddressArray && orderData.extraAddressArray.length" class="basicCol imgCol">
                <span class="label">图片:</span>
                <span>
                  <div class="imgBox">
                    <div v-for="(img, index) in orderData.extraAddressArray" :key="index" class="img">
                      <el-image :src="img.url" fit="cover" :preview-src-list="[img.url]" />
                    </div>
                  </div>
                </span>
              </div>
            </div>
          </div>
          <template v-if="detailState === 'REJECT'">
            <etm-title :border="false" :show-line="false">不通过原因</etm-title>
            <div class="messageBox">
              <div class="rejectReason">{{ orderData.message }}</div>
            </div>
          </template>
        </div>
      </div>
      <div class="bottomBtns">
        <div v-if="detailState === 'REJECT'" v-has="{authId: 'sacc.enroll.update'}" class="btn">
          <el-button type="primary" @click="edit">修改</el-button>
        </div>
        <div v-if="detailState === 'UNAUDIT'" v-has="{authId: 'sacc.enroll.exam'}" class="btn">
          <el-button type="primary" @click="auditPass">通过</el-button>
        </div>
        <div v-if="detailState === 'UNAUDIT'" v-has="{authId: 'sacc.enroll.exam'}" class="btn">
          <el-button plain @click="auditReject">不通过</el-button>
        </div>
        <div v-if="detailState === 'PASS'" class="btn">
          <el-button plain @click="returnBack">返回</el-button>
        </div>
      </div>
    </etm-layout-split>
    <etm-pop
      v-if="showPop"
      :visible="showPop"
      pop="simple"
      :title="popTitle"
      confirm-btn="确定"
      cancel-btn="取消"
      @close="handlePopClose"
      @confirm="handlePopConfirm"
      @cancel="handlePopCancel"
    >
      <div class="rejectPop">
        <etm-form ref="form" :model="formItem" :rules="rules" type="dialog">
          <el-form-item label="不通过原因" prop="rejectReason">
            <el-input
              v-model="formItem.rejectReason"
              type="textarea"
              placeholder="请填写原因"
              :autosize="{ minRows: 3}"
            />
          </el-form-item>
        </etm-form>
      </div>
    </etm-pop>
  </div>
</template>

<script>
import EtmPop from '@/layout/main/EtmPop/src/EtmPop'
import { mapState } from 'vuex'
import { getOrderDetail, auditOrder } from '@/api/sacc/enrollmentManage'
import { parseTime } from '@/utils'

export default {
  components: {
    EtmPop
  },
  data() {
    return {
      detailState: '',
      orderData: {},
      basicList: [
        {
          label: '报名编号',
          name: 'orderNumber',
          value: ''
        },
        {
          label: '会员姓名',
          name: 'customerName',
          value: ''
        },
        // {
        //   label: '转出单号',
        //   name: '',
        //   value: ''
        // },
        {
          label: '状态',
          name: 'orderState',
          value: ''
        },
        {
          label: '联系人姓名',
          name: 'parentName',
          value: ''
        },
        // {
        //   label: '转入单号',
        //   name: '',
        //   value: ''
        // },
        {
          label: '支付方式',
          name: 'payType',
          value: ''
        },
        {
          label: '开始日期',
          name: 'startDate',
          value: ''
        },
        {
          label: '签单日期',
          name: 'signDate',
          value: ''
        },
        // {
        //   label: '退款日期',
        //   name: 'refundDate',
        //   value: ''
        // },
        {
          label: '结束日期',
          name: 'endDate',
          value: ''
        },
        {
          label: '签单类型',
          name: 'orderType',
          value: ''
        },
        // {
        //   label: '退款金额',
        //   name: 'refundAmount',
        //   value: ''
        // },
        {
          label: '应收总价（元）',
          name: 'totalAmount',
          value: ''
        },
        {
          label: '实收总价（元）',
          name: 'actualAmount',
          value: ''
        }
      ],
      showPop: false,
      popTitle: '填写原因',
      formItem: {
        rejectReason: ''
      },
      rules: {
        rejectReason: [{ required: true, message: '不通过原因不能为空', trigger: 'blur' }]
      }
    }
  },
  computed: {
    ...mapState('sacc/enrollment', [`orderId`])
  },
  created() {
    this.getData()
  },
  methods: {
    getData() {
      getOrderDetail(this.orderId).then(res => {
        this.orderData = res.data
        if (this.orderData.orderState === 'REJECT' || this.orderData.orderState === 'UNAUDIT') {
          this.detailState = this.orderData.orderState
        } else {
          this.detailState = 'PASS'
        }
        this.setBasicData()
      })
    },
    setBasicData() {
      this.basicList.forEach((item, index) => {
        if (item.name === 'customerName') {
          this.basicList[index].value = this.orderData.customer.name
        } else if (item.name === 'orderState') {
          this.basicList[index].value = this.transferState(this.orderData[item.name])
        } else if (item.name === 'orderType') {
          this.basicList[index].value = this.transferType(this.orderData[item.name])
        } else if (item.name === 'payType') {
          this.basicList[index].value = this.transferPayType(this.orderData[item.name])
        } else if (item.name === 'startDate' || item.name === 'endDate' || item.name === 'signDate' || item.name === 'refundDate') {
          this.basicList[index].value = this.transferDate(this.orderData[item.name])
        } else {
          this.basicList[index].value = this.orderData[item.name]
        }
      })
    },
    transferState(state) { // 报名订单状态
      if (!state) return '-'
      switch (state) {
        case 'UNAUDIT':
          return '待审核'
        case 'REJECT':
          return '不通过'
        case 'UNSTART':
          return '未开课'
        case 'STARTING':
          return '已开课'
        case 'END':
          return '已结束'
        case 'REFUND':
          return '已退费'
      }
    },
    transferType(type) { // 报名订单类型
      if (!type) return '-'
      switch (type) {
        case 'NEW_SIGN':
          return '新生'
        case 'RENEW':
          return '续报'
      }
    },
    transferDate(date) {
      if (!date) return '-'
      return parseTime(date, '{y}-{m}-{d}')
    },
    transferPayType(type) { // 支付方式
      if (!type) return '-'
      switch (type) {
        case 'CASH':
          return '现金'
        case 'WECHAT':
          return '微信'
        case 'ALIPAY':
          return '支付宝'
        case 'UNIONPAY':
          return '银行转账'
        case 'POS':
          return 'POS机'
      }
    },
    getMaterialType(type) { // 物品类型
      if (!type) return '-'
      switch (type) {
        case 'LIVE':
          return '生活用品'
        case 'LEARN':
          return '学习用品'
      }
    },
    auditPass() { // 报名通过审核
      const param = {
        orderId: this.orderId,
        pass: true
      }
      this.submitAudit(param)
    },
    auditReject() { // 报名不通过原因弹窗
      this.showPop = true
    },
    handlePopClose() {
      this.showPop = false
    },
    handlePopConfirm() { // 报名不通过审核
      this.$refs['form'].validate((valid) => {
        if (valid) {
          const param = {
            orderId: this.orderId,
            pass: false,
            message: this.formItem.rejectReason
          }
          this.submitAudit(param)
        }
      })
    },
    handlePopCancel() {
      this.showPop = false
    },
    submitAudit(data) { // 审核提交
      auditOrder(data).then(() => {
        this.$message.success('审核成功')
        this.showPop = false
        this.getData()
      })
    },
    edit() { // 报名修改
      this.$emit('switch', { target: 'enrollEdit', index: 3 })
    },
    returnBack() { // 返回
      this.$emit('jump', 'manage')
    }
  }
}
</script>

<style lang="scss" scoped>
  .enrollDetail {
    position: relative;
    @include bgc_white();

    .EtmTitle-wrap {
      margin-bottom: 0;

      &.title {
        /deep/ .text {
          font-size: 16px !important;
        }
      }
    }

    .message {
      position: relative;

      .stateLogo {
        position: absolute;
        top: -34px;
        right: 45px;
        z-index: 1;
        width: 88px;
      }

      .messageBox {
        &.paddingBox {
          padding-bottom: 16px;
        }

        .basicBox {
          border-bottom: 1px solid $divide-color;
        }

        .courseBox {
          .tableTitle {
            margin-bottom: 16px;
            @include c_text_color();
          }
        }

        .rejectReason {
          margin-bottom: 16px;
          @include c_error_color();
        }
      }

      .basicCol {
        margin-bottom: 16px;
        @include c_text_color();

        &.imgCol {
          margin-bottom: 6px;
        }

        span {
          display: inline-block;
          vertical-align: top;

          &.label {
            margin-right: 10px;
          }
        }

        .rate {
          margin-top: 16px;
        }

        .imgBox {
          display: flex;

          .img {
            margin: 0 10px 10px 0;
            width: 80px;
            height: 80px;
            border-radius: 2px;
            @include bgc_disabled_color();

            /deep/ .el-image {
              width: 100%;
              height: 100%;
            }
          }
        }
      }
    }

    .bottomBtns {
      display: flex;
      align-items: center;
      padding-left: 300px;

      .btn {
        margin: 16px 0;
      }

      .btn + .btn {
        margin-left: 16px;
      }
    }
  }

</style>
