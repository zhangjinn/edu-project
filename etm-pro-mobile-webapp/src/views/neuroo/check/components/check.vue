<template>
  <div class="check">
    <div class="header">
      <van-search
        v-model="searchValue"
        placeholder="搜索学员姓名"
        class="searchBox"
        @search="onSearch"
        @clear="clearSearch"
      />
      <div class="parkBox van-hairline--bottom">
        <div class="park">
          <dropdown
            ref="school"
            type="school"
            @open="openSchool"
            @select="confirmSchool"
          />
        </div>
        <div class="park">
          <dropdown
            ref="clazz"
            :school-id="schoolId"
            type="clazz"
            @open="openClazz"
            @select="confirmClazz"
          />
        </div>
      </div>
      <div class="tabs">
        <div class="tab mainColor" :class="tabActive === 1 ? 'first' : ''" @click="tabChange(1)">
          <div class="text">待检</div>
          <div>
            <span class="count">{{ stateData.uncheckNumber }}</span>
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
      <div v-if="tabActive === 1">
        <van-checkbox-group v-model="result" checked-color="#10C2C4">
          <template v-for="(item, index) in uncheckList">
            <universal-card
              :key="index"
              :index="item.customerId"
              :icon="item.avatar"
              :name="item.customerName"
              :multiple="true"
              :search-value="onSearchValue"
              @click.native="toDetail(item.customerId)"
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
      <div v-if="tabActive === 2">
        <van-checkbox-group v-model="result" checked-color="#10C2C4">
          <template v-for="(item, index) in checkList">
            <universal-card
              :key="index"
              :index="item.customerId"
              :icon="item.avatar"
              :name="item.customerName"
              :multiple="true"
              :search-value="onSearchValue"
              @click.native="toDetail(item.customerId)"
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
      <div v-if="tabActive === 3">
        <van-checkbox-group v-model="result" checked-color="#10C2C4">
          <template v-for="(item, index) in abnormalList">
            <universal-card
              :key="index"
              :index="item.customerId"
              :icon="item.avatar"
              :name="item.customerName"
              :multiple="true"
              :search-value="onSearchValue"
              @click.native="toDetail(item.customerId)"
            >
              <div class="content">
                <div class="errorColor van-ellipsis">{{ item.symptom }}</div>
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
import dropdown from '../../components/dropdown'
import universalCard from '../../../../components/common/universalCard'
import controlBtn from '../../../../components/common/controlBtn'
import abnormalCard from './abnormalCard'
import noContent from '../../../../components/common/noContent'
import dragButton from '../../../../components/common/dragButton'
import { getCheckState, getCheckCustomerList, postCheck, putCheck } from '../../../../service/neuroo/check'
import { DateFormat, replaceSpace } from '../../../../js/rules'
import { uploadFile } from '../../../../service/upload'

export default {
  name: 'Check',
  components: {
    dropdown,
    universalCard,
    controlBtn,
    abnormalCard,
    noContent,
    dragButton
  },
  props: {
    checkType: {
      type: String,
      default() {
        return null
      }
    }
  },
  data() {
    return {
      type: '',
      date: '',
      searchValue: '',
      onSearchValue: '',
      schoolId: null,
      clazzId: null,
      clazzIdList: [],
      tabActive: 1,
      result: [],
      resultList: [],
      showAbnormalCard: false,
      stateData: {},
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
              if (val[i] === this.uncheckList[n].customerId) {
                this.resultList.push(this.uncheckList[n])
              }
            }
          } else if (this.tabActive === 2) {
            for (let n = 0; n < this.checkList.length; n++) {
              if (val[i] === this.checkList[n].customerId) {
                this.resultList.push(this.checkList[n])
              }
            }
          } else {
            for (let n = 0; n < this.abnormalList.length; n++) {
              if (val[i] === this.abnormalList[n].customerId) {
                this.resultList.push(this.abnormalList[n])
              }
            }
          }
        }
      },
      deep: true
    }
  },
  created() {
    if (this.checkType === 'morning') {
      this.type = 'MORNING_CHECK'
    } else if (this.checkType === 'noon') {
      this.type = 'NOON_CHECK'
    } else {
      this.type = 'NIGHT_CHECK'
    }
    this.date = DateFormat(new Date(), 'yyyy-MM-dd')
  },
  methods: {
    onSearch() {
      this.searchValue = replaceSpace(this.searchValue)
      this.onSearchValue = this.searchValue
      this.loadAgain()
    },
    clearSearch() {
      this.onSearchValue = ''
      this.loadAgain()
    },
    loadAgain() {
      this.getState()
      this.getCustomer()
    },
    confirmSchool(val, type) {
      this.schoolId = val.value
      if (type === 'load') return
      this.clazzId = 0
      this.loadAgain()
    },
    confirmClazz(val) {
      this.clazzId = val.value
      this.loadAgain()
    },
    // 获取各状态人数
    getState() {
      const param = {
        date: this.date,
        checkTypeEnum: this.type
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
        param.name = this.searchValue
      } else {
        param.name = undefined
      }
      getCheckState(param).then(res => {
        this.stateData = res.data.data
      })
    },
    getCustomer() {
      this.getUncheck()
      this.getNormal()
      this.getAbnormal()
    },
    // 获取未检会员列表
    getUncheck() {
      const param = {
        date: this.date,
        checkTypeEnum: this.type,
        checkStateEnum: 'UNCHECK'
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
        param.name = this.searchValue
      } else {
        param.name = undefined
      }
      getCheckCustomerList(param).then(res => {
        this.uncheckList = res.data.data
      })
    },
    // 获取已检正常会员列表
    getNormal() {
      const param = {
        date: this.date,
        checkTypeEnum: this.type,
        checkStateEnum: 'CHECKED'
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
        param.name = this.searchValue
      } else {
        param.name = undefined
      }
      getCheckCustomerList(param).then(res => {
        this.checkList = res.data.data
      })
    },
    // 获取已检异常会员列表
    getAbnormal() {
      const param = {
        date: this.date,
        checkTypeEnum: this.type,
        checkStateEnum: 'ABNORMAL'
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
        param.name = this.searchValue
      } else {
        param.name = undefined
      }
      getCheckCustomerList(param).then(res => {
        this.abnormalList = res.data.data
      })
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
          this.checkName += item.customerName
        } else {
          this.checkName += '、' + item.customerName
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
      const checkArr = []
      const clazzArr = []
      this.resultList.forEach(item => {
        checkArr.push(item.checkRecordId)
        clazzArr.push(item.clazzId)
      })
      const param = {
        date: this.date,
        customerIdList: this.result,
        clazzIdList: clazzArr,
        abnormal: false,
        checkType: this.type
      }
      if (this.tabActive === 1) {
        this.submit(param, 2)
      } else if (this.tabActive === 3) {
        param.checkRecordIdList = checkArr
        this.update(param, 2)
      }
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
      const checkArr = []
      const clazzArr = []
      this.resultList.forEach(item => {
        checkArr.push(item.checkRecordId)
        clazzArr.push(item.clazzId)
      })
      const param = {
        date: this.date,
        customerIdList: this.result,
        clazzIdList: clazzArr,
        abnormal: true,
        checkType: this.type,
        temperature: this.abnormalData.degress,
        symptom: this.abnormalData.symptomResult.join(',')
      }
      if (this.abnormalData.remark && this.abnormalData.remark.trim()) {
        param.mark = this.abnormalData.remark
      }
      if (this.abnormalData.imgUrl.length) {
        param.imageList = []
        let count = 0
        this.abnormalData.imgUrl.forEach(item => {
          if (item.file) { // 新上传图片
            uploadFile(item.file, 'neuroo/check/abnormal', 'image').then(res => {
              const img = {
                name: item.file.name,
                url: res.data.key
              }
              param.imageList.push(img)
              count++
              if (count === this.abnormalData.imgUrl.length) {
                if (this.tabActive === 1) {
                  this.submit(param, 3)
                } else {
                  param.checkRecordIdList = checkArr
                  this.update(param, 3)
                }
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
              if (this.tabActive === 1) {
                this.submit(param, 3)
              } else {
                param.checkRecordIdList = checkArr
                this.update(param, 3)
              }
            }
          }
        })
      } else {
        if (this.tabActive === 1) {
          this.submit(param, 3)
        } else {
          param.checkRecordIdList = checkArr
          this.update(param, 3)
        }
      }
    },
    // 新增检查
    submit(data, active) {
      postCheck(data).then(() => {
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
          this.loadAgain()
        }, 1000)
      })
    },
    // 修改检查
    update(data, active) {
      putCheck(data).then(() => {
        setTimeout(() => {
          this.$toast({
            message: '修改检查成功',
            duration: 1000,
            icon: 'icon iconfont iconsuccess'
          })
        }, 50)
        setTimeout(() => {
          this.tabActive = active
          this.result = []
          this.resultList = []
          this.abnormalData = {}
          this.loadAgain()
        }, 1000)
      })
    },
    returnBack() {
      this.$router.back(-1)
    },
    toDetail(id) {
      this.$router.push({
        path: '/checkDetail_neuroo',
        query: {
          customerId: id
        }
      })
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

    .parkBox {
      display: flex;

      .park {
        flex: 1;
      }
    }

    .tabs {
      display: flex;
      justify-content: space-between;
      padding: 12px;

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
  }

  .container {
    max-height: calc(100vh - 278px);
    overflow-y: auto;

    &.hidshow {
      max-height: calc(100vh - 160px);
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
</style>
