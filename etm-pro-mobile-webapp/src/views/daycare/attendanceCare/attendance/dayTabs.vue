<template>
  <div class="dayStatictics">
    <div class="circleBox">
      <div class="locationBox">
        <van-circle
          v-model="attendanceData.rate"
          :rate="attendanceData.rate"
          :color="circleColor"
          layer-color="#EEEEEE"
          :stroke-width="90"
          :size="'5.6rem'"
        />
        <div class="countBox">
          <p class="count">
            <span class="mainColor">{{ attendanceData.actuallyNum || 0 }}</span>/{{ attendanceData.shouldNum || 0 }}
          </p>
          <p class="countText">实到人数/应到人数</p>
        </div>
      </div>
    </div>
    <div class="counts van-hairline--top">
      <van-row>
        <van-col :span="8" @click="toList('leave')">
          <div>
            <span class="icon">
              <img src="../../../../assets/images/leaveIcon.png">
            </span>
          </div>
          <div class="num mainColor">{{ attendanceData.askNum || 0 }}</div>
          <div class="txt">请假人次</div>
        </van-col>
        <van-col :span="8" @click="toList('arrive')">
          <div>
            <span class="icon">
              <img src="../../../../assets/images/arriveIcon.png">
            </span>
          </div>
          <div class="num enterColor">
            {{ attendanceData.attendanceNum || 0 }}
          </div>
          <div class="txt">已考勤人次</div>
        </van-col>
        <van-col :span="8" @click="toList('notArrive')">
          <div>
            <span class="icon">
              <img src="../../../../assets/images/noArriveIcon.png">
            </span>
          </div>
          <div class="num errorColor">{{ attendanceData.absentNum || 0 }}</div>
          <div class="txt">未考勤人次</div>
        </van-col>
      </van-row>
    </div>
    <drag-button
      text="考勤"
      type="primary"
      icon-direction="right"
      position="right"
      :top="348"
      @click="toEndorsement"
    />
  </div>
</template>

<script>
import dragButton from '../../../../components/common/dragButton'

export default {
  name: 'DayStatictics',
  components: {
    dragButton
  },
  props: {
    attendanceData: {
      type: Object,
      default() {
        return {}
      }
    },
    date: {
      type: String,
      default() {
        return null
      }
    }
  },
  computed: {
    circleColor() {
      if (this.attendanceData.rate === 0) {
        return '#EEEEEE'
      } else if (this.attendanceData.rate > 50) {
        return '#10C2C4'
      } else {
        return '#F53939'
      }
    }
  },
  methods: {
    // 到统计明细页
    toList(type) {
      // this.$store.commit('guardcare/SET_ACTIVE', type)
      this.$router.push({
        path: '/daycare_care_statisticsDay',
        query: {
          courseManagementId: this.attendanceData.id,
          tabActiveType: type,
          date: this.date
        }
      })
    },
    // 去补签
    toEndorsement() {
      this.$router.push({
        path: '/daycare_care_endorsement',
        query: {
          grade: this.gradeId,
          date: this.date
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.dayStatictics {
  .circleBox {
    padding: 24px 0 60px;

    .locationBox {
      position: relative;

      .countBox {
        position: absolute;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        margin: auto;
        width: 150px;
        height: 56px;

        .count {
          font-size: 36px;
          line-height: 36px;
        }

        .countText {
          margin-top: 7px;
          font-size: 13px;
          line-height: 13px;
          color: $text-9;
        }
      }
    }
  }

  .counts {
    padding: 30px 0 50px;

    .icon {
      display: inline-block;
      width: 20px;
      height: 20px;
    }

    .num {
      margin: 12px 0;
      font-size: 24px;

      &.enterColor {
        color: $green;
      }
    }

    .txt {
      font-size: 13px;
      color: $text-5;
    }
  }
}
</style>
