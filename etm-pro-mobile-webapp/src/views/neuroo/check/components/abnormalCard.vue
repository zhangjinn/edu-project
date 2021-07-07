<template>
  <div class="abnormalCard">
    <div class="abnormalContent">
      <div class="content">
        <div class="memberBox textLeft">
          <div class="scrollBox">
            <div v-for="(item,index) in list" :key="index" class="member">
              <div class="avatar">
                <img v-if="item.avatar" :src="item.avatar">
                <div v-else class="noImg textCenter">{{ subName(item.customerName) }}</div>
              </div>
              <div class="name">{{ item.customerName }}</div>
            </div>
          </div>
          <div class="linear" />
        </div>
        <div class="degress">
          <van-field
            v-model="formData.degress"
            label="体温"
            type="number"
            placeholder="请输入体温(范围35-42)"
            required
            @blur="submitNum"
          />
          <span class="unit">°C</span>
        </div>
        <div class="symptom">
          <van-cell required>
            <div class="textLeft title">常见症状</div>
            <div ref="symptomBox" class="symptomBox">
              <span
                v-for="(item, index) in symptom"
                :key="index"
                ref="symptomItem"
                class="symptomItem"
                :class="formData.symptomResult.includes(item) ? 'selected' : ''"
                @click="choose(item)"
              >
                {{ item }}
              </span>
            </div>
          </van-cell>
        </div>
        <div class="remark textLeft">
          <div class="textareaBox">
            <span>备注</span>
            <span class="count right">{{ formData.remark.length }}/100</span>
            <div>
              <textarea
                v-model="formData.remark"
                class="textarea"
                placeholder="请输入备注内容"
                maxlength="100"
              />
            </div>
            <div class="pictureBox">
              <van-uploader
                v-model="formData.imgUrl"
                multiple
                upload-icon="plus"
              />
            </div>
          </div>
        </div>
      </div>
      <div v-show="hidshow" class="bottomFixed van-hairline--top">
        <div class="bottomBtn notBottomBar van-hairline--top">
          <div class="btn" @click="onCancel">
            <control-btn type="cancel" text="取消" />
          </div>
          <div class="btn" @click="onConfirm">
            <control-btn type="primary" text="确认" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import controlBtn from '../../../../components/common/controlBtn'

export default {
  name: 'AbnormalCard',
  components: {
    controlBtn
  },
  props: {
    list: {
      type: Array,
      default() {
        return []
      }
    },
    show: {
      type: Boolean,
      default() {
        return false
      }
    },
    tab: {
      type: Number,
      default() {
        return 0
      }
    }
  },
  data() {
    return {
      symptom: ['咳嗽', '精神不佳', '外伤', '流鼻涕', '皮疹', '口腔异常', '腹痛', '其他'],
      formData: {
        degress: '',
        symptomResult: [],
        remark: '',
        imgUrl: []
      }
    }
  },
  computed: {
    hidshow() {
      return this.$store.state.show.showBottom
    }
  },
  watch: {
    show() {
      if (this.show) {
        this.setData()
      }
    }
  },
  created() {
    this.setData()
  },
  methods: {
    setData() {
      if (this.tab === 3 && this.list.length === 1) {
        const data = this.list[0]
        this.formData.degress = data.temperature
        this.formData.symptomResult = data.symptom.split(',')
        this.formData.remark = data.mark
        const arr = []
        data.imageList.forEach(item => {
          const img = {
            url: item.url,
            name: item.name,
            isImage: true
          }
          arr.push(img)
        })
        this.formData.imgUrl = arr
      } else {
        this.formData.degress = ''
        this.formData.symptomResult = []
        this.formData.remark = ''
        this.formData.imgUrl = []
      }
    },
    subName(name) {
      if (name && name.length > 2) {
        return name.substring(name.length - 2)
      } else {
        return name
      }
    },
    submitNum() {
      if (this.formData.degress < 35 || this.formData.degress > 42) {
        this.formData.degress = ''
      }
    },
    choose(item) {
      if (this.formData.symptomResult.includes(item)) {
        this.formData.symptomResult.splice(this.formData.symptomResult.indexOf(item), 1)
      } else {
        this.formData.symptomResult.push(item)
      }
    },
    onCancel() {
      this.$emit('cancel')
    },
    onConfirm() {
      if (!this.formData.degress) {
        this.$toast({
          message: '请输入体温',
          duration: 1000,
          icon: 'icon iconfont iconwarning'
        })
        return
      }
      if (!this.formData.symptomResult.length) {
        this.$toast({
          message: '请选择症状',
          duration: 1000,
          icon: 'icon iconfont iconwarning'
        })
        return
      }
      this.$emit('confirm', this.formData)
    }
  }
}
</script>

<style lang="scss" scoped>
    .abnormalCard {
        .abnormalContent {
            .content {
                padding: 0 12px 12px;

                .memberBox {
                    position: relative;
                    padding-bottom: 16px;
                    border-bottom: .5px solid $text-e;

                    .scrollBox {
                        overflow-x: auto;
                        white-space: nowrap;

                        .member {
                            display: inline-block;

                            &:last-child {
                                margin-right: 24px;
                            }

                            &:not(:first-child) {
                                position: relative;
                                margin-left: 30px;

                                &::before {
                                    display: inline-block;
                                    position: absolute;
                                    top: 7px;
                                    left: -15px;
                                    content: '';
                                    width: 1px;
                                    height: 20px;
                                    background-color: $text-d;
                                }
                            }

                            .avatar {
                                display: inline-block;
                                vertical-align: middle;
                                @include round(35px);
                                overflow: hidden;

                                .noImg {
                                    height: 35px;
                                    line-height: 35px;
                                    font-size: 13px;
                                    color: $white;
                                    background-color: $theme;
                                }
                            }

                            .name {
                                display: inline-block;
                                margin-left: 6px;
                                font-size: 15px;
                                vertical-align: middle;
                            }
                        }
                    }

                    .linear {
                        position: absolute;
                        top: 0;
                        right: 0;
                        width: 40px;
                        height: 35px;
                        @include linear-gradient(to right, rgba(255, 255, 255, 0), $white);
                    }
                }

                .degress {
                    position: relative;

                    .unit {
                        display: inline-block;
                        position: absolute;
                        top: 20px;
                        right: 0;
                        height: 24px;
                        line-height: 24px;
                    }
                }

                .van-cell {
                    padding: 20px 0;

                    &::before {
                        left: -8px;
                    }
                }

                .symptom {

                    .van-cell {
                        &::after {
                            border: none;
                        }
                    }

                    .title {
                        font-size: 15px;
                    }

                    .symptomBox {
                        display: flex;
                        flex-wrap: wrap;

                        .symptomItem {
                            display: inline-block;
                            padding: 0 15px;
                            margin-top: 10px;
                            height: 36px;
                            line-height: 36px;
                            font-size: 15px;
                            color: $text-9;
                            border: 1px solid $text-d;
                            @include border-radius(3px);

                            &:not(:nth-child(4n+1)) {
                                margin-left: 15px;
                            }

                            &.selected {
                                color: $white;
                                background-color: $theme;
                                border: 1px solid $theme;
                            }
                        }
                    }
                }

                .remark {

                    .textareaBox {
                        span {
                            font-size: 15px;
                            color: $text-2;

                            &.count {
                                font-size: 12px;
                                color: $text-9;
                            }
                        }

                        .textarea {
                            margin-top: 12px;
                            width: 100%;
                            height: 75px;
                            font-size: 15px;
                            resize: none;
                        }
                    }
                }
            }
        }
    }
</style>
