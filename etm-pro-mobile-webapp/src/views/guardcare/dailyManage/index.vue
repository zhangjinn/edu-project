<template>
  <div class="dailyManage">
    <setting-title setting-url="/guardcare_dailyManageSetting">
      <fil ref="filter" @change="getBabyList" />
    </setting-title>
    <ul v-if="showList.length" class="cards">
      <li v-for="(item, index) in showList" :key="index">
        <div class="left">
          <van-checkbox
            v-model="item.checked"
            :disabled="item._disabled"
            icon-size="14px"
            @click.stop="selectOne(item)"
          />
          <img src="../../../assets/images/defaultAvatar.png" alt="defaultAvatar">
          <div class="child_info">
            <div class="child_name">{{ item.childName }}</div>
            <div class="child_status">
              <span :class="item.status">{{ {'NORMAL': '', 'NOT_LEFT': '', 'REQUEST_FOR_LEAVE': '请假', 'ABSENCE': '缺勤', 'HOLIDAY': ''}[item.status] }}</span>
              <span :class="item.sleepStatus">{{ {'WAKEUP': '', 'SLEEPING': '睡眠中'}[item.sleepStatus] }}</span>
            </div>
          </div>
        </div>
        <div class="right" @click.stop="toDetail(item)">
          <i class="iconfont iconright1" />
        </div>
      </li>
    </ul>
    <no-content v-else message="暂无数据" type="list" />
    <foot text="批量记录" @click="footBtnClick">
      <div class="footerText">
        <van-checkbox v-model="checked" :disabled="!canSelectAll" icon-size="15px" @click.stop="selectAll(checked)" />全选
        已选中<span>{{ selectedList.length }}</span>人
      </div>
    </foot>
    <van-popup v-model="show" position="bottom" :style="{ height: '30%' }">
      <van-picker
        title="请选择要新增的记录"
        show-toolbar
        :columns="columns"
        @confirm="onConfirm"
        @cancel="show = false"
      />
    </van-popup>
  </div>
</template>
<script>
import settingTitle from '../components/settingTitle'
import noContent from '../../../components/common/noContent'
import fil from './components/filter'
import foot from './components/footer'
import {
  queryBabyList,
  querySettingList
} from '../../../service/guardcare/dailyManage'
export default {
  components: {
    settingTitle,
    fil,
    noContent,
    foot
  },
  data() {
    return {
      show: false,
      showList: [],
      columns: [],
      checked: false,
      selectedList: [] // 选择的宝宝
    }
  },
  computed: {
    canSelectAll() {
      for (let i = 0; i < this.showList.length; i++) {
        if (['NORMAL', 'NOT_LEFT'].indexOf(this.showList[i].status) !== -1) {
          return true
        }
      }
      return false
    },
    allSelectLength() { // 全部可选孩子的数量
      let length = 0
      for (let i = 0; i < this.showList.length; i++) {
        if (['NORMAL', 'NOT_LEFT'].indexOf(this.showList[i].status) !== -1) {
          length++
        }
      }
      return length
    }
  },
  created() {
    this.getSetting()
  },
  methods: {
    getBabyList() { // 获取该班级下的宝宝详情
      if (!this.$refs.filter.clazzId) {
        this.showList = []
        return
      }
      queryBabyList({ clazzId: this.$refs.filter.clazzId }).then(res => {
        const { data } = res.data
        data.forEach(v => {
          // v.status = 'NORMAL' // 模拟全部宝宝都是到园状态
          v.checked = false
          v._disabled = ['NORMAL', 'NOT_LEFT'].indexOf(v.status) === -1
        })
        this.showList = data
        this.selectedList = []
        this.checked = false
      }).catch(err => {
        this.showList = []
        this.selectedList = []
        this.checked = false
        console.log(err)
      })
    },
    getSetting() {
      querySettingList({ enable: true }).then(res => {
        const { data } = res.data
        data.forEach(v => {
          v.text = v.name
        })
        this.columns = data
      }).catch(err => {
        console.log(err)
      })
    },
    footBtnClick() {
      if (this.selectedList.length) {
        this.show = true
      } else {
        this.$toast('请先选择宝宝')
      }
    },
    onConfirm(value, index) {
      this.show = false
      this.$store.commit('guardcare/SET_DMCHILD', this.selectedList)
      let SLEEPING = false
      let WAKEUP = false
      for (let i = 0; i < this.selectedList.length; i++) {
        if (!SLEEPING && this.selectedList[i].sleepStatus === 'SLEEPING') {
          SLEEPING = true
        }
        if (!WAKEUP && this.selectedList[i].sleepStatus === 'WAKEUP') {
          WAKEUP = true
        }
      }
      if (SLEEPING && WAKEUP) {
        return this.$toast('宝宝们的睡眠状态不统一，无法进行批量操作')
      }
      switch (value.type) {
        case 'NURSE': // 喂奶
          this.$router.push('/guardcare_dailyManageMilk')
          break
        case 'DINING': // 吃饭
          this.$router.push('/guardcare_dailyManageEat')
          break
        case 'DIAPER_CHANGE': // 换尿布
          this.$router.push('/guardcare_dailyManageDiaper')
          break
        case 'DRINK': // 饮水
          this.$router.push('/guardcare_dailyManageDrink')
          break
        case 'EMOTION': // 情绪
          this.$router.push('/guardcare_dailyManageEmotion')
          break
        case 'SLEEP': // 睡眠
          if (SLEEPING) {
            this.$router.push('/guardcare_dailyManageSleep?status=awake')
          } else if (WAKEUP) {
            this.$router.push('/guardcare_dailyManageSleep?status=ready')
          }
          break
        case 'CUSTOM': // 自定义
          this.$router.push(`/guardcare_dailyManageCustom?name=${value.text}`)
          break
      }
    },
    toDetail(item) {
      this.$store.commit('guardcare/SET_DMCHILD', [item])
      this.$router.push(`/guardcare_dailyManageBrief?childId=${item.childId}&childName=${item.childName}`)
    },
    selectOne(item) { // 勾选一个孩子的事件
      // 按钮disabled，直接返回
      if (item._disabled) return

      if (!item.checked) {
        // 选中
        this.selectedList.push(item)

        if (this.selectedList.length === this.allSelectLength) this.checked = true
      } else {
        // 取消选中
        for (let i = 0; i < this.selectedList.length; i++) {
          if (this.selectedList[i].childId === item.childId) {
            this.selectedList.splice(i, 1)
            this.checked = false
            break
          }
        }
      }
    },
    selectAll(c) { // 全选按钮操作
      // 按钮disabled，直接返回
      if (!this.canSelectAll) return

      if (!c) { // 全选所有
        this.selectedList = []
        this.showList.forEach(v => {
          if (['NORMAL', 'NOT_LEFT'].indexOf(v.status) !== -1) {
            v.checked = true
            this.selectedList.push(v)
          }
        })
      } else { // 取消全选
        this.selectedList = []
        this.showList.forEach(v => {
          v.checked = false
        })
      }
    }
  }
}
</script>

<style scoped lang="scss">
.dailyManage {
  .filter {
    width: 100%;
    ::v-deep .selectBox {
      background-color: transparent;
      .dropdownMenu .switch {
        background-color: transparent;
      }
      .dropdownMenu .switch .box {
        opacity: 0;
      }
    }
  }
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
    height: calc(100vh - 86px);
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
        .child_info {
          text-align: left;
        }
        .child_name {
          font-size: 15px;
        }
        .child_status {
          font-size: 10px;
          color: $text-9;
          span {
            display: inline-block;
          }
          .REQUEST_FOR_LEAVE {
            padding: 3px 4px;
            border-radius: 2px;
            color: $blue;
            background-color: $blueLight;
          }
          .ABSENCE {
            padding: 3px 4px;
            border-radius: 2px;
            color: $red;
            background-color: $redLight;
          }
          .SLEEPING {
            padding: 3px 4px;
            border-radius: 2px;
            color: $theme;
            background-color: $themeLight;
          }
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
