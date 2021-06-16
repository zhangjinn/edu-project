<template>
  <etm-form
    ref="form"
    :model="form"
    type="dialog"
  >
    <el-row :gutter="24">
      <el-col :span="colSpan">
        <el-form-item
          label="食材名称"
          prop="name"
          :rules="formValidate.nullValueRule(true,'请输入食材名称')"
        >
          <el-input
            v-model="form.name"
            maxlength="10"
            placeholder="请输入食材名称"
          />
        </el-form-item>
      </el-col>
      <el-col :span="colSpan">
        <el-form-item
          label="别名"
          prop="alias"
        >
          <el-input
            v-model="form.alias"
            maxlength="10"
            placeholder="请输入别名"
          />
        </el-form-item>
      </el-col>
      <el-col :span="colSpan">
        <el-form-item
          label="食材类型"
          prop="typeId"
          :rules="formValidate.nullValueRule(true,'请选择食材类型')"
        >
          <el-select
            v-model="form.typeId"
            placeholder="请选择"
          >
            <el-option
              v-for="item in ingredientsTypeOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
      </el-col>
    </el-row>

    <etm-title
      :show-line="false"
      border
    >
      主要膳食营养素含量（每百克可食用食材中营养素的含量）
    </etm-title>

    <el-row :gutter="24">
      <el-col :span="colSpan">
        <el-form-item
          label="能量"
          prop="energy"
          :rules="formValidate.isPositiveIntegerNumber(true)"
        >
          <div>
            <el-input-number
              v-model="form.energy"
              size="small"
              :min="0"
            />
            <span>千卡（Kcal）</span>
          </div>
        </el-form-item>
      </el-col>
      <el-col :span="colSpan">
        <el-form-item
          label="脂肪"
          prop="fat"
          :rules="formValidate.isPositiveIntegerNumber(true)"
        >
          <div>
            <el-input-number
              v-model="form.fat"
              size="small"
              :min="0"
            />
            <span>克（g）</span>
          </div>
        </el-form-item>
      </el-col>
      <el-col :span="colSpan">
        <el-form-item
          label="蛋白质"
          prop="protein"
          :rules="formValidate.isPositiveIntegerNumber(true)"
        >
          <div>
            <el-input-number
              v-model="form.protein"
              size="small"
              :min="0"
            />
            <span>克（g）</span>
          </div>
        </el-form-item>
      </el-col>
      <el-col :span="colSpan">
        <el-form-item label="膳食纤维">
          <div>
            <el-input-number
              v-model="form.dietaryFiber"
              size="small"
              :min="0"
            />
            <span>克（g）</span>
          </div>
        </el-form-item>
      </el-col>
      <el-col :span="colSpan">
        <el-form-item
          label="碳水化合物"
          prop="carbohydrate"
          :rules="formValidate.isPositiveIntegerNumber(true)"
        >
          <div>
            <el-input-number
              v-model="form.carbohydrate"
              size="small"
              :min="0"
            />
            <span>克（g）</span>
          </div>
        </el-form-item>
      </el-col>
    </el-row>

    <etm-title
      :show-line="false"
      border
    >
      主要维生素含量（每百克可食用食材中维生素的含量）
    </etm-title>

    <el-row :gutter="24">
      <el-col :span="colSpan">
        <el-form-item label="维生素A">
          <div>
            <el-input-number
              v-model="form.vitaminA"
              size="small"
              :min="0"
            />
            <span>微克（ug）</span>
          </div>
        </el-form-item>
      </el-col>
      <el-col :span="colSpan">
        <el-form-item label="胡萝卜素">
          <div>
            <el-input-number
              v-model="form.carotene"
              size="small"
              :min="0"
            />
            <span>微克（ug）</span>
          </div>
        </el-form-item>
      </el-col>
      <el-col :span="colSpan">
        <el-form-item label="维生素B1">
          <div>
            <el-input-number
              v-model="form.vitaminB1"
              size="small"
              :min="0"
            />
            <span>毫克（mg）</span>
          </div>
        </el-form-item>
      </el-col>
      <el-col :span="colSpan">
        <el-form-item label="维生素B2">
          <div>
            <el-input-number
              v-model="form.vitaminB2"
              size="small"
              :min="0"
            />
            <span>毫克（mg）</span>
          </div>
        </el-form-item>
      </el-col>
      <el-col :span="colSpan">
        <el-form-item label="维生素B3">
          <div>
            <el-input-number
              v-model="form.vitaminB3"
              size="small"
              :min="0"
            />
            <span>毫克（mg）</span>
          </div>
        </el-form-item>
      </el-col>
      <el-col :span="colSpan">
        <el-form-item label="维生素C">
          <div>
            <el-input-number
              v-model="form.vitaminC"
              size="small"
              :min="0"
            />
            <span>毫克（mg）</span>
          </div>
        </el-form-item>
      </el-col>
      <el-col :span="colSpan">
        <el-form-item label="维生素E">
          <div>
            <el-input-number
              v-model="form.vitaminE"
              size="small"
              :min="0"
            />
            <span>毫克（mg）</span>
          </div>
        </el-form-item>
      </el-col>
    </el-row>

    <etm-title
      :show-line="false"
      border
    >
      主要矿物质含量（每百克可食用食材中矿物质的含量）
    </etm-title>

    <el-row :gutter="24">
      <el-col :span="colSpan">
        <el-form-item label="钙">
          <div>
            <el-input-number
              v-model="form.calcium"
              size="small"
              :min="0"
            />
            <span>毫克（mg）</span>
          </div>
        </el-form-item>
      </el-col>
      <el-col :span="colSpan">
        <el-form-item label="磷">
          <div>
            <el-input-number
              v-model="form.phosphorus"
              size="small"
              :min="0"
            />
            <span>毫克（mg）</span>
          </div>
        </el-form-item>
      </el-col>
      <el-col :span="colSpan">
        <el-form-item label="钾">
          <div>
            <el-input-number
              v-model="form.potassium"
              size="small"
              :min="0"
            />
            <span>毫克（mg）</span>
          </div>
        </el-form-item>
      </el-col>
      <el-col :span="colSpan">
        <el-form-item label="钠">
          <div>
            <el-input-number
              v-model="form.sodium"
              size="small"
              :min="0"
            />
            <span>毫克（mg）</span>
          </div>
        </el-form-item>
      </el-col>
      <el-col :span="colSpan">
        <el-form-item label="镁">
          <div>
            <el-input-number
              v-model="form.magnesium"
              size="small"
              :min="0"
            />
            <span>毫克（mg）</span>
          </div>
        </el-form-item>
      </el-col>
      <el-col :span="colSpan">
        <el-form-item label="铁">
          <div>
            <el-input-number
              v-model="form.iron"
              size="small"
              :min="0"
            />
            <span>毫克（mg）</span>
          </div>
        </el-form-item>
      </el-col>
      <el-col :span="colSpan">
        <el-form-item label="锌">
          <div>
            <el-input-number
              v-model="form.zinc"
              size="small"
              :min="0"
            />
            <span>毫克（mg）</span>
          </div>
        </el-form-item>
      </el-col>
      <el-col :span="colSpan">
        <el-form-item label="硒">
          <div>
            <el-input-number
              v-model="form.selenium"
              size="small"
              :min="0"
            />
            <span>毫克（mg）</span>
          </div>
        </el-form-item>
      </el-col>
      <el-col :span="colSpan">
        <el-form-item label="铜">
          <div>
            <el-input-number
              v-model="form.copper"
              size="small"
              :min="0"
            />
            <span>毫克（mg）</span>
          </div>
        </el-form-item>
      </el-col>
      <el-col :span="colSpan">
        <el-form-item label="锰">
          <div>
            <el-input-number
              v-model="form.manganese"
              size="small"
              :min="0"
            />
            <span>毫克（mg）</span>
          </div>
        </el-form-item>
      </el-col>
      <el-col :span="colSpan">
        <el-form-item label="碘">
          <div>
            <el-input-number
              v-model="form.iodine"
              size="small"
              :min="0"
            />
            <span>毫克（mg）</span>
          </div>
        </el-form-item>
      </el-col>
    </el-row>
  </etm-form>
</template>

<script>
import formValidate from '@/utils/rules'
import baseMixin from '@/layout/mixin/baseMixin'

import { queryIngredientsDetail, queryIngredientsType } from '@/api/newDaycare/recipesGuardManage'

export default {
  name: 'Edit',
  mixins: [baseMixin],
  props: {
    type: {
      type: String,
      default: 'add',
      validator (val) {
        return ['add', 'edit'].includes(val)
      }
    },
    itemId: {
      type: Number,
      default: null
    }
  },
  data () {
    return {
      formValidate,
      form: {
        name: '',
        alias: '',
        typeId: '',
        energy: 0,
        fat: 0,
        protein: 0,
        dietaryFiber: 0,
        carbohydrate: 0,
        vitaminA: 0,
        carotene: 0,
        vitaminB1: 0,
        vitaminB2: 0,
        vitaminB3: 0,
        vitaminC: 0,
        vitaminE: 0,
        calcium: 0,
        phosphorus: 0,
        potassium: 0,
        sodium: 0,
        magnesium: 0,
        iron: 0,
        zinc: 0,
        selenium: 0,
        copper: 0,
        manganese: 0,
        iodine: 0
      },
      ingredientsTypeOptions: [],
      rules: {
        name: [
          { required: true, message: '不能为空', trigger: 'blur' },
          { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
        ]
      }

    }
  },
  computed: {
    // 计算属性的 getter
    colSpan: function () {
      if (this.type === 'edit') {
        return 24
      }
      return 12
    }
  },

  created () {
    this.getOptions()
    if (this.type === 'edit') {
      this.getDetails()
    }
  },
  methods: {
    // 菜肴类型
    getOptions () {
      queryIngredientsType().then(res => {
        if (res.data) {
          this.ingredientsTypeOptions = this.convertDataToOptions(res.data, 'name', 'id')
        }
      }).catch(err => {
        console.error(err)
      })
    },
    getDetails () {
      queryIngredientsDetail({
        foodIngredientsId: this.itemId
      }).then((res) => {
        const { data } = res

        this.form = {
          name: data.name,
          alias: data.alias,
          typeId: data.typeId,
          energy: data.energy,
          fat: data.fat,
          protein: data.protein,
          dietaryFiber: data.dietaryFiber,
          carbohydrate: data.carbohydrate,
          vitaminA: data.vitaminA,
          carotene: data.carotene,
          vitaminB1: data.vitaminB1,
          vitaminB2: data.vitaminB2,
          vitaminB3: data.vitaminB3,
          vitaminC: data.vitaminC,
          vitaminE: data.vitaminE,
          calcium: data.calcium,
          phosphorus: data.phosphorus,
          potassium: data.potassium,
          sodium: data.sodium,
          magnesium: data.magnesium,
          iron: data.iron,
          zinc: data.zinc,
          selenium: data.selenium,
          copper: data.copper,
          manganese: data.manganese,
          iodine: data.iodine
        }
      })
    }
  }
}
</script>

<style scoped lang="scss">
.tip {
  margin-bottom: 24px;
}
</style>
