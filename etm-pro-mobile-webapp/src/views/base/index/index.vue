<template>
  <div class="homePage">
    <div v-if="false">
      <div class="container">
        <div class="organization">
          <van-row>
            <van-col :span="14" class="textLeft">
              <div class="organizationText" @click="changeOrganization">
                <span class="iconfont iconlocation left" />
                <span class="van-ellipsis organizationName left">{{ organizationName }}</span>
                <span class="iconfont iconright left" />
              </div>
            </van-col>
            <van-col :span="10" class="textRight">
              <span class="iconfont iconchazhao" @click="toSearch" />
            </van-col>
          </van-row>
        </div>
      </div>
      <div class="calendarBox">
        <div class="date">
          <span>{{ year }}年{{ month }}月</span>
          <span v-if="showToday" class="back" @click="backToday">回到今天</span>
        </div>
        <div class="calendar">
          <vue-hash-calendar
            :visible.sync="isShowCalendar"
            :is-show-week-view="isShowWeekView"
            :disabled-week-view="true"
            :mark-date="markDate"
            @touchstart="touchStart"
            @touchmove="touchMove"
            @change="changeDate"
          />
        </div>
        <div class="slide">
          <div v-if="active === 0" @click="changeView(1)">
            <span class="iconfont iconarrow-down" />
          </div>
          <div v-else @click="changeView(0)">
            <span class="iconfont iconarrow-up" />
          </div>
        </div>
      </div>
      <div class="taskBox">
        <div class="taskTop van-hairline--bottom">
          <div class="left">当日事务<span>{{ task.length }}</span>项</div>
          <div class="right" @click="checkMore">查看全部</div>
        </div>
        <div class="taskList">
          <div class="task">
            <template v-if="task.length">
              <affair-list :data="task" @operation="determine" />
            </template>
            <template v-else>
              <no-content message="今日暂无待办事务" type="none" />
            </template>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getToken } from '../../../js/localStore'
import { getTransaction, putTransaction, deleteTransaction } from '../../../service/base/basic'
import affairList from '../../../components/common/affairList'
import noContent from '../../../components/common/noContent'
import { DateFormat } from '../../../js/rules'
import { getMenuList } from '@/js/menu'

export default {
  name: 'Index',
  components: {
    affairList,
    noContent
  },
  data() {
    return {
      token: '',
      application: [],
      active: 0,
      task: [],
      year: '',
      month: '',
      isShowCalendar: true,
      isShowWeekView: true,
      startPosition: 0,
      moveDistance: 0,
      organizationName: '',
      showToday: false,
      markMonth: [],
      markDate: [{
        color: '#F9993B',
        date: []
      }]
    }
  },
  created() {
    this.judgeLogin()
  },
  methods: {
    judgeLogin() {
      if (localStorage.getItem('platform') === 'wechat') {
        const orgId = this.getQueryVariable('organizationId') || localStorage.getItem('orgId')
        const oldOrgId = localStorage.getItem('orgId')
        if (orgId !== oldOrgId) {
          localStorage.clear()
        }
        this.token = getToken()
        const tempAccount = localStorage.getItem('tempAccount')
        if (!this.token || tempAccount) {
          if (!orgId) {
            return this.$router.replace({
              path: '/passwordLogin'
            })
          }
          localStorage.setItem('orgId', orgId)
          this.$router.replace({
            path: '/wechatLogin'
          })
        } else {
          getMenuList()
        }
      } else {
        this.token = getToken()
        if (!this.token) {
          this.$router.replace({
            path: '/passwordLogin'
          })
        } else {
          getMenuList()
        }
      }
    },
    getQueryVariable(variable) {
      if (!location.href.includes(variable)) {
        return null
      }
      const query = decodeURIComponent(location.href).split('#')[1].split('?')[1]
      const vars = query.split('&')
      for (let i = 0; i < vars.length; i++) {
        const pair = vars[i].split('=')
        if (pair[0] === variable) {
          return pair[1]
        }
      }
      return false
    },
    getTask(date) {
      const startTime = DateFormat(date, 'yyyy-MM-dd')
      const time = new Date(date.getTime() + 1000 * 60 * 60 * 24)
      const endTime = DateFormat(time, 'yyyy-MM-dd')
      const param = {
        sourceId: 1,
        state: '2',
        startDate: startTime,
        endDate: endTime,
        pageNum: 1,
        pageSize: 999
      }
      getTransaction(param).then(res => {
        const tasks = res.data.data.content
        this.task = []
        tasks.forEach((item, index) => {
          const data = {}
          data.date = DateFormat(item.lateTime, 'yyyy.MM.dd')
          data.time = DateFormat(item.lateTime, 'hh:mm')
          if (new Date(item.lateTime) < new Date()) { // 逾期未完成
            data.type = 2
            data.tag = 'o'
          } else {
            if (index % 3 === 1) {
              data.type = 1
            } else if (index % 3 === 2) {
              data.type = 3
            } else {
              data.type = 4
            }
          }
          data.handle = 'i'
          data.affair = item.content
          data.id = item.id
          data.customerId = item.customerId
          data.state = item.state
          this.task.push(data)
        })
      })
    },
    getMarkDate(date) {
      date = new Date(date)
      const firstDay = DateFormat(new Date(date.setDate(1)), 'yyyy-MM-dd')
      let currentMonth = date.getMonth()
      const nextMonth = ++currentMonth
      const endDay = DateFormat(new Date(date.getFullYear(), nextMonth, 1), 'yyyy-MM-dd')
      const param = {
        sourceId: 1,
        state: '2',
        startDate: firstDay,
        endDate: endDay,
        pageNum: 1,
        pageSize: 999
      }
      getTransaction(param).then(res => {
        const task = res.data.data.content
        task.forEach(item => {
          const time = new Date(item.lateTime).toDateString()
          if (this.markDate[0].date.indexOf(time)) {
            this.markDate[0].date.push(time)
          }
        })
      })
    },
    determine(value) {
      if (value.type === 'ignore') {
        this.ignoreTask(value.id, value.index)
      } else {
        this.removeTask(value.id, value.index)
      }
    },
    ignoreTask(id, index) {
      this.$dialog.confirm({
        title: '确认忽略此项待办事务？',
        message: '忽略后不可撤回',
        confirmButtonColor: '#F53939',
        cancelButtonColor: '#666666'
      }).then(() => {
        this.ignore(id, index)
      }).catch(() => {
        // oncancel
      })
    },
    async ignore(id, index) {
      this.unprocessedData.splice(index, 1)
      const param = {
        state: 3
      }
      await putTransaction(id, param)
    },
    removeTask(id, index) {
      this.$dialog.confirm({
        title: '确认删除事务？',
        message: '删除后不可撤回',
        confirmButtonColor: '#F53939',
        cancelButtonColor: '#666666'
      }).then(() => {
        this.delete(id, index)
      }).catch(() => {
        // oncancel
      })
    },
    async delete(id, index) {
      this.finishData.splice(index, 1)
      await deleteTransaction(id)
    },
    changeView(index) {
      this.active = index
      this.isShowCalendar = false
      setTimeout(() => {
        this.isShowCalendar = true
        if (index === 0) {
          this.isShowWeekView = true
        } else {
          this.isShowWeekView = false
        }
      }, 50)
    },
    changeDate(val) {
      const time = DateFormat(new Date(val), 'yyyy.MM')
      if (this.markMonth.indexOf(time) === -1) {
        this.getMarkDate(val)
        this.markMonth.push(time)
      }
      this.year = new Date(val).getFullYear()
      this.month = new Date(val).getMonth() + 1
      if (this.month < 10) {
        this.month = '0' + this.month
      }
      if (this.token) {
        this.getTask(new Date(val))
      }
      if (new Date(val).toDateString() !== new Date().toDateString()) {
        this.showToday = true
      } else {
        this.showToday = false
      }
    },
    backToday() {
      this.$children.forEach((item, index) => {
        if (item.today) {
          this.$children[index].today()
        }
      })
    },
    touchStart(event) {
      this.startPosition = event.targetTouches[0].screenY
    },
    touchMove(event) {
      this.moveDistance = event.targetTouches[0].screenY - this.startPosition
      const Dom = document.getElementsByClassName('container')[0]
      const top = Dom.scrollTop
      Dom.scrollTo(0, top - this.moveDistance)
    },
    toSearch() {
      this.$router.push({
        path: '/search'
      })
    },
    checkMore() {
      this.$router.push({
        path: '/taskList'
      })
    },
    changeOrganization() {
      this.$router.push({
        path: '/switchOrganization'
      })
    }
  }
}
</script>

<style lang="scss">

    .homePage {
        padding-bottom: 12px;

        .container {
            height: 54px;

            .organization {
                position: fixed;
                top: 0;
                left: 0;
                z-index: 11;
                padding: 12px;
                @include wh(100%, 54px);
                color: $white;
                background-color: $theme;

                .organizationText {
                    @include wh(100%, 30px);
                    line-height: 30px;

                    span {
                        margin-right: 6px;
                    }

                    .iconlocation {
                        font-size: 15px;
                    }

                    .iconright {
                        font-size: 12px;
                    }

                    .organizationName {
                        max-width: 150px;
                    }
                }

                .iconchazhao {
                    font-size: 15px;
                    line-height: 30px;
                }
            }
        }

        .calendarBox {
            padding: 12px 0 0;
            margin-top: 12px;
            background-color: $white;

            .date {
                position: relative;
                font-size: 14px;
                line-height: 30px;

                .back {
                    position: absolute;
                    top: 0;
                    right: 15px;
                    color: $theme;
                    font-size: 12px;
                }
            }

            .calendar {
                .calendar_title {
                    display: none;
                }

                .calendar_body {
                    margin-top: 0;

                    .calendar_item {
                        width: 14.28%;
                    }
                }

                .calendar_first_today {
                    color: $theme;
                }

                .calendar_day_checked {
                    background-color: $theme;

                    &.calendar_first_today {
                        color: $white;
                    }
                }

                .calendar_dot {
                    @include wh(4px, 4px);
                }
            }

            .slide {
                margin-top: 5px;

                div {
                    margin: 0 auto;
                    @include wh(25px, 25px);
                    line-height: 25px;

                    .iconfont {
                        font-size: 15px;
                        color: $text-b;
                    }
                }
            }
        }

        .taskBox {
            margin-top: 12px;
            background-color: $white;

            .taskTop {
                padding: 0 12px;
                line-height: 45px;
                font-size: 13px;
                overflow: hidden;

                .left {
                    span {
                        margin: 0 3px;
                        color: $theme;
                    }
                }

                .right {
                    color: $theme;
                }
            }

            .taskList {
                padding: 12px;
                width: 100%;
                min-height: 50px;
                background-color: $white;
                @include border-radius(5px);
                overflow: hidden;

            }
        }
    }
</style>
