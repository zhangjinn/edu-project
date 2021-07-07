<template>
  <div class="detail">
    <etm-layout-split :left-styles="{minWidth:'400px'}">
      <template slot="left">
        <memberInfo :content="memberData" />
      </template>
      <template slot="right">
        <memberDetail :content="memberData" :member-id="memberId" @toRefund="toRefund" @toSign="toSign" />
      </template>
    </etm-layout-split>
  </div>
</template>
<script>
import memberInfo from './info'
import memberDetail from './detail'
import { getGardenXq } from '@/api/sacc'

export default {
  components: {
    memberInfo,
    memberDetail
  },
  data() {
    return {
      memberData: null
    }
  },
  computed: {
    memberId() {
      return localStorage.getItem('memberManageV2_currentId')
    }
  },
  created() {
    getGardenXq(this.memberId).then(res => {
      const { data } = res
      this.memberData = data
      // eslint-disable-next-line handle-callback-err
    }).catch(err => {
      this.$message.error(this.$t('memberManage.getGardenXqFailTip'))
    })
  },
  methods: {
    toRefund() {
      this.$emit('switch', { target: 'refund', index: 1 })
    },
    toSign() {
      sessionStorage.setItem('invoiceCurd', 'add')
      this.$store.commit('billInfo/SET_MEMBER_ID', this.memberId)
      this.$emit('switch', { target: 'sign', index: 2 })
    }
  }
}
</script>

<style scoped lang="scss">
.detail {
  display: flex;
  height: 100%;
  @include bgc_bg_color();
}
/*@font-face {*/
/*  font-family: 'iconfont';  !* project id 1689282 *!*/
/*  src: url('//at.alicdn.com/t/font_1689282_1abuthswupe.eot');*/
/*  src: url('//at.alicdn.com/t/font_1689282_1abuthswupe.eot?#iefix') format('embedded-opentype'),*/
/*  url('//at.alicdn.com/t/font_1689282_1abuthswupe.woff2') format('woff2'),*/
/*  url('//at.alicdn.com/t/font_1689282_1abuthswupe.woff') format('woff'),*/
/*  url('//at.alicdn.com/t/font_1689282_1abuthswupe.ttf') format('truetype'),*/
/*  url('//at.alicdn.com/t/font_1689282_1abuthswupe.svg#iconfont') format('svg');*/
/*}*/
</style>
