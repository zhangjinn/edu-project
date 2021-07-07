<template>
  <div class="addStepper-wrap">
    <van-cell>
      <van-row type="flex" justify="space-between">
        <van-col class="meal-name">学生餐</van-col>
        <van-col>
          <van-stepper
            v-model="stuMealsCount"
            :min="0"
            :max="99"
            integer
          />
        </van-col>
      </van-row>
      <van-row type="flex" justify="space-between">
        <van-col class="meal-name">特殊学员餐</van-col>
        <van-col>
          <van-stepper
            v-model="specialMealsCount"
            :min="0"
            :max="99"
            integer
          />
        </van-col>
      </van-row>
      <van-row type="flex" justify="space-between">
        <van-col class="meal-name">员工餐</van-col>
        <van-col>
          <van-stepper
            v-model="employeeMealsCount"
            :min="0"
            :max="99"
            integer
          />
        </van-col>
      </van-row>
    </van-cell>
    <van-cell>
      <van-row type="flex" justify="space-between">
        <van-col class="meal-name">报餐总数</van-col>
        <van-col>
          <van-stepper v-model="mealsTotal" :min="0" disable-input class="hiddenBtn" />
        </van-col>
      </van-row>
    </van-cell>
    <van-cell>
      <van-field v-model="remarks" class="remark" type="textarea" placeholder="请输入备注" :autosize="true" />
    </van-cell>

  </div>

</template>

<script>
/**
 * addStepper create by 油麦菜
 * createTime 2020/9/22 11:03
 */
import { Stepper } from 'vant'

export default {
  name: 'AddStepper',
  components: {
    'van-stepper': Stepper
  },
  filters: {},
  mixins: [],
  props: {},
  data() {
    return {
      stuMealsCount: 0,
      specialMealsCount: 0,
      employeeMealsCount: 0,
      remarks: '',
      total: 0
    }
  },
  computed: {
    mealsTotal: {
      get() {
        return Number.parseInt(this.stuMealsCount) + Number.parseInt(this.specialMealsCount) + Number.parseInt(this.employeeMealsCount)
      },
      set(val) {
        this.total = Number.parseInt(val)
      }
    }
  },
  watch: {},
  created() {
  },
  mounted() {
  },
  methods: {}
}
</script>
<style lang="scss" scoped>
.addStepper-wrap {
  padding: 0 10px;

  .van-cell {
    .van-row {
      height: 1.4rem;
      line-height: 1.4rem;

      .meal-name {
        color: #222222;
      }
    }

    &:after {
      border: none;
    }
  }

  .van-cell:nth-child(2) {
    .van-row {
      border-top: 1px solid #EEEEEE;
    }
  }

  .van-cell:last-child {
    padding-top: 0;

    .remark {
      padding-top: 10px;
      height: 108px;
      border: 1px solid #EEEEEE;
    }
  }

  /deep/ .van-stepper__minus, /deep/ .van-stepper__plus {
    color: #555555;
    background: #ffffff;
  }

  /deep/ .van-stepper__input {
    width: 40px;
    height: 20px;
    font-size: 14px;
    line-height: 20px;
  }

  // 解决iphone5下左右按钮错位问题：top: 1px
  /deep/ .van-stepper__minus::before, /deep/ .van-stepper__plus::before, /deep/ .van-stepper__minus::after, /deep/ .van-stepper__plus::after {
    top: 1px;
  }

  .hiddenBtn {
    /deep/ .van-stepper__plus, /deep/ .van-stepper__minus {
      opacity: 0;
    }

    /deep/ .van-stepper__input {
      background-color: #FFFFFF;
      color: $theme;
    }
  }
}
</style>
