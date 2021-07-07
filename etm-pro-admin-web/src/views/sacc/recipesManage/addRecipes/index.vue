<template>
  <etm-form ref="ruleForm" :model="ruleForm" :rules="rules" type="dialog" class="demo-ruleForm">
    <template>
      <el-form-item :label="`${$t('recipeManagement.AddRecipeQueryLabelApplicationClass')}:`" prop="class">
        <el-select v-model="ruleForm.class" :multiple="ruleForm.multiple" :placeholder="$t('recipeManagement.AddRecipeApplicationClassPlaceHolderText')">
          <el-option
            v-for="(item,index) in classOptions"
            :key="index"
            :label="item.clazzName"
            :value="item.clazzId"
          />
        </el-select>
      </el-form-item>
    </template>
    <template>
      <el-form-item :label="`${$t('recipeManagement.AddRecipeQueryLabelRecipeDate')}:`" prop="data">
        <el-date-picker
          v-model="ruleForm.data"
          type="week"
          :format="$t('recipeManagement.weekDateFormat')"
          value-format="yyyy-MM-dd"
          :placeholder="$t('recipeManagement.AddRecipeRecipeDatePlaceHolderText')"
          :picker-options="{ 'firstDayOfWeek': 1 }"
        />
      </el-form-item>
    </template>
  </etm-form>

</template>

<script>
import { getClassList } from '@/api/recipes.js'

export default {
  name: 'Index',
  props: {
    formData: {
      type: Object,
      required: true
    }

  },
  data() {
    return {
      ruleForm: this.formData,
      classOptions: '',
      rules: {
        class: [
          { required: true, message: this.$t('recipeManagement.AddRecipeApplicationClassPlaceHolderText'), trigger: 'change' }
        ],
        data: [
          { required: true, message: this.$t('recipeManagement.AddRecipeRecipeDatePlaceHolderText'), trigger: 'change' }
        ]
      }
    }
  },
  created() {
    this.getClassListData()
  },
  methods: {
    getClassListData() {
      getClassList().then((res) => {
        const { data } = res
        this.classOptions = data
      })
    }
  }
}
</script>

<style scoped lang="scss">

</style>
