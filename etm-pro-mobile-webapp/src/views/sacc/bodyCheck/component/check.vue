<template>
  <div class="checkTest">
    <div class="topFixed">
      <div class="tabs van-hairline--bottom">
        <div class="tab" :class="tabActive === 1 ? 'active' : ''" @click="tabChange(1)">未检查</div>
        <div class="tab" :class="tabActive === 2 ? 'active' : ''" @click="tabChange(2)">已检查</div>
      </div>
    </div>
    <div v-if="tabActive === 1" class="container">
      <div v-if="uncheckList.length" class="list">
        <div v-for="(item,index) in uncheckList" :key="index" class="clazzes">
          <div class="clazzName textLeft">{{ item.clazzName }}</div>
          <template v-for="(customer,i) in item.customerList">
            <universal-card
              :key="i"
              :name="customer.customerName"
              :icon="customer.avatar"
              @click.native="testCustomer(item, customer)"
            />
          </template>
        </div>
      </div>
      <div v-else class="noList">
        <no-content message="未检查会员列表为空" type="list" />
      </div>
    </div>
    <div v-else class="container">
      <div v-if="checkedList.length" class="list">
        <div v-for="(item,index) in checkedList" :key="index" class="clazzes">
          <div class="clazzName textLeft">{{ item.clazzName }}</div>
          <template v-for="(customer,i) in item.customerList">
            <universal-card
              :key="i"
              :name="customer.customerName"
              :icon="customer.icon"
              @click.native="testCustomer(item, customer)"
            >
              <div class="mark">
                <span v-if="customer.abnormal" class="abnormalItem van-ellipsis">{{ null }}</span>
                <span v-if="customer.abnormal" class="abnormal">异常</span>
                <span v-else class="normal">正常</span>
              </div>
            </universal-card>
          </template>
        </div>
      </div>
      <div v-else class="noList">
        <no-content message="已检查会员列表为空" type="list" />
      </div>
    </div>
    <!--    检查项目面板-->
    <van-action-sheet v-model="showPanel" :close-on-click-overlay="false" get-container="#app">
      <div class="panelContent">
        <div class="customerName textLeft">{{ customerName }}</div>
        <div class="customerClazz textLeft">{{ customerClazz }}</div>
        <div class="itemBox">
          <van-row v-if="listData.length">
            <van-col
              v-for="(item,index) in listData"
              :key="index"
              :span="6"
              :class="getClass(index)"
            >
              <div class="item">
                <div class="label van-ellipsis">{{ item.checkProjectName }}</div>
                <div class="stateBox">
                  <template v-if="item.checkProjectName === '体温'">
                    <div
                      class="state temperature"
                      :class="!item.detail ? '' : item.detail < 35 || item.detail > 37.2 ? 'abnormal' : 'normal'"
                      @click="openTemperature(item, index)"
                    >
                      <span v-if="item.detail">{{ item.detail }}</span>
                      <span v-else class="iconfont iconplus" />
                    </div>
                  </template>
                  <template v-else>
                    <div
                      v-if="item.abnormal"
                      class="state abnormal"
                      @click="openOtherItem(item, index)"
                    >
                      <span class="iconfont iconfail" />
                      <span>异常</span>
                    </div>
                    <div
                      v-else
                      class="state normal"
                      @click="openOtherItem(item, index)"
                    >
                      <span class="iconfont iconcorrect" />
                      <span>正常</span>
                    </div>
                  </template>
                </div>
              </div>
            </van-col>
          </van-row>
          <div v-if="!listData.length" class="noCheckItem">未设置检查项目</div>
        </div>
        <div class="bottom van-hairline--top">
          <div class="btn" @click="cancelPanel">
            <control-btn text="取消" type="cancel" />
          </div>
          <div class="btn" @click="postImg">
            <control-btn :text="tabActive === 1 ? '完成' : '修改'" type="primary" />
          </div>
        </div>
      </div>
    </van-action-sheet>
    <!--    体温录入面板-->
    <van-action-sheet v-model="showTemperature" title="体温" :close-on-click-overlay="false" get-container="#app">
      <div class="temperatureContent">
        <div class="inputBox">
          <van-field
            v-model="degress"
            type="number"
            placeholder="请输入体温度数"
            @blur="submitNum"
          />
          <van-cell title="建议离园" required>
            <van-radio-group v-model="temRadio" checked-color="#10C2C4" direction="horizontal">
              <van-radio name="yes" icon-size="0.42667rem">是</van-radio>
              <van-radio name="no" icon-size="0.42667rem">否</van-radio>
            </van-radio-group>
          </van-cell>
          <div
            v-if="degressAbnormal"
            class="abnormalMark"
          >
            <span class="iconfont iconfail" />
            <span>异常</span>
          </div>
        </div>
        <div class="bottom van-hairline--top">
          <div class="btn" @click="confirmDegress">
            <control-btn text="确定" type="primary" :disabled="!degress" />
          </div>
        </div>
      </div>
    </van-action-sheet>
    <!--    其他检查项目异常面板-->
    <van-action-sheet
      v-model="showOtherItem"
      :title="otherTitle"
      :close-on-click-overlay="false"
      get-container="#app"
    >
      <div class="otherItemContent">
        <div class="content">
          <van-cell title="是否异常" required>
            <van-radio-group v-model="normalRadio" checked-color="#10C2C4" direction="horizontal">
              <van-radio name="yes" icon-size="0.42667rem">是</van-radio>
              <van-radio name="no" icon-size="0.42667rem">否</van-radio>
            </van-radio-group>
          </van-cell>
          <van-cell title="建议离园" required>
            <van-radio-group v-model="leaveRadio" checked-color="#10C2C4" direction="horizontal">
              <van-radio name="yes" icon-size="0.42667rem">是</van-radio>
              <van-radio name="no" icon-size="0.42667rem">否</van-radio>
            </van-radio-group>
          </van-cell>
          <div class="selfCell textLeft">
            <div class="title">异常描述</div>
            <textarea
              v-model="abnormalTxt"
              class="textarea"
              placeholder="请输入异常描述"
            />
          </div>
          <div class="selfCell textLeft">
            <div class="title">上传图片</div>
            <div class="pictureBox">
              <van-uploader
                v-model="fileList"
                :max-count="1"
                upload-icon="plus"
                :after-read="afterRead"
                @delete="deleteImg"
              />
            </div>
          </div>
        </div>
        <div class="bottom van-hairline--top">
          <div class="btn" @click="confirmOtherItem">
            <control-btn text="确定" type="primary" />
          </div>
        </div>
      </div>
    </van-action-sheet>
  </div>
</template>

<script>
import universalCard from '../../../../components/common/universalCard'
import controlBtn from '../../../../components/common/controlBtn'
import noContent from '../../../../components/common/noContent'
import { uploadFile } from '../../../../service/upload'
import {
  getUncheckList,
  getCheckList,
  getCheckItem,
  addOrUpdateCheck,
  getCheckDetail
} from '../../../../service/sacc/sacc'
import { parseData } from '../../../../js/rules'

export default {
  name: 'MorningTest',
  components: {
    universalCard,
    controlBtn,
    noContent
  },
  props: {
    type: {
      type: String,
      default() {
        return null
      }
    },
    date: {
      type: String,
      default() {
        return null
      }
    }
  },
  data() {
    return {
      checkType: null,
      checkTitle: null,
      currentDate: null,
      tabActive: 1,
      uncheckList: [],
      checkedList: [],
      showPanel: false,
      customerName: null,
      customerId: null,
      customerClazz: null,
      customerClazzId: null,
      customerCheckId: null,
      checkItem: [],
      defaultList: [],
      listData: [],
      dataChange: false,
      imgData: [],
      degressAbnormal: false,
      showTemperature: false,
      templateIndex: 0,
      degress: null,
      temRadio: 'no',
      showOtherItem: false,
      itemIndex: 0,
      otherTitle: null,
      normalRadio: 'no',
      leaveRadio: 'no',
      abnormalTxt: null,
      fileList: [],
      imageUrl: null
    }
  },
  created() {
    this.currentDate = this.date
    if (this.type === 'morning') {
      this.checkType = 'MORNING_CHECK'
    } else {
      this.checkType = 'NOON_CHECK'
    }
    this.getList()
    this.getItem()
  },
  methods: {
    tabChange(index) {
      this.tabActive = index
    },
    getList() {
      const param = {
        date: this.currentDate,
        checkType: this.checkType
      }
      getCheckList(param).then(res => {
        this.checkedList = res.data.data
      })
      getUncheckList(param).then(res => {
        this.uncheckList = res.data.data
      })
    },
    getItem() {
      const param = {
        enable: true
      }
      getCheckItem(param).then(res => {
        this.checkItem = res.data.data
        this.checkItem.forEach(item => {
          const data = {
            checkProjectName: item.checkProjectName,
            abnormal: false,
            image: null,
            detail: null,
            adviseLeave: false
          }
          this.defaultList.push(data)
        })
      })
    },
    // 打开检查面板
    testCustomer(item, customer) {
      this.showPanel = true
      this.dataChange = false
      this.degressAbnormal = false
      this.listData = parseData(this.defaultList)
      this.customerName = customer.customerName
      this.customerId = customer.customerId
      this.customerClazz = item.clazzName
      this.customerClazzId = item.clazzId
      this.degress = null
      if (this.tabActive === 2) {
        this.customerCheckId = customer.customerCheckId
        this.getCheckedData()
      }
    },
    // 已检查的获取数据
    getCheckedData() {
      const param = {
        customerCheckId: this.customerCheckId
      }
      getCheckDetail(param).then(res => {
        const resData = res.data.data
        const list = resData.customerCheckDetails
        this.listData = []
        list.forEach(item => {
          if (item.checkProjectName === '体温') {
            this.degress = item.detail || resData.bodyTemperature
            if (!item.detail) {
              item.detail = resData.bodyTemperature
            }
            if (this.degress && (this.degress < 35 || this.degress > 37.2)) {
              this.degressAbnormal = true
            } else {
              this.degressAbnormal = false
            }
          }
          this.listData.push(item)
        })
      })
    },
    getClass(index) {
      const len = this.checkItem.length
      const num = Math.ceil(len / 4)
      if (index < ((num - 1) * 4)) {
        return 'van-hairline--bottom'
      } else {
        return null
      }
    },
    cancelPanel() {
      if (!this.dataChange) {
        this.showPanel = false
        return
      }
      this.$dialog.confirm({
        title: '确认关闭检查录入面板？',
        message: '关闭面板会导致已录入数据丢失',
        confirmButtonColor: '#F53939',
        cancelButtonColor: '#666666'
      }).then(() => {
        this.showPanel = false
      }).catch(() => {
        // onCancel
      })
    },
    // 上传图片到服务器
    postImg() {
      let num = 0
      let count = 0
      for (let i = 0; i < this.listData.length; i++) {
        if (this.listData[i].image && this.listData[i].image.name) {
          count++
          uploadFile(this.listData[i].image, 'bodyCheck/customer/checkRecord', 'image').then(res => {
            this.listData[i].image = res.data.key
            num++
            if (num === count) {
              this.submitCheck()
            }
          })
        }
      }
      if (count === 0) {
        this.submitCheck()
      }
    },
    // 新增或更新晨午检数据
    submitCheck() {
      if (!this.checkItem.length) return
      const arr = []
      this.listData.forEach(item => {
        if (item.abnormal || item.adviseLeave || item.detail || item.image) {
          item.checkProjectId = undefined
          arr.push(item)
        }
      })
      const param = {
        checkType: this.checkType,
        date: this.currentDate,
        clazzId: this.customerClazzId,
        bodyTemperature: this.degress,
        customerId: this.customerId,
        customerCheckDetails: arr
      }
      if (this.tabActive === 2) {
        param.customerCheckId = this.customerCheckId
      }
      addOrUpdateCheck(param).then(() => {
        setTimeout(() => {
          this.$toast({
            message: '检查成功',
            duration: 1000,
            icon: 'icon iconfont iconsuccess'
          })
        }, 50)
        setTimeout(() => {
          this.showPanel = false
          this.getList()
        }, 1000)
      })
    },
    // 打开体温录入面板
    openTemperature(item, index) {
      this.showTemperature = true
      this.templateIndex = index
      if (item.adviseLeave) {
        this.temRadio = 'yes'
      } else {
        this.temRadio = 'no'
      }
    },
    submitNum() {
      if (this.degress < 35 || this.degress > 37.2) {
        this.degressAbnormal = true
      } else {
        this.degressAbnormal = false
      }
    },
    // 确定体温数据
    confirmDegress() {
      if (this.degress) {
        this.showTemperature = false
        this.dataChange = true
        this.listData[this.templateIndex].detail = this.degress
        if (this.temRadio === 'yes') {
          this.listData[this.templateIndex].adviseLeave = true
        } else {
          this.listData[this.templateIndex].adviseLeave = false
        }
        if (this.degressAbnormal === true) {
          this.listData[this.templateIndex].abnormal = true
        } else {
          this.listData[this.templateIndex].abnormal = false
        }
      }
    },
    // 打开其他检查项目正常或异常录入面板
    openOtherItem(item, index) {
      this.showOtherItem = true
      this.otherTitle = item.checkProjectName
      this.itemIndex = index
      if (item.abnormal) {
        this.normalRadio = 'yes'
      } else {
        this.normalRadio = 'no'
      }
      if (item.adviseLeave) {
        this.leaveRadio = 'yes'
      } else {
        this.leaveRadio = 'no'
      }
      this.abnormalTxt = item.detail
      this.fileList = []
      if (item.image) {
        if (item.image.type) {
          this.fileList.push(this.imgData[index])
          this.imageUrl = item.image
        } else {
          this.fileList.push({ url: item.image, isImage: true })
          this.imageUrl = item.image
        }
      }
    },
    afterRead(file) {
      this.imageUrl = file.file
      this.imgData[this.itemIndex] = this.fileList[0]
    },
    deleteImg() {
      this.fileList = []
      this.imageUrl = null
    },
    confirmOtherItem() {
      this.showOtherItem = false
      this.dataChange = true
      if (this.normalRadio === 'yes') {
        this.listData[this.itemIndex].abnormal = true
      } else {
        this.listData[this.itemIndex].abnormal = false
      }
      if (this.leaveRadio === 'yes') {
        this.listData[this.itemIndex].adviseLeave = true
      } else {
        this.listData[this.itemIndex].adviseLeave = false
      }
      this.listData[this.itemIndex].detail = this.abnormalTxt
      this.listData[this.itemIndex].image = this.imageUrl
    }
  }
}
</script>

<style lang="scss" scoped>

.checkTest {
  .topFixed {
    height: 50px;

    .tabs {
      position: fixed;
      top: 0;
      left: 0;
      z-index: 11;
      width: 100%;
      height: 50px;
      background-color: $white;

      .tab {
        display: inline-block;
        width: 50%;
        height: 50px;
        line-height: 50px;
        color: $text-6;

        &.active {
          position: relative;
          color: $theme;

          &::after {
            display: inline-block;
            position: absolute;
            left: 0;
            right: 0;
            bottom: 0;
            content: '';
            margin: 0 auto;
            width: 30px;
            height: 2px;
            background-color: $theme;
          }
        }
      }
    }
  }

  .container {
    .list {
      padding-bottom: 12px;

      .clazzes {
        .clazzName {
          padding: 14px 12px;
          font-size: 14px;
        }

        .mark {
          position: relative;
          width: 160px;
          text-align: right;

          span {
            display: inline-block;
            width: 36px;
            height: 22px;
            line-height: 22px;
            font-size: 13px;
            text-align: center;

            &.abnormalItem {
              position: absolute;
              top: 8px;
              right: 48px;
              z-index: 11;
              width: 120px;
              text-align: right;
            }

            &.normal {
              color: $green;
              border: .5px solid $green;
            }

            &.abnormal {
              color: $red;
              border: .5px solid $red;
            }
          }
        }
      }
    }

    .noList {
      height: calc(100vh - 100px);
      background-color: $white;

      .noContent {
        padding-top: 150px;
      }
    }
  }
}

.panelContent {
  .customerName {
    padding: 15px 12px 0;
    font-size: 14px;
  }

  .customerClazz {
    padding: 12px 12px 0;
    font-size: 13px;
    color: $text-6;
  }

  .itemBox {
    padding: 0 12px 40px;

    .item {
      padding: 15px 0;

      .label {
        font-size: 14px;
      }

      .stateBox {
        margin-top: 15px;

        .state {
          margin: 0 auto;
          width: 55px;
          height: 24px;

          span {
            display: inline-block;
            font-size: 12px;
            line-height: 24px;

            &.iconfont {

            }
          }

          &.temperature {
            color: $text-6;
            background-color: $bg-5;

            .iconfont {
              color: $theme;
            }
          }

          &.normal {
            color: $green;
            background-color: $greenLight;

            .iconfont {
              margin-right: 4px;
              color: $green;
            }
          }

          &.abnormal {
            color: $red;
            background-color: $redLight;

            .iconfont {
              margin-right: 4px;
              color: $red;
            }
          }
        }
      }
    }

    .noCheckItem {
      color: $text-9;
      font-size: 15px;
    }
  }

  .bottom {

    .btn {
      display: inline-block;
      width: 170px;

      &:first-child {
        margin-right: calc(100% - 340px);
      }
    }
  }
}

.temperatureContent {
  .inputBox {
    position: relative;
    padding: 0 0 200px;

    .abnormalMark {
      position: absolute;
      top: 20px;
      right: 12px;
      margin: 0 auto;
      width: 55px;
      height: 24px;
      font-size: 12px;
      line-height: 24px;
      text-align: center;
      color: $red;
      background-color: $redLight;

      .iconfont {
        margin-right: 4px;
        color: $red;
      }
    }

    .van-cell {
      padding: 20px 12px;

      &::before {
        left: 6px;
      }

      &::after {
        left: 12px !important;
        right: 12px !important;
      }
    }

    .van-radio-group {
      display: flex;
      justify-content: space-between;
      padding-left: 50px;
    }
  }
}

.otherItemContent {
  .van-cell {
    padding: 20px 12px;

    .van-radio-group {
      display: flex;
      justify-content: space-between;
      padding-left: 50px;
    }

    &::before {
      left: 6px;
    }

    &::after {
      left: 12px !important;
      right: 12px !important;
    }
  }

  .selfCell {
    padding: 20px 12px;

    .title {
      color: $text-2;
      font-size: 15px;
    }

    .textarea {
      margin-top: 16px;
      width: 100%;
      font-size: 15px;
    }

    .pictureBox {
      margin-top: 16px;
    }
  }
}

/deep/ .van-action-sheet__header {
  text-align: left;
  text-indent: 12px;
  color: $text-2;

  .van-icon {
    color: $text-5;
    font-size: 18px;
  }
}

.bottom {
  padding: 10px 12px;
}
</style>
