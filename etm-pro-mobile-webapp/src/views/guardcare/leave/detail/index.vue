<template>
  <div class="leaveDetail textLeft">
    <div class="leaveMsg">
      <div class="stateLogo">
        <img v-if="leaveData.status === 'PENDING_REVIEW'" src="../../../../assets/images/unConfirm.png">
        <img v-else-if="leaveData.status === 'PASSED'" src="../../../../assets/images/confirmed.png">
        <img v-else-if="leaveData.status === 'RESCINDED'" src="../../../../assets/images/canceled.png">
      </div>
      <div class="applicant van-hairline--bottom">
        <div class="avatar">
          <img v-if="leaveData.avatar" :src="leaveData.avatar">
          <div v-else class="noImg textCenter">{{ subName(leaveData.childName) }}</div>
        </div>
        <div class="accountMsg">
          <p class="name">{{ leaveData.childName }}</p>
          <p class="state">
            {{
              leaveData.status === 'PENDING_REVIEW' ? '待确认' :
              leaveData.status === 'PASSED' ? '已确认' :
              leaveData.status === 'RESCINDED' ? '已撤销' : ''
            }}
          </p>
        </div>
      </div>
      <div class="msgBox van-hairline--bottom">
        <van-row class="line">
          <van-col :span="5" class="labelColor textRight">请假类型：</van-col>
          <van-col :span="19">
            <span :class="leaveData.leaveType === 'SICK_LEAVE' ? 'errorColor' : 'blueColor'">
              {{
                leaveData.leaveType === 'SICK_LEAVE' ? '病假' :
                leaveData.leaveType === 'LEAVE' ? '事假' : '-'
              }}
            </span>
          </van-col>
        </van-row>
        <van-row class="line">
          <van-col :span="5" class="labelColor textRight">开始时间：</van-col>
          <van-col :span="19">{{ getDate(leaveData.startTime) }}</van-col>
        </van-row>
        <van-row class="line">
          <van-col :span="5" class="labelColor textRight">结束时间：</van-col>
          <van-col :span="19">{{ getDate(leaveData.endTime) }}</van-col>
        </van-row>
      </div>
      <div class="msgBox">
        <van-row class="line">
          <van-col :span="5" class="labelColor textRight">请假事由：</van-col>
          <van-col :span="19">{{ leaveData.leaveReason ? leaveData.leaveReason : '-' }}</van-col>
        </van-row>
        <van-row class="line">
          <van-col :span="5" class="labelColor textRight">申请时间：</van-col>
          <van-col :span="19">{{ getTime(leaveData.createTime) }}</van-col>
        </van-row>
        <!--        <van-row class="line">-->
        <!--          <van-col :span="5" class="labelColor textRight">申请人：</van-col>-->
        <!--          <van-col :span="19">{{ leaveData.applicant }}</van-col>-->
        <!--        </van-row>-->
        <van-row v-if="leaveData.imageList && leaveData.imageList.length" class="line imgArea">
          <van-col :span="19" :offset="5">
            <span v-for="(img,index) in leaveData.imageList" :key="index" class="imgBox">
              <img :src="img.url" @click="showImg(index)">
            </span>
          </van-col>
        </van-row>
      </div>
    </div>
    <div v-if="leaveData.status === 'PENDING_REVIEW'" class="bottomFixed">
      <div class="bottomBtn van-hairline--top">
        <div class="btn" @click="confirm">
          <control-btn type="primary" text="确认" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import controlBtn from '../../../../components/common/controlBtn'
import { getLeaveDetail, reviewLeave } from '../../../../service/guardcare/leave'
import { DateFormat } from '../../../../js/rules'
import { ImagePreview } from 'vant'

export default {
  name: 'Index',
  components: {
    controlBtn,
    [ImagePreview.Component.name]: ImagePreview.Component
  },
  data() {
    return {
      leaveId: null,
      leaveData: {},
      auditData: {}
    }
  },
  created() {
    this.leaveId = this.$route.query.leaveId
    this.getDetail()
  },
  methods: {
    getDetail() {
      getLeaveDetail(this.leaveId).then(res => {
        this.leaveData = res.data.data
      })
    },
    subName(name) {
      if (name && name.length > 2) {
        return name.substring(name.length - 2)
      } else {
        return name
      }
    },
    getTime(time) {
      if (!time) return '-'
      time = parseInt(time)
      return DateFormat(time, 'yyyy.MM.dd hh:mm:ss')
    },
    getDate(time) {
      if (!time) return '-'
      time = parseInt(time)
      return DateFormat(time, 'yyyy.MM.dd')
    },
    confirm() {
      const param = {
        leaveRequestId: this.leaveId
      }
      reviewLeave(param).then(() => {
        setTimeout(() => {
          this.$toast({
            message: '操作成功',
            duration: 1000,
            icon: 'icon iconfont iconsuccess'
          })
        }, 50)
        setTimeout(() => {
          this.getDetail()
        }, 1000)
      })
    },
    showImg(index) {
      const arr = []
      this.leaveData.imageList.forEach(item => {
        arr.push(item.url)
      })
      ImagePreview({
        images: arr,
        startPosition: index
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.leaveDetail {
  min-height: calc(100vh - 50px);
  background-color: $white;

  .leaveMsg {
    position: relative;
    padding: 0 12px;

    .stateLogo {
      position: absolute;
      top: 16px;
      right: 24px;
      width: 67px;
    }

    .applicant {
      display: flex;
      padding: 12px 0;

      .avatar {
        @include round(35px);
        overflow: hidden;

        .noImg {
          height: 35px;
          font-size: 13px;
          line-height: 35px;
          color: $white;
          background-color: $theme;
        }
      }

      .accountMsg {
        margin-left: 15px;

        .name {
          font-size: 15px;
          line-height: 15px;
        }

        .state {
          margin-top: 7px;
          font-size: 13px;
          line-height: 13px;
          color: $text-9;
        }
      }
    }

    .msgBox {
      padding: 16px 0;

      .line {
        font-size: 14px;

        &:not(:first-child) {
          margin-top: 12px;
        }

        .labelColor {
          display: inline-block;
        }
      }

      .imgArea {

        .imgBox {
          display: inline-block;
          margin: 0 15px 8px 0;
          width: 70px;
          height: 70px;
          @include border-radius(2px);
        }
      }
    }
  }

  .centerLine {
    height: 12px;
    background-color: $bg-5;
  }

  .approveMsg {
    padding: 16px 12px;

    .step {
      position: relative;
      padding-left: 15px;

      .dot {
        position: absolute;
        left: 0;
        top: 4px;
        @include round(6px);
        background-color: $theme;

        &.failBg {
          background-color: $red;
        }
      }

      .approveSate {
        height: 14px;
        font-size: 14px;
        line-height: 14px;
      }

      .approveTime {
        margin-top: 12px;
        font-size: 13px;
        line-height: 13px;
        color: $text-9;
      }
    }

    .first {
      margin-bottom: 48px;

      &:not(:last-child) {
        &::before {
          display: inline-block;
          position: absolute;
          left: 2.5px;
          top: 10px;
          content: '';
          width: 1px;
          height: 81px;
          background-color: $theme;
        }
      }

    }
  }

  .content {
    .van-cell {
      padding: 20px 16px;
    }
  }
}
</style>
