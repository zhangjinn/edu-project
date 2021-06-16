<template>
  <div class="index-wrap">
    <etm-main-body>
      <etm-layout-split>
        <div slot="header">
          <etm-tabs>
            <el-tab-pane label="线上收款记录">
              <etm-tool-bar
                v-model="formData"
                @search="handleSearch"
              />
            </el-tab-pane>
          </etm-tabs>
        </div>
        <div slot="body">
          <etm-table-page
            :columns="columns"
            :data="tableData"
            border
            @currentChange="currentChange"
          >
            <etm-table-tool-bar slot="tool">
              <div slot="right">
                <el-button
                  slot="right"
                  type="plain"
                  @click="exportExcel"
                >
                  导出Excel
                </el-button>
              </div>
            </etm-table-tool-bar>
            <el-table-column
              slot="right"
              fixed="right"
              label="关联订单号"
            >
              <template v-slot="{row}">
                <etm-text @click="orderList(row)">
                  {{ row.orderNumber }}
                </etm-text>
              </template>
            </el-table-column>
            <el-table-column
              slot="right"
              fixed="right"
              label="操作"
              width="180"
            >
              <template v-slot="{row}">
                <el-dropdown
                  v-if="!row.relevanceState"
                  :hide-on-click="false"
                >
                  <etm-text type="primary">
                    关联
                    <!--                    <i class="el-icon-arrow-down el-icon&#45;&#45;right" />-->
                  </etm-text>
                  <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item @click.native="toDeposit(row)">
                      订金
                    </el-dropdown-item>
                    <el-dropdown-item @click.native="toTeach(row)">
                      早教订单
                    </el-dropdown-item>
                    <el-dropdown-item @click.native="toCare(row)">
                      托育订单
                    </el-dropdown-item>
                  </el-dropdown-menu>
                </el-dropdown>
                <etm-text
                  v-else
                  @click="unLink(row.collectionRecordId)"
                >
                  取消关联
                </etm-text>
              </template>
            </el-table-column>
          </etm-table-page>
        </div>
      </etm-layout-split>
    </etm-main-body>
    <etm-pop
      :visible="showPop"
      pop="big"
      :title="popTitle"
      confirm-btn="确定"
      cancel-btn="取消"
      :show-confirm-btn="false"
      :show-cancel-btn="false"
      @open="showPop = true"
      @close="closeShow"
    >
      <tabs
        v-if="popTitle==='关联订金'"
        :collection-record-id="collectionRecordId"
        @update="updateLink"
      />
      <teach
        v-if="popTitle==='关联早教订单'"
        :collection-record-id="collectionRecordId"
        @update="updateLink"
      />
      <care
        v-if="popTitle==='关联托育订单'"
        :collection-record-id="collectionRecordId"
        @update="updateLink"
      />
    </etm-pop>
    <etm-drawer
      :visible.sync="showSide"
      :type="BigType"
    >
      <component
        :is="popComponent[popType]"
        v-if="showSide"
        ref="component"
        :prop="prop"
        :deal-type="dealType"
      />
    </etm-drawer>
  </div>
</template>

<script>
/**
 * index create by Administrator
 * createTime 2021/3/9/009 17:27
 */
import baseMixin from '@/layout/mixin/baseMixin'
import tabs from './components/tabs'
import teach from './components/teach'
import care from './components/care'
// import chargeDetailText from '@/views/newDaycare/contract/teachContract/components/chargeDetailText'
// import chargeDetailEdit from '@/views/newDaycare/contract/teachContract/components/chargeDetailEdit'
import orderList from './components/orderList'
import contract from './components/contract'
import { queryRecord, updateRecord, queryStream } from '@/api/newDaycare/collectionRecord'
import { parseTime } from '@/utils'
import { downloadFileForUrl } from '@/utils/file'
export default {
  name: 'Index',
  components: { tabs, teach, orderList, care },
  filters: {},
  mixins: [baseMixin],
  props: {},
  data () {
    return {
      // components: {
      //   orderList: orderList
      // },
      prop: {},
      popComponent: {
        orderList: orderList,
        contract: contract
      },
      showPop: false,
      showSide: false,
      teachCare: false,
      popTitle: '',
      BigType: 'small',
      popType: '',
      formData: [
        {
          label: '关联订单号',
          type: 'input',
          prop: 'orderNumber',
          value: '',
          props: {
            placeholder: '请输入关联订单号'
          }
        },
        {
          label: '支付时间',
          type: 'date',
          prop: 'time',
          value: null,
          props: {
            type: 'daterange',
            startPlaceholder: '年/月/日',
            endPlaceholder: '年/月/日'
          }
        },
        {
          label: '商家订单号',
          type: 'input',
          prop: 'businessOrderNumber',
          value: '',
          props: {
            placeholder: '请输入商家订单号'
          }
        }
      ],
      tableData: {
        // content: [
        //   { name: '12', guanlian: 212155 }
        // ]
      },
      columns: [
        {
          label: '商家订单号',
          prop: 'businessOrderNumber'
        },
        {
          label: '金额',
          prop: 'amount'
        },
        {
          label: '支付方式',
          prop: 'cost'
        },
        {
          label: '支付时间',
          prop: 'payTiem'
        }
      ],
      collectionRecordId: null,
      dealType: null
    }
  },
  computed: {},
  watch: {},
  created () {
  },
  mounted () {
    this.init()
  },
  methods: {
    init () {
      const orderNumber = this.getObjectByProp('orderNumber', this.formData).value
      const businessOrderNumber = this.getObjectByProp('businessOrderNumber', this.formData).value
      const time = this.getObjectByProp('time', this.formData).value
      queryRecord({
        orderNumber,
        businessOrderNumber,
        startDate: (time && (time[0] + ' 00:00:00')) || null,
        endDate: (time && (time[1] + ' 23:59:59')) || null,
        pageNum: this.pageInfo.pageNum,
        pageSize: this.pageInfo.pageSize
      }).then(res => {
        res.data.content.forEach(v => {
          v.payTiem = parseTime(v.payTiem, '{y}-{m}-{d} {h}:{i}:{s}')
          v.cost = v.payType.name
        })
        // console.log(res.data)
        this.tableData = res.data
      })
    },
    handleSearch () {
      this.pageInfo.pageNum = 1
      this.init()
    },
    currentChange (pageNum, pageSize) {
      this.pageInfo = {
        pageNum, pageSize
      }
      this.init()
    },
    exportExcel () {
      const orderNumber = this.getObjectByProp('orderNumber', this.formData).value
      const businessOrderNumber = this.getObjectByProp('businessOrderNumber', this.formData).value
      const time = this.getObjectByProp('time', this.formData).value
      queryStream({
        orderNumber,
        businessOrderNumber,
        startDate: (time && (time[0] + ' 00:00:00')) || null,
        endDate: (time && (time[1] + ' 23:59:59')) || null,
        pageNum: this.pageInfo.pageNum,
        pageSize: this.pageInfo.pageSize
      }).then(res => {
        downloadFileForUrl(res)
      })
    },
    toDeposit (row) {
      this.collectionRecordId = row.collectionRecordId
      // console.log(this.collectionRecordId)
      this.showPop = true
      this.popTitle = '关联订金'
    },
    toTeach (row) {
      this.collectionRecordId = row.collectionRecordId
      this.showPop = true
      this.teachCare = true
      this.popTitle = '关联早教订单'
    },
    toCare (row) {
      this.collectionRecordId = row.collectionRecordId
      this.showPop = true
      this.teachCare = true
      this.popTitle = '关联托育订单'
    },
    closeShow () {
      this.showPop = false
      this.teachCare = false
    },
    orderList (row) {
      if (row.relevanceState) {
        this.prop.id = row.orderId
        if (row.collectionType === 'DEPOSIT') {
          this.BigType = 'small'
          this.popType = 'orderList'
        } else if (row.collectionType === 'CARE_ORDER') {
          this.BigType = 'big'
          this.dealType = 'care'
          this.popType = 'contract'
        } else if (row.collectionType === 'TEACH_ORDER') {
          this.BigType = 'big'
          this.dealType = 'teach'
          this.popType = 'contract'
        }
        this.showSide = true
      }
    },
    unLink (collectionRecordId) {
      // console.log(collectionRecordId)
      updateRecord({ collectionRecordId }).then(() => {
        this.$message.success('操作成功')
        this.init()
      })
    },
    updateLink () {
      this.init()
      this.showPop = false
    }
  }
}
</script>
<style lang="scss" scoped>
</style>
