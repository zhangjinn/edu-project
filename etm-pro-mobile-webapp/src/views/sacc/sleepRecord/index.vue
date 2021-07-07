<template>
  <div class="sleepRecordWrap">
    <van-dropdown-menu>
      <van-dropdown-item v-model="clazzId" :options="classOption" get-container="#app" />
      <van-dropdown-item v-model="sleepingStateEnum" :options="stateOption" get-container="#app" />
    </van-dropdown-menu>
    <record-list v-show="listData.length" :list-data="listData" @refresh="refreshData" />
    <noContent v-show="!listData.length" type="list" message="没有数据噢" />
  </div>
</template>

<script>
import recordList from './components/recordList'
import noContent from '../../../components/common/noContent'
import { getSleepRecordList, getEnumByName } from '../../../service/sacc/sleepRecord'
import { getChildClass } from '../../../service/sacc/sacc'

export default {
  components: {
    recordList,
    noContent
  },
  data() {
    return {
      clazzId: '',
      sleepingStateEnum: '',
      classOption: [
        {
          text: '全部班级',
          value: ''
        }
      ],
      stateOption: [
        {
          text: '全部状态',
          value: ''
        }
      ],
      listData: []
    }
  },
  watch: {
    clazzId() {
      this.refreshData()
    },
    sleepingStateEnum() {
      this.refreshData()
    }
  },
  created() {
    this.refreshData()
    this.getClassList()
    getEnumByName('SleepingState').then(res => {
      const { data } = res.data
      data.forEach(v => {
        this.stateOption.push({
          text: v.name,
          value: v.value
        })
      })
    })
  },
  methods: {
    refreshData() {
      getSleepRecordList({ clazzId: this.clazzId, sleepingStateEnum: this.sleepingStateEnum }).then(res => {
        const { data } = res.data
        data.forEach(v => {
          v.name = v.customerName
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

    .sleepRecordWrap {
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
