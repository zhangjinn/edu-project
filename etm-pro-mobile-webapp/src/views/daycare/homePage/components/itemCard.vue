<template>
  <div class="item-card">
    <van-cell>
      <van-grid clickable :column-num="5" :border="false" icon-size="35px">
        <van-grid-item
          v-for="(item, index) in items"
          :key="index"
          :icon="item.icon"
          :text="item.name"
          @click="clickGridItem(item.path)"
        />
      </van-grid>
    </van-cell>
  </div>
</template>

<script>
import { Grid, GridItem } from 'vant'
import { Toast } from 'vant'
export default {
  name: 'ItemCard',
  components: {
    'van-grid': Grid,
    'van-grid-item': GridItem
  },
  data() {
    return {
      items: [
        {
          name: '早教考勤',
          icon: require('@/assets/images/daycare/daycare_attendanceTeach.png'),
          path: '/daycare_attendanceTeach'
        },
        {
          name: '托育考勤',
          icon: require('@/assets/images/daycare/daycare_attendanceCare.png'),
          path: '/daycare_attendanceCare'
        },
        {
          name: '健康检查',
          icon: require('@/assets/images/daycare/daycare_bodyCheck.png'),
          path: '/daycare_bodyCheck'
        },
        {
          name: '学员请假',
          icon: require('@/assets/images/daycare/daycare_leave.png'),
          path: '/daycare_leave'
        },
        {
          name: '交代事宜',
          icon: require('@/assets/images/daycare/daycare_matterList.png'),
          path: '/daycare_matterList'
        },
        {
          name: '早教点评',
          icon: require('@/assets/images/daycare/lesson-assessment.png'),
          path: '/daycare_commentTeach'
        },
        {
          name: '托育点评',
          icon: require('@/assets/images/daycare/daycare_commentCare.png'),
          path: '/daycare_commentCare'
        },
        {
          name: '园所报餐',
          icon: require('@/assets/images/daycare/daycare_mealsRecord.png'),
          path: '/daycare_mealsRecord'
        },
        {
          name: '周食谱',
          icon: require('@/assets/images/daycare/a-week-recipesManage.png'),
          path: '/daycare_recipesManage'
        },
        {
          name: '课程表',
          icon: require('@/assets/images/daycare/clazz-schedule.png'),
          path: '/daycare_courseTimeManage'
        },
        {
          name: '在园日记',
          icon: require('@/assets/images/daycare/daycare_dailyManage.png'),
          path: '/daycare_dailyManage'
        },
        {
          name: '一周日程',
          icon: require('@/assets/images/daycare/a-week-schedule.png'),
          path: '/daycare_weekPlan'
        },
        {
          name: '动态',
          icon: require('@/assets/images/daycare/daycare_clazzPost.png'),
          path: '/daycare_clazzPost'
        },
        {
          name: '云视频',
          icon: require('@/assets/images/daycare/cloud_video.png'),
          path: '/daycare_monitorEquipment'
        },
        {
          name: '家园通知',
          icon: require('@/assets/images/daycare/daycare_cmNoticeManage.png'),
          path: '/daycare_cmNoticeManage'
        }
      ]
    }
  },
  methods: {
    clickGridItem(path) {
      if (path !== '/') {
        this.$router.push(path)
      } else {
        Toast.loading('正在玩命开发中...')
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.item-card {
  margin-bottom: 12px;
  .van-cell {
    padding: 0;
    .van-grid {
      .van-grid-item:nth-child(n+6) {
        /deep/ .van-grid-item__content{
          padding-top: 0;
        }
      }
      /deep/ .van-grid-item__text {
        color: #000;
      }
    }
  }
}
</style>
