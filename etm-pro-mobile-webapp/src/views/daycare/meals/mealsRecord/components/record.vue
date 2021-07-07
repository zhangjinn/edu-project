<template>
  <div class="record-wrap">
    <template v-if="Object.keys(recordData).length !== 0">
      <van-cell v-for="(item, index) in recordData" :key="index">
        <ul>
          <li>
            <span class="show-time">{{ showTime(item.date) }}</span>
            <span v-if="successMeals(item.date)" class="rule">成功订餐</span>
          </li>
        </ul>
        <span class="clazz-course">{{ item.courseName }}（{{ item.clazzName }}）</span>
        <van-row class="meals-info" type="flex" justify="space-around">
          <van-col v-if="item.childNormalMealAmount">
            <van-row>
              <van-col class="count">{{ item.childNormalMealAmount }}</van-col>
            </van-row>
            <van-row>
              <van-col class="meals-type">学生餐</van-col>
            </van-row>
          </van-col>
          <van-col v-if="item.employeeMealAmount">
            <van-row>
              <van-col class="count">{{ item.employeeMealAmount }}</van-col>
            </van-row>
            <van-row>
              <van-col class="meals-type">员工餐</van-col>
            </van-row>
          </van-col>
          <van-col v-if="item.childSpecMealAmount">
            <van-row>
              <van-col class="count">{{ item.childSpecMealAmount }}</van-col>
            </van-row>
            <van-row>
              <van-col class="meals-type">特殊学员餐</van-col>
            </van-row>
          </van-col>
        </van-row>
        <van-field v-if="item.remark" type="textarea" :autosize="true" :readonly="true" :value="item.remark" class="remarks" />
        <van-row v-if="!successMeals(item.date)" type="flex" justify="end" gutter="10">
          <van-col>
            <van-button size="small" @click="cancelMeals(item.mealOrderId)">撤销</van-button>
          </van-col>
          <van-col>
            <van-button size="small" color="#10C2C4" :plain="true" @click="fixMeals(item.mealOrderId)">修改</van-button>
          </van-col>
        </van-row>
      </van-cell>
    </template>
    <van-cell v-else>
      <van-empty description="当前没有报餐记录" />
    </van-cell>
  </div>

</template>

<script>
/**
 * record create by 油麦菜
 * createTime 2020/9/21 16:55
 */
import { Empty } from 'vant'
import { delMealOrder } from '@/service/daycare/meals'
import { diffDay } from '../../utils'

export default {
  name: 'Record',
  components: {
    'van-empty': Empty
  },
  filters: {},
  mixins: [],
  props: {
    recordData: {
      type: Array,
      default() {
        return []
      }
    },
    mealsRule: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  data() {
    return {
    }
  },
  computed: {
  },
  watch: {},
  created() {
  },
  mounted() {
  },
  methods: {
    cancelMeals(mealOrderId) {
      this.$dialog.confirm({
        message: '确认撤销该报餐记录吗？'
      }).then(() => {
        // 网络请求
        delMealOrder({
          mealOrderId
        }).then(res => {
          if (res.data.message === '成功') {
            this.$emit('cancelMealsSuccess')
          }
        })
      }).catch(() => {})
    },
    fixMeals(mealOrderId) {
      this.$router.push({
        name: 'fix_mealsRecord',
        params: {
          mealOrderId
        }
      })
    },
    parseTime(time) {
      // if (!arguments || arguments.length === 0) {
      //   return null
      // }
      let date
      if (typeof time === 'object') {
        date = time
      } else {
        if ((typeof time === 'string') && (/^[0-9]+$/.test(time))) {
          time = parseInt(time)
        }
        if ((typeof time === 'number') && (time.toString().length === 10)) {
          time = time * 1000
        }
        date = new Date(time)
      }
      return {
        y: date.getFullYear(),
        m: date.getMonth() + 1,
        d: date.getDate(),
        h: date.getHours(),
        i: date.getMinutes(),
        s: date.getSeconds(),
        a: ['日', '一', '二', '三', '四', '五', '六'][date.getDay()]
      }
    },
    showTime(time) {
      const date = this.parseTime(time)
      return `${date.m}月${date.d}日 星期${date.a}`
    },
    successMeals(time) {
      if (!(this.mealsRule && this.mealsRule.enable)) {
        return false
      }
      const day = diffDay(time)
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
.record-wrap {
  padding: 0 10px;
  ul {
    li{
      //margin-left: 20px;
      //list-style: disc;
      position: relative;
      color: #FFAD45;
      &:before{
        position: absolute;
        left: 0;
        top: 50%;
        content: '';
        width: 5px;
        height: 5px;
        background: $theme;
        border-radius: 50%;
        transform: translateY(-50%);
      }
      .show-time {
        margin-left: 10px;
        color: #222222;
        font-size: 16px;
      }
      .rule {
        position: absolute;
        right: 0;
        font-size: 12px;
        color: #999999;
      }
    }
  }
  .van-cell {
    margin-bottom: 10px;
    .clazz-course {
      font-size: 12px;
      color: #222222;
      margin-left: 7px;
    }
  }
  .meals-info{
    margin: 10px 0;
    .meals-type {
      font-size: 12px;
      color: #999999;
    }
    .count {
      width: 100%;
      text-align: center;
      font-size: 18px;
      color: $theme;
    }
  }
  .remarks {
    //background: #F4F4F4;
    /deep/.van-field__control {
      color: #555555!important;
    }
    background: #FAFAFA;
  }
}
</style>
