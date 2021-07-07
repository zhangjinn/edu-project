<template>
  <div class="index-wrap">
    <etm-main-body>
      <etm-layout-split :left-styles="{minWidth: '680px',maxWidth: '80%'}">
        <div slot="left">
          <div class="img-1">
            <el-image :src="require('../../../assets/images/daycare/img-cardAttendance.png')">
              <div slot="placeholder" class="image-slot">
                加载中<span class="dot">...</span>
              </div>
            </el-image>
          </div>
        </div>
        <div slot="right">
          <div class="img1">
            <div class="img2">
              <el-image :src="require('../../../assets/images/daycare/img-cardCheck.png')">
                <div slot="placeholder" class="image-slot">
                  加载中<span class="dot">...</span>
                </div>
              </el-image>
            </div>
            <span>输入信息考勤</span>
          </div>
          <div class="undImg">
            <el-input
              ref="inputId"
              v-model="input"
              autofocus
              clearable
              class="inp"
              placeholder="请输入会员卡号/手机号码"
              @keyup.enter.native="searchAllCompany"
            />
            <el-button class="inp" type="primary" @click="send">确定</el-button>
          </div>
        </div>
      </etm-layout-split>
      <div class="btm">
        <etm-layout-split>
          <div>
            <etm-title :show-line="false" border>学员信息</etm-title>
            <div v-if="showPop">
              <div class="head">
                <img v-if="stu.avatar" :src="stu.avatar" alt="">
                <i v-else class="iconfont iconmorentouxiang" />
                <span>{{ stu.childName }}</span>
              </div>
              <el-row v-if="teach" type="flex" class="row-bg" justify="space-around">
                <el-col :span="8">
                  <etm-field-label label="考勤状态">{{ stu.attendanceStatus }}</etm-field-label>
                  <etm-field-label label="上课时间">{{ starTime }}</etm-field-label>
                  <etm-field-label label="接送人">{{ parent }}</etm-field-label>
                </el-col>
                <el-col :span="8">
                  <etm-field-label label="剩余课时">{{ stu.lastLesson }}</etm-field-label>
                  <etm-field-label label="上课教室">{{ stu.roomName }}</etm-field-label>
                </el-col>
                <el-col :span="8">
                  <etm-field-label label="课程名称">{{ stu.courseName }}</etm-field-label>
                  <etm-field-label label="所在班级">{{ stu.clazzName }}</etm-field-label>
                </el-col>
              </el-row>
              <el-row v-else type="flex" class="row-bg" justify="space-around">
                <el-col :span="8">
                  <etm-field-label label="考勤状态">{{ stu.attendanceStatus }}</etm-field-label>
                </el-col>
                <el-col :span="8">
                  <etm-field-label label="所在班级">{{ stu.clazzName }}</etm-field-label>
                </el-col>
                <el-col :span="8">
                  <etm-field-label label="接送人">{{ parent }}</etm-field-label>
                </el-col>
              </el-row>
            </div>
            <etm-empty v-else empty-text="暂无学员考勤信息" />
          </div>
        </etm-layout-split>
      </div>
    </etm-main-body>
  </div>

</template>

<script>

/**
 * index create by Administrator
 * createTime 2020/11/03 9:10
 */
import { createAttendance } from '@/api/newDaycare/cardAttendance'
import baseMixin from '@/layout/mixin/baseMixin'
import { parseTime } from '@/utils'

// let timer = null
export default {
  name: 'Index',
  components: {},
  filters: {},
  mixins: [baseMixin],
  props: {},
  data() {
    return {
      tab1: 'tab1',
      src: 'https://cube.elemecdn.com/6/94/4d3ea53c084bad6931a56d5158a48jpeg.jpeg',
      input: '',
      parent: '',
      stu: {},
      showPop: false,
      starTime: '',
      teach: true
      // showTime: '20:00:00'
    }
  },
  computed: {},
  watch: {},
  created() {
  },
  mounted() {
    this.$refs.inputId.focus()
    // console.log(this.showTime.substr(0, 5))
  },
  methods: {
    // carNumber(e) {
    //   const _self = this
    //   clearTimeout(timer)
    //   timer = setTimeout(() => {
    //     if ((e.length - this.art.length) >= 8) {
    //       console.log('设备输入' + e)
    //       // this.send()
    //     } else {
    //       console.log('手动输入')
    //     }
    //     if (_self.input.length) {
    //       this.art = e
    //     } else {
    //       this.art = ''
    //     }
    //   }, 50)
    // },
    searchAllCompany() {
      this.send()
    },
    send() {
      // console.log(this.input)
      // console.log(this.input.length)
      // this.art = ''
      this.$refs.inputId.focus()
      this.getCard()
      this.input = ''
    },
    getCard() {
      let cardType = null
      if (this.input.length === 11) {
        cardType = 'TELEPHONE'
      } else {
        cardType = 'MEMBERSHIP_CARD'
      }
      createAttendance({ convenientType: cardType, number: this.input }).then(res => {
        this.input = ''
        const data = res.data
        // console.log(data)
        this.stu = data
        if (this.stu.parentName) {
          this.parent = this.stu.parentName + ' (' + this.stu.relationshipName + ')'
        } else {
          this.parent = ''
        }
        if (this.stu.type === 'CARE') {
          this.teach = false
          this.starTime = parseTime(this.stu.courseDate, '{y}-{m}-{d}' + ' (星期' + '{a}' + ') ')
        } else {
          this.teach = true
          this.stu.startTime = this.stu.startTime.substr(0, 5)
          this.stu.endTime = this.stu.endTime.substr(0, 5)
          this.starTime = parseTime(this.stu.courseDate, '{y}-{m}-{d}' + ' (星期' + '{a}' + ') ') + this.stu.startTime + ' ~ ' + this.stu.endTime
          console.log(this.starTime)
        }
        if (this.stu.attendanceStatus === '签到' || this.stu.attendanceStatus === '已入园') {
          this.$message.success(this.stu.childName + '考勤成功')
        } else if (this.stu.attendanceStatus === '已离园') {
          this.$message.success(this.stu.childName + '离园成功')
        }
        this.showPop = true
      }).catch(error => {
        this.$message.closeAll()
        this.$message({
          message: error,
          type: 'error',
          duration: 0,
          showClose: true
        })
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.row-bg {
  padding-left: 81px;
}

.index-wrap {
  .img1 {
    //width: 40%;
    //height: 50%;
    margin: auto;
    padding-bottom: 24px;
    text-align: center;
    padding-top: 43px;

    .img2 {
      width: 67px;
      height: 70px;
      margin: auto;
    }

    span {
      display: block;
      margin-top: 14px;
      color: #222222;
      font-size: 16px;
      font-weight: 400;
    }

  }

  .img-1 {
    margin: auto;
    width: 100%;
    padding: 36px 26px;
  }

  .undImg {
    width: 340px;
    margin: auto;
    padding-bottom: 16px;

    .inp {
      width: 340px;
      height: 40px;
      display: block;
      margin-bottom: 16px;
    }

    ::v-deep .el-input__inner {
      height: 40px;
      font-weight: bold;
    }
  }

  .head {
    padding-left: 1px;
    align-items: center;
    display: flex;
    justify-items: center;

    span {
      font-size: 16px;
      font-weight: bold;
      color: #222222;
    }

    i {
      width: 56px;
      height: 56px;
      border-radius: 50%;
      display: inline-block;
      margin-right: 24px;

      &:before {
        font-size: 56px;
        line-height: 1;
      }
    }

    img {
      width: 56px;
      height: 56px;
      border-radius: 50%;
      display: inline-block;
      margin-right: 24px;
    }
  }

  .btm {
    margin-top: 16px;
  }
}
</style>
