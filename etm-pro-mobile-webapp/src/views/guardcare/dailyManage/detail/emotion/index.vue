<template>
  <div class="emotion">
    <setting-title no-setting>
      <span>填写记录</span>
    </setting-title>

    <div class="scrollWrap">
      <head-info ref="head" type="情绪" :child-list="childList" />
      <div class="emotions-wrap">
        <div class="cont">
          <div class="head">宝宝情绪</div>
          <ul class="score">
            <li>
              <van-radio-group v-model="rate">
                <van-radio :name="5">
                  <template #icon="props">
                    <img
                      class="img-icon"
                      :src="props.checked ? require('../../../../../assets/images/daycare/dailySad.png') : require('../../../../../assets/images/daycare/undailySad.png')"
                    >
                  </template>
                </van-radio>
                <van-radio :name="4">
                  <template #icon="props">
                    <img
                      class="img-icon"
                      :src="props.checked ? require('../../../../../assets/images/daycare/dailyAngry.png') : require('../../../../../assets/images/daycare/undailyAngry.png')"
                    >
                  </template>
                </van-radio>
                <van-radio :name="3">
                  <template #icon="props">
                    <img
                      class="img-icon"
                      :src="props.checked ? require('../../../../../assets/images/daycare/dailyE_Normal.png') : require('../../../../../assets/images/daycare/undailyE_Normal.png')"
                    >
                  </template>
                </van-radio>
                <van-radio :name="2">
                  <template #icon="props">
                    <img
                      class="img-icon"
                      :src="props.checked ? require('../../../../../assets/images/daycare/dailyHappy.png') : require('../../../../../assets/images/daycare/undailyHappy.png')"
                    >
                  </template>
                </van-radio>
                <van-radio :name="1">
                  <template #icon="props">
                    <img
                      class="img-icon"
                      :src="props.checked ? require('../../../../../assets/images/daycare/dailyExcited.png') : require('../../../../../assets/images/daycare/undailyExcited.png')"
                    >
                  </template>
                </van-radio>
              </van-radio-group>
            </li>
          </ul>
          <div class="feel">
            <span>难过</span>
            <span>生气</span>
            <span>一般</span>
            <span>开心</span>
            <span>兴奋</span>
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
      rate: ''
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
        console.log(res.data.data)
        const { textDesc, imageList, recordTime, emotion: { status }} = res.data.data
        this.$refs.text.imgUrl = imageList
        this.$refs.text.commentText = textDesc || ''
        this.$refs.head.time = transferDate(recordTime).clock
        this.rate = status
      }).catch(err => {
        console.log(err)
      })
    },
    async handleSubmit() { // 提交
      if (!this.rate) return this.$toast('请选择宝宝情绪')
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
            pArr.push(uploadFile(v.file, 'guardcare/dailyManage/emotion', 'image'))
          })
          await Promise.all(pArr).then(res => {
            res.forEach(v => {
              imageList.push({
                name: 'guardcare/dailyManage/emotion' + Date.now(),
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
          name: '情绪',
          recordTime: (this.$route.query.date || transferDate().time) + ` ${this.$refs.head.time}:00`,
          textDesc: this.$refs.text.commentText,
          imageList,
          type: 'EMOTION',
          emotion: { status: this.rate }
        }).then(res => {
          this.$toast('修改成功')
          this.$router.go(-1)
        })
      } else {
        createRecordItem({
          childIds,
          name: '情绪',
          recordTime: (this.$route.query.date || transferDate().time) + ` ${this.$refs.head.time}:00`,
          textDesc: this.$refs.text.commentText,
          imageList,
          type: 'EMOTION',
          emotion: { status: this.rate }
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
.emotion {
  .scrollWrap {
    height: calc(100vh - 84px);
    overflow-y: auto;
    padding-bottom: 16px;
  }
  .emotions-wrap {
    margin: 13px auto 0;
    width: 351px;
    background-color: #fff;
    border-radius: 3px;
    .cont {
      padding: 20px 20px 15px;

      .head {
        font-size: 15px;
        color: #222222;
        text-align: left;
      }

      .score {
        li {
          margin-top: 20px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          //height: 80px;
          //padding: 0 24px;
          span {
            font-size: 13px;
          }

          ::v-deep .van-radio-group {
            display: flex;
            justify-content: space-between;
            width: 100%;
            .van-radio{
              flex: 1;
              display: flex;
              justify-content: center;
            }
            .van-radio__icon {
              //width: 45px;
              height: 45px;
              //margin-left: 12px;
              //margin-right: 22px;
            }

            img {
              width: auto;
            }
          }
        }
      }
    }
    .feel{
      display: flex;
      justify-content: space-between;
      font-size: 12px;
      color: #999999;
      margin-top: 11px;
      span{
        flex: 1;
        //width: 50px;
        display: block;
        //margin: auto;
        text-align: center;
        //margin-right: 22px;
      }
    }
  }
}
</style>
