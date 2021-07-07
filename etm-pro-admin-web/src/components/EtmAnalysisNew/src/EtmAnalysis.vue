<template>
  <div class="EtmAnalysis" :class="[setCardClass(index), title ? 'setPaddingTop':'']">
    <div v-if="title" class="reportTitleImg">
      <span>{{ title }}</span>
    </div>

    <div v-if="!title" class="line leftLine">
      <img src="../../../assets/images/evaluation/reportLine.png">
    </div>
    <div v-if="!title" class="line rightLine">
      <img src="../../../assets/images/evaluation/reportLine.png">
    </div>

    <div class="title">
      <p class="action">
        <etm-label>{{ data.enumAbilityName }}</etm-label>
        <span :class="{'errorColor':data.rating==='E'||data.rating==='F'}">{{ data.enumRating }}</span>
      </p>
      <div class="rank">
        <etm-label>{{ $t('reportManagement.paidReportRating') }}</etm-label>
        <el-rate
          v-model="data.rateStar"
          :size="14"
          color="#FFB72B"
          void-icon="star"
          void-color="#DDDDDD"
          style="margin-left: 8px;"
          disabled
        />
      </div>
    </div>
    <div v-for="(item,index) in data.content" :key="index" class="content">
      <span :class="setLevelClass(index)">{{ setLevelText(index) }}</span>
      <div v-html="item" />
    </div>

  </div>
</template>
<script>
import etmLabel from '@/components/EtmLabel'
export default {
  name: 'EtmAnalysis',
  components: {
    etmLabel
  },
  props: {
    data: {
      type: Object,
      required: true
    },
    index: {
      type: Number
    },
    title: {
      type: String
    }
  },

  methods: {

    setCardClass(action) {
      switch (action) {
        case 0:
          return 'bigAction'
        case 1:
          return 'fineAction'
        case 2:
          return 'social'
        case 3:
          return 'adapt'
        case 4:
          return 'language'
      }
    },
    setLevelClass(index) {
      switch (index) {
        case 0:
          return 'junior'
        case 1:
          return 'middle'
        case 2:
          return 'senior'
      }
    },
    setLevelText(index) {
      switch (index) {
        case 0:
          return this.$t('reportManagement.paidReportPrimary')
        case 1:
          return this.$t('reportManagement.paidReportIntermediate')
        case 2:
          return this.$t('reportManagement.paidReportAdvanced')
      }
    }

  }
}
</script>

<style scoped lang="scss">
    .EtmAnalysis {
        padding: 20px 12px 16px;
        &.setPaddingTop{
          padding: 35px 12px 16px;
        }
        border-radius: 5px;
        position: relative;
        .line {
          position: absolute;
          top: -28px;
          z-index: 11;
          width: 8px;
          height: 36.5px;
          &.leftLine {
            left: 50px;
          }
          &.rightLine {
            right: 50px;
          }
          img{
            width: 100%;
          }
        }
        .title {
            display: flex;
            justify-content: space-between;
            font-size: 17px;
            line-height: 16px;
            color: $white;
            p{
              margin: 0;
            }

            .rank {
                display: flex;
                align-items: center;
                font-size: 13px;
            }
        }

        .content {
            & /deep/ *{
              max-width: 332px !important;
            }
            position: relative;
            padding: 25px 16px;
            margin-top: 15px;
            font-size: 15px;
            line-height: 25px;
            @include c_title_color();
            background-color: $white;
            border-radius: 5px;
            overflow: hidden;
            span{
              position: absolute;
              top: 0;
              right: 0;
              font-size: 12px;
              display: inline-block;
              width: 40px;
              height: 23px;
              text-align: center;
              &.junior{
                background: transparent url("./../../../assets/images/evaluation/junior.png") no-repeat;
                background-size: 100% 100%;
              }
              &.middle{
                background: transparent url("./../../../assets/images/evaluation/middle.png") no-repeat;
                background-size: 100% 100%;
              }
              &.senior{
                background: transparent url("./../../../assets/images/evaluation/senior.png") no-repeat;
                background-size: 100% 100%;
              }

            }
        }
        .reportTitleImg{
          position: absolute;
          width: 142px;
          height: 46px;
          left: 50%;
          top: -30px;
          margin-left: -65px;
          background: transparent url("./../../../assets/images/evaluation/reportTitleMultistage.png") no-repeat;
          background-size: 100% 100%;
          line-height: 58px;
          font-size: 17px;
          color: $white;
          text-align: center;
          span{
            margin-left: -8px;
          }
        }

    }

    .bigAction {
        background-color: #FF97BC;

        .content {
            /deep/ b {
                color: #FF97BC;
            }
        }
    }

    .fineAction {
        background-color: #BA98FF;

        .content {
            /deep/ b {
                color: #BA98FF;
            }
        }
    }

    .social {
        background-color: #FF9898;

        .content {
            /deep/ b {
                color: #FF9898;
            }
        }
    }

    .adapt {
        background-color: #FFC898;

        .content {
            /deep/ b {
                color: #FFC898;
            }
        }
    }

    .language {
        background-color: #FF9898;

        .content {
            /deep/ b {
                color: #FF9898;
            }
        }
    }
</style>
