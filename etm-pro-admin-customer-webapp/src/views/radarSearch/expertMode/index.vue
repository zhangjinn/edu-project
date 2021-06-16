<template>
  <div class="main-wrap">
    <etm-layout-split>
      <template slot="header">
        <!--        <div class="header-container">-->
        <!--          <div class="header-left">-->
        <!--            <div class="mode-btn">-->
        <!--              <div class="expert">-->
        <!--                AI探客专家模式-->
        <!--              </div>-->
        <!--              <div-->
        <!--                class="player"-->
        <!--                @click="changeToPlayerMode"-->
        <!--              >-->
        <!--                AI探客玩家模式-->
        <!--              </div>-->
        <!--            </div>-->
        <!--          </div>-->
        <!--          <div class="header-right">-->
        <!--            <i class="icon iconfont iconjiaoshichangsuoguanli" />-->
        <!--            <span>当前所在地：</span>-->
        <!--            <span>{{ organization }}</span>-->
        <!--          </div>-->
        <!--        </div>-->
        <div class="tab-box">
          <etm-tabs
            v-model="activeName"
          >
            <el-tab-pane
              label="AI探客专家模式"
              name="expertMode"
            >
              <div class="search-condition-container">
                <searchField
                  ref="searchFieldForm"
                  :city-code="cityCode"
                  @query="query"
                />
              </div>
            </el-tab-pane>

            <div
              slot="tool"
              class="header-right"
            >
              <i class="icon iconfont iconjiaoshichangsuoguanli" />
              <span>当前所在地：</span>
              <span>{{ organization }}</span>
            </div>
          </etm-tabs>
          <div
            class="player"
            @click="changeToPlayerMode"
          >
            AI探客玩家模式
          </div>
        </div>
      </template>
      <template slot="body">
        <etm-table-page
          :data="tableData"
          :columns="columns"
          :page-sizes="[10, 20, 50, 100, 200, 500, 1000]"
          @currentChange="currentChange"
        >
          <etm-table-tool-bar slot="tool">
            <div>
              <etm-table-digit :data="promoteData" />
            </div>
            <div
              slot="right"
              class="operation-container"
            >
              <el-select
                v-model="scanBatch"
                placeholder="请选择扫描批次"
                @change="changeScanBatch"
              >
                <el-option
                  v-for="item in scanBatchOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
              <!--              <el-button type="primary">-->
              <!--                5G消息群推-->
              <!--              </el-button>-->
              <el-button
                type="primary"
                @click="handleGroupMessage"
              >
                短信群推
              </el-button>
            </div>
          </etm-table-tool-bar>

          <el-table-column
            label="姓名"
            width="120"
            fixed
          >
            <template v-slot="scoped">
              <etm-text
                type="primary"
              >
                {{ scoped.row.customerName }}
              </etm-text>
            </template>
          </el-table-column>

          <el-table-column
            slot="right"
            label="画像"
          >
            <template v-slot="scoped">
              <div v-html="scoped.row.portrait" />
            </template>
          </el-table-column>

          <el-table-column
            slot="right"
            width="100"
          >
            <template
              slot="header"
            >
              <div class="status">
                状态
                <el-dropdown
                  v-if="tableData.content.length"
                  @command="handleCommand"
                >
                  <span class="el-dropdown-link">
                    <i class="icon iconfont iconxiala1" />
                  </span>
                  <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item
                      v-for="item in dropdownData"
                      :key="item.value"
                      :command="item.value"
                    >
                      {{ item.label }}
                    </el-dropdown-item>
                  </el-dropdown-menu>
                </el-dropdown>
              </div>
            </template>
            <template v-slot="scoped">
              <etm-status
                v-if="scoped.row.status==='COMMUNICATED'"
                type="active"
              >
                已推广
              </etm-status>
              <etm-status
                v-else
                type="inactive"
              >
                未推广
              </etm-status>
            </template>
          </el-table-column>

          <el-table-column
            slot="right"
            label="操作"
            width="200"
          >
            <template v-slot="scoped">
              <etm-text
                type="primary"
                @click="handleCallUp(scoped.row)"
              >
                打电话
              </etm-text>
              <etm-text
                type="primary"
                @click="handleMessage(scoped.row)"
              >
                发短信
              </etm-text>
              <!--              <etm-text-->
              <!--                type="primary"-->
              <!--              >-->
              <!--                发送5G消息-->
              <!--              </etm-text>-->
            </template>
          </el-table-column>
        </etm-table-page>
      </template>
    </etm-layout-split>

    <!--    打电话弹窗-->
    <callUp
      :show-pop-call-up.sync="showPopCallUp"
      :tag-list.sync="tagList"
      :result-customer-address-id="resultExploreCustomerId"
      :type="type"
      :demo="demo"
      :call-data="callData"
      :batch-id="batchId"
      @handleCallUp="scanCustomersStatus"
      @switchCallUp="switchCallUp"
    />

    <!--    发短信-->
    <send-message
      :show-pop-send-message.sync="showPopSendMessage"
      :group-message.sync="groupMessage"
      :explore-customer-list.sync="resultExploreCustomerIdList"
      :table-data="tableData.content"
      :batch-id="batchId"
      @handleConfirm="scanCustomersStatus"
    />
  </div>
</template>

<script>
import formValidate from '@/utils/rules'
import baseMixin from '@/layout/mixin/baseMixin'
import searchField from './searchField'
import callUp from '@/views/radarSearch/components/callUp'
import sendMessage from '@/views/radarSearch/components/sendMessage'
import {
  saveExploreCustomerBatch,
  queryExploreCustomerBatch,
  queryDataByBatch,
  queryCommunicatedTotalByBatch
} from '@/api/radarSearch'
import { getEnterpriseCurrent, queryAreaInfoByAreaId } from '@/api/base/base'

export default {
  name: 'Index',
  components: {
    searchField,
    callUp,
    sendMessage
  },
  mixins: [baseMixin],
  data () {
    return {
      activeName: 'expertMode',
      callData: {},
      batchId: 0,
      formValidate,
      organization: '',
      scanBatch: '',
      scanBatchOptions: [],

      // 推广数
      promoteData: [
        {
          digit: '--',
          text: '可推广数'
        },
        {
          digit: '--',
          text: '已推广数'
        }
      ],
      dropdownData: [
        {
          value: 'ALL',
          label: '全部'
        },
        {
          value: 'COMMUNICATED',
          label: '已推广'
        },
        {
          value: 'NOT_COMMUNICATED',
          label: '未推广'
        }
      ],

      // 表格数据
      tableData: {
        content: []
      },
      columns: [ // 表格的列表头传值
        {
          label: '电话',
          prop: 'telephone',
          width: '120'
        },
        {
          label: '性别',
          prop: 'gender',
          width: '60'
        },
        {
          label: '来源',
          prop: 'source',
          width: '120'
        }
      ],
      showPopRecharge: false,
      showPopCallUp: false,
      showPopSendMessage: false,
      groupMessage: false,
      tagList: [],
      resultExploreCustomerIdList: [],
      resultExploreCustomerId: 0,
      demo: false,
      type: 'AI',
      cityCode: null,
      communicateStatus: 'ALL'

    }
  },
  async created () {
    await this.getEnterpriseCurrentData()
    await this.queryExploreCustomerBatchData()
  },

  methods: {
    async getEnterpriseCurrentData () {
      let areaInfo = ''
      await getEnterpriseCurrent().then((res) => {
        areaInfo = res.data
      })
      await queryAreaInfoByAreaId({
        areaId: areaInfo.areaCode
      }).then((result) => {
        const { data } = result
        this.organization = data.provinceName + data.cityName + data.countyName
        this.cityCode = data.cityCode
      })
    },
    changeToPlayerMode () {
      this.$emit('handleChangeToPlayerMode')
    },

    resetSearch () {
      this.reset()
    },
    reset () {
      this.pageInfo.pageNum = 1
      this.queryDataByBatchData()
    },
    currentChange (pageNum, pageSize) {
      this.pageInfo = {
        pageNum,
        pageSize
      }
      this.queryDataByBatchData()
    },

    // 联系人状态改变时触发
    handleCommand (command) {
      this.communicateStatus = command
      this.reset()
    },

    async query (expertModeData) {
      const param = {
        address: this.organization,
        expertModeData: expertModeData
      }
      await saveExploreCustomerBatch(param).then((res) => {
        this.scanBatch = res.data.id
      })
      this.communicateStatus = 'ALL'
      await this.queryExploreCustomerBatchData()
      await this.queryCommunicatedTotalByBatchData()
      await this.queryDataByBatchData()
    },

    // 获取批次列表
    queryExploreCustomerBatchData () {
      queryExploreCustomerBatch().then((result) => {
        this.scanBatchOptions = this.convertDataToOptions(result.data, 'no', 'id')
        this.batchId = this.scanBatchOptions[0].id
      })
    },

    // 改变扫描批次
    changeScanBatch (val) {
      this.batchId = val
      this.queryCommunicatedTotalByBatchData()
      this.queryDataByBatchData()
    },

    // 获取批次AI探客已推广总数
    queryCommunicatedTotalByBatchData () {
      queryCommunicatedTotalByBatch({
        batchId: this.scanBatch
      }).then((res) => {
        this.promoteData[1].digit = res.data.communicatedTotal
      })
    },

    // 根据批次列表获取数据
    queryDataByBatchData () {
      const param = {
        batchId: this.scanBatch,
        communicateStatus: this.communicateStatus === 'ALL' ? null : this.communicateStatus,
        pageNum: this.pageInfo.pageNum,
        pageSize: this.pageInfo.pageSize,
        noLoadding: false
      }
      queryDataByBatch(param).then((res) => {
        const { data } = res
        this.tableData = data
        this.promoteData[0].digit = this.tableData.totalElements
        this.tableData.content = data.content.map((val) => {
          val.telephone = formatName(val.telephone)
          val.gender = val.gender === 'FEMALE' ? '女' : val.gender === 'MALE' ? '男' : '未知'
          val.portrait = val.portrait.replace(/\r\n/g, '<br>')
          return val
        })
      })

      function formatName (str) {
        return str.substr(0, 3) + new Array(str.length).join('*')
      }
    },

    // 打电话发短信会调
    scanCustomersStatus (status) {
      if (this.groupMessage && status && status !== 'COMMUNICATED') {
        // 是群发短信并且为未沟通状态
        this.tableData.content = this.tableData.content.map((val) => {
          val.status = 'COMMUNICATED'
          return val
        })
      } else {
        // 单个打电话或者单个发短信
        this.tableData.content = this.tableData.content.map((val) => {
          if (val.resultExploreCustomerId === this.resultExploreCustomerId) {
            val.status = 'COMMUNICATED'
          }
          return val
        })
      }
      this.queryCommunicatedTotalByBatchData()
    },
    // 打电话切换上/下一个客户
    switchCallUp (type, id) {
      let index = null
      this.tableData.content.find((item, ind) => {
        if (item.resultExploreCustomerId === id) index = ind
      })
      if (type === 'next') index++
      else index--
      if (index >= this.tableData.content.length) index = 0
      else if (index < 0) index = this.tableData.content.length - 1
      this.handleCallUp(this.tableData.content[index])
    },

    initTagList () {
      let formData = this.$refs.searchFieldForm.forms
      formData = formData.map((val) => {
        if (val.controlLabel) return val.controlLabel
      })
      return formData
    },

    handleCallUp (row) {
      this.callData = row
      this.resultExploreCustomerId = row.resultExploreCustomerId
      // this.demo = row.demo
      this.tagList = this.initTagList()
      this.groupMessage = false
      this.showPopCallUp = true
    },

    handleMessage (row) {
      this.resultExploreCustomerId = row.resultExploreCustomerId
      // this.demo = row.demo
      this.resultExploreCustomerIdList = [{ resultExploreCustomerId: row.resultExploreCustomerId, demo: row.demo, telephone: row.telephone }]
      this.groupMessage = false
      this.showPopSendMessage = true
    },

    handleGroupMessage () {
      this.groupMessage = true
      this.showPopSendMessage = true
    }

  }
}
</script>

<style scoped lang="scss">

.main-wrap{

  .tab-box{
    position: relative;

    .header-right{
      display: flex;
      justify-content: flex-end;
      align-items: center;
      font-size: 14px;
      color: #555555;
      font-weight: 500;

      i{
        display: flex;
        justify-content: center;
        align-items: center;
      }
    }

    .player{
      position: absolute;
      top: 1px;
      left: 120px;
      color: #222222;

      &:hover{
        @include etm-color();
        cursor: pointer;
      }
    }
  }

  .status{
    display: flex;
    align-items: center;

    i{
      display: flex;
      justify-content: center;
      align-items: center;
      cursor: pointer;
      color: #999;
    }
  }
}

</style>
