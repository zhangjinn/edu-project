<template>
  <div class="checkPage">
    <div class="header textLeft">
      <span>健康三检</span>
      <div class="backImg">
        <img src="../../../../assets/images/threeCheck.png">
      </div>
      <div class="checkBox">
        <div class="check" @click="toMorning">
          <div class="img">
            <img src="../../../../assets/images/morningCheck.png">
          </div>
          <div class="text">晨检</div>
          <div class="icon textCenter">
            <span class="iconfont iconright" />
          </div>
        </div>
        <div class="check" @click="toNoon">
          <div class="img">
            <img src="../../../../assets/images/noonCheck.png">
          </div>
          <div class="text">午检</div>
          <div class="icon textCenter">
            <span class="iconfont iconright" />
          </div>
        </div>
        <div class="check" @click="toNight">
          <div class="img">
            <img src="../../../../assets/images/nightCheck.png">
          </div>
          <div class="text">晚检</div>
          <div class="icon textCenter">
            <span class="iconfont iconright" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Index',
  data() {
    return {}
  },
  methods: {
    toMorning() {
      this.$router.push({
        path: '/morningCheck_neuroo'
      })
    },
    toNoon() {
      this.$router.push({
        path: '/noonCheck_neuroo'
      })
    },
    toNight() {
      this.$router.push({
        path: '/nightCheck_neuroo'
      })
    }
  }
}

</script>

<style lang="scss" scoped>
    .checkPage {
        .header {
            position: relative;
            padding: 24px 12px;
            height: 135px;
            background-color: $theme;

            span {
                font-size: 20px;
                color: $white;
            }

            .backImg {
                position: absolute;
                right: 0;
                top: 14px;
                width: 62px;
            }

            .checkBox {
                margin: 25px 0;

                .check {
                    position: relative;
                    height: 130px;
                    background-color: $white;
                    @include border-radius(5px);
                    box-shadow: 0px 0px 10px 0px rgba(170, 170, 170, 0.2);

                    &:not(:first-child) {
                        margin-top: 15px;
                    }

                    .img {
                        position: absolute;
                        left: 0;
                        bottom: 0;
                        width: 100px;

                        img {
                            display: block;
                        }
                    }

                    .text {
                        position: absolute;
                        top: 0;
                        bottom: 0;
                        left: 135px;
                        margin: auto 0;
                        height: 23px;
                        line-height: 23px;
                        font-size: 23px;
                    }

                    .icon {
                        position: absolute;
                        top: 0;
                        bottom: 0;
                        right: 20px;
                        margin: auto 0;
                        @include round(21px);
                        background-color: $theme;

                        .iconfont {
                            float: left;
                            @include round(21px);
                            line-height: 21px;
                            font-size: 12px;
                        }
                    }
                }
            }
        }
    }
</style>
