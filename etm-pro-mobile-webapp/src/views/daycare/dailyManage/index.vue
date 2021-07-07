<template>
  <div class="index-wrap">
    <setting-title>
      <van-dropdown-menu active-color="#10C2C4">
        <van-dropdown-item v-model="value" :options="option" @change="changeClass" />
      </van-dropdown-menu>
    </setting-title>
    <ul v-if="showList.length" class="cards">
      <li v-for="(item, index) in showList" :key="index">
        <div class="left">
          <van-checkbox
            v-model="item.checked"
            :disabled="item.attendStatus==='ABSENT_FROM_WORK'||item.attendStatus==='ASK_FOR_LEAVE'||item.attendStatus==='EFFECTIVE_ASK_FOR_LEAVE'||item.attendStatus==='OUT_SCHOOL'"
            icon-size="14px"
            @click.stop="selectOne(item)"
          />
          <!--          <img src="../../../assets/images/defaultAvatar.png" alt="defaultAvatar">-->
          <div class="noImg textCenter">{{ getIconTxt(item.childName) }}</div>
          <div>
            <span class="stuName">{{ item.childName }}</span>
            <span class="status">{{ item.status || '' }}</span>
          </div>
        </div>
        <div class="right" @click.stop="toDetail(item)">
          <i class="iconfont iconright1" />
        </div>
      </li>
    </ul>
    <no-content v-else message="暂无数据" type="list" />
    <foot
      text="批量新增"
      :has-btn="true"
      @click="footBtnClick"
    >
      <div class="footerText">
        <van-checkbox v-model="checked" icon-size="15px" @click.stop="selectAll(checked)" />
        全选
        <span style="margin-left: 1em">已选中{{ chooseNumber }}人</span>
      </div>
    </foot>
    <van-popup v-model="show" position="bottom" :style="{ height: '50%' }">
      <van-picker
        title="请选择要新增的记录"
        show-toolbar
        :columns="columns"
        @confirm="onConfirm"
        @cancel="show=false"
      />
    </van-popup>
  </div>

</template>

<script>
/**
 * index create by Administrator
 * createTime 2020/11/03 15:18
 */
import settingTitle from './components/settingTitle'
import foot from './components/footer'
import { queryManagement, queryChildList, querySetting } from '@/service/daycare/dailyManage'
import { DateFormat } from '@/js/rules'
import noContent from '@/components/common/noContent'

export default {
  name: 'Index',
  components: { settingTitle, foot, noContent },
  filters: {},
  mixins: [],
  props: {},
  data() {
    return {
      value: 0,
      option: [
        { text: '暂无课程', value: 0 }
      ],
      checked: false,
      show: false,
      showList: [],
      selectedList: [],
      chooseNumber: 0,
      settingList: [],
      columns: []
    }
  },
  computed: {},
  watch: {
    selectedList() {
      this.chooseNumber = this.selectedList.length
    }
  },
  created() {
    this.getManage()
  },
  mounted() {
    this.getSetting()
  },
  methods: {
    getIconTxt(name) {
      if (this.type !== 'organization') {
        if (name.length > 2) {
          return name.substring(name.length - 2)
        } else {
          return name
        }
      }
    },
    changeClass() {
      this.getStu()
    },
    toDetail(item) {
      this.$router.push(`/daycare_dailyManageDetail?childId=${item.childId}&name=${item.childName}`)
    },
    getSetting() {
      querySetting().then(res => {
        // console.log(res.data.data)
        this.settingList = res.data.data
        res.data.data.forEach(v => {
          this.columns.push(v.diarySettingName)
        })
      })
    },
    footBtnClick() {
      // console.log(this.selectedList)
      // const data = []
      // this.selectedList.forEach(v => {
      //   data.push(v.childId)
      // })
      this.show = true
    },
    onConfirm(value, index) {
      const childId = []
      const sleepFlag = []
      this.selectedList.forEach(v => {
        childId.push(v.childId)
        sleepFlag.push(v.sleepFlag)
      })
      if (childId.length) {
        const sleepType = sleepFlag.reduce((all, cur) => {
          return all === -1 ? cur : (all !== cur ? -2 : cur)
        }, -1)
        if (sleepType !== -2) {
          this.$router.push(`/daycare_dailyManageProject?name=${this.$route.query.name}&type=${this.settingList[index].type}&diarySettingId=${this.settingList[index].diarySettingId}&way=all&typeName=${value}&childId=${childId}`)
        } else {
          this.$toast({
            message: '请选择状态相同的宝宝',
            duration: 1000,
            icon: 'icon iconfont iconwrong'
          })
        }
      } else {
        this.$toast({
          message: '请选择宝宝',
          duration: 1000,
          icon: 'icon iconfont iconwrong'
        })
      }
      // console.log(this.settingList[index])
      this.show = false
    },
    selectAll(checked) {
      if (!checked) { // 取消全选
        //  全选所有
        this.selectedList = []
        this.showList.forEach(v => {
          if (v.attendStatus === 'NOT_ATTENDANCE' || v.attendStatus === 'IN_SCHOOL') {
            v.checked = true
            this.selectedList.push(v)
          }
        })
        // console.log(this.showList)
      } else { // 取消全选
        this.selectedList = []
        this.showList.forEach(v => {
          if (v.attendStatus === 'NOT_ATTENDANCE' || v.attendStatus === 'IN_SCHOOL') {
            v.checked = false
          }
        })
      }
    },
    selectOne(item) { // 单选
      if (!item.checked) {
        // 选中
        if (!['ABSENT_FROM_WORK', 'ASK_FOR_LEAVE', 'EFFECTIVE_ASK_FOR_LEAVE', 'OUT_SCHOOL'].includes(item.attendStatus)) {
          item.checked = !item.checked
          this.selectedList.push(item)
        }
        if (this.selectedList.length === this.showList.length) this.checked = true
      } else {
        // 取消选中
        // console.log(item.check)
        item.checked = !item.checked
        for (let i = 0; i < this.selectedList.length; i++) {
          if (this.selectedList[i].childId === item.childId) {
            this.selectedList.splice(i, 1)
            if (this.selectedList.length !== this.showList.length) this.checked = false
            break
          }
        }
      }
    },
    getManage() {
      queryManagement({ date: DateFormat(new Date(), 'yyyy-MM-dd') }).then(res => {
        // console.log(res.data.data)
        this.option = []
        const data = res.data.data
        data.forEach(v => {
          this.option.push({ text: v.courseName + ' ' + v.clazzName, value: v.courseManagementId })
        })
        if (!this.option.length) {
          this.option = [{ text: '暂无课程', value: 0 }]
        } else {
          this.value = this.option[0].value
          this.getStu()
        }
      })
    },
    getStu() {
      queryChildList({ courseManagementId: this.value }).then(res => {
        const data = res.data.data
        // this.showList = data
        const rut = {
          'NOT_ATTENDANCE': '未考勤',
          'IN_SCHOOL': '已入园',
          'OUT_SCHOOL': '已离园',
          'ABSENT_FROM_WORK': '缺勤',
          'ASK_FOR_LEAVE': '请假',
          'EFFECTIVE_ASK_FOR_LEAVE': '有效请假'
        }
        data.forEach(v => {
          v.check = false
          if (v.sleepFlag) {
            v.status = rut[v.attendStatus] + ' 睡眠中'
          } else {
            v.status = rut[v.attendStatus]
          }
        })
        // console.log(data)
        this.showList = data
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.index-wrap {
  .vh {
    visibility: hidden;
  }

  ::v-deep .van-dropdown-menu__bar {
    background-color: $theme;
    height: 33px;
    line-height: 33px;
    box-shadow: none;
  }

  ::v-deep .van-dropdown-menu__title::after {
    border-color: transparent transparent #ffffff #ffffff;
  }

  ::v-deep .van-dropdown-menu {
    height: 34px;
  }

  ::v-deep .van-dropdown-menu {
    background-color: transparent;

    .van-ellipsis, .van-dropdown-menu__title::after {
      color: $white;
      font-size: 14px;
    }
  }

  .van-checkbox {
    margin-right: 12px;
  }

  ::v-deep .van-checkbox__icon--checked .van-icon {
    background-color: $theme;
    border-color: $theme;
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

  .status {
    font-size: 12px;
    color: #999999;
    display: block;
    text-align: left;
  }

  .stuName {
    font-size: 15px;
    color: #222222;
    display: block;
    text-align: left;
  }

  .footerText {
    display: flex;
    font-size: 12px;
    color: $text-5;

    ::v-deep .van-checkbox {
      margin-right: 9px;
    }

    span {
      //color: $theme;
    }
  }

  .noImg {
    @include wh(100%, 100%);
    width: 35px;
    line-height: 38px;
    color: $white;
    font-size: 13px;
    background-color: $theme;
    position: relative;
    @include round(38px);
    overflow: hidden;
    margin-right: 15px;
  }

  &.organization {
    .avatarBox {
      .noImg {
        background-color: $text-d;
      }
    }

    .rightArea {
      padding-top: 9px;
      font-size: 12px;
    }

  }
}
</style>
