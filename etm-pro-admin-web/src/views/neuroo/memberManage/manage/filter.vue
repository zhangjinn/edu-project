<template>
  <div class="index-wrap">
    <etm-tabs v-model="activeName" @toggle="toggle">
      <el-tab-pane label="在册" name="IN">
        <etm-tool-bar v-show="show" v-model="informData" @search="onSubmit" @reset="reset" />
      </el-tab-pane>
      <el-tab-pane label="毕业" name="OUT">
        <etm-tool-bar v-show="show" v-model="outformData" @search="onSubmit" @reset="reset" />
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
      activeName: this.$store.state.memberManageNeuroo.customerState,
      show: true,
      informData: [
        {
          label: '会员姓名',
          type: 'input',
          prop: 'customerName',
          value: '',
          props: {
            placeholder: '请输入会员姓名'
          }
        },
        {
          label: '联系电话',
          type: 'input',
          prop: 'contactPhone',
          value: '',
          props: {
            placeholder: '请输入联系电话'
          }
        },
        {
          label: '入园时间',
          type: 'date',
          prop: 'admissionTime',
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
          prop: 'school',
          value: '',
          default: '',
          props: {
            placeholder: '请选择上课园区'
          },
          options: []
        },
        {
          label: '消课状态',
          type: 'select',
          prop: 'state',
          value: '',
          props: {
            placeholder: '请选择状态'
          },
          default: '',
          options: [
            {
              label: '全部',
              value: ''
            },
            {
              label: '未开课',
              value: 'CLASS_NOT_OPEN'
            },
            {
              label: '消课中',
              value: 'ELIMINATION_OF_CLASS'
            },
            {
              label: '课时预警',
              value: 'CLASS_HOUR_WARNING'
            },
            {
              label: '已退费',
              value: 'REFUNDED'
            }
          ]
        }
      ],
      outformData: [
        {
          label: '会员姓名',
          type: 'input',
          prop: 'customerName',
          value: '',
          props: {
            placeholder: '请输入会员姓名'
          }
        },
        {
          label: '离园时间',
          type: 'date',
          prop: 'departureTime',
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
          prop: 'school',
          value: '',
          default: '',
          props: {
            placeholder: '请选择上课园区'
          },
          options: []
        }
      ],
      classList: [
        {
          label: '全部',
          value: ''
        }
      ]
    }
  },
  watch: {
    activeName(val) {
      this.$store.commit('memberManageNeuroo/SET_CUSTOMERSTATE', val)
      this.reset()
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
        this.informData[3].options = this.classList
        this.outformData[2].options = this.classList
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
      const filter = {}
      let formData
      if (this.activeName === 'IN') {
        formData = this.informData
        this.getValueByProp('customerName', formData).trim() ? filter.name = this.getValueByProp('customerName', formData).trim() : ''
        this.getValueByProp('contactPhone', formData).trim() ? filter.telephone = this.getValueByProp('contactPhone', formData).trim() : ''
        if (this.getValueByProp('admissionTime', formData)) {
          filter.enterSchoolStartTime = this.getValueByProp('admissionTime', formData)[0]
          filter.enterSchoolEndTime = this.getValueByProp('admissionTime', formData)[1]
        }
        filter.schoolId = this.getValueByProp('school', formData)
        filter.eliminationStatus = this.getValueByProp('state', formData)
        this.$emit('query')
        this.$store.commit('memberManageNeuroo/SET_FILTER', filter)
      }
      if (this.activeName === 'OUT') {
        formData = this.outformData
        this.getValueByProp('customerName', formData).trim() ? filter.name = this.getValueByProp('customerName', formData).trim() : ''
        if (this.getValueByProp('departureTime', formData)) {
          filter.graduateStartTime = this.getValueByProp('departureTime', formData)[0]
          filter.graduateEndTime = this.getValueByProp('departureTime', formData)[1]
        }
        filter.schoolId = this.getValueByProp('school', formData)
        this.$emit('query')
        this.$store.commit('memberManageNeuroo/SET_FILTER', filter)
      }
    },
    reset() {
      let formData
      if (this.activeName === 'IN') {
        formData = this.informData
      }
      if (this.activeName === 'OUT') {
        formData = this.outformData
      }
      this.resetValue(formData)
      this.$emit('query')
      this.$store.commit('memberManageNeuroo/SET_FILTER', null)
    }
  }
}
</script>

<style>

</style>
