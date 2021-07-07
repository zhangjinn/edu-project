<template>
  <div class="followRecordDetail">
    <div class="fieldBox">
      <van-cell-group :border="false">
        <van-field
          v-model="customerName"
          :class="customerName === '未录入' ? 'disColor' : ''"
          readonly
          label="客户姓名"
          input-align="left"
        />
        <template v-for="(data,index) in followData">
          <van-cell
            v-if="data.key !== 'follow_img'"
            :key="index"
            :class="(data.key === 'follow_content' || data.key === 'mark') && data.value ? 'imgCell' : ''"
          >
            <template v-if="data.key === 'follow_content'">
              <van-cell>
                <div class="textareaBox">
                  <span>跟进内容</span>
                  <div class="textarea" :class="data.value === '未录入' ? 'disColor' : ''">
                    {{ data.value }}
                  </div>
                  <div v-if="imageUrl.length" class="pictureBox">
                    <div v-for="(img,i) in imageUrl" :key="i" class="img">
                      <img :src="img" @click="showImg(img)">
                    </div>
                  </div>
                </div>
              </van-cell>
            </template>
            <template v-else-if="data.key === 'mark'">
              <van-cell
                :value="markText"
                :title="data.name"
                :class="markText === '标签为空' ? 'markCell disColor' : 'markCell'"
              >
                <div v-if="data.value && data.value.length" class="tagBox">
                  <template v-if="data.value.length > 3">
                    <span v-if="unfold" class="iconfont iconarrow-up" @click="closeFold" />
                    <span v-else class="iconfont iconarrow-down" @click="openFold" />
                  </template>
                  <div :class="unfold ? '' : 'scrollBox'">
                    <van-tag
                      v-for="(item,i) in data.value"
                      :key="i"
                      class="tag"
                      color="#CFF3F3"
                      text-color="#10C2C4"
                    >
                      {{ item }}
                    </van-tag>
                  </div>
                </div>
              </van-cell>
            </template>
            <template v-else>
              <van-field
                v-model="data.value"
                :class="data.value === '未录入' ? 'disColor' : ''"
                readonly
                :label="data.name"
                input-align="left"
              />
            </template>
          </van-cell>
        </template>
      </van-cell-group>
    </div>
    <div v-show="hidshow" class="bottomFixed">
      <div class="bottomBtn van-hairline--top">
        <div class="btn" @click="backToPage">
          <control-btn text="我知道了" type="primary" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getFollowDetail, getCustomerDetail, getFollowFields } from '../../../service/customer/customer'
import controlBtn from '../../../components/common/controlBtn'
import { DateFormat } from '../../../js/rules'
import { ImagePreview } from 'vant'

export default {
  name: 'FollowRecordDetail',
  components: {
    controlBtn,
    [ImagePreview.Component.name]: ImagePreview.Component
  },
  data() {
    return {
      followId: '',
      followData: [],
      imageUrl: [],
      customerId: '',
      customer: {},
      customerName: '',
      allAttribute: [],
      markText: '',
      unfold: false
    }
  },
  computed: {
    hidshow() {
      return this.$store.state.show.showBottom
    }
  },
  created() {
    this.followId = this.$route.query.followId
    this.customerId = this.$route.query.customerId
    this.getSelfField()
  },
  methods: {
    async getDetail() {
      const res = await getFollowDetail(this.followId)
      const followData = res.data.data
      this.followData = followData.customFields
      for (let v = 0; v < this.followData.length; v++) {
        if (this.followData[v].key === 'follow_img' && this.followData[v].value) {
          this.imageUrl = this.followData[v].value.split(',')
        }
        if (this.followData[v].key === 'mark') {
          if (this.followData[v].value) {
            this.followData[v].value = this.followData[v].value.split(',')
          } else {
            this.markText = '标签为空'
          }
        }
        if (!this.followData[v].value && this.followData[v].key !== 'mark') {
          this.followData[v].value = '未录入'
        }
        for (let i = 0; i < this.allAttribute.length; i++) {
          if (this.allAttribute[i].key === this.followData[v].key) {
            this.followData[v].name = this.allAttribute[i].name
          }
        }
      }
      this.getCustomer()
    },
    formatTime(time) {
      return DateFormat(time, 'yyyy-MM-dd hh:mm:ss')
    },
    async getCustomer() {
      const res = await getCustomerDetail(this.customerId)
      this.customer = res.data.data.customer
      this.customer.forEach(item => {
        if (item.key === 'name') {
          this.customerName = item.value ? item.value : '未录入'
        }
      })
    },
    async getSelfField() {
      const res = await getFollowFields()
      const allAttribute = res.data.data
      this.allAttribute = allAttribute
      this.getDetail()
    },
    backToPage() {
      this.$router.back(-1)
    },
    openFold() {
      this.unfold = true
    },
    closeFold() {
      this.unfold = false
    },
    showImg(img) {
      ImagePreview({
        images: [
          img
        ]
      })
    }
  }
}
</script>

<style lang="scss">

    .followRecordDetail {
        .fieldBox {
            .van-cell {
                padding: 20px 16px;

                &.imgCell {
                    padding: 20px 16px 12px;
                }

                &::after {
                    left: 16px !important;
                    right: 16px !important;
                }

                .van-cell {
                    padding: 0;

                    &::after {
                        border: none;
                    }
                }

                .markCell {
                    .van-cell__title {
                        flex: none;
                        width: 130px;
                    }

                    .van-cell__value {
                        text-align: left;
                    }
                }
            }
        }

        .tagBox {
            position: relative;

            .iconfont {
                position: absolute;
                right: 0;
                top: 0;
                font-size: 13px;
                color: $text-b;
                background-color: $white;
            }

            .scrollBox {
                white-space: nowrap;
                overflow-x: auto;
            }

            .tag {
                margin: 0 8px 8px 0;
            }
        }

        .disColor {
            color: $text-9 !important;

            input {
                color: $text-9 !important;
            }
        }

        .textareaBox {
            span {
                color: $text-2;
            }

            .textarea {
                margin-top: 6px;
            }

            .pictureBox {
                margin-top: 12px;

                .img {
                    display: inline-block;
                    @include wh(78px, 78px);
                    margin: 0 8px 8px 0;
                    border-radius: 4px;

                    img {
                        object-fit: cover;
                    }
                }
            }
        }
    }
</style>
