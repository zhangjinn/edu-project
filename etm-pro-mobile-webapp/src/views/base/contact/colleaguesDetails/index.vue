<template>
  <div class="colleaguesDetails">
    <div class="collTop">
      <div class="topBg" />
      <div class="userCard">
        <div class="left img">
          <img v-if="colleague.avatar" :src="colleague.avatar">
          <div v-else class="noImg">
            {{ avatar }}
          </div>
        </div>
        <div class="left msg textLeft">
          <p>{{ colleague.name }}</p>
          <p :class="!hasPost ? 'noPost' : ''">
            {{ position }}
          </p>
        </div>
      </div>
    </div>
    <div class="collMain">
      <div class="list textLeft">
        <div class="borderBottom van-hairline--bottom">
          <div class="label">手机号</div>
          <div class="message">{{ colleague.telephone }}</div>
          <div class="iconBox" @click="callTel">
            <span class="iconfont iconphone" />
            <span>打电话</span>
          </div>
        </div>
      </div>
      <div class="list textLeft">
        <div class="borderBottom van-hairline--bottom">
          <div class="label">所属部门</div>
          <div class="message">
            {{ colleague.departmentName || colleague.enterpriseName }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getEmployeeDetails } from '../../../../service/base/contact'

export default {
  name: 'ColleaguesDetails',
  data() {
    return {
      colleague: {},
      avatar: '',
      position: '',
      hasPost: true
    }
  },
  created() {
    this.getColleaguesInfo()
  },
  methods: {
    getPosition(postList) {
      let Position = ''
      for (let i = 0; i < postList.length; i++) {
        if (i === postList.length - 1) {
          Position += postList[i].name
        } else {
          Position += postList[i].name + '、'
        }
      }
      return Position
    },
    // 获取同事信息
    getColleaguesInfo() {
      const personId = this.$route.query.id
      getEmployeeDetails(personId).then(res => {
        this.colleague = res.data.data
        this.avatar = this.colleague.name.substring(this.colleague.name.length - 2)
        if (this.colleague.positionList && this.colleague.positionList.length) {
          this.position = this.getPosition(this.colleague.positionList)
        } else {
          this.hasPost = false
          this.position = '暂无岗位'
        }
      })
    },
    callTel() {
      const a = document.createElement('a')
      a.href = 'tel:' + this.colleague.telephone
      a.click()
    }
  }
}
</script>

<style lang="scss" scoped>

    .colleaguesDetails {
        .collTop {
            position: relative;
            padding: 20px 12px 5px;
            background-color: $white;

            .topBg {
                position: absolute;
                top: 0;
                left: 0;
                @include wh(100%, 74px);
                background-color: $theme;
            }

            .userCard {
                position: relative;
                z-index: 1;
                padding: 20px 15px;
                background-color: $white;
                box-shadow: 0px 3px 10px 0px rgba(40, 40, 40, 0.08);
                @include border-radius(3px);
                overflow: hidden;

                .img {
                    @include round(54px);
                    overflow: hidden;

                    .noImg {
                        font-size: 16px;
                        color: $white;
                        line-height: 54px;
                        background-color: $theme;
                    }
                }

                .msg {
                    margin-left: 15px;
                    max-width: calc(100% - 69px);

                    p {
                        line-height: 27px;

                        &:first-child {
                            font-size: 17px;
                        }

                        &:last-child {
                            font-size: 13px;
                            color: $text-6;

                            &.noPost {
                                color: $text-9;
                            }
                        }
                    }
                }
            }
        }

        .collMain {
            background-color: $white;

            .list {
                padding: 0 12px;

                .borderBottom {
                    position: relative;
                    padding: 20px 0;

                    .iconBox {
                        position: absolute;
                        right: 12px;
                        bottom: 24px;
                        text-align: center;

                        span {
                            color: $theme;
                            font-size: 13px;
                        }

                        .iconfont {
                            margin-right: 6px;
                        }
                    }
                }

                .label {
                    font-size: 13px;
                    color: $text-9;
                }

                .message {
                    margin-top: 12px;
                    font-size: 15px;
                }
            }
        }
    }
</style>
