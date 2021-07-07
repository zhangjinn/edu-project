<template>
  <div class="index-wrap">
    <van-cell>
      <van-row type="flex" justify="space-around">
        <van-col>
          <span ref="spanTimeRef" class="triangle_down" @click="clickBtn">{{ showTime(currentDate) }}</span>
          <!--      日期选择器模板-->
          <time-picker :show-popup="showPopup" :current-date-prop="currentDate" @closePopup="closePopup" @openPopup="openPopup" @currentDateChange="currentDateChange" />
        </van-col>
        <van-col>
          <van-dropdown-menu active-color="#10C2C4">
            <van-dropdown-item
              v-model="clazzValue"
              :options="clazzArray"
              get-container="#app"
              :title="clazzValue"
              @change="changeValue"
            />
          </van-dropdown-menu>
        </van-col>
      </van-row>
    </van-cell>
    <template v-if="Object.keys(addMealsInfo).length !== 0">
      <div>
        <!-- 班级信息模板 -->
        <clazz-info :clazz-info-data="clazzInfoData" />
        <!-- 添加餐数模板 -->
        <add-stepper ref="addStepperRef" />
      </div>
      <div class="stance-box">
        <van-cell class="bottom">
          <van-row type="flex" justify="space-around" gutter="10">
            <van-col>
              <div class="btn" @click="cancelBtn">
                <control-btn type="cancel" text="取消" />
              </div>
            </van-col>
            <van-col>
              <div class="btn" @click="submitBtn">
                <control-btn :disabled="disabled" type="primary" text="提交" />
              </div>
            </van-col>
          </van-row>
        </van-cell>
        <div class="stance"></div>
      </div>
    </template>
    <van-empty v-else description="该日期没有课程" />
  </div>

</template>

<script>
/**
 * index create by 油麦菜
 * createTime 2020/9/21 18:52
 */
import timePicker from './components/timePicker'
import clazzInfo from './components/clazzInfo'
import addStepper from './components/addStepper'
import controlBtn from '@/components/common/controlBtn'
import transferDate from '@/js/date'
import { courseSummaryTeacher, addMealsOrder, mealsOrderRule } from '@/service/daycare/meals'
import { Empty } from 'vant'
import { diffDay, getTomorrow } from '../utils'
export default {
  name: 'Index',
  components: {
    timePicker,
    clazzInfo,
    addStepper,
    controlBtn,
    'van-empty': Empty
  },
  filters: {},
  mixins: [],
  props: {},
  data() {
    return {
      showPopup: false,
      currentDate: getTomorrow(),
      clazzValue: '',
      isToggle: false,
      addMealsInfo: [],
      clazzArray: [],
      clazzInfoData: [],
      mealsRule: {},
      disabled: false
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
      const { year, month, date } = transferDate(this.currentDate)
      const obj = {
        date: `${year}-${month}-${date}`
      }
      courseSummaryTeacher(obj).then(res => {
        // 等待部署
        if (res.data.message === '成功') {
          this.clazzArray = []
          this.addMealsInfo = res.data.data
          this.addMealsInfo.forEach(item => {
            const txt = `${item.courseName}(${item.clazzName})`
            this.clazzArray.push({ text: txt, value: txt })
          })
          this.clazzValue = this.clazzArray[0] && this.clazzArray[0].value
          this.clazzValue = this.clazzValue || '课程(班级)'
          this.changeValue(this.clazzValue)
        }
      })
      mealsOrderRule().then(res => {
        if (res.data.message === '成功') {
          this.mealsRule = res.data.data
          this.disabled = this.successMeals(this.currentDate)
        }
      })
    },
    clickBtn() {
      this.showPopup = this.isToggle = true
    },
    currentDateChange(val) {
      // console.log(year, month)
      this.disabled = this.successMeals(val)
      // this.currentDate = new Date(year, Number.parseInt(month) - 1, date)
      this.currentDate = new Date(val)
      // console.log('选择日期')
      this.init()
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
    cancelBtn() {
      this.$dialog.confirm({
        message: '确认取消报餐吗？'
      }).then(() => {
        this.$router.push('/daycare_mealsRecord')
      }).catch(() => {})
    },
    submitBtn() {
      if (this.disabled) {
        return this.$toast.loading('超过报餐时间，不允许添加次日报餐')
      }
      const mealsInfo = this.$refs.addStepperRef.$data
      if (mealsInfo.total === 0) {
        return this.$toast.loading('报餐数量为0，不能提交')
      }
      this.$dialog.confirm({
        title: '确认提交报餐吗？',
        message: `学生餐：${mealsInfo.stuMealsCount}\n特殊学员餐：${mealsInfo.specialMealsCount}\n员工餐：${mealsInfo.employeeMealsCount}\n报餐总数：${mealsInfo.total}\n备注：${mealsInfo.remarks}`
      }).then(() => {
        // 请求网络
        // 获取当前选择的年月日
        const { year, month, date: day } = transferDate(this.currentDate.getTime())
        // 获取点击时候的时分秒
        const nowDate = new Date()
        const hour = nowDate.getHours()
        const minute = nowDate.getMinutes()
        const second = nowDate.getSeconds()
        const date = new Date(year, Number.parseInt(month) - 1, Number.parseInt(day), hour, minute, second)
        const obj = {
          // date: `${year}-${month}-${date} ${hours}-${miniutes}-${seconds}`,
          date: date.getTime(),
          courseManagementId: this.clazzInfoData[0].courseManagementId,
          childNormalMealAmount: mealsInfo.stuMealsCount,
          childSpecMealAmount: mealsInfo.specialMealsCount,
          employeeMealAmount: mealsInfo.employeeMealsCount,
          remark: mealsInfo.remarks
        }
        addMealsOrder(obj).then(res => {
          if (res.data.message === '成功') {
            this.$router.push('/daycare_mealsRecord')
          }
        })
      }).catch(() => {})
    },
    changeValue(val) {
      this.clazzInfoData = this.addMealsInfo.filter(item => {
        const txt = `${item.courseName}(${item.clazzName})`
        return val === txt
      })
    },
    showTime(time) {
      const { year, month, date } = transferDate(time)
      return `${year}.${month}.${date}`
    },
    successMeals(time) {
      if (!(this.mealsRule && this.mealsRule.enable)) {
        return false
      }
      const day = diffDay(time)
      // console.log(day)
      const date = new Date()
      const hour = date.getHours()
      const minutes = date.getMinutes()
      const ruleHour = Number.parseInt(this.mealsRule.editTime.split(':')[0])
      const ruleMinutes = Number.parseInt(this.mealsRule.editTime.split(':')[1])
      // 业务逻辑，当报餐的时间小于1天时（即今天），不让修改和撤销
      if (day < 1) {
        return true
      } else if (day === 1) {
        // 当报餐时间等于1天时（即明天），如果当前系统时间小于pc端报餐规则时间时，允许修改，否则不允许修改
        return hour > ruleHour || hour === ruleHour && minutes >= ruleMinutes
      } else {
        // 如果报餐时间大于1天（即后天，大后天...），不做任何限制
        return false
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.index-wrap {
  .van-cell {
    margin-bottom: 10px;
  }
  .triangle_down{
    position: relative;
    color: #222222;
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
  .van-dropdown-menu {
    height: 100%;
    /deep/ .van-dropdown-menu__title::after {
      width: 7px;
      height: 7px;
      border: 1px solid;
      border-left: 0;
      border-top: 0;
      opacity: 1;
      transform: rotate(45deg);
    }
    /deep/ .van-dropdown-menu__title--down::after {
      transform: rotate(-135deg);
    }
    /deep/ .van-dropdown-menu__bar {
      height: 100%;
      box-shadow: none;
      /deep/ .van-ellipsis {
        color: #222222;
      }
    }
  }
  [class*='van-hairline']::after {
    border: none;
  }
  .stance-box {
    .bottom {
      position: fixed;
      bottom: 50px;
      padding: 10px 10px;
      margin-bottom: 0;
      height: 64px;
      .van-col {
        flex: 1
      }
    }
    .stance {
      width: 100%;
      height: 64px;
      background: #FFFFFF;
    }
  }
}
</style>
