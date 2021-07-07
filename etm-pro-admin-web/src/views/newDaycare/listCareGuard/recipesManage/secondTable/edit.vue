<template>
  <etm-form ref="form" :model="form" :rules="rule" type="dialog">
    <el-form-item
      label="菜肴名称"
      prop="dishName"
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

    <el-form-item label="食材内容" required>
      <div class="ingredient-box">
        <el-row
          v-for="(item, index) in form.ingredientsList"
          :key="index"
          class="multipleForm"
          :gutter="8"
        >
          <el-col :span="colSpan">
            <el-form-item :prop="'ingredientsList.'+ index +'.ingredientsTypeId'" :rules="rule.ingredientsTypeId">
              <el-select
                v-model="item.ingredientsTypeId"
                filterable
                placeholder="请选择类型"
                @change="handleChange($event, index, 'change')"
              >
                <el-option v-for="(list, i) in ingredientsTypeOptions" :key="i" :label="list.label" :value="list.value" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="colSpan">
            <el-form-item :prop="'ingredientsList.'+ index +'.ingredientsId'" :rules="rule.ingredientsId">
              <el-select
                v-model="item.ingredientsId"
                filterable
                placeholder="请选择食材"
                @change="handleChangeIngredients($event, index, 'change')"
              >
                <el-option v-for="(list, i) in item.ingredientsOptions" :key="i" :label="list.label" :value="list.value" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="colSpan">
            <el-form-item :prop="'ingredientsList.'+ index +'.ingredientsWeight'" :rules="rule.ingredientsWeight">
              <el-input-number v-model="item.ingredientsWeight" :min="0" :max="10000" />
            </el-form-item>
          </el-col>
          <el-col :span="colSpan">
            <div class="energy-box">
              <span>克</span>
              <span class="energy">{{ item.ingredientsEnergy }}千卡</span>
            </div>
          </el-col>
          <div class="addIngredients">
            <etm-font-icon v-if="index === 0" name="plus" @click.native="handleAdd()" />
            <etm-font-icon v-else name="minus" @click.native="handleDelete(index)" />
          </div>
        </el-row>
      </div>
    </el-form-item>

    <el-form-item
      class="cover-box"
      label="菜肴图片"
      prop="coverSrcKey"
    >
      <etm-upload-img
        :resource-name="'newDaycare/recipesManage'"
        :preview-src-list="form.coverSrcLists"
        :preview-src-key="form.coverSrcKey"
        :limit-number="1"
        @getImgList="getCoverList"
      />
    </el-form-item>

    <el-form-item
      label="是否开启"
      prop="enable"
    >
      <el-radio-group v-model="form.enable">
        <el-radio label="1">是</el-radio>
        <el-radio label="2">否</el-radio>
      </el-radio-group>
    </el-form-item>
  </etm-form>
</template>

<script>
import formValidate from '@/utils/rules'
import { getImgUrlRelativePath } from '@/utils'
import baseMixin from '@/layout/mixin/baseMixin'
import etmUploadImg from '@/components/EtmUploadImg/index'

import { getFoodDetail, getFoodType, queryIngredients, queryIngredientsType } from '@/api/newDaycare/recipesGuardManage'

export default {
  name: 'Edit',
  components: {
    etmUploadImg
  },
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
        ingredients: '',
        ingredientsList: [
          {
            ingredientsTypeId: '',
            ingredientsId: '',
            ingredientsWeight: 0,
            ingredientsEnergy: 0,
            ingredientsOptions: []
          }
        ],
        coverSrcLists: [],
        coverSrcKey: [],
        enable: '1'
      },
      ingredientsTypeOptions: [],
      // ingredientsOptions: [],
      dishTypeOptions: [],
      rule: { // 表单验证规则
        dishName: [{ required: true, message: '菜肴名称不能为空', trigger: 'blur' }],
        dishType: [{ required: true, message: '菜肴类型不能为空', trigger: 'change' }],

        ingredientsTypeId: [{ required: true, message: '食材类型不能为空', trigger: 'change' }],
        ingredientsId: [{ required: true, message: '食材名称不能为空', trigger: 'change' }],
        ingredientsWeight: [{ required: true, message: '食材重量不能为空', trigger: 'change' }]
      }

    }
  },
  computed: {
    // 计算属性的 getter
    colSpan: function() {
      if (this.type === 'edit') {
        return 12
      }
      return 6
    }
  },
  created() {
    this.getFoodTypeData()
    this.getIngredientsTypeData()
    if (this.type === 'edit') {
      this.getFoodDetailData()
    }
  },
  methods: {
    getCoverList(val, key) {
      this.form.coverSrcLists = val
      this.form.coverSrcKey = key
    },

    // 菜肴类型
    getFoodTypeData() {
      getFoodType().then(res => {
        if (res.data) {
          this.dishTypeOptions = this.convertDataToOptions(res.data, 'foodTypeName', 'foodTypeId')
        }
      })
    },

    // 食材类型
    async getIngredientsTypeData() {
      await queryIngredientsType().then(res => {
        if (res.data) {
          this.ingredientsTypeOptions = this.convertDataToOptions(res.data, 'name', 'id')
        }
      })
      await this.handleChange()
    },

    // 根据食材类型获取食材
    async handleChange(id, index, type) {
      if (type) {
        this.form.ingredientsList[index].ingredientsId = ''
        this.form.ingredientsList[index].ingredientsEnergy = 0
      }

      const param = {
        typeId: id,
        paged: false
      }
      await queryIngredients(param).then((res) => {
        if (res.data) {
          if (this.form.ingredientsList[index]) {
            this.form.ingredientsList[index].ingredientsOptions = this.convertDataToOptions(res.data, 'name', 'id')
            if (!type) {
              const ingredientsId = this.form.ingredientsList[index].ingredientsId
              this.handleChangeIngredients(ingredientsId, index)
            }
          }
        }
      })
    },

    handleChangeIngredients(ingredientsId, index) {
      const energyObj = this.form.ingredientsList[index].ingredientsOptions.find(val => val.id === ingredientsId)
      this.form.ingredientsList[index].ingredientsEnergy = energyObj.energy
    },
    async getFoodDetailData() {
      const detail = await getFoodDetail({ foodId: this.itemId })
      const { data } = detail

      this.form = {
        dishName: data.foodName,
        dishType: data.typeId,
        ingredients: data.description,
        ingredientsList: [],
        coverSrcLists: [],
        coverSrcKey: [],
        enable: data.enable ? '1' : '2'
      }

      if (data.foodIngredientsList) {
        await data.foodIngredientsList.forEach((val, index) => {
          this.form.ingredientsList.push({
            ingredientsTypeId: val.ingredientsTypeId,
            ingredientsId: val.ingredientsId,
            ingredientsWeight: val.weight,
            ingredientsEnergy: 0,
            ingredientsOptions: []
          })
          if (val.ingredientsTypeId) {
            this.handleChange(val.ingredientsTypeId, index)
          }
        })
      }
      if (data.imageList) {
        data.imageList.forEach((val) => {
          this.form.coverSrcLists.push(val.url)
          this.form.coverSrcKey.push(getImgUrlRelativePath(val.url))
        })
      }
    },
    handleAdd() {
      let flag = false
      // 判断联系人信息是否完善
      this.form.ingredientsList.forEach(item => {
        if (!item.ingredientsTypeId || !item.ingredientsId) {
          flag = true
        }
      })
      if (flag) {
        this.$message.warning('请完善已有食材内容')
        return
      }

      this.form.ingredientsList.push(
        {
          ingredientsTypeId: '',
          ingredientsId: '',
          ingredientsWeight: 0,
          ingredientsEnergy: 0,
          ingredientsOptions: []
        }
      )
    },
    handleDelete(index) {
      this.form.ingredientsList.splice(index, 1)
    }
  }
}
</script>

<style scoped lang="scss">

.tip{
  margin-bottom: 24px;
}

.multipleForm {
  display: flex;
  flex-wrap: wrap;
  position: relative;

  & + .multipleForm{
    margin-top: 24px;
  }

  .energy-box{
    display: flex;
    justify-content: space-between;
  }
  //.weight{
  //  width: 200px !important;
  //  .energy{
  //    margin-left: 5px;
  //  }
  //}

  .addIngredients{
    position: absolute;
    bottom: 0px;
    right: -20px;
  }

  ::v-deep .el-col-12{
    &:nth-child(-n+2){
      margin-bottom: 24px;
    }
  }
}
</style>
