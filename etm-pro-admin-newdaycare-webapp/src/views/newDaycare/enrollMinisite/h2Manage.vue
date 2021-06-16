<template>
  <div class="h2Manage-wrap">
    <etm-main-body>
      <etm-layout-split :body-styles="activeName === '活动管理'? {'background-color': 'transparent','padding': '0'} : {}">
        <div slot="header">
          <etm-tabs
            v-model="activeName"
            :show-toggle="false"
            @tab-click="handleTabChange"
          >
            <el-tab-pane
              label="活动管理"
              name="活动管理"
            />
            <el-tab-pane
              label="中奖名单"
              name="中奖名单"
            />
            <el-tab-pane
              label="表单数据"
              name="表单数据"
            />
          </etm-tabs>
        </div>
        <div slot="body">
          <div
            v-if="activeName === '活动管理'"
            style="overflow: hidden;"
          >
            <div class="detail">
              <img
                :src="item.cover"
                alt="活动封面"
              >
              <div class="info">
                <p><strong>{{ item.name }}</strong></p>
                <p :class="'status-' + item.status">
                  {{ getStatus(item.status ) }}
                </p>
                <p>剩余奖品总数：<span class="surplusPrizes">{{ manageData.surplusPrizes }}</span></p>
                <p>活动时间 <strong>{{ manageData.startTime }} 至 {{ manageData.endTime }}</strong></p>
              </div>
              <div class="qr">
                <!--                <vue-qr :text="item.url" :callback="fun" />-->
                <vue-qr :text="item.url" />
                <div class="tips">
                  微信扫码进入活动
                </div>
              </div>
            </div>
            <el-row :gutter="16">
              <el-col :span="6">
                <div class="analysis-col">
                  <p>
                    累计访问次数
                    <el-tooltip
                      class="comTooltip"
                      effect="dark"
                      placement="top"
                    >
                      <div slot="content">
                        打开活动链接的次数，同一<br>访客多次访问次数累计。
                      </div>
                      <!--                      <i class="iconfont iconquestion-circle" />-->
                      <i class="el-icon-question" />
                    </el-tooltip>
                  </p>
                  <p class="count">
                    <strong>{{ manageData.totalPv }}</strong>
                  </p>
                </div>
              </el-col>
              <el-col :span="6">
                <div class="analysis-col">
                  <p>
                    累计访问人数
                    <el-tooltip
                      class="comTooltip"
                      effect="dark"
                      placement="top"
                    >
                      <div slot="content">
                        打开活动链接的访客数，同<br>一访客多次访问只计算一<br>次。
                      </div>
                      <!--                      <i class="iconfont iconquestion-circle" />-->
                      <i class="el-icon-question" />
                    </el-tooltip>
                  </p>
                  <p class="count">
                    <strong>{{ manageData.totalUv }}</strong>
                  </p>
                </div>
              </el-col>
              <el-col :span="6">
                <div class="analysis-col">
                  <p>
                    抽奖参与人次
                    <el-tooltip
                      class="comTooltip"
                      effect="dark"
                      placement="top"
                    >
                      <div slot="content">
                        抽奖的累计参与次数，同一<br>用户多次参与，抽奖人次不<br>去重。
                      </div>
                      <!--                      <i class="iconfont iconquestion-circle" />-->
                      <i class="el-icon-question" />
                    </el-tooltip>
                  </p>
                  <p class="count">
                    <strong>{{ manageData.participantsNum }}</strong>
                  </p>
                </div>
              </el-col>
              <el-col :span="6">
                <div class="analysis-col">
                  <p>
                    发放奖品总数
                    <el-tooltip
                      class="comTooltip"
                      effect="dark"
                      placement="top"
                    >
                      <div slot="content">
                        活动累计发出的奖品总数。
                      </div>
                      <!--                      <i class="iconfont iconquestion-circle" />-->
                      <i class="el-icon-question" />
                    </el-tooltip>
                  </p>
                  <p class="count">
                    <strong>{{ manageData.sendPrizes }}</strong>
                  </p>
                </div>
              </el-col>
            </el-row>
          </div>
          <etm-table-page
            v-else
            :data="tableData"
            @currentChange="handleCurrentChange"
            @size-change="handleSizeChange"
            @selection-change="handleSelectionChange"
          >
            <etm-table-tool-bar
              v-if="activeName === '中奖名单'"
              slot="tool"
            >
              <el-button
                slot="right"
                plain
                @click.stop="handleExportExcel"
              >
                导出Excel
              </el-button>
            </etm-table-tool-bar>
            <template v-if="activeName === '中奖名单'">
              <el-table-column
                label="中奖用户"
                prop="nickname"
              />
              <el-table-column
                label="中奖码"
                prop="winCode"
              />
              <el-table-column
                label="电子兑奖码"
                prop="eCode"
              />
              <el-table-column
                label="奖项等级"
                prop="prizeLevelName"
              />
              <el-table-column
                label="奖品"
                prop="prizeName"
              />
              <el-table-column
                label="红包额度"
                prop="redPackageAmount"
              />
              <el-table-column
                label="中奖时间"
                prop="winTime"
              />
              <el-table-column
                label="兑奖状态"
                prop="status"
              />
            </template>
            <template v-else>
              <el-table-column
                v-for="(it,i) in tableHeader"
                :key="i"
                :label="it"
              >
                <template v-slot="scoped">
                  <img
                    v-if="obj[i] === 'image'"
                    :src="scoped.row[i]"
                  >
                  <p v-else>
                    {{ scoped.row[i] }}
                  </p>
                </template>
              </el-table-column>
            </template>
          </etm-table-page>
        </div>
      </etm-layout-split>
    </etm-main-body>
  </div>
</template>

<script>
// import baseMixin from '@/layout/mixin/baseMixin'
import {
  queryForm,
  queryResourceInfo,
  queryRewardList,
  // exportRewardExcel,
  queryRewardData
} from '@/api/newDaycare/eqx'
import { downloadFile } from '@/api/base/base'
import vueQr from 'vue-qr'
import { downloadFileForUrl } from '@/utils/file'

export default {
  name: 'H2Mange',
  components: {
    vueQr
  },
  filters: {
    filterDate (v) {
      return v
    }
  },
  // mixins: [baseMixin],
  data () {
    return {
      id: '',
      item: {
        url: 'hello'
      },
      manageData: {},
      editType: '',
      activeName: '活动管理',
      // formData: [
      //   // {
      //   //   label: '活动名称',
      //   //   type: 'input',
      //   //   prop: 'name',
      //   //   value: null,
      //   //   props: {
      //   //     placeholder: '请输入活动名称'
      //   //   }
      //   // }
      // ],
      pageInfo: {
        count: 1,
        pageSize: 10,
        pageNo: 1
      },
      obj: [],
      tableHeader: [],
      tableData: {
        pageNum: 1,
        pageSize: 10,
        content: []
      },
      multipleSelection: []
    }
  },
  watch: {
    $route: {
      handler: function (val) {
        // console.log(val)
        if (val.name === 'h2Manage') {
          this.enter()
        }
      },
      // 深度观察监听
      deep: true
    }
  },
  created () {
  },
  mounted () {
    this.enter()
  },
  methods: {
    enter () {
      this.id = this.$route.query.id
      this.editType = this.$route.query.editType
      // this.startTime = this.$route.query.startTime
      // this.endTime = this.$route.query.endTime
      // this.pv = this.$route.query.pv
      // this.uv = this.$route.query.uv
      // this.fpv = this.$route.query.spv
      // this.spv = this.$route.query.spv
      this.activeName = this.$route.query.activeName || '活动管理'
      this.init()
    },
    init () {
      this.tableData.content = []
      switch (this.activeName) {
        case '活动管理':
          queryResourceInfo({
            editType: this.editType,
            id: this.id
          }).then(res => {
            // console.log('info', res)
            this.$nextTick(() => {
              this.item = res.data || {}
            })
          })
          queryRewardData({
            id: this.id
          }).then(res => {
            // console.log('info', res)
            this.manageData = res.data
          })

          break
        case '中奖名单':
          // this.handleQueryForm(queryRewardList)
          queryRewardList({
            id: this.id,
            ...this.pageInfo
          }).then(res => {
            this.tableData.content = res.data.reward || []
            this.pageInfo = res.data.page
            this.tableData.pageNum = res.data.page.pageNo
            this.tableData.pageSize = res.data.page.pageSize
            this.tableData.totalElements = res.data.page.count
          })
          break
        case '表单数据':
          queryForm({
            editType: this.editType,
            id: this.id,
            ...this.pageInfo
          }).then(res => {
            if (res.data.content.length > 1) {
              let idx = null
              if (res.data.content[0].include('ID')) {
                idx = res.data.content[0].findIndex(v => v === 'ID')
                this.tableHeader = res.data.content[0].filter(v => v !== 'ID')
              }
              this.tableData.content = res.data.content.filter((v, i) => i !== 0).map(v => {
                const item = {}
                v.forEach((it, index) => {
                  if (idx !== null && idx === index) return true
                  item[index] = it
                })
                return item
              })
            } else {
              this.tableData.content = []
            }
            if (res.data.pageInfo) {
              this.pageInfo = res.data.page
              this.tableData.pageNum = res.data.page.pageNo
              this.tableData.pageSize = res.data.page.pageSize
              this.tableData.totalElements = res.data.page.count
            }
            if (res.data.obj && res.data.obj.length) this.obj = res.data.obj.filter(v => v !== 'id')
          })
          break
      }
    },
    handleTabChange () {
      this.handleReset()
    },
    handleSearch () {
      this.pageInfo.pageNo = 1
      this.init()
    },
    handleReset () {
      this.pageInfo.pageNo = 1
      this.pageInfo.pageSize = 10
      this.init()
    },
    handleCurrentChange (val) {
      this.pageInfo.pageNo = val
      this.init()
    },
    handleSizeChange (val) {
      this.pageInfo.pageNo = 1
      this.pageInfo.pageSize = val
      this.init()
    },
    handleSelectionChange (v) {
      this.multipleSelection = v
    },
    getStatus (status) {
      if (status !== null || status !== undefined) {
        return ['活动未开始', '活动暂停', '活动开始', '活动结束', '活动状态未知'][status]
      } else return ''
    },
    handleExportExcel () {
      if (this.activeName === '中奖名单') {
        downloadFile({ method: 'get', url: '/newdaycare/eqx/resource/rewardExcel', params: { id: this.id } }).then(res => {
          downloadFileForUrl(res)
        })
      }
    }
    // fun(url) {
    //   console.log('url: ', url)
    // }
  }
}
</script>
<style lang="scss" scoped>
.h2Manage-wrap {
  .detail {
    align-items: center;
    background: #fff;
    border-radius: 4px;
    box-sizing: border-box;
    display: flex;
    flex-direction: row;
    margin-bottom: 16px;
    padding: 16px;
    position: relative;
    //height: 100%;
    .info {
      display: flex;
      flex: 0 0 80%;
      flex-direction: column;
      height: 120px;
      justify-content: space-around;
      margin-left: 16px;

      p:first-child {
        strong {
          font-size: 16px;
        }
      }

      .status-0 {
        @include c_text_color();
      }

      .status-1 {
        @include c_error_color(); }

      .status-2 {
        @include etm-color();
      }

      .status-3 {
        @include c_error_color(); }

      .status-4 {
        @include c_text_color();
      }

      .surplusPrizes {
        @include c_error_color(); }
    }

    img {
      height: 120px;
      width: 120px;
    }

    .qr {
      align-items: center;
      display: flex;
      flex-direction: column;
      justify-content: center;
      position: absolute;
      right: 16px;

      &::after {
        content: '';
        height: 100%;
        width: 100%;
      }

      img {
        height: 110px;
        width: 110px;
      }

      .tips {
        font-size: 12px;
        text-align: center;
      }
    }
  }

  .analysis-col {
    align-items: center;
    background: #fff;
    border-radius: 4px;
    display: flex;
    flex-direction: column;
    height: 178px;
    justify-content: center;
    margin-bottom: 16px;

    .count {
      strong {
        @include etm-color();
        font-size: 30px;
      }
    }
  }
}
</style>
