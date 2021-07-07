<template>
  <div class="emotionRecordWrap">
    <van-dropdown-menu>
      <van-dropdown-item v-model="clazzId" :options="classOption" get-container="#app" />
      <van-dropdown-item v-model="emotionQuery" :options="emotionOption" get-container="#app" />
    </van-dropdown-menu>
    <record-list v-show="listData.length" :list-data="listData" />
    <noContent v-show="!listData.length" type="list" message="没有数据噢" />
  </div>
</template>

<script>
import recordList from './components/recordList'
import noContent from '../../../components/common/noContent'
import { getChildClass } from '../../../service/sacc/sacc'
import { getEmotionRecordList, getEnumByName } from '../../../service/sacc/emotionRecord'

export default {
  components: {
    recordList,
    noContent
  },
  data() {
    return {
      clazzId: '',
      emotionQuery: '',
      classOption: [
        { text: '全部班级', value: '' }
      ],
      emotionOption: [
        { text: '全部', value: '' }
      ],
      listData: []
    }
  },
  watch: {
    clazzId() {
      this.refreshData()
    },
    emotionQuery() {
      this.refreshData()
    }
  },
  created() {
    this.refreshData()
    this.getClassList()
    this.getEmotionList()
  },
  methods: {
    refreshData() {
      const params = { clazzId: this.clazzId, mood: this.emotionQuery }
      !this.clazzId && delete params.clazzId
      !this.emotionQuery && delete params.mood
      getEmotionRecordList(params).then(res => {
        const { data } = res.data
        data.forEach(v => {
          v.name = v.customerName
          v.emotion = v.mood
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
    },
    getEmotionList() {
      getEnumByName('MoodStatus').then(res => {
        const { data } = res.data
        data.forEach(v => {
          this.emotionOption.push({
            text: v.name,
            value: v.name
          })
        })
      })
    }
  }
}
</script>

<style lang="scss" scoped>
    @import '../../../assets/style/mixin';

    .emotionRecordWrap {
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
