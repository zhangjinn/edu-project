<template>
  <div class="endorsement">
    <div class="header">
      <div class="selectBox van-hairline--bottom">
        <van-row>
          <van-col :span="8" class="textLeft">
            <dropdown
              ref="school"
              :school-id="schoolId"
              type="school"
              size="normal"
              @open="openSchool"
              @select="confirmSchool"
            />
          </van-col>
          <van-col :span="8" class="textCenter">
            <dropdown
              ref="clazz"
              :school-id="schoolId"
              :clazz-id="clazzId"
              type="clazz"
              size="normal"
              @open="openClazz"
              @select="confirmClazz"
            />
          </van-col>
          <van-col :span="8" class="textRight">
            <popup :title="currentDate" type="date" size="normal" @select="confirmDate" />
          </van-col>
        </van-row>
      </div>
      <div class="tabBox van-hairline--bottom">
        <tabs :tab-list="tabList" :tab-active="tabActive" @change="tabChange" />
        <div class="search" @click="openSearch">
          <span class="iconfont iconchazhao" />
          <span>搜索</span>
        </div>
        <div v-if="showSearch&&notSearch" class="overlay" />
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
    <div class="container">
      <div v-if="tabActive === 0">
        <van-checkbox-group v-model="result" checked-color="#10C2C4">
          <template v-for="(item, index) in notEnterList">
            <universal-card
              :key="index"
              :index="item.customerId"
              :icon="item.avatar"
              :name="item.customerName"
              :multiple="true"
              :search-value="onSearchValue"
              @click.native="chooseItem(item.customerId)"
            />
          </template>
        </van-checkbox-group>
        <div v-if="!notEnterList.length" class="noData">
          <no-content message="未到园补签列表为空~" />
        </div>
      </div>
      <div v-else>
        <van-checkbox-group v-model="result" checked-color="#10C2C4">
          <template v-for="(item, index) in notLeftList">
            <universal-card
              :key="index"
              :index="item.customerId"
              :icon="item.avatar"
              :name="item.customerName"
              :multiple="true"
              :search-value="onSearchValue"
              @click.native="chooseItem(item.customerId)"
            />
          </template>
        </van-checkbox-group>
        <div v-if="!notLeftList.length" class="noData">
          <no-content message="未离园补签列表为空~" />
        </div>
      </div>
    </div>
    <div v-show="hidshow" class="bottomFixed">
      <div class="bottomBtn van-hairline--top">
        <div class="btn" @click="openTimePicker">
          <control-btn :text="result.length > 1 ? '批量补签' : '补签'" type="primary" :disabled="!result.length" />
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
    <!--    补签时间选择-->
    <van-popup v-model="showTimePicker" position="bottom" get-container="#app">
      <van-datetime-picker
        v-model="currentTime"
        type="time"
        title="选择时间"
        @cancel="closePicker"
        @confirm="confirmTime"
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
import { getSuppleList, postEnterSupple, postLeaveSupple } from '../../../../service/neuroo/attendance'

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
      tabList: ['未到园', '未离园'],
      currentDate: '',
      schoolId: null,
      clazzId: null,
      checked: false,
      notEnterList: [],
      notLeftList: [],
      result: [],
      showTimePicker: false,
      currentTime: '08:00'
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
      this.currentDate = DateFormat(new Date(), 'yyyy.MM.dd')
    }
    if (this.$route.query.school) {
      this.schoolId = parseInt(this.$route.query.school)
    }
    if (this.$route.query.clazz) {
      this.clazzId = parseInt(this.$route.query.clazz)
    }
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
    getData() {
      this.result = []
      this.getNotEnterList()
      this.getNotLeaveList()
    },
    // 获取未入园会员列表
    getNotEnterList() {
      const date = this.currentDate.replace(/\./g, '-')
      const param = {
        supplementType: 'NOT_ARRIVED',
        date: date
      }
      if (this.schoolId) {
        param.schoolId = this.schoolId
      } else {
        param.schoolId = undefined
      }
      if (this.clazzId) {
        param.clazzId = this.clazzId
      } else {
        param.clazzId = undefined
      }
      if (this.searchValue) {
        param.customerName = this.searchValue
      } else {
        param.customerName = undefined
      }
      getSuppleList(param).then(res => {
        this.notEnterList = res.data.data
      })
    },
    // 获取未离园会员列表
    getNotLeaveList() {
      const date = this.currentDate.replace(/\./g, '-')
      const param = {
        supplementType: 'NOT_LEFT',
        date: date
      }
      if (this.schoolId) {
        param.schoolId = this.schoolId
      } else {
        param.schoolId = undefined
      }
      if (this.clazzId) {
        param.clazzId = this.clazzId
      } else {
        param.clazzId = undefined
      }
      if (this.searchValue) {
        param.customerName = this.searchValue
      } else {
        param.customerName = undefined
      }
      getSuppleList(param).then(res => {
        this.notLeftList = res.data.data
      })
    },
    tabChange(index) {
      this.tabActive = index
      this.result = []
      this.checked = false
    },
    // 全选
    selectAll() {
      this.result = []
      if (!this.checked) {
        if (this.tabActive === 0) {
          this.notEnterList.forEach(item => {
            this.result.push(item.customerId)
          })
        } else {
          this.notLeftList.forEach(item => {
            this.result.push(item.customerId)
          })
        }
      }
    },
    // 选择会员
    chooseItem(id) {
      if (this.result.includes(id)) {
        this.result.splice(this.result.indexOf(id), 1)
      } else {
        this.result.push(id)
      }
      if (this.tabActive === 0) {
        if (this.result.length === this.notEnterList.length) {
          this.checked = true
        } else {
          this.checked = false
        }
      } else {
        if (this.result.length === this.notLeftList.length) {
          this.checked = true
        } else {
          this.checked = false
        }
      }
    },
    // 时间选择
    openTimePicker() {
      if (!this.result.length) return
      if (this.tabActive === 0) {
        this.currentTime = '08:00'
      } else {
        this.currentTime = '17:00'
      }
      this.showTimePicker = true
    },
    closePicker() {
      this.showTimePicker = false
    },
    confirmTime(time) {
      this.showTimePicker = false
      if (this.tabActive === 0) {
        this.addEnterSupple(time)
      } else {
        this.addLeaveSupple(time)
      }
    },
    // 未入园补签
    addEnterSupple(time) {
      const date = this.currentDate.replace(/\./g, '-')
      const param = {
        ids: this.result,
        date: date,
        time: date + ' ' + time + ':00'
      }
      postEnterSupple(param).then(() => {
        setTimeout(() => {
          this.$toast({
            message: '补签成功',
            duration: 1000,
            icon: 'icon iconfont iconsuccess'
          })
        }, 50)
        setTimeout(() => {
          this.getData()
        }, 1000)
      })
    },
    // 未离园补签
    addLeaveSupple(time) {
      const date = this.currentDate.replace(/\./g, '-')
      const param = {
        ids: this.result,
        date: date,
        time: date + ' ' + time + ':00'
      }
      postLeaveSupple(param).then(() => {
        setTimeout(() => {
          this.$toast({
            message: '补签成功',
            duration: 1000,
            icon: 'icon iconfont iconsuccess'
          })
        }, 50)
        setTimeout(() => {
          this.getData()
        }, 1000)
      })
    },
    // 园区切换
    confirmSchool(val, type) {
      this.schoolId = val.value
      if (type === 'load') return
      this.clazzId = 0
      this.getData()
    },
    // 班级切换
    confirmClazz(val) {
      this.clazzId = val.value
      this.getData()
    },
    // 日期切换
    confirmDate(date) {
      if (this.currentDate === DateFormat(date, 'yyyy.MM.dd')) return
      this.currentDate = DateFormat(date, 'yyyy.MM.dd')
      this.getData()
    },
    openSchool(val) {
      if (val) {
        this.$refs.clazz.opendropdown(false)
      }
    },
    openClazz(val) {
      if (val) {
        this.$refs.school.opendropdown(false)
      }
    },
    returnBack() {
      this.$router.back(-1)
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
        }

        .noData {
            padding-top: 80px;
            height: calc(100vh - 258px);
            background-color: $white;
        }
    }
</style>
