<template>
  <div class="chargeDetailText-wrap">

    <el-row class="row">
      <el-col :span="8">
        <etm-field-label label="合同单号">{{ detailData.contractNo }}</etm-field-label>
      </el-col>
      <el-col :span="8">
        <etm-field-label label="学员姓名">{{ detailData.childName }}</etm-field-label>
      </el-col>
      <el-col :span="8">
        <etm-field-label label="业务类型">托育</etm-field-label>
      </el-col>
      <el-col :span="8">
        <etm-field-label label="合同类型">{{ contractType[detailData.contractType] }}</etm-field-label>
      </el-col>
      <el-col v-if="detailData.contractType == 'TRANSFER_COURSE'" :span="8">
        <etm-field-label label="原合同单号">{{ detailData.originalContractNumber }}</etm-field-label>
      </el-col>
      <el-col :span="8">
        <etm-field-label label="经办人">{{ detailData.createName }}</etm-field-label>
      </el-col>
      <el-col :span="8">
        <etm-field-label label="经办时间">{{ detailData.createTime }}</etm-field-label>
      </el-col>
      <el-col :span="8">
        <etm-field-label label="合同状态">{{
          contractStatusEnum[detailData.contractStatusEnum]
        }}
        </etm-field-label>
      </el-col>
      <el-col v-if="detailData.contractStatusEnum == 'AUDIT_FAILED'" :span="8">
        <etm-field-label label="原因">{{ detailData.reason || '无' }}</etm-field-label>
      </el-col>
      <el-col :span="8">
        <etm-field-label
          v-if="detailData.contractStatusEnum == 'AUDIT_FAILED' || detailData.contractStatusEnum == 'NORMAL'"
          label="审核人"
        >{{ detailData.toExamineName }}
        </etm-field-label>
      </el-col>
      <el-col :span="8">
        <etm-field-label
          v-if="detailData.contractStatusEnum == 'AUDIT_FAILED' || detailData.contractStatusEnum == 'NORMAL'"
          label="审核时间"
        >{{ detailData.toExamineDate }}
        </etm-field-label>
      </el-col>

    </el-row>

    <div v-if="detailData.contractType != 'TRANSFER_COURSE'" class="itemTable">
      <etm-title>收费项目</etm-title>

      <!--    嵌套模板组件-->

      <nesting-table v-model="tableData" :show-img="true" :columns="columns" :disable="false" :is-delete="false" />
    </div>

    <div v-if="detailData.contractType == 'TRANSFER_COURSE'" class="itemTable">
      <etm-title>转出信息</etm-title>

      <!--    嵌套模板组件-->

      <nesting-table v-model="transferIn" :columns="columns" :disable="false" :is-delete="false" />
      <div class="total">
        转出总计：
        <el-button type="text">￥{{ detailData.totalTransferOut }}</el-button>
      </div>
    </div>

    <div v-if="detailData.contractType == 'TRANSFER_COURSE'" class="itemTable">
      <etm-title>转入信息</etm-title>

      <!--    嵌套模板组件-->

      <nesting-table v-model="tableData" :columns="columns" :disable="false" :is-delete="false" />
      <div class="total">
        转入总计：
        <el-button type="text">￥{{ detailData.totalTransferIn }}</el-button>
      </div>
    </div>

    <div v-if="detailData.contractType !== 'TRANSFER_COURSE'">
      <etm-title>支付信息</etm-title>
      <el-row class="row">
        <el-col :span="8">
          <etm-field-label label="使用定金">{{ detailData.earnestMoney || 0 }}</etm-field-label>
        </el-col>
        <el-col :span="8">
          <etm-field-label label="应收总额">{{ detailData.receivable }}</etm-field-label>
        </el-col>
        <el-col :span="8">
          <etm-field-label label="实收总计">{{ detailData.paid }}</etm-field-label>
        </el-col>
        <el-col :span="8">
          <etm-field-label label="支付方式">{{ detailData.paymentName }}</etm-field-label>
        </el-col>

        <!--        <el-col :span="8">-->
        <!--          <el-row>-->
        <!--            <el-col :span="6">使用定金</el-col>-->
        <!--            <el-col :span="6">{{ detailData.earnestMoney || 0 }}</el-col>-->
        <!--          </el-row>-->
        <!--        </el-col>-->
        <!--        <el-col :span="8">-->
        <!--          <el-row>-->
        <!--            <el-col :span="6">应收总额</el-col>-->
        <!--            <el-col :span="6">{{ detailData.receivable }}</el-col>-->
        <!--          </el-row>-->
        <!--        </el-col>-->
        <!--        <el-col :span="8">-->
        <!--          <el-row>-->
        <!--            <el-col :span="6">实收总计</el-col>-->
        <!--            <el-col :span="6">{{ detailData.paid }}</el-col>-->
        <!--          </el-row>-->
        <!--        </el-col>-->
        <!--        <el-col :span="8">-->
        <!--          <el-row>-->
        <!--            <el-col :span="6">支付方式</el-col>-->
        <!--            <el-col :span="6">{{ detailData.paymentName }}</el-col>-->
        <!--          </el-row>-->
        <!--        </el-col>-->
      </el-row>
    </div>

    <div v-if="detailData.contractType != 'TRANSFER_COURSE'">
      <etm-title>其他信息</etm-title>

      <el-row class="row">
        <el-col :span="8">
          <etm-field-label label="签约日期">{{ detailData.date }}</etm-field-label>
        </el-col>
        <el-col :span="8">
          <etm-field-label label="入托日期">{{ detailData.validBeginTime }}</etm-field-label>
        </el-col>
        <el-col :span="8">
          <etm-field-label label="合同时长">{{ detailData.step }}</etm-field-label>
        </el-col>
        <el-col :span="8">
          <etm-field-label label="有效期">
            <template slot="label">
              有效期
              <el-tooltip popper-class="stepTips" :visible-arrow="false" placement="right">
                <div slot="content">有效期开始日期与入托日期同步<br>结束日期=开始日期+合同时长+合同顺延时长</div>
                <i class="iconfont iconquestion-circle" />
              </el-tooltip>
            </template>
            {{ detailData.validBeginTime }}至
            {{ detailData.validEndTime }}
          </etm-field-label>
        </el-col>
        <el-col :span="8">
          <etm-field-label label="业绩人及占比">{{ detailData.mainPerformanceName }}-{{
            detailData.mainPercentage
          }}%
          </etm-field-label>
        </el-col>
        <el-col :span="8">
          <etm-field-label label="次业绩人及占比">
            <template v-if="detailData.secondaryPerformanceName">
              {{ detailData.secondaryPerformanceName }}-{{ detailData.secondaryPercentage }}%
            </template>
            <template v-else>无</template>
          </etm-field-label>
        </el-col>
        <el-col :span="8">
          <etm-field-label label="备注">{{ detailData.remake || '无' }}</etm-field-label>
        </el-col>
      </el-row>

    </div>
    <div v-else>
      <etm-title>其他信息</etm-title>
      <el-row class="row">
        <el-col :span="8">
          <etm-field-label label="转课时间">{{ detailData.transferDate }}</etm-field-label>
        </el-col>
        <el-col :span="8">
          <etm-field-label label="备注">{{ detailData.remake || '无' }}</etm-field-label>
        </el-col>
      </el-row>

    </div>

    <div v-if="detailData.transferVOList">
      <etm-title>转课记录</etm-title>
      <el-row class="row">
        <el-col :span="8">
          <etm-field-label label="转课合同单号">
            <etm-text v-for="(item, index) in detailData.transferVOList" :key="index" type="primary">
              {{ item.orderNo }}
            </etm-text>
          </etm-field-label>
        </el-col>

      </el-row>
    </div>
    <div v-if="detailData.contractStatusEnum == 'REFUND'">
      <etm-title>退费信息</etm-title>

      <el-row class="row">
        <el-col :span="8">
          <etm-field-label label="实退总计">{{ detailData.refund }}</etm-field-label>
        </el-col>
        <el-col :span="8">
          <etm-field-label label="支付方式">{{ detailData.refundName }}</etm-field-label>
        </el-col>
        <!--        <el-col :span="8">-->
        <!--          <etm-field-label label="已退课程">{{ detailData.retiredCourse }}</etm-field-label>-->
        <!--        </el-col>-->
        <el-col :span="8">
          <etm-field-label label="退费日期">{{ detailData.refundDate }}</etm-field-label>
        </el-col>
        <el-col :span="8">
          <etm-field-label label="经办人">{{ detailData.createName }}</etm-field-label>
        </el-col>
        <el-col :span="8">
          <etm-field-label label="经办时间">{{ detailData.createTime }}</etm-field-label>
        </el-col>
      </el-row>

    </div>
  </div>

</template>

<script>
/**
 * chargeDetailText create by Administrator
 * createTime 2020/9/9 20:07
 */
import NestingTable from '@/views/newDaycare/contract/components/nestingTable3'
import { queryCacContractDetail } from '@/api/newDaycare/contract'
import { parseTime } from '@/utils'

export default {
  name: 'ChargeForm',
  components: { NestingTable },
  filters: {},
  mixins: [],
  props: {
    prop: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  data() {
    return {
      // contractType: 'PER_CHILD',\
      transferIn: [],
      detailData: {},
      tableData: [],
      columns: [
        {
          label: '项目名称',
          width: '24%'
        }, {
          label: '单价',
          width: '28%'
        }, {
          label: '数量',
          width: '24%'
        }, {
          label: '小计',
          width: '17%'
        }
      ],
      careEnumType: {
        'TEACH': '早教',
        'CARE': '托育'
      },
      contractStatusEnum: {
        'UNDER_REVIEW': '待审核',
        'NORMAL': '正常',
        'TO_VOID': '作废',
        'AUDIT_FAILED': '审核未通过',
        'REFUND': '退费',
        'BE_OVERDUE': '过期'
      },
      contractType: {
        'NEW_SIGNING': '新签约',
        'TRANSFER_COURSE': '转课',
        'RENEWAL': '续约'
      }
    }
  },
  computed: {},
  watch: {
    prop: {
      immediate: true,
      deep: true,
      handler(n, o) {
        this.init(n)
      }
    }
  },
  created() {

  },
  mounted() {

  },
  methods: {

    init(prop) {
      queryCacContractDetail(prop.id).then(res => {
        res.data.date = parseTime(res.data.date, '{y}-{m}-{d}')
        // res.data.createTime = parseTime(res.data.createTime, '{y}-{m}-{d}')
        res.data.validBeginTime = parseTime(res.data.validBeginTime, '{y}-{m}-{d}')
        res.data.validEndTime = parseTime(res.data.validEndTime, '{y}-{m}-{d}')
        res.data.createTime = parseTime(res.data.createTime, '{y}-{m}-{d} {h}:{i}:{s}')
        res.data.refundDate = parseTime(res.data.refundDate || new Date(), '{y}-{m}-{d}')
        res.data.toExamineDate = parseTime(res.data.toExamineDate || new Date(), '{y}-{m}-{d}')
        res.data.transferDate = parseTime(res.data.transferDate || new Date(), '{y}-{m}-{d}')

        this.transferIn = res.data.transferIn

        this.tableData = res.data.listPurchaseItemsVo.map(cur => {
          if (cur['img'] && cur['img'].length) {
            cur.img = cur['img'][0].url
          } else {
            cur.img = ''
          }

          if (cur['childList'] && cur['childList'].length) {
            cur['childList'].forEach(c => {
              if (c['img'] && c['img'].length) {
                c.img = c['img'][0].url
              } else {
                c.img = ''
              }
            })
          }

          return cur
        })
        res.data.step = `${res.data.contractDuration.split('-')[0]}个月${res.data.contractDuration.split('-')[1]}天`
        this.detailData = res.data
      })
    },
    selectEvent() {

    },
    choice() {
      this.$emit('choice', {})
    }
  }
}
</script>
<style lang="scss" scoped>
.chargeDetailText-wrap {

  .total {
    display: flex;
    justify-content: flex-end;
    align-items: center;
  }
}
</style>
