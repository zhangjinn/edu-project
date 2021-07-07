<template>
  <etm-form ref="form" :model="form" type="dialog">
    <el-form-item
      prop="dish"
      :rules="formValidate.nullValueRule(true,'请选择菜肴',['blur', 'change'],'array')"
    >
      <template slot="label">
        <label>
          选择菜肴
          <el-tooltip
            class="labelTooltip"
            effect="dark"
            :content="'只能选择菜肴库里的菜肴'"
            placement="top-start"
          >
            <i class="iconfont iconquestion-circle" />
          </el-tooltip>
        </label>
      </template>

      <el-select
        v-model="form.dish"
        multiple
        filterable
        placeholder="请选择菜肴"
      >
        <el-option
          v-for="item in dishOptions"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        />
      </el-select>
    </el-form-item>
  </etm-form>
</template>

<script>
import formValidate from '@/utils/rules'
import baseMixin from '@/layout/mixin/baseMixin'
import { getFood } from '@/api/guardcare/careManage/recipesManage'

export default {
  name: 'Copy',
  mixins: [baseMixin],
  data() {
    return {
      formValidate,
      form: {
        dish: []
      },
      dishOptions: []
    }
  },
  created() {
    this.getFoodData()
  },
  methods: {

    // 获取菜肴列表不分页
    getFoodData() {
      const param = {
        paged: false
      }
      getFood(param).then((res) => {
        this.dishOptions = this.convertDataToOptions(res.data, 'foodName', 'foodId')
      })
    }
  }
}
</script>

<style scoped>

</style>
