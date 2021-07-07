<template>
  <div class="freeListen">
    <etm-main-body>
      <etm-layout-split>
        <div slot="header">
          <etm-tabs ref="tabs" v-model="activeName">
            <el-tab-pane label="托育试听" name="freeListen">
              <etm-tool-bar v-model="formData" @search="handleSearch" @reset="reset" />
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
              <etm-table-digit :data="tipData" />
            </etm-table-tool-bar>
            <el-table-column slot="right" fixed="right" label="状态">
              <template v-slot="row">
                <etm-status :type="{'TO_BE_VISITED': 'primary', 'VISITED': 'active', 'CANCELED': 'danger' }[row.row.state]">{{ row.row.status }}</etm-status>
              </template>
            </el-table-column>
            <el-table-column slot="right" fixed="right" label="操作">
              <template v-slot="row">
                <etm-text v-if="row.row.state === 'TO_BE_VISITED'" type="danger" @click="cancelOrder(row.row)">取消预约</etm-text>
                <etm-text v-if="row.row.state === 'TO_BE_VISITED'" type="primary" @click="confirmArrival(row.row)">确认到访</etm-text>
              </template>
            </el-table-column>
          </etm-table-page>
        </div>
      </etm-layout-split>
    </etm-main-body>
  </div>
</template>
<script>
import baseMixin from '@/layout/mixin/baseMixin'
import { parseTime } from '@/utils/index'
import transferDate from '@/utils/date.js'
import {
  queryFreeListenInfoList,
  confirmArrival,
  cancelOrder
} from '@/api/newDaycare/freeListen.js'
import EtmTableDigit from '@/components/EtmTableDigit'
export default {
  components: {
    EtmTableDigit
  },
  mixins: [baseMixin],
  data() {
    return {
      activeName: 'freeListen',
      formData: [
        {
          label: '学员姓名',
          type: 'input',
          prop: 'childName',
          value: '',
          props: {
            placeholder: '请输入学员姓名'
          }
        },
        {
          label: '班级名称',
          type: 'input',
          prop: 'clazzName',
          value: '',
          props: {
            placeholder: '请输入班级名称'
          }
        },
        {
          label: '班主任',
          type: 'input',
          prop: 'headTeacherName',
          value: '',
          props: {
            placeholder: '请输入班主任姓名'
          }
        },
        {
          label: '试听日期',
          type: 'date',
          value: '',
          prop: 'listenDate',
          default: [parseTime(new Date(), '{y}-{m}-{d}'), parseTime(new Date(), '{y}-{m}-{d}')],
          props: {
            type: 'daterange',
            startPlaceholder: '年/月',
            endPlaceholder: '年/月',
            clearable: false
          }
        },
        {
          label: '跟进人员',
          type: 'input',
          prop: 'followerName',
          value: '',
          props: {
            placeholder: '请输入跟进人员名称'
          }
        },
        {
          label: '状态',
          type: 'select',
          prop: 'state',
          value: '',
          props: {
            placeholder: '全部状态'
          },
          options: [
            { label: '待到访', value: 'TO_BE_VISITED' },
            { label: '已到访', value: 'VISITED' },
            { label: '已取消', value: 'CANCELED' }
          ]
        }
      ],
      pageInfo: {
        pageNum: 1,
        pageSize: 10
      },
      columns: [
        { label: '学员姓名', prop: 'childName' },
        { label: '性别', prop: 'gender' },
        { label: '试听班级', prop: 'clazzName' },
        { label: '班主任', prop: 'headTeacherName' },
        { label: '试听时间', prop: 'listenTime' },
        { label: '跟进人员', prop: 'followerName' },
        { label: '登记人员', prop: 'registerName' }
      ],
      tableData: {
        content: []
      },
      tipData: [
        {
          digit: 0,
          text: '30天到访试听'
        },
        {
          digit: 0,
          text: '7天到访试听'
        },
        {
          digit: 0,
          text: '昨天到访试听'
        },
        {
          digit: 0,
          text: '今天到访试听'
        }
      ]
    }
  },
  created() {
    this.refreshTable()
  },
  methods: {
    refreshTable() {
      const options = {
        pageNum: this.pageInfo.pageNum,
        pageSize: this.pageInfo.pageSize,
        childName: this.getValueByProp('childName', this.formData).trim() || null,
        clazzName: this.getValueByProp('clazzName', this.formData).trim() || null,
        headTeacherName: this.getValueByProp('headTeacherName', this.formData).trim() || null,
        followerName: this.getValueByProp('followerName', this.formData).trim() || null,
        startDate: this.getValueByProp('listenDate', this.formData)[0] || transferDate().time,
        endDate: this.getValueByProp('listenDate', this.formData)[1] || transferDate().time,
        state: this.getValueByProp('state', this.formData) || null
      }
      queryFreeListenInfoList(options).then(res => {
        const { data } = res
        this.tipData[0].digit = data.expInMonth || 0
        this.tipData[1].digit = data.expInWeek || 0
        this.tipData[2].digit = data.expInYesterday || 0
        this.tipData[3].digit = data.expInToday || 0

        Array.isArray(data.page.content) && data.page.content.forEach(v => {
          v.status = { 'TO_BE_VISITED': '待到访', 'VISITED': '已到访', 'CANCELED': '已取消' }[v.state]
          v.listenTime = transferDate(v.date).time + ' ' + v.time
        })
        this.tableData = data.page
      }).catch(err => {
        console.log(err)
      })
    },
    handleSearch() {
      this.refreshTable()
    },
    reset() {
      setTimeout(() => {
        this.refreshTable()
      }, 0)
    },
    currentChange(pageNum, pageSize) {
      this.pageInfo = {
        pageNum, pageSize
      }
      this.refreshTable()
    },
    cancelOrder(row) {
      console.log(row.experienceId)
      this.$etmTip.init({
        type: 'warn',
        title: '取消试听',
        content: `取消${row.childName}学员的试听？`,
        confirmBtn: '确定',
        cancelBtn: '取消',
        confirm: () => {
          cancelOrder({ experienceId: row.experienceId }).then(res => {
            this.$message.success('操作成功')
            this.refreshTable()
          }).catch(err => {
            console.log(err)
          })
          this.$etmTip.close()
        },
        cancel: () => {
          this.$etmTip.close()
        }
      })
      this.$etmTip.open()
    },
    confirmArrival(row) {
      this.$etmTip.init({
        type: 'success',
        title: '确认到访',
        content: `确认${row.childName}学员的到访？`,
        confirmBtn: '确定',
        cancelBtn: '取消',
        confirm: () => {
          confirmArrival({ experienceId: row.experienceId }).then(res => {
            this.$message.success('操作成功')
            this.refreshTable()
          }).catch(err => {
            console.log(err)
          })
          this.$etmTip.close()
        },
        cancel: () => {
          this.$etmTip.close()
        }
      })
      this.$etmTip.open()
    }
  }
}
</script>

<style scoped>
</style>
