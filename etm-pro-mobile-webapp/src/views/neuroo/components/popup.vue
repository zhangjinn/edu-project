<template>
  <div class="popup" :class="size">
    <div class="select" @click="openPicker">
      <span class="selectName" :class="showDatePicker || showMonthPicker ? 'mainColor' : ''">{{ title }}</span>
      <span v-if="showDatePicker || showMonthPicker" class="mainColor iconfont iconarrow-up" />
      <span v-else class="iconfont iconarrow-down" />
    </div>
    <!--    日期选择-->
    <van-popup
      v-model="showDatePicker"
      position="bottom"
      get-container="#app"
    >
      <van-datetime-picker
        v-model="date"
        type="date"
        :max-date="maxDate"
        @cancel="onCancel"
        @confirm="onConfirm"
      />
    </van-popup>
    <!--    月份选择-->
    <van-popup
      v-model="showMonthPicker"
      position="bottom"
      get-container="#app"
    >
      <van-datetime-picker
        v-model="month"
        type="year-month"
        :max-date="maxDate"
        :formatter="formatter"
        @cancel="onCancel"
        @confirm="onConfirm"
      />
    </van-popup>
  </div>
</template>

<script>

export default {
  name: 'Popup',
  props: {
    title: {
      type: String,
      default() {
        return null
      }
    },
    size: {
      type: String,
      default() {
        return null
      }
    },
    type: {
      type: String,
      default() {
        return null
      }
    }
  },
  data() {
    return {
      date: new Date(),
      maxDate: new Date(),
      showDatePicker: false,
      month: new Date(),
      showMonthPicker: false
    }
  },
  created() {
    if (this.type === 'date') {
      this.date = new Date(this.title.replace(/\./g, '/'))
    } else {
      if (this.title.indexOf('.') !== -1) {
        this.month = new Date(this.title.replace(/\./g, '/') + '/01')
      } else {
        const month = this.title.replace('年', '/').replace('月', '/') + '/01'
        this.month = new Date(month)
      }
    }
  },
  methods: {
    formatter(type, val) {
      if (type === 'year') {
        return `${val}年`
      } else if (type === 'month') {
        return `${val}月`
      }
      return val
    },
    openPicker() {
      if (this.type === 'date') {
        this.showDatePicker = true
      } else if (this.type === 'month') {
        this.showMonthPicker = true
      }
    },
    onCancel() {
      this.showDatePicker = false
      this.showMonthPicker = false
    },
    onConfirm(val) {
      this.onCancel()
      this.$emit('select', val)
    }
  }
}
</script>

<style lang="scss" scoped>
    .popup {
        &.big {
            .select {
                font-size: 16px;
            }
        }

        &.normal {
            .select {
                font-size: 15px;
            }
        }

        .select {
            display: inline-block;
            height: 45px;
            line-height: 45px;
            font-size: 14px;

            .selectName {
                display: inline-block;
                height: 18px;
                line-height: 18px;
            }

            .iconfont {
                margin-left: 6px;
                font-size: 12px;
                color: $text-5;
            }
        }
    }
</style>
