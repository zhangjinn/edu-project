<template>
  <div class="signOut">
    <div class="container">
      <div class="top textLeft">{{ format(currentDate) }}</div>
      <sign-tabs :clazz-list="clazzList" @change="changeClazz" />
      <div class="listTop">
        <div class="inner van-hairline--bottom">
          <div class="left">
            <span>筛选</span>
          </div>
          <div class="right">
            <span
              class="stateTab"
              :class="stateIndex === 1 ? 'stateActive' : ''"
              @click="changeState(1)"
            >在园</span>
            <span class="stateTab" :class="stateIndex === 2 ? 'stateActive' : ''" @click="changeState(2)">已离园</span>
          </div>
        </div>
      </div>
      <div v-if="stateIndex === 1" class="listBox">
        <div v-if="notLeaveList.length" class="list">
          <van-checkbox-group v-model="result" checked-color="#10C2C4">
            <template v-for="(item,index) in notLeaveList">
              <universal-card
                :key="index"
                :multiple="true"
                :index="item.customerId"
                :icon="item.avatar"
                :name="item.customerName"
                @click.native="confirmChoose(item)"
              />
            </template>
          </van-checkbox-group>
        </div>
        <div v-else class="noList">
          <no-content message="此班级在园会员列表为空" type="list" />
        </div>
      </div>
      <div v-else class="listBox">
        <div v-if="leftList.length" class="list">
          <van-checkbox-group v-model="result" checked-color="#10C2C4">
            <template v-for="(item,index) in leftList">
              <universal-card
                :key="index"
                :multiple="true"
                :index="item.customerId"
                :icon="item.avatar"
                :name="item.customerName"
                @click.native="confirmChoose(item)"
              >
                <div class="cardRight">
                  <span :class="item.leaveStatus === 'LEAVE_EARLY' ? 'abText' : ''">{{ getLeaveStatus(item.leaveStatus) }}</span>
                  <span v-if="item.leaveStatusDescription">{{ item.leaveStatusDescription }}</span>
                  <span v-if="item.leaveSurrogate">({{ item.leaveSurrogate }})</span>
                </div>
              </universal-card>
            </template>
          </van-checkbox-group>
        </div>
        <div v-else class="noList">
          <no-content message="此班级离园会员列表为空" type="list" />
        </div>
      </div>
    </div>
    <div class="footer">
      <div class="fixed van-hairline--top">
        <div class="btn" @click="checkMore">
          <control-btn
            text="更多"
            :type="result.length !== 1 ? 'cancel' : 'info'"
            :disabled="result.length !== 1"
          />
        </div>
        <div class="btn" @click="signOnTime">
          <control-btn text="按时签出" type="primary" :disabled="result.length !== 1" />
        </div>
      </div>
    </div>
    <van-action-sheet
      v-model="showMore"
      :round="false"
      :actions="actions"
      cancel-text="取消"
      :close-on-click-overlay="false"
      get-container="#app"
      @select="onSelect"
    />
    <van-action-sheet v-model="showRemark" title="考勤备注" :close-on-click-overlay="false" get-container="#app">
      <div class="remarkAction">
        <div class="content">
          <van-field
            v-model="remarkMsg"
            rows="10"
            autosize
            type="textarea"
            placeholder="请输入备注"
          />
        </div>
        <div class="bottom">
          <div class="btn" @click="submitRemark">
            <control-btn text="确定" type="primary" :disabled="!remarkMsg || !(remarkMsg.trim())" />
          </div>
        </div>
      </div>
    </van-action-sheet>
    <!--    延长签出-->
    <van-action-sheet v-model="showExtend" title="延长签出" :close-on-click-overlay="false" get-container="#app">
      <div class="extendAction">
        <div class="content">
          <van-field
            v-model="extendTime"
            readonly
            input-align="left"
            right-icon="arrow"
            placeholder="请选择时长"
            @click="openTimePicker"
          />
          <van-field
            v-model="extendParent"
            readonly
            input-align="left"
            right-icon="arrow"
            placeholder="请选择接送人"
            @click="openParentPicker('extend')"
          />
        </div>
        <div class="bottom">
          <div class="btn" @click="submitExtend">
            <control-btn text="确定" type="primary" :disabled="!extendTime || !extendParent" />
          </div>
        </div>
      </div>
    </van-action-sheet>
    <!--    准时签出或早退-->
    <van-action-sheet
      v-model="showOnTime"
      :title="actionTitle"
      :close-on-click-overlay="false"
      get-container="#app"
    >
      <div class="onTimeAction">
        <div class="content">
          <van-field
            v-model="onTimeParent"
            readonly
            input-align="left"
            right-icon="arrow"
            placeholder="请选择接送人"
            @click="openParentPicker('onTime')"
          />
          <van-cell />
        </div>
        <div class="bottom">
          <div class="btn" @click="submitOnTime">
            <control-btn text="确定" type="primary" :disabled="!onTimeParent" />
          </div>
        </div>
      </div>
    </van-action-sheet>
    <!--    选择延长签出时间-->
    <van-action-sheet
      v-model="showExtendTime"
      :round="false"
      :actions="extendActions"
      cancel-text="取消"
      :close-on-click-overlay="false"
      get-container="#app"
      @select="confirmExtend"
    />
    <!--    选择接送人-->
    <van-action-sheet
      v-model="showExtendParent"
      :round="false"
      :actions="parentActions"
      cancel-text="取消"
      :close-on-click-overlay="false"
      get-container="#app"
      @select="confirmParent"
    />
  </div>
</template>

<script>
import signTabs from '../components/signTabs'
import universalCard from '../../../../components/common/universalCard'
import controlBtn from '../../../../components/common/controlBtn'
import noContent from '../../../../components/common/noContent'
import { DateFormat } from '../../../../js/rules'
import { getChildClass, getLeaveList, addOrUpdateLeave, getSurrogate } from '../../../../service/sacc/sacc'

export default {
  name: 'SignOut',
  components: {
    signTabs,
    universalCard,
    controlBtn,
    noContent
  },
  data() {
    return {
      currentDate: new Date(),
      clazzList: [],
      clazzId: '',
      stateIndex: 1,
      listData: [],
      notLeaveList: [],
      leftList: [],
      result: [],
      currentItem: {},
      showMore: false,
      actions: [
        { name: '延长签出', value: 'delay' },
        { name: '早退', value: 'early' },
        { name: '考勤备注', value: 'remark' }
      ],
      showRemark: false,
      remarkMsg: '',
      showExtend: false,
      extendTime: '',
      extendParent: '',
      showOnTime: false,
      actionTitle: '',
      onTimeParent: '',
      signOutType: 'extend',
      showExtendTime: false,
      extendActions: [
        { name: '1小时' },
        { name: '2小时' },
        { name: '3小时' },
        { name: '4小时' },
        { name: '5小时' }
      ],
      showExtendParent: false,
      parentActions: [],
      leaveSurrogate: ''
    }
  },
  created() {
    this.currentDate = this.$route.query.time
    this.getClazzes()
  },
  methods: {
    // 判断日期
    format(date) {
      const time = DateFormat(date, 'yyyy.MM.dd')
      const today = DateFormat(new Date().toLocaleDateString(), 'yyyy.MM.dd')
      if (time === today) {
        return time + ' (今天)'
      } else {
        return time
      }
    },
    getLeaveStatus(status) {
      switch (status) {
        case 'ON_TIME':
          return '按时签出'
        case 'LEAVE_EARLY':
          return '早退'
        case 'DELAY':
          return '延长签出'
      }
    },
    // 获取班级列表
    getClazzes() {
      getChildClass().then(res => {
        this.clazzList = res.data.data
        this.clazzId = this.clazzList[0].clazzId
        this.getList()
      })
    },
    // 切换班级
    changeClazz(val) {
      if (this.clazzId === val.clazzId) return
      this.clazzId = val.clazzId
      // this.stateIndex = 1
      this.result = []
      this.getList()
    },
    // 切换在园或已离园
    changeState(index) {
      this.stateIndex = index
      this.result = []
    },
    // 获取当前班级的在园及已离园会员列表
    getList() {
      const param = {
        clazzId: this.clazzId,
        attendanceDate: this.currentDate
      }
      getLeaveList(param).then(res => {
        this.listData = res.data.data
        this.notLeaveList = this.listData.notLeaveList
        this.leftList = this.listData.leftList
        if (this.result.length) {
          if (this.stateIndex === 1) {
            this.notLeaveList.forEach(item => {
              if (this.result[0] === item.customerId) {
                this.currentItem = item
              }
            })
          } else {
            this.leftList.forEach(item => {
              if (this.result[0] === item.customerId) {
                this.currentItem = item
              }
            })
          }
        }
      })
    },
    confirmChoose(item) {
      if (this.result.indexOf(item.customerId) === -1) {
        this.result = []
        this.result.push(item.customerId)
        this.currentItem = item
      } else {
        this.result = []
        this.currentItem = {}
      }
    },
    checkMore() {
      if (this.result.length === 1) {
        this.showMore = true
      }
    },
    onSelect(action) {
      this.showMore = false
      if (action.value === 'delay') {
        this.getCustomerSurrogate()
        this.showExtend = true
      } else if (action.value === 'early') {
        this.getCustomerSurrogate()
        this.showOnTime = true
        this.actionTitle = '早退'
      } else if (action.value === 'remark') {
        this.showRemark = true
        this.remarkMsg = this.currentItem.leaveStatusRemarks
      }
    },
    getCustomerSurrogate() {
      const param = {
        customerId: this.result[0]
      }
      getSurrogate(param).then(res => {
        const data = res.data.data
        this.parentActions = []
        data.forEach(item => {
          const name = item.name + (item.contactTypeName ? '-' + item.contactTypeName : '')
          const action = {
            name: name
          }
          this.parentActions.push(action)
        })
      })
    },
    openTimePicker() {
      this.showExtendTime = true
    },
    confirmExtend(val) {
      this.showExtendTime = false
      this.extendTime = val.name
    },
    signOnTime() {
      if (this.result.length === 1) {
        this.getCustomerSurrogate()
        this.showOnTime = true
        this.actionTitle = '按时签出'
      }
    },
    submitOnTime() {
      if (!this.onTimeParent) return
      this.showOnTime = false
      this.leaveSurrogate = this.onTimeParent
      if (this.actionTitle === '按时签出') {
        this.submitLeave('ON_TIME')
      } else {
        this.submitLeave('LEAVE_EARLY')
      }
    },
    submitRemark() {
      if (!this.remarkMsg || !(this.remarkMsg.trim())) return
      const param = {
        customerId: this.result[0],
        leaveStatusRemarks: this.remarkMsg,
        attendanceDate: this.currentDate
      }
      if (this.currentItem.leaveStatus) {
        param.leaveStatus = this.currentItem.leaveStatus
        param.leaveStatusDescription = this.currentItem.leaveStatusDescription
        param.leaveSurrogate = this.currentItem.leaveSurrogate
      }
      addOrUpdateLeave(param).then(() => {
        this.showRemark = false
        setTimeout(() => {
          this.$toast({
            message: '添加备注成功',
            duration: 1000,
            icon: 'icon iconfont iconsuccess'
          })
        }, 50)
        setTimeout(() => {
          this.getList()
        }, 1000)
      })
    },
    submitExtend() {
      if (!this.extendTime || !this.extendParent) return
      this.leaveSurrogate = this.extendParent
      this.submitLeave('DELAY', this.extendTime)
      this.showExtend = false
    },
    submitLeave(type, time) {
      let remark
      if (this.remarkMsg && this.remarkMsg.trim()) {
        remark = this.remarkMsg
      } else if (this.currentItem.enterStatusRemarks) {
        remark = this.currentItem.enterStatusRemarks
      }
      const param = {
        customerId: this.result[0],
        leaveSurrogate: this.leaveSurrogate,
        leaveStatusDescription: time,
        leaveStatus: type,
        attendanceDate: this.currentDate,
        leaveStatusRemarks: remark
      }
      addOrUpdateLeave(param).then(() => {
        setTimeout(() => {
          this.$toast({
            message: '签出成功',
            duration: 1000,
            icon: 'icon iconfont iconsuccess'
          })
        }, 50)
        setTimeout(() => {
          this.result = []
          this.onTimeParent = null
          this.getList()
        }, 1000)
      })
    },
    openParentPicker(type) {
      this.signOutType = type
      this.showExtendParent = true
    },
    confirmParent(val) {
      this.showExtendParent = false
      if (this.signOutType === 'extend') {
        this.extendParent = val.name
      } else {
        this.onTimeParent = val.name
      }
    }
  }
}
</script>

<style lang="scss" scoped>

    .signOut {
        .container {
            background-color: $white;

            .top {
                padding: 15px 12px 0;
            }

            .listTop {
                padding: 0 12px;

                .inner {
                    padding: 10px 0;
                    overflow: hidden;

                    span {
                        display: inline-block;
                        line-height: 30px;
                        font-size: 14px;
                        color: $text-6;
                    }

                    .stateTab {

                        &:not(:last-child) {
                            margin-right: 30px;
                        }

                        &.stateActive {
                            position: relative;
                            color: $text-2;

                            &::after {
                                display: inline-block;
                                position: absolute;
                                left: 0;
                                right: 0;
                                bottom: -10px;
                                z-index: 11;
                                margin: 0 auto;
                                content: '';
                                @include wh(20px, 2px);
                                background-color: $text-2;
                            }
                        }
                    }
                }
            }

            .listBox {
                .list {
                    max-height: calc(100vh - 246px);
                    overflow-y: auto;
                }

                .noList {
                    padding-top: 100px;
                    height: calc(100vh - 246px);
                }

                .cardRight {
                    color: $text-6;

                    .abText {
                        color: $red;
                    }
                }
            }
        }

        .footer {
            height: 64px;

            .fixed {
                position: fixed;
                bottom: 50px;
                left: 0;
                z-index: 111;
                padding: 10px 12px;
                width: 100%;
                height: 64px;
                background-color: $white;

                .btn {
                    display: inline-block;

                    &:first-child {
                        margin-right: 10px;
                        width: 113px;
                    }

                    &:last-child {
                        width: calc(100% - 123px);
                    }
                }
            }
        }
    }

    /deep/ .van-action-sheet__header {
        text-align: left;
        text-indent: 12px;
        color: $text-2;
    }

    .remarkAction {
        .content {
            .van-cell {
                padding: 10px 12px 80px;
            }
        }
    }

    .extendAction {
        .content {
            padding-bottom: 205px;

            .van-cell {
                padding: 20px 12px;

                &::after {
                    left: 12px !important;
                    right: 12px !important;
                }
            }
        }
    }

    .onTimeAction {
        .content {
            .van-cell {
                &:first-child {
                    padding: 20px 12px;

                    &::after {
                        left: 12px !important;
                        right: 12px !important;
                    }
                }

                &:last-child {
                    padding: 133px 12px;

                    &::after {
                        left: 0 !important;
                        right: 0 !important;
                    }
                }
            }
        }
    }

    .bottom {
        padding: 10px 12px;
    }
</style>
