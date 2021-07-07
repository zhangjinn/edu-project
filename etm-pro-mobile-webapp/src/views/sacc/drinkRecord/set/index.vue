<template>
  <div class="setWrap">
    <item-card :item-data="itemData" />
    <div class="wrap">
      <time-selector ref="time" />
      <radio-list title="饮料种类" :list-data="type" :value.sync="typeValue" />
      <div v-show="showOther" class="other">
        <h5>其他饮料</h5>
        <van-field v-model="other" placeholder="请输入饮料名称" />
      </div>
      <div class="quantity">
        <h5>饮水量</h5>
        <div>
          <van-form>
            <van-field
              v-model="quantity"
              type="digit"
              :rules="[{ validator, message: '请填写10~300范围内的数字' }]"
            />
          </van-form>
          <span>ml(毫升)</span>
        </div>
      </div>
      <remark ref="remark" />
    </div>
    <bottom-btns @save="handleSave" @cancel="handleCancel" />
  </div>
</template>

<script>
import itemCard from '../components/itemCard'
import timeSelector from '../components/timeSelector'
import radioList from '../components/radioList'
import remark from '../components/remark'
import bottomBtns from '../components/bottomBtns'
import { addDrinkRecord } from '../../../../service/sacc/drinkRecord'
import { uploadFile } from '../../../../service/upload'
import transferDate from '../../../../js/date'

export default {
  components: {
    itemCard,
    timeSelector,
    radioList,
    remark,
    bottomBtns
  },
  data() {
    return {
      itemData: {},
      type: ['水', '牛奶', '果汁', '其他'],
      typeValue: '',
      quantity: 100,
      other: '',
      customerId: undefined,
      addressArray: []
    }
  },
  computed: {
    today() {
      const now = transferDate()
      return `${now.year}-${now.month}-${now.date}`
    },
    showOther() {
      return this.typeValue === '其他'
    }
  },
  created() {
    const { name, age, avatar, customerId, isLeave } = this.$route.query
    this.customerId = customerId
    this.itemData = {
      name,
      age,
      avatar,
      customerId,
      isLeave
    }
  },
  methods: {
    validator(v) {
      v = +v
      return v >= 10 && v <= 300
    },
    handleSave() {
      if (this.other || ['水', '牛奶', '果汁'].indexOf(this.typeValue) > -1) {
        // 先上传图片
        const promiseArr = []
        if (this.$refs.remark.uploader.length) {
          // 需要上传图片
          this.$refs.remark.uploader.forEach(file => {
            promiseArr.push(uploadFile(file.file, 'sacc/drinkRecord/set', 'image'))
            this.addressArray.push({
              name: file.file.name
            })
          })
          Promise.all(promiseArr).then(res => {
            // 上传图片成功后，再提交保存内容
            res.forEach((data, index) => {
              this.addressArray[index].url = data.data.key
            })
            this.uploadRecord()
          })
        } else {
          // 不需要上传图片
          this.addressArray = []
          this.uploadRecord()
        }
      } else {
        this.$toast({
          message: '请正确填写饮料种类',
          icon: 'icon iconfont iconwarning'
        })
      }
    },
    handleCancel() {
      this.$router.go(-1)
    },
    uploadRecord() {
      let drinkingRecordName
      if (this.typeValue === '其他') {
        drinkingRecordName = this.other
      } else {
        drinkingRecordName = this.typeValue
      }
      addDrinkRecord({
        drinkingTime: `${this.today} ${this.$refs.time.showTime}:00`,
        drinkingRecordName,
        customerId: this.customerId,
        addressArray: this.addressArray,
        drinkingQuantity: this.quantity
      }).then(res => {
        this.$toast({
          message: '操作成功',
          duration: 1000,
          icon: 'icon iconfont iconsuccess'
        })
        setTimeout(() => {
          this.$router.go(-1)
        }, 1000)
      })
    }
  }
}
</script>

<style lang="scss" scoped>
    @import '../../../../assets/style/mixin';

    .setWrap {
        height: calc(100vh - 50px);
        background-color: $white;

        .wrap {
            height: calc(100vh - 122px);
            overflow-y: auto;

            &::after {
                content: '';
                display: block;
                height: 61px;
            }

            .other {
                padding: 10px 12px 0;
                text-align: left;

                h5 {
                    font-weight: normal;
                    font-size: 15px;
                }

                .van-cell {
                    padding: 10px 0;
                }

                .van-cell:not(:last-child)::after {
                    display: none;
                }
            }

            .quantity {
                padding: 10px 12px 0;
                text-align: left;

                h5 {
                    font-weight: normal;
                    font-size: 15px;
                }

                & > div {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    border-bottom: 1px solid $text-e;

                    .van-cell {
                        padding: 10px 0;
                    }

                    .van-cell:not(:last-child)::after {
                        display: none;
                    }

                    span {
                        display: block;
                        font-size: 15px;
                    }
                }
            }
        }
    }
</style>
