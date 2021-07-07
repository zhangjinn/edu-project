<template>
  <div class="teach-wrap">
    <etm-table-page
      :stripe="false"
      :border="false"
      :columns="columns"
      :data="tableData"
      @currentChange="currentChange"
    >
      <el-table-column slot="left" fixed="left" label="头像" width="120">
        <template slot-scope="scoped">
          <el-image
            v-if="scoped.row.avatar&&scoped.row.avatar!=='--'"
            style="width: 32px; height: 32px;border-radius: 50%;"
            :src="scoped.row.avatar"
            fit="cover"
          />
          <i v-else class="iconfont iconmorentouxiang user-avatar" />
        </template>
      </el-table-column>
      <el-table-column slot="right" fixed="right" label="操作" width="220">
        <template v-slot="row">
          <etm-text v-if="row.row.status!=='未点评'" type="primary" @click="handleDetail(row.row)">
            点评详情
          </etm-text>
        </template>
      </el-table-column>
    </etm-table-page>
    <etm-drawer
      :visible.sync="showSide"
      :type="type"
    >
      <detail v-if="showSide" :rev-id="revId" :set-type="'care'" />
    </etm-drawer>
  </div>

</template>

<script>
/**
 * teach create by Administrator
 * createTime 2021/01/13 17:41
 */
import detail from './detail'
import baseMixin from '@/layout/mixin/baseMixin'
import { queryCac_reviews } from '@/api/newDaycare/clazzComment'
import { parseTime } from '@/utils'
import dayjs from 'dayjs'
import { getStartDateAndEndDateByDate } from '@/utils/date'

export default {
  name: 'Teach',
  components: { detail },
  filters: {},
  mixins: [baseMixin],
  props: {
    care: {
      type: Object,
      default: () => {
      }
    },
    setType: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      showSide: false,
      type: 'small',
      revId: null,
      tableData: {},
      columns: [
        { label: '学员姓名', prop: 'childName' },
        { label: '性别', prop: 'gender' },
        { label: '班级', prop: 'clazzName' },
        { label: '点评老师', prop: 'teacherName' },
        { label: '点评日期', prop: 'reviewsDate' },
        { label: '点评状态', prop: 'status' }
      ],
      setTime: ''
    }
  },
  computed: {},
  watch: {
    care: {
      handler() {
        this.pageInfo.pageNum = 1
        this.init()
        // console.log(this.attendSearch)
      },
      deep: true
    }
  },
  created() {
    // console.log(this.setType)
    this.init()
  },
  mounted() {
  },
  methods: {
    handleDetail(row) {
      // console.log(row)
      this.revId = row.reviewsId
      // console.log(this.revId, typeof (this.revId))
      this.showSide = true
    },
    currentChange(pageNum, pageSize) {
      // console.log(pageNum,pageSize)
      this.pageInfo.pageNum = pageNum
      this.pageInfo.pageSize = pageSize
      this.init()
    },
    init() {
      if (this.setType === 'WEEKLY') {
        // console.log(this.care.time)
        this.care.time = dayjs(this.care.time).startOf('week').add(1, 'days').format('YYYY-MM-DD')
        // console.log(this.care.time)
        this.setTime = parseTime(this.care.time, '{y}-{m}-{d}') + ',' + dayjs(this.care.time).add(6, 'days').format('YYYY-MM-DD')
      } else if (this.setType === 'PER_MONTH') {
        // console.log(this.care.time)
        const { startDate, endDate } = getStartDateAndEndDateByDate(new Date(this.care.time))
        // console.log({ startDate, endDate })
        this.setTime = startDate + ',' + endDate
      } else {
        // console.log(this.care.time)
        this.setTime = this.care.time + ',' + this.care.time
      }
      queryCac_reviews({
        state: this.care.state,
        childName: this.care.childName || null,
        clazzName: this.care.courseName || null,
        dateSrt: this.setTime,
        pageNum: this.pageInfo.pageNum,
        pageSize: this.pageInfo.pageSize
      }).then(res => {
        // console.log(res.data)
        const data = res.data
        const gender = {
          'MALE': '男',
          'FEMALE': '女'
        }
        data.content.forEach(v => {
          v.reviewsDate = (v.reviewsDate && parseTime(v.reviewsDate, '{y}-{m}-{d} ')) || null
          v.status = v.reviewsId ? '已点评' : '未点评'
          v.gender = gender[v.gender]
        })
        this.tableData = data
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.teach-wrap {
  .user-avatar {
    width: 32px;
    height: 32px;
    line-height: 32px;
    vertical-align: middle;
    background-color: #fff;
    font-size: 32px;
    color: #C1C4CC;
  }
}
</style>
