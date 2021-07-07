<template>
  <div class="index-wrap">
    <etm-main-body>
      <etm-layout-split>
        <div slot="header">
          <etm-tabs ref="tabs" v-model="activeName">
            <el-tab-pane
              label="收费管理"
              name="charge"
            >
              <etm-tool-bar v-model="chargeForm" @search="handleSearch" @reset="reset" />
            </el-tab-pane>
            <el-tab-pane label="账单信息" name="order">
              <etm-tool-bar v-model="orderForm" @search="handleSearch" @reset="reset">
                <el-form-item label="班级:">
                  <etm-clazz-cascader :clear="clear" @change="getClazz" />
                </el-form-item>
              </etm-tool-bar>
            </el-tab-pane>
          </etm-tabs>
        </div>
        <div slot="body">
          <charge-table v-if="activeName === 'charge'" ref="charge" :search-info="chargeInfo" />
          <order-table v-if="activeName === 'order'" :search-info="orderInfo" />
        </div>
      </etm-layout-split>
    </etm-main-body>
  </div>

</template>

<script>
/**
 * index create by Administrator
 * createTime 2021/1/15 10:04
 */
import chargeTable from './table/charge'
import orderTable from './table/order'
import EtmClazzCascader from '@/views/newDaycare/childManageGuard/EtmClazzCascader'
export default {
  name: 'Index',
  components: {
    chargeTable,
    orderTable,
    EtmClazzCascader
  },
  filters: {},
  mixins: [],
  props: {},
  data() {
    return {
      activeName: 'charge',
      chargeInfo: {},
      chargeForm: [
        {
          label: '收费名称',
          type: 'input',
          prop: 'orderBunchName',
          value: '',
          props: {
            placeholder: '请输入收费名称'
          }
        },
        {
          label: '制单时间',
          type: 'date',
          prop: 'date',
          value: '',
          props: {
            type: 'daterange',
            startPlaceholder: '开始日期',
            endPlaceholder: '结束日期'
          }
        },
        {
          label: '账单状态',
          type: 'select',
          prop: 'orderBunchStatus',
          value: '',
          props: {
            placeholder: '请选择'
          },
          options: [
            {
              label: '全部',
              value: ''
            },
            {
              label: '待审核',
              value: 'UN_AUDIT'
            },
            {
              label: '不通过',
              value: 'REJECT'
            },
            {
              label: '未收全',
              value: 'UN_FULL'
            },
            {
              label: '已收全',
              value: 'FULL'
            }
          ]
        }
      ],
      orderInfo: {},
      orderForm: [
        {
          label: '幼儿姓名',
          type: 'input',
          prop: 'name',
          value: '',
          props: {
            placeholder: '请输入幼儿姓名'
          }
        },
        {
          label: '收费时间',
          type: 'date',
          prop: 'date',
          value: '',
          props: {
            type: 'daterange',
            startPlaceholder: '开始日期',
            endPlaceholder: '结束日期'
          }
        },
        {
          label: '收款状态',
          type: 'select',
          prop: 'status',
          value: '',
          props: {
            placeholder: '请选择'
          },
          options: [
            {
              label: '全部',
              value: ''
            },
            {
              label: '未收费',
              value: 'UN_PAY'
            },
            {
              label: '已收费',
              value: 'PAYED'
            }
          ]
        },
        {
          label: '账单编号',
          type: 'input',
          prop: 'code',
          value: '',
          props: {
            placeholder: '请输入账单编号'
          }
        }
      ],
      clazzValue: [],
      clear: false
    }
  },
  computed: {},
  watch: {},
  created() {
  },
  mounted() {
  },
  methods: {
    getClazz(value) {
      this.clazzValue = value
    },
    handleSearch(value) { // 搜索数据
      if (this.activeName === 'charge') {
        const searchInfo = {}
        value.forEach(item => {
          if (item.prop === 'date') {
            searchInfo.createStartDate = item.value[0]
            searchInfo.createEndDate = item.value[1]
          } else {
            searchInfo[item.prop] = item.value
          }
        })
        this.chargeInfo = searchInfo
      } else {
        const searchInfo = {}
        if (this.clazzValue.length) {
          searchInfo.gradeId = this.clazzValue[0]
          searchInfo.clazzId = this.clazzValue[1]
        }
        value.forEach(item => {
          if (item.prop === 'date') {
            searchInfo.paymentStartDate = item.value[0]
            searchInfo.paymentEndDate = item.value[1]
          } else {
            searchInfo[item.prop] = item.value
          }
        })
        this.orderInfo = searchInfo
      }
    },
    reset() { // 重置
      if (this.activeName === 'charge') {
        this.chargeInfo = {}
      } else {
        this.clear = !this.clear
        this.clazzValue = []
        this.orderInfo = {}
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.index-wrap {

}
</style>
