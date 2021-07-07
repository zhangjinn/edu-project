<template>
  <div class="drink">
    <setting-title no-setting>
      <span>填写记录</span>
    </setting-title>

    <div class="scrollWrap">
      <head-info ref="head" type="喝水" :child-list="childList" />
      <div class="milkBox-wrap">
        <div class="content">
          <div class="imgBox">
            <img src="../../../../../assets/images/water.png">
            <div class="scaleList">
              <van-picker
                :columns="numList"
                :default-index="8"
                @change="onChange"
              />
            </div>
            <div class="scaleBox">
              <img src="../../../../../assets/images/water_scale.png">
              <div class="number">{{ selectValue }}</div>
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
      numList: [],
      selectValue: 50
    }
  },
  created() {
    this.getInfo()
    this.numList = []
    this.addNum(1, 100)
  },
  methods: {
    getInfo() {
      const id = this.$route.query.id
      if (!id) return
      queryRecordItemDetail({ growthRecordId: id }).then(res => {
        const { textDesc, imageList, recordTime, ml } = res.data.data
        this.$refs.text.imgUrl = imageList
        this.$refs.text.commentText = textDesc || ''
        this.$refs.head.time = transferDate(recordTime).clock
        this.selectValue = ml
      }).catch(err => {
        console.log(err)
      })
    },
    addNum(i, count) {
      if (i < count) {
        this.numList.push((i + 1) * 5)
        i++
        this.addNum(i, count)
      }
    },
    onChange(picker, value) {
      this.selectValue = value
    },
    async handleSubmit() { // 提交
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
            pArr.push(uploadFile(v.file, 'guardcare/dailyManage/drink', 'image'))
          })
          await Promise.all(pArr).then(res => {
            res.forEach(v => {
              imageList.push({
                name: 'guardcare/dailyManage/drink' + Date.now(),
                url: v.data.key
              })
            })
          }).catch(err => {
            console.log(err)
          })
        }
      }

      if (this.$route.query.id) { // 存在id，修改
        updateRecordItem({
          recordIds: [this.$route.query.id],
          name: '喝水',
          recordTime: (this.$route.query.date || transferDate().time) + ` ${this.$refs.head.time}:00`,
          textDesc: this.$refs.text.commentText,
          ml: this.selectValue,
          imageList,
          type: 'DRINK'
        }).then(res => {
          this.$toast('修改成功')
          this.$router.go(-1)
        })
      } else { // 不存在id，新增
        createRecordItem({
          childIds,
          name: '喝水',
          recordTime: (this.$route.query.date || transferDate().time) + ` ${this.$refs.head.time}:00`,
          textDesc: this.$refs.text.commentText,
          ml: this.selectValue,
          imageList,
          type: 'DRINK'
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
.drink {
  .scrollWrap {
    height: calc(100vh - 84px);
    overflow-y: auto;
    padding-bottom: 16px;
  }
  .milkBox-wrap {
    margin: 13px auto 0;
    width: 351px;
    background-color: #fff;
    border-radius: 3px;
    .content {
      padding: 42.5px 0 36px;
      background-color: $white;
      border-radius: 3px;

      .imgBox {
        position: relative;
        margin: 0 auto;
        width: 160px;

        .scaleList {
          position: absolute;
          top: 20px;
          left: 0;
          right: 0;
          margin: 0 auto;
          width: 60px;
          height: 220px;
          overflow: hidden;

          ::v-deep .van-picker {
            background-color: transparent;

            .van-picker__mask {
              display: none;
            }

            .van-picker-column__item {
              font-size: 15px;
              color: #71CEFF;

              &.van-picker-column__item--selected {
                color: #51C2FE;
                font-size: 16px;
              }
            }
          }
        }

        .scaleBox {
          position: absolute;
          top: 115px;
          left: -48px;
          width: 60px;

          .number {
            position: absolute;
            top: 0;
            bottom: 0;
            left: 0;
            right: 0;
            text-align: center;
            color: #51C2FE;
            line-height: 30px;
            font-size: 16px;
          }
        }
      }
    }
  }
}
</style>
