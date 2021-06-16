<template>
  <div
    class="EtmAnalysis"
    :class="[setCardClass(index), title ? 'setPaddingTop':'']"
  >
    <div
      v-if="title"
      class="reportTitleImg"
    >
      <span>{{ title }}</span>
    </div>

    <div
      v-if="!title"
      class="line leftLine"
    >
      <img src="../../../assets/images/evaluation/reportLine.png">
    </div>
    <div
      v-if="!title"
      class="line rightLine"
    >
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
    <div
      v-for="(item,index) in data.content"
      :key="index"
      class="content"
    >
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

    setCardClass (action) {
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
    setLevelClass (index) {
      switch (index) {
        case 0:
          return 'junior'
        case 1:
          return 'middle'
        case 2:
          return 'senior'
      }
    },
    setLevelText (index) {
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
      border-radius: 5px;
      padding: 20px 12px 16px;
      position: relative;

      &.setPaddingTop {
        padding: 35px 12px 16px;
      }

      .line {
        height: 36.5px;
        position: absolute;
        top: -28px;
        width: 8px;
        z-index: 11;

        &.leftLine {
          left: 50px;
        }

        &.rightLine {
          right: 50px;
        }

        img {
          width: 100%;
        }
      }

      .title {
        color: $white;
        display: flex;
        font-size: 17px;
        justify-content: space-between;
        line-height: 16px;

        p {
          margin: 0;
        }

        .rank {
          align-items: center;
          display: flex;
          font-size: 13px;
        }
      }

      .content {
        @include c_title_color();
        background-color: $white;
        border-radius: 5px;
        font-size: 15px;
        line-height: 25px;
        margin-top: 15px;
        overflow: hidden;
        padding: 25px 16px;
        position: relative;

        ::v-deep * {
          max-width: 332px !important;
        }

        span {
          display: inline-block;
          font-size: 12px;
          height: 23px;
          position: absolute;
          right: 0;
          text-align: center;
          top: 0;
          width: 40px;
        }

        .junior {
          background: transparent url('./../../../assets/images/evaluation/junior.png') no-repeat;
          background-size: 100% 100%;
        }

        .middle {
          background: transparent url('./../../../assets/images/evaluation/middle.png') no-repeat;
          background-size: 100% 100%;
        }

        .senior {
          background: transparent url('./../../../assets/images/evaluation/senior.png') no-repeat;
          background-size: 100% 100%;
        }
      }

      .reportTitleImg {
        background: transparent url('./../../../assets/images/evaluation/reportTitleMultistage.png') no-repeat;
        background-size: 100% 100%;
        color: $white;
        font-size: 17px;
        height: 46px;
        left: 50%;
        line-height: 58px;
        margin-left: -65px;
        position: absolute;
        text-align: center;
        top: -30px;
        width: 142px;

        span {
          margin-left: -8px;
        }
      }

    }

    .bigAction {
      background-color: #ff97bc;

      .content {
        ::v-deep b {
          color: #ff97bc;
        }
      }
    }

    .fineAction {
      background-color: #ba98ff;

      .content {
        ::v-deep b {
          color: #ba98ff;
        }
      }
    }

    .social {
      background-color: #ff9898;

      .content {
        ::v-deep b {
          color: #ff9898;
        }
      }
    }

    .adapt {
      background-color: #ffc898;

      .content {
        ::v-deep b {
          color: #ffc898;
        }
      }
    }

    .language {
      background-color: #ff9898;

      .content {
        ::v-deep b {
          color: #ff9898;
        }
      }
    }
</style>
