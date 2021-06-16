<template>
  <div class="checkList-wrap">
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
            v-has="{authId: 'daycare.bodyCheck.query'}"
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
            v-has="{authId: 'daycare.bodyCheck.excelExport'}"
            type="primary"
            @click="handleDetail(row.row)"
          >
            查看详情
          </etm-text>
        </template>
      </el-table-column>
    </etm-table-page>
    <etm-drawer
      v-if="showSide"
      :visible.sync="showSide"
      :type="type"
    >
      <check-detail
        :examination-settings-id="itemType.examinationSettingsId"
        :assign-batch-id="checkId"
        :check-title="checkTitle"
        :ov-time="ovTime"
      />
    </etm-drawer>
    <treasure-book
      :show-book="showBook"
      :book-data="treasureBook"
      @close="closeBook"
    />
  </div>
</template>

<script>
/**
 * checkList create by Administrator
 * createTime 2020/09/18 9:42
 */
import baseMixin from '@/layout/mixin/baseMixin'
import checkDetail from '@/views/newDaycare/bodyCheck/checkDetail'
import { queryExport, queryRecords } from '@/api/newDaycare/bodyCheck'
import { parseTime } from '@/utils'
import { downloadFileForUrl } from '@/utils/file'
import { queryTreasuredBook } from '@/api/base/treasuredBook'
import TreasureBook from '@/components/TreasuredBook'

export default {
  name: 'CheckList',
  components: { checkDetail, TreasureBook },
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
      showSide: false,
      checkTitle: '',
      type: 'small',
      checkId: '',
      columns: [
        // { label: '课程名称', prop: 'scourseName' },
        { label: '班级名称', prop: 'clazzName' },
        { label: '待检人数', prop: 'pendingNumber', sortable: true, sortBy: 'pendingNumber' },
        { label: '实检人数', prop: 'actualInspectionNumber', sortable: true, sortBy: 'actualInspectionNumber' },
        { label: '体温异常', prop: 'abnormalBodyTemperatureNumber', sortable: true, sortBy: 'abnormalBodyTemperatureNumber' },
        { label: '体表异常', prop: 'bodySurfaceAbnormalitiesNumber', sortable: true, sortBy: 'bodySurfaceAbnormalitiesNumber' },
        { label: '检查时间', prop: 'ovTime', width: 180, sortable: true, sortBy: 'ovTime' }
      ],
      tableData: {},
      treasureBook: {},
      showBook: false,
      ovTime: ''
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
      queryRecords({
        date: (this.itemType.date) || null,
        clazzId: (this.itemType.clazzId) || null,
        examinationSettingsId: (this.itemType.examinationSettingsId) || 1,
        pageNum: this.pageInfo.pageNum,
        pageSize: this.pageInfo.pageSize
      }).then(res => {
        // console.log(res)
        this.tableData = res.data
        if (!this.tableData.content) {
          this.tableData.content = []
        }
        this.tableData.content.forEach(item => {
          item.ovTime = parseTime(item.checkDate, '{y}-{m}-{d}')
        })
      })
    },
    exportExcel () {
      queryExport({
        date: (this.itemType.date) || null,
        clazzId: (this.itemType.clazzId) || null,
        examinationSettingsId: (this.itemType.examinationSettingsId) || null,
        pageNum: this.pageInfo.pageNum,
        pageSize: this.pageInfo.pageSize
      }).then(res => {
        downloadFileForUrl(res)
        // console.log(res)
      })
    },
    handleDetail (row) {
      this.showSide = true
      this.checkId = row.clazzId
      this.checkTitle = row.clazzName + ' 检查详情'
      this.ovTime = row.ovTime
      // console.log(this.checkId)
    }
  }
}
</script>
<style lang="scss" scoped>
</style>
