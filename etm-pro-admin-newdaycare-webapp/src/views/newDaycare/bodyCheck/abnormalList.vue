<template>
  <div class="abnormalList-wrap">
    <etm-table-page
      :columns="columns"
      :data="tableData"
      border
      @currentChange="currentChange"
    >
      <etm-table-tool-bar slot="tool">
        <div slot="right">
          <el-button
            v-if="treasureBook.enable"
            type="primary"
            @click.stop="openBook"
          >
            {{ treasureBook.treasuredBookName }}
          </el-button>
          <el-button
            v-has="{authId: 'daycare.unhealthy.excelExport'}"
            plain
            @click.stop="exportExcel"
          >
            导出Excel
          </el-button>
        </div>
      </etm-table-tool-bar>
      <el-table-column
        slot="right"
        fixed="right"
        label="操作"
        width="120"
      >
        <template v-slot="row">
          <etm-text
            v-if="row.row.abnormalConfirmationtTime === 0"
            type="primary"
            @click="handleEdit(row.row)"
          >
            异常确认
          </etm-text>
        </template>
      </el-table-column>
    </etm-table-page>
    <etm-pop
      :visible="showPop"
      :pop="popType"
      title="异常确认"
      confirm-btn="确定"
      cancel-btn="取消"
      @open="showPop = true"
      @close="showPop = false"
      @confirm="handleCheck"
      @cancel="showPop = false"
    >
      <etm-form
        ref="form"
        :model="form"
        type="dialog"
      >
        <el-form-item
          label="体温"
          prop="temperature"
          :rules="[
            { required: true, message: '体温不能为空'},
          ]"
        >
          <el-input
            v-model="form.temperature"
            placeholder="请输入体温"
            onkeyup="this.value = this.value.replace(/[^\d.]/g,'');"
          />
        </el-form-item>
        <el-form-item
          label="常见病状"
          prop="illness"
        >
          <etm-screen-tab
            v-model="form.illness"
            :options="illnessList"
            multiple
          />
        </el-form-item>
      </etm-form>
    </etm-pop>
    <treasure-book
      :show-book="showBook"
      :book-data="treasureBook"
      @close="closeBook"
    />
  </div>
</template>

<script>
/**
 * abnormalList create by Administrator
 * createTime 2020/09/18 9:42
 */
import formValidate from '@/utils/rules'
import baseMixin from '@/layout/mixin/baseMixin'
import {
  queryAbnormalList,
  queryBodyCheckSetting,
  updateAbnormal,
  queryAbnormalExcel,
  queryInspection
} from '@/api/newDaycare/bodyCheck'
import { parseTime } from '@/utils'
import { downloadFileForUrl } from '@/utils/file'
import { queryTreasuredBook } from '@/api/base/treasuredBook'
import TreasureBook from '@/components/TreasuredBook'

export default {
  name: 'AbnormalList',
  components: { TreasureBook },
  filters: {},
  mixins: [baseMixin],
  props: {
    itemType: {
      type: Object,
      default: () => {
      }
    }
  },
  data () {
    return {
      formValidate,
      showPop: false,
      popType: 'simple',
      checkId: null,
      illnessList: [
        // {
        //   name: '发烧',
        //   value: 121
        // },
        // {
        //   name: '感冒',
        //   value: 12
        // }
      ],
      form: {
        illness: [],
        temperature: null
      },
      columns: [
        // { label: '课程名称', prop: 'scourseName' },
        { label: '班级名称', prop: 'clazzName' },
        { label: '学员姓名', prop: 'childName' },
        { label: '体温异常', prop: 'bodyTemperature', sortable: true, sortBy: 'bodyTemperature' },
        { label: '常见病状', prop: 'checkSettingsNames', sortable: true, sortBy: 'checkSettingsNames' },
        { label: '检查日期', prop: 'checkTime', sortable: true, sortBy: 'checkTime' },
        { label: '确认时间', prop: 'abnormalTime', width: 180, sortable: true, sortBy: 'abnormalTime' }
      ],
      tableData: {},
      treasureBook: {},
      showBook: false
    }
  },
  computed: {},
  watch: {
    itemType: {
      handler () {
        this.pageInfo.pageNum = 1
        this.init()
      },
      deep: true
    }
  },
  created () {
  },
  mounted () {
    this.getTreasureBook()
    this.init()
    this.getData()
  },
  methods: {
    getTreasureBook () {
      const param = {
        coding: 'jiankangjiancha'
      }
      queryTreasuredBook(param).then(res => {
        this.treasureBook = res.data
      })
    },
    openBook () {
      this.showBook = true
    },
    closeBook () {
      this.showBook = false
    },
    currentChange (pageNum, pageSize) {
      // console.log(pageNum, pageSize)
      this.pageInfo.pageNum = pageNum
      this.pageInfo.pageSize = pageSize
      this.init()
    },
    init () {
      queryAbnormalList({
        date: (this.itemType.date) || null,
        clazzId: (this.itemType.clazzId) || null,
        examinationSettingsId: (this.itemType.examinationSettingsId) || 1,
        pageNum: this.pageInfo.pageNum,
        pageSize: this.pageInfo.pageSize
      }).then(res => {
        this.tableData = res.data
        // console.log(res.data)
        this.tableData.content.forEach(item => {
          item.checkTime = item.checkDate && parseTime(item.checkDate, '{y}-{m}-{d}')
          item.abnormalTime = item.abnormalConfirmationtTime && parseTime(item.abnormalConfirmationtTime, '{y}-{m}-{d}')
          if (!item.abnormalConfirmationtTime) {
            item.abnormalConfirmationtTime = 0
          }
        })
      })
    },
    exportExcel () {
      queryAbnormalExcel({
        date: (this.itemType.date) || null,
        clazzId: (this.itemType.clazzId) || null,
        examinationSettingsId: (this.itemType.examinationSettingsId) || null,
        pageNum: this.pageInfo.pageNum,
        pageSize: this.pageInfo.pageSize
      }).then(res => {
        downloadFileForUrl(res)
      })
    },
    handleEdit (row) {
      this.showPop = true
      this.checkId = row.checkInspectionRecordsId
      this.form.temperature = row.bodyTemperature
      this.form.illness = []
      queryInspection({ checkInspectionRecordsId: row.checkInspectionRecordsId }).then(res => {
        // console.log(res.data)
        this.form.illness = res.data.checkSettingsIds
      })
    },
    getData () {
      this.dragData = []
      queryBodyCheckSetting({ type: 'COMMON_TYPES_OF_SYMPTOMS' }).then(res => {
        res.data.forEach(item => {
          this.illnessList.push({
            name: item.checkSettingsName,
            value: item.checkSettingsId
          })
        })
      })
    },
    handleCheck () {
      this.$refs.form.$children[0].validate(valid => {
        if (valid) {
          // const formData = this.form
          const formData = JSON.parse(JSON.stringify(this.form))
          // console.log('formData', formData)
          updateAbnormal({
            checkInspectionRecordsId: this.checkId,
            checkSettingsIds: formData.illness,
            bodyTemperature: formData.temperature
          }).then(() => {
            this.$message.success('操作成功')
            this.$refs.form.$children[0].resetFields()
            this.form = {
              illness: [],
              temperature: null
            }
            this.showPop = false
            this.init()
          })
        }
      })
    }
  }
}
</script>
<style lang="scss" scoped>
</style>
