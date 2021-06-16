<template>
  <div class="earth-wrap">
    <div class="one">
      <div class="map" />
      <div
        class="jt"
        :class="isActive"
      />
      <div
        class="lbx"
        :class="isActive"
      />
    </div>
  </div>
</template>

<script>
/**
   * earth create by 油麦菜
   * createTime 2021/1/11 11:22
   */
export default {
  name: 'Earth',
  components: {},
  filters: {},
  mixins: [],
  props: {
    scanStatus: {
      type: String,
      default: 'init',
      validator: function (value) {
        return ['init', 'scanning', 'scanned'].includes(value)
      }
    }
  },
  data () {
    return {}
  },
  computed: {
    isActive () {
      return this.scanStatus === 'scanning' ? 'active' : null
    }
  },

  created () {
  },
  mounted () {
  },
  methods: {

  }
}
</script>
<style lang="scss" scoped>
  @keyframes rotatePoint {
    from {transform: rotate(0deg)}
    to {transform: rotate(360deg)}
  }
  @keyframes rotateJT {
    from {transform: rotate(360deg)}
    to {transform: rotate(0deg)}
  }
  .earth-wrap {
    .one {
      position: relative;
      //width: calc(0.36 * 100vw);
      //height: calc(0.36 * 100vw);
      //min-width: 430px;
      //min-height: 430px;
      width: 455px;
      height: 455px;
      background: url("../../../assets/images/luckySearchMapBottom.png") no-repeat;
      background-size: contain;

      .map, .jt, .lbx {
        position: absolute;
        left: 0;
        right: 0;
        top: 0;
        bottom: 0;
        margin: auto;
      }

      .map {
        //width: calc(0.2 * 100vw);
        //height: calc(0.2 * 100vw);
        //min-width: 240px;
        //min-height: 240px;
        width: 290px;
        height: 290px;
        background: url("../../../assets/images/luckySearchMap.png") no-repeat;
        background-size: contain;
        z-index: 1;
      }

      .jt {
        animation: rotateJT 10s linear infinite;
        //width: calc(0.2 * 100vw);
        //height: calc(0.2 * 100vw);
        //min-width: 240px;
        //min-height: 240px;
        width: 326px;
        height: 289px;
        background: url("../../../assets/images/luckySearchJt.png") no-repeat;
        background-size: contain;
        z-index: 2;
        &.active{
          animation: rotateJT 4s linear infinite;
        }
      }

      .lbx {
        animation: rotatePoint 10s linear infinite;
        //width: calc(0.24 * 100vw);
        //height: calc(0.24 * 100vw);
        //min-width: 288px;
        //min-height: 288px;
        width: 360px;
        height: 360px;
        background: url("../../../assets/images/luckySearchLbx.png") no-repeat;
        background-size: contain;
        z-index: 3;
        &.active{
          animation: rotatePoint 4s linear infinite;
        }
      }

    }
  }
</style>
