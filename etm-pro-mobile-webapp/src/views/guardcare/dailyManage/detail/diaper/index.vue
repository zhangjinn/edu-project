<template>
  <div class="diaper">
    <setting-title no-setting>
      <span>填写记录</span>
    </setting-title>

    <div class="scrollWrap">
      <head-info ref="head" type="换尿布" :child-list="childList" />
      <div class="diaper-wrap">
        <div class="status">
          <div class="wen">尿布状态</div>
          <div class="sta">
            <div :class="[choose == 1? 'choose' : '' ]" @click="changeWay(1)">嘘嘘</div>
            <div :class="[choose == 2? 'choose' : '' ]" @click="changeWay(2)">便便</div>
            <div :class="[choose == 3? 'choose' : '' ]" @click="changeWay(3)">嘘嘘+便便</div>
            <div :class="[choose == 4? 'choose' : '' ]" @click="changeWay(4)">干爽</div>
          </div>
        </div>
        <div v-if="choose===1||choose==3" class="pee">
          <div class="wen">嘘嘘颜色</div>
          <div class="peeColor">
            <div class="thePee">
              <div class="one" :class="[peeColor===1?'choosePeeColor':'']" @click="choosePeeColor(1)" />
              <span>乳白色</span>
            </div>
            <div class="thePee">
              <div class="two" :class="[peeColor===2?'choosePeeColor':'']" @click="choosePeeColor(2)" />
              <span>红色</span>
            </div>
            <div class="thePee">
              <div class="three" :class="[peeColor===3?'choosePeeColor':'']" @click="choosePeeColor(3)" />
              <span>正常</span>
            </div>
            <div class="thePee">
              <div class="four" :class="[peeColor===4?'choosePeeColor':'']" @click="choosePeeColor(4)" />
              <span>黄色</span>
            </div>
            <div class="thePee">
              <div class="five" :class="[peeColor===5?'choosePeeColor':'']" @click="choosePeeColor(5)" />
              <span>浓茶色</span>
            </div>
          </div>
        </div>
        <div v-if="choose===2||choose==3" class="pee">
          <div class="wen">便便性状</div>
          <div class="sta staPoor">
            <div :class="[poor == 1? 'choose' : '' ]" @click="changePoor(1)">颗粒状</div>
            <div :class="[poor == 2? 'choose' : '' ]" @click="changePoor(2)">干硬</div>
            <div :class="[poor == 3? 'choose' : '' ]" @click="changePoor(3)">正常</div>
            <div :class="[poor == 4? 'choose' : '' ]" @click="changePoor(4)">糊状</div>
            <div :class="[poor == 5? 'choose' : '' ]" @click="changePoor(5)">水状</div>
          </div>
          <div class="peeColor">
            <div class="thePee">
              <div class="six" :class="[poorColor===1?'choosePeeColor':'']" @click="choosePoorColor(1)" />
              <span>灰白色</span>
            </div>
            <div class="thePee">
              <div class="seven" :class="[poorColor===2?'choosePeeColor':'']" @click="choosePoorColor(2)" />
              <span>绿色</span>
            </div>
            <div class="thePee">
              <div class="eight" :class="[poorColor===3?'choosePeeColor':'']" @click="choosePoorColor(3)" />
              <span>黄色</span>
            </div>
            <div class="thePee">
              <div class="night" :class="[poorColor===4?'choosePeeColor':'']" @click="choosePoorColor(4)" />
              <span>棕色</span>
            </div>
            <div class="thePee">
              <div class="ten" :class="[poorColor===5?'choosePeeColor':'']" @click="choosePoorColor(5)" />
              <span>黑色</span>
            </div>
            <div class="thePee">
              <div class="eleven" :class="[poorColor===6?'choosePeeColor':'']" @click="choosePoorColor(6)" />
              <span>红色</span>
            </div>
          </div>
        </div>
      </div>
      <text-des ref="text" />
    </div>
    <bottom-btn @finish="handleSubmit" />
  </div>
</template>
<script>
import settingTitle from '../../../components/settingTitle'
import headInfo from '../../components/headInfo'
import textDes from '../../components/textDes'
import bottomBtn from '../../components/bottomBtn'
import {
  createRecordItem,
  updateRecordItem,
  queryRecordItemDetail
} from '../../../../../service/guardcare/dailyManage'
import { uploadFile } from '../../../../../service/upload'
import { transferDate } from '../../../../../js/rules'
export default {
  components: {
    settingTitle,
    headInfo,
    textDes,
    bottomBtn
  },
  data() {
    return {
      childList: this.$store.state.guardcare.dm_child,
      choose: 1, // 尿布状态
      peeColor: undefined, //  嘘嘘颜色
      poorColor: undefined, // 便便颜色
      poor: undefined // 便便性状
    }
  },
  created() {
    this.getInfo()
  },
  methods: {
    getInfo() {
      const id = this.$route.query.id
      if (!id) return
      queryRecordItemDetail({ growthRecordId: id }).then(res => {
        const { textDesc, imageList, recordTime, diaperChange: { dbColor, dbShape, type, xbColor }} = res.data.data
        this.$refs.text.imgUrl = imageList
        this.$refs.text.commentText = textDesc || ''
        this.$refs.head.time = transferDate(recordTime).clock
        this.choose = type
        this.peeColor = xbColor
        this.poorColor = dbColor
        this.poor = dbShape
      }).catch(err => {
        console.log(err)
      })
    },
    changeWay(i) {
      this.choose = i
    },
    choosePeeColor(i) {
      this.peeColor = i
    },
    choosePoorColor(i) {
      this.poorColor = i
    },
    changePoor(i) {
      this.poor = i
    },
    async handleSubmit() {
      // 处理childIds
      const childIds = []
      this.childList.forEach(v => {
        childIds.push(v.childId)
      })

      let imageList = []
      if (this.$refs.text.imgUrl.length) { // 需要上传图片
        if (this.$route.query.id) {
          imageList = this.$refs.text.imgUrl
        } else {
          const pArr = []
          this.$refs.text.imgUrl.forEach(v => {
            pArr.push(uploadFile(v.file, 'guardcare/dailyManage/diaper', 'image'))
          })
          await Promise.all(pArr).then(res => {
            res.forEach(v => {
              imageList.push({
                name: 'guardcare/dailyManage/diaper' + Date.now(),
                url: v.data.key
              })
            })
          }).catch(err => {
            console.log(err)
          })
        }
      }

      if (this.$route.query.id) {
        updateRecordItem({
          recordIds: [this.$route.query.id],
          name: '换尿布',
          recordTime: (this.$route.query.date || transferDate().time) + ` ${this.$refs.head.time}:00`,
          textDesc: this.$refs.text.commentText,
          imageList,
          type: 'DIAPER_CHANGE',
          diaperChange: {
            type: this.choose,
            xbColor: this.peeColor,
            dbShape: this.poor,
            dbColor: this.poorColor
          }
        }).then(res => {
          this.$toast('修改成功')
          this.$router.go(-1)
        })
      } else {
        createRecordItem({
          childIds,
          name: '换尿布',
          recordTime: (this.$route.query.date || transferDate().time) + ` ${this.$refs.head.time}:00`,
          textDesc: this.$refs.text.commentText,
          imageList,
          type: 'DIAPER_CHANGE',
          diaperChange: {
            type: this.choose,
            xbColor: this.peeColor,
            dbShape: this.poor,
            dbColor: this.poorColor
          }
        }).then(res => {
          this.$toast('新增成功')
          this.$router.go(-1)
        })
      }
    }
  }
}
</script>

<style scoped lang="scss">
.diaper {
  .scrollWrap {
    height: calc(100vh - 84px);
    overflow-y: auto;
    padding-bottom: 16px;
  }
  .diaper-wrap {
    margin: 13px auto 0;
    width: 351px;
    border-radius: 3px;
    .wen {
      font-size: 15px;
      color: #222222;
      text-align: left;
    }

    .peeColor {
      display: flex;
      justify-content: space-between;
      margin-top: 30px;

      .thePee {
        //width: 100%;
        div {
          width: 20px;
          height: 20px;
          border-radius: 50%;
          //background-color: #FF5555;
          margin: auto;

          &.choosePeeColor {
            //background: #000 !important;
            //width: 35px;
            //height: 35px;
            transform: scale(1.5);
          }
        }

        span {
          display: block;
          margin-top: 15px;
          font-size: 13px;
          color: #808080;
        }
      }

      .one {
        background: #FFFFFF;
        border: 1px solid #6A6969;
      }

      .two {
        background: #EE8285;
      }

      .three {
        background: #FCEEBE;
      }

      .four {
        background: #F4BA49;
      }

      .five {
        background: #906845;
      }

      .six {
        background: #D5D5D5;
      }

      .seven {
        background: #4E7323;
      }

      .eight {
        background: #F4BA49;
      }

      .night {
        background: #846538;
      }

      .ten {
        background: #474747;
      }

      .eleven {
        background: #EE8285;
      }
    }

    .status {
      background-color: #fff;
      padding: 20px 12px;
      border-radius: 3px;
    }

    .sta {
      display: flex;
      justify-content: space-between;
      margin-top: 20px;

      div {
        background-color: #F5F5F5;
        width: 74px;
        height: 30px;
        line-height: 30px;
        color: #999999;
        font-size: 14px;
        text-align: center;
        border-radius: 4px;
      }

      .choose {
        background-color: #FFF0E2;
        color: $theme;
      }
    }
    .staPoor{
      div{
      font-size: 13px;
        width: 56px;
        height: 21px;
        line-height: 21px;
      }
    }
    .pee {
      margin-top: 12px;
      background-color: #fff;
      padding: 20px 12px;
      border-radius: 3px;
    }
  }
}
</style>
