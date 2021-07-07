<template>
  <div class="detail-wrap">
    <setting-title>
      详情
    </setting-title>

    <div class="detailBody">
      <div class="detailHeader">
        <h3>{{ detail.notificationTitle }}</h3>
        <p>
          <span>{{ detail.createDateTime | parseTime }}</span>
          <span>来源：{{ detail.sourceName }}</span>
        </p>
      </div>
      <div class="article" v-html="detail.notificationContent" />
    </div>
  </div>
</template>

<script>
import settingTitle from '@/views/daycare/weekPlan/components/settingTitle'
import {
  queryNonticeSingeDetail
} from '@/service/daycare/notice'
export default {
  name: 'DetailWrap',
  components: {
    settingTitle
  },
  filters: {
    parseTime(value) {
      const time = new Date(value)
      return `${time.getFullYear()}-${time.getMonth() + 1 < 10 ? '0' + (time.getMonth() + 1) : time.getMonth() + 1}-${time.getDate() < 10 ? '0' + time.getDate() : time.getDate()}`
    }
  },
  data() {
    return {
      detail: {
        createDateTime: new Date().getTime(),
        notificationTitle: '',
        notificationContent: '',
        sourceName: ''
      }
    }
  },
  created() {
    queryNonticeSingeDetail(this.$route.query.id).then(res => {
      this.detail = res.data.data
    })
  }
}
</script>

<style scoped lang="scss">
.detail-wrap{
  min-height: 100vh;
  background: #fff;

  .detailBody{
    padding: 25px 26px 20px;
    text-align: left;

    .detailHeader{
      h3 {
        font-size: 16px;
        color: #222;
        margin-bottom: 13px;
      }

      p {
        font-size: 12px;
        display: flex;
        justify-content: space-between;
        color: #999;
      }
    }

    .article {
      margin-top: 34px;
      font-size: 14px;
      line-height: 28px;
      color: #222;
      img {
        max-width: 100% !important;
        height: auto !important;
      }
    }
  }

  ::v-deep {
    .settingTitle {
      color: #FFFFFF;
    }
  }
}
</style>
