<template>
  <etm-form ref="form" :model="form" type="dialog">
    <el-form-item
      label="菜肴名称"
      prop="dishName"
      :rules="formValidate.nullValueRule(true,'请输入菜肴名称')"
    >
      <el-input
        v-model="form.dishName"
        maxlength="10"
        placeholder="请输入菜肴名称"
      />
    </el-form-item>

    <el-form-item
      label="菜肴类型"
      prop="dishType"
      :rules="formValidate.nullValueRule(true,'请选择菜肴类型')"
    >
      <el-select v-model="form.dishType" placeholder="请选择菜肴类型">
        <el-option
          v-for="item in dishTypeOptions"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        />
      </el-select>
    </el-form-item>

    <el-form-item
      label="食材用量"
      prop="ingredients"
    >
      <el-input
        v-model="form.ingredients"
        type="textarea"
        :rows="3"
        placeholder="请输入食材用量"
      />
    </el-form-item>

  </etm-form>
</template>

<script>
import formValidate from '@/utils/rules'
import baseMixin from '@/layout/mixin/baseMixin'

import { getFoodDetail, getFoodType } from '@/api/guardcare/careManage/recipesManage'

export default {
  name: 'Edit',
  mixins: [baseMixin],
  props: {
    type: {
      type: String,
      default: 'add',
      validator(val) {
        return ['add', 'edit'].includes(val)
      }
    },
    itemId: {
      type: Number,
      default: null
    }
  },
  data() {
    return {
      formValidate,
      form: {
        dishName: '',
        dishType: '',
        ingredients: ''
      },
      dishTypeOptions: []

    }
  },
  created() {
    this.getFoodTypeData()
    if (this.type === 'edit') {
      this.getFoodDetailData()
    }
  },
  methods: {
    // 菜肴类型
    getFoodTypeData() {
      getFoodType().then(res => {
        if (res.data) {
          this.dishTypeOptions = this.convertDataToOptions(res.data, 'foodTypeName', 'foodTypeId')
        }
      }).catch(err => {
        console.error(err)
      })
    },
    getFoodDetailData() {
      const id = this.itemId
      getFoodDetail(id).then((res) => {
        const { data } = res

        this.form = {
          dishName: data.foodName,
          dishType: data.typeId,
          ingredients: data.description
        }
      })
    }
  }
}
</script>

<style scoped lang="scss">
.tip{
  margin-bottom: 24px;
}
</style>
