<template>
  <div class="detail">
    <setting-title :no-setting="true">
      <span class="settingHeader">详情</span>
    </setting-title>
    <div :class="'childInfo' + ` ${state}`">
      <div class="left">
        <div class="wrapper">
          <img class="avatar" src="../../../assets/images/defaultAvatar.png" alt="defaultAvatar">
          <div class="info">
            <p>{{ matterDetail.childName || '-' }}</p>
            <span>{{ matterDetail.clazzName || '-' }}</span>
          </div>
        </div>
        <p v-if="state === 'confirm'" class="confirmer">确认人：{{ matterDetail.confirmBy || '-' }}</p>
      </div>
      <img v-if="state === 'wait'" class="state" src="../../../assets/images/approving.png" alt="approving">
      <img v-if="state === 'cancel'" class="state" src="../../../assets/images/canceled.png" alt="approving">
      <img v-if="state === 'confirm'" class="state" src="../../../assets/images/confirmed.png" alt="approving">
    </div>
    <div class="issueContent">
      <p>
        <span>交代事项</span>
        <span>{{ matterDetail.type | matterType }}</span>
      </p>
      <p>
        <span>交代人</span>
        <span>{{ matterDetail.createBy }}</span>
      </p>
      <p>
        <span>交代时间</span>
        <span>{{ transferDate(matterDetail.createTime).time }}</span>
      </p>
      <p>
        <span>交代内容</span>
        <span>{{ matterDetail.content }}</span>
      </p>
      <div class="images">
        <van-uploader
          v-model="matterDetail.imageList"
          multiple
          :deletable="false"
          :show-upload="false"
        />
      </div>
    </div>
    <div v-if="state === 'wait'" class="footBtn" @click.stop="handleConfirm">
      确认
    </div>
  </div>
</template>
<script>
import settingTitle from './components/settingTitle'
import {
  confirmMatterItem,
  queryMatterItem
} from '../../../service/guardcare/matter'
import { transferDate } from '../../../js/rules'
export default {
  components: {
    settingTitle
  },
  filters: {
    matterType(type) {
      const list = { 'MEDICINE': '吃药', 'DRINK': '喝水', 'CLOTHING': '穿衣', 'MOTION': '情绪', 'SPECIAL': '特殊', 'OTHER': '其他' }
      const arr = type.split(',')
      let result = ''
      arr.forEach(v => {
        result += list[v] + ' '
      })
      return result
    }
  },
  data() {
    return {
      state: 'wait', // cancel撤销 wait待确认 confirm 已确认
      leaveMessageId: this.$route.query.id,
      matterDetail: {}
    }
  },
  created() {
    this.getMatterDetail()
  },
  methods: {
    getMatterDetail() { // 获取事宜详情
      queryMatterItem({
        leaveMessageId: this.leaveMessageId
      }).then(res => {
        this.matterDetail = res.data.data
        this.state = { 'PENDING': 'wait', 'CONFIRMED': 'confirm', 'ROLLBACK': 'cancel' }[this.matterDetail.status]
      }).catch(err => {
        console.log(err)
      })
    },
    transferDate(date) {
      return transferDate(+date)
    },
    handleConfirm() {
      confirmMatterItem({
        leaveMessageId: this.leaveMessageId
      }).then(res => {
        this.getMatterDetail()
      }).catch(err => {
        console.log(err)
      })
    }
  }
}
</script>

<style scoped lang="scss">
.detail {
  .settingHeader {
    font-size: 14px;
    color: $white;
  }
  .childInfo {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 54px 0 15px;
    width: calc(100vw - 24px);
    height: 72px;
    margin: 12px auto;
    background-color: $white;
    border-radius: 4px;
    &.confirm {
      height: 103px;
    }
    .left {
      .wrapper {
        display: flex;
        align-items: center;
      }
      .avatar {
        display: block;
        width: 36px;
        height: 36px;
        border-radius: 50%;
        margin-right: 12px;
      }
      .info {
        text-align: left;
        p {
          font-size: 15px;
        }
        span {
          font-size: 12px;
          color: $text-9;
        }
      }
      p.confirmer {
        font-size: 14px;
        color: $theme;
        margin-top: 6px;
      }
    }
    .state {
      display: block;
      height: 55px;
      width: auto;
    }
  }

  .issueContent {
    width: calc(100vw - 24px);
    margin: 0 auto;
    padding: 20px 18px;
    background-color: $white;
    border-radius: 4px;
    text-align: left;
    p {
      display: flex;
      margin-bottom: 16px;
      span {
        font-size: 14px;
        &:first-child {
          display: inline-block;
          width: 4em;
          color: $text-9;
          margin-right: 12px;
        }
        &:last-child {
          display: inline-block;
          width: 240px;
        }
      }
    }
    ::v-deep .van-uploader {
      .van-image {
        width: 70px;
        height: 70px;
      }
    }
  }

  .footBtn {
    position: fixed;
    bottom: 8px;
    left: 12px;
    width: calc(100vw - 24px);
    height: 44px;
    line-height: 44px;
    text-align: center;
    border-radius: 4px;
    color: $white;
    font-size: 16px;
    background-color: $theme;
  }
}
</style>
