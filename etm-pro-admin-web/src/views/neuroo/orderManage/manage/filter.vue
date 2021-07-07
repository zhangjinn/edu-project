<template>
  <div class="index-wrap">
    <etm-tabs v-model="activeName" @toggle="toggle">
      <el-tab-pane label="消课订单列表" name="order">
        <etm-screen-tab v-show="show" v-model="categoryType" :options="categoryList" title="快速筛选" @change="stClick" />

        <etm-tool-bar v-show="show" v-model="formData" @search="onSubmit" @reset="reset" />
      </el-tab-pane>
    </etm-tabs>
  </div>
</template>
<script>
import baseMixin from '@/layout/mixin/baseMixin'
import { getSchoolList } from '@/api/neuroo/memberManage'
export default {
  mixins: [baseMixin],
  data() {
    return {
      activeName: 'order',
      show: true,
      categoryType: 'ALL',
      categoryList: [
        {
          name: '全部',
          value: 'ALL'
        },
        {
          name: '已排课',
          value: 'HAVE_ARRANGED'
        },
        {
          name: '未排课',
          value: 'NOT_ARRANGE'
        }
      ],
      classList: [
        {
          label: '全部',
          value: ''
        }
      ],
      formData: [
        {
          label: '订单编号',
          type: 'input',
          prop: 'orderNo',
          value: '',
          props: {
            placeholder: '请输入订单编号'
          }
        },
        {
          label: '联系电话',
          type: 'input',
          prop: 'telephone',
          value: '',
          props: {
            placeholder: '请输入联系电话'
          }
        },
        {
          label: '下单时间',
          type: 'date',
          prop: 'orderTime',
          value: null,
          props: {
            'type': 'daterange',
            'clearable': false,
            'range-separator': '-',
            'value-format': 'yyyy-MM-dd',
            'start-placeholder': '开始日期',
            'end-placeholder': '结束日期'
          }
        },
        {
          label: '上课园区',
          type: 'select',
          prop: 'schoolId',
          value: '',
          props: {
            placeholder: '请输入签单园区'
          },
          default: '',
          options: []
        },
        {
          label: '订单状态',
          type: 'select',
          prop: 'orderState',
          value: null,
          props: {
            placeholder: '请选择状态'
          },
          default: null,
          options: [
            {
              label: '全部',
              value: null
            },
            {
              label: '未使用',
              value: 'UNUSED'
            },
            {
              label: '使用中',
              value: 'IN_USE'
            },
            {
              label: '使用完',
              value: 'HAS_BEEN_USE'
            },
            {
              label: '已退费',
              value: 'HAVE_A_REFUND'
            }
          ]
        }
      ]
    }
  },
  created() {
    getSchoolList().then(res => {
      if (Array.isArray(res.data)) {
        res.data.forEach(v => {
          this.classList.push({
            label: v.name,
            value: v.id
          })
        })
        this.formData[3].options = this.classList
      }
    }).catch(err => {
      console.log(err)
    })
  },
  methods: {
    toggle(val) {
      this.show = val
    },
    onSubmit() {
      let filter = this.$store.state.orderManageNeuroo.filter
      const queryFilter = {}
      this.getValueByProp('orderNo', this.formData).trim() ? queryFilter.orderNo = this.getValueByProp('orderNo', this.formData).trim() : null
      this.getValueByProp('telephone', this.formData).trim() ? queryFilter.telephone = this.getValueByProp('telephone', this.formData).trim() : null
      const orderTime = this.getValueByProp('orderTime', this.formData)
      if (orderTime) {
        queryFilter.startOrderTime = orderTime[0]
        queryFilter.endOrderTime = orderTime[1]
      }
      this.getValueByProp('schoolId', this.formData) ? queryFilter.schoolId = this.getValueByProp('schoolId', this.formData) : null
      queryFilter.orderState = this.getValueByProp('orderState', this.formData) ? this.getValueByProp('orderState', this.formData) : null
      if (filter) {
        Object.assign(filter, queryFilter)
      } else {
        filter = queryFilter
      }
      this.$emit('query')
      this.$store.commit('orderManageNeuroo/SET_FILTER', filter)
    },
    reset() {
      this.resetValue(this.formData)
      this.$emit('query')
      this.$store.commit('orderManageNeuroo/SET_FILTER', {})
    },
    stClick(v) {
      let type = this.categoryType
      if (type === 'ALL') {
        type = null
      }
      let filter = this.$store.state.orderManageNeuroo.filter
      if (filter) {
        filter.arrangeState = type
      } else {
        filter = {
          arrangeState: type
        }
      }
      this.$emit('query')
      this.$store.commit('orderManageNeuroo/SET_FILTER', filter)
    }
  }
}
</script>

<style scoped lang="scss">
.index-wrap {
  & >>> .screenTab {
    padding-top: 0;
  }
}
</style>
