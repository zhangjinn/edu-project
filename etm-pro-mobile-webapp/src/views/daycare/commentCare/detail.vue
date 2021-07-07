<template>
  <div class="detail">
    <setting-title>
      <span class="settingHeader">{{ {home: '在家表现', school: '在园表现'}[tabsValue] }}</span>
    </setting-title>
    <div class="scrollWrap">
      <div class="behaviorWrap">
        <!-- <tabs :value.sync="tabsValue" /> -->
        <ul class="score">
          <li v-for="(item, index) in behaviorList" :key="index">
            <span>{{ item.whichPerformedName || item.itemName }}</span>
            <van-radio-group v-model="item.rate" :disabled="!!id || tabsValue === 'home'">
              <van-radio :name="3">
                <template #icon="props">
                  <img
                    class="img-icon"
                    :src="props.checked ? require('../../../assets/images/behavior-new/img-tbl-select.png') : require('../../../assets/images/behavior-new/icon-tbl-normal.png')"
                  >
                </template>
              </van-radio>
              <van-radio :name="2">
                <template #icon="props">
                  <img
                    class="img-icon"
                    :src="props.checked ? require('../../../assets/images/behavior-new/img-yjb-select.png') : require('../../../assets/images/behavior-new/icon-yjb-normal.png')"
                  >
                </template>
              </van-radio>
              <van-radio :name="1">
                <template #icon="props">
                  <img
                    class="img-icon"
                    :src="props.checked ? require('../../../assets/images/behavior-new/img-yjyl-select.png') : require('../../../assets/images/behavior-new/icon-yjy-normal.png')"
                  >
                </template>
              </van-radio>
            </van-radio-group>
          </li>
        </ul>
      </div>
      <div class="commentWrap">
        <div class="title">
          <span>{{ tabsValue === 'home' ? '家长寄语' : '老师寄语' }}</span>
          <div v-if="!id" class="btn" @click.stop="handleComment">{{ tabsValue === 'home' ? '提醒家长' : '点评模板' }}</div>
        </div>
        <van-field
          v-model="commentText"
          :readonly="!!id || tabsValue === 'home'"
          rows="4"
          type="textarea"
          placeholder="分享一下宝宝的进步吧"
        />
        <van-uploader
          v-model="imgUrl"
          :show-upload="!id"
          :deletable="!id"
          multiple
          :max-count="3"
          upload-icon="plus"
        />
      </div>
    </div>
    <div v-if="!id && tabsValue === 'school'" class="footBtn" @click.stop="submitComment">
      提交
    </div>
    <van-popup
      v-model="showPop"
      position="bottom"
      closeable
      :close-on-click-overlay="false"
      :style="{ height: '70%' }"
    >
      <p>点评模板</p>
      <ul class="templateTypeList">
        <li
          v-for="(t, index) in templateTypeList"
          :key="index"
          :class="{active: templateType === index}"
          @click.stop="templateType = index"
        >{{ t }}
        </li>
      </ul>
      <ul class="templateContentList">
        <li v-for="(template, index) in templateContentList" :key="index" @click.stop="addTemplate(index)">
          <p>{{ ('0' + (index + 1)).slice(-2) }}</p>
          <div class="templateContent">{{ template }}</div>
        </li>
      </ul>
    </van-popup>
  </div>
</template>
<script>
import settingTitle from './components/settingTitle'
// import tabs from './components/tabs'
import templateList from '@/views/guardcare/comment/template'
import { queryTypeEnum, createReviews, queryByReviewsId, queryRemind } from '@/service/daycare/commentCare'
import { uploadFile } from '@/service/upload'

export default {
  components: {
    settingTitle
  },
  data() {
    return {
      tabsValue: this.$route.query.type,
      id: this.$route.query.id, // 这里是reviewsId
      commentText: '',
      imgUrl: [],
      showPop: false,
      templateType: 0,
      behaviorList: [],
      sentMsg: {}
    }
  },
  computed: {
    templateTypeList() {
      const result = []
      templateList.forEach(v => {
        result.push(v.type)
      })
      return result
    },
    templateContentList() {
      return templateList[this.templateType].list
    }
  },
  created() {
    this.sentMsg = this.$store.state.guardcare.weekIdList
    if (this.id) {
      this.getByReviewsId()
    } else {
      this.getTypeEnum()
    }
    // this.getTypeEnum()
    // console.log(this.$store.state.guardcare.childIdList)
    // console.log(this.$store.state.guardcare.weekIdList)
  },
  methods: {
    getTypeEnum() { // 获取评价项
      queryTypeEnum({ whichPerformedTypeEnum: { school: 'IN_THE_PARK', home: 'AT_HOME' }[this.tabsValue] }).then(res => {
        // console.log(res.data.data)
        const data = res.data.data
        Array.isArray(data) && data.forEach(v => {
          v.rate = ''
        })
        this.behaviorList = data || []
        // console.log(this.behaviorList)
      })
    },
    getByReviewsId() { // 获取表现详情
      queryByReviewsId({ reviewsId: this.id }).then(res => {
        // console.log(res.data.data)
        const data = res.data.data
        const imgArr = []
        this.commentText = data.teachersMessage
        data.imageList.forEach(v => {
          imgArr.push({
            url: v.url
          })
        })
        this.imgUrl = imgArr
        data.reviewsWhichPerformedList.forEach(v => {
          if (v.whichPerformedItemValue === 'YOU_RE_GREAT') {
            v.rate = 3
          } else if (v.whichPerformedItemValue === 'BETTER') {
            v.rate = 2
          } else if (v.whichPerformedItemValue === 'MUST_WORK_HARD') {
            v.rate = 1
          }
          v.whichPerformedName = v.whichPerformedItemName
        })
        this.behaviorList = data.reviewsWhichPerformedList
        // console.log(this.behaviorList)
      })
    },
    handleComment() {
      if (this.tabsValue === 'school') {
        this.showPop = true
      }
      if (this.tabsValue === 'home') {
        // this.$toast('提醒家长功能正在开发中')
        queryRemind({
          childId: this.sentMsg.childId,
          type: 'CARE',
          courseManagementId: this.sentMsg.caScourseManagementId,
          reviewTypeId: this.sentMsg.reviewTypeId,
          startLocalDate: this.sentMsg.startLocalDate,
          endLocalDate: this.sentMsg.endLocalDate
        }).then(() => {
          this.$toast('提醒成功！')
        })
      }
    },
    addTemplate(index) { // 添加模板到输入框中
      this.commentText = this.templateContentList[index]
      this.showPop = false
    },
    async submitComment() {
      for (let i = 0; i < this.behaviorList.length; i++) {
        if (!this.behaviorList[i].rate) return this.$toast('还有评分项没有评分噢')
      }
      const imageList = []
      const rateList = []
      let type = ''
      if (this.tabsValue === 'school') {
        type = 'IN_THE_PARK'
      } else {
        type = 'AT_HOME'
      }
      if (this.imgUrl.length) { // 需要上传图片
        const pArr = []
        this.imgUrl.forEach(v => {
          pArr.push(uploadFile(v.file, 'guardcare/comment/detail', 'image'))
        })
        await Promise.all(pArr).then(res => {
          res.forEach(v => {
            imageList.push({
              name: 'guardcare/comment/detail' + Date.now(),
              url: v.data.key
            })
          })
        }).catch(err => {
          console.log(err)
        })
      }
      this.behaviorList.forEach(v => {
        if (v.rate === 3) {
          v.whichPerformedItemValue = 'YOU_RE_GREAT'
        } else if (v.rate === 2) {
          v.whichPerformedItemValue = 'BETTER'
        } else if (v.rate === 1) {
          v.whichPerformedItemValue = 'MUST_WORK_HARD'
        }
        rateList.push({
          whichPerformedItemId: v.whichPerformedId,
          whichPerformedItemValue: v.whichPerformedItemValue
        })
      })
      createReviews({
        childIdList: this.$store.state.guardcare.childIdList,
        whichPerformedType: type,
        teachersMessage: this.commentText.trim(),
        imageList: imageList,
        reviewTypeId: this.sentMsg.reviewTypeId,
        startLocalDate: this.sentMsg.startLocalDate,
        endLocalDate: this.sentMsg.endLocalDate,
        caScourseManagementId: this.sentMsg.caScourseManagementId,
        reviewsWhichPerformedList: rateList
      }).then(res => {
        // console.log(res.data.data)
        setTimeout(() => {
          this.$toast('提交成功')
        }, 500)
        // this.$toast('提交成功')
        this.$router.go(-1)
      })
    }
  }
}
</script>

<style scoped lang="scss">
.detail {
  .settingHeader {
    font-size: 14px;
    color: $white;
  }

  .scrollWrap {
    height: calc(100vh - 34px);
    overflow-y: auto;
    padding-bottom: 60px;
  }

  .behaviorWrap, .commentWrap {
    width: calc(100vw - 24px);
    margin: 8px auto 0;
    background-color: $white;
    border-radius: 4px;
  }

  .behaviorWrap {
    .score {
      li {
        display: flex;
        justify-content: space-between;
        align-items: center;
        height: 80px;
        padding: 0 24px;
        border-bottom: 1px solid $text-e;

        span {
          font-size: 13px;
        }

        ::v-deep .van-radio-group {
          display: flex;

          .van-radio__icon {
            width: 45px;
            height: 45px;
            margin-left: 12px;
          }

          img {
            width: auto;
          }
        }
      }
    }
  }

  .commentWrap {
    text-align: left;

    .title {
      height: 50px;
      padding: 0 24px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-bottom: 1px solid $text-e;

      span {
        font-size: 13px;
      }

      .btn {
        width: 90px;
        height: 26px;
        text-align: center;
        line-height: 26px;
        font-size: 12px;
        border-radius: 12px;
        border: 1px solid $theme;
        color: $theme;
      }
    }

    ::v-deep .van-field__control {
      font-size: 12px !important;
    }

    .van-field {
      padding: 10px 24px;
    }

    .van-uploader {
      margin-left: 24px;
    }

    ::v-deep .van-cell::after {
      display: none;
    }

    ::v-deep .van-uploader__upload {
      margin: 0 0 12px 0;
    }
  }

  .footBtn {
    position: fixed;
    bottom: 8px;
    left: 12px;
    width: calc(100vw - 24px);
    height: 44px;
    line-height: 44px;
    text-align: center;
    border-radius: 4px;
    color: $white;
    font-size: 16px;
    background-color: $theme;
  }

  .van-popup {
    text-align: left;
    padding: 16px;

    .templateTypeList {
      display: flex;
      justify-content: space-between;
      margin-top: 24px;

      li {
        width: 77px;
        height: 36px;
        line-height: 34px;
        font-size: 14px;
        border-radius: 6px;
        background-color: $bg-5;
        color: $text-9;
        text-align: center;

        &.active {
          color: $theme;
          border: 1px solid $theme;
          background-color: $themeLight;
        }
      }
    }

    .templateContentList {
      height: calc(70vh - 114px);
      overflow-y: auto;

      li {
        width: calc(100vw - 32px);
        margin: 12px auto 0;
        border: 1px solid $text-e;
        border-radius: 4px;
        padding: 12px;

        p {
          font-size: 14px;
          color: $text-6;
          font-weight: bold;
          margin-bottom: 12px;
        }

        .templateContent {
          font-size: 12px;
          line-height: 20px;
          color: $text-6;
        }
      }
    }
  }
}
</style>
