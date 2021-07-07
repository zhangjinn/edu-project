<template>
  <div class="leaveCard">
    <div class="top van-hairline--bottom">
      <div class="name">{{ data.customerName }}
        <span class="type" :class="data.leaveType === 'SICK_LEAVE' ? 'sick' : 'matter'">
          {{ data.leaveType === 'SICK_LEAVE' ? '病假' : '事假' }}
        </span>
      </div>
      <div v-if="type === 'approval'" class="progress mainColor">待审核</div>
      <div
        v-else
        class="progress"
        :class="data.status === 'RESCINDED' ? 'labelColor' : data.status === 'PASSED' ? 'greenColor' : 'errorColor'"
      >
        {{ data.status === 'RESCINDED' ? '已撤销' : data.status === 'PASSED' ? '已通过' : '不通过' }}
      </div>
    </div>
    <div class="main textLeft">
      <p>
        <span class="labelColor">提交时间：</span>
        <span>{{ getTime(data.createTime) }}</span>
      </p>
      <p>
        <span class="labelColor">审核流程：</span>
        <span v-if="type === 'approval'">
          {{ getReviewer(data.reviewerIdentity) + '(待审批)' }}
        </span>
        <span v-else>
          {{ data.status === 'RESCINDED' ? data.customerName + '(已撤销)' :
            data.status === 'PASSED' ? (data.finalReviewerName || '--') + '(已同意)' : (data.finalReviewerName || '--') + '(不同意)' }}
        </span>
      </p>
      <div class="leaveTime">
        请假时间：{{ getDate(data.startTime) }} ~ {{ getDate(data.endTime) }}
      </div>
    </div>
  </div>
</template>

<script>
import { DateFormat } from '../../../../js/rules'

export default {
  name: 'LeaveCard',
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
      return DateFormat(time, 'yyyy.MM.dd hh:mm:ss')
    },
    getDate(time) {
      time = parseInt(time)
      return DateFormat(time, 'yyyy.MM.dd')
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
            padding: 16px 0;

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
