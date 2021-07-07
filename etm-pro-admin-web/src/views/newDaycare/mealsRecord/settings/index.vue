<template>
  <div class="index-wrap">
    <etm-main-body>
      <etm-layout-split>
        <div class="wrapper">
          <etm-tabs v-model="tabsValue" tab-position="left" :show-toggle="false">
            <el-tab-pane name="rule" label="报餐规则">
              <item-template
                :data.sync="dragData"
                :no-slot="['color']"
                @timeChange="timeChange"
                @switchChange="switchChange"
              />
            </el-tab-pane>
          </etm-tabs>
        </div>
      </etm-layout-split>
    </etm-main-body>
  </div>

</template>

<script>
/**
 * index create by 油麦菜
 * createTime 2020/9/18 16:45
 */
import itemTemplate from './components/itemTemplate'
import { mealsOrderRule, updateMealsOrderRule } from '@/api/newDaycare/melasRecord'
export default {
  name: 'Index',
  components: {
    itemTemplate
  },
  filters: {},
  mixins: [],
  props: {},
  data() {
    return {
      tabsValue: 'rule',
      dragData: [
        {
          chooseTime: '',
          switchValue: true,
          timeDisable: true
        }
      ]
    }
  },
  computed: {},
  watch: {},
  created() {
  },
  mounted() {
    this.init()
  },
  methods: {
    init() {
      mealsOrderRule().then(res => {
        if (res.message === '成功') {
          this.dragData[0].chooseTime = res.data.editTime
          this.dragData[0].timeDisable = this.dragData[0].switchValue = res.data.enable
        }
      })
    },
    timeChange(index) {
      const obj = {
        enable: this.dragData[0].switchValue,
        editTime: this.dragData[index].chooseTime
      }
      updateMealsOrderRule(obj).then(res => {
        if (res.message === '成功') {
          this.$message({
            type: 'success',
            message: '更新报餐时间规则成功'
          })
        } else {
          this.$message({
            type: 'error',
            message: '更新报餐时间规则失败'
          })
        }
      })
    },
    switchChange(index) {
      this.dragData[index].timeDisable = this.dragData[index].switchValue
      const obj = {
        enable: this.dragData[0].switchValue,
        editTime: this.dragData[index].chooseTime
      }
      updateMealsOrderRule(obj).then(res => {
        if (res.message === '成功') {
          if (obj.enable) {
            this.$message({
              type: 'success',
              message: '已启用报餐规则'
            })
          } else {
            this.$message({
              type: 'error',
              message: '关闭报餐规则'
            })
          }
        }
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.index-wrap {
  .wrapper{
    padding-bottom: 16px;
  }
}
</style>
