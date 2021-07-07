<template>
  <div class="joinVip-wrap">
    <etm-main-body>
      <etm-layout-split>
        <div class="banner" @click="handleJoinVip">
          <img :src="bannerUrl" alt="招生活动">
        </div>
        <ul class="footer">
          <li class="flex-item">
            <img alt="" src="../../../assets/images/daycare/zshd-h5.png">
            <div class="title">H5模板<span> 4万+ </span>个</div>
            <div class="desc">功能强大，招生推广，助力转化</div>
          </li>
          <li class="flex-item">
            <img alt="" src="../../../assets/images/daycare/zshd-h2.png">
            <div class="title">海报模板<span> 17万+ </span>个</div>
            <div class="desc">精美模板，智能制作，简单省时</div>
          </li>
          <li class="flex-item">
            <img alt="" src="../../../assets/images/daycare/zshd-hd.png">
            <div class="title">互动模板<span> 17万+ </span>个</div>
            <div class="desc">模式多样，精准营销，高效拓客</div>
          </li>
          <li class="flex-item">
            <img alt="" src="../../../assets/images/daycare/zshd-font.png">
            <div class="title">正版字体<span> 500 </span>款</div>
            <div class="desc">字形丰富，推广传播，商用无忧</div>
          </li>
          <li class="flex-item">
            <img alt="" src="../../../assets/images/daycare/zshd-music.png">
            <div class="title">正版音乐<span> 2万+ </span>首</div>
            <div class="desc">模板配音，推广传播，提升效果</div>
          </li>
          <li class="flex-item">
            <img alt="" src="../../../assets/images/daycare/zshd-gif.png">
            <div class="title">创意动图<span> 5500 </span>个</div>
            <div class="desc">独家制作，炫酷多彩，增光添色</div>
          </li>
        </ul>
      </etm-layout-split>
    </etm-main-body>
    <etm-pop
      v-if="popVisible"
      title="立即开通"
      :visible="popVisible"
      :show-confirm-btn="false"
      :show-cancel-btn="false"
      pop="simple"
      @close="popVisible = false"
    >
      <div class="pop-content">
        <img src="../../../assets/images/daycare/zshd-tip.png" alt="招生活动">
        <div class="detail">
          <div class="tel">400-0313-400</div>
          <div class="desc">联系我们立即开通</div>
        </div>
      </div>
    </etm-pop>
  </div>

</template>

<script>
import { queryAdByPosition } from '@/api/base/dashboard'

/**
 * joinVip create by shangLu
 * createTime 2020/11/27 11:49
 */
export default {
  name: 'JoinVip',
  components: {},
  data() {
    return {
      bannerUrl: '',
      popVisible: false
    }
  },
  mounted() {
    this.init()
  },
  methods: {
    init() {
      queryAdByPosition({ position: 'DAYCARE_ENROLL_MINISITE_ADVERTISEMENT', displayScope: 'BPC_MANAGEMENT_SCOPE' }).then(res => {
        this.bannerUrl = res.data[0].imageUrl
      })
    },
    handleJoinVip() {
      this.popVisible = true
    }
  }
}
</script>
<style lang="scss" scoped>
.joinVip-wrap {
  .banner {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-bottom: 32px;

    img {
      width: 100%;
    }
  }

  .footer {
    display: flex;
    flex-direction: row;
    margin-bottom: 85px;
    justify-content: space-between;

    .flex-item {
      width: 228px;
      height: 228px;
      background: #FFFCF8;
      border-radius: 10px;
      display: flex;
      flex-direction: column;
      //justify-content: center;
      align-items: center;
      text-align: center;

      img {
        margin: 30px 0 16px;
      }

      div {
        margin-bottom: 12px;
      }

      .title {
        font-size: 18px;
        font-family: Microsoft YaHei;
        font-weight: 400;
        color: #555555;

        span {
          font-size: 30px;
        }
      }

      .desc {
        font-size: 14px;
        font-family: Microsoft YaHei;
        font-weight: 400;
        color: #999999;
      }
    }
  }
}
.pop-content{
  display: flex;
  justify-content: space-around;
  align-items: center;
  .detail{
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    .tel{
      height: 60px;
      font-size: 30px;
      font-weight: 400;
      color: #555555;
    }
    .desc{
      font-size: 14px;
      font-weight: 300;
      color: #555555;
    }
  }
}
</style>
