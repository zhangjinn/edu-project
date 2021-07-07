<template>
  <div class="milkRecordWrap">
    <item-card :item-data="itemData" />
    <div class="wrap">
      <time-selector ref="time" />
      <radio-list title="喂奶类型" :list-data="milkType" :value.sync="typeValue" />
      <div class="quantity">
        <h5>喂养量</h5>
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
import { getEnumByName, addDietRecord } from '../../../../service/sacc/dietRecord'
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
      milkType: [],
      typeValue: 'FORMULAMILK',
      quantity: 100,
      customerId: undefined,
      addressArray: []
    }
  },
  computed: {
    today() {
      const now = transferDate()
      return `${now.year}-${now.month}-${now.date}`
    }
  },
  created() {
    const { name, age, avatar, customerId, isLeave } = this.$route.query
    this.customerId = customerId
    this.itemData = {
      name,
      age,
      avatar,
      isLeave
    }

    getEnumByName('MilkType').then(res => {
      const { data } = res.data
      this.milkType = data
    })
  },
  methods: {
    validator(v) {
      v = +v
      return v >= 10 && v <= 300
    },
    handleSave() {
      if (this.quantity < 10 || this.quantity > 300) {
        this.$toast({
          message: '请正确填写喂养量',
          icon: 'icon iconfont iconwarning'
        })
      } else {
        // 先上传图片
        const promiseArr = []
        if (this.$refs.remark.uploader.length) {
          // 需要上传图片
          this.$refs.remark.uploader.forEach(file => {
            promiseArr.push(uploadFile(file.file, 'sacc/dietRecord/milk', 'image'))
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
      }
    },
    handleCancel() {
      this.$router.go(-1)
    },
    uploadRecord() {
      addDietRecord({
        eatTime: `${this.today} ${this.$refs.time.showTime}:00`,
        milkType: this.typeValue,
        customerId: this.customerId,
        type: 'MILK',
        remarks: this.$refs.remark.$refs.text.value,
        addressArray: this.addressArray,
        milkQuantity: this.quantity
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

    .milkRecordWrap {
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
