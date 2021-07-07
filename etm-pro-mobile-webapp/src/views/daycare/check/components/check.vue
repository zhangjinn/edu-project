<template>
  <div class="check">
    <div class="header">
      <div class="topHeader">{{ subject.checkSettingsName }}</div>
      <div class="classRoom">
        <span
          ref="spanTimeRef"
          class="triangle_down"
          @click="clickBtn"
        >{{ classRoom }}</span>
      </div>
      <van-popup v-model="showClassRoom" position="bottom" @open="openPopup" @close="closePopup">
        <van-picker
          v-show="showClassRoom"
          show-toolbar
          title="课程/班级"
          :columns="columns"
          :default-index="0"
          @confirm="onConfirm"
          @cancel="onCancel"
        />
      </van-popup>

      <van-search
        v-model="searchValue"
        placeholder="搜索学员姓名"
        class="searchBox"
        @search="onSearch"
        @clear="clearSearch"
      />
      <div class="tabs">
        <div class="tab mainColor" :class="tabActive === 1 ? 'first' : ''" @click="tabChange(1)">
          <div class="text">待检</div>
          <div>
            <span class="count">{{ stateData.pendingNumber }}</span>
            <span>人</span>
          </div>
        </div>
        <div class="tab greenColor" :class="tabActive === 2 ? 'second' : ''" @click="tabChange(2)">
          <div class="text">正常</div>
          <div>
            <span class="count">{{ stateData.normalNumber }}</span>
            <span>人</span>
          </div>
        </div>
        <div class="tab errorColor" :class="tabActive === 3 ? 'third' : ''" @click="tabChange(3)">
          <div class="text">异常</div>
          <div>
            <span class="count">{{ stateData.abnormalNumber }}</span>
            <span>人</span>
          </div>
        </div>
      </div>
    </div>
    <div class="container" :class="!hidshow ? 'hidshow' : ''">
      <!--      待检-->
      <div v-if="tabActive === 1">
        <van-checkbox-group v-model="result" checked-color="#10C2C4">
          <template v-for="(item, index) in uncheckList">
            <universal-card
              :key="index"
              :index="item.childId"
              :icon="item.avatar"
              :name="item.name"
              :multiple="true"
              :search-value="onSearchValue"
              @click.native="toDetail(item.childId)"
            >
              <div class="content">
                <div class="rightIcon textRight">
                  <span class="iconfont iconright" />
                </div>
              </div>
            </universal-card>
          </template>
        </van-checkbox-group>
        <div v-if="!uncheckList.length" class="noData">
          <no-content message="待检列表为空~" />
        </div>
      </div>
      <!--      正常-->
      <div v-if="tabActive === 2">
        <van-checkbox-group v-model="result" checked-color="#10C2C4">
          <template v-for="(item, index) in checkList">
            <universal-card
              :key="index"
              :index="item.childId"
              :icon="item.avatar"
              :name="item.name"
              :multiple="true"
              :search-value="onSearchValue"
              @click.native="toDetail(item.childId)"
            >
              <div class="content">
                <div class="labelColor">正常</div>
                <div class="rightIcon textRight">
                  <span class="iconfont iconright" />
                </div>
              </div>
            </universal-card>
          </template>
        </van-checkbox-group>
        <div v-if="!checkList.length" class="noData">
          <no-content message="今天没有检查内容哦~" />
        </div>
      </div>
      <!--      异常-->
      <div v-if="tabActive === 3">
        <van-checkbox-group v-model="result" checked-color="#10C2C4">
          <template v-for="(item, index) in abnormalList">
            <universal-card
              :key="index"
              :index="item.childId"
              :icon="item.avatar"
              :name="item.name"
              :multiple="true"
              :search-value="onSearchValue"
              @click.native="toDetail(item.childId)"
            >
              <div class="content">
                <div class="errorColor van-ellipsis">{{ item.checkSettingsNames }}</div>
                <div class="rightIcon textRight">
                  <span class="iconfont iconright" />
                </div>
              </div>
            </universal-card>
          </template>
        </van-checkbox-group>
        <div v-if="!abnormalList.length" class="noData">
          <no-content message="今天没有检查内容哦~" />
        </div>
      </div>
    </div>
    <div v-show="hidshow" class="bottomFixed">
      <div class="bottomBtn van-hairline--top">
        <div class="btn" @click="submitNormal">
          <control-btn type="primary" text="正常" :disabled="tabActive === 2 || !result.length" />
        </div>
        <div class="btn" @click="openCard">
          <control-btn type="danger" text="异常" :disabled="!result.length" />
        </div>
      </div>
    </div>
    <drag-button
      text="返回"
      position="right"
      icon-direction="left"
      size="small"
      :top="470"
      @click="returnBack"
    />
    <!--正常确认弹窗-->
    <van-dialog
      v-model="showDialog"
      :title="tabActive === 1 ? '确认提交' : '确认修改'"
      show-cancel-button
      confirm-button-color="#10C2C4"
      cancel-button-color="#666666"
      @confirm="confirmSubmit"
    >
      <div class="dialogInner">
        <span>确认将</span>
        <span class="mainColor">{{ checkName }}</span>
        <span>的{{ tabActive === 1 ? '检查信息' : '修改数据' }}提交吗？</span>
      </div>
    </van-dialog>
    <!--异常面板-->
    <van-action-sheet
      v-model="showAbnormalCard"
      class="abnormalAction"
      :title="'已选会员(' + result.length+')'"
      :close-on-click-overlay="false"
      get-container="#app"
    >
      <abnormal-card
        :list="resultList"
        :show="showAbnormalCard"
        :tab="tabActive"
        @cancel="closeAbnormal"
        @confirm="getAbnormalData"
      />
    </van-action-sheet>
  </div>
</template>

<script>
// import dropdown from '../../components/dropdown'
import universalCard from '../../../../components/common/universalCard'
import controlBtn from '../../../../components/common/controlBtn'
import abnormalCard from './abnormalCard'
import noContent from '../../../../components/common/noContent'
import dragButton from '../../../../components/common/dragButton'
import { DateFormat, replaceSpace } from '@/js/rules'
import { uploadFile } from '@/service/upload'
// import { Toast } from 'vant'
import { createNewCheck, queryCheckChild, queryClazzAndCourse, queryTypeNumber } from '@/service/daycare/bodyCheck'

export default {
  name: 'Check',
  components: {
    // dropdown,
    universalCard,
    controlBtn,
    abnormalCard,
    noContent,
    dragButton
  },
  props: {
    subject: {
      type: Object,
      default: () => {
      }
    }
  },
  data() {
    return {
      columns: [],
      isToggle: false,
      classRoom: '课程/班级列表为空',
      showClassRoom: false,
      classCourse: {},
      courseManagementId: null,
      date: '',
      searchValue: '',
      onSearchValue: '',
      gradeId: null,
      clazzId: null,
      clazzIdList: [],
      tabActive: 1,
      result: [],
      resultList: [],
      showAbnormalCard: false,
      stateData: {
        pendingNumber: 0,
        normalNumber: 0,
        abnormalNumber: 0
      },
      uncheckList: [],
      checkList: [],
      abnormalList: [],
      showDialog: false,
      checkName: '',
      abnormalData: {},
      isNormalSubmit: true
    }
  },
  computed: {
    hidshow() {
      return this.$store.state.show.showBottom
    }
  },
  watch: {
    result: {
      handler(val) {
        this.resultList = []
        for (let i = 0; i < val.length; i++) {
          if (this.tabActive === 1) {
            for (let n = 0; n < this.uncheckList.length; n++) {
              if (val[i] === this.uncheckList[n].childId) {
                this.resultList.push(this.uncheckList[n])
              }
            }
          } else if (this.tabActive === 2) {
            for (let n = 0; n < this.checkList.length; n++) {
              if (val[i] === this.checkList[n].childId) {
                this.resultList.push(this.checkList[n])
              }
            }
          } else {
            for (let n = 0; n < this.abnormalList.length; n++) {
              if (val[i] === this.abnormalList[n].childId) {
                this.resultList.push(this.abnormalList[n])
              }
            }
          }
        }
      },
      deep: true
    },
    subject: {
      handler() {
        this.getClass()
      },
      deep: true
    }
  },
  created() {
    this.date = DateFormat(new Date(), 'yyyy-MM-dd')
  },
  mounted() {
  },
  methods: {
    clickBtn() {
      this.showClassRoom = true
      this.isToggle = true
    },
    onConfirm(value, index) {
      if (value) {
        // Toast(`当前值：${value}, 当前索引：${index}`)
        this.classRoom = this.columns[index]
        // console.log(this.columns[index], index)
        this.courseManagementId = this.classCourse[index].courseManagementId
        this.getAll()
      }
      this.showClassRoom = false
      this.isToggle = false
      this.toggleClass()
    },
    onCancel() {
      // Toast('取消')
      this.showClassRoom = false
      this.isToggle = false
    },
    openPopup() {
      this.toggleClass()
    },
    closePopup() {
      this.showPopup = this.isToggle = false
      this.toggleClass()
    },
    // 选择课程转换颜色
    toggleClass() {
      if (this.isToggle) {
        this.$refs.spanTimeRef.classList.remove('triangle_down')
        this.$refs.spanTimeRef.classList.add('triangle_up')
      } else {
        this.$refs.spanTimeRef.classList.remove('triangle_up')
        this.$refs.spanTimeRef.classList.add('triangle_down')
      }
    },
    onSearch() {
      this.searchValue = replaceSpace(this.searchValue)
      this.onSearchValue = this.searchValue
      // this.loadAgain()
      // console.log(this.searchValue)
      if (this.columns.length) {
        this.getAll()
      }
    },
    clearSearch() {
      this.onSearchValue = ''
      // this.loadAgain()
      if (this.columns.length) {
        this.getAll()
      }
    },
    loadAgain() {
      this.getState()
      this.getCustomer()
    },
    // 获取课程班级
    getClass() {
      queryClazzAndCourse().then(res => {
        // console.log(res.data.data)
        const classCourse = []
        res.data.data.forEach(item => {
          classCourse.push(item.courseName + ' ' + item.clazzName)
        })
        // console.log(classCourse)
        this.classCourse = res.data.data
        if (this.classCourse.length) {
          this.classRoom = classCourse[0]
          this.columns = classCourse
          this.courseManagementId = this.classCourse[0].courseManagementId
          // console.log(this.subject)
          // console.log(this.subject.checkSettingsId)
          this.getAll()
        }
      })
    },
    // 获取各状态人数
    getThreeNumber() {
      queryTypeNumber({
        caScourseManagementId: this.courseManagementId,
        examinationSettingsId: this.subject.checkSettingsId
      }).then(res => {
        // console.log(res.data.data)
        this.stateData = res.data.data
      })
    },
    getAll() {
      this.getThreeNumber()
      this.getChild()
      this.getNormalChild()
      this.getErrorChild()
    },
    // 获取未检学员
    getChild() {
      queryCheckChild({
        courseManagementId: this.courseManagementId,
        type: 'PENDING',
        examinationSettingsId: this.subject.checkSettingsId,
        childName: (this.searchValue) || null
      }).then(res => {
        // console.log(res.data.data)
        this.uncheckList = res.data.data
      }
      )
    },
    // 获取正常学员
    getNormalChild() {
      queryCheckChild({
        courseManagementId: this.courseManagementId,
        type: 'NORMAL',
        examinationSettingsId: this.subject.checkSettingsId,
        childName: (this.searchValue) || null
      }).then(res => {
        // console.log(res.data.data)
        this.checkList = res.data.data
      }
      )
    },
    // 获取异常学员
    getErrorChild() {
      queryCheckChild({
        courseManagementId: this.courseManagementId,
        type: 'ABNORMAL',
        examinationSettingsId: this.subject.checkSettingsId,
        childName: (this.searchValue) || null
      }).then(res => {
        // console.log(res.data.data)
        this.abnormalList = res.data.data
      }
      )
    },
    tabChange(index) {
      if (this.tabActive !== index) {
        this.result = []
        this.resultList = []
      }
      this.tabActive = index
    },
    // 点击正常按钮
    submitNormal() {
      if (this.result.length) {
        this.openDialog()
        this.isNormalSubmit = true
      }
    },
    // 打开确认弹窗
    openDialog() {
      this.checkName = ''
      this.resultList.forEach((item, index) => {
        if (index === 0) {
          this.checkName += item.name
        } else {
          this.checkName += '、' + item.name
        }
      })
      this.showDialog = true
    },
    // 弹窗点击确认
    confirmSubmit() {
      if (this.isNormalSubmit) {
        this.checkNormal()
      } else {
        this.checkAbnormal()
      }
    },
    // 提交正常检查
    checkNormal() {
      const childIds = []
      // console.log(this.resultList)
      this.resultList.forEach(item => {
        childIds.push(item.childId)
      })
      let target = 'PENDING'
      if (this.tabActive === '1') {
        target = 'PENDING'
      } else if (this.tabActive === 2) {
        target = 'NORMAL'
      } else {
        target = 'ABNORMAL'
      }
      // console.log(this.tabActive)
      createNewCheck({
        childIds: childIds,
        caScourseManagementId: this.courseManagementId,
        examinationSettingsId: this.subject.checkSettingsId,
        type: 'NORMAL',
        source: target,
        bodyTemperature: null,
        imageList: null,
        remarks: null,
        checkSettingsIds: null
      }).then(() => {
        setTimeout(() => {
          this.$toast({
            message: '新增检查成功',
            duration: 1000,
            icon: 'icon iconfont iconsuccess'
          })
        }, 50)
        setTimeout(() => {
          this.tabActive = 2
          this.result = []
          this.resultList = []
          this.abnormalData = {}
          this.getAll()
        }, 1000)
      })
    },
    // 打开异常面板
    openCard() {
      if (this.result.length) {
        this.showAbnormalCard = true
      }
    },
    // 关闭异常面板
    closeAbnormal() {
      this.showAbnormalCard = false
    },
    // 获取异常面板录入的数据
    getAbnormalData(data) {
      this.abnormalData = data
      this.isNormalSubmit = false
      this.showAbnormalCard = false
      this.openDialog()
    },
    // 提交异常检查
    checkAbnormal() {
      const childIds = []
      // console.log(this.resultList)
      this.resultList.forEach(item => {
        childIds.push(item.childId)
      })
      let target = 'PENDING'
      if (this.tabActive === '1') {
        target = 'PENDING'
      } else if (this.tabActive === 2) {
        target = 'NORMAL'
      } else {
        target = 'ABNORMAL'
      }
      const param = {
        date: this.date,
        childIds: childIds,
        abnormal: true,
        subject: this.subject,
        temperature: this.abnormalData.degress,
        symptom: this.abnormalData.symptomResult,
        source: target
      }
      if (this.abnormalData.remark && this.abnormalData.remark.trim()) {
        param.mark = this.abnormalData.remark
      }
      if (this.abnormalData.imgUrl.length) {
        param.imageList = []
        let count = 0
        this.abnormalData.imgUrl.forEach(item => {
          if (item.file) { // 新上传图片
            uploadFile(item.file, 'daycare/check/abnormal', 'image').then(res => {
              const img = {
                name: item.file.name,
                url: res.data.key
              }
              param.imageList.push(img)
              count++
              if (count === this.abnormalData.imgUrl.length) {
                this.submit(param, 3)
              }
            })
          } else { // 修改时已有的图片
            const img = {
              name: item.name,
              url: item.url
            }
            param.imageList.push(img)
            count++
            if (count === this.abnormalData.imgUrl.length) {
              this.submit(param, 3)
            }
          }
        })
      } else {
        this.submit(param, 3)
      }
    },
    // 新增检查
    submit(data, active) {
      createNewCheck({
        childIds: data.childIds,
        caScourseManagementId: this.courseManagementId,
        examinationSettingsId: this.subject.checkSettingsId,
        type: 'ABNORMAL',
        source: data.source,
        bodyTemperature: data.temperature,
        imageList: (data.imageList) || null,
        remarks: (data.mark) || null,
        checkSettingsIds: (data.symptom) || null
      }).then(() => {
        setTimeout(() => {
          this.$toast({
            message: '新增检查成功',
            duration: 1000,
            icon: 'icon iconfont iconsuccess'
          })
        }, 50)
        setTimeout(() => {
          this.tabActive = active
          this.result = []
          this.resultList = []
          this.abnormalData = {}
          this.getAll()
        }, 1000)
      })
    },
    returnBack() {
      this.$router.back(-1)
    },
    toDetail(id) {
      this.$router.push({
        path: '/daycare_bodyCheckDetail',
        query: {
          childId: id
        }
      })
    },
    openGrade(val) {
      if (val) {
        this.$refs.clazz.opendropdown(false)
      }
    },
    openClazz(val) {
      if (val) {
        this.$refs.grade.opendropdown(false)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.check {
  .header {
    background-color: $white;

    .searchBox {
      padding: 15px 12px 0;
    }

    .selectBox {
      display: flex;

      .select {
        flex: 1;
      }
    }

    .tabs {
      display: flex;
      justify-content: space-between;
      padding: 12px;
      margin-top: 10px;

      .tab {
        display: flex;
        justify-content: space-between;
        padding: 0 10px;
        width: 110px;
        height: 42px;
        line-height: 42px;
        border: 1px solid $text-e;
        background-color: $bg-9;
        @include border-radius(2px);

        &.first {
          border: 1px solid $theme;
          background-color: $white;
        }

        &.second {
          border: 1px solid $green;
          background-color: $white;
        }

        &.third {
          border: 1px solid $red;
          background-color: $white;
        }

        .text {
          font-size: 15px;
        }

        span {
          font-size: 12px;

          &.count {
            margin-right: 4px;
            font-size: 17px;
          }
        }
      }
    }

    .classRoom {
      text-align: center;
      background-color: #FFFDFD;
      height: 45px;
      line-height: 45px;
      box-sizing: border-box;
    }

    .topHeader {
      font-size: 15px;
      color: #222222;
      height: 34px;
      line-height: 34px;
      letter-spacing: 2px;
      border-bottom: 1px solid #F5F5F5;
    }
  }

  .container {
    max-height: calc(100vh - 322px);
    overflow-y: auto;

    &.hidshow {
      max-height: calc(100vh - 202px);
    }
  }

  .content {
    display: flex;

    .errorColor {
      max-width: 84px;
    }

    .rightIcon {
      width: 18px;

      .iconfont {
        font-size: 12px;
        color: $text-b;
      }
    }
  }

  .noData {
    height: calc(100vh - 278px);
    background-color: $white;
  }
}

.abnormalAction {
  max-height: 90%;

  /deep/ .van-action-sheet__header {
    text-align: left;
    text-indent: 12px;
    font-size: 15px;
    color: $text-2;

    .van-icon {
      color: $text-5;
      font-size: 18px;
    }
  }
}

.dialogInner {
  padding: 24px 12px;
  font-size: 14px;
  color: $text-6;
}

.triangle_down {
  font-size: 15px;
  position: relative;

  &:after {
    position: absolute;
    top: 50%;
    right: -13px;
    content: '';
    width: 7px;
    height: 7px;
    border: 1px solid;
    border-left: 0;
    border-top: 0;
    transform: translateY(-70%) rotate(45deg);
  }
}

.triangle_up {
  position: relative;
  color: $theme;

  &:after {
    position: absolute;
    top: 60%;
    right: -13px;
    content: '';
    width: 7px;
    height: 7px;
    border: 1px solid;
    border-left: 0;
    border-top: 0;
    transform: translateY(-50%) rotate(-135deg);
  }
}
</style>
