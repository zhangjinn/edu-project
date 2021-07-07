<template>
  <div class="careList-wrap">
    <etm-table id="xlsxTable" v-fixedHead :columns="columns" :data="tableData">
      <etm-table-tool-bar slot="tool">
        <div slot="right">
          <el-button plain @click="exportTableToExcel({id: 'xlsxTable', name:'托育考勤统计'})">导出Excel
          </el-button>
        </div>
      </etm-table-tool-bar>
    </etm-table>
  </div>

</template>

<script>
/**
 * careList create by Administrator
 * createTime 2020/12/11 14:00
 */
import baseMixin from '@/layout/mixin/baseMixin'
import { queryCareAttendanceReport } from '@/api/newDaycare/statistics'
import dayjs from 'dayjs'
import { parseTime } from '@/utils'

export default {
  name: 'CareList',
  components: {},
  filters: {},
  mixins: [baseMixin],
  props: {
    careSearch: {
      type: Object,
      default: () => {
      }
    }
  },
  data() {
    return {
      columns: [
        { label: '学员姓名', prop: 'childName' },
        { label: '应出勤（天）', prop: 'shouldNum' },
        { label: '已出勤（天）', prop: 'actuallyNum' },
        { label: '缺勤（天）', prop: 'absentNum' },
        { label: '请假（天）', prop: 'askNum' },
        { label: '出勤率', prop: 'probability' }
      ],
      tableData: []
    }
  },
  computed: {},
  watch: {
    careSearch: {
      handler() {
        this.pageInfo.pageNum = 1
        this.init()
      },
      deep: true
    }
  },
  created() {
    // console.log(moment('2020-12-12').endOf('month').format())
    this.init()
  },
  mounted() {
  },
  methods: {
    init() {
      queryCareAttendanceReport({
        childName: this.careSearch.childName || null,
        startDate: (this.careSearch.time && dayjs(this.careSearch.time).startOf('month').format('YYYY-MM-DD')) || parseTime(new Date(), '{y}-{m}-01'),
        endDate: (this.careSearch.time && dayjs(this.careSearch.time).endOf('month').format('YYYY-MM-DD')) || dayjs().endOf('month').format('YYYY-MM-DD')
      }).then(res => {
        this.tableData = res.data
        this.tableData.forEach(v => {
          v.probability = v.probability + '%'
        })
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.careList-wrap {

}
</style>
