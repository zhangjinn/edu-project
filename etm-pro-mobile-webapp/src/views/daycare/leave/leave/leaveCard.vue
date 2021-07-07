<template>
  <div class="leaveCard">
    <div class="top van-hairline--bottom">
      <div class="name">
        {{ data.childName }}
        <span
          class="type"
          :class="data.askForLeaveType === 'SICK_LEAVE' ? 'sick' : 'matter'"
        >
          {{ data.askForLeaveType === "SICK_LEAVE" ? "病假" : "事假" }}
        </span>
      </div>
      <div
        class="progress"
        :class="
          data.reviewStatus === 'REVOKED'
            ? 'labelColor'
            : data.reviewStatus === 'PASS'
              ? 'greenColor'
              :data.reviewStatus === 'AUDIT_FAILED'
                ?'errorColor': 'mainColor'
        "
      >
        {{
          data.reviewStatus === "REVOKED"
            ? "已撤销"
            : data.reviewStatus === "PASS"
              ? "已确认"
              :data.reviewStatus === "AUDIT_FAILED"
                ? "不通过" : "待确认"
        }}
      </div>
    </div>
    <div class="main textLeft">
      <div>
        <span class="labelColor">请假课程：</span>
        <span>{{ data.askCourseList | course }}</span>
      </div>
      <div>
        <span class="labelColor">提交时间：</span>
        <span>{{ getTime(data.createDate) }}</span>
      </div>
    </div>
  </div>
</template>

<script>
import { DateFormat } from '../../../../js/rules'

export default {
  name: 'LeaveCard',
  filters: {
    course(v) {
      let str = ''
      v.forEach((it, i) => {
        if (i === v.length - 1) {
          str += it.courseName
        } else {
          str += it.courseName + '/'
        }
      })
      return str
    }
  },
  props: {
    data: {
      type: Object,
      default() {
        return {}
      }
    },
    type: {
      type: String,
      default() {
        return null
      }
    }
  },
  methods: {
    getClass(status) {
      switch (status) {
        case 'FAIL':
          return 'errorColor'
        case 'PASSED':
          return 'greenColor'
        case 'RESCINDED':
          return 'labelColor'
      }
    },
    getReviewer(identity) {
      if (!identity) return '--'
      switch (identity) {
        case 'TEACHER':
          return '老师'
        case 'HEAD_TEACHER':
          return '班主任'
        case 'DEAN':
          return '教务主任'
        case 'REGIONAL_MANAGER':
          return '区域经理'
        case 'PRINCIPAL':
          return '园长'
      }
    },
    getTime(time) {
      time = parseInt(time)
      return DateFormat(time, 'yyyy-MM-dd hh:mm:ss')
    },
    getDate(time) {
      time = parseInt(time)
      return DateFormat(time, 'yyyy-MM-dd')
    }
  }
}
</script>

<style lang="scss" scoped>
.leaveCard {
  padding: 0 12px;
  background-color: $white;
  @include border-radius(3px);

  &:not(:first-child) {
    margin-top: 12px;
  }

  .top {
    display: flex;
    justify-content: space-between;
    height: 50px;
    line-height: 50px;

    .name {
      font-size: 16px;

      .type {
        display: inline-block;
        margin-left: 4px;
        width: 38px;
        height: 19px;
        line-height: 19px;
        font-size: 12px;

        &.sick {
          color: $red;
          background-color: $redLight;
        }

        &.matter {
          color: $blue;
          background-color: $blueLight;
        }
      }
    }

    .progress {
      font-size: 14px;
    }
  }

  .main {
    padding: 10px 0;

    div {
      margin: 5px 0;
    }

    p {
      margin-bottom: 12px;
      font-size: 14px;
    }

    .leaveTime {
      padding: 12px;
      font-size: 14px;
      background-color: $bg-9;
      @include border-radius(3px);
    }
  }
}
</style>
