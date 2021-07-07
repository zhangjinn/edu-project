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
            <dropdown ref="grade" :date="currentDate" @select="confirmGrade" />
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

      <div v-if="tabActive === 0" class="countBox">
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

    <div class="container">
      <div>
        <van-checkbox-group v-model="result" checked-color="#10C2C4">
          <template v-for="(item, index) in list">
            <universal-card
              :key="index"
              :icon="item.avatar"
              :index="item.childCourseId"
              :multiple="tabActive === 0 ? true : false"
              :content="item.status === 'OUT_SCHOOL' ?'接送人：' + item.parentName + ' ' + '(' + item.relationshipName + ')' : ''"
              :name="item.childName"
              :search-value="onSearchValue"
              @click.native="
                tabActive === 0 ? chooseItem(item.childCourseId) : null
              "
            >
              <div v-if="tabActive === 1" class="status">
                <span class="type" :class="getStatusClass(item.status)">
                  {{ getStatusName(item.status) }}
                </span>
                <control-btn
                  v-if="item.status === 'IN_SCHOOL'"
                  class="control-btn"
                  text="离园"
                  type="primary"
                  size="small"
                  @click.native="handleChangePersonRelationId(item)"
                />
                <control-btn
                  v-else
                  class="control-btn"
                  text="修改考勤"
                  type="primary"
                  size="small"
                  @click.native="handleChange(item.attendanceId)"
                />
              </div>
              <div v-if="tabActive === 2">
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

    <div v-if="tabActive === 0" v-show="hidshow" class="bottomFixed">
      <div class="bottomBtn van-hairline--top">
        <div class="btn" @click="handleControlBtnClick">
          <control-btn
            :disabled="!result.length"
            text="考勤"
            type="primary"
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
        :columns="checkColumns"
        @cancel="showPicker = false"
        @confirm="onConfirm"
      />
    </van-popup>

    <van-action-sheet
      v-model="showParent"
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
import tabs from '../../../../components/common/tabs'
import universalCard from '../../../../components/common/universalCard'
import controlBtn from '../../../../components/common/controlBtn'
import dropdown from '../../components/dropdownClazz'
import popup from '../../components/popup'
import noContent from '../../../../components/common/noContent'
import dragButton from '../../../../components/common/dragButton'
import { DateFormat, replaceSpace } from '../../../../js/rules'
import {
  addDaycareAattendance,
  queryChildRelationship,
  queryDayCountDetail,
  updateDaycareAattendance
} from '@/service/daycare/attendanceCare'

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
      tabList: ['未考勤', '已到园', '已离园'],
      tabListValue: ['NOT_ATTENDANCE', ['IN_SCHOOL', 'ASK_FOR_LEAVE'], 'OUT_SCHOOL'],
      checkColumns: ['到园', '缺勤', '请假'],
      checkTypes: [
        {
          text: '到园',
          value: 'IN_SCHOOL'
        },
        {
          text: '缺勤',
          value: 'ABSENT_FROM_WORK'
        },
        {
          text: '请假',
          value: 'ASK_FOR_LEAVE'
        }
      ],
      currentDate: '',
      id: null,
      clazzId: null,
      result: [],
      list: [],
      checked: false,
      showPicker: false,
      showParent: false,
      parentActions: []
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
      this.id = parseInt(this.$route.query.grade)
    }
    this.getData()
    // if (this.$route.query.clazz) {
    //   this.clazzId = parseInt(this.$route.query.clazz)
    // }
  },
  methods: {
    handleControlBtnClick() {
      if (!this.result.length) return
      else this.showPicker = true
    },
    getParent(item) {
      const param = {
        childId: item.childId
      }
      queryChildRelationship(param).then(res => {
        const data = res.data.data
        this.parentActions = []
        data.forEach(it => {
          const name =
              it.parentName +
            '（' +
              it.relationshipName +
            '）'
          const action = {
            name: name,
            value: it.parentName,
            id: it.personRelationId
          }
          this.parentActions.push(action)
        })
        this.showParent = true
        this.result = [item.attendanceId]
      })
    },
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
    getData() {
      this.result = []
      const date = this.currentDate.replace(/\./g, '-')
      this.list = []
      if (this.tabListValue[this.tabActive] instanceof Array) {
        this.tabListValue[this.tabActive].forEach(v => {
          this.queryDayCountDetail(date, v, this.id)
        })
      } else {
        this.queryDayCountDetail(date, this.tabListValue[this.tabActive], this.id)
      }
      // if (this.tabListValue[this.tabActive] instanceof Array) {
      //   queryDayCountDetail({
      //     date,
      //     type: this.tabListValue[this.tabActive][0],
      //     courseManagementId: this.gradeId
      //   }).then(res => {
      //     // console.log(res.data)
      //     this.list = res.data.data
      //     queryDayCountDetail({
      //       date,
      //       type: this.tabListValue[this.tabActive][1],
      //       courseManagementId: this.gradeId
      //     }).then(res => {
      //       // console.log(res.data)
      //       this.list = this.list.concat(res.data.data)
      //     })
      //   })
      // } else {
      //   queryDayCountDetail({
      //     date,
      //     type: this.tabListValue[this.tabActive],
      //     courseManagementId: this.gradeId
      //   }).then(res => {
      //     // console.log(res.data)
      //     this.list = res.data.data
      //   })
      // }

      // this.getNotEnterList()
      // this.getNotLeaveList()
    },
    queryDayCountDetail(date, type, courseManagementId) {
      queryDayCountDetail({
        date,
        type,
        courseManagementId
      }).then(res => {
        // console.log(res.data)
        this.list = this.list.concat(res.data.data)
      })
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
      if (!this.checked) {
        this.list.forEach(item => {
          this.result.push(item.childCourseId)
        })
      }
    },
    // 选择会员
    chooseItem(id) {
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
    handleChangePersonRelationId(item) {
      this.getParent(item)
    },
    handleChange(id) {
      this.result = [id]
      this.showPicker = true
    },
    onConfirm(v) {
      const status = this.checkTypes.find(it => it.text === v).value
      const fn = [addDaycareAattendance, updateDaycareAattendance]
      const params = [{ childCourseIdList: this.result, status }, { caAattendanceIdList: this.result, status }]
      // if (this.tabActive === 0) {
      //   params = { childCourseIdList: this.result, status }
      // } else {
      //   params = { caAattendanceIdList: this.result, status }
      // }
      fn[this.tabActive](params[this.tabActive]).then(res => {
        this.getData()
      })
      this.showPicker = false
    },
    confirmParent(v) {
      this.showParent = false
      // console.log(v)
      const { id } = v
      const personRelationId = id
      // console.log(personRelationId)
      updateDaycareAattendance({ caAattendanceIdList: this.result, status: 'OUT_SCHOOL', personRelationId }).then(res => {
        this.getData()
      })
    },
    closePicker() {
      this.showPicker = false
    },
    // 切换
    confirmGrade(val, type) {
      this.id = val.value
      if (type === 'load') return
      this.getData()
    },
    // 日期切换
    confirmDate(date) {
      if (this.currentDate === DateFormat(date, 'yyyy-MM-dd')) return
      this.currentDate = DateFormat(date, 'yyyy-MM-dd')
      if (date > new Date(new Date(new Date().getTime()).setHours(23, 59, 59, 999))) {
        this.checkColumns = ['请假']
      } else {
        this.checkColumns = ['到园', '缺勤', '请假']
      }
      this.getData()
    },
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
        case 'IN_SCHOOL':
          classId = 'inschool'
          break
        case 'OUT_SCHOOL':
          classId = 'outschool'
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
        case 'IN_SCHOOL':
          name = '到园'
          break
        case 'OUT_SCHOOL':
          name = '离园'
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

.status {
  width: 200px;
  display: flex;
  flex-direction: row;
  justify-content: space-evenly;
  padding-right: 20px;
  align-items: center;
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

  &.inschool {
    color: $green;
    background-color: $greenLight;
  }

  &.outschool {
    color: $green;
    background-color: $greenLight;
  }
}

.bottom {
  padding: 10px 12px;
}

.control-btn{
  /deep/ .controlBtnInner{
    padding: 0px 8px;
  }
}
</style>
