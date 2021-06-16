<template>
  <div class="index-wrap">
    <etm-layout-split>
      <div slot="header">
        <etm-tabs
          v-model="activeName"
          :setting="true"
          @setting="setting"
        >
          <el-tab-pane
            name="staffOnActive"
            label="在职员工"
          >
            <etm-tool-bar
              v-model="formData1"
              @search="handleSearch('staffOnActive',formData1)"
              @reset="reset"
            />
          </el-tab-pane>
          <el-tab-pane
            name="staffOffActive"
            label="离职员工"
          >
            <etm-tool-bar
              v-model="formData2"
              @search="handleSearch('staffOffActive',formData2)"
              @reset="reset"
            />
          </el-tab-pane>
        </etm-tabs>
      </div>
      <div slot="body">
        <staff-on-table
          v-if="activeName === 'staffOnActive'"
          ref="staffOnActive"
          :store-detail-tip-data="storeDetailTipData"
          @update="updateDigitalData"
        />
        <staff-off-table
          v-if="activeName === 'staffOffActive'"
          ref="staffOffActive"
          :store-detail-tip-data="storeDetailTipData"
        />
      </div>
    </etm-layout-split>
  </div>
</template>

<script>
/**
 * index create by Administrator
 * createTime 2021/1/28 10:17
 */
import staffOnTable from '@/views/newDaycare/listDataManage/staffFile/components/staffOnTable'
import staffOffTable from '@/views/newDaycare/listDataManage/staffFile/components/staffOffTable'
import { queryStaffAverage, queryStaffSettingsList } from '@/api/newDaycare/staffFile'
import baseMixin from '@/layout/mixin/baseMixin'

export default {
  name: 'StaffFile',
  components: {
    staffOnTable,
    staffOffTable
  },
  filters: {},
  mixins: [baseMixin],
  props: {},
  data () {
    return {
      activeName: 'staffOnActive',
      storeDetailTipData: [
        { digit: 1, text: '员工总数' },
        { digit: 1, text: '平均年龄' },
        { digit: 1, text: '员工在职时长' }
      ],
      positionOptions: [],
      formData1: [
        {
          label: '员工姓名',
          type: 'input',
          prop: 'employeeName',
          value: null,
          props: {
            placeholder: '请输入员工姓名'
          }
        },
        {
          label: '手机号码',
          type: 'input',
          prop: 'telephone',
          value: null,
          props: {
            placeholder: '请输入手机号码'
          }
        },
        {
          label: '岗位',
          type: 'select',
          prop: 'positionId',
          value: null,
          props: {
            placeholder: '请选择岗位'
          },
          options: []
        }
      ],
      formData2: [
        {
          label: '员工姓名',
          type: 'input',
          prop: 'employeeName',
          value: null,
          props: {
            placeholder: '请输入员工姓名'
          }
        },
        {
          label: '手机号码',
          type: 'input',
          prop: 'telephone',
          value: null,
          props: {
            placeholder: '请输入手机号码 '
          }
        },
        {
          label: '岗位',
          type: 'select',
          prop: 'positionId',
          value: null,
          props: {
            placeholder: '请选择岗位'
          },
          options: []
        }
      ]
    }
  },
  computed: {},
  watch: {
    activeName (newVal) {
      this.queryAverage(newVal)
    }
  },
  created () {
  },
  mounted () {
    this.init()
  },
  methods: {
    init () {
      this.queryAverage(this.activeName)
      this.queryPosition()
    },
    handleSearch (ref, formData) {
      this.$refs[ref].formData = formData
      console.log(this.$refs[ref].formData, 'formData')
      this.$refs[ref].init()
    },
    // 查询岗位
    queryPosition () {
      queryStaffSettingsList({ type: 'PROFESSION' }).then(res => {
        this.positionOptions = this.convertDataToOptions(res.data, 'headquartersSettingName', 'headquartersSettingId')
        this.formData1[2].options = this.positionOptions
        this.formData2[2].options = this.positionOptions
      })
    },
    // 查询员工平均数
    queryAverage (activeName) {
      const resignStatus = activeName !== 'staffOnActive'
      queryStaffAverage({ resignStatus }).then(res => {
        this.storeDetailTipData[0].digit = res.data.employeeCount
        this.storeDetailTipData[1].digit = res.data.avgAge.split('岁')[0]
        console.log(this.storeDetailTipData[1].digit, 'digit')
        this.storeDetailTipData[2].digit = res.data.avgPosition
      })
    },
    setting () {
      this.$router.push({ name: 'newdaycare_staffSetting' })
    },
    updateDigitalData (digitalData) {
      this.storeDetailTipData = digitalData
      this.storeDetailTipData[1].digit = this.storeDetailTipData[1].digit.split('岁')[0]
      // console.log(th, 'store')
      console.log(digitalData, 'digitalData')
    },
    reset () {}
  }
}
</script>
<style lang="scss" scoped>
    .index-wrap {
      margin: 16px 0;
    }
</style>
