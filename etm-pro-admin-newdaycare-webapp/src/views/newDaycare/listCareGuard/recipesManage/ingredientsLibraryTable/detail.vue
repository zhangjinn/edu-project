<template>
  <div class="detail">
    <ul>
      <li>
        <etm-field-label
          type="left"
          label="食材名称"
        >
          {{ baseInfo.name }}
        </etm-field-label>
      </li>
      <li>
        <etm-field-label
          type="left"
          label="别名"
        >
          {{ baseInfo.alias }}
        </etm-field-label>
      </li>
      <li>
        <etm-field-label
          type="left"
          label="食材类型"
        >
          {{ baseInfo.typeName }}
        </etm-field-label>
      </li>
    </ul>
    <etm-title
      :show-line="false"
      border
    >
      主要膳食营养素含量（每百克可食用食材中营养素的含量）
    </etm-title>
    <ul>
      <li>
        <etm-field-label
          type="left"
          label="能量"
        >
          {{ baseInfo.energy }} 千卡（Kcal)
        </etm-field-label>
      </li>
      <li>
        <etm-field-label
          type="left"
          label="脂肪"
        >
          {{ baseInfo.fat }} 克（g)
        </etm-field-label>
      </li>
      <li>
        <etm-field-label
          type="left"
          label="蛋白质"
        >
          {{ baseInfo.protein }} 克（g)
        </etm-field-label>
      </li>
      <li>
        <etm-field-label
          type="left"
          label="膳食纤维"
        >
          {{ baseInfo.dietaryFiber }} 克（g)
        </etm-field-label>
      </li>
      <li>
        <etm-field-label
          type="left"
          label="碳水化合物"
        >
          {{ baseInfo.carbohydrate }} 克（g)
        </etm-field-label>
      </li>
    </ul>
    <etm-title
      :show-line="false"
      border
    >
      主要维生素含量（每百克可食用食材中维生素的含量）
    </etm-title>
    <ul>
      <li>
        <etm-field-label
          type="left"
          label="维生素A"
        >
          {{ baseInfo.vitaminA }} 微克（ug)
        </etm-field-label>
      </li>
      <li>
        <etm-field-label
          type="left"
          label="维生素B1"
        >
          {{ baseInfo.vitaminB1 }} 毫克（mg)
        </etm-field-label>
      </li>
      <li>
        <etm-field-label
          type="left"
          label="维生素B2"
        >
          {{ baseInfo.vitaminB2 }} 毫克（mg)
        </etm-field-label>
      </li>
      <li>
        <etm-field-label
          type="left"
          label="维生素B3"
        >
          {{ baseInfo.vitaminB3 }} 毫克（mg)
        </etm-field-label>
      </li>
      <li>
        <etm-field-label
          type="left"
          label="维生素C"
        >
          {{ baseInfo.vitaminC }} 毫克（mg)
        </etm-field-label>
      </li>
      <li>
        <etm-field-label
          type="left"
          label="维生素E"
        >
          {{ baseInfo.vitaminE }} 毫克（mg)
        </etm-field-label>
      </li>
    </ul>
    <etm-title
      :show-line="false"
      border
    >
      主要矿物质含量（每百克可食用食材中矿物质的含量）
    </etm-title>
    <ul>
      <li>
        <etm-field-label
          type="left"
          label="钙"
        >
          {{ baseInfo.calcium }} 微克（ug)
        </etm-field-label>
      </li>
      <li>
        <etm-field-label
          type="left"
          label="磷"
        >
          {{ baseInfo.phosphorus }} 微克（ug)
        </etm-field-label>
      </li>
      <li>
        <etm-field-label
          type="left"
          label="钾"
        >
          {{ baseInfo.potassium }} 毫克（mg)
        </etm-field-label>
      </li>
      <li>
        <etm-field-label
          type="left"
          label="钠"
        >
          {{ baseInfo.sodium }} 毫克（mg)
        </etm-field-label>
      </li>
      <li>
        <etm-field-label
          type="left"
          label="镁"
        >
          {{ baseInfo.magnesium }} 毫克（mg)
        </etm-field-label>
      </li>
      <li>
        <etm-field-label
          type="left"
          label="铁"
        >
          {{ baseInfo.iron }} 毫克（mg)
        </etm-field-label>
      </li>
      <li>
        <etm-field-label
          type="left"
          label="锌"
        >
          {{ baseInfo.zinc }} 毫克（mg)
        </etm-field-label>
      </li>
      <li>
        <etm-field-label
          type="left"
          label="硒"
        >
          {{ baseInfo.selenium }} 毫克（mg)
        </etm-field-label>
      </li>
    </ul>
  </div>
</template>

<script>
import { queryIngredientsDetail } from '@/api/newDaycare/recipesGuardManage'

export default {
  name: 'Detail',
  props: {
    itemId: {
      type: Number,
      default: null
    }
  },
  data () {
    return {
      baseInfo: {
        name: '',
        alias: '',
        typeName: '',
        energy: 0,
        fat: 0,
        protein: 0,
        dietaryFiber: 0,
        carbohydrate: 0,
        vitaminA: 0,
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
        selenium: 0
      }
    }
  },
  created () {
    this.getDetails()
  },
  methods: {
    getDetails () {
      queryIngredientsDetail({
        foodIngredientsId: this.itemId
      }).then((res) => {
        const { data } = res

        this.baseInfo = {
          name: data.name,
          alias: data.alias || '--',
          typeId: data.typeId,
          typeName: data.typeName,
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
</style>
