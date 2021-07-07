<template>
  <div class="checkPage">
    <div>
      <img src="../../../../assets/images/checkBg.png">
    </div>
    <div class="checkList">
      <div v-for="(item, index) in checkList" :key="index" class="checkItem">
        <div class="checkLeft">
          <span class="img">
            <img src="../../../../assets/images/checkIcon.png">
          </span>
          <span class="text">{{ item.checkSubjectName }}</span>
        </div>
        <div class="checkRight">
          <van-button class="btn" @click="toCheckPage(item)">去检查</van-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getCheckSubject } from '@/service/guardcare/check'

export default {
  name: 'Index',
  data() {
    return {
      checkList: []
    }
  },
  created() {
    this.getCheck()
  },
  methods: {
    getCheck() {
      getCheckSubject().then(res => {
        this.checkList = res.data.data
      })
    },
    toCheckPage(data) {
      this.$router.push({
        path: '/guardcare_checkPage',
        query: {
          subject: data.checkSubjectName
        }
      })
    }
  }
}

</script>

<style lang="scss" scoped>
.checkPage {
  padding: 12px;
  height: 100%;
  background-color: $white;

  img {
    display: block;
  }

  .checkList {
    .checkItem {
      position: relative;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 15px 0 15px 4px;
      &::after{
        display: inline-block;
        position: absolute;
        bottom: 0;
        left: 52px;
        content: '';
        width: calc(100% - 52px);
        height: 0.5px;
        background-color: $text-e;
      }
      .checkLeft{
        display: flex;
        align-items: center;
        .img {
          display: inline-block;
          width: 32px;
        }
        .text{
          margin-left: 16px;
          font-size: 15px;
        }
      }

      .btn {
        padding: 0;
        width: 60px;
        height: 24px;
        line-height: 22px;
        font-size: 12px;
        color: $white;
        background-color: $theme;
        border: 1px solid $theme;
        border-radius: 12px;
      }
    }
  }
}
</style>
