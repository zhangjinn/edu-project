<template>
  <div class="sign-wrap">
    <div
      v-if="state === 'attendance'"
      class="attendanceBox"
    >
      <div class="imgBox">
        <img src="../../../../assets/images/guardcare/attendance_bg.png">
      </div>
    </div>
    <div
      v-else-if="state === 'success'"
      class="successBox"
    >
      <div class="imgBox">
        <img src="../../../../assets/images/guardcare/attendance_success.png">
        <div class="stateBox">
          {{ attendanceData.resultStatus === 'IN' ? '早上好' : '放学啦' }}
        </div>
        <div class="msgBox">
          <div class="list">
            <div class="avatar">
              <img
                v-if="attendanceData.childAvatar"
                :src="attendanceData.childAvatar"
              >
              <span
                v-else
                class="iconfont iconmorentouxiang"
              />
            </div>
            <div class="rightBox">
              <div class="name">
                <span class="label">幼儿姓名：</span>
                <span class="text">{{ attendanceData.childName }}</span>
              </div>
              <div class="clazz">
                <span class="label">所属班级：</span>
                <span class="text">{{ attendanceData.clazzName }}</span>
              </div>
            </div>
          </div>
          <div class="list">
            <div class="avatar">
              <img
                v-if="attendanceData.parentAvatar"
                :src="attendanceData.parentAvatar"
              >
              <span
                v-else
                class="iconfont iconmorentouxiang"
              />
            </div>
            <div class="rightBox">
              <div class="name">
                <span class="label">持卡人：</span>
                <span class="text">{{ attendanceData.parentName }}</span>
              </div>
              <div class="clazz">
                <span class="label">亲属关系：</span>
                <span class="text">{{ transferRelation(attendanceData.relationship) }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div
      v-else-if="state === 'abnormal' || state === 'notEnrollment'"
      class="abnormalBox"
    >
      <div class="imgBox">
        <img src="../../../../assets/images/guardcare/attendance_abnormal.png">
        <div class="text">
          {{ state === 'abnormal' ? '刷卡异常，未找到匹配的宝贝' : '未到入托日期哦' }}
        </div>
      </div>
    </div>
    <div
      v-else-if="state === 'repeat'"
      class="repeatBox"
    >
      <div class="imgBox">
        <img src="../../../../assets/images/guardcare/attendance_repeat.png">
      </div>
    </div>
    <div class="inputBox">
      <el-input
        ref="input"
        v-model="attendanceCardNumber"
        placeholder="可输入接送卡号"
        size="big"
      />
    </div>
    <div class="btnBox">
      <el-button
        type="primary"
        size="big"
        :disabled="!attendanceCardNumber"
        @click="submit"
      >
        确认
      </el-button>
    </div>
  </div>
</template>

<script>/**
 * sign create by Administrator
 * createTime 2020/11/5 15:09
 */

import { createAttendanceByCard } from '@/api/newDaycare/attendanceGuard'

export default {
  name: 'Sign',
  components: {},
  filters: {},
  mixins: [],
  props: {},
  data () {
    return {
      attendanceCardNumber: '',
      state: 'attendance',
      second: 30,
      timer: null,
      attendanceData: {},
      enterPrint: 0
    }
  },
  computed: {},
  watch: {
    state () {
      if (this.state === 'attendance') {
        this.inputFocus()
      }
    }
  },
  created () {
  },
  activated () {
    this.inputFocus()
  },
  mounted () {
    this.inputFocus()
    window.addEventListener('keydown', this.keyDown)
  },
  destroyed () {
    window.removeEventListener('keydown', this.keyDown, false)
  },
  methods: {
    inputFocus () {
      this.$nextTick(() => {
        this.$refs.input.focus()
      })
    },
    keyDown () {
      const code = window.event.keyCode
      if (code === 13 && this.attendanceCardNumber) {
        this.enterPrint++
        if (this.enterPrint === 1) {
          this.submit()
          setTimeout(() => {
            this.enterPrint = 0
          }, 500)
        }
      }
    },
    submit () {
      createAttendanceByCard(this.attendanceCardNumber).then(res => {
        this.attendanceData = res.data
        if (!this.attendanceData.error) {
          this.$message.success('考勤成功')
          this.state = 'success'
        } else if (this.attendanceData.error === 'CHILD_NOT_FIND') {
          this.$message.error('考勤失败')
          this.state = 'abnormal'
        } else if (this.attendanceData.error === 'NOT_REPEAT') {
          this.$message.error('考勤失败')
          this.state = 'repeat'
        } else if (this.attendanceData.error === 'BEFORE_THE_DATE_OF_ENROLLMENT') {
          this.$message.error('考勤失败')
          this.state = 'notEnrollment'
        }
        this.attendanceCardNumber = ''
        this.second = 30
        this.timer = setInterval(() => {
          this.second--
          if (this.second === 0) {
            this.state = 'attendance'
            this.second = 30
            clearInterval(this.timer)
          }
        }, 1000)
      })
    },
    transferRelation (relation) {
      switch (relation) {
        case 'FATHER':
          return '爸爸'
        case 'MOTHER':
          return '妈妈'
        case 'GRANDFATHER':
          return '爷爷'
        case 'GRANDMOTHER':
          return '奶奶'
        case 'GRANDPA':
          return '外公'
        case 'GRANDMA':
          return '外婆'
        case 'OTHER':
          return '其他'
        default:
          return relation
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.sign-wrap {
  padding: 48px 0 70px;

  .imgBox {
    margin: 0 auto;

    img {
      width: 100%;
    }
  }

  .attendanceBox {
    .imgBox {
      width: 475px;
    }
  }

  .successBox {
    .imgBox {
      position: relative;
      width: 518px;

      .stateBox {
        @include c_white();
        height: 24px;
        left: 228px;
        line-height: 24px;
        position: absolute;
        text-align: center;
        top: 57px;
        width: 95px;
      }

      .msgBox {
        height: 202px;
        left: 130px;
        padding: 36px 0 0 36px;
        position: absolute;
        top: 78px;
        width: 291px;

        .list {
          align-items: center;
          display: flex;

          &:not(:first-child) {
            margin-top: 12px;
          }

          .avatar {
            border-radius: 50%;
            height: 56px;
            overflow: hidden;
            width: 56px;

            img {
              height: 100%;
              object-fit: cover;
              width: 100%;
            }

            .iconfont {
              @include c_disabled_color();
              font-size: 56px;
              height: 56px;
              line-height: 56px;
              width: 56px;
            }
          }

          .rightBox {
            margin-left: 30px;

            .clazz {
              margin-top: 8px;
            }

            .label {
              @include c_secondary_color();
            }

            .text {
              @include c_title_color();
            }
          }
        }
      }
    }
  }

  .abnormalBox {
    .imgBox {
      position: relative;
      width: 480px;

      .text {
        bottom: 0;
        color: #f56768;
        font-size: 20px;
        left: 0;
        position: absolute;
        right: 0;
        text-align: center;
      }
    }
  }

  .repeatBox {
    .imgBox {
      width: 480px;
    }
  }

  .inputBox {
    display: flex;
    justify-content: center;
    margin-top: 40px;

    ::v-deep .el-input {
      width: 340px;

      input {
        font-weight: bold;

        &::placeholder {
          font-weight: normal;
        }
      }
    }
  }

  .btnBox {
    display: flex;
    justify-content: center;
    margin-top: 16px;

    ::v-deep .el-button {
      width: 340px;

      span {
        font-size: 16px;
      }
    }
  }
}
</style>
