<template>
  <div class="index-wrap">
    <etm-main-body>
      <etm-layout-split>
        <div slot="header">
          <etm-tabs
            ref="tabs"
            v-model="activeName"
          >
            <el-tab-pane
              v-if="hasAuth('newdaycare.videoOrderCare.queryBatch', 'tabs', 'activeName')"
              label="托育订单"
              name="cloudVideoOrders"
            >
              <etm-tool-bar
                v-model="formData"
                @search="handleSearch"
                @reset="handleReset"
              />
            </el-tab-pane>
            <el-tab-pane
              v-if="hasAuth('newdaycare.videoOrderGuard.queryBatch', 'tabs', 'activeName')"
              label="幼儿园订单"
              name="cloudOrder"
            >
              <etm-tool-bar
                v-model="formData2"
                @search="search"
                @reset="reset"
              />
            </el-tab-pane>
          </etm-tabs>
        </div>
        <div slot="body">
          <etm-table-page
            v-if="activeName === 'cloudVideoOrders'"
            :columns="columns"
            :data="tableData"
            index
            selection
            label="序号"
            @currentChange="currentChange"
          >
            <etm-table-tool-bar slot="tool">
              <div slot="right">
                <el-button
                  plain
                  @click="exportExcel"
                >
                  导出Excel
                </el-button>
              </div>
            </etm-table-tool-bar>
            <el-table-column
              prop="orderNo"
              label="订单编号"
              width="200"
              :fixed="true"
            >
              <template slot-scope="scope">
                <etm-text
                  type="primary"
                  @click="clickOrder(scope.row.cameraOrderId)"
                >
                  {{ scope.row.orderNo }}
                </etm-text>
              </template>
            </el-table-column>
          </etm-table-page>
          <cloudOrder
            v-else
            :search-info="orderInfo"
          />
        </div>

        <!--订单详情-->
        <etm-drawer
          :visible.sync="showSide"
          :before-close="beforeClose"
        >
          <etm-layout-split>
            <etm-title
              size="big"
              :show-line="true"
              border
            >
              详情
            </etm-title>
            <template>
              <etm-field-label
                label="订单编号"
                type="left"
              >
                {{ orderDetail.orderNo }}
              </etm-field-label>
              <etm-field-label
                label="联系人姓名"
                type="left"
              >
                {{ orderDetail.contactName }}
              </etm-field-label>
              <etm-field-label
                label="联系人电话"
                type="left"
              >
                {{ orderDetail.contactPhone }}
              </etm-field-label>
              <etm-field-label
                label="学员姓名"
                type="left"
              >
                {{ orderDetail.childName }}
              </etm-field-label>
              <etm-field-label
                label="购买时长"
                type="left"
              >
                {{ orderDetail.buyTime }}
              </etm-field-label>
              <etm-field-label
                label="支付金额"
                type="left"
              >
                {{ orderDetail.payAmount }}
              </etm-field-label>
              <etm-field-label
                label="支付日期"
                type="left"
              >
                {{ orderDetail.payDate }}
              </etm-field-label>
              <etm-field-label
                label="到期日期"
                type="left"
              >
                {{ orderDetail.expireDate }}
              </etm-field-label>
            </template>
          </etm-layout-split>
        </etm-drawer>
      </etm-layout-split>
    </etm-main-body>
  </div>
</template>

<script>
/**
 * index create by 油麦菜
 * createTime 2020/10/26 11:46
 */
import baseMixin from '@/layout/mixin/baseMixin'
import { parseTime } from '@/utils'
import { downloadFileForUrl } from '@/utils/file'
import { queryCloudVideoOrder, queryCloudVideoOrderDetail, downExcel, queryClazzList } from '@/api/newDaycare/cloudVideoOrder'
// import XLSX from 'xlsx'
import cloudOrder from './cloudOrder'

export default {
  name: 'Index',
  components: {
    cloudOrder
  },
  filters: {},
  mixins: [baseMixin],
  props: {},
  data () {
    return {
      activeName: 'cloudVideoOrders',
      formData: [
        {
          type: 'input',
          label: '订单编号',
          value: '',
          prop: 'orderNo',
          props: {
            placeholder: '请输入订单编号'
          }
        },
        {
          type: 'input',
          label: '学员姓名',
          value: '',
          prop: 'childName',
          props: {
            placeholder: '请输入学员姓名'
          }
        },
        {
          type: 'input',
          label: '联系人姓名',
          value: '',
          prop: 'contactName',
          props: {
            placeholder: '请输入联系人姓名'
          }
        },
        {
          type: 'input',
          label: '联系人电话',
          value: '',
          prop: 'contactPhone',
          props: {
            placeholder: '请输入联系人电话'
          }
        }
      ],
      formData2: [
        {
          type: 'input',
          label: '订单编号',
          prop: 'orderNumber',
          props: {
            placeholder: '请输入订单编号'
          },
          value: ''
        },
        {
          type: 'input',
          label: '家长姓名',
          prop: 'parentName',
          props: {
            placeholder: '请输入家长姓名'
          },
          value: ''
        },
        {
          type: 'input',
          label: '家长电话',
          prop: 'parentPhone',
          props: {
            placeholder: '请输入家长电话'
          },
          value: ''
        },
        {
          type: 'select',
          label: '班级',
          prop: 'clazzId',
          props: {
            placeholder: '请选择班级'
          },
          options: [],
          value: ''
        }
      ],
      orderInfo: {},
      clazzValue: [],
      columns: [
        {
          label: '联系人姓名',
          prop: 'contactName'
        },
        {
          label: '联系人电话',
          prop: 'contactPhone'
        },
        {
          label: '学员姓名',
          prop: 'childName'
        },
        {
          label: '购买时长',
          prop: 'buyTime',
          sortable: true,
          sortMethod (a, b) {
            const yearReg = /\d+(?=年)/
            const monthReg = /\d+(?=个月)/
            const dayReg = /\d+(?=天)/

            const aYear = a.buyTime.match(yearReg) ? +a.buyTime.match(yearReg)[0] : 0
            const aMonth = a.buyTime.match(monthReg) ? +a.buyTime.match(monthReg)[0] : 0
            const aDay = a.buyTime.match(dayReg) ? +a.buyTime.match(dayReg)[0] : 0

            const bYear = b.buyTime.match(yearReg) ? +b.buyTime.match(yearReg)[0] : 0
            const bMonth = b.buyTime.match(monthReg) ? +b.buyTime.match(monthReg)[0] : 0
            const bDay = b.buyTime.match(dayReg) ? +b.buyTime.match(dayReg)[0] : 0

            return (aYear * 365 + aMonth * 30 + aDay) - (bYear * 365 + bMonth * 30 + bDay)
          }
        },
        {
          label: '支付金额（元）',
          prop: 'payAmount',
          align: 'right',
          sortable: true,
          sortBy: 'payAmount'
        },
        {
          label: '支付方式',
          prop: 'payTypeName'
        },
        {
          label: '支付日期',
          prop: 'payDate',
          sortable: true,
          sortBy: 'payDate'
        },
        {
          label: '到期日期',
          prop: 'expireDate',
          sortable: true,
          sortBy: 'expireDate'
        }
      ],
      tableData: {
        content: []
      },
      pageInfo: {
        pageNum: 1,
        pageSize: 10
      },
      showSide: false,
      orderDetail: {}
    }
  },
  computed: {},
  created () {
    queryClazzList({}).then(res => {
      const clazzList = []
      Array.isArray(res.data) && res.data.forEach(v => {
        clazzList.push({
          label: v.name,
          value: v.id
        })
      })
      this.formData2[3].options = clazzList
    })
  },
  mounted () {
    this.init()
  },
  methods: {
    init (search = {}) {
      const result = Object.assign({}, search, this.pageInfo)
      // 网络请求
      queryCloudVideoOrder(result).then(res => {
        if (res.message === '成功') {
          this.tableData = res.data
          this.tableData.content.forEach(item => {
            item.payDate = parseTime(item.payDate, '{y}-{m}-{d} {h}:{i}:{s}')
            item.expireDate = parseTime(item.expireDate, '{y}-{m}-{d}')
          })
        }
      })
    },
    search (value) {
      const searchInfo = {}
      // if (this.clazzValue.length) {
      //   searchInfo.gradId = this.clazzValue[0]
      //   searchInfo.clazzId = this.clazzValue[1]
      // }
      // 遍历value 将item的每个
      value.forEach(item => {
        searchInfo[item.prop] = item.value
      })
      this.orderInfo = searchInfo
    },
    handleSearch () {
      const search = {}
      this.formData.forEach(item => {
        search[item.prop] = this.getObjectByProp(item.prop, this.formData).value
      })
      this.pageInfo.pageNum = 1
      this.init(search)
    },
    handleReset () {
      this.pageInfo.pageNum = 1
    },
    // 导出excel
    exportExcel () {
      const search = {}
      this.formData.forEach(item => {
        search[item.prop] = this.getObjectByProp(item.prop, this.formData).value
      })
      downExcel(search).then(res => {
        downloadFileForUrl(res)
      })
    },
    currentChange (pageNum, pageSize) {
      this.pageInfo = {
        pageNum,
        pageSize
      }
      const search = {}
      this.formData.forEach(item => {
        search[item.prop] = this.getObjectByProp(item.prop, this.formData).value
      })
      this.init(search)
    },
    clickOrder (cameraOrderId) {
      this.showSide = !this.showSide
      queryCloudVideoOrderDetail({ cameraOrderId }).then(res => {
        if (res.message === '成功') {
          this.orderDetail = res.data
          this.orderDetail.payDate = parseTime(this.orderDetail.payDate, '{y}-{m}-{d}')
          this.orderDetail.expireDate = parseTime(this.orderDetail.expireDate, '{y}-{m}-{d}')
        }
      })
    },
    beforeClose (done) {
      this.orderDetail = {}
      done()
    },
    // 重置orderInfo
    reset () {
      this.orderInfo = {}
    }
  }
}
</script>
<style lang="scss" scoped>
</style>
