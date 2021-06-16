<template>
  <div class="radarSearch">
    <div class="left">
      <div class="l-header" />
      <div class="l-container">
        <div class="title">
          设置全网扫描条件
        </div>
        <div class="condition">
          <div class="condition-title">
            <i class="icon iconfont iconjuli" />
            <span>距离 {{ organization }}</span>
          </div>
          <div class="condition-content">
            <etm-screen-tab
              v-model="form.distance"
              :options="distanceOptions"
            />
          </div>
        </div>
        <div class="condition">
          <div class="condition-title">
            <i class="icon iconfont iconnianling" />
            <span>年龄</span>
          </div>
          <div class="condition-content">
            <etm-screen-tab
              v-model="form.parentsAge"
              :options="parentsAgeOptions"
            />
          </div>
        </div>
        <div class="condition">
          <div class="condition-title">
            <i class="icon iconfont iconxueli" />
            <span>学历</span>
          </div>
          <div class="condition-content">
            <etm-screen-tab
              v-model="form.parentsEducation"
              :options="parentsEducationOptions"
            />
          </div>
        </div>
        <div class="condition">
          <div class="condition-title">
            <i class="icon iconfont iconhaizinianling" />
            <span>学龄</span>
          </div>
          <div class="condition-content">
            <etm-screen-tab
              v-model="form.childAge"
              :options="childAgeOptions"
            />
          </div>
        </div>
        <div class="condition">
          <div class="condition-title">
            <i class="icon iconfont iconqita" />
            <span>其他</span>
          </div>
          <div class="condition-content">
            <el-form
              :model="form"
              type="dialog"
            >
              <el-form-item label="高频使用的APP类型">
                <el-select
                  v-model="form.appType"
                  placeholder="请选择"
                  popper-class="ai-popper"
                >
                  <el-option
                    v-for="item in appTypeOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </el-form-item>

              <el-form-item label="最常消费类型">
                <el-select
                  v-model="form.consumptionType"
                  placeholder="请选择"
                  popper-class="ai-popper"
                >
                  <el-option
                    v-for="item in consumptionTypeOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </el-form-item>
              <el-form-item label="飞行标签">
                <el-select
                  v-model="form.flightLabel"
                  placeholder="请选择"
                  popper-class="ai-popper"
                >
                  <el-option
                    v-for="item in flightLabelOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </el-form-item>
            </el-form>
          </div>
        </div>
      </div>
    </div>
    <div class="center">
      <div class="c-header">
        <div class="customer-statistics">
          <div
            class="expert-mode"
            @click="changeToAlbumMode"
          >
            专家模式
          </div>
        </div>
        <ul>
          <li>
            <div class="num">
              {{ statistical.today }}
            </div>
            <div class="date">
              今日已推广
            </div>
          </li>
          <li>
            <div class="num">
              {{ statistical.week }}
            </div>
            <div class="date">
              本周已推广
            </div>
          </li>
          <li>
            <div class="num">
              {{ statistical.month }}
            </div>
            <div class="date">
              本月已推广
            </div>
          </li>
        </ul>
      </div>
      <div class="c-content">
        <div class="earth-container">
          <earth :scan-status="scanStatus" />
          <div
            v-if="scanStatus==='scanning'"
            class="scan-status-button scan-status-button1"
          >
            <span>全网扫描中({{ timing }}s)...</span>
          </div>
          <div
            v-else-if="scanStatus==='scanned'"
            class="scan-status-button scan-status-button2"
          >
            <span>{{ scanStatusText.title }}</span>
            <span>{{ scanStatusText.desc }}</span>
          </div>
        </div>
        <div
          v-if="scanStatus==='scanning'"
          class="scan-button scan-button2"
        />
        <div
          v-else
          class="scan-button scan-button1"
          @click="queryCustomers()"
        />
      </div>
    </div>
    <div class="right">
      <div class="r-header" />
      <div class="r-content">
        <div class="batch-container">
          <el-form
            type="dialog"
          >
            <el-form-item label="扫描条件批次">
              <el-select
                v-model="scanBatch"
                placeholder="请选择扫描批次"
                popper-class="ai-popper"
                :disabled="scanStatus==='scanning'"
                @change="changeScanBatch"
              >
                <el-option
                  v-for="item in scanBatchOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
          </el-form>
        </div>
        <ul class="card-container">
          <li class="card-item">
            <div class="desc">
              可推广数
            </div>
            <div class="num yellow">
              {{ statistical.remanentContactable }}
            </div>
          </li>
          <li class="card-item">
            <div class="desc">
              已推广数
            </div>
            <div class="num yellow">
              {{ statistical.discoveredCustomers }}
            </div>
          </li>
        </ul>
        <div
          class="table-wrapper"
        >
          <el-table
            :data="tableData"
            max-height="600"
          >
            <el-table-column
              type="index"
              width="50"
            />
            <el-table-column
              label="姓名"
            >
              <template v-slot="scoped">
                {{ scoped.row.customerName }}
              </template>
            </el-table-column>

            <el-table-column>
              <template
                slot="header"
              >
                <div class="status">
                  状态
                  <el-dropdown
                    @command="handleCommand"
                  >
                    <span class="el-dropdown-link">
                      <i class="icon iconfont iconxiala1" />
                    </span>
                    <el-dropdown-menu
                      slot="dropdown"
                      class="ai-dropdown-menu"
                    >
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
              label="操作"
            >
              <template v-slot="scoped">
                <el-tooltip
                  class="item"
                  effect="dark"
                  content="打电话"
                  placement="bottom"
                >
                  <svg
                    class="icon"
                    aria-hidden="true"
                    @click="handleCallUp(scoped.row)"
                  >
                    <use xlink:href="#iconbodadianhua" />
                  </svg>
                </el-tooltip>
                <el-tooltip
                  class="item"
                  effect="dark"
                  content="发短信"
                  placement="bottom"
                >
                  <svg
                    class="icon"
                    aria-hidden="true"
                    @click="handleMessage(scoped.row)"
                  >
                    <use xlink:href="#iconfaduanxin4" />
                  </svg>
                </el-tooltip>
                <!--                <el-tooltip-->
                <!--                  class="item"-->
                <!--                  effect="dark"-->
                <!--                  content="发送5G消息"-->
                <!--                  placement="bottom"-->
                <!--                >-->
                <!--                  <svg-->
                <!--                    class="icon"-->
                <!--                    aria-hidden="true"-->
                <!--                  >-->
                <!--                    <use xlink:href="#icon5G" />-->
                <!--                  </svg>-->
                <!--                </el-tooltip>-->
              </template>
            </el-table-column>
          </el-table>

          <el-pagination
            :current-page.sync="pageInfo.pageNum"
            :page-sizes="[10, 20, 50, 100, 200, 500, 1000]"
            :page-size="pageInfo.pageSize"
            layout="sizes, prev, pager, next"
            :total="total"
            :hide-on-single-page="tableData.length<=0"
            popper-class="ai-popper"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
          />
        </div>
      </div>
    </div>

    <!--    拖拽按钮-->
    <buttonDrag @handleClick="handleGroupMessage" />

    <!--    支付 TODO:暂时不做-->
    <recharge
      :show-pop-recharge.sync="showPopRecharge"
      :type="type"
    />

    <!--    打电话弹窗-->
    <callUp
      :show-pop-call-up.sync="showPopCallUp"
      :tag-list.sync="tagList"
      :result-customer-address-id="resultExploreCustomerId"
      :type="type"
      :demo="demo"
      :batch-id="batchId"
      :call-data="callData"
      @handleCallUp="scanCustomersStatus"
      @switchCallUp="switchCallUp"
    />

    <!--    发短信-->
    <send-message
      :show-pop-send-message.sync="showPopSendMessage"
      :group-message.sync="groupMessage"
      :explore-customer-list.sync="resultExploreCustomerIdList"
      :table-data="tableData"
      :batch-id="batchId"
      @handleConfirm="scanCustomersStatus"
    />
  </div>
</template>

<script>
import baseMixin from '@/layout/mixin/baseMixin'
import recharge from '@/views/radarSearch/components/recharge/recharge'
import earth from '../components/earth'
import callUp from '@/views/radarSearch/components/callUp'
import sendMessage from '@/views/radarSearch/components/sendMessage'
import buttonDrag from '@/views/radarSearch/components/buttonDrag'
import {
  distanceOptions,
  parentsAgeOptions,
  parentsEducationOptions,
  childAgeOptions,
  appTypeOptions,
  consumptionTypeOptions,
  flightLabelOptions
} from '../data'
import {
  getEnterpriseCurrent,
  queryAreaInfoByAreaId
} from '@/api/base/base'
import {
  queryDataByBatch,
  queryStatistical,
  saveExploreCustomerBatch,
  queryExploreCustomerBatch,
  queryCommunicatedTotalByBatch
} from '@/api/radarSearch'
export default {
  name: 'Main',
  components: {
    recharge,
    earth,
    callUp,
    sendMessage,
    buttonDrag
  },
  mixins: [baseMixin],
  data () {
    return {
      callData: {},
      batchId: 0,
      organization: '',
      scanBatch: '',
      scanBatchOptions: [],
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
      tableData: [],
      columns: [],
      distanceOptions,
      parentsAgeOptions,
      parentsEducationOptions,
      childAgeOptions,
      appTypeOptions,
      consumptionTypeOptions,
      flightLabelOptions,
      provinceOptions: [],
      cityOptions: [],
      form: {
        distance: 'SAME_CITY',
        parentsAge: 'ALL',
        parentsEducation: 'ALL',
        childAge: 'ALL',
        appType: 'ALL',
        province: 'ALL',
        provinceName: '全部',
        city: 'ALL',
        cityName: '全部',
        consumptionType: 'ALL',
        flightLabel: 'ALL'
      },
      batchForm: {
        batch: ''
      },
      areaId: null,
      statistical: {
        today: 0,
        week: 0,
        month: 0,
        discoveredCustomers: 0,
        remanentContactable: 0
      },

      showPopRecharge: false,
      showPopCallUp: false,
      showPopSendMessage: false,
      groupMessage: false,
      tagList: [],
      initTagList: [],
      resultExploreCustomerIdList: [],
      resultExploreCustomerId: 0,
      demo: false,
      type: 'AI',
      clockTime: '',
      clearTimeSet: null,
      realTimeClData: null,
      timing: 0,
      scanStatus: 'init',
      scanStatusText: {
        title: '',
        desc: ''
      },
      pageInfo: {
        pageNum: 1,
        pageSize: 10
      },
      communicateStatus: 'ALL',
      total: 0

    }
  },

  async created () {
    await this.getEnterpriseCurrentData()
    await this.queryExploreCustomerBatchData()
    await this.queryStatisticalLists()
  },

  methods: {

    changeToAlbumMode () {
      this.$emit('handleChangeToAlbumMode')
    },

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
        this.form.province = data.provinceCode
        this.form.provinceName = data.provinceName
        this.form.city = data.cityCode
        this.form.cityName = data.cityName
        this.areaId = data.code
      })
    },

    provinceChange (provinceObj, provinces) {
      this.form.province = provinceObj.province
      this.form.provinceName = provinceObj.provinceName
      this.provinceOptions = provinces
    },

    cityChange (cityObj, citys) {
      this.form.city = cityObj.city
      this.form.cityName = cityObj.cityName
      this.cityOptions = citys
    },

    reset () {
      this.pageInfo.pageNum = 1
      this.scanCustomers()
    },

    handleSizeChange (val) {
      this.pageInfo.pageSize = val
      this.query()
    },

    handleCurrentChange (val) {
      this.pageInfo.pageNum = val
      this.query()
    },

    // 改变扫描批次
    changeScanBatch (val) {
      this.batchId = val
      this.scanCustomers()
    },

    // 联系人状态改变时触发
    handleCommand (command) {
      if (this.tableData.length <= 0) return
      this.communicateStatus = command
      this.pageInfo.pageNum = 1
      this.query()
    },

    // 用于分页和状态改变加载数据，无需延时加载
    query () {
      const param = {
        batchId: this.scanBatch,
        communicateStatus: this.communicateStatus === 'ALL' ? null : this.communicateStatus,
        pageNum: this.pageInfo.pageNum,
        pageSize: this.pageInfo.pageSize,
        noLoadding: false
      }
      queryDataByBatch(param).then((res) => {
        const { data } = res
        this.tableData = data.content
        this.total = data.totalElements
        this.statistical.remanentContactable = this.checkNum(data.totalElements)
        this.tableData.map((val) => {
          val.customerName = this.formatName(val.customerName)
          return val
        })
      })
    },

    // 获取批次列表
    queryExploreCustomerBatchData () {
      queryExploreCustomerBatch().then((result) => {
        this.scanBatchOptions = this.convertDataToOptions(result.data, 'no', 'id')
        this.batchId = this.scanBatchOptions[0].id
      })
    },

    // 点击扫描按钮必须先要保存批次，根据批次号进行加载数据
    async queryCustomers () {
      let address = null
      let province = null
      let city = null
      if (this.form.province !== 'ALL' && this.form.city !== 'ALL') {
        address = null
        province = this.form.provinceName
        city = this.form.cityName
      } else {
        address = this.organization
        province = null
        city = null
      }

      const playerModeData = {
        address: address,
        distance: this.form.distance === 'ALL' ? null : this.form.distance,
        province: province,
        city: city,
        childAge: this.form.childAge === 'ALL' ? null : this.form.childAge,
        parentsAge: this.form.parentsAge === 'ALL' ? null : this.form.parentsAge,
        childGender: null,
        parentsEducation: this.form.parentsEducation === 'ALL' ? null : this.form.parentsEducation,
        appType: this.form.appType === 'ALL' ? null : this.form.appType,
        consumption: this.form.consumptionType === 'ALL' ? null : this.form.consumptionType,
        flightTag: this.form.flightLabel === 'ALL' ? null : this.form.flightLabel,
        noLoadding: true
      }

      const param = {
        address: this.organization,
        playerModeData: playerModeData
      }

      await saveExploreCustomerBatch(param).then((res) => {
        this.scanBatch = res.data.id
      })
      await this.queryExploreCustomerBatchData()
      await this.reset()
    },

    // 用于点击扫描按钮和批次改变加载列表，需要延时加载
    scanCustomers () {
      const that = this
      this.communicateStatus = 'ALL'
      this.scanStatus = 'scanning'
      this.timing = 0
      this.realTimeClData = setInterval(() => {
        this.timing += 1
      }, 1000)
      const delayTimer = setTimeout(function () {
        const param = {
          batchId: that.scanBatch,
          communicateStatus: this.communicateStatus === 'ALL' ? null : this.communicateStatus,
          pageNum: that.pageInfo.pageNum,
          pageSize: that.pageInfo.pageSize,
          noLoadding: true
        }
        queryDataByBatch(param).then((res) => {
          const { data } = res
          that.tableData = data.content
          that.tableData.map((val) => {
            val.customerName = that.formatName(val.customerName)
            return val
          })
          that.total = data.totalElements
          that.scanStatus = 'scanned'
          that.scanStatusText.title = '扫描完成'
          that.scanStatusText.desc = `共获取${data.totalElements || 0}个客户`
          that.statistical.remanentContactable = that.checkNum(data.totalElements)

          clearInterval(that.realTimeClData)
          that.queryStatisticalLists('noLoadding')
          that.queryCommunicatedTotalByBatchData('noLoadding')
          that.filterTags()
          clearTimeout(delayTimer)
        }).catch(() => {
          that.scanStatusText.title = '扫描失败!'
          if (that.timing >= 30) {
            that.scanStatusText.title = '扫描超时!'
          }
          that.scanStatusText.desc = '请重新扫描'
          clearInterval(that.realTimeClData)
          that.scanStatus = 'scanned'
          clearTimeout(delayTimer)
        })
      }, 3000)
    },

    formatName (str) {
      return str.substr(0, 1) + new Array(str.length).join('*')
    },

    // 获取已推广数
    queryCommunicatedTotalByBatchData (type) {
      const param = {
        batchId: this.scanBatch
      }
      if (type && type === 'noLoadding') {
        param.noLoadding = true
      }
      queryCommunicatedTotalByBatch(param).then((res) => {
        this.statistical.discoveredCustomers = this.checkNum(res.data.communicatedTotal)
      })
    },

    // 获取今日、本周、本月统计
    queryStatisticalLists (type) {
      const param = {
        type: this.type
      }
      if (type && type === 'noLoadding') {
        param.noLoadding = true
      }
      queryStatistical(param).then((res) => {
        const { data } = res
        this.statistical.today = this.checkNum(data.today)
        this.statistical.week = this.checkNum(data.week)
        this.statistical.month = this.checkNum(data.month)
      })
    },

    checkNum (val) {
      if (val && val > 99999) {
        return '99999+'
      }
      return val
    },

    // 时钟
    setTime () {
      const that = this
      this.clearTimeSet = setInterval(() => {
        that.displayTime()
      }, 1000)
    },

    displayTime () {
      // 获取系统当前的年、月、日、小时、分钟、毫秒
      const date = new Date()
      const year = date.getFullYear()
      const month = date.getMonth() + 1
      const day = date.getDate()
      const hour = date.getHours()
      const minutes = date.getMinutes()
      const second = date.getSeconds()
      const timestr = year + '-' + month + '-' + day + '  ' + check(hour) +
        ':' + check(minutes) + ':' + check(second)
      this.clockTime = timestr

      function check (val) {
        if (val < 10) {
          return ('0' + val)
        } else {
          return (val)
        }
      }
    },

    filterTags () {
      const distanceTag = this.distanceOptions.filter(item => item.value === this.form.distance && this.form.distance !== 'ALL')
      const parentsAgeTag = this.parentsAgeOptions.filter(item => item.value === this.form.parentsAge && this.form.parentsAge !== 'ALL')
      const parentsEducationTag = this.parentsEducationOptions.filter(item => item.value === this.form.parentsEducation && this.form.parentsEducation !== 'ALL')
      const childAgeTag = this.childAgeOptions.filter(item => item.value === this.form.childAge && this.form.childAge !== 'ALL')
      const appTypeTag = this.appTypeOptions.filter(item => item.value === this.form.appType && this.form.appType !== 'ALL')
      const provinceTag = this.provinceOptions.filter(item => item.value === this.form.province && this.form.province !== 'ALL')
      const cityTag = this.cityOptions.filter(item => item.value === this.form.city && this.form.city !== 'ALL')
      const consumptionTypeTag = this.consumptionTypeOptions.filter(item => item.value === this.form.consumptionType && this.form.consumptionType !== 'ALL')
      const flightLabelTag = this.flightLabelOptions.filter(item => item.value === this.form.flightLabel && this.form.flightLabel !== 'ALL')

      const tagLists = [
        ...distanceTag,
        ...parentsAgeTag,
        ...parentsEducationTag,
        ...childAgeTag,
        ...appTypeTag,
        ...provinceTag,
        ...cityTag,
        ...consumptionTypeTag,
        ...flightLabelTag
      ]
      this.initTagList = tagLists.map(item => item.name || item.label)
    },

    // 打电话发短信会调
    scanCustomersStatus (status) {
      if (this.groupMessage && status && status !== 'COMMUNICATED') {
        // 是群发短信并且为未沟通状态
        this.tableData = this.tableData.map((val) => {
          val.status = 'COMMUNICATED'
          return val
        })
      } else {
        // 单个打电话或者单个发短信
        this.tableData = this.tableData.map((val) => {
          if (val.resultExploreCustomerId === this.resultExploreCustomerId) {
            val.status = 'COMMUNICATED'
          }
          return val
        })
      }
      this.queryStatisticalLists()
      this.queryCommunicatedTotalByBatchData()
    },
    // 打电话切换上/下一个客户
    switchCallUp (type, id) {
      let index = null
      this.tableData.find((item, ind) => {
        if (item.resultExploreCustomerId === id) index = ind
      })
      if (type === 'next') index++
      else index--
      if (index >= this.tableData.length) index = 0
      else if (index < 0) index = this.tableData.length - 1
      this.handleCallUp(this.tableData[index])
    },

    handleCallUp (row) {
      this.callData = row
      this.resultExploreCustomerId = row.resultExploreCustomerId
      this.demo = row.demo
      this.tagList = JSON.parse(JSON.stringify(this.initTagList))
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

.ai-dropdown-menu{
  background-color: #4B3C1D !important;
  border: 1px solid #6C5A34 !important;

  .el-dropdown-menu__item{
    font-size: 14px;
    font-weight: 400;
    color: #FFFFFF;

    &.hover, &:hover{
      background-color: rgba(#FFFFFF,0.2) !important;
    }

  }

  ::v-deep .popper__arrow{
    border-bottom-width: 0;
    border-bottom-color: #6C5A34 !important;

    &::after{
      border-bottom-width: 0;
      border-bottom-color: #6C5A34 !important;
    }
  }
}

.radarSearch{
  display: flex;
  width: 100%;
  min-width: 1336px;
  min-height: 550px;
  background-image: url('../../../assets/images/ai-bg.png');
  background-size: 100% 100%;
  border-radius: 4px;
  color: $white;
  padding-bottom: 54px;

  ::v-deep .el-pagination{
    padding: 0;

    .el-select .el-input{
      margin: 0;
    }

    li{
      background: #4B3C1D;
      color: $white;

      &.active{
        @include etm-color();
      }

      &:hover{
        @include etm-color();
      }
    }

    button{
      background: #4B3C1D;
      color: $white;
      min-width: 20px;
      padding: 0;

      &:disabled{
        background: #4B3C1D;
      }
    }

    .el-input__inner{
      background: #4B3C1D;
      border: 1px solid #6C5A34;
      border-radius: 2px;
      font-size: 14px;
      font-weight: 400;
      color: $white;
    }
  }

  &::v-deep .el-form{
    .el-form-item{
      display: flex;
    }

    .el-form-item__label{
      width: 145px;
      text-align: left;
      color: $white;
      font-weight: 400;
    }

    .el-form-item__content{
      flex: 1;
    }

    .el-select{
      width: 100%;
    }

    .el-input__inner{
      background: #4B3C1D;
      border: 1px solid #6C5A34;
      border-radius: 2px;
      font-size: 14px;
      font-weight: 400;
      color: $white;
    }

    .permanent-city{
      display: flex;

      .el-select{

        &:first-child {
          margin-right: 5px;
        }

        &:last-child {
          margin-left: 5px;
        }

      }
    }
  }

  .left{
    flex: 1;
    padding: 6px 0 0 10px;
    display: flex;
    flex-direction: column;

    .l-header{
      height: 25px;
      background-image: url('../../../assets/images/ai-l-header.png');
      background-repeat:no-repeat;
      background-size: auto 100%;
      background-position: right bottom;
      margin-right: -10px;
    }

    .l-container{
      flex: 1;
      padding: 17px;
      margin-top: 8px;
      margin-right: 15px;
      background: rgba(90, 90, 90, 0.16);
      border: 1px solid #FFD886;

      .title{
        height: 40px;
        line-height: 40px;
        background-image: url('../../../assets/images/ai-scan-condition.png');
        background-size: cover;
        padding-left: 14px;
        font-size: 16px;
        font-weight: bold;
      }

      .condition{

        .condition-title{
          height: 40px;
          line-height: 40px;
          font-size: 14px;
          font-weight: 400;
          border-bottom: 1px solid #6C5319;

          .icon{
            padding-top: 4px;
          }
        }
        .condition-content{
          padding-top: 16px;

          &::v-deep .EtmScreenTab-wrap{
            margin-bottom: 8px;
            li{
              background-color: rgba(#FFFFFF,0.2) !important;
              border-radius: 2px !important;
              border: 1px solid transparent;

              &:hover{
                color: $white !important;
                background-color: #9D7826 !important;
                border: 1px solid #FFBD34;
              }
            }

            .active {
              color: $white !important;
              background-color: #9D7826 !important;
              border: 1px solid #FFBD34;
            }
          }

        }
      }

    }
  }

  .center{
    //width: 560px;
    width: 456px;

    .c-header{
      height: 150px;
      background-image: url('../../../assets/images/ai-top-bg.png');
      background-repeat:no-repeat;
      background-size: 100% 100%;
      padding-top:8px;

      .customer-statistics{
        margin: 0 auto 8px;
        width: 230px;
        height: 40px;
        //-webkit-background-clip: text;
        //-webkit-text-fill-color: transparent;
        background-image: url('../../../assets/images/ai-mode.png');
        background-repeat:no-repeat;
        background-size: 100% 100%;
        display: flex;
        justify-content: flex-end;

        .expert-mode{
          width: 125px;
          line-height: 40px;
          font-size: 18px;
          font-weight: bold;
          text-align: center;
          color: #6A6A6A;
          cursor: pointer;

          &:hover{
            color: #CCCCCC;
          }
        }
      }

      ul{
        margin: 0 auto;
        width: 325px;
        display: flex;
        justify-content: space-between;

        li{
          text-align: center;
          color: #523F13;

          .num{
            display: flex;
            align-items: center;
            justify-content: center;
            width: 100px;
            height: 33px;
            background: linear-gradient(0deg, #E5A516, #F1C563);
            border-radius: 2px;
            font-size: 26px;
            font-weight: bold;
            margin-bottom: 8px;
            font-family: DIN;
          }

          .date{
            font-size: 14px;
            font-weight: 400;
          }

        }
      }
    }

    .c-content{
      display: flex;
      flex-direction: column;
      justify-content: flex-start;
      align-items: center;

      .earth-container{
        position: relative;

        .scan-status-button{
          position: absolute;
          top: 0;
          right: 0;
          bottom: 0;
          left: 0;
          margin: auto;
          z-index: 9;
          font-size: 16px;
          font-weight: bold;
        }

        .scan-status-button1{
          width: 234px;
          height: 67px;
          padding-top: 10px;
          text-align: center;
          background-image: url('../../../assets/images/ai-scanning.png');
          background-repeat:no-repeat;
          background-size: 100% 100%;
        }

        .scan-status-button2{
          width: 234px;
          height: 107px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: flex-start;
          padding-top: 20px;
          background-image: url('../../../assets/images/ai-scanned.png');
          background-repeat:no-repeat;
          background-size: 100% 100%;
        }

      }

      .scan-button{
        width: 234px;
        height: 67px;
      }

      .scan-button1{
        background-image: url('../../../assets/images/ai-scan-btn.png');
        background-repeat:no-repeat;
        background-size: 100% 100%;
        cursor: pointer;

        &:hover{
          background-image: url('../../../assets/images/ai-scan-btn-hover.png');
        }
      }

      .scan-button2{
        background-image: url('../../../assets/images/ai-scanning-btn.png');
        background-repeat:no-repeat;
        background-size: 100% 100%;
      }
    }

  }

  .right{
    flex: 1;
    display: flex;
    flex-direction: column;
    min-width: 530px;
    padding: 6px 10px 0 0;

     .table-wrapper{

       ::v-deep .el-table{
        width: 100%;
        border: none;
        background-color: transparent;
         margin-bottom: 16px;

        &::before{
          height: 0;
          background-color: transparent;
        }

        &::after{
          width: 0;
        }

         .el-table__body-wrapper::-webkit-scrollbar-thumb {
           background: #525252;
           border-radius: 4px;
         }

        tbody tr:hover>td {
          background-color:rgba(#353535, .3) !important;
        }

        .el-table__expanded-cell {
          background: transparent;
        }

        th, tr {
          font-size: 14px;
          font-weight: 700;
          color: #FFFFFF;
          background: rgba(#353535, .3);
        }

         th {
          height: 40px;
          padding: 0;
          background: #312E27 !important;
        }

          tr{
            background: #353535;

            td{
              height: 46px;
              padding: 0;
            }

            td:first-child .cell{
              text-align: center;
            }

          }

         td {
           background: transparent;
          .cell {
            padding: 4px !important;

            .EtmStatus-wrap{

              .EtmStatus--text{
                color: $white;
              }

              .EtmStatus--active {
                background-color: #FF869A;
              }

              .EtmStatus--inactive {
                background-color: $white;
              }
            }

            .icon{
              cursor: pointer;

              &:first-child{
                width: 25px;
                height: 25px;
              }

              &:not(:first-child){
                margin-left: 16px;
              }

            }
          }
        }

         tr:nth-child(2n-1) {
          background: transparent!important;
        }

         td, th.is-leaf {
          border: none;
        }

        .el-table__empty-text {
          color: $white;
        }
      }

      .status{
        display: flex;
        align-items: center;

        i{
          display: flex;
          justify-content: center;
          align-items: center;
          color: $white;
        }
      }

    }

    .r-header{
      height: 25px;
      padding-right: 20px;
      display: flex;
      justify-content: flex-end;
      align-items: center;
      background-image: url('../../../assets/images/ai-r-header.png');
      background-repeat:no-repeat;
      background-size: auto 100%;
      background-position: left bottom;
      margin-left: -10px;
      font-size: 12px;
      font-weight: 400;

      .icon{
        padding-top: 3px;
        font-size: 14px;
      }
    }

    .r-content{
      flex: 1;
      display: flex;
      flex-direction: column;
      padding: 17px;
      margin-top: 8px;
      margin-left: 15px;
      background: rgba(90, 90, 90, 0.16);
      border: 1px solid #FFD886;

      ::v-deep .el-form-item{
        margin-bottom: 8px;
      }

      .card-container{
        display: flex;
        justify-content: space-around;
        width: 100%;
        margin-bottom: 8px;

        .card-item{
          flex: 1;
          height: 81px;
          background-image: url('../../../assets/images/ai-r-card.png');
          background-repeat: no-repeat;
          background-size: 100% 100%;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          padding-top: 10px;

          &:first-child{
            margin-right: 4px;
          }

          &:last-child{
            margin-left: 4px;
          }

          .icon{
            display: inline-block;
            width: 22px;
            height: 14px;
            line-height: 14px;
            font-size: 10px;
            color: #FFC548;
            cursor: pointer;
          }

          .desc{
            font-size: 16px;
            font-weight: 400;
          }

          .num{
            font-size: 24px;
            font-family: DIN;
            font-weight: bold;
          }

          .yellow{
            color: #FFBE31;
          }

          .red{
            color: #FF869A;
          }

          .green{
            color: #23F477;
          }
        }
      }

    }
  }

}
</style>
