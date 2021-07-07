<template>
  <div class="leave-wrap">
    <el-timeline>
      <el-timeline-item
        v-for="(leave, index) in leaveData"
        :key="index"
        :timestamp="leave.timestamp"
        placement="top"
      >
        <div class="timeBox">
          <div>
            <etm-field-label type="left" label="请假类型">{{ leave.leaveType }}</etm-field-label>
            <etm-field-label type="left" label="开始时间">{{ leave.startTime }}</etm-field-label>
            <etm-field-label type="left" label="结束时间">{{ leave.endTime }}</etm-field-label>
            <etm-field-label type="left" label="请假理由">{{ leave.leaveReason }}</etm-field-label>
            <etm-field-label type="left" label="申请人">{{ leave.applicant }}</etm-field-label>
          </div>
          <div v-if="leave.imageList.length" class="imgBox">
            <div v-for="(img, i) in leave.imageList" :key="i" class="img">
              <el-image
                style="width: 100%; height: 100%"
                :src="img.url"
                fit="cover"
                :preview-src-list="leave.imagePreviewList"
              />
            </div>
          </div>
        </div>
      </el-timeline-item>
    </el-timeline>
    <template v-if="!leaveData.length">
      <etm-empty />
    </template>
  </div>

</template>

<script>/**
 * leave create by Administrator
 * createTime 2020/9/2 17:29
 */

import { getLeaveList } from '@/api/guardcare/childManage/childManage'
import { parseTime } from '@/utils'

export default {
  name: 'Leave',
  components: {},
  filters: {},
  mixins: [],
  props: {
    childId: {
      type: Number,
      default() {
        return null
      }
    }
  },
  data() {
    return {
      leaveData: []
    }
  },
  computed: {},
  watch: {
    childId() {
      this.getData()
    }
  },
  created() {
  },
  mounted() {
    this.getData()
  },
  methods: {
    getData() {
      if (this.childId) {
        const param = {
          childId: this.childId
        }
        getLeaveList(param).then(res => {
          const data = res.data
          this.leaveData = []
          data.forEach(item => {
            const time = '申请时间：' + parseTime(item.createTime, '{y}-{m}-{d} {h}:{i}')
            const leave = {
              timestamp: time,
              leaveType: item.leaveType === 'SICK_LEAVE' ? '病假' : '事假',
              startTime: parseTime(item.startTime, '{y}-{m}-{d} {h}:{i}'),
              endTime: parseTime(item.endTime, '{y}-{m}-{d} {h}:{i}'),
              leaveReason: item.leaveReason,
              applicant: item.applicant,
              imageList: item.imageList,
              imagePreviewList: []
            }
            if (item.imageList) {
              item.imageList.forEach(img => {
                leave.imagePreviewList.push(img.url)
              })
            }
            this.leaveData.push(leave)
          })
        })
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.leave-wrap {
  .el-timeline{
    ::v-deep .el-timeline-item{
      position: relative;
      padding-bottom: 8px;
      .el-timeline-item__node{
        @include bgc_main_color();
      }
      .el-timeline-item__timestamp{
        margin-bottom: 16px;
        font-size: 16px;
        @include c_title_color();
      }
    }
  }
  .timeBox{
    .imgBox{
      display: flex;
      flex-wrap: wrap;
      padding-bottom: 8px;
      .img{
        margin: 0 8px 8px 0;
        width: 76px;
        height: 76px;
        border-radius: 2px;
        overflow: hidden;
      }
    }
  }
}
</style>
