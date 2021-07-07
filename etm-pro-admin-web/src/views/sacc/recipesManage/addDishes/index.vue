<template>
  <etm-form ref="ruleForm" :model="ruleForm" :rules="rules" type="dialog" class="demo-ruleForm">
    <template v-if="!showLists">
      <el-form-item :label="`${$t('recipeManagement.queryLabelDishName')}:`" prop="name">
        <el-input v-model="ruleForm.name" :placeholder="$t('recipeManagement.queryDishNamePlaceHolderText')" />
      </el-form-item>
      <el-form-item :label="`${$t('recipeManagement.queryLabelIngredientsAndDosage')}:`" prop="desc">
        <el-input v-model="ruleForm.desc" type="textarea" rows="4" resize="none" :placeholder="$t('recipeManagement.queryIngredientsAndDosagePlaceHolderText')" />
      </el-form-item>
    </template>
    <template v-else>
      <el-form-item :label="`${$t('recipeManagement.queryLabelDishName')}:`">
        <el-select v-model="ruleForm.name" filterable :placeholder="$t('recipeManagement.queryDishNamePlaceHolderText')" @change="changeDishes">
          <el-option
            v-for="(item,index) in foodOptions"
            :key="index"
            :label="item.foodName"
            :value="item.foodId"
          />
        </el-select>
      </el-form-item>
      <el-form-item v-if="ruleForm.selectedDishes.length>0" :label="`${$t('recipeManagement.queryLabelAddedDishes')}:`">
        <ul>
          <li
            v-for="(item,index) in ruleForm.selectedDishes"
            :key="index"
          >
            <span>{{ item.foodName }}</span>
            <span class="icon" @click="deleteDishes(index)"><i class="el-icon-close" /></span>
          </li>
        </ul>
      </el-form-item>
    </template>
  </etm-form>
</template>

<script>
import { getSelectFoodSeList } from '@/api/recipes.js'

export default {
  name: 'Index',
  props: {
    formData: {
      type: Object,
      required: true
    },
    showLists: {
      type: Boolean,
      default: function() {
        return false
      }
    }
  },

  data() {
    return {
      ruleForm: this.formData,
      rules: {
        name: [
          { required: true, message: this.$t('recipeManagement.queryDishNamePlaceHolderText'), trigger: 'blur' }
        ]
      },
      foodOptions: []
    }
  },
  created() {
    if (this.showLists) {
      this.getSelectFoodSeListData()
    }
  },
  methods: {
    getSelectFoodSeListData() {
      getSelectFoodSeList().then((res) => {
        const { data } = res
        this.foodOptions = data
      })
    },
    changeDishes(foodId) {
      console.log(foodId)
      this.foodOptions.forEach((val, index) => {
        this.ruleForm.selectedDishes.forEach(() => {})
        if (val.foodId === foodId) {
          this.ruleForm.selectedDishes.push(val)
        }
      })
      this.ruleForm.name = ''
    },
    deleteDishes(index) {
      this.ruleForm.selectedDishes.splice(index, 1)
    }
  }
}
</script>

<style scoped lang="scss">
.demo-ruleForm{
  ul {
    padding-left: 0;
    margin: 0;
    width: 215px;
    padding-right: 15px;
    max-height: 240px;
    overflow: auto;
    li{
      list-style-type:none;
      display: flex;
      justify-content: space-between;
      align-items: center;
      .icon{
        cursor: pointer;
      }
    }
  }

}
</style>
