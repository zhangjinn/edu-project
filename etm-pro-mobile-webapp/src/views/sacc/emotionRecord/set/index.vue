<template>
  <div class="setWrap">
    <item-card :item-data="itemData" />
    <div class="wrap">
      <time-selector ref="time" />
      <radio-list title="宝宝情绪" :list-data="emotion" :value.sync="emotionValue" />
      <div v-show="showOther" class="other">
        <h5>其他情绪</h5>
        <van-field v-model.trim="other" placeholder="请输入情绪状态" />
      </div>
    </div>
    <bottom-btns @save="handleSave" @cancel="handleCancel" />
  </div>
</template>

<script>
import itemCard from '../components/itemCard'
import timeSelector from '../components/timeSelector'
import radioList from '../components/radioList'
import bottomBtns from '../components/bottomBtns'
import { addEmotionRecord, getEnumByName } from '../../../../service/sacc/emotionRecord'
import transferDate from '../../../../js/date'

export default {
  components: {
    itemCard,
    timeSelector,
    radioList,
    bottomBtns
  },
  data() {
    return {
      itemData: {
        name: '栗子',
        age: '1岁三个月'
      },
      emotion: [],
      emotionValue: '',
      customerId: undefined,
      other: ''
    }
  },
  computed: {
    today() {
      const now = transferDate()
      return `${now.year}-${now.month}-${now.date}`
    },
    showOther() {
      return this.emotionValue === '其他'
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
    getEnumByName('MoodStatus').then(res => {
      const { data } = res.data
      data.forEach(v => {
        v.value = v.name
      })
      this.emotion = data
    })
  },
  methods: {
    handleSave() {
      if (this.other || (this.emotionValue !== '其他' && this.emotionValue !== '')) {
        let mood
        if (this.other) {
          mood = this.other
        } else {
          mood = this.emotionValue
        }
        addEmotionRecord({
          recordTime: `${this.today} ${this.$refs.time.showTime}:00`,
          mood,
          customerId: this.customerId
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
      } else {
        this.$toast({
          message: '请正确填写宝宝情绪',
          icon: 'icon iconfont iconwarning'
        })
      }
    },
    handleCancel() {
      this.$router.go(-1)
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
        }
    }
</style>
