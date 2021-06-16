<template>
  <div class="chargeDetailText-wrap">
    <el-row class="row">
      <el-col :span="8">
        <etm-field-label label="合同单号">
          {{ detailData.contractNo }}
        </etm-field-label>
      </el-col>
      <el-col :span="8">
        <etm-field-label label="学员姓名">
          {{ detailData.childName }}
        </etm-field-label>
      </el-col>
      <el-col :span="8">
        <etm-field-label label="业务类型">
          早教
        </etm-field-label>
      </el-col>
      <el-col :span="8">
        <etm-field-label label="合同类型">
          {{ contractType[detailData.contractType] }}
        </etm-field-label>
      </el-col>
      <el-col
        v-if="detailData.contractType == 'TRANSFER_COURSE' && !print"
        :span="8"
      >
        <etm-field-label label="原合同单号">
          {{ detailData.originalContractNumber }}
        </etm-field-label>
      </el-col>
      <el-col :span="8">
        <etm-field-label label="经办人">
          {{ detailData.createName }}
        </etm-field-label>
      </el-col>
      <el-col :span="8">
        <etm-field-label label="经办时间">
          {{ detailData.createTime }}
        </etm-field-label>
      </el-col>
      <el-col
        v-if="!print"
        :span="8"
      >
        <etm-field-label label="合同状态">
          {{
            contractStatusEnum[detailData.contractStatusEnum]
          }}
        </etm-field-label>
      </el-col>
      <el-col
        v-if="detailData.contractStatusEnum == 'AUDIT_FAILED' && !print"
        :span="8"
      >
        <etm-field-label label="原因">
          {{ detailData.reason || '无' }}
        </etm-field-label>
      </el-col>
      <el-col
        v-if="!print"
        :span="8"
      >
        <etm-field-label
          v-if="detailData.contractStatusEnum == 'AUDIT_FAILED' || detailData.contractStatusEnum == 'NORMAL'"
          label="审核人"
        >
          {{ detailData.toExamineName }}
        </etm-field-label>
      </el-col>
      <el-col
        v-if="!print"
        :span="8"
      >
        <etm-field-label
          v-if="detailData.contractStatusEnum == 'AUDIT_FAILED' || detailData.contractStatusEnum == 'NORMAL'"
          label="审核时间"
        >
          {{ detailData.toExamineDate }}
        </etm-field-label>
      </el-col>
    </el-row>

    <div
      v-if="detailData.contractType != 'TRANSFER_COURSE'"
      class="itemTable"
    >
      <etm-title>收费项目</etm-title>

      <!--    嵌套模板组件-->

      <nesting-table
        v-model="tableData"
        :show-img="true"
        :columns="columns"
        :disable="false"
        :is-delete="false"
      />
    </div>

    <div
      v-if="detailData.contractType == 'TRANSFER_COURSE'"
      class="itemTable"
    >
      <etm-title>转出信息</etm-title>

      <!--    嵌套模板组件-->

      <nesting-table
        v-model="transferIn"
        :columns="columns"
        :disable="false"
        :is-delete="false"
      />
      <div class="total">
        转出总计：
        <el-button type="text">
          ￥{{ detailData.totalTransferOut }}
        </el-button>
      </div>
    </div>

    <div
      v-if="detailData.contractType == 'TRANSFER_COURSE'"
      class="itemTable"
    >
      <etm-title>转入信息</etm-title>

      <!--    嵌套模板组件-->

      <nesting-table
        v-model="tableData"
        :columns="columns"
        :disable="false"
        :is-delete="false"
      />
      <div class="total">
        转入总计：
        <el-button type="text">
          ￥{{ detailData.totalTransferIn }}
        </el-button>
      </div>
    </div>

    <div v-if="detailData.contractType !== 'TRANSFER_COURSE'">
      <etm-title>支付信息</etm-title>
      <el-row class="row">
        <el-col :span="8">
          <etm-field-label label="使用订金">
            {{ detailData.earnestMoney || 0 }}
          </etm-field-label>
        </el-col>
        <el-col :span="8">
          <etm-field-label label="应收总额">
            {{ detailData.receivable }}
          </etm-field-label>
        </el-col>
        <el-col :span="8">
          <etm-field-label label="实收总计">
            {{ detailData.paid }}
          </etm-field-label>
        </el-col>
        <el-col :span="8">
          <etm-field-label label="支付方式">
            {{ detailData.paymentName }}
          </etm-field-label>
        </el-col>
        <!--          TODO: 隐藏收款功能-->
        <!--        <el-col :span="8">-->
        <!--          <etm-field-label label="支付单号">-->
        <!--            {{ detailData.paymentOrderNo || '&#45;&#45;' }}-->
        <!--          </etm-field-label>-->
        <!--        </el-col>-->
      </el-row>
    </div>

    <div v-if="detailData.contractType != 'TRANSFER_COURSE'">
      <etm-title>其他信息</etm-title>

      <el-row class="row">
        <el-col :span="8">
          <etm-field-label label="签约日期">
            {{ detailData.date }}
          </etm-field-label>
        </el-col>
        <el-col :span="8">
          <etm-field-label label="有效期">
            {{ detailData.validBeginTime }}至{{
              detailData.validEndTime
            }}
          </etm-field-label>
        </el-col>
        <el-col :span="8">
          <etm-field-label label="业绩人及占比">
            {{ detailData.mainPerformanceName }}-{{
              detailData.mainPercentage
            }}%
          </etm-field-label>
        </el-col>
        <el-col :span="8">
          <etm-field-label label="次业绩人及占比">
            <template v-if="detailData.secondaryPerformanceName">
              {{ detailData.secondaryPerformanceName }}-{{ detailData.secondaryPercentage }}%
            </template>
            <template v-else>
              无
            </template>
          </etm-field-label>
        </el-col>
        <el-col :span="8">
          <div style="padding-right: 8px;">
            <etm-field-label label="备注">
              {{ detailData.remake || '无' }}
            </etm-field-label>
          </div>
        </el-col>
        <el-col
          v-if="!print"
          :span="8"
        >
          <etm-field-label label="资料文件">
            <template v-if="detailData.annex && detailData.annex.length">
              <div
                v-for="(item, index) in (detailData.annex || [])"
                :key="index"
                @click="download(item)"
              >
                <etm-text>{{ item.name }}</etm-text>
              </div>
            </template>
            <span v-else>无</span>
          </etm-field-label>
        </el-col>
      </el-row>
    </div>
    <div v-else>
      <etm-title>其他信息</etm-title>
      <el-row class="row">
        <el-col :span="8">
          <etm-field-label label="转课时间">
            {{ detailData.transferDate }}
          </etm-field-label>
        </el-col>
        <el-col :span="8">
          <etm-field-label label="备注">
            {{ detailData.remake || '无' }}
          </etm-field-label>
        </el-col>
        <el-col
          v-if="!print"
          :span="8"
        >
          <etm-field-label label="资料文件">
            <template v-if="detailData.annex && detailData.annex.length">
              <div
                v-for="(item, index) in (detailData.annex || [])"
                :key="index"
                @click="download(item)"
              >
                <etm-text>{{ item.name }}</etm-text>
              </div>
            </template>
            <span v-else>无</span>
          </etm-field-label>
        </el-col>
      </el-row>
    </div>

    <div v-if="detailData.transferVOList">
      <etm-title>转课记录</etm-title>
      <el-row class="row">
        <el-col :span="8">
          <etm-field-label label="转课合同单号">
            <etm-text
              v-for="(item, index) in detailData.transferVOList"
              :key="index"
              type="primary"
            >
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
          <etm-field-label label="实退总计">
            {{ detailData.refund }}
          </etm-field-label>
        </el-col>
        <el-col :span="8">
          <etm-field-label label="支付方式">
            {{ detailData.refundName }}
          </etm-field-label>
        </el-col>
        <el-col :span="8">
          <etm-field-label label="已退课程">
            {{ detailData.retiredCourse }}
          </etm-field-label>
        </el-col>
        <el-col :span="8">
          <etm-field-label label="退费日期">
            {{ detailData.refundDate }}
          </etm-field-label>
        </el-col>
        <el-col :span="8">
          <etm-field-label label="经办人">
            {{ detailData.createName }}
          </etm-field-label>
        </el-col>
        <el-col :span="8">
          <etm-field-label label="经办时间">
            {{ detailData.createTime }}
          </etm-field-label>
        </el-col>
      </el-row>
    </div>

    <template v-if="print">
      <div class="print">
        <div class="agent">
          经办人签名：
        </div>
        <div class="customer">
          客户签名：
        </div>
      </div>
    </template>
  </div>
</template>

<script>
/**
 * chargeDetailText create by Administrator
 * createTime 2020/9/9 20:07
 */
import NestingTable from '../../components/nestingTable3'
import { queryTeachContractDetail } from '@/api/newDaycare/contract'
import { parseTime } from '@/utils'
import DownloadJs from 'downloadjs'
import axios from 'axios'
import { Loading } from 'element-ui-etm'
let uploadLoading
export default {
  name: 'ChargeForm',
  components: { NestingTable },
  filters: {},
  mixins: [],
  props: {
    prop: {
      type: Object,
      default () {
        return {}
      }
    },
    print: {
      type: Boolean,
      default: false
    }
  },
  data () {
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
        TEACH: '早教',
        CARE: '托育'
      },
      contractStatusEnum: {
        UNDER_REVIEW: '待审核',
        NORMAL: '正常',
        AUDIT_FAILED: '审核未通过',
        REFUND: '退费',
        TO_VOID: '作废',
        BE_OVERDUE: '过期'
      },
      contractType: {
        NEW_SIGNING: '新签约',
        TRANSFER_COURSE: '转课',
        RENEWAL: '续约'
      }
    }
  },
  computed: {},
  watch: {
    prop: {
      immediate: true,
      deep: true,
      handler (n, o) {
        this.init(n)
      }
    }
  },
  created () {

  },
  mounted () {

  },
  methods: {
    download (item) {
      uploadLoading = Loading.service({
        fullscreen: true,
        lock: true,
        customClass: 'etm-loading',
        // text: '数据加载中...',
        spinner: 'el-icon-loading',
        background: 'rgba(0,0,0,.1)'
      })

      axios({
        url: item.url,
        responseType: 'blob'
      }).then(res => {
        DownloadJs(res.data, item.name)
        uploadLoading.close()
      }).catch(() => {
        this.$message.error('文件下载失败')
        uploadLoading.close()
      })
    },
    init (prop) {
      queryTeachContractDetail(prop.id).then(res => {
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
          if (cur.img && cur.img.length) {
            cur.img = cur.img[0].url
          } else {
            cur.img = ''
          }

          if (cur.childList && cur.childList.length) {
            cur.childList.forEach(c => {
              if (c.img && c.img.length) {
                c.img = c.img[0].url
              } else {
                c.img = ''
              }
            })
          }

          return cur
        })
        this.detailData = res.data
      })
    },
    selectEvent () {

    },
    choice () {
      this.$emit('choice', {})
    }
  }
}
</script>
<style lang="scss" scoped>
.chargeDetailText-wrap {
  .total {
    align-items: center;
    display: flex;
    justify-content: flex-end;
  }

  .print {
    display: flex;
    justify-content: flex-end;
    margin-top: 50px;

    .agent,
    .customer {
      display: inline-block;
      margin-right: 140px;
    }
  }
}
</style>
