<template>
  <div class="foodRecordWrap">
    <item-card :item-data="itemData" />
    <div class="wrap">
      <time-selector ref="time" />
      <radio-list title="喂养餐段" :list-data="meal" :value.sync="mealValue" />
      <div class="recipes">
        <h5>喂养食谱</h5>
        <ul v-show="mealList.length">
          <li v-for="(item, index) in mealList" :key="index">
            <div class="leftWrap">
              <i class="dot" />
            </div>
            <div class="rightWrap">
              <p>{{ item.foodName || '未知' }}</p>
              <span>食材组成：{{ item.description || '未知' }}</span>
            </div>
          </li>
        </ul>
        <noContent v-show="!mealList.length" type="list" message="没有数据噢" />
      </div>
      <radio-list title="食量" :list-data="quantity" :value.sync="quantityValue" />
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
import noContent from '../../../../components/common/noContent'
import { getEnumByName, getRecipeTimeQuantum, getRecipeItemFood, addDietRecord } from '../../../../service/sacc/dietRecord'
import { uploadFile } from '../../../../service/upload'
import transferDate from '../../../../js/date'

export default {
  components: {
    itemCard,
    timeSelector,
    radioList,
    remark,
    bottomBtns,
    noContent
  },
  data() {
    return {
      itemData: {},
      rawMeal: [],
      meal: [],
      mealValue: '',
      mealList: [],
      mealArr: [],
      quantity: [],
      quantityValue: '',
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
  watch: {
    mealValue(value) {
      if (value) {
        let recipeTimeQuantumId
        for (const v of this.rawMeal) {
          if (v.timeQuantumName === value) {
            recipeTimeQuantumId = v.recipeTimeQuantumId
            break
          }
        }
        getRecipeItemFood({ recipeTimeQuantumId, date: this.today }).then(res => {
          const { data } = res.data
          this.mealList = data
          this.mealArr = []
          data.forEach(v => {
            this.mealArr.push(`${v.foodName}:${v.description}`)
          })
        })
      } else {
        this.mealList = []
      }
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

    // 处理餐段信息
    this.getMealTime()
    this.getMealQuantity()
  },
  methods: {
    getMealTime() {
      getRecipeTimeQuantum({ customerId: this.customerId, date: this.today }).then(res => {
        const { data } = res.data
        this.rawMeal = data
        data.forEach(v => {
          this.meal.push({
            name: v.timeQuantumName,
            value: v.timeQuantumName
          })
        })
      })
    },
    getMealQuantity() {
      getEnumByName('EatQuantity').then(res => {
        const { data } = res.data
        data.forEach(v => {
          this.quantity.push({
            name: v.name,
            value: v.value
          })
        })
      })
    },
    handleSave() {
      if (!this.mealValue || !this.quantityValue) {
        this.$toast({
          message: '喂养餐段和食量不能为空',
          icon: 'icon iconfont iconwarning'
        })
      } else {
        // 先上传图片
        const promiseArr = []
        if (this.$refs.remark.uploader.length) {
          // 需要上传图片
          this.$refs.remark.uploader.forEach(file => {
            promiseArr.push(uploadFile(file.file, 'sacc/dietRecord/food', 'image'))
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
        eatQuantity: this.quantityValue,
        eatTimeQuantum: this.mealValue,
        customerId: this.customerId,
        eatRecipeList: this.mealArr,
        type: 'MEAL',
        addressArray: this.addressArray,
        remarks: this.$refs.remark.$refs.text.value
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

    .foodRecordWrap {
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
        }

        .recipes {
            text-align: left;
            padding: 0 12px;

            h5 {
                font-weight: normal;
                font-size: 15px;
                margin-top: 10px;
            }

            ul {
                li {
                    display: flex;

                    .leftWrap {
                        width: 14px;

                        .dot {
                            display: block;
                            width: 5px;
                            height: 5px;
                            background-color: $theme;
                            border-radius: 50%;
                            margin: 26px auto 0;
                        }
                    }

                    .rightWrap {
                        padding: 18px 0 15px;
                        border-bottom: 1px solid $text-e;

                        p {
                            font-size: 15px;
                        }

                        span {
                            font-size: 11px;
                            line-height: 19px;
                            color: $text-6;
                        }
                    }
                }
            }
        }
    }
</style>
