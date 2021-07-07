<template>
  <div class="project-wrap">
    <setting-title no-setting>
      <span class="settingHeader">填写记录</span>
    </setting-title>
    <div v-if="type!=='SLEEP'" class="heard">
      <div v-if="way==='all'" class="lockTime">
        <span>{{ typeName }}</span>
        <div class="right">已选{{ childId.length }}人</div>
      </div>
      <div v-else class="avatar">
        <div class="noImg textCenter">{{ getIconTxt(name) }}</div>
        <span>{{ name }}</span>
      </div>
      <div class="lockTime">
        <span>记录时间</span>
        <div class="right" @click.stop="showTime">
          <span>{{ date }}</span>
          <i class="iconfont iconright1" />
        </div>
      </div>
    </div>
    <sleep v-if="type==='SLEEP'" :name="name" :way="way" :child-id="childId" />
    <div v-if="type!=='SLEEP'" class="way">
      <customize v-if="type==='CUSTOMIZE'" :type-name="typeName" />
      <emotions v-if="type==='EMOTIONS'" ref="emotions" :update-list="updateList" />
      <diaper v-if="type==='CHANGE_DIAPER'" ref="diaper" :update-list="updateList" />
      <mike v-if="type==='FEED_MILK'" ref="mike" :update-list="updateList" />
      <water v-if="type==='DRINK_WATER'" ref="water" :update-list="updateList" />
      <eat v-if="type==='EAT'" ref="eat" :child-id="childId" :update-list="updateList" :way="way" />
    </div>
    <!--   文字描述   -->
    <div v-if="type!=='SLEEP'" class="commentWrap">
      <div class="title">
        <span>文字描述</span>
      </div>
      <van-field
        v-model="commentText"
        rows="4"
        maxlength="300"
        type="textarea"
        placeholder="描述宝宝当前的情况"
        show-word-limit
      />
      <van-uploader
        v-model="imgUrl"
        multiple
        :max-count="9"
        upload-icon="plus"
      />
    </div>
    <div v-if="type!=='SLEEP'" class="footer">
      <div class="cancel" @click="outList">取消</div>
      <div @click="upload">完成</div>
    </div>
    <van-popup v-model="show" position="bottom" :style="{ height: '50%' }">
      <van-datetime-picker
        v-model="currentTime"
        type="time"
        title="选择时间"
        :min-hour="0"
        :max-hour="24"
        @cancel="show=false"
        @confirm="onConfirm"
      />
    </van-popup>
  </div>

</template>

<script>
/**
 * project create by Administrator
 * createTime 2020/11/06 10:21
 */
import settingTitle from './components/settingTitle'
import { DateFormat } from '@/js/rules'
import customize from './components/customize'
import emotions from './components/emotions'
import diaper from './components/diaper'
import mike from './components/mike'
import water from './components/waterBox'
import sleep from './components/sleep'
import eat from './components/eat'
import {
  createCustomize,
  queryByDiaryId,
  updateCustomize,
  createEmotion,
  updateEmotion,
  createWater,
  updateWater,
  createMilk,
  updateMilk,
  createDiaper,
  updateDiaper,
  createEat,
  updateEat
} from '@/service/daycare/dailyManage'
import { uploadFile } from '@/service/upload'
import { Dialog } from 'vant'

export default {
  name: 'Project',
  components: { settingTitle, customize, emotions, diaper, mike, water, sleep, eat },
  filters: {},
  mixins: [],
  props: {},
  data() {
    return {
      show: false,
      childItem: null,
      currentTime: '8',
      name: this.$route.query.name || '',
      imgUrl: [],
      commentText: '',
      date: '',
      type: this.$route.query.type,
      typeName: this.$route.query.typeName,
      way: this.$route.query.way,
      diarySettingId: this.$route.query.diarySettingId,
      childId: [],
      updateList: {},
      updateTime: '',
      emotions: {
        5: 'SAD',
        4: 'ANGRY',
        3: 'NORMAL',
        2: 'HAPPY',
        1: 'EXCITED'
      },
      peePoorChoose: {
        1: ['PEE'],
        2: ['POOP'],
        3: ['PEE', 'POOP'],
        4: ['DRY']
      },
      peeColor: {
        1: 'MILKY_WHITE',
        2: 'RED',
        3: 'NORMAL',
        4: 'YELLOW',
        5: 'BROWN'
      },
      poopShape: {
        1: 'GRANULAR',
        2: 'DRY_HARD',
        3: 'NORMAL',
        4: 'MUSHY',
        5: 'WATERY'
      },
      poopColorEnum: {
        1: 'OFF_WHITE',
        2: 'GREEN',
        3: 'YELLOW',
        4: 'BROWN',
        5: 'BLACK',
        6: 'RED'
      },
      eatFeel: {
        0: 'HATE',
        1: 'DONT_LIKE',
        2: 'GENERAL',
        3: 'LIKE',
        4: 'LIKE_MUCH'
      }
    }
  },
  computed: {},
  watch: {},
  created() {
    if (this.$route.query.item) {
      this.childItem = JSON.parse(this.$route.query.item)
    }
    // console.log(this.way)
    // console.log(this.$route.query.diaryId)
    this.childId = this.$route.query.childId.split(',')
    // console.log(this.diarySettingId)
    this.date = DateFormat(new Date(), 'hh:mm')
    if (this.way === 'update') {
      this.getDetail()
    }
  },
  mounted() {
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
    showTime() {
      this.show = true
    },
    onConfirm(value) {
      // console.log(value)
      this.date = value
      this.show = false
    },
    getSuc() {
      setTimeout(() => {
        this.$toast({
          message: '填写成功',
          duration: 1000,
          icon: 'icon iconfont iconsuccess'
        })
      }, 50)
      this.$router.back()
    },
    getUp() {
      setTimeout(() => {
        this.$toast({
          message: '修改成功',
          duration: 1000,
          icon: 'icon iconfont iconsuccess'
        })
      }, 50)
      this.$router.back()
    },
    outList() {
      Dialog.confirm({
        title: '是否退出填写日记'
      })
        .then(() => {
          // on confirm
          this.$router.back()
        })
        .catch(() => {
          // on cancel
        })
    },
    getDetail() {
      const diaryId = this.$route.query.diaryId
      queryByDiaryId({ diaryId: diaryId }).then(res => {
        console.log(res.data.data)
        const data = res.data.data
        this.updateList = data
        this.commentText = data.description
        const imgArr = []
        data.imageList.forEach(v => {
          imgArr.push({
            url: v.url
          })
        })
        this.imgUrl = imgArr
        this.updateTime = data.startTime
        this.date = DateFormat(data.startTime, 'hh:mm')
      })
    },
    async upload() {
      const imageList = []
      if (this.imgUrl.length) { // 需要上传图片
        const pArr = []
        this.imgUrl.forEach(v => {
          if (v.file) {
            pArr.push(uploadFile(v.file, 'guardcare/comment/detail', 'image'))
          } else {
            imageList.push(v)
          }
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
      if (this.way === 'update') {
        // console.log(this.imgUrl)
        // console.log(imageList)
        const diaryId = this.$route.query.diaryId
        const date = DateFormat(this.updateTime, 'yyyy-MM-dd') + ' ' + this.date + ':00'
        if (this.type === 'CUSTOMIZE') {
          updateCustomize({
            diaryId: diaryId,
            description: this.commentText,
            startTime: date,
            imageList: imageList,
            caDiarySettingId: this.diarySettingId,
            jsonBO: {},
            childIdList: this.childId
          }).then(() => {
            this.getUp()
          })
        } else if (this.type === 'EMOTIONS') {
          const emotions = this.emotions[this.$refs.emotions.rate]
          updateEmotion({
            diaryId: diaryId, jsonBO: { emotion: emotions },
            startTime: date,
            imageList: imageList,
            caDiarySettingId: this.diarySettingId,
            childIdList: this.childId,
            description: this.commentText
          }).then(() => {
            this.getUp()
          })
        } else if (this.type === 'DRINK_WATER') {
          const water = this.$refs.water.selectValue
          updateWater({
            diaryId: diaryId,
            jsonBO: { capacity: water },
            description: this.commentText,
            startTime: date,
            imageList: imageList,
            caDiarySettingId: this.diarySettingId,
            childIdList: this.childId
          }).then(() => {
            this.getUp()
          })
        } else if (this.type === 'FEED_MILK') {
          const mike = this.$refs.mike.selectValue
          updateMilk({
            diaryId: diaryId,
            jsonBO: { capacity: mike },
            description: this.commentText,
            startTime: date,
            imageList: imageList,
            caDiarySettingId: this.diarySettingId,
            childIdList: this.childId
          }).then(() => {
            this.getUp()
          })
        } else if (this.type === 'CHANGE_DIAPER') {
          const choose = this.peePoorChoose[this.$refs.diaper.choose]
          const peeColor = this.peeColor[this.$refs.diaper.peeColor]
          const poopShape = this.poopShape[this.$refs.diaper.poor]
          const poopColorEnum = this.poopColorEnum[this.$refs.diaper.poorColor]
          updateDiaper({
            diaryId: diaryId,
            jsonBO: {
              list: choose,
              peeColor: peeColor || null,
              poopShape: poopShape || null,
              poopColorEnum: poopColorEnum || null
            },
            description: this.commentText,
            startTime: date,
            imageList: imageList,
            caDiarySettingId: this.diarySettingId,
            childIdList: this.childId
          }).then(() => {
            this.getUp()
          })
        } else if (this.type === 'EAT') {
          const feel = this.eatFeel[this.$refs.eat.checkedFeeling]
          const checkedRecipe = this.$refs.eat.recipeList[this.$refs.eat.checkedRecipe]
          updateEat({
            diaryId: diaryId,
            jsonBO: {
              timeQuantumName: checkedRecipe.timeQuantumName,
              foodName: checkedRecipe.foodName,
              feel: feel,
              recipeItemId: checkedRecipe.recipeItemId
            },
            description: this.commentText,
            startTime: date,
            imageList: imageList,
            caDiarySettingId: this.diarySettingId,
            childIdList: this.childId
          }).then(() => {
            this.getUp()
          })
        }
      } else {
        const date = DateFormat(new Date(), 'yyyy-MM-dd') + ' ' + this.date + ':00'
        if (this.type === 'CUSTOMIZE') {
          // console.log(imageList)
          createCustomize({
            description: this.commentText,
            startTime: date,
            imageList: imageList,
            caDiarySettingId: this.diarySettingId,
            jsonBO: {},
            childIdList: this.childId
          }).then(() => {
            // console.log(res.data.data)
            this.getSuc()
          })
        } else if (this.type === 'EMOTIONS') {
          const emotions = this.emotions[this.$refs.emotions.rate]
          // console.log(emotions)
          createEmotion({
            jsonBO: { emotion: emotions }, description: this.commentText,
            startTime: date,
            imageList: imageList,
            caDiarySettingId: this.diarySettingId,
            childIdList: this.childId
          }).then(() => {
            this.getSuc()
          })
        } else if (this.type === 'DRINK_WATER') {
          // createWater({})
          const water = this.$refs.water.selectValue
          createWater({
            jsonBO: { capacity: water },
            description: this.commentText,
            startTime: date,
            imageList: imageList,
            caDiarySettingId: this.diarySettingId,
            childIdList: this.childId
          }).then(() => {
            this.getSuc()
          })
        } else if (this.type === 'FEED_MILK') {
          const mike = this.$refs.mike.selectValue
          createMilk({
            jsonBO: { capacity: mike },
            description: this.commentText,
            startTime: date,
            imageList: imageList,
            caDiarySettingId: this.diarySettingId,
            childIdList: this.childId
          }).then(() => {
            this.getSuc()
          })
        } else if (this.type === 'CHANGE_DIAPER') {
          const choose = this.peePoorChoose[this.$refs.diaper.choose]
          const peeColor = this.peeColor[this.$refs.diaper.peeColor]
          const poopShape = this.poopShape[this.$refs.diaper.poor]
          const poopColorEnum = this.poopColorEnum[this.$refs.diaper.poorColor]
          // console.log(choose)
          // console.log(peeColor)
          // console.log(poopShape)
          // console.log(poopColorEnum)
          createDiaper({
            jsonBO: {
              list: choose,
              peeColor: peeColor || null,
              poopShape: poopShape || null,
              poopColorEnum: poopColorEnum || null
            },
            description: this.commentText,
            startTime: date,
            imageList: imageList,
            caDiarySettingId: this.diarySettingId,
            childIdList: this.childId
          }).then(() => {
            this.getSuc()
          })
        } else if (this.type === 'EAT') {
          const feel = this.eatFeel[this.$refs.eat.checkedFeeling]
          const checkedRecipe = this.$refs.eat.recipeList[this.$refs.eat.checkedRecipe]
          createEat({
            jsonBO: {
              timeQuantumName: checkedRecipe.timeQuantumName,
              foodName: checkedRecipe.foodName,
              feel: feel,
              recipeItemId: checkedRecipe.recipeItemId
            },
            description: this.commentText,
            startTime: date,
            imageList: imageList,
            caDiarySettingId: this.diarySettingId,
            childIdList: this.childId
          }).then(() => {
            this.getSuc()
          })
        }
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.project-wrap {
  .settingHeader {
    font-size: 15px;
    color: $white;
  }

  .heard {
    width: 351px;
    background-color: #fff;
    margin: 12px 12px 0;
    border-radius: 3px;

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

    .avatar {
      display: flex;
      align-items: center;
      border-bottom: #EEEEEE solid 1px;
      padding: 15px 12px;
    }

    .lockTime {
      display: flex;
      align-items: center;
      border-bottom: #EEEEEE solid 1px;
      padding: 20px 12px;
      font-size: 15px;
      justify-content: space-between;

      span {
        font-size: 15px;
        color: #222222;
      }

      .right {
        color: #999999;

        span {
          color: #999999;
        }

        i {
          color: #999999;
        }
      }
    }
  }

  .commentWrap {
    width: calc(100vw - 24px);
    background-color: $white;
    border-radius: 4px;
    margin: 12px 12px 55px;
  }

  .commentWrap {
    text-align: left;

    .title {
      font-size: 15px;
      padding: 20px 12px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-bottom: 1px solid $text-e;

      span {
        font-size: 15px;
      }
    }

    ::v-deep .van-field__control {
      font-size: 14px !important;
    }

    .van-field {
      padding: 10px 12px;
    }

    .van-uploader {
      margin-left: 12px;
    }

    ::v-deep .van-cell::after {
      display: none;
    }

    ::v-deep .van-uploader__upload {
      margin: 0 0 12px 0;
    }
  }

  .footer {
    position: fixed;
    bottom: 0;
    width: 100%;
    background-color: #fff;
    padding: 8px 20px;
    display: flex;
    justify-content: space-between;

    div {
      width: 160px;
      height: 34px;
      line-height: 34px;
      text-align: center;
      border-radius: 17px;
      color: $white;
      font-size: 14px;
      background-color: $theme;
    }

    .cancel {
      color: $theme;
      background-color: $white;
      border: $theme solid 1px;
    }
  }

  .way {
    width: 351px;
    //background-color: #fff;
    margin: 12px 12px 0;
    border-radius: 4px;
  }
}

</style>
