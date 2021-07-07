<template>
  <div class="signIn">
    <div class="container">
      <div class="top textLeft">{{ format(currentDate) }}</div>
      <sign-tabs :clazz-list="clazzList" @change="changeClazz" />
      <div class="listTop">
        <div class="inner van-hairline--bottom">
          <div class="left">
            <span>筛选</span>
          </div>
          <div class="right">
            <span class="stateTab" :class="stateIndex === 1 ? 'stateActive' : ''" @click="changeState(1)">未签到</span>
            <span class="stateTab" :class="stateIndex === 2 ? 'stateActive' : ''" @click="changeState(2)">已签到</span>
          </div>
        </div>
      </div>
      <div v-if="stateIndex === 1" class="listBox">
        <div v-if="notEnterList.length" class="list">
          <van-checkbox-group v-model="result" checked-color="#10C2C4">
            <template v-for="(item,index) in notEnterList">
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
          <no-content message="此班级未签到会员列表为空" type="list" />
        </div>
      </div>
      <div v-if="stateIndex === 2" class="listBox">
        <div v-if="enteredList.length" class="list">
          <van-checkbox-group v-model="result" checked-color="#10C2C4">
            <template v-for="(item,index) in enteredList">
              <universal-card
                :key="index"
                :class="item.enterStatus === 'REQUEST_FOR_LEAVE' ? 'requestLeave' : ''"
                :multiple="true"
                :index="item.customerId"
                :icon="item.avatar"
                :name="item.customerName"
                @click.native="confirmChoose(item)"
              >
                <div class="cardRight">
                  <div v-if="item.enterStatus === 'REQUEST_FOR_LEAVE'">
                    <p class="leaveLext">请假</p>
                    <p class="leaveTime">{{ item.enterStatusDescription }}</p>
                  </div>
                  <span v-else :class="item.enterStatus === 'ON_TIME' ? '' : 'abText'">{{ getEnterStatus(item.enterStatus) }}</span>
                </div>
              </universal-card>
            </template>
          </van-checkbox-group>
        </div>
        <div v-else class="noList">
          <no-content message="此班级已签到会员列表为空" type="list" />
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
        <div class="btn" @click="checkOnTime">
          <control-btn text="准时签到" type="primary" :disabled="!result.length" />
        </div>
      </div>
    </div>
    <van-action-sheet
      v-model="showMore"
      :round="false"
      :actions="actions"
      cancel-text="取消"
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
          <div class="btn" @click="saveRemark">
            <control-btn text="确定" type="primary" :disabled="!remarkMsg || !(remarkMsg.trim())" />
          </div>
        </div>
      </div>
    </van-action-sheet>
    <van-action-sheet v-model="showLeave" title="请假" :close-on-click-overlay="false" get-container="#app">
      <div class="leaveAction">
        <div class="content">
          <van-field
            v-model="leaveStart"
            readonly
            required
            label="开始时间"
            input-align="right"
            right-icon="arrow"
            placeholder="请选择开始时间"
            @click="openStartPicker"
          />
          <van-field
            v-model="leaveEnd"
            readonly
            required
            label="结束时间"
            input-align="right"
            right-icon="arrow"
            placeholder="请选择结束时间"
            @click="openEndPicker"
          />
        </div>
        <div class="bottom van-hairline--top">
          <div class="btn" @click="saveLeave">
            <control-btn text="确定" type="primary" :disabled="!leaveStart || !leaveEnd" />
          </div>
        </div>
      </div>
    </van-action-sheet>
    <van-action-sheet
      v-model="showStartPicker"
      get-container="#app"
    >
      <van-datetime-picker
        v-model="startDate"
        type="datetime"
        @cancel="closePicker"
        @confirm="confirmStartDate"
      />
    </van-action-sheet>
    <van-action-sheet
      v-model="showEndPicker"
      get-container="#app"
    >
      <van-datetime-picker
        v-model="endDate"
        type="datetime"
        @cancel="closePicker"
        @confirm="confirmEndDate"
      />
    </van-action-sheet>
  </div>
</template>

<script>
import universalCard from '../../../../components/common/universalCard'
import controlBtn from '../../../../components/common/controlBtn'
import signTabs from '../components/signTabs'
import noContent from '../../../../components/common/noContent'
import { DateFormat } from '../../../../js/rules'
import { getChildClass, getEnterList, addOrUpdateEnter } from '../../../../service/sacc/sacc'

export default {
  name: 'SignIn',
  components: {
    universalCard,
    controlBtn,
    signTabs,
    noContent
  },
  data() {
    return {
      currentDate: new Date(),
      isToday: true,
      clazzList: [],
      clazzId: null,
      stateIndex: 1,
      listData: [],
      notEnterList: [],
      enteredList: [],
      currentItem: {},
      result: [],
      showMore: false,
      actions: [
        { name: '迟到', value: 'late' },
        { name: '缺勤', value: 'absence' },
        { name: '请假', value: 'leave' },
        { name: '考勤备注', value: 'remark' }
      ],
      showRemark: false,
      remarkMsg: null,
      showLeave: false,
      leaveStart: null,
      leaveEnd: null,
      showStartPicker: false,
      showEndPicker: false,
      startDate: new Date(),
      endDate: new Date()
    }
  },
  created() {
    if (this.$route.query.time) {
      this.currentDate = this.$route.query.time
    }
    this.getClazzes()
  },
  methods: {
    // 判断日期
    format(date) {
      const time = DateFormat(date, 'yyyy.MM.dd')
      const today = DateFormat(new Date().toLocaleDateString(), 'yyyy.MM.dd')
      if (time === today) {
        this.isToday = true
        return time + ' (今天)'
      } else {
        this.isToday = false
        return time
      }
    },
    getEnterStatus(state) {
      switch (state) {
        case 'ON_TIME':
          return '已签到'
        case 'BE_LATE':
          return '迟到'
        case 'ABSENCE':
          return '缺勤 '
      }
    },
    // 获取班级列表
    getClazzes() {
      getChildClass().then(res => {
        this.clazzList = res.data.data
        if (this.clazzList.length) {
          this.clazzId = this.clazzList[0].clazzId
          this.getList()
        }
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
    // 获取当前班级的签到及未签到会员列表
    getList() {
      const param = {
        clazzId: this.clazzId,
        attendanceDate: this.currentDate
      }
      getEnterList(param).then(res => {
        this.listData = res.data.data
        this.enteredList = this.listData.enteredList
        this.notEnterList = this.listData.notEnterList
        if (this.result.length) {
          if (this.stateIndex === 1) {
            this.notEnterList.forEach(item => {
              if (this.result[0] === item.customerId) {
                this.currentItem = item
              }
            })
          } else {
            this.enteredList.forEach(item => {
              if (this.result[0] === item.customerId) {
                this.currentItem = item
              }
            })
          }
        }
      })
    },
    changeState(index) {
      this.stateIndex = index
      this.result = []
    },
    // 点击选择会员
    confirmChoose(item) {
      if (this.result.indexOf(item.customerId) === -1) {
        this.result = []
        this.currentItem = item
        this.result.push(item.customerId)
      } else {
        this.currentItem = {}
        this.result = []
      }
    },
    // 准时签到
    checkOnTime() {
      if (this.result.length === 1) {
        this.submitEnter('ON_TIME')
      }
    },
    checkMore() {
      if (this.result.length === 1) {
        this.showMore = true
      }
    },
    onSelect(action) {
      this.showMore = false
      if (action.value === 'late') {
        this.submitEnter('BE_LATE')
      } else if (action.value === 'absence') {
        this.submitEnter('ABSENCE')
      } else if (action.value === 'leave') {
        this.showLeave = true
      } else if (action.value === 'remark') {
        this.showRemark = true
        this.remarkMsg = this.currentItem.enterStatusRemarks
      }
    },
    submitEnter(type, text) {
      let remark
      if (this.remarkMsg && this.remarkMsg.trim()) {
        remark = this.remarkMsg
      } else if (this.currentItem.enterStatusRemarks) {
        remark = this.currentItem.enterStatusRemarks
      }
      const param = {
        enterStatus: type,
        customerId: this.result[0],
        attendanceDate: this.currentDate,
        enterStatusDescription: text,
        enterStatusRemarks: remark
      }
      addOrUpdateEnter(param).then(() => {
        setTimeout(() => {
          this.$toast({
            message: '签入成功',
            duration: 1000,
            icon: 'icon iconfont iconsuccess'
          })
        }, 50)
        setTimeout(() => {
          this.result = []
          this.getList()
        }, 1000)
      })
    },
    // 选择请假开始时间
    openStartPicker() {
      this.showStartPicker = true
    },
    confirmStartDate(time) {
      this.leaveStart = DateFormat(time, 'yyyy.MM.dd hh:mm')
      this.endDate = time
      this.closePicker()
    },
    // 选择请假结束时间
    openEndPicker() {
      this.showEndPicker = true
    },
    confirmEndDate(time) {
      this.leaveEnd = DateFormat(time, 'yyyy.MM.dd hh:mm')
      this.closePicker()
    },
    closePicker() {
      this.showStartPicker = false
      this.showEndPicker = false
    },
    saveLeave() {
      if (!this.leaveStart || !this.leaveEnd) return
      const start = this.leaveStart.replace(/\./g, '/')
      const end = this.leaveEnd.replace(/\./g, '/')
      if (new Date(start).getTime() > new Date(end).getTime()) {
        this.$toast('请假开始时间不能晚于结束时间')
        return
      }
      const text = this.leaveStart + '-' + this.leaveEnd
      this.submitEnter('REQUEST_FOR_LEAVE', text)
      this.showLeave = false
      this.leaveStart = ''
      this.leaveEnd = ''
      this.startDate = new Date()
      this.endDate = new Date()
    },
    saveRemark() {
      if (!this.remarkMsg || !(this.remarkMsg.trim())) return
      const param = {
        customerId: this.result[0],
        attendanceDate: this.currentDate,
        enterStatusRemarks: this.remarkMsg
      }
      if (this.currentItem.enterStatus) {
        param.enterStatus = this.currentItem.enterStatus
        param.enterStatusDescription = this.currentItem.enterStatusDescription
      }
      addOrUpdateEnter(param).then(() => {
        setTimeout(() => {
          this.showRemark = false
          this.remarkMsg = ''
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
    }
  }
}
</script>

<style lang="scss" scoped>

    .signIn {
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

                .requestLeave {
                    /deep/ .cardMsg {
                        max-width: 70px;
                    }

                    /deep/ .rightArea {
                        max-width: 200px;
                    }
                }

                .cardRight {
                    color: $text-5;

                    .leaveLext {
                        line-height: 19px;
                        text-align: right;
                        color: $red;
                    }

                    .leaveTime {
                        line-height: 19px;
                        text-align: right;
                        font-size: 12px;
                        color: $text-9;
                    }

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

    .leaveAction {
        .content {
            padding-bottom: 205px;

            .van-cell {
                padding: 20px 12px;

                &::before {
                    left: 6px;
                }

                &::after {
                    left: 12px !important;
                    right: 12px !important;
                }
            }
        }
    }

    .bottom {
        padding: 10px 12px;
    }
</style>
