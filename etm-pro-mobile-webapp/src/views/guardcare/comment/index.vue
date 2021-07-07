<template>
  <div class="comment">
    <setting-title>
      <van-dropdown-menu>
        <van-dropdown-item v-model="semester" :options="semesterList" />
      </van-dropdown-menu>
    </setting-title>
    <fil ref="filter" :frequency="frequency" :list="weekList" @change="getBehaviorList" />
    <tabs :value.sync="tabsValue" />
    <ul v-if="showList.length" class="cards">
      <li v-for="(item, index) in showList" :key="index">
        <div class="left">
          <van-checkbox v-model="item.checked" :disabled="item.hasMessage || tabsValue === 'home'" icon-size="14px" @click.stop="selectOne(item)" />
          <img src="../../../assets/images/defaultAvatar.png" alt="defaultAvatar">
          <span>{{ item.childName }}</span>
        </div>
        <div class="right" @click.stop="toDetail(item)">
          <span v-show="tabsValue === 'school'" :class="item.hasMessage ? 'done' : 'nope'">{{ item.hasMessage ? '已点评' : '未点评' }}</span>
          <div v-show="tabsValue === 'home'">
            <span :class="item.hasMessage ? 'done' : 'nope'">{{ item.hasMessage ? '已填写' : '未填写' }}</span>
            <i class="divider">|</i>
            <span :class="item.isRead ? 'done' : 'nope'">{{ item.isRead ? '已读' : '未读' }}</span>
          </div>
          <i class="iconfont iconright1" />
        </div>
      </li>
    </ul>
    <no-content v-else message="暂无数据" type="list" />
    <foot :text="{home: '一键提醒', school: '批量点评'}[tabsValue]" @click="footBtnClick">
      <div v-show="tabsValue === 'home'" class="footerText">
        <span>{{ unreadCount }}</span>人未读
        <span style="margin-left: 1em">{{ unwriteCount }}</span>人未填写
      </div>
      <div v-show="tabsValue === 'school'" class="footerText">
        <van-checkbox v-model="checked" icon-size="15px" @click.stop="selectAll(checked)" />全选
      </div>
    </foot>
  </div>
</template>
<script>
import settingTitle from './components/settingTitle'
import noContent from '../../../components/common/noContent'
import tabs from './components/tabs'
import fil from './components/filter'
import foot from './components/footer'
import {
  querySemesterList,
  querySemesterWeekList,
  queryFrequency,
  getBehaviorList,
  noticeToCompleteHomeBehavior
} from '../../../service/guardcare/comment'
export default {
  components: {
    settingTitle,
    tabs,
    fil,
    foot,
    noContent
  },
  data() {
    return {
      checked: false,
      showList: [],
      tabsValue: 'school',
      semesterList: [],
      weekList: [],
      semester: undefined,
      frequency: '',
      cache: '',
      unreadCount: 0,
      unwriteCount: 0,
      timer: null,
      weekIdList: [],
      selectedList: [] // 选择的宝宝
    }
  },
  watch: {
    semester: {
      handler(v) {
        if (v === undefined) return
        querySemesterWeekList({ courseTermId: v }).then(res => {
          this.weekList = res.data.data
        }).catch(err => {
          console.log(err)
        })
      },
      immediate: true
    },
    tabsValue() {
      this.getBehaviorList(true)
    }
  },
  created() {
    this.getSemesterList()
    this.getFrequency()
    this.getBehaviorList()
  },
  beforeDestroy() {
    clearInterval(this.timer)
    this.timer = null
  },
  methods: {
    getSemesterList() { // 获取学期列表
      querySemesterList().then(res => {
        this.semesterList = []
        Array.isArray(res.data.data) && res.data.data.forEach(v => {
          this.semesterList.push({
            text: v.name,
            value: v.id
          })
        })
        this.semester = res.data.data[0].id || 0
      }).catch(err => {
        console.log(err)
      })
    },
    getFrequency() { // 获取点评频率
      queryFrequency().then(res => {
        this.frequency = res.data.data.value
      }).catch(err => {
        console.log(err)
      })
    },
    footBtnClick() {
      if (this.tabsValue === 'home') { // 一键提醒操作
        const childIds = []
        this.showList.forEach(v => {
          if (!v.hasMessage) {
            childIds.push(v.childId)
          }
        })
        noticeToCompleteHomeBehavior({ childIds }).then(res => {
          this.$toast('提醒成功')
        }).catch(err => {
          this.$toast('提醒功能开发中')
          console.log(err)
        })
      }
      if (this.tabsValue === 'school') { // 批量点评操作
        if (!this.selectedList.length) return this.$toast('请选择需要点评的宝宝')
        const ids = []
        this.selectedList.forEach(v => {
          ids.push(v.childId)
        })
        this.$store.commit('guardcare/SET_CHILDIDLIST', ids)
        this.$store.commit('guardcare/SET_WEEKIDLIST', this.weekIdList)
        this.$router.push(`/guardcare_detail?type=${this.tabsValue}`)
      }
    },
    toDetail(item) {
      this.$store.commit('guardcare/SET_CHILDIDLIST', [item.childId])
      this.$store.commit('guardcare/SET_WEEKIDLIST', this.weekIdList)
      if (item.hasMessage && item.performanceId) { // 已经点评，显示点评详情
        this.$router.push(`/guardcare_detail?type=${this.tabsValue}&id=${item.performanceId}`)
      } else { // 未点评，去写点评
        this.$router.push(`/guardcare_detail?type=${this.tabsValue}`)
      }
    },
    selectAll(c) { // 全选按钮操作
      if (!c) { // 全选所有
        this.selectedList = []
        this.showList.forEach(v => {
          if (!v.hasMessage) {
            v.checked = true
            this.selectedList.push(v)
          }
        })
      } else { // 取消全选
        this.selectedList = []
        this.showList.forEach(v => {
          if (!v.hasMessage && v.checked) {
            v.checked = false
          }
        })
      }
    },
    selectOne(item) { // 单选
      if (!item.checked) {
        // 选中
        this.selectedList.push(item)
        if (this.selectedList.length === this.showList.length) this.checked = true
      } else {
        // 取消选中
        for (let i = 0; i < this.selectedList.length; i++) {
          if (this.selectedList[i].childId === item.childId) {
            this.selectedList.splice(i, 1)
            if (this.selectedList.length !== this.showList.length) this.checked = false
            break
          }
        }
      }
    },
    getBehaviorList(force) { // 查询宝宝表现列表
      if (this.timer) return
      this.timer = setInterval(() => {
        if (this.$refs.filter.columns && this.$refs.filter.columns.length) {
          clearInterval(this.timer)
          this.timer = null
          const options = {
            gradeId: this.$refs.filter.gradeId || null,
            clazzId: this.$refs.filter.clazzId || null,
            type: { school: 'IN_SCHOOL', home: 'IN_HOME' }[this.tabsValue]
          }
          this.weekIdList = []
          const startId = this.$refs.filter.columns[this.$refs.filter.index].startWeekId
          const endId = this.$refs.filter.columns[this.$refs.filter.index].endWeekId
          for (let i = startId; i <= endId; i++) {
            this.weekIdList.push(i)
          }
          let isFuture = false // 标识是否为未来的时间
          if (this.$refs.filter.columns[this.$refs.filter.index] &&
          this.$refs.filter.columns[this.$refs.filter.index].name
          ) {
            const startDate = new Date(this.$refs.filter.columns[this.$refs.filter.index].name.slice(0, 10))
            if (startDate.getTime() > Date.now()) {
              isFuture = true
            }
          }
          options.weekIdList = this.weekIdList
          if (JSON.stringify(options) === this.cache && !force) return
          this.cache = JSON.stringify(options)
          getBehaviorList(options).then(res => {
            const data = Array.isArray(res.data.data) ? res.data.data : []
            this.unreadCount = 0
            this.unwriteCount = 0
            data.forEach(v => {
              v.checked = false
              if (this.tabsValue === 'home') {
                !v.hasMessage && this.unwriteCount++
                !v.isRead && this.unreadCount++
              }
            })
            this.showList = isFuture ? [] : data
          }).catch(err => {
            this.showList = []
            console.log(err)
            this.cache = ''
          })
        }
      }, 200)
    }
  }
}
</script>

<style scoped lang="scss">
.comment {
  .vh {
    visibility: hidden;
  }
  ::v-deep .van-dropdown-menu {
    background-color: transparent;
    .van-ellipsis, .van-dropdown-menu__title::after {
      color: $white;
      font-size: 14px;
    }
  }
  .tabs {
    margin-top: 8px;
  }
  .cards {
    height: calc(100vh - 183px);
    overflow-y: auto;
    li {
      height: 66px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding-left: 12px;
      border-bottom: 1px solid $text-e;
      background-color: $white;
      .left {
        display: flex;
        align-items: center;
        img {
          display: block;
          width: 35px;
          height: 35px;
          border-radius: 50%;
          margin-right: 12px;
        }
      }
      .right {
        display: flex;
        align-items: center;
        .done {
          color: #bcbcbc;
        }
        .nope {
          color: $theme;
        }
        & > div {
          display: flex;
          align-items: center;
        }
        .divider {
          margin: 0 6px;
          font-size: 10px;
        }
        span {
          font-size: 14px;
        }
        i {
          margin: 0 12px 0 8px;
          color: #bcbcbc;
        }
      }
    }
  }

  .footerText {
    display: flex;
    font-size: 12px;
    color: $text-5;
    ::v-deep .van-checkbox {
      margin-right: 9px;
    }
    span {
      color: $theme;
    }
  }

  .van-checkbox {
    margin-right: 12px;
  }
  ::v-deep .van-checkbox__icon--checked .van-icon {
    background-color: $theme;
    border-color: $theme;
  }
}
</style>
