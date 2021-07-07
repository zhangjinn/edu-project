<template>
  <etm-form ref="form" :model="form" type="dialog">
    <el-form-item
      label="菜肴类型"
      prop="type"
      :rules="formValidate.nullValueRule(true,'请选择菜肴类型',['blur', 'change'])"
    >
      <el-select
        v-model="form.type"
        filterable
        placeholder="请选择菜肴类型"
        @change="getFoodData"
      >
        <el-option
          v-for="item in typeOptions"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        />
      </el-select>
    </el-form-item>

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
import { getFoodType, getFood } from '@/api/newDaycare/recipesGuardManage'

export default {
  name: 'ChooseDishes',
  mixins: [baseMixin],
  data() {
    return {
      formValidate,
      form: {
        type: '',
        dish: []
      },
      typeOptions: [],
      dishOptions: []
    }
  },
  created() {
    this.getFoodTypeData()
  },
  methods: {
    // 菜肴类型
    getFoodTypeData() {
      getFoodType().then(res => {
        if (res.data) {
          this.typeOptions = this.convertDataToOptions(res.data, 'foodTypeName', 'foodTypeId')
        }
      })
    },
    // 获取菜肴列表不分页
    getFoodData(id) {
      this.form.dish = []
      const param = {
        foodTypeId: id,
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
