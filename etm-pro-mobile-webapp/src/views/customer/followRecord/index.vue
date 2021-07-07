<template>
  <div class="followRecord">
    <van-tabs
      v-model="tabActive"
      type="none"
      background="transparent"
      title-active-color="#FF7B4A"
      title-inactive-color="#333333"
    >
      <van-tab title="跟进计划" name="0">
        <div class="plan" />
      </van-tab>
      <van-tab title="跟进记录" name="1">
        <div class="follow" />
      </van-tab>
      <van-tab title="到访记录" name="2" />
    </van-tabs>
  </div>
</template>

<script>
import { getFollowList } from '../../../service/customer/customer'
import { DateFormat } from '../../../js/rules'

export default {
  name: 'FollowRecord',
  data() {
    return {
      customerId: '',
      planList: [],
      followList: [],
      loading: false,
      finished: false,
      planPageNum: 0,
      pageNum: 0,
      pageSize: 10,
      tabActive: '',
      followLoading: false,
      followFinished: false,
      planLoading: false,
      planFinished: false
    }
  },
  created() {
    this.customerId = this.$route.query.id
    this.tabActive = this.$route.query.active
  },
  methods: {
    // 跟进列表
    getFollowData() {
      getFollowList().then((res) => {
        const followList = res.data.data.content
        followList.forEach((val) => {
          let html = ''
          html = '<div>' + val.content
          if (val.imageUrl) {
            val.imageUrl.split(',').forEach((value) => {
              html += '<img src="' + value + '"/>'
            })
          }
          html += '</div>'
          val.content = html
          val.followTime = DateFormat(val.followTime, 'yyyy-MM-dd hh:mm:ss')
          val.createTime = DateFormat(val.createTime, 'yyyy-MM-dd hh:mm:ss')
          this.followList.push(val)
        })
        this.followLoading = false
        if (followList.length < this.pageSize) {
          this.followFinished = true
        }
      })
    },
    toDetail(id) {
      this.$router.push({
        path: '/followRecordDetail',
        query: {
          id: id
        }
      })
    }
  }
}
</script>

<style lang="scss">

    .followRecord {
        .followBox {
            padding: 12px;
        }

        .planSteps {
            background-color: transparent;
        }

        .planTime {
            margin-bottom: 6px;
            font-size: 12px;
        }

        .van-tabs__wrap {
            width: 120px;

            .van-tab {
                font-weight: bold;
            }
        }

    }
</style>
