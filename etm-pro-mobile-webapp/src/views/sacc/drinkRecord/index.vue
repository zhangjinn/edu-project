<template>
  <div class="drinkRecordWrap">
    <van-dropdown-menu>
      <van-dropdown-item v-model="clazzId" :options="classOption" get-container="#app" />
      <van-dropdown-item v-model="timeQuery" :options="timeOption" get-container="#app" />
    </van-dropdown-menu>
    <record-list v-show="listData.length" :list-data="listData" />
    <noContent v-show="!listData.length" type="list" message="没有数据噢" />
  </div>
</template>

<script>
import recordList from './components/recordList'
import noContent from '../../../components/common/noContent'
import { getChildClass } from '../../../service/sacc/sacc'
import { getDrinkRecordList } from '../../../service/sacc/drinkRecord'
import transferDate from '../../../js/date'

export default {
  components: {
    recordList,
    noContent
  },
  data() {
    return {
      clazzId: '',
      timeQuery: '',
      startTime: undefined,
      endTime: undefined,
      classOption: [
        { text: '全部班级', value: '' }
      ],
      timeOption: [
        { text: '全部间隔', value: '' },
        { text: '1小时以内', value: '0' },
        { text: '1小时以上', value: '1' }
      ],
      listData: []
    }
  },
  watch: {
    clazzId() {
      this.refreshData()
    },
    timeQuery() {
      this.refreshData()
    }
  },
  created() {
    this.refreshData()
    this.getClassList()
  },
  methods: {
    refreshData() {
      const now = transferDate()
      const one = transferDate(Date.now() - 1000 * 60 * 60)
      switch (this.timeQuery) {
        case '':
          this.startTime = undefined
          this.endTime = undefined
          break
        case '0':
          this.endTime = `${now.year}-${now.month}-${now.date} ${now.hours}:${now.miniutes}:${now.seconds}`
          this.startTime = `${one.year}-${one.month}-${one.date} ${one.hours}:${one.miniutes}:${one.seconds}`
          break
        case '1':
          this.endTime = `${one.year}-${one.month}-${one.date} ${one.hours}:${one.miniutes}:${one.seconds}`
          this.startTime = null
          break
      }
      getDrinkRecordList({
        clazzId: this.clazzId,
        startTime: this.startTime,
        endTime: this.endTime
      }).then(res => {
        const { data } = res.data
        data.forEach(v => {
          v.name = v.customerName
          if (v.drinkingTime) {
            const time = transferDate(v.drinkingTime)
            const gaptime = transferDate().gap(Date.now() - v.drinkingTime)
            v.last = `${time.hours}:${time.miniutes}`
            if (+gaptime.hours >= 24) {
              v.time = `超过一天`
            } else {
              v.time = `${+gaptime.hours}小时${+gaptime.miniutes}分`
            }
          } else {
            v.last = '-'
            v.time = '-'
          }
          v.detail = {
            type: v.drinkingRecordName,
            quantity: v.drinkingQuantity
          }
        })
        this.listData = data
      })
    },
    getClassList() {
      getChildClass().then(res => {
        const { data } = res.data
        data.forEach(v => {
          this.classOption.push({
            text: v.clazzName,
            value: v.clazzId
          })
        })
      })
    }
  }
}
</script>

<style lang="scss" scoped>
    @import '../../../assets/style/mixin';

    .drinkRecordWrap {
        width: 100vw;
        height: calc(100vh - 50px);
        background-color: $white;

        .van-dropdown-menu {
            height: 48px;
            border-bottom: 1px solid $text-e;

            & /deep/ .van-ellipsis {
                color: $text-2;
                font-size: 14px;
            }

            & /deep/ .van-dropdown-menu__title::after {
                top: 18%;
                right: -7px;
                content: '^';
                border: none;
                transform: rotate(180deg);
                color: $text-b;
            }

            & /deep/ .van-dropdown-menu__title--down::after {
                transform: rotate(0);
                margin-top: -1px;
            }
        }
    }
</style>
