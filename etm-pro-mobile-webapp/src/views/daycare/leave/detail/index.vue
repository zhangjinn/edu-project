<template>
  <div class="leaveDetail textLeft">
    <div class="leaveMsg">
      <div class="applicant van-hairline--bottom">
        <div class="avatar">
          <img v-if="leaveData.avatar" :src="leaveData.avatar">
          <div v-else class="noImg textCenter">
            {{ subName(leaveData.childName) }}
          </div>
        </div>
        <div class="accountMsg">
          <p class="name">{{ leaveData.childName }}</p>
          <p class="state">
            请假类型：<span
              class="type"
              :class="
                leaveData.askForLeaveType === 'SICK_LEAVE' ? 'sick' : 'matter'
              "
            >
              {{
                leaveData.askForLeaveType === "SICK_LEAVE"
                  ? "病假"
                  : leaveData.askForLeaveType === "PERSONAL_LEAVE"
                    ? "事假"
                    : "-"
              }}</span>
          </p>
        </div>
        <div class="stateLogo">
          <img
            v-if="leaveData.reviewStatus === 'UNDER_REVIEW'"
            src="../../../../assets/images/unConfirm.png"
          >
          <img
            v-else-if="leaveData.reviewStatus === 'PASS'"
            src="../../../../assets/images/confirmed.png"
          >
          <img
            v-else-if="leaveData.reviewStatus === 'REVOKED'"
            src="../../../../assets/images/canceled.png"
          >
          <img
            v-else-if="leaveData.reviewStatus === 'AUDIT_FAILED'"
            src="../../../../assets/images/fail.png"
          >
        </div>
      </div>
      <div class="msgBox van-hairline--bottom">
        <van-row class="line">
          <van-col :span="5" class="labelColor textRight">申请人：</van-col>
          <van-col :span="19">{{ leaveData.parentName }}</van-col>
        </van-row>
      </div>
      <div class="msgBox">
        <van-row class="line">
          <van-col :span="5" class="labelColor textRight">请假类型：</van-col>
          <van-col :span="19">
            {{
              leaveData.askForLeaveType === "SICK_LEAVE"
                ? "病假"
                : leaveData.askForLeaveType === "PERSONAL_LEAVE"
                  ? "事假"
                  : "-"
            }}
          </van-col>
        </van-row>
        <van-row class="line">
          <van-col :span="5" class="labelColor textRight">申请时间：</van-col>
          <van-col :span="19">{{ getTime(leaveData.createDate) }}</van-col>
        </van-row>
        <van-row class="line">
          <van-col :span="5" class="labelColor textRight">请假事由：</van-col>
          <van-col :span="19">{{
            leaveData.reason ? leaveData.reason : "-"
          }}</van-col>
        </van-row>
        <van-row class="line">
          <van-col :span="5" class="labelColor textRight">请假课程：</van-col>
          <van-col :span="19">
            <div
              v-for="(it, idx) in leaveData.askCourseList"
              :key="'coures_' + idx"
            >
              <p>{{ it.courseName }}</p>
              <p class="cours-time">
                {{ it.courseDate | week }} {{ it.startTime }}-{{ it.endTime }}
              </p>
              <!--              <p class="cours-time">2020-07-19（星期一）10:00-12:00</p>-->
            </div>
          </van-col>
        </van-row>
        <van-row
          v-if="leaveData.image && leaveData.image.length"
          class="line imgArea"
        >
          <van-col :span="5" class="labelColor textRight">图片：</van-col>
          <van-col :span="19">
            <span
              v-for="(img, index) in leaveData.image"
              :key="index"
              class="imgBox"
            >
              <img :src="img.url" @click="showImg(index)">
            </span>
          </van-col>
        </van-row>
        <van-row v-if="leaveData.reviewStatus === 'AUDIT_FAILED'" class="line">
          <van-col :span="24">
            <p class="errorColor">不通过原因</p>
            <p>{{ leaveData.denialReason }}</p>
          </van-col>
        </van-row>
      </div>
    </div>

    <div v-if="leaveData.reviewStatus === 'UNDER_REVIEW'" class="bottomFixed">
      <div class="bottomBtn van-hairline--top">
        <div class="btns">
          <control-btn
            class="btn"
            type="primary"
            text="同意"
            @click.native="leaveData.reviewStatus = 'PASS';leaveData.denialReason = '';confirm()"
          />
          <control-btn
            class="btn default"
            type="default"
            text="不同意"
            @click.native="showDialog = true;"
          />
        </div>
      </div>
    </div>

    <van-dialog
      v-model="showDialog"
      title="不同意"
      show-cancel-button
      confirm-button-color="#10C2C4"
      cancel-button-color="#666666"
      @confirm="leaveData.reviewStatus = 'AUDIT_FAILED';confirm()"
    >
      <div class="content">
        <van-field v-model="leaveData.denialReason" placeholder="请输入不同意原因" type="textarea" required />
      </div>
    </van-dialog>

  </div>
</template>

<script>
/* eslint-disable */
import controlBtn from "../../../../components/common/controlBtn";
import {getLeaveDetail, reviewLeave} from "@/service/daycare/leave";
import {DateFormat} from "../../../../js/rules";
import {ImagePreview} from "vant";

export default {
  name: "Index",
  components: {
    controlBtn,
    [ImagePreview.Component.name]: ImagePreview.Component,
  },
  data() {
    return {
      leaveId: null,
      leaveData: {},
      auditData: {},
      showDialog:false
    };
  },
  created() {
    this.leaveId = this.$route.query.leaveId;
    this.getDetail();
  },
  methods: {
    getDetail() {
      getLeaveDetail(this.leaveId).then(res => {
        console.log(res.data);
        this.leaveData = res.data.data;
      });
    },
    subName(name) {
      if (name && name.length > 2) {
        return name.substring(name.length - 2);
      } else {
        return name;
      }
    },
    getTime(time) {
      if (!time) return "-";
      time = parseInt(time);
      return DateFormat(time, "yyyy-MM-dd hh:mm:ss");
    },
    getDate(time) {
      if (!time) return "-";
      time = parseInt(time);
      return DateFormat(time, "yyyy-MM-dd");
    },
    confirm() {
      // const param = {
      //   leaveRequestId: this.leaveId
      // }
      reviewLeave({askForLeaveId:this.leaveId, ...this.leaveData}).then(() => {
        setTimeout(() => {
          this.$toast({
            message: "操作成功",
            duration: 1000,
            icon: "icon iconfont iconsuccess",
          });
        }, 50);
        setTimeout(() => {
          this.getDetail();
        }, 1000);
      });
    },
    showImg(index) {
      const arr = [];
      this.leaveData.imageList.forEach(item => {
        arr.push(item.url);
      });
      ImagePreview({
        images: arr,
        startPosition: index,
      });
    },
  },
  filters: {
    week(v) {
      if (v) {
        const time = new Date(v + 8 * 3600 * 1000);
        const date = time.toJSON().substr(0, 10);
        const week = [
          "星期日",
          "星期一",
          "星期二",
          "星期三",
          "星期四",
          "星期五",
          "星期六",
        ][time.getDay()];
        return date + " " + week;
      }
    },
  },
};
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
      padding: 20px 0;

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



      .stateLogo {
        position: absolute;
        top: 16px;
        right: 24px;
        width: 67px;
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
          content: "";
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

  .type {
    display: inline-block;
    //width: 38px;
    height: 18px;
    line-height: 18px;
    font-size: 12px;
    text-align: center;

    &.sick {
      color: $red;
    }

    &.matter {
      color: $blue;
    }
  }

  .btns {
    display: flex;
    flex-direction: row;
    width: 100%;

    .btn {
      flex: 30%;
      border-radius: 14px;

      & /deep/ .controlBtnInner[type="default"] {
        border-color: $theme;
        color: $theme;
      }
    }
  }

  .cours-time {
    color: #ccc;
  }
}
</style>
