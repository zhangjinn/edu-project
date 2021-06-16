<template>
  <div class="teach-wrap">
    <etm-table-page
      :stripe="false"
      :border="false"
      :columns="columns"
      :data="tableData"
      @currentChange="currentChange"
    >
      <el-table-column
        slot="left"
        fixed="left"
        label="头像"
        width="120"
      >
        <template slot-scope="scoped">
          <el-image
            v-if="scoped.row.avatar&&scoped.row.avatar!=='--'"
            style="border-radius: 50%;
  height: 32px;
  width: 32px;"
            :src="scoped.row.avatar"
            fit="cover"
          />
          <i
            v-else
            class="iconfont iconmorentouxiang user-avatar"
          />
        </template>
      </el-table-column>
      <el-table-column
        slot="right"
        fixed="right"
        label="操作"
        width="220"
      >
        <template v-slot="row">
          <etm-text
            v-if="row.row.status!=='未点评'"
            type="primary"
            @click="handleDetail(row.row)"
          >
            点评详情
          </etm-text>
        </template>
      </el-table-column>
    </etm-table-page>
    <etm-drawer
      :visible.sync="showSide"
      :type="type"
    >
      <detail
        v-if="showSide"
        :rev-id="revId"
        :set-type="'teach'"
      />
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
import { queryTcReviews } from '@/api/newDaycare/clazzComment'
import { parseTime } from '@/utils'

export default {
  name: 'Teach',
  components: { detail },
  filters: {},
  mixins: [baseMixin],
  props: {
    teach: {
      type: Object,
      default: () => {
      }
    }
  },
  data () {
    return {
      showSide: false,
      type: 'small',
      revId: null,
      tableData: {
      },
      columns: [
        { label: '学员姓名', prop: 'childName' },
        { label: '课程', prop: 'courseName' },
        { label: '性别', prop: 'gender' },
        { label: '点评老师', prop: 'teacherName' },
        { label: '上课时间', prop: 'classTime' },
        { label: '点评状态', prop: 'status' }
      ]
    }
  },
  computed: {},
  watch: {
    teach: {
      handler () {
        this.pageInfo.pageNum = 1
        this.init()
        // console.log(this.attendSearch)
      },
      deep: true
    }
  },
  created () {
    this.init()
  },
  mounted () {
  },
  methods: {
    handleDetail (row) {
      // console.log(row)
      this.revId = row.reviewsId
      // console.log(this.revId, typeof (this.revId))
      this.showSide = true
    },
    currentChange (pageNum, pageSize) {
      // console.log(pageNum,pageSize)
      this.pageInfo.pageNum = pageNum
      this.pageInfo.pageSize = pageSize
      this.init()
    },
    init () {
      queryTcReviews({
        state: this.teach.state,
        childName: this.teach.childName || null,
        courseName: this.teach.courseName || null,
        startDate: (this.teach.time && this.teach.time[0]) || parseTime(new Date(), '{y}-{m}-{d}'),
        endDate: (this.teach.time && this.teach.time[1]) || parseTime(new Date(), '{y}-{m}-{d}'),
        pageNum: this.pageInfo.pageNum,
        pageSize: this.pageInfo.pageSize
      }).then(res => {
        // console.log(res.data)
        const data = res.data
        const gender = {
          MALE: '男',
          FEMALE: '女'
        }
        data.content.forEach(v => {
          v.classTime = parseTime(v.dateDate, '{y}-{m}-{d} ') + v.dateStr
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
    background-color: #fff;
    color: #c1c4cc;
    font-size: 32px;
    height: 32px;
    line-height: 32px;
    vertical-align: middle;
    width: 32px;
  }
}
</style>
