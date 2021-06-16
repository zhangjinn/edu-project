<template>
  <etm-form
    ref="form"
    :model="form"
    type="dialog"
  >
    <el-form-item
      label="餐次名称"
      prop="name"
      :rules="formValidate.nullValueRule(true,'请输入餐次名称')"
    >
      <el-input
        v-model="form.name"
        maxlength="10"
        placeholder="餐次名称不能为空"
      />
    </el-form-item>
  </etm-form>
</template>

<script>
import formValidate from '@/utils/rules'
export default {
  name: 'EditMealName',
  props: {
    name: {
      type: String,
      default: ''
    },
    itemId: {
      type: Number,
      default: null
    }
  },
  data () {
    return {
      formValidate

    }
  },
  created () {

  },
  methods: {

  }
}
</script>

<style scoped>

</style>
