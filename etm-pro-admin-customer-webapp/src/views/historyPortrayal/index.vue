<template>
  <div class="waitPortrayal-wrap">
    <etm-layout-split>
      <div slot="header">
        <etm-table-tool-bar slot="tool">
          客户画像历史
          <div slot="right">
            <etm-field-label
              label="画像时间"
              type="right"
            >
              <el-date-picker
                v-model="searchParams"
                type="daterange"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                value-format="yyyy-MM-dd"
                @change="timeChange"
              />
            </etm-field-label>
          </div>
        </etm-table-tool-bar>
        <bar-chart :chart-data="statistics" />
      </div>

      <div slot="body">
        <etm-table-page
          :columns="columns"
          :data="tableData"
          @currentChange="currentChange"
        >
          <etm-table-tool-bar slot="tool">
            <etm-table-digit :data="digit" />
          </etm-table-tool-bar>

          <el-table-column
            slot="left"
            label="画像时间"
            min-width="180"
            fixed="left"
          >
            <template v-slot="{row}">
              <etm-text
                type="danger"
                @click="goto(row)"
              >
                {{ row.createTime }}
              </etm-text>
            </template>
          </el-table-column>
          <el-table-column
            slot="right"
            width="120"
          >
            <div slot="header">
              高度符合
              <el-tooltip
                effect="dark"
                popper-class="stepTips"
                placement="bottom"
              >
                <i class="iconfont iconquestion-circle" />
                <div
                  slot="content"
                >
                  标签数量>80%与画像条件匹配
                </div>
              </el-tooltip>
            </div>
            <template v-slot="{row}">
              {{ row.highItemTotal }}
            </template>
          </el-table-column>
          <el-table-column
            slot="right"
            width="120"
          >
            <div slot="header">
              中度符合
              <el-tooltip
                effect="dark"
                popper-class="stepTips"
                placement="bottom"
              >
                <i class="iconfont iconquestion-circle" />
                <div
                  slot="content"
                >
                  标签数量50%~80%与画像条件匹配
                </div>
              </el-tooltip>
            </div>
            <template v-slot="{row}">
              {{ row.middleItemTotal }}
            </template>
          </el-table-column>
          <el-table-column
            slot="right"
            width="120"
          >
            <div slot="header">
              低度符合
              <el-tooltip
                effect="dark"
                popper-class="stepTips"
                placement="bottom"
              >
                <i class="iconfont iconquestion-circle" />
                <div
                  slot="content"
                >
                  标签数量1%~50%与画像条件匹配
                </div>
              </el-tooltip>
            </div>
            <template v-slot="{row}">
              {{ row.lowItemTotal }}
            </template>
          </el-table-column>
          <el-table-column
            slot="right"
            width="120"
          >
            <div slot="header">
              不符合
              <el-tooltip
                effect="dark"
                popper-class="stepTips"
                placement="bottom"
              >
                <i class="iconfont iconquestion-circle" />
                <div
                  slot="content"
                >
                  标签数量&lt;1%与画像条件匹配
                </div>
              </el-tooltip>
            </div>
            <template v-slot="{row}">
              {{ row.noItemTotal }}
            </template>
          </el-table-column>
          <el-table-column
            slot="right"
            width="120"
          >
            <div slot="header">
              画像人员
            </div>
            <template v-slot="{row}">
              {{ row.operatorName }}
            </template>
          </el-table-column>
          <el-table-column
            slot="left"
            label="是否已开启查看"
            width="160"
          >
            <template v-slot="{row}">
              <etm-status
                v-if="(row.open && row.open !== '--')"
                type="primary"
              >
                已开启
              </etm-status>
              <etm-status
                v-else
                type="danger"
              >
                未开启
              </etm-status>
            </template>
          </el-table-column>
          <el-table-column
            slot="right"
            width="180"
            fixed="right"
            label="操作"
          >
            <template v-slot="{row}">
              <etm-text
                v-if="(row.open === '--' || !row.open)"
                type="primary"
                @click="readPortrayal(row)"
              >
                开启查看
              </etm-text>
              <etm-text
                v-if="(row.open === '--' || !row.open)"
                type="danger"
                @click="deletePortrayal(row)"
              >
                删除
              </etm-text>
            </template>
          </el-table-column>
        </etm-table-page>
      </div>
    </etm-layout-split>

    <batchImport ref="batchImport" />
    <etm-pop
      title="开启查看画像详情"
      :visible="readPop"
      cancel-btn="取消"
      confirm-btn="支付并开启"
      pop="complex"
      @cancel="close"
      @close="close"
      @confirm="confirm"
    >
      <div>
        <!--        <etm-field-label-->
        <!--          type="left"-->
        <!--          label="画像时间"-->
        <!--        >-->
        <!--          {{ currentPortrayal.no }}-->
        <!--        </etm-field-label>-->
        <etm-field-label
          type="left"
          label="画像标签设置"
        >
          <etm-text
            v-for="(item, index) in currentPortrayal.queryCondition"
            :key="index"
          >
            {{ item }}
          </etm-text>
        </etm-field-label>
        <el-row>
          <el-col :span="12">
            <etm-field-label
              type="left"
              label="高度符合"
            >
              {{ currentPortrayal.highItemTotal }}
            </etm-field-label>
          </el-col>
          <el-col :span="12">
            <etm-field-label
              type="left"
            >
              <div slot="label">
                消耗点数
                <el-tooltip
                  effect="dark"
                  popper-class="stepTips"
                  placement="right"
                >
                  <i class="iconfont iconquestion-circle" />
                  <div
                    slot="content"
                  >
                    高度画像数量X标签数X2
                  </div>
                </el-tooltip>
              </div>
              {{ hightPoint }}
            </etm-field-label>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <etm-field-label
              type="left"
              label="中度符合"
            >
              {{ currentPortrayal.middleItemTotal }}
            </etm-field-label>
          </el-col>
          <el-col :span="12">
            <etm-field-label
              type="left"
            >
              <div slot="label">
                消耗点数
                <el-tooltip
                  effect="dark"
                  popper-class="stepTips"
                  placement="right"
                >
                  <i class="iconfont iconquestion-circle" />
                  <div
                    slot="content"
                  >
                    中度画像数量X标签数X2
                  </div>
                </el-tooltip>
              </div>
              {{ middlePoint }}
            </etm-field-label>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <etm-field-label
              type="left"
              label="低度符合"
            >
              {{ currentPortrayal.lowItemTotal }}
            </etm-field-label>
          </el-col>
          <el-col :span="12">
            <etm-field-label
              type="left"
            >
              <div slot="label">
                消耗点数
                <el-tooltip
                  effect="dark"
                  popper-class="stepTips"
                  placement="right"
                >
                  <i class="iconfont iconquestion-circle" />
                  <div
                    slot="content"
                  >
                    低度画像数量X标签数X1
                  </div>
                </el-tooltip>
              </div>
              {{ lowPoint }}
            </etm-field-label>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <etm-field-label
              type="left"
              label="不符合"
            >
              {{ currentPortrayal.noItemTotal }}
            </etm-field-label>
          </el-col>
          <el-col :span="12">
            <etm-field-label
              type="left"
            >
              <div slot="label">
                消耗点数
                <el-tooltip
                  effect="dark"
                  popper-class="stepTips"
                  placement="right"
                >
                  <i class="iconfont iconquestion-circle" />
                  <div
                    slot="content"
                  >
                    不消耗点数
                  </div>
                </el-tooltip>
              </div>
              0
            </etm-field-label>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <etm-field-label
              type="left"
              label="画像人数"
            >
              {{ currentPortrayal.itemTotal }}
            </etm-field-label>
          </el-col>
          <el-col :span="12">
            <etm-field-label
              type="left"
            >
              <div slot="label">
                总计
                <el-tooltip
                  effect="dark"
                  popper-class="stepTips"
                  placement="right"
                >
                  <i class="iconfont iconquestion-circle" />
                  <div
                    slot="content"
                  >
                    总消耗点数和
                  </div>
                </el-tooltip>
              </div>
              <span class="totalPoint">{{ totalPoint }}</span>
            </etm-field-label>
          </el-col>
        </el-row>
        <el-row>
          <el-col
            :span="12"
          >
            <etm-field-label
              type="left"
              label="可用碰客点数"
            >
              <span style="padding-right: 16px;">
                {{ myPoint.remainNum }}
              </span> <etm-text @click="showPayPop = true">
                充值
              </etm-text>
            </etm-field-label>
          </el-col>
        </el-row>
      </div>
    </etm-pop>

    <!--    支付弹窗提示-->
    <pay-tip-pop
      :show-pay-pop.sync="showPayPop"
      :point="myPoint.remainNum"
      @success="getMyPoint"
    />
  </div>
</template>

<script>
import batchImport from '@/views/waitPortrayal/components/batchImport'
import barChart from '@/views/historyPortrayal/barChart'
import payTipPop from '@/views/aiCrash/crashPortrayal/components/payTipPop'
import {
  queryHistoryBatch,
  queryCustomerStatistics,
  queryPortraitTotal,
  createConsumePoint,
  removePortrait
} from '@/api/portrayal'
import {
  queryAICrashStatistics
} from '@/api/aiCrash'
import { parseTime } from '@/utils'
export default {
  name: 'WaitPortrayal',
  components: {
    batchImport,
    barChart,
    payTipPop
  },
  data () {
    return {
      myPoint: {
        remainNum: 0
      },
      showPayPop: false,
      currentPortrayal: {
        no: '',
        id: null,
        middleItemTotal: 0,
        lowItemTotal: 0,
        itemTotal: 0,
        highItemTotal: 0,
        noItemTotal: 0,
        operatorName: '',
        queryCondition: []
      },
      readPop: false,
      digit: [
        {
          digit: 0,
          text: '已开启查看批次'
        },
        {
          digit: 0,
          text: '未开启查看批次'
        },
        {
          digit: 0,
          text: '高度符合人数'
        }
      ],
      statistics: {
        xData: [],
        content: []
      },
      columns: [
        {
          label: '画像条件',
          prop: 'queryCondition',
          width: 180
        },
        {
          label: '画像人数',
          prop: 'itemTotal',
          width: 120
        }
      ],
      tableData: { content: [] },
      searchParams: [],
      tableParams: {
        pageSize: 10,
        pageNum: 1,
        paged: true
      }
    }
  },
  computed: {
    hightPoint () {
      return this.currentPortrayal.highItemTotal * this.currentPortrayal.queryCondition.length * 2
    },
    middlePoint () {
      return this.currentPortrayal.middleItemTotal * this.currentPortrayal.queryCondition.length * 2
    },
    lowPoint () {
      return this.currentPortrayal.lowItemTotal * this.currentPortrayal.queryCondition.length
    },
    totalPoint () {
      const low = this.currentPortrayal.lowItemTotal * this.currentPortrayal.queryCondition.length
      const height = this.currentPortrayal.highItemTotal * this.currentPortrayal.queryCondition.length * 2
      const middle = this.currentPortrayal.middleItemTotal * this.currentPortrayal.queryCondition.length * 2
      return middle + height + low
    }
  },
  watch: {
    readPop: {
      handler (n) {
        if (n) {
          this.getMyPoint()
        }
      }
    }
  },
  created () {
    queryPortraitTotal().then(res => {
      this.digit[0].digit = res.data.openTotal
      this.digit[1].digit = res.data.notOpenTotal
      this.digit[2].digit = res.data.highItemTotal
    })

    this.init()
  },
  methods: {
    getMyPoint () {
      queryAICrashStatistics().then(res => {
        this.myPoint = res.data
      })
    },
    deletePortrayal (row) {
      this.$etmTip.init({
        type: 'error',
        title: '是否要删除当前批次',
        content: '',
        confirmBtn: '确定',
        cancelBtn: '取消',
        confirm: () => {
          removePortrait(row.id).then(res => {
            this.$message.success('批次删除成功')
            this.init()
            this.$etmTip.close()
          })
        },
        cancel: () => {
          this.$etmTip.close()
        }
      })

      this.$etmTip.open()
    },
    readPortrayal (row) {
      this.currentPortrayal = {
        id: row.id,
        itemTotal: (!row.itemTotal || row.itemTotal === '--') ? 0 : row.itemTotal,
        highItemTotal: (!row.highItemTotal || row.highItemTotal === '--') ? 0 : row.highItemTotal,
        lowItemTotal: (!row.lowItemTotal || row.lowItemTotal === '--') ? 0 : row.lowItemTotal,
        noItemTotal: (!row.noItemTotal || row.noItemTotal === '--') ? 0 : row.noItemTotal,
        middleItemTotal: (!row.middleItemTotal || row.middleItemTotal === '--') ? 0 : row.middleItemTotal,
        createTime: row.createTime,
        queryCondition: (row.queryCondition && row.queryCondition !== '--') ? row.queryCondition.split(',') : [],
        // queryCondition: row.queryCondition ? [1] : [],
        no: row.no
      }
      this.readPop = true
    },
    close () {
      this.readPop = false
    },
    confirm () {
      if (this.myPoint.remainNum < this.totalPoint) {
        this.$message.warning('您的碰客点数不足，无法开启')
        return
      }
      createConsumePoint({ doTouchTotal: this.totalPoint, batchId: this.currentPortrayal.id }).then(res => {
        this.$message.success('支付成功')
        this.init()
        this.close()
      })
    },
    timeChange (e) {
      this.tableParams.pageNum = 1
      this.init()
    },
    init () {
      const params = {
        pageSize: this.tableParams.pageSize,
        pageNum: this.tableParams.pageNum,
        paged: this.tableParams.paged
      }

      if (this.searchParams && this.searchParams.length) {
        params.minCreateDate = this.searchParams[0] + ' 00:00:00'
        params.maxCreateDate = this.searchParams[1] + ' 23:59:59'
      }

      queryHistoryBatch(params).then(res => {
        const result = res.data || { content: [] }
        result.content = result.content.map(cur => {
          cur.createTime = parseTime(cur.createTime, '{y}-{m}-{d} {h}:{i}:{s}')

          return cur
        })
        this.tableData = result
      })

      queryCustomerStatistics(params).then(res => {
        // this.statistics = res.data

        const data = res.data
        const careChartData = {
          xData: [],
          content: [
            {
              color: '#5F97FF',
              data: [],
              title: '高度符合'
            },
            {
              color: '#FFA359',
              data: [],
              title: '中度符合'
            },
            {
              color: '#15C5EF',
              data: [],
              title: '低度符合'
            }
          ]
        }
        data.forEach(item => {
          careChartData.xData.push(item.date)
          careChartData.content[0].data.push(item.highItemTotal)
          careChartData.content[1].data.push(item.lowItemTotal)
          careChartData.content[2].data.push(item.middleItemTotal)
        })
        console.log(careChartData)
        this.statistics = careChartData
      })
    },
    currentChange (pageNum, pageSize) {
      this.tableParams.pageNum = pageNum
      this.tableParams.pageSize = pageSize

      this.init()
    },
    goto (row) {
      if (!row.open || row.open === '--') {
        this.$message.warning('本次扫描批次未开启详情查看')
        return
      }

      this.$router.push({ path: '/customer_detailsPortrayal', query: { batchId: row.id } })
    },
    delBatch (row) {
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
          this.$etmTip.close()
        }
      })
      this.$etmTip.open()
    }
  }
}
</script>

<style scoped lang="scss">
.iconquestion-circle{
  transform: translate(0, 1px);
  width: 20px;
}

.totalPoint{
  @include etm-color;
  font-size: 16px;
}

.waitPortrayal-wrap{

  ::v-deep{
    .iconquestion-circle{
      transform: translate(0, 1px);
        width: 20px;
    }
    .layout-header{
      .EtmTableToolBar-wrap{
        .el-form-item{
          margin-bottom: 0;
        }
      }
    }
  }
}
</style>
