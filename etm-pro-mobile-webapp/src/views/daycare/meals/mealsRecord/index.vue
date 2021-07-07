<template>
  <div class="index-wrap">
    <van-cell class="van-cell-center">
      <!--      <span class="time" @click="clickBtn">{{ showTime(currentDate) }}</span>-->
      <span ref="spanTimeRef" class="triangle_down" @click="clickBtn">{{ showTime(currentDate) }}</span>
      <!-- 日期选择器模板 -->
      <time-picker :show-popup="showPopup" :current-date-prop="currentDate" @closePopup="closePopup" @openPopup="openPopup" @currentDateChange="currentDateChange" />
    </van-cell>
    <div class="meals-bottom">
      <!-- 报餐记录模板 -->
      <record :record-data="recordData" :meals-rule="mealsRule" @cancelMealsSuccess="cancelMealsSuccess" />
    </div>
    <!-- 添加报餐 -->
    <!--    <div class="add-meals" @click="addMeals">-->
    <!--      <van-icon name="plus" />-->
    <!--    </div>-->
    <!-- 可拖动的添加报餐按钮 -->
    <drag size="normal" />
  </div>
</template>

<script>
/**
 * index create by 油麦菜
 * createTime 2020/9/21 13:49
 */
import timePicker from './components/timePicker'
import record from './components/record'
import drag from './components/drag'
import transferDate from '@/js/date'
import { mealOrderMobile, mealsOrderRule } from '@/service/daycare/meals'
export default {
  name: 'MealsRecord',
  components: {
    timePicker,
    record,
    drag
  },
  filters: {},
  mixins: [],
  props: {},
  data() {
    return {
      showPopup: false,
      currentDate: new Date(),
      recordData: [],
      isToggle: false,
      mealsRule: {}
    }
  },
  computed: {
  },
  watch: {},
  created() {
  },
  mounted() {
    this.init()
  },
  methods: {
    init() {
      // console.log(this.currentDate)
      const { year, month, date } = transferDate(this.currentDate)
      const obj = {
        date: `${year}-${month}-${date}`
      }
      mealOrderMobile(obj).then(res => {
        // console.log(res.data)
        // 部署服务器
        if (res.data.message === '成功') {
          this.recordData = res.data.data.list
        }
        // mock
        // this.recordData = res.data.list
      })
      mealsOrderRule().then(res => {
        if (res.data.message === '成功') {
          this.mealsRule = res.data.data
        }
      })
    },
    clickBtn() {
      this.showPopup = this.isToggle = true
    },
    closePopup() {
      this.showPopup = this.isToggle = false
      this.toggleClass()
    },
    openPopup() {
      this.toggleClass()
    },
    // 点击时间时切换类
    toggleClass() {
      if (this.isToggle) {
        this.$refs.spanTimeRef.classList.remove('triangle_down')
        this.$refs.spanTimeRef.classList.add('triangle_up')
      } else {
        this.$refs.spanTimeRef.classList.remove('triangle_up')
        this.$refs.spanTimeRef.classList.add('triangle_down')
      }
    },
    currentDateChange({ year, month }) {
      // console.log(year, month)
      this.currentDate = new Date(year, Number.parseInt(month) - 1)
      this.init()
    },
    cancelMealsSuccess() {
      this.init()
    },
    showTime(time) {
      const { year, month } = transferDate(time)
      return `${year}年${month}月`
    }
  }
}
</script>
<style lang="scss" scoped>
.index-wrap {
  position: relative;
  .van-cell-center {
    margin-bottom: 10px;
    .van-cell__value--alone{
      text-align: center!important;
    }
  }
  .triangle_down{
    position: relative;
    &:after{
      position: absolute;
      top: 40%;
      right: -13px;
      content: '';
      width: 7px;
      height: 7px;
      border: 1px solid;
      border-left: 0;
      border-top: 0;
      transform: translateY(-50%) rotate(45deg);
    }
  }
  .triangle_up{
    position: relative;
    color: $theme;
    &:after{
      position: absolute;
      top: 60%;
      right: -13px;
      content: '';
      width: 7px;
      height: 7px;
      border: 1px solid;
      border-left: 0;
      border-top: 0;
      transform: translateY(-50%) rotate(-135deg);
    }
  }
  //.meals-bottom {
  //  padding: 0 10px;
  //  ul {
  //    li{
  //      margin-left: 20px;
  //      list-style: disc;
  //      color: #ff0000;
  //      span {
  //        color: #000000;
  //      }
  //    }
  //  }
  //}
  .add-meals{
    position: fixed;
    top: 80%;
    right: 20px;
    width: 60px;
    height: 60px;
    background: $theme;
    border-radius: 50%;
    //border: 1px solid #ff0000;
    .van-icon-plus{
      position: absolute;
      top: 50%;
      left: 50%;
      color: #FFFFFF;
      font-size: 20px;
      transform: translate(-50%, -50%);
    }
  }
}
</style>
