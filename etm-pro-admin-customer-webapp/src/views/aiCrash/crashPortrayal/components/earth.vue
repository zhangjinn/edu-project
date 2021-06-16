<template>
  <div class="earth-wrap">
    <div class="one">
      <div class="map" />
      <div class="jt" />
      <div class="lbx" />
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
  props: {},
  data () {
    return {}
  },
  computed: {},
  watch: {},
  created () {
  },
  mounted () {
  },
  methods: {}
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
      min-width: 686px;
      min-height: 620px;
      background: url("../../../../assets/images/luckySearchMapBottom.png") no-repeat;
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
        width: 390px;
        height: 390px;
        background: url("../../../../assets/images/luckySearchMap.png") no-repeat;
        background-size: contain;
        z-index: 1;
      }
      .jt {
        /*animation: rotateJT 10s linear infinite;*/
        width: 440px;
        height: 390px;
        background: url("../../../../assets/images/luckySearchJt.png") no-repeat;
        background-size: contain;
        z-index: 2;
      }
      .lbx {
        /*animation: rotatePoint 10s linear infinite;*/
        width: 460px;
        height: 460px;
        background: url("../../../../assets/images/luckySearchLbx.png") no-repeat;
        background-size: contain;
        z-index: 3;
      }
    }
  }
</style>
