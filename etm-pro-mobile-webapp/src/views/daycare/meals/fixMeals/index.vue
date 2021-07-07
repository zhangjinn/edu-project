<template>
  <div class="index-wrap">
    <div>
      <!-- 班级信息模板 -->
      <clazz-info :clazz-info-data="clazzInfoData" />
      <!-- 添加餐数模板 -->
      <add-stepper ref="addStepperRef" :clazz-info-data="clazzInfoData" />
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
  </div>

</template>

<script>
/**
 * index create by 油麦菜
 * createTime 2020/9/22 14:02
 */
import clazzInfo from './components/clazzInfo'
import addStepper from './components/addStepper'
import controlBtn from '@/components/common/controlBtn'
import { updateMealOrder, queryFixMealOrder, mealsOrderRule } from '@/service/daycare/meals'
export default {
  name: 'Index',
  components: {
    clazzInfo,
    addStepper,
    controlBtn
  },
  filters: {},
  mixins: [],
  props: {},
  data() {
    return {
      mealOrderId: '',
      clazzInfoData: {},
      mealsRule: {}
    }
  },
  computed: {},
  watch: {},
  created() {
  },
  mounted() {
    this.mealOrderId = this.$route.params.mealOrderId
    this.init()
  },
  methods: {
    init() {
      queryFixMealOrder({
        mealOrderId: this.mealOrderId
      }).then(res => {
        // 等待服务器部署
        if (res.data.message === '成功') {
          this.clazzInfoData = res.data.data
        }
        // mock
        // this.clazzInfoData = res.data
      })
      mealsOrderRule().then(res => {
        if (res.data.message === '成功') {
          this.mealsRule = res.data.data
        }
      })
    },
    cancelBtn() {
      this.$dialog.confirm({
        message: '确认取消报餐吗？'
      }).then(() => {
        this.$router.push('/daycare_mealsRecord')
      }).catch(() => {})
    },
    submitBtn() {
      const mealsInfo = this.$refs.addStepperRef.$data
      if (mealsInfo.total === 0) {
        this.$toast('报餐数量不能为0')
        return ''
      }
      this.$dialog.confirm({
        title: '确认修改报餐吗？',
        message: `学生餐：${mealsInfo.stuMealsCount}\n特殊学员餐：${mealsInfo.specialMealsCount}\n员工餐：${mealsInfo.employeeMealsCount}\n报餐总数：${mealsInfo.total}\n备注：${mealsInfo.remarks}`
      }).then(() => {
        const obj = {
          mealOrderId: this.clazzInfoData.mealOrderId,
          date: this.clazzInfoData.date,
          orderPersonId: null,
          courseManagementId: this.clazzInfoData.courseManagementId,
          childNormalMealAmount: mealsInfo.stuMealsCount,
          childSpecMealAmount: mealsInfo.specialMealsCount,
          employeeMealAmount: mealsInfo.employeeMealsCount,
          enterpriseId: null,
          remark: mealsInfo.remarks
        }
        updateMealOrder(obj).then(res => {
          if (res.data.message === '成功') {
            this.$router.push('/daycare_mealsRecord')
          }
        })
      }).catch(() => {})
    }
  }
}
</script>
<style lang="scss" scoped>
.index-wrap {
  .van-cell {
    margin-bottom: 10px;
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
