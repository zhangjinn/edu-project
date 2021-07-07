<template>
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
                  :src="props.checked ? require('../../../../assets/images/daycare/dailySad.png') : require('../../../../assets/images/daycare/undailySad.png')"
                >
              </template>
            </van-radio>
            <van-radio :name="4">
              <template #icon="props">
                <img
                  class="img-icon"
                  :src="props.checked ? require('../../../../assets/images/daycare/dailyAngry.png') : require('../../../../assets/images/daycare/undailyAngry.png')"
                >
              </template>
            </van-radio>
            <van-radio :name="3">
              <template #icon="props">
                <img
                  class="img-icon"
                  :src="props.checked ? require('../../../../assets/images/daycare/dailyE_Normal.png') : require('../../../../assets/images/daycare/undailyE_Normal.png')"
                >
              </template>
            </van-radio>
            <van-radio :name="2">
              <template #icon="props">
                <img
                  class="img-icon"
                  :src="props.checked ? require('../../../../assets/images/daycare/dailyHappy.png') : require('../../../../assets/images/daycare/undailyHappy.png')"
                >
              </template>
            </van-radio>
            <van-radio :name="1">
              <template #icon="props">
                <img
                  class="img-icon"
                  :src="props.checked ? require('../../../../assets/images/daycare/dailyExcited.png') : require('../../../../assets/images/daycare/undailyExcited.png')"
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

</template>

<script>
/**
 * emotions create by Administrator
 * createTime 2020/11/06 17:19
 */
export default {
  name: 'Emotions',
  components: {},
  filters: {},
  mixins: [],
  props: {
    updateList: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  data() {
    return {
      rate: null,
      behaviorList: [1],
      emotions: {
        'SAD': 5,
        'ANGRY': 4,
        'NORMAL': 3,
        'HAPPY': 2,
        'EXCITED': 1
      }
    }
  },
  computed: {},
  watch: {
    updateList: {
      deep: true,
      handler(n) {
        this.updateList = n
        // console.log(this.updateList)
        this.getDate()
      }
    }
  },
  created() {
  },
  mounted() {
  },
  methods: {
    getDate() {
      if (this.updateList) {
        this.rate = this.emotions[this.updateList.contentObject.emotion]
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.emotions-wrap {
  background-color: #fff;

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

          .van-radio {
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

  .feel {
    display: flex;
    justify-content: space-between;
    font-size: 12px;
    color: #999999;
    margin-top: 11px;

    span {
      flex: 1;
      //width: 50px;
      display: block;
      //margin: auto;
      text-align: center;
      //margin-right: 22px;
    }
  }
}
</style>
