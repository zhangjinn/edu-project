<template>
  <div class="matter-detail-wrap">
    <van-nav-bar
      title="详情"
      left-arrow
      fixed
      placeholder
      @click-left="onClickLeft"
    />
    <div v-if="detailData.tellState" class="container">
      <van-cell>
        <div class="info">
          <div class="box">
            <div class="left-info">
              <van-image
                width="36px"
                height="36px"
                fit="cover"
                round
                :src="detailData.avatar"
              />
              <div class="child-info">
                <div class="name">
                  {{ detailData.childName }}
                </div>
                <div class="clazz">
                  <!--                  {{ detailData.clazzName }}-->
                </div>
              </div>
            </div>
            <div v-if="detailData.tellState === 'B_DETERMINE'" class="sure-people">
              确认人：{{ detailData.employeeName }}
            </div>
          </div>
          <div class="right-info">
            <van-image
              width="50px"
              height="50px"
              fit="cover"
              round
              :src="statusImg[detailData.tellState]"
            />
          </div>
        </div>
      </van-cell>
      <van-cell>
        <div class="detail">
          <van-row type="flex" class="detail-row">
            <van-col style="color: #999">交代事项</van-col>
            <van-col>{{ showTellType(detailData.tellType) }}</van-col>
          </van-row>
          <van-row type="flex" class="detail-row">
            <van-col style="color: #999">交代人</van-col>
            <van-col>{{ detailData.tellName }}({{ detailData.parentsCall }})</van-col>
          </van-row>
          <van-row type="flex" class="detail-row">
            <van-col style="color: #999">交代时间</van-col>
            <van-col>{{ showTime(detailData.tellTime) }}</van-col>
          </van-row>
          <van-row v-if="detailData.confirmTime" type="flex" class="detail-row">
            <van-col style="color: #999">确认时间</van-col>
            <van-col>{{ showTime(detailData.confirmTime) }}</van-col>
          </van-row>
          <van-row type="flex" class="detail-row">
            <van-col style="color: #999">交代内容</van-col>
            <van-col class="flex-1">
              <div class="matter-text">
                {{ detailData.tellContent }}
              </div>
              <div class="matter-img">
                <div class="row">
                  <div v-for="(item, index) in detailData.image" :key="index" class="col">
                    <img :src="item.url" alt="">
                  </div>
                  <template v-if="detailData.image.length % 3">
                    <div v-for="i in (3 - detailData.image.length % 3)" :key="i + '.'" class="col" />
                  </template>
                </div>
              </div>
            </van-col>
          </van-row>
        </div>
      </van-cell>
    </div>
    <div class="box-bottom">
      <div v-if="detailData.tellState === 'C_TO_BE_SIGNED'" class="bottom-button">
        <van-button color="#10C2C4" size="large" @click="clickSure">确认</van-button>
      </div>
      <div class="stance" />
    </div>
  </div>
</template>

<script>
import transferDate from '@/js/date'
import { queryMatterDetail, sureMatter } from '@/service/daycare/matterList'
export default {
  name: 'Index',
  components: {
  },
  data() {
    return {
      detailData: {},
      statusImg: {
        'C_TO_BE_SIGNED': require('@/assets/images/unConfirm.png'),
        'B_DETERMINE': require('@/assets/images/confirmed.png'),
        'A_REVOKED': require('@/assets/images/canceled.png')
      },
      tellType: {
        MEDICINE: '吃药',
        WATER: '喝水',
        DRESSING: '穿衣',
        MODD: '情绪',
        MEAL: '特殊餐',
        OTHER: '其他'
      },
      avatar: {
        MALE: require('@/assets/images/daycare/defaultMale.png'),
        FEMALE: require('@/assets/images/daycare/defaultFemale.png')
      }
    }
  },
  computed: {
  },
  mounted() {
    this.init()
  },
  methods: {
    init() {
      if (!this.$route.query.tellMattersId) {
        return this.$router.push('/daycare_matterList')
      }
      queryMatterDetail(this.$route.query).then(res => {
        if (res.data.message === '成功') {
          const data = res.data.data
          this.detailData = data
          if (!data.avatar) {
            this.detailData.avatar = this.avatar[data.gender]
          }
        }
      })
    },
    onClickLeft() {
      this.$router.push('/daycare_matterList')
    },
    clickSure() {
      sureMatter({
        tellMattersId: this.detailData.tellMattersId,
        tellState: 'B_DETERMINE'
      }).then(res => {
        if (res.data.message === '成功') {
          this.init()
        }
      })
    },
    showTellType(tellType) {
      const tmp = tellType.map(item => this.tellType[item])
      return tmp.join(',')
    },
    showTime(timestamp) {
      const obj = transferDate(timestamp)
      return `${obj.year}-${obj.month}-${obj.date} ${obj.hours}:${obj.miniutes}`
    }
  }
}
</script>

<style lang="scss" scoped>
.matter-detail-wrap {
  position: relative;
  height: 100%;
  /deep/.van-nav-bar__placeholder {
    height: 34px;
  }
  /deep/.van-nav-bar {
    height: 34px;
    line-height: 34px;
    background: $theme;
    .van-icon {
      color: #FFFFFF;
    }
    .van-nav-bar__title {
      font-size: 14px;
      color: #FFFFFF;
    }
  }
  .container {
    margin-top: 12px;
    padding: 0 10px;

    .van-cell {
      margin-bottom: 10px;
    }

    .info {
      display: flex;
      justify-content: space-between;
      align-items: center;

      .left-info {
        display: flex;
        align-items: center;

        .van-image {
          margin-right: 12px;
        }
      }

      .right-info {
        display: flex;
        align-items: center;
        margin-right: 54px;
      }
    }
    .detail {
      .detail-row {
        line-height: 33px;
      }
      .van-row {
        .van-col:first-child {
          min-width: 70px;
        }
        .flex-1 {
          flex: 1;
          .matter-text {
            word-break: break-word;
          }
          .matter-img {
            .row {
              display: flex;
              flex-wrap: wrap;
              justify-content: space-between;
              .col {
                margin-bottom: 12px;
                //margin-right: 12px;
                width: 71px;
                height: 71px;
              }
            }
          }
        }
      }
    }
  }
  .box-bottom {
    .bottom-button {
      position: fixed;
      left: 0;
      bottom: 50px;
      padding: 0 10px;
      width: 100%;
      .van-button--large {
        height: 44px;
        line-height: 44px;
      }
    }
    .stance {
      width: 100%;
      height: 44px;
    }
  }
}
</style>
