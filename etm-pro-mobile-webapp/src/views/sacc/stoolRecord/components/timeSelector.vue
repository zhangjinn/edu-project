<template>
  <div class="timeSelector">
    <div class="wrap" @click.stop="handlePopOpen">
      <p>便便时间</p>
      <p>
        {{ showTime }}
        <i class="iconfont iconright1" />
      </p>
    </div>
    <van-popup v-model="show" position="bottom" :close-on-click-overlay="false" get-container="#app">
      <van-datetime-picker
        v-model="currentTime"
        type="time"
        title="请选择时间"
        @confirm="handleTimeConfirm"
        @cancel="handleTimeCancel"
      />
    </van-popup>
  </div>
</template>

<script>
export default {
  name: 'TimeSelector',
  data() {
    return {
      show: false,
      currentTime: '12:00',
      showTime: '12:00'
    }
  },
  created() {
    const current = new Date()
    const h = ('0' + current.getHours()).slice(-2)
    const m = ('0' + current.getMinutes()).slice(-2)
    this.currentTime = this.showTime = `${h}:${m}`
  },
  methods: {
    handlePopOpen() {
      this.show = true
    },
    handleTimeConfirm() {
      this.showTime = this.currentTime
      this.show = false
    },
    handleTimeCancel() {
      this.show = false
    }
  }
}
</script>

<style lang="scss" scoped>
    @import '../../../../assets/style/mixin';

    .timeSelector {
        .wrap {
            display: flex;
            align-items: center;
            justify-content: space-between;
            margin: 0 12px;
            height: 55px;
            font-size: 15px;
            border-bottom: 1px solid $text-e;

            i {
                color: $text-b;
            }
        }
    }
</style>
