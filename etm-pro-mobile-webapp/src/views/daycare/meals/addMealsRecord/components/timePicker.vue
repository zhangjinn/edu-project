<template>
  <div class="timePicker-wrap">
    <van-popup v-model="show" position="bottom" :style="{ height: '50%' }" @close="closePopup" @open="openPopup">
      <van-datetime-picker
        v-model="currentDate"
        type="date"
        :min-date="minDate"
        @confirm="confirmTime"
        @cancel="cancel"
      />
    </van-popup>
  </div>

</template>

<script>
/**
 * timePicker create by 油麦菜
 * createTime 2020/9/21 14:34
 */
// import transferDate from '@/js/date'
import { getTomorrow } from '../../utils'

export default {
  name: 'TimePicker',
  components: {},
  filters: {},
  mixins: [],
  props: {
    showPopup: {
      type: Boolean,
      default() {
        return false
      }
    },
    currentDateProp: {
      type: Date,
      required: true
    }
  },
  data() {
    return {
      minDate: getTomorrow(),
      show: false,
      currentDate: ''
    }
  },
  computed: {
  },
  watch: {
    showPopup() {
      this.show = this.showPopup
    },
    currentDateProp() {
      this.currentDate = this.currentDateProp
    }
  },
  created() {
  },
  mounted() {
  },
  methods: {
    closePopup() {
      this.$emit('closePopup')
    },
    openPopup() {
      this.$emit('openPopup')
    },
    confirmTime(val) {
      // const { year, month } = transferDate(val)
      // console.log(year, month)
      this.$emit('currentDateChange', val)
      this.show = false
    },
    cancel() {
      this.$emit('closePopup')
    }
  }
}
</script>
<style lang="scss" scoped>
.timePicker-wrap {

}
</style>
