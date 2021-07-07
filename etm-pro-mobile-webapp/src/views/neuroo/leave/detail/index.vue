<template>
  <div class="leaveDetail textLeft" :class="!hidshow ? 'hidShow' : ''">
    <div class="leaveMsg">
      <div class="stateLogo">
        <img v-if="leaveData.status === 'PENDING_REVIEW'" src="../../../../assets/images/approving.png">
        <img v-else-if="leaveData.status === 'FAIL'" src="../../../../assets/images/noPass.png">
        <img v-else-if="leaveData.status === 'PASSED'" src="../../../../assets/images/pass.png">
        <img v-else-if="leaveData.status === 'RESCINDED'" src="../../../../assets/images/canceled.png">
      </div>
      <div class="applicant van-hairline--bottom">
        <div class="avatar">
          <img v-if="leaveData.avatar" :src="leaveData.avatar">
          <div v-else class="noImg textCenter">{{ subName(leaveData.customerName) }}</div>
        </div>
        <div class="accountMsg">
          <p class="name">{{ leaveData.customerName }}</p>
          <p class="state">
            {{
              leaveData.status === 'PENDING_REVIEW' ? '待审核' :
              leaveData.status === 'FAIL' ? '不通过' :
              leaveData.status === 'PASSED' ? '已通过' :
              leaveData.status === 'RESCINDED' ? '已撤销' : ''
            }}
          </p>
        </div>
      </div>
      <div class="msgBox van-hairline--bottom">
        <van-row class="line">
          <van-col :span="5" class="labelColor textRight">请假类型：</van-col>
          <van-col :span="19">
            {{
              leaveData.leaveType === 'SICK_LEAVE' ? '病假' :
              leaveData.leaveType === 'LEAVE' ? '事假' : '-'
            }}
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
        <van-row class="line">
          <van-col :span="5" class="labelColor textRight">请假时长：</van-col>
          <van-col :span="19">{{ leaveData.length }}天</van-col>
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
        <van-row v-if="leaveData.imageInfos && leaveData.imageInfos.length" class="line imgArea">
          <van-col :span="5" class="labelColor textRight">图片：</van-col>
          <van-col :span="19">
            <span v-for="(item,index) in leaveData.imageInfos" :key="index" class="imgBox">
              <img :src="item.url" @click="showImg(index)">
            </span>
          </van-col>
        </van-row>
      </div>
    </div>
    <div class="centerLine" />
    <div class="approveMsg">
      <template v-if="leaveData.status === 'PENDING_REVIEW'">
        <div v-for="(list, index) in auditList" :key="index" class="first step">
          <span class="dot" />
          <p class="approveSate">{{ list.reviewerName }}(已审核）</p>
          <p class="approveTime">{{ getTime(list.createTime) }}</p>
        </div>
        <div class="first step">
          <span class="dot" />
          <p class="approveSate errorColor">
            {{ '等待' + leaveData.tagCode + '审核' }}
          </p>
        </div>
      </template>
      <template v-else-if="leaveData.status === 'RESCINDED'">
        <div class="first step">
          <span class="dot" />
          <p class="approveSate" :class="getClass(leaveData.status)">
            {{ leaveData.customerName + '(已撤销)' }}
          </p>
        </div>
      </template>
      <template v-else>
        <div v-for="(list, index) in auditList" :key="index" class="first step">
          <span class="dot" :class="list.auditResults === 'DISAGREE' ? 'failBg' : ''" />
          <p class="approveSate" :class="getClass(list.auditResults)">
            {{
              list.auditResults === 'DISAGREE' ? list.reviewerName + '(不通过)' :
              list.auditResults === 'AGREE' ? list.reviewerName + '(已审核)' : ''
            }}
          </p>
          <p class="approveTime">{{ getTime(list.createTime) }}</p>
        </div>
      </template>
    </div>
    <div v-if="leaveData.auditMark" v-show="hidshow" class="bottomFixed">
      <div class="bottomBtn van-hairline--top">
        <div class="btn" @click="noPass">
          <control-btn type="cancel" text="不同意" />
        </div>
        <div class="btn" @click="pass">
          <control-btn type="primary" text="同意" />
        </div>
      </div>
    </div>
    <van-dialog
      v-model="showDialog"
      title="不同意"
      show-cancel-button
      confirm-button-color="#10C2C4"
      cancel-button-color="#666666"
      @confirm="confirmDialog"
    >
      <div class="content">
        <van-field v-model="refuseReason" placeholder="请输入不同意原因" type="textarea" required />
      </div>
    </van-dialog>
  </div>
</template>

<script>
import controlBtn from '../../../../components/common/controlBtn'
import { getLeaveDetail, reviewLeave } from '../../../../service/neuroo/leave'
import { DateFormat } from '../../../../js/rules'
import { ImagePreview } from 'vant'

export default {
  name: 'Index',
  components: {
    controlBtn,
    [ImagePreview.Component.name]: ImagePreview.Component
  },
  inject: ['reload'],
  data() {
    return {
      leaveId: null,
      leaveData: {},
      auditList: [],
      auditData: {},
      showDialog: false,
      refuseReason: ''
    }
  },
  computed: {
    hidshow() {
      return this.$store.state.show.showBottom
    }
  },
  created() {
    this.leaveId = this.$route.query.leaveId
    this.getDetail()
  },
  methods: {
    getDetail() {
      const param = {
        leaveRequestId: this.leaveId
      }
      getLeaveDetail(param).then(res => {
        this.leaveData = res.data.data
        this.auditList = this.leaveData.leaveAuditRecordList
        if (this.auditList.length) {
          this.auditData = this.auditList[this.auditList.length - 1]
        }
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
    getClass(status) {
      switch (status) {
        case 'PENDING_REVIEW':
          return 'errorColor'
        case 'FAIL':
          return 'errorColor'
        case 'PASSED':
          return ''
        case 'RESCINDED':
          return 'labelColor'
        case 'DISAGREE':
          return 'errorColor'
        case 'AGREE':
          return ''
      }
    },
    noPass() {
      this.showDialog = true
    },
    confirmDialog() {
      if (!this.refuseReason && !this.refuseReason.trim()) return
      const param = {
        leaveRequestId: this.leaveId,
        audit: 'DISAGREE',
        failureReason: this.refuseReason
      }
      this.showDialog = false
      this.submit(param)
    },
    pass() {
      const param = {
        leaveRequestId: this.leaveId,
        audit: 'AGREE'
      }
      this.submit(param)
    },
    submit(data) {
      reviewLeave(data).then(() => {
        setTimeout(() => {
          this.$toast({
            message: '操作成功',
            duration: 1000,
            icon: 'icon iconfont iconsuccess'
          })
        }, 50)
        setTimeout(() => {
          this.reload()
        }, 1000)
      })
    },
    showImg(index) {
      const arr = []
      this.leaveData.imageInfos.forEach(item => {
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

        &.hidShow {
            min-height: 100vh;
        }

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
