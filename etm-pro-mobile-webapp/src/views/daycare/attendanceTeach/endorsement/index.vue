<template>
  <div class="endorsement">
    <div class="header">
      <!--  筛选 -->
      <div class="selectBox van-hairline--bottom">
        <van-row>
          <van-col :span="12" class="textCenter">
            <popup
              :title="currentDate"
              type="date"
              size="normal"
              @select="confirmDate"
            />
          </van-col>
          <van-col :span="12" class="textCenter">
            <dropdown
              ref="grade"
              :date="currentDate"
              @open="openGrade"
              @select="confirmGrade"
            />
          </van-col>
        </van-row>
      </div>

      <!--  tab -->
      <div class="tabBox van-hairline--bottom">
        <tabs :tab-list="tabList" :tab-active="tabActive" @change="tabChange" />
        <div class="search" @click="openSearch">
          <span class="iconfont iconchazhao" />
          <span>搜索</span>
        </div>
        <div v-if="showSearch && notSearch" class="overlay" />
        <div v-if="showSearch" class="searchBox">
          <van-search
            v-model="searchValue"
            placeholder="搜索学员姓名"
            class="searchInput"
            show-action
            @search="onSearch"
            @cancel="onCancel"
          />
        </div>
      </div>

      <div class="countBox">
        <div class="inner van-hairline--bottom">
          <div class="selectAll">
            <van-checkbox
              v-model="checked"
              checked-color="#10C2C4"
              icon-size="0.42667rem"
              @click="selectAll"
            >全选
            </van-checkbox>
          </div>
          <div class="count">
            <span>选中</span>
            <span class="mainColor number">{{ result.length }}</span>
            <span>人</span>
          </div>
        </div>
      </div>
    </div>

    <!--    <div class="container" :class="tabActive === 1 ? 'noBtn' : ''">-->
    <div class="container">
      <div>
        <van-checkbox-group v-model="result" checked-color="#10C2C4">
          <template v-for="(item, index) in list">
            <universal-card
              :key="index"
              :index="tabActive? item.attendanceId: item.childCourseId"
              :icon="item.avatar"
              :name="item.childName"
              :content="item.courseName + ' ' + item.startTime +' ' +item.endTime"
              :multiple="true"
              :search-value="onSearchValue"
              @click.native="chooseItem(item)"
            >
              <div v-if="tabActive === 1" class="status">
                <span class="type" :class="getStatusClass(item.status)">
                  {{ getStatusName(item.status) }}
                </span>
              </div>
            </universal-card>
          </template>
        </van-checkbox-group>
        <div v-if="!list.length" class="noData">
          <no-content message="列表为空~" />
        </div>
      </div>
    </div>

    <div v-show="hidshow" class="bottomFixed">
      <div class="bottomBtn van-hairline--top">
        <div class="btn" @click="handleControlBtnClick">
          <control-btn
            :text="tabActive ? '修改考勤' : '考勤'"
            type="primary"
            :disabled="!result.length"
          />
        </div>
      </div>
    </div>

    <drag-button
      text="返回"
      size="small"
      position="right"
      icon-direction="left"
      :top="470"
      @click="returnBack"
    />

    <van-popup v-model="showPicker" position="bottom" get-container="#app">
      <van-picker
        show-toolbar
        :columns="pickerColumns"
        @cancel="showPicker = false"
        @confirm="onConfirm"
      />
    </van-popup>
  </div>
</template>

<script>
import tabs from '../../../../components/common/tabs'
import universalCard from '../../../../components/common/universalCard'
import controlBtn from '../../../../components/common/controlBtn'
import dropdown from '../../components/dropdown'
import popup from '../../components/popup'
import noContent from '../../../../components/common/noContent'
import dragButton from '../../../../components/common/dragButton'
import { DateFormat, replaceSpace } from '../../../../js/rules'
import { addDaycareAattendance, queryDayCountDetail, updateDaycareAattendance } from '@/service/daycare/attendanceTeach'

export default {
  name: 'Index',
  components: {
    tabs,
    universalCard,
    controlBtn,
    noContent,
    popup,
    dropdown,
    dragButton
  },
  data() {
    return {
      showSearch: false,
      notSearch: false,
      searchValue: '',
      onSearchValue: '',
      tabActive: 0,
      tabList: ['未考勤', '已考勤'],
      currentDate: '',
      gradeId: null,
      clazzId: null,
      result: [],
      tabTypeList: [
        { text: '缺勤', value: 'ABSENT_FROM_WORK' },
        { text: '签到', value: 'SIGN_IN' },
        { text: '请假', value: 'ASK_FOR_LEAVE' }
      ],
      pickerColumns: ['签到', '请假', '缺勤'],
      list: [],
      checked: false,
      value: [],
      showPicker: false
    }
  },
  computed: {
    hidshow() {
      return this.$store.state.show.showBottom
    }
  },
  created() {
    if (this.$route.query.date) {
      this.currentDate = this.$route.query.date
    } else {
      this.currentDate = DateFormat(new Date(), 'yyyy-MM-dd')
    }
    if (this.$route.query.grade) {
      this.gradeId = parseInt(this.$route.query.grade)
    }
    this.getData()
    // if (this.$route.query.clazz) {
    //   this.clazzId = parseInt(this.$route.query.clazz)
    // }
  },
  methods: {
    openSearch() {
      this.showSearch = true
      this.notSearch = true
    },
    onSearch() {
      this.searchValue = replaceSpace(this.searchValue)
      this.notSearch = false
      this.onSearchValue = this.searchValue
      this.getData()
    },
    onCancel() {
      this.showSearch = false
      this.notSearch = false
      if (!this.onSearchValue) return
      this.searchValue = ''
      this.onSearchValue = this.searchValue
      this.getData()
    },
    handleControlBtnClick() {
      if (!this.result.length) return
      else this.showPicker = true
    },
    getData() {
      this.result = []
      const date = this.currentDate.replace(/\./g, '-')
      // console.log('date', date)
      // queryDayCountDetail({
      //   date,
      //   type: this.tabTypeList[this.tabActive].value,
      //   courseId: this.gradeId
      // }).then(res => {
      //   // console.log(res.data)
      //   this.list = res.data.data
      // })

      if (this.tabActive === 0) {
        queryDayCountDetail({
          date,
          type: 'NOT_ATTENDANCE',
          // type: this.tabTypeList[this.tabActive].value,
          courseManagementId: this.gradeId
        }).then(res => {
          // console.log(res.data)
          this.list = res.data.data
        })
      } else {
        queryDayCountDetail({
          date,
          type: 'ATTENDANCE',
          courseManagementId: this.gradeId
        }).then(res => {
          this.list = res.data.data
          queryDayCountDetail({
            date,
            type: 'ASK_FOR_LEAVE',
            courseManagementId: this.gradeId
          }).then(res => {
            // console.log(res.data)
            this.list = this.list.concat(res.data.data || [])
          })
        })
      }
    },

    tabChange(index) {
      this.tabActive = index
      this.result = []
      this.checked = false
      this.getData()
    },
    // 全选
    selectAll() {
      this.result = []
      let id
      // console.log(this.result)
      // console.log(this.checked)
      if (!this.checked) {
        this.list.forEach(item => {
          if (this.tabActive === 0) {
            id = item.childCourseId
          } else {
            id = item.attendanceId
          }
          this.result.push(id)
        })
      }
    },
    // 选择会员
    chooseItem(item) {
      let id
      if (this.tabActive === 0) {
        id = item.childCourseId
      } else {
        id = item.attendanceId
      }
      if (this.result.includes(id)) {
        this.result.splice(this.result.indexOf(id), 1)
      } else {
        this.result.push(id)
      }
      if (this.result.length === this.list.length) {
        this.checked = true
      } else {
        this.checked = false
      }
    },

    onConfirm(v) {
      // this.value = value;
      const checkeType = this.tabTypeList.find(it => it.text === v).value
      const fn = [addDaycareAattendance, updateDaycareAattendance]
      let params
      if (this.tabActive === 0) {
        params = { childCourseIdList: this.result, status: checkeType }
      } else {
        params = { caAattendanceIdList: this.result, status: checkeType }
      }
      // console.log(params)
      fn[this.tabActive](params).then(res => {
        this.getData()
      })
      this.showPicker = false
    },
    closePicker() {
      this.showPicker = false
    },
    // 园区切换
    confirmGrade(val, type) {
      this.gradeId = val.value
      if (type === 'load') return
      // this.clazzId = 0
      this.getData()
    },
    // 日期切换
    confirmDate(date) {
      if (this.currentDate === DateFormat(date, 'yyyy-MM-dd')) return
      this.currentDate = DateFormat(date, 'yyyy-MM-dd')
      if (date > new Date(new Date(new Date().getTime()).setHours(23, 59, 59, 999))) {
        this.pickerColumns = ['请假']
      } else {
        this.pickerColumns = ['签到', '请假', '缺勤']
      }
      this.getData()
    },
    openGrade(val) {},
    returnBack() {
      this.$router.back(-1)
    },
    getStatusClass(status) {
      let classId = ''
      switch (status) {
        case 'ABSENT_FROM_WORK':
          classId = 'absence'
          break
        case 'ASK_FOR_LEAVE':
          classId = 'askforleave'
          break
        case 'EFFECTIVE_ASK_FOR_LEAVE':
          classId = 'askforleave'
          break
        case 'SIGN_IN':
          classId = 'singin'
          break
      }
      return classId
    },
    getStatusName(status) {
      let name = ''
      switch (status) {
        case 'ABSENT_FROM_WORK':
          name = '缺勤'
          break
        case 'ASK_FOR_LEAVE':
          name = '请假'
          break
        case 'EFFECTIVE_ASK_FOR_LEAVE':
          name = '请假'
          break
        case 'SIGN_IN':
          name = '已签到'
          break
      }
      return name
    }
  }
}
</script>

<style lang="scss" scoped>
.endorsement {
  .header {
    background-color: $white;

    .selectBox {
      padding: 0 16px;
    }

    .tabBox {
      position: relative;
      display: flex;
      justify-content: space-between;
      padding: 0 12px;

      .search {
        height: 50px;
        line-height: 50px;

        span {
          font-size: 14px;
          color: $text-9;
        }

        .iconfont {
          margin-right: 6px;
        }
      }

      .overlay {
        position: fixed;
        top: 95px;
        left: 0;
        z-index: 111;
        width: 100%;
        height: calc(100vh - 95px);
        background-color: rgba(0, 0, 0, 0.7);
      }

      .searchBox {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;

        .searchInput {
          padding: 8px 4px 8px 12px;

          /deep/ .van-search__action {
            color: $theme;
          }
        }
      }
    }

    .countBox {
      padding: 0 12px;

      .inner {
        display: flex;
        justify-content: space-between;

        .selectAll {
          padding-top: 13px;
          font-size: 14px;
        }

        .count {
          height: 45px;
          line-height: 45px;

          span {
            font-size: 13px;

            &.number {
              margin: 0 2px;
              font-size: 15px;
            }
          }
        }
      }
    }
  }

  .container {
    max-height: calc(100vh - 258px);
    overflow-y: auto;

    &.noBtn {
      max-height: calc(100vh - 145px);
    }

    .leftBtn {
      padding: 4px 0;
      width: 55px;
    }
  }

  .noData {
    padding-top: 80px;
    height: calc(100vh - 258px);
    background-color: $white;

    &.arrived {
      height: calc(100vh - 145px);
    }
  }
}

.van-action-sheet__header {
  text-align: left;
  text-indent: 0.32rem;
  color: #222;
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

.type {
  display: inline-block;
  margin-left: 4px;
  width: 38px;
  height: 19px;
  line-height: 19px;
  font-size: 12px;
  text-align: center;

  &.absence {
    color: $red;
    background-color: $redLight;
  }

  &.askforleave {
    color: $yellow;
    background-color: $yellowLight;
  }

  &.singin {
    color: $green;
    background-color: $greenLight;
  }
}

.bottom {
  padding: 10px 12px;
}

</style>
