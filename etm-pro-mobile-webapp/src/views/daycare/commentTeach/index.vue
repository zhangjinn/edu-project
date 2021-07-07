<template>
  <div class="index-wrap">
    <setting-title>
      <span class="titleWen">点评列表</span>
    </setting-title>
    <van-dropdown-menu active-color="#10C2C4">
      <van-dropdown-item ref="item" :title="data" @open="show=true" />
      <van-dropdown-item v-model="value" :options="option" />
    </van-dropdown-menu>
    <van-popup v-model="show" round position="bottom" :style="{ height: '40%' }" :close-on-click-overlay="false">
      <van-datetime-picker
        v-model="currentDate"
        type="date"
        title="选择年月日"
        :min-date="minDate"
        :max-date="maxDate"
        @confirm="sureDate"
        @cancel="cancelDate"
      />
    </van-popup>
    <div class="tabsMargin">
      <van-tabs v-model="tabsValue">
        <van-tab title="在园表现" name="school" />
        <van-tab title="在家表现" name="home" />
      </van-tabs>
    </div>
    <ul v-if="showList.length" class="cards">
      <li v-for="(item, index) in showList" :key="index">
        <div class="left">
          <van-checkbox
            v-model="item.checked"
            :disabled="tabsValue === 'home' || item.reviewStatus==='COMPLETED'"
            icon-size="14px"
            @click.stop="selectOne(item)"
          />
          <img src="../../../assets/images/defaultAvatar.png" alt="defaultAvatar">
          <span>{{ item.name }}</span>
        </div>
        <div class="right" @click.stop="toDetail(item)">
          <span
            v-show="tabsValue === 'school'"
            :class="item.reviewStatus!=='UNDONE' ? 'done' : 'nope'"
          >{{ item.reviewStatus !== 'UNDONE' ? '已点评' : '未点评' }}</span>
          <div v-show="tabsValue === 'home'">
            <span :class="item.whetherToFillIn ? 'done' : 'nope'">{{ item.whetherToFillIn ? '已填写' : '未填写' }}</span>
            <i class="divider">|</i>
            <span :class="item.reviewStatus==='READ_UNREAD' ? 'done' : 'nope'">{{
              item.reviewStatus === 'READ_UNREAD' ? '已读' : '未读'
            }}</span>
          </div>
          <i class="iconfont iconright1" />
        </div>
      </li>
    </ul>
    <no-content v-else message="暂无数据" type="list" />
    <foot
      :text="{home: '一键提醒', school: '批量点评'}[tabsValue]"
      :has-btn="tabsValue === 'school'"
      @click="footBtnClick"
    >
      <div v-show="tabsValue === 'home'" class="footerText">
        <span>{{ unreadCount }}</span>人未读
        <span style="margin-left: 1em">{{ unwrittenCount }}</span>人未填写
      </div>
      <div v-show="tabsValue === 'school'" class="footerText">
        <van-checkbox v-model="checked" icon-size="15px" @click.stop="selectAll(checked)" />
        全选
      </div>
    </foot>
  </div>

</template>

<script>
import { DateFormat } from '@/js/rules'
import settingTitle from './components/settingTitle'
import noContent from '../../../components/common/noContent'
import foot from './components/footer'
import { queryCourseManagement, queryStu } from '@/service/daycare/commentTeach'

/**
 * index create by Administrator
 * createTime 2020/10/19 18:13
 */
export default {
  name: 'Index',
  components: { settingTitle, noContent, foot },
  filters: {},
  mixins: [],
  props: {},
  data() {
    return {
      checked: false,
      value: 0,
      switch1: false,
      switch2: false,
      option: [
        { text: '暂无课程', value: 0 }
      ],
      minDate: new Date(2010, 0, 1),
      maxDate: new Date(2050, 10, 1),
      currentDate: new Date(),
      data: '',
      show: false,
      showList: [],
      tabsValue: 'school',
      selectedList: [],
      unreadCount: 0,
      unwrittenCount: 0,
      weekIdList: {}
    }
  },
  computed: {},
  watch: {
    tabsValue() {
      this.getStu()
    },
    value() {
      this.getStu()
    }
  },
  created() {
    this.data = DateFormat(new Date(), 'yyyy-MM-dd')
    this.getCourseManagement()
  },
  mounted() {
  },
  methods: {
    getCourseManagement() {
      queryCourseManagement({ localDate: this.data }).then(res => {
        // console.log(res.data.data)
        const data = res.data.data
        this.option = []
        data.forEach(v => {
          this.option.push({ text: v.courseName, value: v.courseManagementId })
        })
        if (!this.option.length) {
          this.option = [{ text: '暂无课程', value: 0 }]
        }
        this.value = this.option[0].value
        this.getStu()
      })
    },
    getStu() {
      let type = ''
      if (this.tabsValue === 'school') {
        type = 'IN_THE_PARK'
      } else {
        type = 'AT_HOME'
      }
      queryStu({ whichPerformedType: type, courseManagementId: this.value }).then(res => {
        // console.log(res.data.data)
        const data = res.data.data
        this.unreadCount = 0
        this.unwrittenCount = 0
        data.forEach(v => {
          v.checked = false
          if (this.tabsValue === 'home') {
            !v.whetherToFillIn && this.unwrittenCount++
            v.reviewStatus !== 'READ_UNREAD' && this.unreadCount++
          }
        })
        this.showList = data
        // console.log(this.showList)
      })
    },
    sureDate(val) {
      // console.log(val)
      this.data = DateFormat(val, 'yyyy-MM-dd')
      this.show = false
      this.getCourseManagement()
    },
    cancelDate() {
      this.show = false
    },
    selectAll(c) { // 全选按钮操作
      if (!c) { // 全选所有
        this.selectedList = []
        this.showList.forEach(v => {
          if (v.reviewStatus === 'UNDONE') {
            v.checked = true
            this.selectedList.push(v)
          }
        })
      } else { // 取消全选
        this.selectedList = []
        this.showList.forEach(v => {
          if (v.reviewStatus === 'UNDONE' && v.checked) {
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
    toDetail(item) {
      this.weekIdList.courseManagementId = this.value
      this.weekIdList.childId = item.childId
      this.$store.commit('guardcare/SET_CHILDIDLIST', [item.childId])
      this.$store.commit('guardcare/SET_WEEKIDLIST', this.weekIdList)
      // console.log(item.reviewStatus === 'COMPLETED' && item.reviewsId && item.whetherToFillIn)
      if (this.tabsValue === 'school') {
        if (item.reviewStatus !== 'UNREAD' && item.reviewsId && item.whetherToFillIn) { // 已经点评，显示点评详情
          this.$router.push(`/daycare_commentTeachDetail?type=${this.tabsValue}&id=${item.reviewsId}`)
        } else { // 未点评，去写点评
          this.$router.push(`/daycare_commentTeachDetail?type=${this.tabsValue}`)
        }
      } else {
        if (item.reviewsId && item.whetherToFillIn) { // 已经点评，显示点评详情
          this.$router.push(`/daycare_commentTeachDetail?type=${this.tabsValue}&id=${item.reviewsId}`)
        } else { // 未点评，去写点评
          this.$router.push(`/daycare_commentTeachDetail?type=${this.tabsValue}`)
        }
      }
    },
    footBtnClick() {
      if (this.tabsValue === 'school') { // 批量点评操作
        if (!this.selectedList.length) return this.$toast('请选择需要点评的宝宝')
        const ids = []
        this.selectedList.forEach(v => {
          ids.push(v.childId)
        })
        this.weekIdList.courseManagementId = this.value
        this.$store.commit('guardcare/SET_CHILDIDLIST', ids)
        this.$store.commit('guardcare/SET_WEEKIDLIST', this.weekIdList)
        this.$router.push(`/daycare_commentTeachDetail?type=${this.tabsValue}`)
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.index-wrap {
  .titleWen {
    color: #fff;
  }

  .tabsMargin {
    margin-top: 8px;
  }

  ::v-deep {
    .van-dropdown-menu__title {
      font-size: 14px;
    }
  }

  ::v-deep .van-tabs__line {
    background-color: $theme;
  }

  ::v-deep .van-tabs {
    padding: 0 7px;
    background-color: $white;
  }

  ::v-deep .van-tab {
    color: #9a9a9a;
    //flex: none;
    margin-right: 5px;
  }

  ::v-deep .van-tab--active {
    color: $theme;
  }

  .van-checkbox {
    margin-right: 12px;
  }

  ::v-deep .van-checkbox__icon--checked .van-icon {
    background-color: $theme;
    border-color: $theme;
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
}
</style>
