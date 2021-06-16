<template>
  <div class="chargeForm-wrap">
    <etm-drawer
      :visible.sync="isShow"
      type="big"
    >
      <etm-layout-split>
        <etm-title
          :show-line="false"
          border
          size="big"
        >
          合同审核

          <template slot="tool">
            <el-button
              size="mini"
              plain
              @click="noReason = true"
            >
              不通过
            </el-button>
            <el-button
              size="mini"
              type="primary"
              @click="verifContract"
            >
              通过
            </el-button>
          </template>
        </etm-title>

        <el-row class="row">
          <el-col :span="12">
            <etm-field-label label="合同单号">
              {{ detailData.contractNo }}
            </etm-field-label>
            <!--            <el-row>-->
            <!--              <el-col :span="6">合同单号</el-col>-->
            <!--              <el-col :span="6">{{ detailData.contractNo }}</el-col>-->
            <!--            </el-row>-->
          </el-col>
          <el-col :span="12">
            <etm-field-label label="学员姓名">
              {{ detailData.childName }}
            </etm-field-label>
          </el-col>
          <el-col :span="12">
            <etm-field-label label="业务类型">
              早教
            </etm-field-label>
          </el-col>
          <el-col :span="12">
            <etm-field-label label="合同类型">
              {{ contractType[detailData.contractType] }}
            </etm-field-label>
          </el-col>
          <!--          <el-col :span="12">-->
          <!--            <el-row>-->
          <!--              <el-col :span="6">学员姓名</el-col>-->
          <!--              <el-col :span="14">{{ detailData.childName }}</el-col>-->
          <!--            </el-row>-->
          <!--          </el-col>-->
          <!--          <el-col :span="12">-->
          <!--            <el-row>-->
          <!--              <el-col :span="6">业务类型</el-col>-->
          <!--              <el-col :span="14">早教</el-col>-->
          <!--            </el-row>-->
          <!--          </el-col>-->
          <!--          <el-col :span="12">-->
          <!--            <el-row>-->
          <!--              <el-col :span="6">合同类型</el-col>-->
          <!--              <el-col :span="14">{{ contractType[detailData.contractType] }}</el-col>-->
          <!--            </el-row>-->
          <!--          </el-col>-->
        </el-row>

        <div class="itemTable">
          <etm-title>收费项目</etm-title>

          <!--    嵌套模板组件-->

          <nesting-table
            v-model="tableData"
            :columns="columns"
            :disable="false"
            :is-delete="false"
          />
        </div>

        <div>
          <etm-title>支付信息</etm-title>
          <etm-field-label
            label="使用订金"
            type="left"
          >
            {{ detailData.earnestMoney || '无' }}
          </etm-field-label>
          <etm-field-label
            label="应收总额"
            type="left"
          >
            {{ detailData.receivable }}
          </etm-field-label>
          <etm-field-label
            label="实收总计"
            type="left"
          >
            {{ detailData.paid }}
          </etm-field-label>
          <etm-field-label
            label="支付方式"
            type="left"
          >
            {{ detailData.paymentName }}
          </etm-field-label>
          <!--          <el-row>-->
          <!--            <el-col :span="16">-->
          <!--              <etm-form type="dialog">-->
          <!--                <el-form-item label="使用订金">-->
          <!--                  {{ detailData.earnestMoney || '无' }}-->
          <!--                </el-form-item>-->
          <!--                <el-form-item label="应收总额">-->
          <!--                  {{ detailData.receivable }}-->
          <!--                </el-form-item>-->
          <!--                <el-form-item label="实收总计">-->
          <!--                  {{ detailData.paid }}-->
          <!--                </el-form-item>-->
          <!--                <el-form-item label="支付方式">-->
          <!--                  {{ detailData.paymentName }}-->
          <!--                </el-form-item>-->
          <!--              </etm-form>-->
          <!--            </el-col>-->
          <!--          </el-row>-->
        </div>

        <div>
          <etm-title>其他信息</etm-title>
          <etm-field-label
            label="签约日期"
            type="left"
          >
            {{ detailData.date }}
          </etm-field-label>
          <etm-field-label
            label="有效期"
            type="left"
          >
            {{ detailData.validBeginTime }}至{{ detailData.validEndTime }}
          </etm-field-label>
          <etm-field-label
            label="业绩人及占比"
            type="left"
          >
            {{ detailData.mainPerformanceName }}-{{ detailData.mainPercentage }}%
          </etm-field-label>
          <etm-field-label
            label="次业绩人及占比"
            type="left"
          >
            <span v-if="detailData.secondaryPerformanceName">{{
              detailData.secondaryPerformanceName
            }}-{{ detailData.secondaryPercentage }}%</span>
            <span v-else>无</span>
          </etm-field-label>
          <etm-field-label
            label="经办人"
            type="left"
          >
            {{ detailData.createName }}
          </etm-field-label>
          <etm-field-label
            label="经办时间"
            type="left"
          >
            {{ detailData.createTime }}
          </etm-field-label>
          <etm-field-label
            label="备注"
            type="left"
          >
            {{ detailData.remake }}
          </etm-field-label>
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
          <!--          <el-row>-->
          <!--            <el-col :span="16">-->
          <!--              <etm-form type="dialog">-->
          <!--                <el-form-item label="签约日期">-->
          <!--                  {{ detailData.date }}-->
          <!--                </el-form-item>-->
          <!--                <el-form-item label="有效期">-->
          <!--                  {{ detailData.validBeginTime }}至{{ detailData.validEndTime }}-->
          <!--                </el-form-item>-->
          <!--                <el-form-item label="业绩人及占比">-->
          <!--                  {{ detailData.mainPerformanceName }}-{{ detailData.mainPercentage }}%-->
          <!--                </el-form-item>-->
          <!--                <el-form-item label="次业绩人及占比">-->

          <!--                  <sapn v-if="detailData.secondaryPerformanceName">{{-->
          <!--                    detailData.secondaryPerformanceName-->
          <!--                  }}-{{ detailData.secondaryPercentage }}%-->
          <!--                  </sapn>-->
          <!--                  <span v-else>无</span>-->
          <!--                </el-form-item>-->
          <!--                <el-form-item label="经办人">-->
          <!--                  {{ detailData.createName }}-->
          <!--                </el-form-item>-->
          <!--                <el-form-item label="经办时间">-->
          <!--                  {{ detailData.createTime }}-->
          <!--                </el-form-item>-->

          <!--                <el-form-item label="备注">-->
          <!--                  {{ detailData.remake }}-->
          <!--                </el-form-item>-->
          <!--              </etm-form>-->
          <!--            </el-col>-->
          <!--          </el-row>-->
        </div>
      </etm-layout-split>

      <etm-pop
        title="原因"
        :visible="noReason"
        cancel-btn="取消"
        @cancel="cancelReason"
        @close="cancelReason"
        @confirm="noReasonEvent"
      >
        <el-input
          v-model="reasonText"
          type="textarea"
          :rows="6"
          placeholder="请输入不通过原因"
        />
      </etm-pop>
    </etm-drawer>
  </div>
</template>

<script>

/**
 * chargeForm create by Administrator
 * createTime 2020/8/20 17:29
 */
import NestingTable from '../../components/nestingTable3'
import { queryTeachContractDetail, updateTeachVerifContract } from '@/api/newDaycare/contract'
import { parseTime } from '@/utils'
import { deepClone } from '@/views/newDaycare/contract/common'
import DownloadJs from 'downloadjs'

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
    }
  },
  data () {
    return {
      reasonText: '',
      noReason: false,
      // contractType: 'PER_CHILD',
      isShow: false,
      detailData: {},
      payType: [],
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
      handler (n) {
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
      DownloadJs(item.url)
    },
    cancelReason () {
      this.noReason = false
      this.reasonText = ''
    },
    verifContract () {
      updateTeachVerifContract({ id: this.prop.id, toExamineState: true }).then(res => {
        this.$message('审核通过成功')
        this.$emit('update', {})
        this.isShow = false
      })
    },
    noReasonEvent () {
      if (!this.reasonText) {
        this.$message({
          message: '请填写原因',
          type: 'warning'
        })

        return
      }
      updateTeachVerifContract({ id: this.prop.id, toExamineState: false, reason: this.reasonText }).then(res => {
        // this.$message('审核通过成功')
        this.$message('提交成功')
        this.$emit('update', {})
        this.isShow = false
        this.noReason = false
      })
    },
    init (prop) {
      queryTeachContractDetail(prop.id).then(res => {
        res.data.date = parseTime(res.data.date, '{y}-{m}-{d}')
        res.data.validBeginTime = parseTime(res.data.validBeginTime, '{y}-{m}-{d}')
        res.data.validEndTime = parseTime(res.data.validEndTime, '{y}-{m}-{d}')
        res.data.createTime = parseTime(res.data.createTime, '{y}-{m}-{d} {h}:{i}:{s}')

        this.tableData = deepClone(res.data.listPurchaseItemsVo.map(cur => {
          if (cur.img && cur.img.length) {
            // cur.img = cur['img'][0].url

            cur.img = cur.img[0].url
          } else {
            cur.img = ''
          }

          if (cur.childList && cur.childList.length) {
            cur.childList.map(c => {
              if (c.img && c.img.length) {
                c.img = c.img[0].url
              } else {
                c.img = ''
              }
            })
          }
          return cur
        }))
        this.detailData = res.data
      })
    },
    triggerShow () {
      this.isShow = true
    }

  }
}
</script>
<style lang="scss" scoped>

::v-deep .EtmLayoutSplit-wrap {
  height: 100vh;

  .layout-default {
    overflow-y: auto;
  }
}

</style>
