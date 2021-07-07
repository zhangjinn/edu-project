<template>
  <etm-form ref="form" :model="form" type="dialog">
    <el-form-item
      prop="week"
      :rules="formValidate.nullValueRule(true,'请选择周次')"
    >
      <template slot="label">
        <label>
          将
          <!--          <el-tooltip-->
          <!--            class="labelTooltip"-->
          <!--            effect="dark"-->
          <!--            :content="'将所选周次内容复制到当前周'"-->
          <!--            placement="top-start"-->
          <!--          >-->
          <!--            <i class=" iconfont iconquestion-circle" />-->
          <!--          </el-tooltip>-->
        </label>
      </template>

      <el-select
        v-model="form.week"
        placeholder="请选择周次"
      >
        <el-option
          v-for="item in weekOptions"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        />
      </el-select>
    </el-form-item>
    <el-form-item>
      <template slot="label">
        <label>
          复制到
        </label>
      </template>
      <span>{{ weekName }}</span>
    </el-form-item>
  </etm-form>
</template>

<script>
import formValidate from '@/utils/rules'
import baseMixin from '@/layout/mixin/baseMixin'
import { getSemesterWeekSetting } from '@/api/guardcare/edu/scheduleManage'

export default {
  name: 'Copy',

  mixins: [baseMixin],
  props: {
    semesterId: {
      type: [Number, String],
      default: null
    },
    weekId: {
      type: [Number, String],
      default: null
    },
    weekName: {
      type: String,
      default: null
    }
  },
  data() {
    return {
      formValidate,
      form: {
        week: ''
      },
      weekOptions: []
    }
  },
  created() {
    if (this.semesterId) {
      this.getWeekData(this.semesterId)
    }
  },
  methods: {
    // 获取周次
    getWeekData(id) {
      const param = {
        courseTermId: id
      }
      getSemesterWeekSetting(param).then((res) => {
        if (res.data) {
          this.weekOptions = this.convertDataToOptions(res.data, 'name', 'id')
          this.weekOptions.map((val) => {
            if (val.value === this.weekId) {
              val.disabled = true
            }
          })
        }
      })
    }
  }
}
</script>

<style scoped>

</style>
